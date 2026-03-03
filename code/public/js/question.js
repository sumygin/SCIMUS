import {generateStarHTML, warn, success, sendDataRequest, convertTag, convertStudyStage, sendFormData} from "./utils.js"

document.documentElement.style.visibility = "hidden"

let BtnValues = { //values of the sidebar (for animation purposes)
    like:0,
    watch:false,
    solve:false,
    rate:false,
}

const errbar = document.getElementsByClassName("error")[0]

const msBtn = document.getElementById("msBtn")
let flipped = false

const commentsTab = document.getElementById("comments-tab")
const commentsBtn = document.getElementById("commentBtn")
const questionSpace = document.getElementById("question")
let commentTabOpenYet = false
let cOpen = false

const likeBarImgs = document.querySelectorAll(".like-bar img")
const rateBarImgs = document.querySelectorAll(".rate-bar img")

const collectionMenu = document.getElementsByClassName("col-bar")[0]
const collectionSpace = document.getElementsByClassName("collection-wrapper")[0]

const qElementList = ["stage", "subject","paper","question","topic","name","user_tag","rating","views", //insert els
    "qtext","mstext","formula","spec","formula","likes","watches","solves","ratings","comments","collections", "tag",
    "likebar", "face", "smile", "neutral", "frown", "star", "ratebar", "watch", "check", "arr1", "arr2", "plus", "addcol",
    "cForm", "rbar", "rbaruser", "cinput", "csubmit", "page", "commentSpace", "rcancel", "replybar"
]
let elData = {}

for (let el of qElementList) {
    elData[el] = document.getElementById(el)
}



//MARK SCHEME TOGGLE

msBtn.addEventListener("click", async () => { //ms show/hide
    if (!flipped) {
        elData.qtext.style.display = "none" //show ms
        elData.mstext.style.display = "block"
        msBtn.innerHTML = "Question"

        if (!BtnValues.solve) {
            elData.check.src = "/resources/check_full.PNG"
            elData.solves.innerHTML = +elData.solves.innerHTML + 1
            await sendDataRequest(`/api/solve/add/${qID}`, errbar, window, "")
            BtnValues.solve = true
        }
    }
    else {
        elData.qtext.style.display = "block" //show question
        elData.mstext.style.display = "none"
        msBtn.innerHTML = "Mark scheme"
    }
    flipped = !flipped
})

//private/public collection button toggle
async function buttonToggle(btn) {
    if (!(await sendDataRequest(`/api/collection/visibility/${btn.parentNode.parentNode.id}`, errbar, window, ""))) return

    if (btn.innerHTML == "Private") {
        btn.innerHTML = "Public"
        btn.style.color = "darkgreen"
    }
    else {
        btn.innerHTML = "Private"
        btn.style.color = "darkred"
    }
}

//checked/unchecked collection button toggle
async function checkedTogle(btn) {
    const request = await sendDataRequest(`/api/collection/question/${qID}/${btn.parentNode.parentNode.id}`, errbar, window, "")
    if (!request) return

    elData.collections.innerHTML = request.newColnum

    if (btn.classList.contains("checked")) {
        btn.src = "/resources/check_empty.PNG"
    }
    else {
        btn.src = "/resources/check_full.PNG"
    }
    btn.classList.toggle("checked")

    //send data to server
}

async function collectionNameEdit(e, inp) { //send name change to server
    if (!(await sendDataRequest(`/api/collection/rename/${inp.value}/${inp.parentNode.id}`, errbar, window, ""))) {
        e.preventDefault() //if request failed, prevent edit
    }
}

//COLLECTION MENU TOGGLE

elData.plus.addEventListener("click", () =>{
    if (collectionMenu.style.display == "block") {
        collectionMenu.style.display = "none"
    }
    else {
        collectionMenu.style.display = "block"
    }
})

