import {generateStarHTML, warn, sendDataRequest, convertTag, convertStudyStage, sendData, reportInvalid,
    escapeHTML, sanitizeHTML, renderMath, imagesLoaded, getUser, goToLogin, setBusy, emptyState} from "./utils.js"

//guests can read questions, mark schemes and comments. anything else takes them to log in
const user = await getUser()

function needsAccount() {
    if (user) return false
    goToLogin()
    return true
}

let BtnValues = { //values of the sidebar (for animation purposes)
    like:0,
    watch:false,
    solve:false,
    rate:false,
}

let markers = { //markers
    rateVal:0,
    commentVal:0,
    collectionVal:0,
    viewStart:Date.now(),
    skipVal:true,
}

const errbar = document.getElementsByClassName("error")[0]

const msBtn = document.getElementById("msBtn")
let flipped = false

const commentsTab = document.getElementById("comments-tab")
const commentsBtn = document.getElementById("commentBtn")
let commentTabOpenYet = false
let cOpen = false

const rateBarImgs = document.querySelectorAll(".rate-bar img")

const collectionMenu = document.getElementsByClassName("col-bar")[0]
const collectionSpace = document.getElementsByClassName("collection-wrapper")[0]

const qElementList = ["stage", "subject","paper","question","topic","year","name","user_tag","rating","views", //insert elements
    "qtext","mstext","formula","spec","likes","watches","solves","ratings","comments","collections", "tag",
    "likebar", "face", "star", "ratebar", "watch", "check", "arr1", "arr2", "plus", "addcol",
    "cForm", "rbaruser", "cinput", "page", "commentSpace", "rcancel", "replybar", "arr3"
]
let elData = {}

for (let el of qElementList) {
    elData[el] = document.getElementById(el)
}

//fetch ID and check if valid
let qID = Number(window.location.pathname.split("/question/")[1])
if (!Number.isInteger(qID) || qID <= 0) qID = -1


//MARK SCHEME TOGGLE

msBtn.addEventListener("click", async () => { //ms show/hide
    markers.skipVal = false

    if (!flipped) {
        elData.qtext.style.display = "none" //show ms
        elData.mstext.style.display = "block"
        msBtn.innerText = "Question"

        if (!BtnValues.solve && user) { //looking at the mark scheme counts as solving
            setSolved(true)
        }
    }
    else {
        elData.qtext.style.display = "block" //show question
        elData.mstext.style.display = "none"
        msBtn.innerText = "Mark scheme"
    }
    flipped = !flipped
})

//  ===========
//  COLLECTIONS
//  ===========

//private/public collection button toggle
async function buttonToggle(btn, cID) {
    if (!(await sendDataRequest(`/api/collection/visibility/${cID}`, errbar, window, "", "POST"))) return

    setPublishButton(btn, btn.innerText == "Private")
}

function setPublishButton(btn, published) {
    btn.innerText = published ? "Public" : "Private"
    btn.style.color = published ? "darkgreen" : "darkred"
}

//checked/unchecked collection button toggle
async function checkedToggle(btn, cID) {
    const request = await sendDataRequest(`/api/collection/question/${qID}/${cID}`, errbar, window, "", "POST")
    if (!request) return

    elData.collections.innerText = request.newColnum

    if (btn.classList.contains("checked")) { ///uncheck
        markers.collectionVal = Math.max(0, markers.collectionVal-1) //update markers
        btn.src = "/resources/check_empty.PNG"
    }
    else { //check
        markers.collectionVal += 1 //update marker
        btn.src = "/resources/check_full.PNG"
    }
    btn.classList.toggle("checked")
}

async function collectionNameEdit(inp, cID) { //send name change to server
    if (await sendDataRequest(`/api/collection/rename/${cID}`, errbar, window, "", "POST", {name: inp.value})) {
        inp.dataset.saved = inp.value
    }
    else {
        inp.value = inp.dataset.saved //if request failed, undo the edit
    }
}

