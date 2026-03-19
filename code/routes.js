const express = require("express")
const session = require("express-session")
const path = require("path")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const { publicDecrypt } = require("crypto")
const MongoStore = require('connect-mongo').default
const fs = require("fs").promises
const validator = require("validator")
const leo = require("leo-profanity")
const database = require("./database")
const {spawn} = require('child_process')

const RENDER = !!process.env.RENDER
const PYTHON_URL = process.env.MODEL_URL || "http://127.0.0.1:8000"

async function sendModelRequest(data, requestType) { //python model request
    try {
        const result = await fetch(`${PYTHON_URL}/api/${requestType}`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)

        }) //send request

        if (!result.ok) {
            console.error("Python error", result.statusText, await result.text())
            return
        }

        
        const res = await result.json()
        return res
    }
    catch (err) {
        console.error(err.message)
        throw err
    }
}

const hostUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SCIMUS"
console.log(`Host URL is ${hostUrl}`)
const day = 1000 * 60 * 60 * 24

const bandCounts = { //number of questions from each band per batch
    regular: 18,
    hard:8, 
    easy:5
}

const QsortMap = { //quickly maps value of sort to a sort object
    "views":{views:-1}, //lowest views first
    "easy":{avg_diff_rating:1}, //lowest difficulty first
    "hard":{avg_diff_rating:-1}, //highest difficulty first
    "likes":{like_rating:-1}, //highest likes first
    "comments":{num_comments:-1}, //highest comments first
    "rates":{num_diff_ratings:-1}, //highest number of ratings first
    "num":{question_number:1}, //ascending by question number
    "time":{created_at:-1}, //largest date (youngest) first
}

const CsortMap = { //quickly maps value of sort to a sort object
    "num":{question_num:-1}, //descending by number of questions
    "time":{created_at:-1}, //largest date (youngest) first
}

const LBsortMap = {
    "time":[{studied_total:-1}, {studied_today:-1}],
    "qcreate":[{created_total:-1}, {created_today:-1}],
    "qcomplete":[{completed_total:-1}, {completed_today:-1}],
    "likes":[{total_likes:-1}, {likes_today:-1}],
}

function shuffle(list) {//shuffles a list
    for (let i = 0; i<list.length; i++) {
        const randomPos = Math.floor((Math.random() - 0.0001) * (list.length)) //can never exceeed last pos index

        //now swap
        if (randomPos != i) {
            const temp = list[i]
            list[i] = list[randomPos]
            list[randomPos] = temp
        }
    }
}

function clip (txt, val) {
    if (txt.length < val) {
        return txt
    }
    else {
        return (txt.substring(0, val) + "...")
    }
}

function convertDate(date){ //converts date to nice format
    const d = new Date(date)

    const datePart = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

    const timePart = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    return `${datePart} at ${timePart}`
}

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

    if (field.includes(">") || field.includes("<")) {
        res.status(400).json({error: `">" or "<" characters are not allowed!`})
        return true
    }
}

function convertStudyStage(val) {
    if (!isNaN(Number(val))) {
        if (val == 0 || val == "0") {
            return "GCSE"
        }
        if (val == 1 || val == "1") {
            return "A-level"
        }
        if (val == 2 || val == "2") {
            return "University+"
        }
    }
    else {
        if (val == "GCSE") {
            return 0
        }
        if (val == "A-level") {
            return 1
        }
        if (val == "University+") {
            return 2
        }
    }
}

function convertTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Official"
    }
    else if (Number(val) == 2) {
        return "Looking for solution"
    }
    else if (val == "solution"){
        return 2
    }
    else if (val == "user") {
        return 1
    }
    else if (val == "official") {
        return 0
    }
    else{
        console.log("TAG CONVERSION ERROR")
    }
}

function convertCollectionTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Past paper"
    }
    else if (val == "paper" || val == "Past paper") {
        return 0
    }
    else if (val == "user" || val == "User-made") {
        return 1
    }
    else{
        console.log("TAG CONVERSION ERROR")
    }
}

