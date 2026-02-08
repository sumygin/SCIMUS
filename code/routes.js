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

function validate(field, res) {
    if (field == "") {
        res.status(400).json({ error: "Fields cannot be empty!"})
        return true
    }

    const urls = field.match(/https?:\/\/[^\s]+/g) || [] //check for links
    for (const url of urls) { //go through flagged urls and check them 
        if (validator.isURL(url)) {
            res.status(400).json({ error: "No links allowed!"})
            return true
        }
    }

    if (leo.check(field)) { //check for profanities
        res.status(400).json({error: "Profanities are not allowed"})
        return true
    }
}

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

                const match = await bcrypt.compare(password_login, user.password_hash)

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
        if (req.isAuthenticated()) {
            return res.redirect("/home")
        }

        res.sendFile(path.join(__dirname, "public", "welcome.html"))
    })

    app.get("/home", isLoggedIn, (req, res) => {
        res.sendFile(path.join(__dirname, "public", "home.html"))
    })
    
    app.get("/login", (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect("/home")
        }

        res.sendFile(path.join(__dirname, "public", "login.html"))
    })

    app.get("/settings", isLoggedIn, (req, res) => {
        //check if logged in first; redirect to login if not
        res.sendFile(path.join(__dirname, "public", "settings.html"))
    })

    app.get("/preferences", isLoggedIn, (req, res) => {
        //check if logged in first; redirect to login if not
        res.sendFile(path.join(__dirname, "public", "preferences.html"))
    })

    app.get("/inbox", isLoggedIn, (req, res) => {
        //check if logged in first; redirect to login if not
        res.sendFile(path.join(__dirname, "public", "inbox.html"))
    })
    
    app.get("/search", isLoggedIn, (req, res) => {
        //return filters that are to be applied as well
        //if filters are invalid, return error page
        res.sendFile(path.join(__dirname, "public", "search.html"))
    })
    
    app.get("/question", isLoggedIn, (req, res) => {
        //process id in link as well
        //if the question is private, and belongs to user, open in create.html
        //if question is not accesible or doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "question.html"))
    })

    app.get("/collection", isLoggedIn, (req, res) => {
        //process id in link as well
        //if collection is private, check that it belongs to user
        //if collection is not accesible or doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "collection.html"))
    })

    app.get("/profile", isLoggedIn, (req, res) => {
        //process id in link as well
        //if profile doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "profile.html"))
    })

    app.get("/create", isLoggedIn, (req, res) => {
        res.sendFile(path.join(__dirname, "public", "create.html"))
    })

    app.get("/create/:id", isLoggedIn, (req, res) => {
        res.sendFile(path.join(__dirname, "public", "create.html"))
    })

    app.get("/leaderboards", isLoggedIn, (req, res) => {
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

    app.get("/api/topics/names/:subject", async (req, res) => {
        try {
            const sbj = req.params.subject
            const sbjID = (await Subject.findOne({full_name:sbj}, {_id:0, subject_id:1}))?.subject_id //find subject
            const topics = await Topic.find({subject_id:sbjID}, {name:1, _id:0}) //find all topics for that subject
            const names  = topics.map(s => s.name)
            res.json(names)

        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/question/get/:id", async (req, res) => {
        const qID = Number(req.params.id)
        const userTag = req.user.user_tag
        let question = await Question.findOne( //query question
            {question_id:qID},
            {name:1, topic_id:1, user_tag:1, content:1, tag:1, mark_scheme:1, published:1, _id:0})

        let topic = await Topic.findOne( //query topic
            {topic_id:question?.topic_id},
            {_id:0, name:1, subject_id:1}
        )

        let subject = await Subject.findOne( //query subject
            {subject_id:topic?.subject_id},
            {_id:0, full_name:1, study_stage:1}
        )

        if (!question || !topic || !subject) { //if any are not found, redirect to empty
            return res.status(400).json({
                success: false,
                redirect: `/create`
            })
        }

        if (question.published) { //if quesiton is published, send to actual question page
            return res.status(400).json({
                success: false,
                redirect: `/question/${qID}`
            })
        }

        if (!question || !topic || !subject) { //if question is not by user, then dont show it to them
            return res.status(400).json({
                success: false,
                redirect: `/create`
            })
        } 
        
        let tag
        if (question.tag == "1") {
            tag = "user"
        }
        else if (question.tag == "2") {
            tag = "solution"
        }

        let data = {
            stage: subject.study_stage,
            subject:subject.full_name,
            topic:topic.name,
            tag:tag,
            qname:question.name,
            qtext:question.content,
            mstext:question.mark_scheme
        }

        return res.json(data)
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
                if (validate(field, res)) return
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
                    full_name:name,
                    email:data.email,
                    
                    average_like_rating:0,
                    created_total:0,
                    created_today:0,
                    studied_total:0,
                    studied_today:0,
                    completed_total:0,
                    completed_today:0,
                })

                //let data = {name, password, password_1, school, stage, subjects, tag, username, country, email}

                await user.save()
                return res.status(200).json({success:true})
            }
        } catch(err) {
            console.error(err)
            return res.status(500).json({error:"Server error"}); 
        }
    })

    app.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
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
    app.get("/home", isLoggedIn, (req, res) => {
        res.send(`<h2>Dashboard</h2><p>Welcome, ${req.user.username}!</p><a href="/logout">Logout</a>`)
    })

    // Logout
    app.get("/logout", (req, res) => {
        req.logout(() => {
            res.redirect("/")
        });
    })

    app.post("/question/save/:id/:publish", async (req, res) => {
        const qID = req.params.id
        const publish = req.params.publish == "true"
        const clientTag = req.user.user_tag

        //parsing data

        const {stage, subject, topic, tag, mstext, qtext, qname} = req.body
        let data = {stage, subject, topic, tag, mstext, qtext, qname}

        for (const key in data) { //remove whitespaces
            if (typeof data[key] == "string") {
                data[key] = data[key].trim()
            }
        }

        try{
            //validation

            for (let field of Object.values(data)) { //check empty and profanities
                if (validate(field, res)) return
            }

            if (!["0", "1", "2"].includes(data.stage)) {
                return res.status(400).json({error: "Please select a study stage"})
            }
            else if (!["user", "solution"].includes(data.tag)) {
                return res.status(400).json({error: "Please select a question tag"})
            }
            else if (data.qname.length < 10) {
                return res.status(400).json({error: "Name must be at least 10 characters"})
            }
            else if (data.mstext.length < 10) {
                return res.status(400).json({error: "Mark scheme is too short"})
            }
            else if (data.qtext.length < 10) {
                return res.status(400).json({error: "Question is too short"})
            }
            else if (data.qname.length > 40) {
                return res.status(400).json({error: "Name must be maximum 40 characters!"})
            }
            else if (data.mstext.length > 5000) {
                return res.status(400).json({error: "Mark scheme must be maximum 5k characters!"})
            }
            else if (data.qtext.length > 5000) {
                return res.status(400).json({error: "Question must be maximum 5k characters!"})
            }

            else {
                //subject check
                const subjectID = await Subject.findOne({full_name:data.subject, study_stage:data.stage}, {subject_id:1})
                if (!subjectID) {
                    return res.status(409).json({ error: "Subject does not exist!" })
                }

                //topic check
                const topicID = (await Topic.findOne({subject_id:subjectID.subject_id, name:data.topic}, {topic_id:1}))?.topic_id
                if (!topicID) {
                    return res.status(409).json({ error: "Topic does not exist!" })
                }

                if (data.tag == "user") {
                    data.tag = 1
                }
                else {
                    data.tag = 2
                }

                if (qID == -1 || !(await Question.exists({question_id:qID}))) { //if question doesn't exist, create new
                    const question = new Question({
                        question_id: await idGenerator(Question),
                        topic_id: topicID,
                        user_tag: clientTag,
                        name: data.qname,
                        content: data.qtext,
                        tag: data.tag,
                        mark_scheme: data.mstext,
                        published:publish
                    })
                    await question.save()

                    //update number user has created 

                    await User.updateOne({user_tag: clientTag}, {$inc:{created_today:1, created_total:1}})

                    if(publish) {
                        return res.status(200).json({
                            success: true,
                            redirect: `/question/${question.question_id}`
                        })
                    }
                    return res.status(200).json({
                        success: true,
                        redirect: `/create/${question.question_id}`
                    })
                }
                else { //if question already exists
                    await Question.updateOne({question_id: qID}, {$set: {
                        topic_id: topicID,
                        name: data.qname,
                        content: data.qtext,
                        tag: data.tag,
                        mark_scheme: data.mstext,
                        published:publish
                    }})

                    if (publish) {
                        return res.status(200).json({
                            success: true,
                            redirect: `/question/${qID}`
                        })
                    }
                    return res.status(200).json({success:true})
                }
            }
        } catch(err) {
            console.error(err)
            return res.status(500).json({error:"Server error"}); 
        }
    })

    // Auth middleware
    


    //delete all notifications that are older than 60 days
}