//add collection
elData.addcol.addEventListener("click", async () =>{
    const newCol = document.createElement("div")
    newCol.classList.add("col-item")
    newCol.innerHTML =
    `
        <input type="text" value="New collection">
        <div class="col-optns">
            <div class="publish-btn">Private</div>
            <img src="/resources/check_empty.PNG" alt="" class="icon col-check">
        </div>
    `
    const pBtn = newCol.querySelector(".publish-btn") //add functionality to publish button
    pBtn.addEventListener("click", () => buttonToggle(pBtn))

    const addbtn = newCol.querySelector(".col-check")//add functionality to check button
    addbtn.addEventListener("click", () => checkedTogle(addbtn))

    const inp = newCol.querySelector("input") //detect name change
    inp.addEventListener("change", (e) => collectionNameEdit(e, inp))

    
    //create collection on server
    let newID = await sendDataRequest("/api/collection/create", errbar, window, "")
    console.log(newID)
    if (newID) {
        newCol.id = newID.id
        collectionSpace.appendChild(newCol)
    }
    
})

//COMMENT TOGGLE

const openC = sessionStorage.getItem("commentsOpen", "false")

commentsBtn.addEventListener("click", () => { //comment show/hide
    if (!commentTabOpenYet) {
        getComments(true)
        commentTabOpenYet = true
    }
    if (!cOpen) {
        sessionStorage.setItem("commentsOpen", "true")
        commentsTab.style.display = "block" //show comments
        questionSpace.style.width = '70%'
    }
    else {
        sessionStorage.setItem("commentsOpen", "false")
        commentsTab.style.display = "none" //hide comments
        questionSpace.style.width = '100%'
    }
    cOpen = !cOpen
})

//===========
//COMMENTS
//===========

elData.cForm.addEventListener("submit", async e => { 
    elData.cinput.setCustomValidity("")

    //client side validation

    if (elData.cinput.value > 200) { 
        reportInvalid(elData.cinput, "Comment can't be longer than 200 characters!", e)
        return
    }

    e.preventDefault() //prevent form being sent

    //processing form data

    let replyID = "0"

    if (elData.replybar.style.display == "flex" && elData.replybar.data) {//if a reply is active
        replyID = elData.replybar.data
    } 

    const result = await sendFormData(`/api/comments/create/${qID}/${replyID}`, elData.cForm, errbar, window, "Comment submitted", true)

    elData.replybar.data = ""
    elData.replybar.style.display = "none"

    if (result) {
        elData.cinput.value = ""
    }

    return
})

//COMMENT LIKES

let curCommentLike
let lastLikeValues = {}

async function loadMoreComments(e){ //if load more clicked, they are loaded
    const btn = e.currentTarget
    const result = await sendDataRequest(`/api/replies/get/${btn.id}`, errbar, window, "")
    btn.innerHTML = ""
    btn.appendChild(generateFullCommentHTML(result))
    btn.removeEventListener("click", loadMoreComments)
}

