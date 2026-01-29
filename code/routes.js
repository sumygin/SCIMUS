const express = require("express")
const session = require("express-session")
const path = require("path")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const MongoStore = require('connect-mongo').default

const validator = require("validator")
const leoProfanity = require("leo-profanity")
const compromise = require("compromise")

const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"
const day = 1000 * 60 * 60 * 24


module.exports = function(app) {
    

    const {User, Subject, Topic, School, Country, Question, Collection, QuestionCollection, 
    Like, Solve, Watch, Comment, Notification} = require("./database")

    mongoose.connect(hostUrl)
        .then(() => {
            console.log("mongodb connected")})
        .catch(err => console.error(err))

    // LOADING MIDDLEWARE

    app.use(session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: hostUrl }),
        cookie: { 
            httpOnly: true, 
            maxAge: day*30
        }
    }))

    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

    app.use(express.static(path.join(__dirname, "public")))

    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: "incorrect username" })

            const match = bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: "incorrect password" })

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next()
        res.redirect("/login")
    }

    //ROUTES

    app.get("/", (req, res) => {
        //check if logged in first; redirect to home, otherwise welcome page
        res.sendFile(path.join(__dirname, "public", "welcome.html"))
    })

    app.get("/home", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "home.html"))
    })
    
    app.get("/login", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "login.html"))
    })

    app.get("/settings", (req, res) => {
        //check if logged in first; redirect to login if not
        res.sendFile(path.join(__dirname, "public", "settings.html"))
    })

    app.get("/preferences", (req, res) => {
        //check if logged in first; redirect to login if not
        res.sendFile(path.join(__dirname, "public", "preferences.html"))
    })

    app.get("/inbox", (req, res) => {
        //check if logged in first; redirect to login if not
        res.sendFile(path.join(__dirname, "public", "inbox.html"))
    })
    
    app.get("/search", (req, res) => {
        //return filters that are to be applied as well
        //if filters are invalid, return error page
        res.sendFile(path.join(__dirname, "public", "search.html"))
    })
    
    app.get("/question", (req, res) => {
        //process id in link as well
        //if the question is private, and belongs to user, open in create.html
        //if question is not accesible or doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "question.html"))
    })

    app.get("/collection", (req, res) => {
        //process id in link as well
        //if collection is private, check that it belongs to user
        //if collection is not accesible or doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "collection.html"))
    })

    app.get("/profile", (req, res) => {
        //process id in link as well
        //if profile doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "profile.html"))
    })

    app.get("/create", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "create.html"))
    })

    app.get("/leaderboards", (req, res) => {
        //process + return leaderboard filters in link as well
        res.sendFile(path.join(__dirname, "public", "leaderboard.html"))
    })

    app.get("/api/subjects/names", async (req, res) => {
        const subjects = await Subject.find({}).sort({ subject_id: 1 }).lean();
        res.json(subjects)
    })

    //POST REQUESTS

    app.post("/register", async (req, res) => {
        console.log(req.body)


        const { tag, password } = req.body;
        const hash = await bcrypt.hash(password, 10)
        try {
            const user = new User({ user_tag:tag, password: hash })
            await user.save();
            res.redirect("/login")
        } catch (err) {
            res.send("Error: Username already exists")
        }
    })

    app.post("/login",
        passport.authenticate("local", { failureRedirect: "/login", successRedirect: "/dashboard" })
    )

    // Protected dashboard
    app.get("/dashboard", isLoggedIn, (req, res) => {
        res.send(`<h2>Dashboard</h2><p>Welcome, ${req.user.username}!</p><a href="/logout">Logout</a>`)
    })

    // Logout
    app.get("/logout", (req, res) => {
        req.logout(() => {
            res.redirect("/")
        });
    })

    // Auth middleware
    


    //delete all notifications that are older than 60 days
}