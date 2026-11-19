import {generateStarHTML, warn, sendDataRequest, convertTag, convertStudyStage, sendData, reportInvalid,
    escapeHTML, sanitizeHTML, renderMath, imagesLoaded, getUser, goToLogin, setBusy, emptyState, loader, clearLoading, showPage as revealPage, openAnimated, closeAnimated, bump} from "./utils.js"

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
    btn.dataset.tip = published ? "Everyone can see this collection. Click to make it private" : "Only you can see this collection. Click to make it public"
}

function setCheckTip(btn) { //tick next to each collection in the menu
    btn.dataset.tip = btn.classList.contains("checked") ? "In this collection. Click to remove it" : "Add to this collection"
}

//labels on the side buttons say what pressing them will do now
function updateActionTips() {
    document.querySelector(".watch-ic").dataset.tip = BtnValues.watch
        ? "Watching: you'll be told about new comments. Click to stop" : "Watch: get notified about new comments"
    document.querySelector(".solved-ic").dataset.tip = BtnValues.solve ? "Solved. Click to unmark" : "Mark as solved"
    document.querySelector(".comment-ic").dataset.tip = cOpen ? "Hide comments" : "Show comments"
}

//checked/unchecked collection button toggle
async function checkedToggle(btn, cID) {
    const request = await sendDataRequest(`/api/collection/question/${qID}/${cID}`, errbar, window, "", "POST")
    if (!request) return

    elData.collections.innerText = request.newColnum
    bump(elData.collections)

    if (btn.classList.contains("checked")) { ///uncheck
        markers.collectionVal = Math.max(0, markers.collectionVal-1) //update markers
        btn.src = "/resources/check_empty.PNG"
    }
    else { //check
        markers.collectionVal += 1 //update marker
        btn.src = "/resources/check_full.PNG"
    }
    btn.classList.toggle("checked")
    setCheckTip(btn)
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
        setCheckTip(cBtn)
        cBtn.src = "/resources/check_full.PNG"
    }
    setCheckTip(cBtn)
    cBtn.addEventListener("click", () => checkedToggle(cBtn, c.collection_id))

    return newCol
}

//COLLECTION MENU TOGGLE

elData.plus.addEventListener("click", () =>{
    if (needsAccount()) return
    if (collectionMenu.style.display == "block" && !collectionMenu.classList.contains("closing")) {
        closeAnimated(collectionMenu)
    }
    else {
        openAnimated(collectionMenu, "block")
    }
})

document.addEventListener("click", (e) => { //close when clicked off of
    if (e.target != elData.plus && !collectionMenu.contains(e.target)) {
        closeAnimated(collectionMenu)
    }
})

document.addEventListener("keydown", (e) => { //escape closes whatever is open
    if (e.key != "Escape") return
    closeAnimated(collectionMenu)
    if (openBar) {
        closeAnimated(openBar.bar)
        openBar = undefined
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
        openAnimated(commentsTab, "block") //show comments
        requestAnimationFrame(() => fitToWindow())
    }
    else {
        sessionStorage.setItem("commentsOpen", "false")
        closeAnimated(commentsTab) //hide comments
    }
    cOpen = !cOpen
    updateActionTips()
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

        if (openBar && openBar.bar != bar) closeAnimated(openBar.bar)

        const alreadyOpen = bar.style.display == "flex" && !bar.classList.contains("closing")
        openBar = {trigger:trigger, bar:bar, onPick:onPick, justOpened:!alreadyOpen}
        openAnimated(bar, "flex")
    })
}

document.addEventListener("pointerup", (e) => {
    if (!openBar) return

    if (e.target == openBar.trigger && openBar.justOpened) { //pressed and released on the button, keep it open
        openBar.justOpened = false
        return
    }

    closeAnimated(openBar.bar)

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
        bump(elData.comments)

        await getComments(true)
        showPosted(result.id, replyID)
    }
})