module.exports = function(app) {
    const {User, Subject, Topic, School, Question, Collection, QuestionCollection, 
    Like, Solve, Watch, Comment, Notification, Rate, ServerData,
    SubjectUser} = require("./database")

    

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

    app.get("/api/create/get/:id", async (req, res) => {
        try {
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

            if (question.published) { //if question is published, send to actual question page
                return res.status(400).json({
                    success: false,
                    redirect: `/question/${qID}`
                })
            }

            if (question.user_tag != userTag) { //if question is not by user, then dont show it to them
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
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/question/get/:id", async (req, res) => {
        try {
            const qID = Number(req.params.id)
            const userTag = req.user.user_tag

            const question = await Question.findOne( //query question
                {question_id:qID},
                {name:1, topic_id:1, user_tag:1, content:1, tag:1, mark_scheme:1, published:1, _id:0,
                    num_diff_ratings:1, total_diff_rating:1, like_rating:1, paper_num:1, question_num:1, views:1,
                    num_comments:1, num_collections:1, num_solves:1, num_watches:1
                })
            
            //if doesn't exist or private, but not owned by the user, then redirect to home
            if (!question || (!question.published && question.user_tag != userTag)) { 
                return res.status(500).json({
                    success: false,
                    redirect: `/home`
                })
            }

            //if private, and owned by the user, redirect to question creation
            if (!question.published && question.user_tag == userTag) {
                return res.status(500).json({
                    success: false,
                    redirect: `/create/${qID}`
                })
            }

            const topic = await Topic.findOne( //query topic
                {topic_id:question?.topic_id},
                {_id:0, name:1, subject_id:1}
            )

            const subject = await Subject.findOne( //query subject
                {subject_id:topic?.subject_id},
                {_id:0, full_name:1, study_stage:1, spec:1, formulas:1}
            )

            if (!question || !topic || !subject) { //if any are not found, redirect to empty
                return res.status(500).json({
                    success: false,
                    redirect: `/home`
                })
            }

            await Question.updateOne(
                {question_id:qID},
                {$inc: {views:1}}
            )

            let stage = convertStudyStage(subject.study_stage)
            let tag = convertTag(question.tag)

            let userLiked = (await Like.findOne({item_id:qID, user_tag:userTag, item_type:0}, {_id:0, value:1}))?.value

            let extra = {
                like: userLiked == undefined ? 0 : userLiked,
                watch: !!(await Watch.exists({question_id:qID, user_tag:userTag})),
                solve: !!(await Solve.exists({question_id:qID, user_tag:userTag})),
                rate: !!(await Rate.exists({question_id:qID, user_tag:userTag})),
            }

            let data = {
                stage: stage,
                subject: subject.full_name,
                paper: question.paper_num || "",
                question: question.question_num || "",
                topic: topic.name || "",
                year: question.year,
                name: question.name,
                user_tag: "@" + question.user_tag,
                rating: (question.total_diff_rating/question.num_diff_ratings),
                views: question.views,
                qtext: question.content,
                mstext: question.mark_scheme,
                formula: subject.formulas,
                spec: subject.spec,
                likes: question.like_rating,
                watches: question.num_watches,
                solves: question.num_solves,
                ratings: question.num_diff_ratings,
                comments: question.num_comments,
                collections: question.num_collections, 
                tag:tag,
                extra:extra,
            }

            return res.json(data)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/watch/add/:qid", async (req, res) => {
        try {
            const qID = req.params.qid
            const userTag = req.user.user_tag

            if (!await Question.exists({question_id:qID})) { //check question exists
                res.status(409).json({ error: "Question does not exist!"})
            }

            if (await Watch.exists({question_id:qID, user_tag:userTag})) { //check there is not already a watch
                res.status(409).json({ error: "Question already marked as watched!"})
            }

            await Watch.insertOne({
                question_id:qID,
                user_tag: userTag
            })

            await Question.updateOne({
                question_id:qID},
                {$inc:{num_watches:1}}
            )

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/solve/add/:qid", async (req, res) => {
        try {
            const qID = req.params.qid
            const userTag = req.user.user_tag

            if (!await Question.exists({question_id:qID})) { //check question exists
                res.status(409).json({ error: "Question does not exist!"})
            }

            if (await Solve.exists({question_id:qID, user_tag:userTag})) { //check there is not already a solve
                res.status(409).json({ error: "Question already marked as solved!"})
            }

            await Solve.insertOne({
                question_id:qID,
                user_tag: userTag
            })

            await Question.updateOne({
                question_id:qID},
                {$inc:{num_solves:1}}
            )

            await User.updateOne({ //increment questions completed
                user_tag:userTag},
                {$inc:{completed_today:1, completed_total:1}}
            )

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/watch/remove/:qid", async (req, res) => {
        try {
            const qID = req.params.qid
            const userTag = req.user.user_tag

            if (!await Question.exists({question_id:qID})) { //check question exists
                res.status(409).json({ error: "Question does not exist!"})
            }

            if (!(await Watch.exists({question_id:qID, user_tag:userTag}))) { //check there is  a watch
                res.status(409).json({ error: "Question not already marked as watched!"})
            }

            await Watch.deleteOne({
                question_id:qID,
                user_tag: userTag
            })

            await Question.updateOne({
                question_id:qID},
                {$inc:{num_watches:-1}}
            )

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/solve/remove/:qid", async (req, res) => {
        try {
            const qID = req.params.qid
            const userTag = req.user.user_tag

            if (!await Question.exists({question_id:qID})) { //check question exists
                res.status(409).json({ error: "Question does not exist!"})
            }

            if (!(await Solve.exists({question_id:qID, user_tag:userTag}))) { //check there is not  a solve
                res.status(409).json({ error: "Question not already marked as solved!"})
            }

            await Solve.deleteOne({
                question_id:qID,
                user_tag: userTag
            })

            await Question.updateOne({
                question_id:qID},
                {$inc:{num_solves:-1}}
            )

            await User.updateOne({ //decrement questions completed
                user_tag:userTag},
                {$inc:{completed_today:-1, completed_total:-1}}
            )


            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/like/:qid/:value", async (req, res) => {
        const qID = req.params.qid
        const val = Number(req.params.value)
        const userTag = req.user.user_tag

        try {
            const question = await Question.findOne({question_id:qID}, {_id:0, like_rating:1, user_tag:1, name:1})

            if (!question) { //check question exists
                return res.status(409).json({ error: "Question does not exist!"})
            }
            if (![0, 1, -1].includes(val)) {
                return res.status(409).json({ error: "Invalid like value"})
            }

            const like = await Like.findOne({item_id:qID, item_type:0, user_tag:userTag}, {value:1, _id:0})

            const delta = val - (like ? like.value : 0)

            if (delta == 0) {
                return res.status(200).json({ success: true })
            }

            //UPDATE LIKES

            if (!like && val !== 0) { //if like doesnt exist, create a new one
                await Like.create({
                    item_id: qID,
                    user_tag: userTag,
                    value: val,
                    item_type: 0
                })
            }

            else if (like && val == 0) { //delete existing like if unliking
                await Like.deleteOne(
                    {item_id:qID, 
                        item_type:0, 
                        user_tag:userTag}
                )
            }

            else {
                await Like.updateOne( //otherwise update existing like
                    {
                        item_id:qID, 
                        item_type:0, 
                        user_tag:userTag},
                    {$set: {value: val}},
                )
            }

            //UPDATE QUESTION

            await Question.updateOne( //update question like rating
                {question_id: qID},
                {$inc: {like_rating: delta}},
            )

            //update user total like rating
            await User.updateOne(
                {user_tag:question.user_tag},
                {$inc: {total_likes:delta, likes_today:delta}},
            )

            if (question.user_tag != userTag) {
                if (question.like_rating+delta % 100 == 0 && question.like_rating+delta != 0) { //send notification if like threshold
                    await Notification.insertOne({
                        notif_id: await idGenerator(Notification),
                        user_tag: question.user_tag,
                        question_id: question.question_id,
                        message: `Your question ${question.name} just hit ${question.like_rating+delta} likes!`,
                    })
                }
            }

            return res.status(200).json({
                success:true,
                newLikes:question.like_rating+delta
            })
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/rate/:qid/:value", async (req, res) => {
        const qID = req.params.qid
        const val = Number(req.params.value)
        const userTag = req.user.user_tag

        try {
            const question = await Question.findOne(
                {question_id:qID}, 
                {_id:0, num_diff_ratings:1, total_diff_rating:1, avg_diff_rating:1})

            if (!question) { //check question exists
                return res.status(409).json({ error: "Question does not exist!"})
            }
            if (![1, 2, 3, 4, 5].includes(val)) {
                return res.status(409).json({ error: "Invalid rate value"})
            }

            const rate = await Rate.findOne({question_id:qID, user_tag:userTag}, {value:1, _id:0})

            const delta = val - (rate ? rate.value : 0)
            let deltaRateNum = 0

            if (delta == 0) {
                return res.status(409).json({ error: ""})
            }

            //UPDATE RATING

            if (!rate) { //if rate doesnt exist, create a new one
                await Rate.create({
                    question_id:qID,
                    user_tag:userTag,
                    value:val
                })
                deltaRateNum = 1
            }

            //cannot unrate a question

            else {
                await Rate.updateOne( //otherwise update existing rate
                    {
                        question_id:qID, 
                        user_tag:userTag},
                    {$set: {value: val}},
                )
            }

            //UPDATE QUESTION

            //new average values
            let newAverage = (+question.total_diff_rating+delta)/(+question.num_diff_ratings+deltaRateNum)
            let deltaAvg = newAverage - question.avg_diff_rating

            if (isNaN(newAverage)) {newAverage = 0}
            if (isNaN(deltaAvg) ){deltaAvg = 0}

            await Question.updateOne( //update question rating
                {question_id: qID},
                {$inc: {
                    total_diff_rating:delta,
                    num_diff_ratings:deltaRateNum,
                    avg_diff_rating:deltaAvg
                }},
            )

            return res.status(200).json({
                success:true,
                newRate: +question.num_diff_ratings + deltaRateNum,
                newAvg:newAverage
            })
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/subject/papers/:name", async (req, res) => { //get paper number from subject name
        try {
            const name = req.params.name
            const subject = await Subject.findOne({full_name:name}, {papers:1, _id:0})
            if (!subject) {
                return res.status(409).json({ error: "Invalid subject"})
            }
            return res.json(subject.papers)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/timer/add/:time", async (req, res) => { //add time studied to user account
        try {
            const userTag = req.user.user_tag
            let time = Number(req.params.time)

            if (!await User.findOne({user_tag:userTag})) {
                return res.status(409).json({ error: "Invalid user tag"})
            }
            if (isNaN(time) || time < 0 || time > 1000*60*90) {
                return res.status(409).json({ error: "Invalid time value!"})
            }

            await User.updateOne({user_tag:userTag}, {
                $inc:{studied_today:time, studied_total:time}
            })

            return res.status(200).json({
                success:true
            })
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    async function searchQuestions(data, userTag, res) {

        let filter = {}

        if(data.creator.startsWith("@")) data.creator = data.creator.slice(1) //remove @ at the start
        
        !data.page ? data.page = 1 : data.page = Number(data.page)
        const skip = (data.page-1)*20 //calculate total number to skip

        if (data.creator != userTag) {
            filter.published = true
        }

        let subject, topic

        if (data.paper && data.paper !="" && data.paper !="-1"  && data.subject == "") { //if paper without subject
            return res.status(400).json({error:"Cannot search paper without subject!"})
        }

        if (data.stage =="-1" && (data.subject !="" || data.topic !="")) {//if subject/topic without study stage
            return res.status(400).json({error:"Cannot search subject/topic without study stage!"}) 
        }

        if (data.topic !="" && data.subject == "") {
            return res.status(400).json({error:"Cannot search topic without subject!"}) //if topic without subject
        }

        //find subject
        if (data.subject != "") { //check subject exists
            subject = await Subject.findOne({full_name:data.subject}, {subject_id:1, _id:0})
            if (!subject) {
                return res.status(400).json({error:"No such subject found"}) //if subject is invalid
            }
        }

        //find topic
        if (data.topic != "") { //check topic exists
            topic = await Topic.findOne({name:data.topic}, {topic_id:1, _id:0})
            if (!topic) {
                return res.status(400).json({error:"No such topic found"}) //if topic is invalid
            }
        }


        if (data.creator !=""){filter.user_tag = data.creator} 
        if (data.paper != "-1"){filter.paper_num = Number(data.paper)}
        if (data.stage != "-1" && data.stage){filter.study_stage = Number(data.stage)}
        if (data.subject !=""){filter.subject_id = subject.subject_id}
        if (data.tag != "-1"){filter.tag = Number(data.tag)}
        if (data.topic != ""){filter.topic_id = topic.topic_id}
        if (data.year !=""){filter.year = Number(data.year)}

        if (data.search){
            filter.$or = [ //check matches in any of mark scheme, title, content
                {name:{$regex: data.search, $options: "i"}},
                {content:{$regex: data.search, $options: "i"}},
                {mark_scheme:{$regex: data.search, $options: "i"}}
            ]
        }

        let sortVal = QsortMap[data.sort] || {views:-1} //default sort is views
        sortVal._id = 1 //enforces specific order

        let result = await Question.find(filter, {
            question_id:1, user_tag:1, name:1, content:1, total_diff_rating:1, like_rating:1, images:1, paper_num:1, question_num:1, tag:1, mark_scheme:1, views:1, year:1, num_comments:1, num_watches:1, num_solves:1, num_diff_ratings:1, study_stage:1, topic_id:1, subject_id:1
        }) //find specified questions
        .sort(sortVal)
        .skip(skip)
        .limit(20)
        .lean()

        //collect topic ids
        const topicIDs = [...new Set(result.map(q => q.topic_id))]

        //fetch topic ids, names, subject_ids
        const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1, subject_id:1})

        //create object of {topic_id:{topic_id, subject_id, name}}
        const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t]))

        //collect subject ids from topics
        const subjectIDs = [...new Set(topics.map(t => t.subject_id))]

        //fetch subject names
        const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, full_name:1})

        //create object of {subject_id:name}
        const subjObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.full_name]))

        //add to questions in result
        for (let q of result) {
            const topic = topicObj[q.topic_id]
            q.topic = topic.name
            q.subject = subjObj[topic.subject_id]
        }

        return result
    }

    app.get("/api/search/question/", async (req, res) => { //respond to question searches
        try{
            let data = req.query
            const userTag = req.user.user_tag

            return res.json(await searchQuestions(data, userTag, res))
        }
        catch (err) {
            console.error(err)
            return res.status(500).json({error:err.message})
        }
    })

    app.get("/api/search/collection/", async (req, res) => { //respond to collection searches
        try{
            let data = req.query
            const userTag = req.user.user_tag
            
            let filter = {}

            if(data.creator.startsWith("@")) data.creator = data.creator.slice(1) //remove @ at the start
            
            !data.page ? data.page = 1 : data.page = Number(data.page)
            const skip = (data.page-1)*20 //calculate total number to skip

            if (data.creator != userTag) {
                filter.published = true
            }

            let subject, topic

            if (data.paper !="-1"  && data.subject == "") { //if paper without subject
                return res.status(400).json({error:"Cannot search paper without subject!"})
            }

            if (data.stage =="-1" && (data.subject !="" || data.topic !="")) {//if subject/topic without study stage
                return res.status(400).json({error:"Cannot search subject/topic without study stage!"}) 
            }

            if (data.topic !="" && data.subject == "") {
                return res.status(400).json({error:"Cannot search topic without subject!"}) //if topic without subject
            }

            //find subject
            if (data.subject != "") { //check subject exists
                subject = await Subject.findOne({full_name:data.subject}, {subject_id:1, _id:0})
                if (!subject) {
                    return res.status(400).json({error:"No such subject found"}) //if subject is invalid
                }
            }

            //find topic
            if (data.topic != "") { //check topic exists
                topic = await Topic.findOne({name:data.topic}, {topic_id:1, _id:0})
                if (!topic) {
                    return res.status(400).json({error:"No such topic found"}) //if topic is invalid
                }
            }


            if (data.creator != ""){filter.user_tag = data.creator} 
            if (data.paper != "-1"){filter.paper = Number(data.paper)}
            if (data.stage != "-1" && data.stage){filter.stages = Number(data.stage)}
            if (data.subject != ""){filter.subject_ids = subject.subject_id}
            if (data.tag != "-1"){filter.tag = Number(data.tag)}
            if (data.topic != ""){filter.topic_ids = topic.topic_id}
            if (data.year != ""){filter.year = Number(data.year)}

            filter.question_num = { $gt: 0 }

            if (data.search){
                filter.$or = [ //check matches in title
                    {name:{$regex: data.search, $options: "i"}},
                ]
            }

            let sortVal = CsortMap[data.sort] || {created_at:-1} //default sort is time
            sortVal._id = 1 //enforces specific order for paging

            let result = await Collection.find(filter, {
                collection_id:1, user_tag:1, name:1, tag:1, stages:1, paper:1, year:1, question_num:1,
                topic_ids:1, subject_ids:1, preview:1
            }) //find specified collections
            .sort(sortVal)
            .skip(skip)
            .limit(20)
            .lean()

            //collect topic ids
            const topicIDs = [...new Set(result.map(c => c.topic_ids[0]))]

            //fetch topic ids, names
            const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1})

            //create object of {topic_id:{topic_id:name}}
            const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t.name]))

            //collect subject ids
            const subjectIDs = [...new Set(result.map(c => c.subject_ids[0]))]

            //fetch subject ids, names
            const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, name:1}) 

            //create object of {subject_id:{subject_id:name}}
            const subjectObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.name]))

            //add to collections in result
            for (let c of result) {
                const topics = Array(c.topic_ids.length)
                topics[0] = topicObj[c.topic_ids[0]]
                const subjects = Array(c.subject_ids.length)
                subjects[0] = subjectObj[c.subject_ids[0]]
                c.topics = topics
                c.subjects = subjects
            }


            return res.json(result)
        }
        catch (err) {
            console.error(err)
            return res.status(500).json({error:err.message})
        }
    })

    app.get("/api/lb/", async (req, res) => { //respond to leaderboard request
        try{
            let data = req.query
            let page = req.params.page

            !page ? page = 1 : page = Number(page)
            const skip = (page-1)*20 //calculate total number to skip
            
            let filter = {}

            let school

            if (data.school != "") { //check school exists
                school = await School.findOne({name:data.school}, {school_id:1, _id:0}).lean()
                if (!school) {
                    return res.status(400).json({error:"No such school found"}) //if subject is invalid
                }
            }

            if (data.country != "") {filter.country = data.country}
            if (data.school !=""){filter.school_id = school.school_id}

            if (["0", "1"].includes(data.time)) {
                data.time = Number(data.time)
            }
            else {
                return res.status(400).json({error:"Invalid time period"}) //if is invalid
            }

            if (!["time", "qcreate", "qcomplete", "likes"].includes(data.sort)) {
                return res.status(400).json({error:"Invalid sort parameter"}) //if is invalid
            }

            let sortVal = {...LBsortMap[data.sort][data.time]} //get correct sort field + descending
            let sortVar = Object.keys(sortVal)[0] //get actual variable name
            sortVal._id = 1

            let result = await User.find(filter, {
                user_tag:1, [sortVar]:1, school_id:1, country:1, _id:0
            }) //find specified questions
            .sort(sortVal)
            .skip(skip)
            .limit(20)
            .lean()

            //collect school ids
            const schoolIDs = [...new Set(result.map(u => u.school_id))]

            //fetch school ids and their names
            const schools = await School.find({school_id:{$in:schoolIDs}}, {name:1, _id:0, school_id:1})

            //create object of schoolid -> schoolname
            const schoolObj = Object.fromEntries(schools.map(s => [s.school_id, s.name]))

            //add to users in result
            let counter = 1
            for (let u of result) {
                //set rank
                u.rank = skip + counter
                counter++

                //set shcl
                const school = schoolObj[u.school_id]
                u.school = school
            }

            return res.json(result)
        }
        catch (err) {
            console.error(err)
            return res.status(500).json({error:err.message})
        }
    })

    app.get("/api/collections/get/:id", async (req, res) => { //respond to collection requests
        try {
            const userTag = req.user.user_tag
            const qID = Number(req.params.id)

            //find collections
            const collections = await Collection.find({user_tag:userTag}, {collection_id:1, name:1, published:1, _id:0}).lean()

            const cIDS = collections.map(c => c.collection_id)

            //check questionCollection - return list of collection objects which contain the question
            const collectionsWithQuestion = await QuestionCollection.find({collection_id:{$in:cIDS}, question_id:qID},{collection_id:1})

            const collectionArray = collectionsWithQuestion.map(c => c.collection_id)

            for (const c of collections) { //insert true into all collections that contain the question
                if (collectionArray.includes(c.collection_id)) {
                    c.includesQuestion = true
                }
                else {
                    c.includesQuestion = false
                }
            }

            return res.json(collections)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/collection/create", async (req, res) => {
         try {
            const userTag = req.user.user_tag

            if (await Collection.exists({user_tag:userTag, name:"New collection"})) {
                return res.status(409).json({ error: "You have already created a collection recently!" })
            }

            const newID = await idGenerator(Collection)
            
            await Collection.insertOne({
                collection_id: newID,
                user_tag:userTag,
                name:"New collection",
                tag:1, //usermade
                published:false
            })

            return res.status(200).json({success:true, id:newID})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/collection/rename/:name/:id", async (req, res) => {
         try {
            const userTag = req.user.user_tag
            const newName = req.params.name
            const cID = Number(req.params.id)

            const collection = await Collection.findOne({collection_id:cID})

            if (!collection) {//if collection doesnt exist
                return res.status(409).json({ error: "Collection does not exist" })
            }

            if (collection.user_tag != userTag) { //if collection not user's
                return res.status(409).json({ error: "This collection does not belong to you!" })
            }

            //validate name
            if (validate(newName, res)) {
                return
            }

            await Collection.updateOne({collection_id:cID}, { //set new name
                $set:{name:newName}
            })

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/collection/visibility/:id", async (req, res) => { //change collection visibility
         try {
            const userTag = req.user.user_tag
            const cID = Number(req.params.id)

            const collection = await Collection.findOne({collection_id:cID})

            if (!collection) {//if collection doesnt exist
                return res.status(409).json({ error: "Collection does not exist" })
            }

            if (collection.user_tag != userTag) { //if collection not user's
                return res.status(409).json({ error: "This collection does not belong to you!" })
            }

            await Collection.updateOne({collection_id:cID}, { //set new name
                $set:{published:!collection.published}
            })

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/collection/question/:qID/:id", async (req, res) => { //add/remove question to collection
         try {
            const userTag = req.user.user_tag
            const cID = Number(req.params.id)
            const qID = Number(req.params.qID)

            const collection = await Collection.findOne({collection_id:cID})

            if (!collection) {//if collection doesnt exist
                return res.status(409).json({ error: "Collection does not exist" })
            }

            if (collection.user_tag != userTag) { //if collection not user's
                return res.status(409).json({ error: "This collection does not belong to you!" })
            }

            const question = await Question.findOne({question_id:qID})

            if (!(question)) {
                return res.status(409).json({ error: "Question does not exist!" })
            }

            //find questionCollection entry
            const questionCollectionEntry = await QuestionCollection.findOne({
                question_id:qID,
                collection_id:cID
            })

            let newColNum = question.num_collections

            if (!questionCollectionEntry) { //if question not in collection, add it
                await QuestionCollection.insertOne({
                    question_id:qID,
                    collection_id:cID
                })

                await question.updateOne({ //update number of collections question is in
                    $inc:{num_collections:1}
                })

                newColNum++ //update counter to send to user

                //add subjectID to collection
                await collection.updateOne(
                    {$addToSet:{subject_ids:question.subject_id}}
                )

                //add topicID to collection
                await collection.updateOne(
                    {$addToSet:{topic_ids:question.topic_id}}
                )

                //add stage to collection
                await collection.updateOne(
                    {$addToSet:{stages:question.study_stage}}
                )

                //update collection question number and preview
                await collection.updateOne( {
                    $inc: {question_num:1},
                    $push: {preview:question.name}
                })
            }
            else { //if question in collection, delete
                await questionCollectionEntry.deleteOne()

                const remainingQuestionIDs = await QuestionCollection.find( //get all ids in collection
                    {collection_id:cID},
                    {question_id:1,_id:0}
                ).lean()

                const ids = remainingQuestionIDs.map(q => q.question_id)

                //count how many match each of stage, subject, topic

                const stageCount = await Question.countDocuments({ 
                    question_id:{$in:ids},
                    study_stage:question.study_stage
                })

                const subjectCount = await Question.countDocuments({ 
                    question_id:{$in:ids},
                    subject_id:question.subject_id
                })

                const topicCount = await Question.countDocuments({
                    question_id:{$in:ids},
                    topic_id:question.topic_id
                })

                if(stageCount === 0){ //if there are none left wiht the study stage, delete 
                    await collection.updateOne({$pull:{stages:question.study_stage}})
                }

                if(subjectCount === 0){ //if there are none left with subject, delete subject
                    await collection.updateOne({$pull:{subject_ids:question.subject_id}})
                }

                if(topicCount === 0){//if there are none left with topic, delete topic
                    await collection.updateOne({$pull:{topic_ids:question.topic_id}})
                }

                //remove topicID 
                

                await question.updateOne({ //update number of collections question is in
                    $inc:{num_collections:-1}
                })

                newColNum-- //update question counter to send to user

                //update collection question number and preview
                await collection.updateOne( {
                    $inc: {question_num:-1},
                    $pull:{preview:question.name}
                })
            }

            return res.status(200).json({success:true, newColnum:newColNum})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    async function getCollectionData(cID, userTag, res) {

        const collection = await Collection.findOne( //query collection
            {collection_id:cID},
            {name:1, user_tag:1, tag:1, published:1, _id:0,
                paper:1, year:1,
            })
        
        //if doesn't exist or private, but not owned by the user, then redirect to home
        if (!collection || (!collection.published && collection.user_tag != userTag)) { 
            return res.status(500).json({
                success: false,
                redirect: `/home`
            })
        }

        //find questionIDS in collection
        const questionIDs = await QuestionCollection.find({collection_id:cID}, {question_id:1, _id:0}).lean()
        const questionIDArray = questionIDs.map(q => q.question_id)

        //get data from questions

        let questions = await Question.find({ //find specified questions from ID list
            question_id: {$in:questionIDArray}
        }, {
            question_id:1, user_tag:1, name:1, content:1, total_diff_rating:1, like_rating:1, images:1, paper_num:1, question_num:1, tag:1, mark_scheme:1, views:1, year:1, num_comments:1, num_watches:1, num_solves:1, num_diff_ratings:1, study_stage:1, subject_id:1, topic:1, subject:1, topic_id:1, subject_id:1
        }) 
        .sort({created_at:-1})
        .lean()

        //collect topic ids
        const topicIDs = [...new Set(questions.map(q => q.topic_id))]

        //fetch topic ids, names, subject_ids
        const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1, subject_id:1})

        //create object of {topic_id:{topic_id, subject_id, name}}
        const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t]))

        //collect subject ids from topics
        const subjectIDs = [...new Set(topics.map(t => t.subject_id))]

        //fetch subject names
        const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, full_name:1})

        //create object of {subject_id:name}
        const subjObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.full_name]))

        //add to questions in result
        for (let q of questions) {
            const topic = topicObj[q.topic_id]
            q.topic = topic.name
            q.subject = subjObj[topic.subject_id]
        }

        let tag = convertCollectionTag(collection.tag)

        let data = {
            tag:tag,
            paper:collection.paper == 0 ? "" : collection.paper,
            year:collection.year == 0 ? "" : collection.year,
            name:collection.name,
            user_tag:"@"+collection.user_tag,
            question_data:questions
        }

        return data
    }

    app.get("/api/collection/get/:id", async (req, res) => {
        try {
            const cID = Number(req.params.id)
            const userTag = req.user.user_tag

            return res.json((await getCollectionData(cID, userTag, res)))
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/comments/get/:qID/:page", async (req, res) => { //load base comments for a question
        try {
            const qID = Number(req.params.qID)
            const userTag = req.user.user_tag

            //check question exists
            if (!(await Question.exists({question_id:qID}))) { 
                return res.status(409).json({ error: "Question does not exist!"})
            }

            let page = Number(req.params.page)

            !page ? page = 1 : page = Number(page)
            const skip = (page-1)*20 //calculate total number to skip

            //get top 20 comments
            let comments = await Comment.find({question_id:qID, parent_comment_id:undefined},
                {_id:0, comment_id:1, user_tag:1, content:1, like_rating:1, created_at:1}
            )
            .sort({like_rating:-1, _id:1})
            .skip(skip)
            .limit(20)
            .lean()

            //collect user tags
            const userTags = [...new Set(comments.map(u => u.user_tag))]

            //fetch user IDS, usernames
            const users = await User.find({user_tag:{$in:userTags}},{user_tag:1, username:1}).lean()

            //create object of user_tag:username
            const userObj = Object.fromEntries(users.map(c => [c.user_tag, c.username]))

            //get comment IDs
            const commentIDs = comments.map(c => c.comment_id)
        
            //fetch matching comments whose parents are in the commentIDs
            const children = await Comment.find({parent_comment_id:{$in:commentIDs}},{parent_comment_id:1}).lean()

            //create object of cID:true
            const childrenObj = Object.fromEntries(children.map(c => [c.parent_comment_id, true]))

            //also fetch which likes the user left on which comments
            const likes = await Like.find({user_tag:userTag, item_type:1, item_id:{$in:commentIDs}},
                {item_id:1, value:1, _id:0}
            ).lean()

            //create object of comment_id: like value
            const likesObj = Object.fromEntries(likes.map(l => [l.item_id, l.value]))

            //add to comments in result
            for (let c of comments) {
                c.username = userObj[c.user_tag]
                c.moreReplies = childrenObj[c.comment_id] == undefined ? false : true
                c.userLikeVal = likesObj[c.comment_id]
            }

            return res.json(comments)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/replies/get/:cID", async (req, res) => { //load reply comments for a comment
        try {
            const cID = Number(req.params.cID) //get parent comment id
            const userTag = req.user.user_tag

            //check comment exists
            if (!(await Comment.exists({comment_id:cID}))) { 
                return res.status(409).json({ error: "Comment does not exist!"})
            }

            //get top 20 comments
            let comments = await Comment.find({parent_comment_id:cID},
                {_id:0, comment_id:1, user_tag:1, content:1, like_rating:1, created_at:1}
            )
            .sort({like_rating:-1, _id:1})
            .lean()

           //collect user tags
            const userTags = [...new Set(comments.map(u => u.user_tag))]

            //fetch user IDS, usernames
            const users = await User.find({user_tag:{$in:userTags}},{user_tag:1, username:1}).lean()

            //create object of user_tag:username
            const userObj = Object.fromEntries(users.map(c => [c.user_tag, c.username]))

            //get comment IDs
            const commentIDs = comments.map(c => c.comment_id)
        
            //fetch matching comments whose parents are in the commentIDs
            const children = await Comment.find({parent_comment_id:{$in:commentIDs}},{parent_comment_id:1}).lean()

            //create object of cID:true
            const childrenObj = Object.fromEntries(children.map(c => [c.parent_comment_id, true]))

            //also fetch which likes the user left on which comments
            const likes = await Like.find({user_tag:userTag, item_type:1, item_id:{$in:commentIDs}},
                {item_id:1, value:1, _id:0}
            ).lean()

            //create object of comment_id: like value
            const likesObj = Object.fromEntries(likes.map(l => [l.item_id, l.value]))

            //add to comments in result
            for (let c of comments) {
                c.username = userObj[c.user_tag]
                c.moreReplies = childrenObj[c.comment_id] == undefined ? false : true
                c.userLikeVal = likesObj[c.comment_id]
            }

            return res.json(comments)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/comment/like/:cid/:value", async (req, res) => {
        const cID = req.params.cid
        const val = Number(req.params.value)
        const userTag = req.user.user_tag

        try {
            const comment = await Comment.findOne({comment_id:cID}, {_id:0, like_rating:1, question_id:1, user_tag:1, content:1})

            if (!comment) { //check question exists
                return res.status(409).json({ error: "Comment does not exist!"})
            }
            if (![0, 1, -1].includes(val)) {
                return res.status(409).json({ error: "Invalid like value"})
            }

            const like = await Like.findOne({item_id:cID, item_type:1, user_tag:userTag}, {value:1, _id:0})

            const delta = val - (like ? like.value : 0)

            if (delta == 0) {
                return res.status(200).json({ success: true })
            }

            //UPDATE LIKES

            if (!like && val !== 0) { //if like doesnt exist, create a new one
                await Like.create({
                    item_id: cID,
                    user_tag: userTag,
                    value: val,
                    item_type: 1
                })
            }

            else if (like && val == 0) { //delete existing like if unliking
                await Like.deleteOne(
                    {item_id:cID, 
                    item_type:1, 
                    user_tag:userTag}
                )
            }

            else {
                await Like.updateOne( //otherwise update existing like
                    {
                        item_id:cID, 
                        item_type:1, 
                        user_tag:userTag},
                    {$set: {value: val}},
                )
            }

            //UPDATE COMMENT

            await Comment.updateOne( //update comment rating
                {comment_id: cID},
                {$inc: {like_rating: delta}},
            )

            //update user total like rating
            await User.updateOne(
                {user_tag:userTag},
                {$inc: {total_likes:delta, likes_today:delta}},
            )

            if (comment.user_tag != userTag) {
                if (comment.like_rating+delta % 100 == 0 && comment.like_rating+delta != 0) { //send notification if like threshold
                    await Notification.insertOne({
                        notif_id: await idGenerator(Notification),
                        user_tag: comment.user_tag,
                        question_id: comment.question_id,
                        message: `Your comment "${clip(comment.content, 30)}" just hit ${comment.like_rating+delta} likes!`,
                    })
                }
            }

            return res.status(200).json({
                success:true,
                newLikes:comment.like_rating+delta
            })
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/inbox/:page", async (req, res) => {
        const userTag = req.user.user_tag
        const page = Number(req.params.page)
        const skip = (page-1)*20

        try {
            const notifications = await Notification.find({user_tag:userTag}, //send back first 20 notifications for user
                {_id:0, question_id:1, notif_id:1, message:1, created_at:1, viewed:1}
            )
            .sort({created_at:-1, _id:1})
            .skip(skip)
            .limit(20)
            .lean()

            //make all notifs returned viewed
            const notifIDS = notifications.map(n => n.notif_id)

            if (notifIDS.length > 0) {
                await Notification.updateMany({notif_id:{$in:notifIDS}},
                    {$set:{viewed:true}}
                )
            }

            for (const n of notifications) { //make dates in text format
                n.created_at = convertDate(n.created_at)
            }

            return res.json(notifications)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/user/data/self", async (req, res) => { //return user's usertag
        const userTag = req.user.user_tag

        try {
            const data = await User.findOne({user_tag:userTag},
                {user_tag:1, username:1, school_id:1, country:1, total_likes:1, created_total:1, studied_today:1, studied_total:1, created_at:1, preference_data:1}
            ).lean()

            data.school = (await School.findOne({school_id:data.school_id}, {name:1})).name

            data.created_at = convertDate(data.created_at)

            return res.json(data)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/user/data/:tag", async (req, res) => { //return user's usertag
        const userTag = req.params.tag

        if (userTag == -1) {
            return res.redirect("/home")
        }


        try {
            const data = await User.findOne({user_tag:userTag},
                {user_tag:1, username:1, school_id:1, country:1, total_likes:1, created_total:1, studied_today:1, studied_total:1, created_at:1, preference_data:1, completed_total:1}
            ).lean()

            if (!database) { //check question exists
                return res.status(409).json({ error: "User does not exist!"})
            }

            data.school = (await School.findOne({school_id:data.school_id}, {name:1})).name

            data.created_at = convertDate(data.created_at)

            return res.json(data)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/preferences/update/study/:value", async (req, res) => { 
        const userTag = req.user.user_tag
        const value = Number(req.params.value)


        if (isNaN(value) || value > 90 || value <= 0){
            return res.status(409).json({ error: "Invalid study time entered!"})
        }

        try {
            await User.updateOne({user_tag:userTag}, { //update preference
                $set:{"preference_data.0":value}
            })

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/preferences/update/rest/:value", async (req, res) => { 
        const userTag = req.user.user_tag
        const value = Number(req.params.value)


        if (isNaN(value) || value > 90 || value <= 0){
            return res.status(409).json({ error: "Invalid rest time entered!"})
        }

        try {
            await User.updateOne({user_tag:userTag}, { //update preference
                $set:{"preference_data.1":value}
            })

            return res.status(200).json({success:true})
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/preferences/get", async (req, res) => { //return user's preferences
        const userTag = req.user?.user_tag

        if (!userTag) {
            return res.status(200).json({success:true})
        }

        try {
            const data = await User.findOne({user_tag:userTag},
                {preference_data:1}
            ).lean()

            return res.json(data.preference_data)
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    app.get("/api/homepage", async (req, res) => { //return all homepage questions
        const userTag = req.user?.user_tag

        try {
            const result = []
            result.push({ //get recommended collections
                name:"Recommended",
                questions: (await getRecommendedQuestions(userTag))
            })

            //get latest watched
            const latestWatches = (await Watch.find({user_tag:userTag}, {question_id:1}).limit(20)
            .sort({created_at:-1})).map(w => w.question_id)

            //get watched questions
            const watchedQuestions = await Question.find({question_id:{$in:latestWatches}}, {
                subject_id:1, topic_id:1, name:1, like_rating:1, avg_diff_rating:1, views:1, question_id:1
            }).lean()

            //get latest solved
            const latestSolves = (await Solve.find({user_tag:userTag}, {question_id:1}).limit(20)
            .sort({created_at:-1})).map(s => s.question_id)

            //get solved questions
            const solvedQuestions = await Question.find({question_id:{$in:latestSolves}}, {
                subject_id:1, topic_id:1, name:1, like_rating:1, avg_diff_rating:1, views:1, question_id:1
            }).lean()

            let combinedQuestions = [...watchedQuestions, ...solvedQuestions] //combined array - modify topics and subjects of all questions inside

            //collect topic ids
            const topicIDs = [...new Set(combinedQuestions.map(q => q.topic_id))]

            //fetch topic ids, names, subject_ids
            const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1, subject_id:1})

            //create object of {topic_id:{topic_id, subject_id, name}}
            const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t]))

            //collect subject ids from topics
            const subjectIDs = [...new Set(topics.map(t => t.subject_id))]

            //fetch subject names
            const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, full_name:1})

            //create object of {subject_id:name}
            const subjObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.full_name]))

            //add to questions in result
            for (let q of combinedQuestions) {
                const topic = topicObj[q.topic_id]
                q.topic = topic.name
                q.subject = subjObj[topic.subject_id]
            }

            result.push({ //push to result
                name:"Recently watched questions",
                questions: watchedQuestions
            })

            result.push({ 
                name:"Recently solved questions",
                questions: solvedQuestions,
            })
            
            //get solvelater id
            const solveLaterID = (await Collection.findOne({user_tag:userTag, name:"Solve Later"}, {collection_id:1}))?.collection_id

            if (solveLaterID) { //if they have a solve later collection
                result.push({ //get recommended collections
                    name:"Solve Later",
                    questions: (await getCollectionData(solveLaterID, userTag, res)).question_data,
                    href:`/collection/${solveLaterID}`
                })
            }

            result.push({ //get recommended collections
                name:"Highest like rated",
                questions: (await searchQuestions({
                    sort:"likes", creator:"", topic:"", subject:"", question:"", paper:"-1", content:"", stage:"-1", year:"", tag:"-1", search:""
                }, userTag , res)),
                href:"/search/?stage=-1&subject=&paper=-1&year=&tag=-1&creator=&topic=&search=&sort=likes&page=1&searchType=q"
            })

            result.push({ //find those looking for solution, i.e. tag = 2
                name:"Looking for solution",
                questions: (await searchQuestions({
                    sort:"time", creator:"", topic:"", subject:"", question:"", paper:"-1", content:"", stage:"-1", year:"", tag:"2", search:""
                }, userTag , res)),
                href:"/search/?stage=-1&subject=&paper=-1&year=&tag=2&creator=&topic=&search=&sort=time&page=1&searchType=q"
            })

            const userCollections = await Collection.find({user_tag:userTag}, {collection_id:1, name:1}).lean()
            for (const c of userCollections) {
                //push all of users collections to carousels, except solve later
                if (c.collection_id == solveLaterID) {
                    continue
                }

                result.push({  
                    name: c.name,
                    questions: (await getCollectionData(c.collection_id, userTag, res)).question_data,
                    href:`/collection/${c.collection_id}`
                })
            }

            return res.json(result)

        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: err.message })
        }
    })

    //SERVING HTML FILES

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

    app.get("/search/", isLoggedIn, (req, res) => {
        //return filters that are to be applied as well
        //if filters are invalid, return error page
        res.sendFile(path.join(__dirname, "public", "search.html"))
    })
    
    app.get("/question", isLoggedIn, (req, res) => {
        res.redirect("/home")
    })

    app.get("/question/:id", isLoggedIn, (req, res) => {
        res.sendFile(path.join(__dirname, "public", "question.html"))
    })

    app.get("/collection", isLoggedIn, (req, res) => {
        //process id in link as well
        //if collection is private, check that it belongs to user
        //if collection is not accesible or doesnt exist, return error page
        res.redirect("/home")
    })

    app.get("/collection/:id", isLoggedIn, (req, res) => {
        //process id in link as well
        //if collection is private, check that it belongs to user
        //if collection is not accesible or doesnt exist, return error page
        res.sendFile(path.join(__dirname, "public", "collection.html"))
    })

    app.get("/profile", isLoggedIn, (req, res) => {
        //process id in link as well
        //if profile doesnt exist, return error page
        res.redirect(`/profile/${req.user.user_tag}`)
    })

    app.get("/profile/:id", isLoggedIn, (req, res) => {
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

    app.get("/health", (req, res) => {
        //process + return leaderboard filters in link as well
        res.send("Up")
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
            else if (data.name.length < 2) {
                return res.status(400).json({error: "Name is too short"})
            }
            else if (data.username.length < 2) {
                return res.status(400).json({error: "Username is too short"})
            }
            else if (data.username.length > 20) {
                return res.status(400).json({error: "Username is too long! (max 20 characters)"})
            }
            else if (data.tag.length < 2){
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
                    await SubjectUser.insertMany([{ //create subjectuser entry
                        user_tag: data.tag,
                        subject_id:subjectID.subject_id,
                        ability:0
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

                const hash = await bcrypt.hash(data.password, 10) //hash password
                const user = new User({ //create new user
                    user_tag:data.tag, 
                    password_hash: hash,
                    school_id:newSklID,
                    country:data.country,
                    study_stage:data.stage,
                    username:data.username,
                    full_name:name,
                    email:data.email,
                    
                    created_total:0,
                    created_today:0,
                    studied_total:0,
                    studied_today:0,
                    completed_total:0,
                    completed_today:0,
                    total_likes:0,
                    likes_today:0,

                    preference_data:[50, 10],
                })

                //let data = {name, password, password_1, school, stage, subjects, tag, username, country, email}

                //create solve later
                await Collection.insertOne({
                    user_tag:data.tag,
                    published:false,
                    name:"Solve Later",
                    collection_id: await idGenerator(Collection),
                    tag:1,
                })

                await user.save()
                return res.status(200).json({success:true})
            }
        } catch(err) {
            console.error(err)
            return res.status(500).json({error:err.message}); 
        }
    })

    // Logout
    app.get("/logout", (req, res) => {
        req.logout(() => {
            res.redirect("/")
        });
    })

    //SCROLL INTERACTION
     app.post("/api/scroll/interaction", async (req, res) => { //interaction

        try{
            const userTag = req.user?.user_tag
            const markers = req.body.markers
            const qID = req.body.qID

            //validation
            const user = await User.findOne({user_tag:userTag}, {_id:0, interaction_n:1})
            if (!user) {return res.status(409).json({ error: "User does not exist!"})}

            const question = await Question.findOne({question_id:qID}, {_id:0, difficulty:1, interaction_n:1, subject_id:1})
            if (!question) {return res.status(409).json({ error: "Question does not exist!"})}

            const subjectuser = await SubjectUser.findOne({user_tag:userTag, subject_id:question.subject_id}, {ability:1, _id:0})
            if (!subjectuser) {return res.status(409).json({ error: "User does not study that subject!"})} 

            //get weights from subject
            const subject = await Subject.findOne({subject_id:question.subject_id}, {_id:0, weights:1})
            if (!subject) {return res.status(409).json({ error: "Subject does not exist!"})} 

            const data =   { //calculate interaction output
                m:markers,
                w:subject.weights,
                s_i:subjectuser.ability,
                d:question.difficulty,
                user_interactions:user.interaction_n,
                question_interactions:question.interaction_n
            }

            const result = await sendModelRequest(data, "interaction")

            for (let i = 0; i < markers.length; i++) { //convert true/false markers
                if (markers[i] === true) markers[i] = 1
                else if (markers[i] === false) markers[i] = 0
            }

            //UPDATE WEIGHTS AND VALUES
            await Question.updateOne({question_id:qID},{
                $inc:{difficulty:result.d, interaction_n:1}
            })

            await User.updateOne({user_tag:userTag},{
                $inc:{interaction_n:1}
            })

            const weightUpdates = {}
            result.w.forEach((delta, index) => {
                weightUpdates[`weights.${index}`] = delta
                
            })

            await Subject.updateOne(
                {subject_id:question.subject_id},
                { 
                    $inc: { 
                        ...weightUpdates, // increment each weight index by its specific delta
                        interaction_n: 1 
                    }
                }
            )

            await SubjectUser.updateOne({user_tag:userTag, subject_id:question.subject_id},{
                $inc:{ability:result.s_i}
            })

            return res.status(200).json({success:true})
            
        } catch(err) {
            console.error(err)
            console.log(err)
            return res.status(500).json({error:err.message}); 
        }
    })

    async function getRecommendedQuestions(userTag) {
        //get subject IDs that user does
        const userSBJS = await SubjectUser.find({user_tag:userTag}, {subject_id:1, _id:0, ability:1})

        //send request to python server
        const user = await User.findOne({user_tag:userTag}, {interaction_n:1, _id:0})

        let dataToSendToPython = []
        for (const sbj of userSBJS) { //batch data of all subjects to send 
            dataToSendToPython.push({
                s_i: sbj.ability,
                user_interactions:user.interaction_n,
                sbj_id:sbj.subject_id
            })
        }

        const bands = (await sendModelRequest(dataToSendToPython, "recommendation")).result //send request to model for calculation of bands

        let conditions = []//array to add condtions to
        for (const sbj of userSBJS) {
            let subjectID = sbj.subject_id
            conditions.push({
                subject_id:sbj.subject_id, //match bands to correct subject 
                difficulty: {$gte:bands[subjectID].easy[0], $lte:bands[subjectID].hard[1]}
            }) //query from bottom of range to top
        }

        const questions = await Question.aggregate([ //database query
            {$match:{$or:conditions}},
            {$sample:{size:40}},
            {$project:{
                question_id:1, user_tag:1, name:1, content:1, total_diff_rating:1, like_rating:1, images:1, paper_num:1, question_num:1, tag:1, mark_scheme:1, views:1, year:1, num_comments:1, num_watches:1, num_solves:1, num_diff_ratings:1, study_stage:1, topic_id:1, subject_id:1, difficulty:1
            }}
        ])

        shuffle(questions)

        let result = []
        let notAddedQueue = []
        let currentBandCounts = {easy:0, regular:0, hard:0} //keeps track of how many added so far

        for (const q of questions) { //adds questions of correct bands
            const sbjID = q.subject_id
            const bandsObj = bands[sbjID]

            if (!bandsObj) continue
            
            if (q.difficulty <= bandsObj.easy[1]){ //q in easy band
                if (currentBandCounts.easy < bandCounts.easy) { //if goal not met, push to result
                    result.push(q)
                    currentBandCounts.easy ++
                }
                else { //if not, add to unadded queue
                    notAddedQueue.push(q)
                }
            }
            else if (q.difficulty <= bandsObj.regular[1]) { //q in regular band
                if (currentBandCounts.regular < bandCounts.regular) { //if goal not met, push to result
                    result.push(q)
                    currentBandCounts.regular ++
                }
                else { //if not, add to unadded queue
                    notAddedQueue.push(q)
                }
            }
            else { //q in hard band
                if (currentBandCounts.hard < bandCounts.hard) { //if goal not met, push to result
                    result.push(q)
                    currentBandCounts.hard ++
                }
                else { //if not, add to unadded queue
                    notAddedQueue.push(q)
                }
            }
        }

        if (result.length < 20) { //if result is too short
            const possibleToAdd = notAddedQueue.length //max questions available to add
            const numToAdd = Math.min(possibleToAdd, 20-result.length) //questions to add
            result.push(...notAddedQueue.slice(0, numToAdd)) //add missing if needed
        }

        //collect topic ids
        const topicIDs = [...new Set(result.map(q => q.topic_id))]

        //fetch topic ids, names, subject_ids
        const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1, subject_id:1})

        //create object of {topic_id:{topic_id, subject_id, name}}
        const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t]))

        //collect subject ids from topics
        const subjectIDs = [...new Set(topics.map(t => t.subject_id))]

        //fetch subject names
        const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, full_name:1})

        //create object of {subject_id:name}
        const subjObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.full_name]))
        
        //add to questions in result
        for (let q of result) {
            const topic = topicObj[q.topic_id]
            q.topic = topic.name
            q.subject = subjObj[topic.subject_id]
        }

        return result
    }

    app.post("/api/scroll/recommendation", async (req, res) => { //recommendation
        try{
            const userTag = req.user?.user_tag

            return res.json(await getRecommendedQuestions(userTag))
            
        } catch(err) {
            console.error(err)
            console.log(err)
            return res.status(500).json({error:err.message}); 
        }
    })

    //SCROLL RECOMMENDATION

    app.post("/api/question/save/:id/:publish", async (req, res) => {
        let qID = req.params.id
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
                const subjectID = await Subject.findOne({full_name:data.subject, study_stage:data.stage}, {subject_id:1, study_stage:1})
                if (!subjectID) {
                    return res.status(409).json({ error: "Subject does not exist or is invalid!" })
                }

                //topic check
                const topicID = (await Topic.findOne({subject_id:subjectID.subject_id, name:data.topic}, {topic_id:1}))?.topic_id
                if (!topicID) {
                    return res.status(409).json({ error: "Topic does not exist or is invalid!" })
                }

                data.tag = convertTag(data.tag)

                if (qID == -1 || !(await Question.exists({question_id:qID}))) { //if question doesn't exist, create new
                    qID = await idGenerator(Question)
                    
                    const question = new Question({
                        question_id: qID,
                        topic_id: topicID,
                        user_tag: clientTag,
                        name: data.qname,
                        content: data.qtext,
                        tag: data.tag,
                        mark_scheme: data.mstext,
                        published:publish,
                        study_stage:subjectID.study_stage,
                        subject_id:subjectID.subject_id,
                    })

                    await question.save()
                }
                else { //if question already exists
                    await Question.updateOne({question_id: qID}, {$set: {
                        topic_id: topicID,
                        name: data.qname,
                        content: data.qtext,
                        tag: data.tag,
                        mark_scheme: data.mstext,
                        published:publish,
                        study_stage:subjectID.study_stage,
                        subject_id:subjectID.subject_id,
                    }})
                }

                if(publish) { //if published, update user question num and redirect to question page

                    //update number user has created 

                    await User.updateOne(
                        {user_tag: clientTag},
                        {$inc:{created_today:1, created_total:1, }}
                    )

                    return res.status(200).json({
                        success: true,
                        redirect: `/question/${qID}`
                    })
                }

                //otherwise if question still private, redirect to create page

                return res.status(200).json({
                    success: true,
                    redirect: `/create/${qID}`
                })
            }
        } catch(err) {
            console.error(err)
            return res.status(500).json({error:err.message}); 
        }
    })

    app.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: err.message })
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

    app.post("/api/comments/create/:qID/:rID", async (req, res) => {
        const text = req.body.com
        const userTag = req.user.user_tag
        const qID = req.params.qID
        const rID = req.params.rID

        try{
            //validation

            if (validate(text, res)) return //validate for profanities/links

            if (text.length > 200) {
                return res.status(400).json({error: "Max comment length is 200 characters"})
            }
            else {
                const question = await Question.findOne({question_id:qID}, {user_tag:1, name:1})
                //check question exists
                if (!question) { 
                    return res.status(409).json({ error: "Question does not exist!"})
                }

                //REPLY IF STATEMENT - handles replies

                //check parent comment exists and is of the same question
                if (rID != "0") { //get question ID of parent comment
                    const parentComment = await Comment.findOne({comment_id:rID}, {question_id:1, _id:0, user_tag:1, content:1})

                    if (!parentComment) {
                        return res.status(409).json({ error: "Parent comment does not exist!"})
                    }

                    if (parentComment.question_id != qID) {
                        return res.status(409).json({ error: "Reply and comment must be of same question!"})
                    }
                    
                    if (userTag != parentComment.user_tag) {                    
                        await Notification.insertOne({ //create notification for parent comment creator
                            notif_id: await idGenerator(Notification),
                            user_tag:parentComment.user_tag,
                            question_id:qID,
                            message:`User <a href="/profile/${userTag}">@${userTag}</a> replied to your comment "${clip(parentComment.content, 30)}" on question ${question.name}: "${clip(text, 30)}"`
                        })
                    }
                }

                await Comment.insertOne({
                    comment_id:await idGenerator(Comment),
                    question_id:qID,
                    user_tag:userTag,
                    content:text,
                    like_rating:0,
                    parent_comment_id: (rID == "0" ? undefined : rID) //sets parent comment id if exists
                })

                await Question.updateOne({question_id:qID}, //update number of comments in question
                    {$inc:{num_comments:1}}
                )
                
                if (userTag != question.user_tag) {            
                    await Notification.insertOne({ //create notification for question creator
                        notif_id: await idGenerator(Notification),
                        user_tag:question.user_tag,
                        question_id:qID,
                        message:`User <a href="/profile/${userTag}">@${userTag}</a> commented on your question ${question.name}: "${clip(text, 30)}"`
                    })
                }

                //NOTIFICATIONS FOR ALL WHO WATCH QUESTION
                //get watches
                const watches = await Watch.find({question_id:qID}, {_id:0, user_tag:1}).lean()
                const watchUsers = watches.map(w => w.user_tag) //list of relevant user tags

                //generate list of new notifications
                const notifications = []
                for (const tag of watchUsers) {
                    if (tag == userTag) continue //ignore current user

                    notifications.push({
                        notif_id: await idGenerator(Notification),
                        user_tag:tag,
                        question_id:qID,
                        message: `User <a href="/profile/${userTag}">@${userTag}</a> commented on your watched question ${question.name}: "${clip(text, 30)}"`
                    })
                }

                if (notifications.length > 0) { //add notifs
                    await Notification.insertMany(notifications)
                }

                return res.status(200).json({success:true})
            }
        } catch(err) {
            console.error(err)
            return res.status(500).json({error:err.message}); 
        }
    })

    //=============
    //PYTHON SERVER
    //=============
    let startPythonServer
    try{
        startPythonServer = async function startPythonServer() { //start python server

            const pyServer = spawn("uvicorn", ["model:app", "--port", "8000"], {
                cwd:__dirname, shell:true
            })

            pyServer.stdout.on('data', (data) => { //console messages
                console.log(`Python: ${data}`)
            })

            pyServer.stderr.on('data', (data) => {
                console.error(`Python Error: ${data}`)
            })

            pyServer.on('close', (code) => {
                console.log(`Python server exited with code ${code}`)
                process.exit()
            })

            process.on('SIGINT', () => { //kill when signout
                pythonProcess.kill();
                process.exit();
            });

            process.on("uncaughtException", (err) => {
                console.error(err)
                pyServer.kill();
                process.exit(1);
            });

            process.on("exit", () => pyServer.kill()) //kill when server ends

            return pyServer
        }
    }
    catch(err) {console.log(err)}

    async function resetDailyTotals(scheduleNew) {
        const lastReset = (await ServerData.findOne({})).time
        const now = new Date()

        //check if it needs to be reset rn
        if (!(lastReset.getDate() == now.getDate() 
            && lastReset.getFullYear() == now.getFullYear()
            && lastReset.getMonth() == now.getMonth())) { //if day is not the same

            //update all user values to 0
            
            await User.updateMany({}, {
                $set:{studied_today:0,
                    completed_today:0,
                    likes_today:0,
                    created_today:0
                }
            })

            //delete all notifications that are older than 365 days

            let date365ago = new Date()
            date365ago.setFullYear(date365ago.getFullYear()-1)

            await Notification.deleteMany({
                created_at:{$lt:date365ago}, viewed:true
            })


            console.log("RESET NOW!!!", now)

            //update last reset
            await ServerData.updateOne({},{
                $set:{time:now}
            })
        }

        if (scheduleNew){
            setTimeout(() => resetDailyTotals(true), day)
        }

    }

    //calculate ms to midnight
    function msToMidnight() {
        const now = new Date()
        const nextMidnight = new Date(
            now.getFullYear(), //this year
            now.getMonth(), //this month
            now.getDate() + 1, // tomorrow
            0, 0, 0, 0         // midnight
        )
        return nextMidnight - now
    }
    
    
    async function loadServer() {
        await mongoose.connect(hostUrl)
        .then(() => {
            console.log("mongodb connected")})
        .catch(err => console.error(err))

        if (!RENDER) {
            const pyServer = await startPythonServer()
        }

        resetDailyTotals(false)
        setTimeout(() => resetDailyTotals(true), msToMidnight())
    }

    loadServer()
}