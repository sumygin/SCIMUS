import {sendDataRequest, convertCollectionTag, questionTemplate, imagesLoaded, emptyState, showPage as revealPage} from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]
const displaySpace = document.getElementById("displaySpace")

const qElementList = [
    "arr1", "arr2", "tag", "paper", "year", "name", "user_tag"
]

let elData = {}

let qIDList = []

for (let el of qElementList) {
    elData[el] = document.getElementById(el)
}

//  =================
//  IDS AND FETCHING
//  =================

//fetch collection data corresponding to that id
async function fetchData() {
    //fetch ID and check if valid
    const cID = Number(window.location.pathname.split("/collection/")[1])

    if (!Number.isInteger(cID) || cID <= 0) {
        window.location.href = "/home"
        return
    }

    const result = await sendDataRequest(`/api/collection/get/${cID}`, errbar, window, "")
    if (!result) return

    qIDList = result.question_data.map(q => Number(q.question_id)) //generate list of question ids

    for (const question of result.question_data) { //append new data
        const newQuestion = questionTemplate(question)

        newQuestion.addEventListener("click", ()=>{
            sessionStorage.setItem("qIDS", JSON.stringify(qIDList)) //store question ids and index 
            sessionStorage.setItem("qIndex", qIDList.indexOf(Number(question.question_id)))
        })

        displaySpace.appendChild(newQuestion)
    }

    if (result.question_data.length == 0) {
        displaySpace.appendChild(emptyState("This collection is empty"))
    }

    elData.name.innerText = result.name
    elData.user_tag.innerText = result.user_tag
    elData.tag.innerText = result.tag
    elData.paper.innerText = result.paper ? `Paper ${result.paper}` : ""
    elData.year.innerText = result.year

    elData.user_tag.href = `/profile/${encodeURIComponent(result.user_tag.substring(1))}`

    elData.tag.href = //encode links into the left-hand metadata
    `/search/?tag=${encodeURIComponent(convertCollectionTag(result.tag))}&searchType=c`

    //paper and year only exist for past papers
    for (const item of ["paper", "year"]) {
        if (result[item]) {
            elData[item].href = `/search/?${item}=${encodeURIComponent(result[item])}&searchType=c`
        }
    }

    document.title = `${result.name} - SCIMUS`
}

function setArrowListeners() {
    let cIDS = null
    try {
        cIDS = JSON.parse(sessionStorage.getItem("cIDS"))
    } catch (err) {}
    const Cindex = Number(sessionStorage.getItem("cIndex"))
    let clear = true

    if (!Array.isArray(cIDS)) { //check there is a list to move through
        elData.arr1.style.display = "none"
        elData.arr2.style.display = "none"
        cIDS = []
    }
    else {
        if (Cindex <= 0) {//first in list = hide arrow
            elData.arr1.style.display = "none"
        }
        if (Cindex >= cIDS.length-1) { //last in list = hide arrow
            elData.arr2.style.display = "none"
        }
    }

    function move(e, newIndex) { //go to another collection in the list
        e.preventDefault()
        if (cIDS[newIndex] == undefined) return

        sessionStorage.setItem("cIndex", newIndex)
        clear = false
        window.location.href = `/collection/${Number(cIDS[newIndex])}`
    }

    //HORIZONTAL SCROLL
    elData.arr1.addEventListener("click", (e) => move(e, Cindex-1)) //left
    elData.arr2.addEventListener("click", (e) => move(e, Cindex+1)) //right

    window.addEventListener("pagehide", () => { //if not horizontal scrolling, then remove the stored data
        if(clear) {
            sessionStorage.removeItem("cIDS")
            sessionStorage.removeItem("cIndex")
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
    }
}

showPage()