//scrolls to a comment that was just posted and briefly highlights it. replies are inside their comment, so that opens first
async function showPosted(commentID, parentID) {
    if (parentID != 0) {
        const parent = elData.commentSpace.querySelector(`.comment-wrapper[data-id="${Number(parentID)}"]`)
        const loadBtn = parent?.querySelector(":scope > .c-replies > .c-load")
        if (loadBtn) await loadReplies(loadBtn, parent.querySelector(":scope > .c-replies"))
    }

    const posted = elData.commentSpace.querySelector(`.comment-wrapper[data-id="${Number(commentID)}"]`)
    if (!posted) return

    posted.scrollIntoView({behavior: "smooth", block: "nearest"})
    posted.classList.add("just-posted")
}

elData.cinput.addEventListener("focus", () => { //starting to write a comment
    needsAccount()
})

elData.cinput.addEventListener("input", () => {
    elData.cinput.setCustomValidity("")
})

//COMMENT LIKES

async function loadReplies(btn, space){ //if load replies clicked, they are loaded
    if (btn.disabled) return
    btn.disabled = true
    btn.innerText = "[ loading... ]"

    const result = await sendDataRequest(`/api/replies/get/${btn.dataset.id}`, errbar, window, "")
    if (!result) {
        btn.disabled = false
        btn.innerText = "[ load replies ]"
        return
    }

    btn.remove()
    space.appendChild(generateFullCommentHTML(result))
}

function commentTemplate(c){
    let newComment = document.createElement("div")
    newComment.classList.add("comment-wrapper")
    newComment.dataset.id = c.comment_id

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
                                            <button type="button" class="like-ic" aria-label="Like or dislike" data-tip="Like or dislike">
                                                <span class="facewrap"><img src="${faceImage(c.userLikeVal)}" alt="" class="icon face"></span>
                                            </button>
                                            <span class="like-bar likebar">
                                                <img src="/resources/smile.PNG" alt="Like" class="icon" data-value="1">
                                                <img src="/resources/neutral.PNG" alt="Neutral" class="icon" data-value="0">
                                                <img src="/resources/frown.PNG" alt="Dislike" class="icon" data-value="-1">
                                            </span>
                                            <button type="button" class="reply" aria-label="Reply" data-tip="Reply">
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
            bump(likeValue)
            bump(face)
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

    elData.commentSpace.appendChild(loader(deleteOld ? "Loading comments" : "Loading more"))

    let result = await sendDataRequest(`/api/comments/get/${qID}/${elData.page.value}`, errbar, window, "")

    clearLoading(elData.commentSpace)

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
    openAnimated(elData.replybar, "flex")
    elData.replybar.data = cID
    elData.rbaruser.innerText = tag
    elData.cinput.focus()
}

function hideReplyBar() {
    closeAnimated(elData.replybar)
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
    bump(elData.likes)
    bump(elData.face)
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
    bump(elData.ratings)
    bump(elData.star)
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
    updateActionTips()
    elData.watch.src = `/resources/watch_${watched ? "full" : "empty"}.PNG`
    elData.watches.innerText = Math.max(0, Number(elData.watches.innerText) + (watched ? 1 : -1))
    bump(elData.watches)
    bump(elData.watch)
}

async function setSolved(solved) {
    if (!(await sendDataRequest(`/api/solve/${solved ? "add" : "remove"}/${qID}`, errbar, window, "", "POST"))) return

    BtnValues.solve = solved
    updateActionTips()
    elData.check.src = `/resources/check_${solved ? "full" : "empty"}.PNG`
    elData.solves.innerText = Math.max(0, Number(elData.solves.innerText) + (solved ? 1 : -1))
    bump(elData.solves)
    bump(elData.check)
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
    updateActionTips()

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

    //the collection menu is only needed once + is pressed, so it doesn't hold up the page
    if (user) loadCollections()
}