function collectionTemplate(c) { //one row of the collection menu
    const newCol = document.createElement("div")
    newCol.classList.add("col-item")
    newCol.innerHTML = `
        <input type="text" maxlength="40" aria-label="Collection name">
        <div class="col-optns">
            <div class="publish-btn">Private</div>
            <img src="/resources/check_empty.PNG" alt="" class="icon col-check">
        </div>
    `

    const inp = newCol.querySelector("input") //detect name change
    inp.value = c.name
    inp.dataset.saved = c.name
    inp.addEventListener("change", () => collectionNameEdit(inp, c.collection_id))

    const pBtn = newCol.querySelector(".publish-btn") //edit publish button according to collection published
    setPublishButton(pBtn, c.published)
    pBtn.addEventListener("click", () => buttonToggle(pBtn, c.collection_id))

    const cBtn = newCol.querySelector(".col-check") //whether the question is in the collection
    if (c.includesQuestion) {
        cBtn.classList.add("checked")
        cBtn.src = "/resources/check_full.PNG"
    }
    cBtn.addEventListener("click", () => checkedToggle(cBtn, c.collection_id))

    return newCol
}

//COLLECTION MENU TOGGLE

elData.plus.addEventListener("click", () =>{
    if (needsAccount()) return
    if (collectionMenu.style.display == "block") {
        collectionMenu.style.display = "none"
    }
    else {
        collectionMenu.style.display = "block"
    }
})

document.addEventListener("click", (e) => { //close when clicked off of
    if (e.target != elData.plus && !collectionMenu.contains(e.target)) {
        collectionMenu.style.display = "none"
    }
})

//add collection
elData.addcol.addEventListener("click", async () =>{
    //create collection on server
    const newCol = await sendDataRequest("/api/collection/create", errbar, window, "", "POST")
    if (newCol) {
        collectionSpace.appendChild(collectionTemplate({
            collection_id:newCol.id,
            name:"New collection",
            published:false,
            includesQuestion:false
        }))
    }
})

//COMMENT TOGGLE

const openC = sessionStorage.getItem("commentsOpen") || "false"

commentsBtn.addEventListener("click", () => { //comment show/hide
    if (!commentTabOpenYet) {
        getComments(true)
        commentTabOpenYet = true
    }
    if (!cOpen) {
        sessionStorage.setItem("commentsOpen", "true")
        commentsTab.style.display = "block" //show comments
    }
    else {
        sessionStorage.setItem("commentsOpen", "false")
        commentsTab.style.display = "none" //hide comments
    }
    cOpen = !cOpen
})

//  ===================
//  LIKE AND RATE BARS
//  ===================

//the bars open when their button is pressed. an option is picked either by dragging onto it and
//letting go, or by tapping it afterwards (the only way that works on touch screens)
let openBar

function optionBar(trigger, bar, onPick) {
    trigger.addEventListener("pointerdown", () => {
        if (needsAccount()) return

        if (openBar && openBar.bar != bar) openBar.bar.style.display = "none"

        openBar = {trigger:trigger, bar:bar, onPick:onPick, justOpened:bar.style.display != "flex"}
        bar.style.display = "flex"
    })
}

document.addEventListener("pointerup", (e) => {
    if (!openBar) return

    if (e.target == openBar.trigger && openBar.justOpened) { //pressed and released on the button, keep it open
        openBar.justOpened = false
        return
    }

    openBar.bar.style.display = "none"

    if (e.target.tagName == "IMG" && openBar.bar.contains(e.target)) {
        openBar.onPick(e.target)
    }
    openBar = undefined
})

function faceImage(value) {
    if (value == 1) return "/resources/smile.PNG"
    if (value == -1) return "/resources/frown.PNG"
    return "/resources/neutral.PNG"
}

//===========
//COMMENTS
//===========

