import { sendFormData, convertStudyStage, generateStarHTML, likeConverter, convertTag, submitSearchData, updatePaperNum} from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]

const qFormList = ["stage", "subject", "paper", "year", "tag", "creator", "topic", "search", "sort", "page"]
let qFormData = {}

for (let el of qFormList) {
    qFormData[el] = document.getElementById(el)
}

const qcbtn = document.getElementById("qc-switch")

const t1 = qcbtn.children[0]
const t2 = qcbtn.children[1]
const qs = document.getElementById("questionSearch")
const cs = document.getElementById("collectionSearch")
let state = true
cs.style.display = "none"

t2.style.opacity = 0.25

const qForm = document.getElementById("questionForm")
const qBtn = document.getElementById("qSubmit")

const QdisplaySpace = document.getElementById("QdisplaySpace")
const CdisplaySpace = document.getElementById("CdisplaySpace")
CdisplaySpace.style.display = "none"

let isLoading = false
let hasMore = true

let qIDList = []

qcbtn.addEventListener("click",() => { //switch between questions/collections
    if (state) {
        t1.style.opacity = 0.25
        t2.style.opacity = 1
        qs.style.display = "none"
        cs.style.display = "block"
        CdisplaySpace.style.display = "block"
        QdisplaySpace.style.display = "none"
    }
    else {
        t2.style.opacity = 0.25
        t1.style.opacity = 1
        qs.style.display = "block"
        cs.style.display = "none"
        CdisplaySpace.style.display = "none"
        QdisplaySpace.style.display = "block"
    }

    state = !state
})

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

//changing stage clears subject, paper number, topic

qFormData.stage.addEventListener("change", ()=>{
    qFormData.subject.value = ""
    qFormData.paper.value = -1
    qFormData.topic.value = ""
})

qFormData.subject.addEventListener("keyup", ()=>{
    qFormData.paper.value = -1
    qFormData.topic.value = ""
})

qForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    sendFilters(true)
})

async function sendFilters (deleteOld) {
    if (deleteOld) {
        qFormData.page.value = "1"
        QdisplaySpace.innerHTML = ""
        hasMore = true
        isLoading = false
        qIDList = []
        sessionStorage.removeItem("search_ids")
    }

    const oldBottomEl = document.getElementById("bottomDetect")

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await submitSearchData(qForm, errbar, window, "", true, history)

    if (!result) return

    qIDList.push(...result.map(q => q.question_id)) //generate list of questoin ids


    for (const question of result) { //append new data
        QdisplaySpace.appendChild(questionTemplate(question))
    }

    if (result.length >= 20) { //if tehre is potential for more data to be loaded later
        QdisplaySpace.insertAdjacentHTML('beforeend', '<div id="bottomDetect" style="height: 10px; opacity: 0;"></div>')
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

        qFormData.page.value = Number(qFormData.page.value) + 1 //increment page

        await sendFilters(false)

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

async function fillForm() { //update filters according to URL data
    const URLdata = new URLSearchParams(window.location.search) //get URL data
    for (const [key, value] of URLdata.entries()) {
        if (!qForm[key]) continue
        else {
            
            if (key == "paper") { //modify paper manually
                await updatePaperNum(qForm.subject.value, qForm.paper, errbar, window)
            }

            if (key == "page") {
                continue
            }

            
            qForm[key].value = value

            if (key == "stage") {
                qForm.stage.dispatchEvent(new Event("change"))
            }

            if (key == "subject") {
                qForm.subject.dispatchEvent(new CustomEvent("subjectLoaded"))
            }
        }
    }
}

async function loadPage () {
    await fillForm()
    await sendFilters()
}

loadPage()