function commentTemplate(c){ 
    let newComment = document.createElement("div")
    newComment.classList.add("comment-wrapper")

    newComment.innerHTML =`
                                <div class="comment">
                                    <div class="c-top">
                                        <div class="c-names">
                                            <div class="c-name" href="${`/profile/${c.user_tag}`}">
                                                ${c.username}
                                            </div>
                                            <div class="c-tag" href="${`/profile/${c.user_tag}`}">
                                                @${c.user_tag}
                                            </div>
                                        </div>
                                        <div class="icons">
                                                <span class="val">${c.like_rating}</span><button class="like-ic">
                                                    <span class="facewrap">
                                                        <img src="/resources/neutral.PNG" alt="" class="icon face"></button>
                                                        
                                                        <span class="like-bar likebar">
                                                            <img src="/resources/smile.PNG" class="icon" id="1">
                                                            <img src="/resources/neutral.PNG" class="icon" id="0">
                                                            <img src="/resources/frown.PNG" class="icon" id="-1">
                                                        </span>
                                                    </span>
                                                <button class="reply">
                                                    <img src="/resources/comments.PNG" alt="" class="icon comment-icon"></button>
                                                </button>
                                            </div>
                                        </div>
                                    <div class="c-text">
                                        ${c.content}
                                    </div>

                                </div>
                                <div class="c-replies">
                                    ${
                                        c.moreReplies ? '<button class="c-load">[ load replies ]</button>' : ""
                                    }
                                    
                                </div>`
    
    const face = newComment.querySelector(".face")
    const likebar = newComment.querySelector(".likebar")
    const likeValue = newComment.querySelector(".val")
    const likeImgs = likebar.querySelectorAll("img")

    let curLike
    let lastLikeValue = c.userLikeVal

    //initial/onload face state
    if (c.userLikeVal == 1) face.src = "/resources/smile.PNG"
    else if (c.userLikeVal == -1) face.src = "/resources/frown.PNG"

    //when face is clicked
    face.addEventListener("pointerdown", () => {
        likebar.style.display = "flex"
    })

    //when click is released

    
    //when a like value is selected
    likebar.addEventListener("pointerup", async () => {
        likebar.style.display = "none"
        if (!curLike) return

        const value = Number(curLike.id)
        if (lastLikeValue === value) return

        lastLikeValue = value
        face.src = curLike.src

        const result = await sendDataRequest(`/api/comment/like/${c.comment_id}/${value}`, errbar, window, "")

        if (result) {
            likeValue.innerText = result.newLikes
        }
    })

    likeImgs.forEach(img => {
        img.addEventListener("pointerover", () => {
            curLike = img
        })
    })

    const replyTrigger = newComment.querySelector(".reply") //get reply button
    const replyTag = newComment.querySelector(".c-tag")
    replyTrigger.addEventListener("click", () => {
        showReplyBar(replyTag.innerHTML, c.comment_id)
    })

    const replyBTN = newComment.querySelector(".c-replies")
    if (replyBTN) replyBTN.id = c.comment_id //set id of more replies button to easily add more later

    replyBTN.addEventListener("click", loadMoreComments)

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
    

    //append new data
    elData.commentSpace.appendChild(generateFullCommentHTML(result))         

    if (result.length >= 20) { //if tehre is potential for more data to be loaded later
        elData.commentSpace.insertAdjacentHTML('beforeend', '<div id="bottomDetect" style="height: 10px; opacity: 0;"></div>')
        const bottomEl = document.getElementById("bottomDetect")
        observer.observe(bottomEl)
    }
    else {
        hasMore = false //tehre is no more data to load
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
    rootMargin: '1000px', //data load from 100px from bottom
    threshold: 0.1
})

//REPLYING TO COMMENTS

function showReplyBar(tag, cID) { //if a reply button is clicked, set label to their tag and show replybar
    elData.replybar.style.display = "flex"
    elData.replybar.data = cID
    elData.rbaruser.innerHTML = tag
}

elData.rcancel.addEventListener("click", function(e) { //if X is clicked, hide likebar
    e.preventDefault()
    elData.replybar.style.display = "none"
    elData.replybar.data = ""
})


//  =================
//  LIKES AND RATINGS
//  =================

let curLike
let lastLikeValue

elData.face.addEventListener("pointerdown", () => { //when like pressed, show likebar
    elData.likebar.style.display = "flex"
})

elData.likebar.addEventListener("pointerup", async () => { //when mouse released, send like to server
    elData.likebar.style.display = "none"
    if(lastLikeValue == curLike.id || BtnValues.like == Number(curLike.id)) { return}

    lastLikeValue = curLike.id
    elData.face.src = curLike.src
    BtnValues.like = Number(curLike.id)

    //send like to server using curLike

    elData.likes.innerHTML = (await sendDataRequest(`/api/like/${qID}/${curLike.id}`, errbar, window, "")).newLikes
})

document.addEventListener("pointerup", () => {
    elData.likebar.style.display = "none"
})

//add like/dislike detection
for (const img of likeBarImgs) {
    img.addEventListener("pointerover", () => {
        curLike = img
    })
}

let curStar
let lastRateVal

elData.star.addEventListener("pointerdown", () => {
    elData.ratebar.style.display = "flex"
})