elData.cForm.addEventListener("submit", async e => {
    e.preventDefault() //prevent form being sent
    if (needsAccount()) return

    elData.cinput.setCustomValidity("")

    //client side validation

    if (elData.cinput.value.length > 200) {
        reportInvalid(elData.cinput, "Comment can't be longer than 200 characters!", e)
        return
    }

    //processing form data

    let replyID = 0

    if (elData.replybar.style.display == "flex" && elData.replybar.data) {//if a reply is active
        replyID = elData.replybar.data
    }

    const submitBtn = document.getElementById("csubmit")
    if (submitBtn.disabled) return
    setBusy(submitBtn, true)
    const result = await sendData(`/api/comments/create/${qID}/${replyID}`, {com: elData.cinput.value}, errbar, window, "Comment submitted", true)
    setBusy(submitBtn, false)

    if (result) {
        markers.commentVal += 1 //update marker

        elData.cinput.value = ""
        hideReplyBar()

        elData.comments.innerText = Number(elData.comments.innerText) + 1
        getComments(true) //show the new comment
    }
})

elData.cinput.addEventListener("focus", () => { //starting to write a comment
    needsAccount()
})

elData.cinput.addEventListener("input", () => {
    elData.cinput.setCustomValidity("")
})

//COMMENT LIKES

async function loadReplies(btn, space){ //if load replies clicked, they are loaded
    const result = await sendDataRequest(`/api/replies/get/${btn.dataset.id}`, errbar, window, "")
    if (!result) return

    btn.remove()
    space.appendChild(generateFullCommentHTML(result))
}

function commentTemplate(c){
    let newComment = document.createElement("div")
    newComment.classList.add("comment-wrapper")

    newComment.innerHTML =`
                                <div class="comment">
                                    <div class="c-top">
                                        <div class="c-names">
                                            <div class="c-name">
                                                ${escapeHTML(c.username)}
                                            </div>
                                            <div class="c-tag">
                                                @${escapeHTML(c.user_tag)}
                                            </div>
                                        </div>
                                        <div class="icons">
                                            <span class="val">${Number(c.like_rating)}</span>
                                            <button type="button" class="like-ic" aria-label="Like">
                                                <span class="facewrap"><img src="${faceImage(c.userLikeVal)}" alt="" class="icon face"></span>
                                            </button>
                                            <span class="like-bar likebar">
                                                <img src="/resources/smile.PNG" alt="Like" class="icon" data-value="1">
                                                <img src="/resources/neutral.PNG" alt="Neutral" class="icon" data-value="0">
                                                <img src="/resources/frown.PNG" alt="Dislike" class="icon" data-value="-1">
                                            </span>
                                            <button type="button" class="reply" aria-label="Reply">
                                                <img src="/resources/comments.PNG" alt="" class="icon comment-icon">
                                            </button>
                                        </div>
                                    </div>
                                    <div class="c-text">${escapeHTML(c.content)}</div>

                                </div>
                                <div class="c-replies">
                                    ${
                                        c.moreReplies ? '<button type="button" class="c-load">[ load replies ]</button>' : ""
                                    }
                                </div>`

    const face = newComment.querySelector(".face")
    const likeValue = newComment.querySelector(".val")

    let lastLikeValue = c.userLikeVal || 0

    //when a like value is selected
    optionBar(face, newComment.querySelector(".likebar"), async (img) => {
        const value = Number(img.dataset.value)
        if (lastLikeValue === value) return

        const result = await sendDataRequest(`/api/comment/like/${c.comment_id}/${value}`, errbar, window, "", "POST")

        if (result) {
            lastLikeValue = value
            face.src = faceImage(value)
            likeValue.innerText = result.newLikes
        }
    })

    newComment.querySelector(".reply").addEventListener("click", () => {
        if (needsAccount()) return
        showReplyBar(`@${c.user_tag}`, c.comment_id)
    })

    const loadBtn = newComment.querySelector(".c-load")
    if (loadBtn) {
        loadBtn.dataset.id = c.comment_id
        loadBtn.addEventListener("click", () => loadReplies(loadBtn, newComment.querySelector(".c-replies")))
    }

    //render laTex
    renderMath(newComment.querySelector(".c-text"))

    return newComment
}

