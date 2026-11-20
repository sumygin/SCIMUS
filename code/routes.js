const path = require("path")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const validator = require("validator")
const leo = require("leo-profanity")
const {rateLimit, ipKeyGenerator} = require("express-rate-limit")

const config = require("./config")
const countries = require("./public/resources/countries.json")
const {User, Subject, Topic, School, Question, Collection, QuestionCollection,
    Like, Solve, Watch, Comment, Notification, Rate, SubjectUser} = require("./database")

const minute = 1000 * 60
const pageSize = 20

const bandCounts = { //number of questions from each band per batch
    regular: 18,
    hard:8,
    easy:5
}

const QsortMap = { //quickly maps value of sort to a sort object
    "views":{views:-1}, //highest views first
    "easy":{avg_diff_rating:1}, //lowest difficulty first
    "hard":{avg_diff_rating:-1}, //highest difficulty first
    "likes":{like_rating:-1}, //highest likes first
    "comments":{num_comments:-1}, //highest comments first
    "rates":{num_diff_ratings:-1}, //highest number of ratings first
    "num":{question_num:1}, //ascending by question number
    "time":{created_at:-1}, //largest date (youngest) first
}

const CsortMap = { //quickly maps value of sort to a sort object
    "num":{question_num:-1}, //descending by number of questions
    "time":{created_at:-1}, //largest date (youngest) first
}

const LBsortMap = {
    "time":["studied_total", "studied_today"],
    "qcreate":["created_total", "created_today"],
    "qcomplete":["completed_total", "completed_today"],
    "likes":["total_likes", "likes_today"],
}

//fields sent back for lists of questions (search, collections, carousels)
const questionListFields = {
    _id:0, question_id:1, user_tag:1, name:1, content:1, total_diff_rating:1, avg_diff_rating:1, like_rating:1,
    paper_num:1, question_num:1, tag:1, views:1, year:1, num_comments:1, num_watches:1, num_solves:1,
    num_diff_ratings:1, study_stage:1, topic_id:1, subject_id:1
}

const tagPattern = /^[a-z0-9_.-]{2,20}$/
const reservedTags = ["admin", "self", "scimus"]

//data anyone can read without an account. everything else, and anything that changes data, needs a login
const publicApi = ["/subjects/names/", "/schools/names", "/topics/names/", "/subject/papers/", "/preferences/get", "/me", "/stats", "/scroll/guest",
    "/homepage", "/search/", "/question/get/", "/collection/get/", "/comments/get/", "/replies/get/", "/lb/", "/user/data/"]

//an error that is safe to show to the user
function fail(status, message, redirect) {
    const err = new Error(message)
    err.status = status
    err.expose = true
    err.redirect = redirect
    return err
}

function shuffle(list) {//shuffles a list
    for (let i = list.length - 1; i > 0; i--) {
        const randomPos = Math.floor(Math.random() * (i + 1)) //can never exceeed last pos index

        //now swap
        if (randomPos != i) {
            const temp = list[i]
            list[i] = list[randomPos]
            list[randomPos] = temp
        }
    }

    return list
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

async function idGenerator(model, field) {
    let id
    let exists
    do {
        id = Math.floor(Math.random()*90000000) + 10000000 //8-digit id
        exists = await model.exists({[field]:id})
    } while (exists)
    return id
}

//everything coming from the client goes through these before touching the database

function toText(val, max = 200) { //always a trimmed string, never an object/array
    if (typeof val != "string" && typeof val != "number") return ""
    return String(val).trim().substring(0, max)
}

function toID(val) { //positive whole number or NaN
    if (typeof val != "string" && typeof val != "number") return NaN
    if (!/^\d{1,15}$/.test(String(val))) return NaN
    return Number(val)
}

function toSkip(val) { //page number -> number of results to skip
    const page = toID(val)
    if (isNaN(page) || page < 1) return 0
    return (Math.min(page, 500)-1)*pageSize
}

function escapeRegex(txt) {
    return txt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function preview(html) { //short plain text version of question content
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    return text.substring(0, 61).trim() + (text.length > 61 ? "..." : "")
}

function validate(field) { //returns an error message if the text is not allowed
    if (typeof field != "string" || field == "") {
        return "Fields cannot be empty!"
    }

    const urls = field.match(/https?:\/\/[^\s]+/g) || [] //check for links
    for (const url of urls) { //go through flagged urls and check them
        if (validator.isURL(url)) {
            return "No links allowed!"
        }
    }

    if (leo.check(field)) { //check for profanities
        return "Profanities are not allowed"
    }

    if (field.includes(">") || field.includes("<")) {
        return `">" or "<" characters are not allowed!`
    }
}

function convertStudyStage(val) {
    if (val == 0) {
        return "GCSE"
    }
    if (val == 1) {
        return "A-level"
    }
    if (val == 2) {
        return "University+"
    }
}

function convertTag(val) {
    if (val == "solution"){
        return 2
    }
    else if (val == "user") {
        return 1
    }
    else if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Official"
    }
    else if (Number(val) == 2) {
        return "Looking for solution"
    }
}

function convertCollectionTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Past paper"
    }
}

async function sendModelRequest(data, requestType) { //python model request
    const headers = {"Content-Type": "application/json"}
    if (config.MODEL_KEY) headers["x-model-key"] = config.MODEL_KEY

    const result = await fetch(`${config.MODEL_URL}/api/${requestType}`, {
        method:"POST",
        headers: headers,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000)
    })

    if (!result.ok) {
        throw new Error(`Model server responded with ${result.status}`)
    }

    return await result.json()
}

function limiter(windowMs, limit, message, keyGenerator) {
    return rateLimit({
        windowMs: windowMs,
        limit: limit,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: keyGenerator || (req => ipKeyGenerator(req.ip)),
        message: {error: message}
    })
}

const byUser = req => req.user?.user_tag || ipKeyGenerator(req.ip)

const loginLimiter = rateLimit({ //per account + ip, so a whole school behind one ip doesn't get locked out
    windowMs: 15*minute,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: req => `${ipKeyGenerator(req.ip)} ${toText(req.body?.tag_login, 20).toLowerCase()}`,
    message: {error: "Too many login attempts, please try again later"}
})
const registerLimiter = limiter(60*minute, 10, "Too many accounts created, please try again later")
const apiLimiter = limiter(minute, 300, "Too many requests, slow down a bit", byUser)
const commentLimiter = limiter(minute, 10, "You are commenting too fast", byUser)
const saveLimiter = limiter(10*minute, 30, "You are saving too often, please wait a bit", byUser)
const collectionLimiter = limiter(minute, 30, "Too many collection changes, slow down a bit", byUser)

