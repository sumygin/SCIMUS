import {generateStarHTML, warn, success, sendDataRequest, convertTag, convertStudyStage} from "./utils.js"

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
let cOpen = false

const likeBarImgs = document.querySelectorAll(".like-bar img")
const rateBarImgs = document.querySelectorAll(".rate-bar img")

const qElementList = ["stage", "subject","paper","question","topic","name","user_tag","rating","views", //insert els
    "qtext","mstext","formula","spec","formula","likes","watches","solves","ratings","comments","collections", "tag",
    "likebar", "face", "smile", "neutral", "frown", "star", "ratebar", "watch", "check", "arr1", "arr2"
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
            await sendDataRequest(`/solve/add/${qID}`, errbar, window, "")
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


//COMMENT TOGGLE

commentsBtn.addEventListener("click", () => { //comment show/hide
    if (!cOpen) {
        commentsTab.style.display = "block" //show comments
        questionSpace.style.width = '70%'
    }
    else {
        commentsTab.style.display = "none" //hide comments
        questionSpace.style.width = '100%'
    }
    cOpen = !cOpen
})


//  =================
//  LIKES AND RATINGS
//  =================

let curLike
let lastLikeValue

elData.face.addEventListener("pointerdown", () => {
    elData.likebar.style.display = "flex"
})

elData.likebar.addEventListener("pointerup", async () => {
    elData.likebar.style.display = "none"
    if(lastLikeValue == curLike.id || BtnValues.like == Number(curLike.id)) { return}

    lastLikeValue = curLike.id
    elData.face.src = curLike.src
    BtnValues.like = Number(curLike.id)

    //send like to server using curLike

    elData.likes.innerHTML = (await sendDataRequest(`/like/${qID}/${curLike.id}`, errbar, window, "")).newLikes
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

elData.ratebar.addEventListener("pointerup", async () => {
    elData.ratebar.style.display = "none"

    if (!BtnValues.rate) {
        BtnValues.rate = true
        elData.star.src = "/resources/star_full.PNG"
        elData.ratings.innerText = +elData.ratings.innerText + 1
    }

    if (lastRateVal == curStar.id) {return}
    lastRateVal = curStar.id

    //send rate to server using curStara
    const result = (await sendDataRequest(`/rate/${qID}/${Number(curStar.id)}`, errbar, window, ""))
    if (!result) return
    elData.ratings.innerHTML = result.newRate
    elData.rating.innerHTML = generateStarHTML(Number(result.newAvg))
})

//add rating detection
for (const img of rateBarImgs) {
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
        await sendDataRequest(`/watch/add/${qID}`, errbar, window, "")
    }
    else {
        elData.watch.src = "/resources/watch_empty.PNG"
        elData.watches.innerHTML = +elData.watches.innerHTML - 1
        await sendDataRequest(`/watch/remove/${qID}`, errbar, window, "")
    }
    BtnValues.watch = !BtnValues.watch

    //send appropriate server request
})

elData.check.addEventListener("click",  async() => {
    if (!BtnValues.solve) {
        elData.check.src = "/resources/check_full.PNG"
        elData.solves.innerHTML = +elData.solves.innerHTML + 1
        await sendDataRequest(`/solve/add/${qID}`, errbar, window, "")
    }
    else {
        elData.check.src = "/resources/check_empty.PNG"
        elData.solves.innerHTML = +elData.solves.innerHTML - 1
        await sendDataRequest(`/solve/remove/${qID}`, errbar, window, "")
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

    const result = await sendDataRequest(`/question/get/${qID}`, errbar, window, "")

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

    elData.tag.href =
    `/search/?tag=${encodeURIComponent(convertTag(result.tag))}`

    elData.stage.href =
    `/search/?stage=${encodeURIComponent(convertStudyStage(result.stage))}`

    elData.subject.href =
    `/search/?stage=${encodeURIComponent(convertStudyStage(result.stage))}&subject=${encodeURIComponent(result.subject)}`

    elData.topic.href =
    `/search/?stage=${encodeURIComponent(convertStudyStage(result.stage))}&subject=${encodeURIComponent(result.subject)}&topic=${encodeURIComponent(result.topic)}`

    //http://localhost:3000/search/?stage=1%26subject=OCR%20Computer%20Science 
    //http://localhost:3000/search/?stage=1&subject=OCR+Computer+Science&paper=-1&year=&tag=-1&creator=&topic=&search=&sort=views&page=1
    //http://localhost:3000/search/?stage=1%26subject=OCR%20Computer%20Science%26topic=Legislation


    document.title = `${result.name} - SCIMUS`
}

async function showPage() {
    await fetchData()
    await Promise.all(
      [...document.images].map(img =>
          img.complete ? Promise.resolve() : new Promise(r => img.onload = r)
      )
    )
    document.documentElement.style.visibility = "visible"
}

const qIDS = JSON.parse(sessionStorage.getItem("qIDS"))
const index = JSON.parse(sessionStorage.getItem("qIndex"))
let clear = true

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
    window.location.href = qIDS[index-1]
    clear = false
})

elData.arr2.addEventListener("click", () => { //right
    sessionStorage.setItem("qIDS", JSON.stringify(qIDS)) //store question ids and index 
    sessionStorage.setItem("qIndex", index+1)
    window.location.href = qIDS[index+1]
    clear = false
})

window.addEventListener("pagehide", () => { //if not horizontal scrolling, then remove the stored data
    if(clear) {
        sessionStorage.removeItem("qIDS")
        sessionStorage.removeItem("qIndex")
    }
    
})




//VERTICAL SCROLL

showPage()