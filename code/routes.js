const express = require("express")
const session = require("express-session")
const path = require("path")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const { publicDecrypt } = require("crypto");
const MongoStore = require('connect-mongo').default
const fs = require("fs").promises
const validator = require("validator")
const leo = require("leo-profanity")

const hostUrl = "mongodb://127.0.0.1:27017/SCIMUS"
const day = 1000 * 60 * 60 * 24

function passwordCheck(pw) {
    const hasNumber = /[0-9]/.test(pw)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|~]/.test(pw)
    return hasNumber && hasSpecial
}

async function idGenerator(obj) {
    let id
    let exists
    do {
        id = Math.floor(Math.random()*100000000) //8-digit id
        exists = await obj.exists({school_id:id})
    } while (exists)
    return id
}

const countriesList = 

module.exports = function(app) {
    const {User, Subject, Topic, School, Question, Collection, QuestionCollection, 
    Like, Solve, Watch, Comment, Notification,
    SubjectUser} = require("./database")

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

    passport.use(new LocalStrategy(
        {
            usernameField: 'tag_login',     
            passwordField: 'password_login' 
        },
        async (tag_login, password_login, done) => {
            try {

                const user = await User.findOne({ user_tag: tag_login })
                if (!user) {
                    return done(null, false, { message: "Incorrect usertag" })
                }

                const match = bcrypt.compare(password_login, user.password_hash)
                if (!match) {
                    return done(null, false, { message: "Incorrect password" })
                }

                return done(null, user) // success
                
            } catch (err) {
                return done(err)
            }
        }
    ))

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

    app.get("/api/subjects/names/:stage", async (req, res) => {
        try {
            const stage = Number(req.params.stage)
            const subjects = await Subject.find({study_stage: stage}, {name:1, _id:0, exam_board:1})
            const names  = subjects.map(s => s.exam_board + " " + s.name)
            res.json(names)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/schools/names", async (req, res) => {
        try {
            const schools = await School.find({}, {name:1, _id:0})
            const names = schools.map(s => s.name)
            res.json(names)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    })

    //POST REQUESTS

    app.post("/register", async (req, res) => {

        //parsing data

        const {name, password, password_1, school, stage, subjects, tag, username, country, email} = req.body
        let data = {name, password, password_1, school, stage, subjects, tag, username, country, email}

        for (const key in data) { //remove whitespaces
            if (typeof data[key] == "string") {
                data[key] = data[key].trim()
            }
        }

        try{
            //validation

            for (let field of Object.values(data)) { //check empty and profanities
                field = field.trim()
                if (field == "") return res.status(400).json({ error: "Fields cannot be empty!"})

                const urls = field.match(/https?:\/\/[^\s]+/g) || [] //check for links
                for (const url of urls) { //go through flagged urls and check them 
                    if (validator.isURL(url)) {
                        return res.status(400).json({ error: "No links allowed!"})
                    }
                }

                if (leo.check(field)) { //check for profanities
                    return res.status(400).json({error: "Profanities are not allowed"})
                }
            }

            const countries = require("./public/resources/countries.json")
            data.tag = data.tag.toLowerCase()

            if (!validator.isEmail(data.email)) { 
                return res.status(400).json({error: "This is not an email" })
            }
            else if (data.password !== data.password_1) {
                return res.status(400).json({error: "Passwords do not match"})
            }
            else if (data.password.length < 8) {
                return res.status(400).json({error: "Password must be at least 8 characters"})
            }
            else if (data.name.length < 3) {
                return res.status(400).json({error: "Name is too short"})
            }
            else if (data.username.length < 3) {
                return res.status(400).json({error: "Username is too short"})
            }
            else if (data.tag.length < 3){
                return res.status(400).json({error: "Tag is too short"})
            }
            else if (!passwordCheck(data.password)) {
                return res.status(400).json({error: "Password must have at least one special character and number"})
            }   
            else if (!countries.includes(data.country)) {
                return res.status(400).json({error: "Country is invalid"})
            }
            else if (!["0", "1", "2"].includes(data.stage)) {
                return res.status(400).json({error: "Please select a study stage"})
            }
            else if (data.subjects.length < 5) {
                return res.status(400).json({error: "You must select at least one subject"})
            }
            else if (data.tag.includes(" ")) {
                return res.status(400).json({error: "Tag cannot contain spaces"})
            }

            else if (await User.exists({user_tag: data.tag})) {
                return res.status(409).json({ error: "User tag is taken!" })
            }
            else {
                //subject check
                let sbjs = data.subjects.split(" ×")
                sbjs.pop()
                console.log(sbjs)

                for (const sbj of sbjs) {
                    const subjectID = await Subject.findOne({full_name:sbj, study_stage:data.stage}, {subject_id:1})
                    if (!subjectID) {
                        return res.status(409).json({ error: "Subject does not exist!" })
                    }
                    await SubjectUser.insertMany([{
                        user_tag: data.tag,
                        subject_id:subjectID.subject_id
                    }])
                }
                
                //school check/creation

                const skl = await School.findOne({name:data.school}, {school_id:1}) //return school id of matching school
                let newSklID
                if (!skl) { //if school doesnt exist, add a new one
                    newSklID = await idGenerator(School)
                    await School.insertOne({
                        school_id: newSklID,
                        name:data.school
                    })
                }
                else {
                    newSklID = skl.school_id
                }

                const hash = await bcrypt.hash(data.password, 10)
                const user = new User({
                    user_tag:data.tag, 
                    password_hash: hash,
                    school_id:newSklID,
                    country:data.country,
                    study_stage:data.stage,
                    username:data.username,
                    full_name:data.full_name,
                    email:data.email,
                    
                    average_like_rating:0,
                    created_total:0,
                    created_today:0,
                    studied_total:0,
                    studied_today:0,
                    completed_total:0,
                    completed_today:0,
                })

                await user.save()
                return res.status(200).json({success:true})
            }
        } catch(err) {
            console.error(err)
            return res.status(500).json({error:"Server error"}); 
        }
    })

    app.post("/login", (req, res, next) => {
        console.log(req.body)
        passport.authenticate("local", (err, user, info) => {
            console.log(err, user, info)
            if (err) {
                return res.status(500).json({ error: "Server error" })
            }

            if (!user) {
                return res.status(401).json({error: info?.message || "Invalid credentials"})
            }

            req.logIn(user, err => {
                if (err){
                    return res.status(500).json({ error: "Login failed" })
                }
                return res.json({ success: true })
                })
        })(req, res, next)
    })


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