function generateFullCommentHTML(comments) {
    let totalHTML = document.createDocumentFragment()
    for (const c of comments) {
        totalHTML.appendChild(commentTemplate(c))
    }
    return totalHTML
}

let hasMore = true
let isLoading = false

async function getComments (deleteOld) { //function to request comment data
    if (deleteOld) {
        elData.page.value = "1"
        elData.commentSpace.innerHTML = ""
        hasMore = true
        isLoading = false
    }

    const oldBottomEl = document.getElementById("bottomDetect")

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await sendDataRequest(`/api/comments/get/${qID}/${elData.page.value}`, errbar, window, "")

    if (!result) return

    if (deleteOld && result.length == 0) {
        elData.commentSpace.appendChild(emptyState("No comments yet"))
    }

    //append new data
    elData.commentSpace.appendChild(generateFullCommentHTML(result))

    if (result.length >= 20) { //if there is potential for more data to be loaded later
        elData.commentSpace.insertAdjacentHTML('beforeend', '<div id="bottomDetect" style="height: 10px; opacity: 0;"></div>')
        const bottomEl = document.getElementById("bottomDetect")
        observer.observe(bottomEl)
    }
    else {
        hasMore = false //there is no more data to load
    }
}

async function loadMoreItems() {
    if (!isLoading && hasMore) { //if its already loading or there are no more to be loaded
        isLoading = true

        elData.page.value = Number(elData.page.value) + 1 //increment page

        await getComments(false) //request more comments

        isLoading = false
    }
}

const observer = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting) { //if on screen
        loadMoreItems()
    }
}, {
    root: null,
    rootMargin: '1000px', //start loading before the bottom is reached
    threshold: 0.1
})

//REPLYING TO COMMENTS

function showReplyBar(tag, cID) { //if a reply button is clicked, set label to their tag and show replybar
    elData.replybar.style.display = "flex"
    elData.replybar.data = cID
    elData.rbaruser.innerText = tag
    elData.cinput.focus()
}

function hideReplyBar() {
    elData.replybar.style.display = "none"
    elData.replybar.data = ""
}

elData.rcancel.addEventListener("click", function(e) { //if X is clicked, hide replybar
    e.preventDefault()
    hideReplyBar()
})


//  =================
//  LIKES AND RATINGS
//  =================

optionBar(elData.face, elData.likebar, async (img) => { //send like to server
    const value = Number(img.dataset.value)
    if (BtnValues.like == value) return

    const result = await sendDataRequest(`/api/like/${qID}/${value}`, errbar, window, "", "POST")
    if (!result) return

    BtnValues.like = value
    elData.face.src = faceImage(value)
    elData.likes.innerText = result.newLikes
})

function fillStars(value) { //fill the rate bar up to the chosen star
    for (const item of rateBarImgs) {
        if (Number(item.dataset.value) > value) { //stars above
            item.src = "/resources/star_empty.PNG"
        }
        else {
            item.src = "/resources/star_full.PNG" //stars below
        }
    }
}

optionBar(elData.star, elData.ratebar, async (img) => { //handle ratings
    const value = Number(img.dataset.value)
    if (markers.rateVal == value) return

    fillStars(value)

    //send rate to server
    const result = await sendDataRequest(`/api/rate/${qID}/${value}`, errbar, window, "", "POST")
    if (!result) return

    markers.rateVal = value //update rate marker
    BtnValues.rate = true
    elData.star.src = "/resources/star_full.PNG"
    elData.ratings.innerText = result.newRate
    elData.rating.innerHTML = generateStarHTML(Number(result.newAvg))
})

//preview the rating while moving over the stars
for (const img of rateBarImgs) {
    img.addEventListener("pointerover", () => fillStars(Number(img.dataset.value)))
}