elData.ratebar.addEventListener("pointerup", async () => { //handle ratings
    elData.ratebar.style.display = "none"

    if (!BtnValues.rate) {
        BtnValues.rate = true
        elData.star.src = "/resources/star_full.PNG"
        elData.ratings.innerText = +elData.ratings.innerText + 1
    }

    if (lastRateVal == curStar.id) {return}
    lastRateVal = curStar.id

    //send rate to server using curStara
    const result = (await sendDataRequest(`/api/rate/${qID}/${Number(curStar.id)}`, errbar, window, ""))
    if (!result) return
    elData.ratings.innerHTML = result.newRate
    elData.rating.innerHTML = generateStarHTML(Number(result.newAvg))
})

//add rating detection
for (const img of rateBarImgs) { //if star pointed over, save it as last rate value curStar
    img.addEventListener("pointerover", () => {
        curStar = img
        
        for (const item of rateBarImgs) {
            if (Number(item.id) > Number(img.id)) { //stars above
                item.src = "/resources/star_empty.PNG"
            }
            else {
                item.src = "/resources/star_full.PNG" //star below
            }
        }
    })
}

//watch and check animations
elData.watch.addEventListener("click", async () => {
    if (!BtnValues.watch) {
        elData.watch.src = "/resources/watch_full.PNG"
        elData.watches.innerHTML = +elData.watches.innerHTML + 1
        await sendDataRequest(`/api/watch/add/${qID}`, errbar, window, "")
    }
    else {
        elData.watch.src = "/resources/watch_empty.PNG"
        elData.watches.innerHTML = +elData.watches.innerHTML - 1
        await sendDataRequest(`/api/watch/remove/${qID}`, errbar, window, "")
    }
    BtnValues.watch = !BtnValues.watch

    //send appropriate server request
})

elData.check.addEventListener("click",  async() => {
    if (!BtnValues.solve) {
        elData.check.src = "/resources/check_full.PNG"
        elData.solves.innerHTML = +elData.solves.innerHTML + 1
        await sendDataRequest(`/api/solve/add/${qID}`, errbar, window, "")
    }
    else {
        elData.check.src = "/resources/check_empty.PNG"
        elData.solves.innerHTML = +elData.solves.innerHTML - 1
        await sendDataRequest(`/api/solve/remove/${qID}`, errbar, window, "")
    }
    BtnValues.solve = !BtnValues.solve
})

//  =================
//  IDS AND FETCHING 
//  =================

//fetch ID and check if valid
let qID = window.location.href.split("/question")[1].substring(1)
if (isNaN(Number(qID))) qID = -1
if (qID == "") qID = -1

