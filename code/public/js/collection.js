import {generateStarHTML, warn, success, sendDataRequest, convertTag, convertStudyStage, likeConverter} from "./utils.js"

document.documentElement.style.visibility = "hidden"

const errbar = document.getElementsByClassName("error")[0]


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

function questionTemplate(question){ 
    let insertData = ""
    if (question.tag == 0) {
        insertData = 
        `<div class="s-q-year s-q-item">${
            question.year != 0 ? question.year : ""}</div>
        <div class="s-q-paper s-q-item">${
            question.paper_num != 0 ? "Paper " + question.paper_num : ""}</div>
        <div class="s-q-questionNo s-q-item">${
            question.question_num != 0 ? "Q" + question.question_num : ""}</div>`
    }

    let newQuestion = document.createElement("div")

    newQuestion.innerHTML =`<a href="/question/${question.question_id}">
        <div class="s-q">
            <div class="s-q-text">
                <div class="s-q-name">${question.name}</div>
                <div class="s-q-content">${question.content.substring(0, 61).trim() + (question.content.length > 61 ? "..." : "")}</div>
            </div>
            <div class="s-q-metadata">
                <div class="row">
                    ${question.user_tag ? `<div class="s-q-los s-q-item">@${question.user_tag}</div>` : ""}
                    <div class="s-q-los s-q-item">${convertStudyStage(question.study_stage)}</div>
                    <div class="s-q-subject s-q-item">${question.subject}</div>
                    <div class="s-q-topic s-q-item">${question.topic}</div>
                    <div class="s-q-tag s-q-item-last">${convertTag(question.tag)}</div>
                </div>
                    
                <div class="row">
                    <div class="s-q-views s-q-item"><img src="/resources/view.PNG" alt="" class="icon"> ${question.views}</div>
                    
                    
                    <div class="s-q-comments s-q-item"><img src="/resources/comments.PNG" alt="" class="icon"> ${question.num_comments}</div>

                    <div class="s-q-likes s-q-item">${likeConverter(question.like_rating)} ${question.like_rating}</div>
                    
                    <div class="s-q-rating s-q-item">${generateStarHTML(Number(question.total_diff_rating)/Number(question.num_diff_ratings))} ${question.num_diff_ratings}</div>

                    ${insertData}

                </div>
            </div>
        </div>
    </a>`

    newQuestion.id = question.question_id

    newQuestion.addEventListener("click", (e)=>{
        let index = qIDList.indexOf(Number(newQuestion.id))
        sessionStorage.setItem("qIDS", JSON.stringify(qIDList)) //store question ids and index 
        sessionStorage.setItem("qIndex", index)
    })

    return newQuestion
}

//fetch ID and check if valid
let cID = window.location.href.split("/collection")[1].substring(1)
if (isNaN(Number(cID))) cID = -1
if (cID == "") cID = -1

//fetch collection data corresponding to that id
async function fetchData() {
    if (cID == -1) {
        window.location.href = "/home"
        return
    }

    const result = await sendDataRequest(`/collection/get/${cID}`, errbar, window, "")

    for (const item in result) {
        if (item == "question_data") { //detect if question data sent and intercept
            const questions = result[item]
            for (const question of questions) { //append new data
                displaySpace.appendChild(questionTemplate(question))
            }
            

            qIDList.push(...result[item].map(q => q.question_id)) //generate list of questoin ids
        }
        else {
            elData[item].innerText = result[item]
        }
    }

   

    elData.tag.href = //encode links into the left-hand metadata
    ``

    elData.paper.href =
    ``

    elData.year.href =
    ``

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

const cIDS = JSON.parse(sessionStorage.getItem("cIDS"))
const index = JSON.parse(sessionStorage.getItem("cIndex"))
let clear = true

console.log(cIDS, index)

if (!cIDS) { //check there is 
    elData.arr1.style.display = "none"
    elData.arr2.style.display = "none"
}
else {
    if (index == 0) {//first in list = hide arrow
        elData.arr1.style.display = "none"
    }
    if (index == cIDS.length-1) { //last in list = hide arrow
        elData.arr2.style.display = "none"
    }
}

//HORIZONTAL SCROLL
elData.arr1.addEventListener("click", () => { //left
    sessionStorage.setItem("cIDS", JSON.stringify(cIDS)) //store collection ids and index 
    sessionStorage.setItem("cIndex", index-1)
    window.location.href = cIDS[index-1]
    clear = false
})

elData.arr2.addEventListener("click", () => { //right
    sessionStorage.setItem("cIDS", JSON.stringify(cIDS)) //store collection ids and index 
    sessionStorage.setItem("cIndex", index+1)
    window.location.href = cIDS[index+1]
    clear = false
})

window.addEventListener("pagehide", () => { //if not horizontal scrolling, then remove the stored data
    if(clear) {
        sessionStorage.removeItem("IDS")
        sessionStorage.removeItem("Index")
    }
    
})




//VERTICAL SCROLL

showPage()