module.exports = function(app) {

    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy(
        {
            usernameField: 'tag_login',
            passwordField: 'password_login'
        },
        async (tag_login, password_login, done) => {
            try {
                const user = await User.findOne({ user_tag: tag_login }, {password_hash:1})

                //same message for both so tags can't be guessed from the login form
                if (!user || !user.password_hash) {
                    return done(null, false, { message: "Incorrect user tag or password" })
                }

                const match = await bcrypt.compare(password_login, user.password_hash)

                if (!match) {
                    return done(null, false, { message: "Incorrect user tag or password" })
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
            const user = await User.findById(id, {user_tag:1}).lean()
            done(null, user || false)
        } catch (err) {
            done(err)
        }
    })

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next()
        res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`) //come back here after logging in
    }

    //every api route needs a logged in user unless it only reads public data
    app.use("/api", apiLimiter, (req, res, next) => {
        if (req.isAuthenticated()) return next()

        const isPublic = req.method == "GET" && req.path != "/user/data/self" && publicApi.some(p => req.path.startsWith(p))
        if (isPublic) return next()

        res.status(401).json({error: "Please log in first", redirect: "/login"})
    })

    app.get("/api/me", (req, res) => { //lets pages know whether someone is logged in
        res.json({user_tag: req.user?.user_tag || null})
    })

    //totals for the welcome page, worked out at most every 10 minutes
    let stats

    app.get("/api/stats", async (req, res) => {
        if (!stats || Date.now() - stats.time > 10*minute) {
            const [questions, subjects, boards] = await Promise.all([
                Question.countDocuments({published:true}),
                Subject.countDocuments({}),
                Subject.distinct("exam_board"),
            ])

            //"OCR A" and "OCR MEI" are both OCR
            const boardNames = [...new Set(boards.filter(b => b).map(b => b.split(" ")[0]))].sort()

            stats = {time: Date.now(), data: {questions, subjects, boards: boardNames}}
        }

        res.json(stats.data)
    })

    //errors thrown with fail() end up here
    function sendFail(err, req, res, next) {
        if (!err.expose || res.headersSent) return next(err)

        const body = {error: err.message}
        if (err.redirect) {
            body.success = false
            body.redirect = err.redirect
        }
        res.status(err.status).json(body)
    }

    //adds topic and subject names to a list of questions
    async function addTopicNames(questions) {
        //collect topic ids
        const topicIDs = [...new Set(questions.map(q => q.topic_id))]

        //fetch topic ids, names, subject_ids
        const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1, subject_id:1}).lean()

        //create object of {topic_id:{topic_id, subject_id, name}}
        const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t]))

        //collect subject ids from topics
        const subjectIDs = [...new Set(topics.map(t => t.subject_id))]

        //fetch subject names
        const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, full_name:1}).lean()

        //create object of {subject_id:name}
        const subjObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.full_name]))

        //add to questions in result
        for (const q of questions) {
            const topic = topicObj[q.topic_id]
            q.topic = topic?.name || ""
            q.subject = subjObj[topic?.subject_id] || ""
            if (q.content) q.content = preview(q.content)
        }

        return questions
    }

    //finds a question the user is allowed to see (published, or their own)
    async function getVisibleQuestion(qID, userTag, fields) {
        if (isNaN(qID)) return null

        const question = await Question.findOne({question_id:qID}, {...fields, user_tag:1, published:1})
        if (!question || (!question.published && question.user_tag != userTag)) return null

        return question
    }

    //ROUTES

    app.get("/api/subjects/names/:stage", async (req, res) => {
        const stage = toID(req.params.stage)
        if (![0, 1, 2].includes(stage)) return res.json([])

        const subjects = await Subject.find({study_stage: stage}, {name:1, _id:0, exam_board:1})
        const names  = subjects.map(s => s.exam_board + " " + s.name)
        res.json(names)
    })

    app.get("/api/schools/names", async (req, res) => {
        const schools = await School.find({}, {name:1, _id:0})
        const names = schools.map(s => s.name)
        res.json(names)
    })

    app.get("/api/topics/names/:subject", async (req, res) => {
        const sbj = toText(req.params.subject)
        const sbjID = (await Subject.findOne({full_name:sbj}, {_id:0, subject_id:1}))?.subject_id //find subject
        if (sbjID == undefined) return res.json([])

        const topics = await Topic.find({subject_id:sbjID}, {name:1, _id:0}) //find all topics for that subject
        const names  = topics.map(s => s.name)
        res.json(names)
    })

    app.get("/api/create/get/:id", async (req, res) => {
        const qID = toID(req.params.id)
        const userTag = req.user?.user_tag

        const question = isNaN(qID) ? null : await Question.findOne( //query question
            {question_id:qID},
            {name:1, topic_id:1, user_tag:1, content:1, tag:1, mark_scheme:1, published:1, _id:0})

        //if it doesn't exist or is not by the user, then dont show it to them
        if (!question || question.user_tag != userTag) {
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

        const topic = await Topic.findOne( //query topic
            {topic_id:question.topic_id},
            {_id:0, name:1, subject_id:1}
        )

        const subject = await Subject.findOne( //query subject
            {subject_id:topic?.subject_id},
            {_id:0, full_name:1, study_stage:1}
        )

        if (!topic || !subject) { //if any are not found, redirect to empty
            return res.status(400).json({
                success: false,
                redirect: `/create`
            })
        }

        return res.json({
            stage: subject.study_stage,
            subject:subject.full_name,
            topic:topic.name,
            tag:question.tag == 2 ? "solution" : "user",
            qname:question.name,
            qtext:question.content,
            mstext:question.mark_scheme
        })
    })

    app.get("/api/question/get/:id", async (req, res) => {
        const qID = toID(req.params.id)
        const userTag = req.user?.user_tag

        const question = await getVisibleQuestion(qID, userTag,
            {name:1, topic_id:1, content:1, tag:1, mark_scheme:1, _id:0, year:1,
                num_diff_ratings:1, total_diff_rating:1, like_rating:1, paper_num:1, question_num:1, views:1,
                num_comments:1, num_collections:1, num_solves:1, num_watches:1
            })

        //if doesn't exist or private and not owned by the user, then redirect to home
        if (!question) {
            return res.status(404).json({
                success: false,
                redirect: `/home`
            })
        }

        //if private, and owned by the user, redirect to question creation
        if (!question.published) {
            return res.status(409).json({
                success: false,
                redirect: `/create/${qID}`
            })
        }

        const topic = await Topic.findOne( //query topic
            {topic_id:question.topic_id},
            {_id:0, name:1, subject_id:1}
        )

        const subject = await Subject.findOne( //query subject
            {subject_id:topic?.subject_id},
            {_id:0, full_name:1, study_stage:1, spec:1, formulas:1}
        )

        if (!topic || !subject) { //if any are not found, redirect to home
            return res.status(404).json({
                success: false,
                redirect: `/home`
            })
        }

        await Question.updateOne(
            {question_id:qID},
            {$inc: {views:1}}
        )

        let extra = {like:0, watch:false, solve:false, rate:false} //guests haven't done anything to it

        if (userTag) {
            const userLiked = (await Like.findOne({item_id:qID, user_tag:userTag, item_type:0}, {_id:0, value:1}))?.value

            extra = {
                like: userLiked == undefined ? 0 : userLiked,
                watch: !!(await Watch.exists({question_id:qID, user_tag:userTag})),
                solve: !!(await Solve.exists({question_id:qID, user_tag:userTag})),
                rate: !!(await Rate.exists({question_id:qID, user_tag:userTag})),
            }
        }

        return res.json({
            stage: convertStudyStage(subject.study_stage),
            subject: subject.full_name,
            paper: question.paper_num || "",
            question: question.question_num || "",
            topic: topic.name || "",
            year: question.year || "",
            name: question.name,
            user_tag: "@" + question.user_tag,
            rating: question.num_diff_ratings ? (question.total_diff_rating/question.num_diff_ratings) : 0,
            views: question.views + 1,
            qtext: question.content,
            mstext: question.mark_scheme,
            formula: subject.formulas || "",
            spec: subject.spec || "",
            likes: question.like_rating,
            watches: question.num_watches,
            solves: question.num_solves,
            ratings: question.num_diff_ratings,
            comments: question.num_comments,
            collections: question.num_collections,
            tag: convertTag(question.tag),
            extra: extra,
        })
    })

    app.post("/api/watch/add/:qid", async (req, res) => {
        const qID = toID(req.params.qid)
        const userTag = req.user?.user_tag

        if (!await getVisibleQuestion(qID, userTag)) { //check question exists
            return res.status(404).json({ error: "Question does not exist!"})
        }

        if (await Watch.exists({question_id:qID, user_tag:userTag})) { //check there is not already a watch
            return res.status(409).json({ error: "Question already marked as watched!"})
        }

        await Watch.create({
            question_id:qID,
            user_tag: userTag
        })

        await Question.updateOne(
            {question_id:qID},
            {$inc:{num_watches:1}}
        )

        return res.status(200).json({success:true})
    })

    app.post("/api/solve/add/:qid", async (req, res) => {
        const qID = toID(req.params.qid)
        const userTag = req.user?.user_tag

        if (!await getVisibleQuestion(qID, userTag)) { //check question exists
            return res.status(404).json({ error: "Question does not exist!"})
        }

        if (await Solve.exists({question_id:qID, user_tag:userTag})) { //check there is not already a solve
            return res.status(409).json({ error: "Question already marked as solved!"})
        }

        await Solve.create({
            question_id:qID,
            user_tag: userTag
        })

        await Question.updateOne(
            {question_id:qID},
            {$inc:{num_solves:1}}
        )

        await User.updateOne( //increment questions completed
            {user_tag:userTag},
            {$inc:{completed_today:1, completed_total:1}}
        )

        return res.status(200).json({success:true})
    })

    app.post("/api/watch/remove/:qid", async (req, res) => {
        const qID = toID(req.params.qid)
        const userTag = req.user?.user_tag

        if (isNaN(qID) || !(await Watch.exists({question_id:qID, user_tag:userTag}))) { //check there is a watch
            return res.status(409).json({ error: "Question not already marked as watched!"})
        }

        await Watch.deleteMany({
            question_id:qID,
            user_tag: userTag
        })

        await Question.updateOne(
            {question_id:qID, num_watches:{$gt:0}},
            {$inc:{num_watches:-1}}
        )

        return res.status(200).json({success:true})
    })

    app.post("/api/solve/remove/:qid", async (req, res) => {
        const qID = toID(req.params.qid)
        const userTag = req.user?.user_tag

        if (isNaN(qID) || !(await Solve.exists({question_id:qID, user_tag:userTag}))) { //check there is a solve
            return res.status(409).json({ error: "Question not already marked as solved!"})
        }

        await Solve.deleteMany({
            question_id:qID,
            user_tag: userTag
        })

        await Question.updateOne(
            {question_id:qID, num_solves:{$gt:0}},
            {$inc:{num_solves:-1}}
        )

        await User.updateOne( //decrement questions completed
            {user_tag:userTag, completed_total:{$gt:0}},
            {$inc:{completed_total:-1}}
        )
        await User.updateOne(
            {user_tag:userTag, completed_today:{$gt:0}},
            {$inc:{completed_today:-1}}
        )

        return res.status(200).json({success:true})
    })

    //shared by question and comment likes. itemType 0 = question, 1 = comment
    async function updateLike(itemID, itemType, val, userTag) {
        const like = await Like.findOne({item_id:itemID, item_type:itemType, user_tag:userTag}, {value:1, _id:0})

        const delta = val - (like ? like.value : 0)

        if (delta == 0) return 0

        if (!like) { //if like doesnt exist, create a new one
            await Like.create({
                item_id: itemID,
                user_tag: userTag,
                value: val,
                item_type: itemType
            })
        }

        else if (val == 0) { //delete existing like if unliking
            await Like.deleteMany({item_id:itemID, item_type:itemType, user_tag:userTag})
        }

        else {
            await Like.updateOne( //otherwise update existing like
                {item_id:itemID, item_type:itemType, user_tag:userTag},
                {$set: {value: val}},
            )
        }

        return delta
    }

    app.post("/api/like/:qid/:value", async (req, res) => {
        const qID = toID(req.params.qid)
        const val = Number(req.params.value)
        const userTag = req.user?.user_tag

        const question = await getVisibleQuestion(qID, userTag, {_id:0, like_rating:1, name:1})

        if (!question) { //check question exists
            return res.status(404).json({ error: "Question does not exist!"})
        }
        if (![0, 1, -1].includes(val)) {
            return res.status(400).json({ error: "Invalid like value"})
        }

        const delta = await updateLike(qID, 0, val, userTag)
        const newLikes = question.like_rating + delta

        if (delta != 0) {
            await Question.updateOne( //update question like rating
                {question_id: qID},
                {$inc: {like_rating: delta}},
            )

            //update creator's total like rating
            await User.updateOne(
                {user_tag:question.user_tag},
                {$inc: {total_likes:delta, likes_today:delta}},
            )

            //send notification every 100 likes
            if (question.user_tag != userTag && delta > 0 && newLikes > 0 && newLikes % 100 == 0) {
                await Notification.create({
                    notif_id: await idGenerator(Notification, "notif_id"),
                    user_tag: question.user_tag,
                    question_id: qID,
                    message: `Your question ${question.name} just hit ${newLikes} likes!`,
                })
            }
        }

        return res.status(200).json({
            success:true,
            newLikes:newLikes
        })
    })

    app.post("/api/rate/:qid/:value", async (req, res) => {
        const qID = toID(req.params.qid)
        const val = Number(req.params.value)
        const userTag = req.user?.user_tag

        const question = await getVisibleQuestion(qID, userTag,
            {_id:0, num_diff_ratings:1, total_diff_rating:1})

        if (!question) { //check question exists
            return res.status(404).json({ error: "Question does not exist!"})
        }
        if (![1, 2, 3, 4, 5].includes(val)) {
            return res.status(400).json({ error: "Invalid rate value"})
        }

        const rate = await Rate.findOne({question_id:qID, user_tag:userTag}, {value:1, _id:0})

        const delta = val - (rate ? rate.value : 0)
        let deltaRateNum = 0

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

        else if (delta != 0) {
            await Rate.updateOne( //otherwise update existing rate
                {question_id:qID, user_tag:userTag},
                {$set: {value: val}},
            )
        }

        //UPDATE QUESTION

        const newTotal = question.total_diff_rating + delta
        const newNum = question.num_diff_ratings + deltaRateNum
        const newAverage = newNum > 0 ? newTotal/newNum : 0

        if (delta != 0) {
            await Question.updateOne( //update question rating
                {question_id: qID},
                {
                    $inc: {total_diff_rating:delta, num_diff_ratings:deltaRateNum},
                    $set: {avg_diff_rating:newAverage}
                },
            )
        }

        return res.status(200).json({
            success:true,
            newRate: newNum,
            newAvg:newAverage
        })
    })

    app.get("/api/subject/papers/:name", async (req, res) => { //get paper number from subject name
        const name = toText(req.params.name)
        const subject = await Subject.findOne({full_name:name}, {papers:1, _id:0})
        if (!subject) {
            return res.status(404).json({ error: "Invalid subject"})
        }
        return res.json(subject.papers)
    })

    app.post("/api/timer/add/:time", async (req, res) => { //add time studied to user account
        const userTag = req.user?.user_tag
        let time = toID(req.params.time)

        if (isNaN(time) || time > 90*minute) {
            return res.status(400).json({ error: "Invalid time value!"})
        }

        const user = await User.findOne({user_tag:userTag}, {created_at:1, last_study_credit:1})
        if (!user) {
            return res.status(404).json({ error: "Invalid user tag"})
        }

        //can't have studied for longer than the time since the last study session was added
        const lastCredit = user.last_study_credit || user.created_at
        if (lastCredit) {
            time = Math.min(time, Date.now() - lastCredit.getTime())
        }
        time = Math.max(0, Math.floor(time))

        await User.updateOne({user_tag:userTag}, {
            $inc:{studied_today:time, studied_total:time},
            $set:{last_study_credit:new Date()}
        })

        return res.status(200).json({
            success:true
        })
    })

    //reads search filters from the query string and checks them, same for questions and collections
    async function readSearch(query, userTag) {
        const data = {
            creator: toText(query.creator, 30),
            paper: toText(query.paper, 5) || "-1",
            stage: toText(query.stage, 5) || "-1",
            subject: toText(query.subject, 100),
            tag: toText(query.tag, 5) || "-1",
            topic: toText(query.topic, 100),
            year: toText(query.year, 6),
            search: toText(query.search, 100),
            sort: toText(query.sort, 20),
            skip: toSkip(query.page),
            own: false,
        }

        if (data.creator.startsWith("@")) data.creator = data.creator.slice(1) //remove @ at the start
        data.creator = data.creator.toLowerCase()
        data.own = !!userTag && data.creator == userTag //only the creator can see their unpublished stuff

        if (data.year != "" && isNaN(toID(data.year))){ //check that year is a number
            throw fail(400, "Invalid year number!")
        }

        if (!["-1", "0", "1", "2"].includes(data.stage)) {
            throw fail(400, "Invalid study stage!")
        }

        if (!["-1", "0", "1", "2"].includes(data.tag)) {
            throw fail(400, "Invalid type!")
        }

        if (data.paper != "-1" && isNaN(toID(data.paper))) {
            throw fail(400, "Invalid paper number!")
        }

        if (data.paper != "-1" && data.subject == "") { //if paper without subject
            throw fail(400, "Cannot search paper without subject!")
        }

        if (data.stage == "-1" && (data.subject != "" || data.topic != "")) {//if subject/topic without study stage
            throw fail(400, "Cannot search subject/topic without study stage!")
        }

        if (data.topic != "" && data.subject == "") { //if topic without subject
            throw fail(400, "Cannot search topic without subject!")
        }

        //find subject
        if (data.subject != "") {
            const subject = await Subject.findOne({full_name:data.subject, study_stage:Number(data.stage)}, {subject_id:1, _id:0})
            if (!subject) {
                throw fail(400, "No such subject found")
            }
            data.subject_id = subject.subject_id
        }

        //find topic
        if (data.topic != "") {
            const topic = await Topic.findOne({name:data.topic, subject_id:data.subject_id}, {topic_id:1, _id:0})
            if (!topic) {
                throw fail(400, "No such topic found")
            }
            data.topic_id = topic.topic_id
        }

        return data
    }

    async function searchQuestions(query, userTag) {
        const data = await readSearch(query, userTag)

        const filter = {}

        if (!data.own) filter.published = true
        if (data.creator != ""){filter.user_tag = data.creator}
        if (data.paper != "-1"){filter.paper_num = Number(data.paper)}
        if (data.stage != "-1"){filter.study_stage = Number(data.stage)}
        if (data.subject != ""){filter.subject_id = data.subject_id}
        if (data.tag != "-1"){filter.tag = Number(data.tag)}
        if (data.topic != ""){filter.topic_id = data.topic_id}
        if (data.year != ""){filter.year = Number(data.year)}

        if (data.search != ""){
            const text = escapeRegex(data.search)
            filter.$or = [ //check matches in any of mark scheme, title, content
                {name:{$regex: text, $options: "i"}},
                {content:{$regex: text, $options: "i"}},
                {mark_scheme:{$regex: text, $options: "i"}}
            ]
        }

        const sortVal = {...(QsortMap[data.sort] || QsortMap.views), _id:1} //default sort is views, _id enforces specific order

        const result = await Question.find(filter, questionListFields) //find specified questions
        .sort(sortVal)
        .skip(data.skip)
        .limit(pageSize)
        .lean()

        return await addTopicNames(result)
    }

    app.get("/api/search/question/", async (req, res) => { //respond to question searches
        return res.json(await searchQuestions(req.query, req.user?.user_tag))
    })

    app.get("/api/search/collection/", async (req, res) => { //respond to collection searches
        const data = await readSearch(req.query, req.user?.user_tag)

        const filter = {}

        if (!data.own) filter.published = true
        if (data.creator != ""){filter.user_tag = data.creator}
        if (data.paper != "-1"){filter.paper = Number(data.paper)}
        if (data.stage != "-1"){filter.stages = Number(data.stage)}
        if (data.subject != ""){filter.subject_ids = data.subject_id}
        if (data.tag != "-1" && data.tag != "2"){filter.tag = Number(data.tag)}
        if (data.topic != ""){filter.topic_ids = data.topic_id}
        if (data.year != ""){filter.year = Number(data.year)}

        filter.question_num = { $gt: 0 }

        if (data.search != ""){
            filter.name = {$regex: escapeRegex(data.search), $options: "i"} //check matches in title
        }

        const sortVal = {...(CsortMap[data.sort] || CsortMap.time), _id:1} //default sort is time, _id enforces specific order for paging

        const result = await Collection.find(filter, {
            _id:0, collection_id:1, user_tag:1, name:1, tag:1, stages:1, paper:1, year:1, question_num:1,
            topic_ids:1, subject_ids:1, preview:1
        }) //find specified collections
        .sort(sortVal)
        .skip(data.skip)
        .limit(pageSize)
        .lean()

        //collect topic ids
        const topicIDs = [...new Set(result.map(c => c.topic_ids[0]))]

        //fetch topic ids, names
        const topics = await Topic.find({topic_id:{$in:topicIDs}},{topic_id:1, name:1})

        //create object of {topic_id:name}
        const topicObj = Object.fromEntries(topics.map(t => [t.topic_id, t.name]))

        //collect subject ids
        const subjectIDs = [...new Set(result.map(c => c.subject_ids[0]))]

        //fetch subject ids, names
        const subjects = await Subject.find({subject_id:{$in:subjectIDs}},{subject_id:1, name:1})

        //create object of {subject_id:name}
        const subjectObj = Object.fromEntries(subjects.map(s => [s.subject_id, s.name]))

        //add to collections in result. only the first name is shown, the rest are just counted
        for (const c of result) {
            const topics = Array(c.topic_ids.length).fill(null)
            if (topics.length > 0) topics[0] = topicObj[c.topic_ids[0]] || ""
            const subjects = Array(c.subject_ids.length).fill(null)
            if (subjects.length > 0) subjects[0] = subjectObj[c.subject_ids[0]] || ""
            c.topics = topics
            c.subjects = subjects
        }

        return res.json(result)
    })

    app.get("/api/lb/", async (req, res) => { //respond to leaderboard request
        const school = toText(req.query.school, 80)
        const country = toText(req.query.country, 60)
        const time = toText(req.query.time, 2)
        const sort = toText(req.query.sort, 20)
        const skip = toSkip(req.query.page)

        const filter = {}

        if (school != "") { //check school exists
            const schoolEntry = await School.findOne({name:school}, {school_id:1, _id:0}).lean()
            if (!schoolEntry) {
                return res.status(400).json({error:"No such school found"})
            }
            filter.school_id = schoolEntry.school_id
        }

        if (country != "") {filter.country = country}

        if (!["0", "1"].includes(time)) {
            return res.status(400).json({error:"Invalid time period"})
        }

        if (!LBsortMap[sort]) {
            return res.status(400).json({error:"Invalid sort parameter"})
        }

        const sortVar = LBsortMap[sort][Number(time)] //get correct sort field

        const result = await User.find(filter, {
            user_tag:1, [sortVar]:1, school_id:1, country:1, _id:0
        })
        .sort({[sortVar]:-1, _id:1})
        .skip(skip)
        .limit(pageSize)
        .lean()

        //collect school ids
        const schoolIDs = [...new Set(result.map(u => u.school_id))]

        //fetch school ids and their names
        const schools = await School.find({school_id:{$in:schoolIDs}}, {name:1, _id:0, school_id:1})

        //create object of schoolid -> schoolname
        const schoolObj = Object.fromEntries(schools.map(s => [s.school_id, s.name]))

        //add to users in result
        let counter = 1
        for (const u of result) {
            //set rank
            u.rank = skip + counter
            counter++

            //set school
            u.school = schoolObj[u.school_id] || ""
            delete u.school_id
        }

        return res.json(result)
    })

    app.get("/api/collections/get/:id", async (req, res) => { //all of the user's collections, marked if they contain the question
        const userTag = req.user?.user_tag
        const qID = toID(req.params.id)

        //find collections
        const collections = await Collection.find({user_tag:userTag}, {collection_id:1, name:1, published:1, _id:0}).lean()

        const cIDS = collections.map(c => c.collection_id)

        //check questionCollection - return list of collection objects which contain the question
        const collectionsWithQuestion = isNaN(qID) ? [] :
            await QuestionCollection.find({collection_id:{$in:cIDS}, question_id:qID},{collection_id:1})

        const collectionArray = collectionsWithQuestion.map(c => c.collection_id)

        for (const c of collections) { //insert true into all collections that contain the question
            c.includesQuestion = collectionArray.includes(c.collection_id)
        }

        return res.json(collections)
    })

    //finds a collection and checks it belongs to the user
    async function getOwnCollection(id, userTag) {
        const cID = toID(id)
        const collection = isNaN(cID) ? null : await Collection.findOne({collection_id:cID}).lean()

        if (!collection) {//if collection doesnt exist
            throw fail(404, "Collection does not exist")
        }

        if (collection.user_tag != userTag) { //if collection not user's
            throw fail(403, "This collection does not belong to you!")
        }

        return collection
    }

    app.post("/api/collection/create", collectionLimiter, async (req, res) => {
        const userTag = req.user?.user_tag

        if (await Collection.exists({user_tag:userTag, name:"New collection"})) {
            return res.status(409).json({ error: "You have already created a collection recently!" })
        }

        if (await Collection.countDocuments({user_tag:userTag}) >= 100) {
            return res.status(409).json({ error: "You have reached the maximum number of collections" })
        }

        const newID = await idGenerator(Collection, "collection_id")

        await Collection.create({
            collection_id: newID,
            user_tag:userTag,
            name:"New collection",
            tag:1, //usermade
            published:false
        })

        return res.status(200).json({success:true, id:newID})
    })

    app.post("/api/collection/rename/:id", collectionLimiter, async (req, res) => {
        const collection = await getOwnCollection(req.params.id, req.user?.user_tag)
        const newName = toText(req.body?.name, 100)

        //validate name
        const invalid = validate(newName)
        if (invalid) {
            return res.status(400).json({ error: invalid })
        }

        if (newName.length > 40) {
            return res.status(400).json({ error: "Name must be maximum 40 characters!" })
        }

        await Collection.updateOne({collection_id:collection.collection_id}, { //set new name
            $set:{name:newName}
        })

        return res.status(200).json({success:true})
    })

    app.post("/api/collection/visibility/:id", collectionLimiter, async (req, res) => { //change collection visibility
        const collection = await getOwnCollection(req.params.id, req.user?.user_tag)

        await Collection.updateOne({collection_id:collection.collection_id}, {
            $set:{published:!collection.published}
        })

        return res.status(200).json({success:true})
    })

    app.post("/api/collection/question/:qID/:id", collectionLimiter, async (req, res) => { //add/remove question to collection
        const userTag = req.user?.user_tag
        const qID = toID(req.params.qID)

        const collection = await getOwnCollection(req.params.id, userTag)
        const cID = collection.collection_id

        const question = isNaN(qID) ? null :
            await Question.findOne({question_id:qID}, {name:1, subject_id:1, topic_id:1, study_stage:1, num_collections:1, published:1, user_tag:1})

        if (!question) {
            return res.status(404).json({ error: "Question does not exist!" })
        }

        //find questionCollection entry
        const inCollection = await QuestionCollection.exists({
            question_id:qID,
            collection_id:cID
        })

        let newColNum = question.num_collections

        if (!inCollection) { //if question not in collection, add it
            if (!question.published && question.user_tag != userTag) { //someone else's draft
                return res.status(404).json({ error: "Question does not exist!" })
            }

            if (collection.question_num >= 200) {
                return res.status(409).json({ error: "This collection is full" })
            }

            await QuestionCollection.create({
                question_id:qID,
                collection_id:cID
            })

            await Question.updateOne({question_id:qID}, { //update number of collections question is in
                $inc:{num_collections:1}
            })

            newColNum++ //update counter to send to user

            //add subject, topic and stage to collection, update question number and preview
            await Collection.updateOne({collection_id:cID}, {
                $addToSet:{subject_ids:question.subject_id, topic_ids:question.topic_id, stages:question.study_stage},
                $inc: {question_num:1},
                $push: {preview:question.name}
            })
        }
        else { //if question in collection, delete
            await QuestionCollection.deleteMany({question_id:qID, collection_id:cID})

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

            //if there are none left with the stage/subject/topic, remove it from the collection
            const toPull = {preview:question.name}
            if (stageCount === 0) toPull.stages = question.study_stage
            if (subjectCount === 0) toPull.subject_ids = question.subject_id
            if (topicCount === 0) toPull.topic_ids = question.topic_id

            await Question.updateOne({question_id:qID, num_collections:{$gt:0}}, { //update number of collections question is in
                $inc:{num_collections:-1}
            })

            newColNum = Math.max(0, newColNum-1) //update question counter to send to user

            //update collection question number and preview
            await Collection.updateOne({collection_id:cID}, {
                $inc: {question_num:-1},
                $pull: toPull
            })
        }

        return res.status(200).json({success:true, newColnum:newColNum})
    })

    //returns nothing if the collection doesn't exist or the user isn't allowed to see it
    async function getCollectionData(cID, userTag) {
        if (isNaN(cID)) return

        const collection = await Collection.findOne( //query collection
            {collection_id:cID},
            {name:1, user_tag:1, tag:1, published:1, _id:0,
                paper:1, year:1,
            })

        if (!collection || (!collection.published && collection.user_tag != userTag)) return

        //find questionIDS in collection
        const questionIDs = await QuestionCollection.find({collection_id:cID}, {question_id:1, _id:0}).lean()
        const questionIDArray = questionIDs.map(q => q.question_id)

        //get data from questions, leaving out other people's drafts
        const questions = await Question.find({
            question_id: {$in:questionIDArray},
            ...(userTag ? {$or: [{published:true}, {user_tag:userTag}]} : {published:true})
        }, questionListFields)
        .sort({created_at:-1})
        .lean()

        await addTopicNames(questions)

        return {
            tag:convertCollectionTag(collection.tag),
            paper:collection.paper == 0 ? "" : collection.paper,
            year:collection.year == 0 ? "" : collection.year,
            name:collection.name,
            user_tag:"@"+collection.user_tag,
            question_data:questions
        }
    }

    app.get("/api/collection/get/:id", async (req, res) => {
        const data = await getCollectionData(toID(req.params.id), req.user?.user_tag)

        //if doesn't exist or private, but not owned by the user, then redirect to home
        if (!data) {
            return res.status(404).json({
                success: false,
                redirect: `/home`
            })
        }

        return res.json(data)
    })

    //adds usernames, whether there are replies and the user's own likes to a list of comments
    async function addCommentData(comments, userTag) {
        //collect user tags
        const userTags = [...new Set(comments.map(u => u.user_tag))]

        //fetch usernames
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
        const likes = !userTag ? [] : await Like.find({user_tag:userTag, item_type:1, item_id:{$in:commentIDs}},
            {item_id:1, value:1, _id:0}
        ).lean()

        //create object of comment_id: like value
        const likesObj = Object.fromEntries(likes.map(l => [l.item_id, l.value]))

        //add to comments in result
        for (const c of comments) {
            c.username = userObj[c.user_tag] || c.user_tag
            c.moreReplies = !!childrenObj[c.comment_id]
            c.userLikeVal = likesObj[c.comment_id]
        }

        return comments
    }

    app.get("/api/comments/get/:qID/:page", async (req, res) => { //load base comments for a question
        const qID = toID(req.params.qID)
        const userTag = req.user?.user_tag

        //check question exists
        if (!(await getVisibleQuestion(qID, userTag))) {
            return res.status(404).json({ error: "Question does not exist!"})
        }

        //get top 20 comments
        const comments = await Comment.find({question_id:qID, parent_comment_id:null},
            {_id:0, comment_id:1, user_tag:1, content:1, like_rating:1, created_at:1}
        )
        .sort({like_rating:-1, _id:1})
        .skip(toSkip(req.params.page))
        .limit(pageSize)
        .lean()

        return res.json(await addCommentData(comments, userTag))
    })

    app.get("/api/replies/get/:cID", async (req, res) => { //load reply comments for a comment
        const cID = toID(req.params.cID) //get parent comment id
        const userTag = req.user?.user_tag

        //check comment exists
        const parent = isNaN(cID) ? null : await Comment.findOne({comment_id:cID}, {question_id:1})
        if (!parent || !(await getVisibleQuestion(parent.question_id, userTag))) {
            return res.status(404).json({ error: "Comment does not exist!"})
        }

        const comments = await Comment.find({parent_comment_id:cID},
            {_id:0, comment_id:1, user_tag:1, content:1, like_rating:1, created_at:1}
        )
        .sort({like_rating:-1, _id:1})
        .limit(200)
        .lean()

        return res.json(await addCommentData(comments, userTag))
    })

    app.post("/api/comment/like/:cid/:value", async (req, res) => {
        const cID = toID(req.params.cid)
        const val = Number(req.params.value)
        const userTag = req.user?.user_tag

        const comment = isNaN(cID) ? null :
            await Comment.findOne({comment_id:cID}, {_id:0, like_rating:1, question_id:1, user_tag:1, content:1})

        if (!comment || !(await getVisibleQuestion(comment.question_id, userTag))) { //check comment exists
            return res.status(404).json({ error: "Comment does not exist!"})
        }
        if (![0, 1, -1].includes(val)) {
            return res.status(400).json({ error: "Invalid like value"})
        }

        const delta = await updateLike(cID, 1, val, userTag)
        const newLikes = comment.like_rating + delta

        if (delta != 0) {
            await Comment.updateOne( //update comment rating
                {comment_id: cID},
                {$inc: {like_rating: delta}},
            )

            //update comment writer's total like rating
            await User.updateOne(
                {user_tag:comment.user_tag},
                {$inc: {total_likes:delta, likes_today:delta}},
            )

            //send notification every 100 likes
            if (comment.user_tag != userTag && delta > 0 && newLikes > 0 && newLikes % 100 == 0) {
                await Notification.create({
                    notif_id: await idGenerator(Notification, "notif_id"),
                    user_tag: comment.user_tag,
                    question_id: comment.question_id,
                    message: `Your comment "${clip(comment.content, 30)}" just hit ${newLikes} likes!`,
                })
            }
        }

        return res.status(200).json({
            success:true,
            newLikes:newLikes
        })
    })

    app.get("/api/inbox/:page", async (req, res) => {
        const userTag = req.user?.user_tag

        const notifications = await Notification.find({user_tag:userTag}, //send back 20 notifications for user
            {_id:0, question_id:1, notif_id:1, message:1, created_at:1, viewed:1}
        )
        .sort({created_at:-1, _id:1})
        .skip(toSkip(req.params.page))
        .limit(pageSize)
        .lean()

        //make all notifs returned viewed
        const notifIDS = notifications.map(n => n.notif_id)

        if (notifIDS.length > 0) {
            await Notification.updateMany({notif_id:{$in:notifIDS}, user_tag:userTag},
                {$set:{viewed:true}}
            )
        }

        for (const n of notifications) { //make dates in text format
            n.created_at = convertDate(n.created_at)
        }

        return res.json(notifications)
    })

    async function getUserData(userTag) {
        const data = await User.findOne({user_tag:userTag},
            {_id:0, user_tag:1, username:1, school_id:1, country:1, total_likes:1, created_total:1, studied_today:1, studied_total:1, created_at:1, completed_total:1}
        ).lean()

        if (!data) return

        data.school = (await School.findOne({school_id:data.school_id}, {name:1}))?.name || ""
        delete data.school_id

        data.created_at = convertDate(data.created_at)

        return data
    }

    app.get("/api/user/data/self", async (req, res) => { //return the logged in user's data
        const data = await getUserData(req.user?.user_tag)

        const prefs = await User.findOne({user_tag:req.user?.user_tag}, {preference_data:1}).lean()
        data.preference_data = prefs.preference_data

        return res.json(data)
    })

    app.get("/api/user/data/:tag", async (req, res) => { //return another user's profile data
        const data = await getUserData(toText(req.params.tag, 30).toLowerCase())

        if (!data) { //check user exists
            return res.status(404).json({ error: "User does not exist!"})
        }

        return res.json(data)
    })

    //index 0 = study time, 1 = rest time
    async function updateTimerPreference(req, res, index, name) {
        const value = toID(req.params.value)

        if (isNaN(value) || value > 90 || value <= 0){
            return res.status(400).json({ error: `Invalid ${name} time entered!`})
        }

        await User.updateOne({user_tag:req.user?.user_tag}, { //update preference
            $set:{[`preference_data.${index}`]:value}
        })

        return res.status(200).json({success:true})
    }

    app.post("/api/preferences/update/study/:value", (req, res) => updateTimerPreference(req, res, 0, "study"))

    app.post("/api/preferences/update/rest/:value", (req, res) => updateTimerPreference(req, res, 1, "rest"))

    app.get("/api/preferences/get", async (req, res) => { //return user's preferences
        const defaults = [50, 10]

        if (!req.isAuthenticated()) {
            return res.json(defaults)
        }

        const data = await User.findOne({user_tag:req.user?.user_tag},
            {preference_data:1}
        ).lean()

        return res.json(data?.preference_data?.length == 2 ? data.preference_data : defaults)
    })

    //latest questions the user has watched/solved, newest first
    async function getLatest(model, userTag) {
        const latest = (await model.find({user_tag:userTag}, {question_id:1})
            .sort({created_at:-1})
            .limit(pageSize)
            .lean()).map(i => i.question_id)

        const questions = await Question.find({question_id:{$in:latest}, published:true}, questionListFields).lean()
        questions.sort((a, b) => latest.indexOf(a.question_id) - latest.indexOf(b.question_id))

        return await addTopicNames(questions)
    }

    app.get("/api/homepage", async (req, res) => { //return all homepage questions
        const userTag = req.user?.user_tag
        const emptySearch = {creator:"", topic:"", subject:"", paper:"-1", stage:"-1", year:"", search:""}

        const result = []
        let userCollections = []
        let solveLater

        if (!userTag) { //guests get the most popular questions instead of personal ones
            result.push({
                name:"Most viewed",
                questions: await searchQuestions({...emptySearch, sort:"views", tag:"-1"}, userTag),
                href:"/search/?stage=-1&subject=&paper=-1&year=&tag=-1&creator=&topic=&search=&sort=views&page=1&searchType=q"
            })
        }
        else {
            let recommended = []
            try {
                recommended = await getRecommendedQuestions(userTag)
            } catch (err) {
                console.error("Recommendations failed:", err.message) //rest of the homepage still works without the model
            }

            result.push({
                name:"Recommended",
                questions: recommended
            })

            result.push({
                name:"Recently watched questions",
                questions: await getLatest(Watch, userTag)
            })

            result.push({
                name:"Recently solved questions",
                questions: await getLatest(Solve, userTag),
            })

            userCollections = await Collection.find({user_tag:userTag}, {collection_id:1, name:1}).lean()

            solveLater = userCollections.find(c => c.name == "Solve Later")

            if (solveLater) { //if they have a solve later collection
                result.push({
                    name:"Solve Later",
                    questions: (await getCollectionData(solveLater.collection_id, userTag))?.question_data || [],
                    href:`/collection/${solveLater.collection_id}`
                })
            }
        }

        result.push({
            name:"Highest like rated",
            questions: await searchQuestions({...emptySearch, sort:"likes", tag:"-1"}, userTag),
            href:"/search/?stage=-1&subject=&paper=-1&year=&tag=-1&creator=&topic=&search=&sort=likes&page=1&searchType=q"
        })

        result.push({ //find those looking for solution, i.e. tag = 2
            name:"Looking for solution",
            questions: await searchQuestions({...emptySearch, sort:"time", tag:"2"}, userTag),
            href:"/search/?stage=-1&subject=&paper=-1&year=&tag=2&creator=&topic=&search=&sort=time&page=1&searchType=q"
        })

        for (const c of userCollections) {
            //push all of users collections to carousels, except solve later
            if (c == solveLater) {
                continue
            }

            result.push({
                name: c.name,
                questions: (await getCollectionData(c.collection_id, userTag))?.question_data || [],
                href:`/collection/${c.collection_id}`
            })
        }

        return res.json(result)
    })

    //SCROLL INTERACTION

    app.post("/api/scroll/interaction", async (req, res) => {
        const userTag = req.user?.user_tag
        const qID = toID(req.body?.qID)
        const markers = req.body?.markers

        //validation
        //markers: [rating, watch, solve, like, commentNum, collectionNum, viewDuration, skip]
        if (!Array.isArray(markers) || markers.length != 8
            || markers.some(m => typeof m != "number" && typeof m != "boolean")) {
            return res.status(400).json({ error: "Invalid interaction data"})
        }

        const m = markers.map(Number) //converts true/false markers too
        if (m.some(val => !Number.isFinite(val))) {
            return res.status(400).json({ error: "Invalid interaction data"})
        }

        const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
        m[0] = clamp(Math.round(m[0]), 0, 5)
        m[3] = clamp(Math.round(m[3]), -1, 1)
        m[4] = clamp(m[4], 0, 100)
        m[5] = clamp(m[5], 0, 100)
        m[6] = clamp(m[6], 0, 600)
        for (const i of [1, 2, 7]) m[i] = m[i] ? 1 : 0

        const user = await User.findOne({user_tag:userTag}, {_id:0, interaction_n:1})
        if (!user) {return res.status(404).json({ error: "User does not exist!"})}

        const question = await getVisibleQuestion(qID, userTag, {_id:0, difficulty:1, interaction_n:1, subject_id:1})
        if (!question || !question.published) {return res.status(404).json({ error: "Question does not exist!"})}

        //only learn from subjects that the user actually studies
        const subjectuser = await SubjectUser.findOne({user_tag:userTag, subject_id:question.subject_id}, {ability:1, _id:0})
        if (!subjectuser) {return res.status(200).json({success:true})}

        //get weights from subject
        const subject = await Subject.findOne({subject_id:question.subject_id}, {_id:0, weights:1})
        if (!subject) {return res.status(404).json({ error: "Subject does not exist!"})}

        let result
        try {
            result = await sendModelRequest({ //calculate interaction output
                m:m,
                w:subject.weights,
                s_i:subjectuser.ability,
                d:question.difficulty,
                user_interactions:user.interaction_n,
                question_interactions:question.interaction_n
            }, "interaction")
        } catch (err) {
            console.error("Interaction failed:", err.message)
            return res.status(200).json({success:false}) //not worth interrupting the user for
        }

        const deltas = [result.d, result.s_i, ...(Array.isArray(result.w) ? result.w : [NaN])]
        if (deltas.some(val => !Number.isFinite(val)) || result.w.length != subject.weights.length) {
            console.error("Interaction failed: unexpected model response")
            return res.status(200).json({success:false})
        }

        //UPDATE WEIGHTS AND VALUES
        await Question.updateOne({question_id:qID},{
            $inc:{difficulty:result.d, interaction_n:1}
        })

        await User.updateOne({user_tag:userTag},{
            $inc:{interaction_n:1}
        })

        const weightUpdates = {}
        result.w.forEach((delta, index) => { //increment each weight index by its specific delta
            weightUpdates[`weights.${index}`] = delta
        })

        await Subject.updateOne(
            {subject_id:question.subject_id},
            {$inc: weightUpdates}
        )

        await SubjectUser.updateOne({user_tag:userTag, subject_id:question.subject_id},{
            $inc:{ability:result.s_i}
        })

        return res.status(200).json({success:true})
    })

    //SCROLL RECOMMENDATION

    async function getRecommendedQuestions(userTag) {
        //get subject IDs that user does
        const userSBJS = await SubjectUser.find({user_tag:userTag}, {subject_id:1, _id:0, ability:1})
        if (userSBJS.length == 0) return []

        const user = await User.findOne({user_tag:userTag}, {interaction_n:1, _id:0})

        //send request to python server
        const dataToSendToPython = []
        for (const sbj of userSBJS) { //batch data of all subjects to send
            dataToSendToPython.push({
                s_i: sbj.ability,
                user_interactions:user?.interaction_n || 0,
                sbj_id:sbj.subject_id
            })
        }

        const bands = (await sendModelRequest(dataToSendToPython, "recommendation")).result //send request to model for calculation of bands

        const conditions = []//array to add condtions to
        for (const sbj of userSBJS) {
            const subjectBands = bands?.[sbj.subject_id]
            if (!subjectBands) continue

            conditions.push({
                subject_id:sbj.subject_id, //match bands to correct subject
                difficulty: {$gte:subjectBands.easy[0], $lte:subjectBands.hard[1]}
            }) //query from bottom of range to top
        }

        if (conditions.length == 0) return []

        const questions = await Question.aggregate([ //database query
            {$match:{published:true, $or:conditions}},
            {$sample:{size:40}},
            {$project:{...questionListFields, difficulty:1}}
        ])

        const result = []
        const notAddedQueue = []
        const currentBandCounts = {easy:0, regular:0, hard:0} //keeps track of how many added so far

        for (const q of questions) { //adds questions of correct bands
            const bandsObj = bands[q.subject_id]

            if (!bandsObj) continue

            let band = "hard"
            if (q.difficulty <= bandsObj.easy[1]) band = "easy"
            else if (q.difficulty <= bandsObj.regular[1]) band = "regular"

            if (currentBandCounts[band] < bandCounts[band]) { //if goal not met, push to result
                result.push(q)
                currentBandCounts[band]++
            }
            else { //if not, add to unadded queue
                notAddedQueue.push(q)
            }
        }

        if (result.length < pageSize) { //if result is too short, add missing from the queue
            result.push(...notAddedQueue.slice(0, pageSize-result.length))
        }

        await addTopicNames(result)

        return shuffle(result.slice(0, pageSize))
    }

    //questions for guests to scroll through: a random mix of published ones, nothing personal
    app.get("/api/scroll/guest", async (req, res) => {
        const questions = await Question.aggregate([
            {$match: {published: true}},
            {$sample: {size: pageSize}},
            {$project: {_id: 0, question_id: 1}}
        ])

        res.json(questions)
    })

    app.post("/api/scroll/recommendation", async (req, res) => {
        try {
            return res.json(await getRecommendedQuestions(req.user?.user_tag))
        } catch (err) {
            console.error("Recommendations failed:", err.message)
            return res.status(503).json({error: "Recommendations are not available right now"})
        }
    })

    app.post("/api/question/save/:id/:publish", saveLimiter, async (req, res) => {
        let qID = toID(req.params.id)
        const publish = req.params.publish == "true"
        const clientTag = req.user?.user_tag

        //parsing data
        const body = req.body || {}
        const data = {
            stage: toText(body.stage, 5),
            subject: toText(body.subject, 100),
            topic: toText(body.topic, 100),
            tag: toText(body.tag, 10),
            qname: toText(body.qname, 100),
            qtext: toText(body.qtext, 6000),
            mstext: toText(body.mstext, 6000),
        }

        //validation

        for (const field of Object.values(data)) { //check empty and profanities
            const invalid = validate(field)
            if (invalid) return res.status(400).json({error: invalid})
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

        //subject check
        const subject = await Subject.findOne({full_name:data.subject, study_stage:Number(data.stage)}, {subject_id:1, study_stage:1})
        if (!subject) {
            return res.status(409).json({ error: "Subject does not exist or is invalid!" })
        }

        //topic check
        const topicID = (await Topic.findOne({subject_id:subject.subject_id, name:data.topic}, {topic_id:1}))?.topic_id
        if (!topicID) {
            return res.status(409).json({ error: "Topic does not exist or is invalid!" })
        }

        const fields = {
            topic_id: topicID,
            name: data.qname,
            content: data.qtext,
            tag: convertTag(data.tag),
            mark_scheme: data.mstext,
            published:publish,
            study_stage:subject.study_stage,
            subject_id:subject.subject_id,
        }

        const existing = isNaN(qID) ? null : await Question.findOne({question_id:qID}, {user_tag:1, published:1})

        if (!existing) { //if question doesn't exist, create new
            qID = await idGenerator(Question, "question_id")

            await Question.create({
                question_id: qID,
                user_tag: clientTag,
                ...fields
            })
        }
        else { //if question already exists, only the creator can edit it while it is still a draft
            if (existing.user_tag != clientTag) {
                return res.status(403).json({ error: "This question does not belong to you!" })
            }
            if (existing.published) {
                return res.status(409).json({ error: "Published questions cannot be edited", redirect: `/question/${qID}` })
            }

            await Question.updateOne({question_id: qID, user_tag: clientTag}, {$set: fields})
        }

        if(publish) { //if published, update user question num and redirect to question page
            await User.updateOne(
                {user_tag: clientTag},
                {$inc:{created_today:1, created_total:1}}
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
    })

    app.post("/api/comments/create/:qID/:rID", commentLimiter, async (req, res) => {
        const text = toText(req.body?.com, 1000)
        const userTag = req.user?.user_tag
        const qID = toID(req.params.qID)
        const rID = toID(req.params.rID) //0 if not a reply

        //validation

        const invalid = validate(text) //validate for profanities/links
        if (invalid) return res.status(400).json({error: invalid})

        if (text.length > 200) {
            return res.status(400).json({error: "Max comment length is 200 characters"})
        }

        const question = await getVisibleQuestion(qID, userTag, {name:1})
        //check question exists
        if (!question || isNaN(rID)) {
            return res.status(404).json({ error: "Question does not exist!"})
        }

        const notified = new Set([userTag]) //nobody gets more than one notification per comment
        const notifications = []
        const notify = async (tag, message) => {
            if (!tag || notified.has(tag)) return
            notified.add(tag)

            notifications.push({
                notif_id: await idGenerator(Notification, "notif_id"),
                user_tag:tag,
                question_id:qID,
                message:`User <a href="/profile/${userTag}">@${userTag}</a> ${message}`
            })
        }

        //REPLY IF STATEMENT - handles replies

        //check parent comment exists and is of the same question
        if (rID != 0) {
            const parentComment = await Comment.findOne({comment_id:rID}, {question_id:1, _id:0, user_tag:1, content:1})

            if (!parentComment) {
                return res.status(404).json({ error: "Parent comment does not exist!"})
            }

            if (parentComment.question_id != qID) {
                return res.status(409).json({ error: "Reply and comment must be of same question!"})
            }

            //notification for parent comment creator
            await notify(parentComment.user_tag,
                `replied to your comment "${clip(parentComment.content, 30)}" on question ${question.name}: "${clip(text, 30)}"`)
        }

        const commentID = await idGenerator(Comment, "comment_id")
        const comment = {
            comment_id:commentID,
            question_id:qID,
            user_tag:userTag,
            content:text,
            like_rating:0,
        }
        if (rID != 0) comment.parent_comment_id = rID //sets parent comment id if exists

        await Comment.create(comment)

        await Question.updateOne({question_id:qID}, //update number of comments in question
            {$inc:{num_comments:1}}
        )

        //notification for question creator
        await notify(question.user_tag, `commented on your question ${question.name}: "${clip(text, 30)}"`)

        //NOTIFICATIONS FOR ALL WHO WATCH QUESTION
        const watches = await Watch.find({question_id:qID}, {_id:0, user_tag:1}).limit(500).lean()

        for (const watch of watches) {
            await notify(watch.user_tag, `commented on your watched question ${question.name}: "${clip(text, 30)}"`)
        }

        if (notifications.length > 0) { //add notifs
            await Notification.insertMany(notifications)
        }

        return res.status(200).json({success:true, id:commentID})
    })

    //ACCOUNTS

    app.post("/register", registerLimiter, async (req, res) => {

        //parsing data

        const body = req.body || {}
        const data = {
            name: toText(body.name, 100),
            school: toText(body.school, 200),
            stage: toText(body.stage, 5),
            subjects: toText(body.subjects, 2000),
            tag: toText(body.tag, 100).toLowerCase(),
            username: toText(body.username, 100),
            country: toText(body.country, 100),
            email: toText(body.email, 300).toLowerCase(),
        }
        const password = typeof body.password == "string" ? body.password : ""
        const password_1 = typeof body.password_1 == "string" ? body.password_1 : ""

        //validation

        for (const field of Object.values(data)) { //check empty and profanities
            const invalid = validate(field)
            if (invalid) return res.status(400).json({error: invalid})
        }

        if (!validator.isEmail(data.email) || data.email.length > 254) {
            return res.status(400).json({error: "This is not an email" })
        }
        else if (password !== password_1) {
            return res.status(400).json({error: "Passwords do not match"})
        }
        else if (password.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters"})
        }
        else if (Buffer.byteLength(password) > 72) { //bcrypt ignores anything after this
            return res.status(400).json({error: "Password is too long"})
        }
        else if (data.name.length < 2) {
            return res.status(400).json({error: "Name is too short"})
        }
        else if (data.name.length > 60) {
            return res.status(400).json({error: "Name is too long"})
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
        else if (data.tag.length > 20){
            return res.status(400).json({error: "Tag is too long! (max 20 characters)"})
        }
        else if (data.tag.includes(" ")) {
            return res.status(400).json({error: "Tag cannot contain spaces"})
        }
        else if (!tagPattern.test(data.tag)) {
            return res.status(400).json({error: "Tag can only contain letters, numbers, dots, dashes and underscores"})
        }
        else if (!passwordCheck(password)) {
            return res.status(400).json({error: "Password must have at least one special character and number"})
        }
        else if (!countries.includes(data.country)) {
            return res.status(400).json({error: "Country is invalid"})
        }
        else if (!["0", "1", "2"].includes(data.stage)) {
            return res.status(400).json({error: "Please select a study stage"})
        }
        else if (data.school.length < 2 || data.school.length > 80) {
            return res.status(400).json({error: "School name is invalid"})
        }
        else if (reservedTags.includes(data.tag) || await User.exists({user_tag: data.tag})) {
            return res.status(409).json({ error: "User tag is taken!" })
        }

        //subject check
        const sbjs = [...new Set(data.subjects.split("×").map(s => s.trim()).filter(s => s != ""))]

        if (sbjs.length == 0) {
            return res.status(400).json({error: "You must select at least one subject"})
        }
        if (sbjs.length > 20) {
            return res.status(400).json({error: "Too many subjects selected"})
        }

        const subjectIDs = []
        for (const sbj of sbjs) {
            const subject = await Subject.findOne({full_name:sbj, study_stage:Number(data.stage)}, {subject_id:1})
            if (!subject) {
                return res.status(409).json({ error: "Subject does not exist!" })
            }
            subjectIDs.push(subject.subject_id)
        }

        //school check/creation

        const skl = await School.findOne({name:data.school}, {school_id:1}) //return school id of matching school
        let newSklID
        if (!skl) { //if school doesnt exist, add a new one
            newSklID = await idGenerator(School, "school_id")
            await School.create({
                school_id: newSklID,
                name:data.school
            })
        }
        else {
            newSklID = skl.school_id
        }

        const hash = await bcrypt.hash(password, 10) //hash password

        try {
            await User.create({ //create new user
                user_tag:data.tag,
                password_hash: hash,
                school_id:newSklID,
                country:data.country,
                study_stage:Number(data.stage),
                username:data.username,
                full_name:data.name,
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
        } catch (err) {
            if (err.code == 11000) { //someone took the tag in the meantime
                return res.status(409).json({ error: "User tag is taken!" })
            }
            throw err
        }

        await SubjectUser.insertMany(subjectIDs.map(id => ({ //create subjectuser entries
            user_tag: data.tag,
            subject_id:id,
            ability:0
        })))

        //create solve later
        await Collection.create({
            user_tag:data.tag,
            published:false,
            name:"Solve Later",
            collection_id: await idGenerator(Collection, "collection_id"),
            tag:1,
        })

        return res.status(200).json({success:true})
    })

    app.post("/login", loginLimiter, (req, res, next) => {
        const body = req.body || {}
        if (typeof body.tag_login != "string" || typeof body.password_login != "string") {
            return res.status(400).json({error: "Fields cannot be empty!"})
        }
        body.tag_login = body.tag_login.trim().toLowerCase() //tags are always stored lowercase

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err)
            }

            if (!user) {
                return res.status(401).json({error: info?.message || "Invalid credentials"})
            }

            req.logIn(user, err => {
                if (err){
                    return next(err)
                }
                return res.json({ success: true })
            })
        })(req, res, next)
    })

    app.post("/logout", (req, res, next) => {
        req.logout(err => {
            if (err) return next(err)

            req.session.destroy(() => {
                res.clearCookie("connect.sid")
                res.json({success: true, redirect: "/"})
            })
        })
    })

    //SERVING HTML FILES

    const page = name => path.join(__dirname, "public", `${name}.html`)

    app.get("/", (req, res) => {
        //check if logged in first; redirect to home, otherwise welcome page
        if (req.isAuthenticated()) {
            return res.redirect("/home")
        }

        res.sendFile(page("welcome"))
    })

    app.get("/login", (req, res) => {
        if (req.isAuthenticated()) {
            return res.redirect("/home")
        }

        res.sendFile(page("login"))
    })

    app.get("/home", (req, res) => {
        res.sendFile(page("home"))
    })

    app.get("/settings", isLoggedIn, (req, res) => {
        res.redirect("/preferences")
    })

    app.get("/preferences", isLoggedIn, (req, res) => {
        res.sendFile(page("preferences"))
    })

    app.get("/inbox", isLoggedIn, (req, res) => {
        res.sendFile(page("inbox"))
    })

    app.get("/search", (req, res) => {
        res.sendFile(page("search"))
    })

    app.get("/question", (req, res) => {
        res.redirect("/home")
    })

    app.get("/question/:id", (req, res) => {
        res.sendFile(page("question"))
    })

    app.get("/collection", (req, res) => {
        res.redirect("/home")
    })

    app.get("/collection/:id", (req, res) => {
        res.sendFile(page("collection"))
    })

    app.get("/profile", isLoggedIn, (req, res) => {
        res.redirect(`/profile/${encodeURIComponent(req.user?.user_tag)}`)
    })

    app.get("/profile/:id", (req, res) => {
        res.sendFile(page("profile"))
    })

    app.get("/create", isLoggedIn, (req, res) => {
        res.sendFile(page("create"))
    })

    app.get("/create/:id", isLoggedIn, (req, res) => {
        res.sendFile(page("create"))
    })

    app.get("/leaderboards", (req, res) => {
        res.sendFile(page("leaderboard"))
    })

    app.get("/health", (req, res) => {
        res.send("Up")
    })

    app.use(sendFail)
}