//fetch question data corresponding to that id
async function fetchData() {
    if (qID == -1) {
        window.location.href = "/home"
        return
    }

    const result = await sendDataRequest(`/api/question/get/${qID}`, errbar, window, "")

    console.log(result)

    for (const item in result) {
        if (item == "spec" || item == "formula") { //spec and formulas need their links to be changed
            elData[item].href = result[item]
        }
        else if (item == "rating") { //custom star generation for rating
            elData[item].innerHTML = generateStarHTML(Number(result[item]))
        }
        else if (item == "extra") { //detect additional user/question data and intercept
            BtnValues = result[item]
        }
        else {
            elData[item].innerText = result[item]
        }
    }

    elData.user_tag.href = `/user/${result.user_tag.substring(1)}`

    if (BtnValues.like == -1) { //set like image and other images (in action sidebar)
            elData.face.src = "/resources/frown.PNG"
    }
    else if (BtnValues.like == 1) {
        elData.face.src = "/resources/smile.PNG"
    }

    if (BtnValues.rate == 1) {
        elData.star.src = "/resources/star_full.PNG"
    }

    if (BtnValues.watch == 1) {
        elData.watch.src = "/resources/watch_full.PNG"
    }

    if (BtnValues.solve == 1) {
        elData.check.src = "/resources/check_full.PNG"
    }

    elData.tag.href = //encode links into the left-hand metadata
    `/search/?tag=${encodeURIComponent(convertTag(result.tag))}&searchType=q`

    elData.stage.href =
    `/search/?stage=${encodeURIComponent(convertStudyStage(result.stage))}&searchType=q`

    elData.subject.href =
    `/search/?stage=${encodeURIComponent(convertStudyStage(result.stage))}&subject=${encodeURIComponent(result.subject)}&searchType=q`

    elData.topic.href =
    `/search/?stage=${encodeURIComponent(convertStudyStage(result.stage))}&subject=${encodeURIComponent(result.subject)}&topic=${encodeURIComponent(result.topic)}&searchType=q`

    document.title = `${result.name} - SCIMUS`

    //fetch collection data
    const collections = await sendDataRequest(`/api/collections/get/${qID}`, errbar, window, "")

    //insert collection data
    for (const c of collections) {
        const newCol = document.createElement("div")
        newCol.classList.add("col-item")
        newCol.id = c.collection_id
        newCol.innerHTML = `
            <input type="text" value="${c.name}">
            <div class="col-optns">
                <div class="publish-btn">Private</div>
                <img src="/resources/check_empty.PNG" alt="" class="icon col-check">
            </div>
        `

        const pBtn = newCol.querySelector(".publish-btn") //edit publish button according to collection published
        if (c.published) {
            pBtn.innerHTML = "Public"
            pBtn.style.color = "darkgreen"
        }
        else {
            pBtn.innerHTML = "Private"
            pBtn.style.color = "darkred"
        }

        const cBtn = newCol.querySelector(".col-check") //edit publish button according to collection published
        if (c.includesQuestion) {
            cBtn.classList.add("checked")
            cBtn.src = "/resources/check_full.PNG"
        }
        else {
            cBtn.src = "/resources/check_empty.PNG"
        }

        collectionSpace.appendChild(newCol)
    }
    
    //add event listeners
    const ppButtons = document.getElementsByClassName("publish-btn")
    for (const btn of ppButtons) {
        btn.addEventListener("click", () => buttonToggle(btn))
    }

    const cButtons = document.getElementsByClassName("col-check")
    for (const btn of cButtons) {
        btn.addEventListener("click", () => checkedTogle(btn))
    }

    const inputs = document.querySelectorAll(".col-item input")
    for (const inp of inputs) {
        inp.addEventListener("change", (e) => collectionNameEdit(e, inp))
    }
}

const qIDS = JSON.parse(sessionStorage.getItem("qIDS"))
const index = JSON.parse(sessionStorage.getItem("qIndex"))
let clear = true

async function setArrowListeners() {
    

    console.log(qIDS, index)

    if (!qIDS) { //check there is 
        elData.arr1.style.display = "none"
        elData.arr2.style.display = "none"
    }
    else {
        if (index == 0) {//first in list = hide arrow
            elData.arr1.style.display = "none"
        }
        if (index == qIDS.length-1) { //last in list = hide arrow
            elData.arr2.style.display = "none"
        }
    }

    //HORIZONTAL SCROLL
    elData.arr1.addEventListener("click", () => { //left
        sessionStorage.setItem("qIDS", JSON.stringify(qIDS)) //store question ids and index 
        sessionStorage.setItem("qIndex", index-1)
        window.location.href = `/question/${qIDS[index-1]}`
        clear = false
    })

    elData.arr2.addEventListener("click", () => { //right
        sessionStorage.setItem("qIDS", JSON.stringify(qIDS)) //store question ids and index 
        sessionStorage.setItem("qIndex", index+1)
        window.location.href = `/question/${qIDS[index+1]}`
        clear = false
    })

    window.addEventListener("pagehide", () => { //if not horizontal scrolling, then remove the stored data
        if(clear) {
            sessionStorage.removeItem("qIDS")
            sessionStorage.removeItem("qIndex")
        }
        
    })
}

async function showPage() {
    await fetchData()
    await setArrowListeners()
    await Promise.all(
      [...document.images].map(img =>
          img.complete ? Promise.resolve() : new Promise(r => img.onload = r)
      )
    )
    document.documentElement.style.visibility = "visible"
}

//open comments if it was previously open
if (openC == "true") {
    commentsBtn.dispatchEvent(new Event("click"))
}


//VERTICAL SCROLL

showPage()