async function loadCollections() { //fetch the user's collections for the collection menu
    collectionSpace.replaceChildren(loader())

    const collections = await sendDataRequest(`/api/collections/get/${qID}`, errbar, window, "")

    clearLoading(collectionSpace)

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

//  ==========================
//  MOVING BETWEEN QUESTIONS
//  ==========================

//slides the question off the screen and loads the next one, which then slides in from the other side.
//direction is where the new question comes from: "below", "above", "right" or "left"
function goTo(id, direction) {
    sessionStorage.setItem("enterFrom", direction)
    saveToStorage()
    clear = false

    document.documentElement.classList.add(`leave-to-${{below:"top", above:"bottom", right:"left", left:"right"}[direction]}`)

    setTimeout(() => {
        window.location.href = `/question/${Number(id)}`
    }, 230)
}

async function moveTo(newIndex) { //go to another question in the list that the user came from
    if (moving || !Array.isArray(qIDS) || qIDS[newIndex] == undefined) return
    moving = true

    await sendInteraction()

    const direction = newIndex > index ? "right" : "left"
    index = newIndex
    goTo(qIDS[index], direction)
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
            sessionStorage.removeItem("scrollTrail")
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
        revealPage()
        wheelReadyAt = Date.now() + 700 //ignore the end of the scroll that brought the user here
        setTimeout(() => document.documentElement.classList.add("settled"), 500) //slide-in finished, page can scroll again
        fitToWindow()
    }
}

//on shorter laptop screens the question and comment boxes are made a little shorter so the whole question
//fits in the window, instead of the page scrolling by a few pixels. on taller screens nothing changes
const fitBoxes = [document.querySelector("#question-card .question"), commentsTab]
const wideScreen = window.matchMedia("(min-width: 769px)")

function fitToWindow() {
    for (const box of fitBoxes) box.style.maxHeight = ""
    if (!wideScreen.matches) return

    const overflow = document.body.scrollHeight - document.body.clientHeight
    if (overflow <= 0) return

    for (const box of fitBoxes) {
        //max-height counts the inside of the box, without its padding and border
        if (box.offsetHeight) box.style.maxHeight = `${parseFloat(getComputedStyle(box).height) - overflow - 2}px`
    }
}

let fitTimer
window.addEventListener("resize", () => {
    clearTimeout(fitTimer)
    fitTimer = setTimeout(fitToWindow, 100)
})

//open comments if it was previously open
if (openC == "true") {
    commentsBtn.dispatchEvent(new Event("click"))
}

//sends what the user did with this question to the recommendation model, if they spent more than 10 seconds on it
async function sendInteraction() {
    const timeSpent = (Date.now() - markers.viewStart)/60000 //time spent in minutes

    //[rating, watch, solve, like, commentNum, collectionNum, viewDuration, skip]
    const markersToSend = [markers.rateVal, BtnValues.watch, BtnValues.solve, BtnValues.like, markers.commentVal, markers.collectionVal, timeSpent, markers.skipVal]

    if (timeSpent > (1/6) && user) {
        await sendData("/api/scroll/interaction", {qID:qID, markers:markersToSend}, errbar, window, "", true, true)
    }
}

//VERTICAL SCROLL

//questions reached by scrolling, so scrolling back up returns to them in order
const cameByScroll = ["below", "above"].includes(document.documentElement.dataset.enterFrom)
let trail = cameByScroll ? readStorage("scrollTrail", null) : null
if (!trail || !Array.isArray(trail.ids) || trail.ids[trail.pos] != qID) {
    trail = {ids:[qID], pos:0}
}

function saveTrail() {
    sessionStorage.setItem("scrollTrail", JSON.stringify(trail))
}

async function nextQuestion() { //scroll down
    if (moving || !user) return
    moving = true
    hideNextHint()

    await sendInteraction()

    let nextID = trail.ids[trail.pos+1] //scrolled back up earlier, so the next one is already known

    if (nextID == undefined) {
        //if end of queue, get more questions
        if (rcQueue.length == 0) {
            const recommended = await sendData("/api/scroll/recommendation", {}, errbar, window, "", true)
            rcQueue = (recommended || []).map(q => q.question_id).filter(id => id != qID && !trail.ids.includes(id)) //get list of ids
        }

        if (rcQueue.length == 0) {
            warn(errbar, "No more recommended questions right now")
            moving = false
            return
        }

        nextID = rcQueue.shift() //get next page
        trail.ids = trail.ids.slice(0, trail.pos+1)
        trail.ids.push(nextID)
    }

    trail.pos++
    saveTrail()
    goTo(nextID, "below")
}

async function previousQuestion() { //scroll up
    if (moving || trail.pos == 0) return
    moving = true

    await sendInteraction()

    trail.pos--
    saveTrail()
    goTo(trail.ids[trail.pos], "above")
}

