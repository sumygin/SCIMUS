const express = require("express")
const session = require("express-session")
const helmet = require("helmet")
const mongoose = require("mongoose")
const path = require("path")
const MongoStore = require("connect-mongo").default
const {spawn} = require("child_process")

const config = require("./config")
const routes = require("./routes")
const {User, Notification, ServerData} = require("./database")

const day = 1000 * 60 * 60 * 24

const app = express()

app.disable("x-powered-by")
if (config.PRODUCTION) {
    app.set("trust proxy", 1) //render sits behind a proxy, needed for secure cookies + real ips
}

// LOADING MIDDLEWARE

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"], //katex + element styles
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'"],
            connectSrc: ["'self'"],
            mediaSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            ...(config.PRODUCTION ? {upgradeInsecureRequests: []} : {}),
        }
    },
    strictTransportSecurity: config.PRODUCTION,
}))

app.use("/resources", express.static(path.join(__dirname, "public", "resources"), {maxAge: "7d"}))
app.use("/vendor/katex", express.static(path.join(path.dirname(require.resolve("katex/package.json")), "dist"), {maxAge: "7d"}))
app.use(express.static(path.join(__dirname, "public"), {index: false}))

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: config.MONGO_URI}),
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: config.PRODUCTION,
        maxAge: day*30
    }
}))

app.use(express.json({limit: "50kb"}))

//anything that changes data has to come from our own pages
app.use((req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next()

    const origin = req.get("origin")
    if (origin) {
        let host
        try {
            host = new URL(origin).host
        } catch {
            host = ""
        }
        if (host != req.get("host")) {
            return res.status(403).json({error: "Request blocked"})
        }
    }

    //forms on other sites can't send json, our own fetch calls always do
    if (!(req.get("content-type") || "").startsWith("application/json")) {
        return res.status(415).json({error: "Request blocked"})
    }

    next()
})

routes(app)

app.use((req, res) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({error: "Not found"})
    }
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"))
})

app.use((err, req, res, next) => {
    if (res.headersSent) return next(err)

    if (err.status && err.status < 500) { //bad json, oversized bodies and our own validation errors
        return res.status(err.status).json({error: err.expose ? err.message : "Invalid request"})
    }

    console.error(err)
    res.status(500).json({error: "Something went wrong, please try again"})
})

//=============
//PYTHON SERVER
//=============

function startPythonServer() {
    const pyServer = spawn("uvicorn", ["model:app", "--port", "8000"], {cwd: __dirname})

    pyServer.stdout.on("data", data => console.log(`Python: ${data}`))
    pyServer.stderr.on("data", data => console.error(`Python: ${data}`))

    pyServer.on("error", err => {
        console.error("Could not start the model server (is uvicorn installed?)", err.message)
    })

    pyServer.on("close", code => {
        console.log(`Python server exited with code ${code}`)
    })

    process.on("exit", () => pyServer.kill()) //kill when server ends

    return pyServer
}

//===========
//DAILY RESET
//===========

async function resetDailyTotals() {
    const lastReset = (await ServerData.findOne({}))?.time
    const now = new Date()

    //only reset if the last one was on a different day
    if (!lastReset || lastReset.toDateString() != now.toDateString()) {
        await User.updateMany({}, {
            $set: {
                studied_today: 0,
                completed_today: 0,
                likes_today: 0,
                created_today: 0
            }
        })

        //delete all viewed notifications that are older than a year
        const yearAgo = new Date()
        yearAgo.setFullYear(yearAgo.getFullYear()-1)

        await Notification.deleteMany({
            created_at: {$lt: yearAgo}, viewed: true
        })

        await ServerData.updateOne({}, {$set: {time: now}}, {upsert: true})

        console.log("Daily totals reset", now)
    }
}

//calculate ms to midnight
function msToMidnight() {
    const now = new Date()
    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, //tomorrow
        0, 0, 5, 0         //just after midnight
    )
    return nextMidnight - now
}

function scheduleReset() {
    setTimeout(async () => {
        try {
            await resetDailyTotals()
        } catch (err) {
            console.error(err)
        }
        scheduleReset()
    }, msToMidnight())
}

async function loadServer() {
    await mongoose.connect(config.MONGO_URI)
    console.log("mongodb connected")

    if (config.START_MODEL) {
        startPythonServer()
    }

    await resetDailyTotals()
    scheduleReset()

    const server = app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`)
    })

    for (const signal of ["SIGINT", "SIGTERM"]) {
        process.on(signal, () => {
            server.close(async () => {
                await mongoose.disconnect()
                process.exit(0)
            })
            setTimeout(() => process.exit(0), 5000).unref() //don't hang on open connections
        })
    }
}

loadServer().catch(err => {
    console.error(err)
    process.exit(1)
})