//watch and check buttons
async function setWatched(watched) {
    if (!(await sendDataRequest(`/api/watch/${watched ? "add" : "remove"}/${qID}`, errbar, window, "", "POST"))) return

    BtnValues.watch = watched
    elData.watch.src = `/resources/watch_${watched ? "full" : "empty"}.PNG`
    elData.watches.innerText = Math.max(0, Number(elData.watches.innerText) + (watched ? 1 : -1))
}

async function setSolved(solved) {
    if (!(await sendDataRequest(`/api/solve/${solved ? "add" : "remove"}/${qID}`, errbar, window, "", "POST"))) return

    BtnValues.solve = solved
    elData.check.src = `/resources/check_${solved ? "full" : "empty"}.PNG`
    elData.solves.innerText = Math.max(0, Number(elData.solves.innerText) + (solved ? 1 : -1))
}

elData.watch.addEventListener("click", () => {
    if (!needsAccount()) setWatched(!BtnValues.watch)
})

elData.check.addEventListener("click", () => {
    if (!needsAccount()) setSolved(!BtnValues.solve)
})

//  =================
//  IDS AND FETCHING
//  =================

function setContent(el, content) { //insert question/mark scheme text
    el.replaceChildren(sanitizeHTML(content))

    if (!/<[a-z][^>]*>/i.test(content)) { //plain text, keep the line breaks as they were typed
        el.classList.add("plain-text")
    }

    renderMath(el)
}

function searchLink(params) { //link to the search page with some filters filled in
    return `/search/?${new URLSearchParams({...params, searchType:"q"}).toString()}`
}

//fetch question data corresponding to that id
async function fetchData() {
    if (qID == -1) {
        window.location.href = "/home"
        return
    }

    const result = await sendDataRequest(`/api/question/get/${qID}`, errbar, window, "")
    if (!result) return

    for (const item of ["stage", "subject", "topic", "name", "user_tag", "views", "likes", "watches", "solves", "ratings", "comments", "collections", "tag", "year"]) {
        elData[item].innerText = result[item]
    }

    if (result.paper) elData.paper.innerText = `Paper ${result.paper}`
    if (result.question) elData.question.innerText = `Question ${result.question}`

    elData.rating.innerHTML = generateStarHTML(Number(result.rating)) //custom star generation for rating

    setContent(elData.qtext, result.qtext)
    setContent(elData.mstext, result.mstext)
    renderMath(elData.name)

    for (const item of ["spec", "formula"]) { //spec and formulas need their links to be changed
        if (/^https?:\/\//.test(result[item])) {
            elData[item].href = result[item]
        }
        else {
            elData[item].style.visibility = "hidden" //not every subject has one
        }
    }

    BtnValues = result.extra

    elData.user_tag.href = `/profile/${encodeURIComponent(result.user_tag.substring(1))}`

    //set like image and other images (in action sidebar)
    elData.face.src = faceImage(BtnValues.like)

    if (BtnValues.rate) {
        elData.star.src = "/resources/star_full.PNG"
    }

    if (BtnValues.watch) {
        elData.watch.src = "/resources/watch_full.PNG"
    }

    if (BtnValues.solve) {
        elData.check.src = "/resources/check_full.PNG"
    }

    //encode links into the left-hand metadata
    const stage = convertStudyStage(result.stage)

    elData.tag.href = searchLink({tag:convertTag(result.tag)})
    elData.stage.href = searchLink({stage:stage})
    elData.subject.href = searchLink({stage:stage, subject:result.subject})
    elData.topic.href = searchLink({stage:stage, subject:result.subject, topic:result.topic})

    if (result.paper) {
        elData.paper.href = searchLink({stage:stage, subject:result.subject, paper:result.paper})
    }
    if (result.year) {
        elData.year.href = searchLink({year:result.year})
    }

    document.title = `${result.name} - SCIMUS`

    //fetch the user's collections for the collection menu
    const collections = user ? await sendDataRequest(`/api/collections/get/${qID}`, errbar, window, "") : []

    //insert collection data
    for (const c of collections || []) {
        collectionSpace.appendChild(collectionTemplate(c))
    }
}