elData.arr3.addEventListener("click", function(){ //event listener for bottom arrow
    if (needsAccount()) return //recommendations are made for the user
    nextQuestion()
})

//whether a scroll would move something on the page (a long question, the comments, the page itself) rather than go to another question
function scrollsSomething(el, deltaY) {
    for (; el && el != document.documentElement; el = el.parentElement) {
        const style = getComputedStyle(el)
        const scrollable = /(auto|scroll)/.test(style.overflowY) || el == document.body
        if (!scrollable || el.scrollHeight <= el.clientHeight + 1) continue

        if (deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
        if (deltaY < 0 && el.scrollTop > 0) return true
    }
    return false
}

function somethingOpen() { //menus and bars that a scroll shouldn't close the page under
    return !!openBar || collectionMenu.style.display == "block"
}

//MOUSE WHEEL / TRACKPAD
let wheelReadyAt = Infinity //set once the page is showing
let wheelTotal = 0
let wheelReset
let lastInnerScroll = 0

document.addEventListener("wheel", (e) => {
    if (!user || moving || e.ctrlKey || somethingOpen()) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return //sideways scrolling

    const now = Date.now()

    if (scrollsSomething(e.target, e.deltaY)) { //let the box or page scroll as normal
        lastInnerScroll = now
        wheelTotal = 0
        return
    }

    //the same flick that just reached the end of a box doesn't count, a new scroll does
    if (now < wheelReadyAt || now - lastInnerScroll < 450) {
        lastInnerScroll = Math.max(lastInnerScroll, now)
        return
    }

    const delta = e.deltaY * (e.deltaMode == 1 ? 16 : e.deltaMode == 2 ? window.innerHeight : 1)
    wheelTotal += delta

    clearTimeout(wheelReset)
    wheelReset = setTimeout(() => wheelTotal = 0, 300)

    if (wheelTotal > 60) {
        wheelTotal = 0
        nextQuestion()
    }
    else if (wheelTotal < -60) {
        wheelTotal = 0
        if (trail.pos > 0) previousQuestion()
    }
}, {passive: true})

//SWIPING ON PHONES: swipe up once the bottom of the page is reached
let touchStart

document.addEventListener("touchstart", (e) => {
    if (e.touches.length != 1) return
    touchStart = {y: e.touches[0].clientY, time: Date.now(), atEnd: !scrollsSomething(e.target, 1)}
}, {passive: true})

document.addEventListener("touchend", (e) => {
    if (!touchStart || !user || moving || somethingOpen()) return

    const distance = touchStart.y - e.changedTouches[0].clientY
    const quick = Date.now() - touchStart.time < 700

    if (touchStart.atEnd && quick && distance > 70 && !scrollsSomething(e.target, 1)) {
        nextQuestion()
    }
    touchStart = undefined
}, {passive: true})

//KEYBOARD: up/down for scrolling questions, left/right for the list arrows
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || somethingOpen()) return
    if (e.target.closest("input, textarea, select, [contenteditable='true']")) return

    if (e.key == "ArrowDown" && !scrollsSomething(document.activeElement || document.body, 1)) {
        if (user) {
            e.preventDefault()
            nextQuestion()
        }
    }
    else if (e.key == "ArrowUp" && trail.pos > 0 && !scrollsSomething(document.activeElement || document.body, -1)) {
        e.preventDefault()
        previousQuestion()
    }
    else if (e.key == "ArrowRight" && elData.arr2.style.display != "none" && Array.isArray(qIDS)) {
        moveTo(index+1)
    }
    else if (e.key == "ArrowLeft" && elData.arr1.style.display != "none" && Array.isArray(qIDS)) {
        moveTo(index-1)
    }
})

//"scroll for next question" under the bottom arrow, until the user has done it a few times
const nextHint = document.getElementById("next-hint")
let hintUses = 0
try {
    hintUses = Number(localStorage.getItem("nextHintUses")) || 0
} catch (err) {}

if (user && hintUses < 3) {
    nextHint.innerText = window.matchMedia("(hover: none)").matches ? "swipe up for the next question" : "scroll for the next question"
    nextHint.classList.add("show")
}

function hideNextHint() {
    try {
        localStorage.setItem("nextHintUses", hintUses + 1)
    } catch (err) {}
}


showPage()