function readStorage(key, fallback) { //session storage values are json
    try {
        return JSON.parse(sessionStorage.getItem(key)) ?? fallback
    } catch (err) {
        return fallback
    }
}

const qIDS = readStorage("qIDS", null)
let index = Number(readStorage("qIndex", 0))
let clear = true
let moving = false //stops arrows being used twice while the next page loads

//recommendation queue
let rcQueue = readStorage("recommendQueue", [])
if (!Array.isArray(rcQueue)) rcQueue = []


function saveToStorage() {
    sessionStorage.setItem("qIndex", index)
    sessionStorage.setItem("qIDS", JSON.stringify(qIDS))
    sessionStorage.setItem("recommendQueue", JSON.stringify(rcQueue))
    sessionStorage.setItem("commentsOpen", cOpen)
}

async function moveTo(newIndex) { //go to another question in the list that the user came from
    if (moving || !Array.isArray(qIDS) || qIDS[newIndex] == undefined) return
    moving = true

    await scroll(false)

    index = newIndex
    saveToStorage()
    clear = false
    window.location.href = `/question/${Number(qIDS[index])}`
}

function setArrowListeners() {
    if (!Array.isArray(qIDS)) { //check there is a list to move through
        elData.arr1.style.display = "none"
        elData.arr2.style.display = "none"
    }
    else {
        if (index <= 0) {//first in list = hide arrow
            elData.arr1.style.display = "none"
        }
        if (index >= qIDS.length-1) { //last in list = hide arrow
            elData.arr2.style.display = "none"
        }
    }

    //HORIZONTAL SCROLL
    elData.arr1.addEventListener("click", () => moveTo(index-1)) //left
    elData.arr2.addEventListener("click", () => moveTo(index+1)) //right

    window.addEventListener("pagehide", () => { //if not horizontal scrolling, then remove the stored data
        if(clear) {
            sessionStorage.removeItem("qIDS")
            sessionStorage.removeItem("qIndex")
            sessionStorage.removeItem("recommendQueue")
        }

    })
}

async function showPage() {
    try {
        await fetchData()
        setArrowListeners()
        await imagesLoaded()
    }
    finally {
        document.documentElement.style.visibility = "visible"
        document.documentElement.classList.add("shown")
    }
}

//open comments if it was previously open
if (openC == "true") {
    commentsBtn.dispatchEvent(new Event("click"))
}


//VERTICAL SCROLL
async function scroll(vertical) { //vertical means if its a vertical scroll, redirect to next question
    //gather scroll data (markers)
    const timeSpent = (Date.now() - markers.viewStart)/60000 //time spent in minutes

    //[rating, watch, solve, like, commentNum, collectionNum, viewDuration, skip]
    const markersToSend = [markers.rateVal, BtnValues.watch, BtnValues.solve, BtnValues.like, markers.commentVal, markers.collectionVal, timeSpent, markers.skipVal]

    const data = {qID:qID, markers:markersToSend}

    //send markers to server if time spent above 10seconds
    if (timeSpent > (1/6) && user) {
        await sendData("/api/scroll/interaction", data, errbar, window, "", true, true)
    }


    if (vertical) {
        //if last question item, then need to load more data
        if (rcQueue.length == 0) { //if end of queue, get more questions
            const recommended = await sendData("/api/scroll/recommendation", {}, errbar, window, "", true)
            rcQueue = (recommended || []).map(q => q.question_id).filter(id => id != qID) //get list of ids
        }

        if (rcQueue.length == 0) {
            warn(errbar, "No more recommended questions right now")
            return false
        }

        //redirect to next question
        const nextPage = rcQueue.shift() //get next page
        saveToStorage()
        clear = false
        window.location.href = `/question/${Number(nextPage)}`
    }

    return true
}

elData.arr3.addEventListener("click", async function(){ //event listener for bottom arrow
    if (moving || needsAccount()) return //recommendations are made for the user
    moving = true

    if (!(await scroll(true))) moving = false
})


showPage()
