import { sendFormData, convertStudyStage, generateStarHTML, likeConverter, convertTag, submitSearchData, updatePaperNum, getSubjectColour} from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]

const qFormList = ["stage", "subject", "paper", "year", "tag", "creator", "topic", "search", "sort", "page", "searchType"
]

let qFormData = {}

for (let el of qFormList) {
    qFormData[el] = document.getElementById(el)
}

const cFormList = ["stage1", "subject1", "paper1", "year1", "tag1", "creator1", "topic1", "search1", "sort1", "page1", "searchType1"
]

let cFormData = {}

for (let el of cFormList) {
    cFormData[el.substring(0, el.length-1)] = document.getElementById(el)
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
const cForm = document.getElementById("collectionForm")

const QdisplaySpace = document.getElementById("QdisplaySpace")
const CdisplaySpace = document.getElementById("CdisplaySpace")
CdisplaySpace.style.display = "none"

qFormData.isLoading = false //variables needed for scrolling
qFormData.hasMore = true
cFormData.isLoading = false
cFormData.hasMore = true

let qIDList = []
let cIDList = []

qcbtn.addEventListener("click",() => { //switch between questions/collections
    if (state) {
        t1.style.opacity = 0.25
        t2.style.opacity = 1
        qs.style.display = "none"
        cs.style.display = "block"
        CdisplaySpace.style.display = "block"
        QdisplaySpace.style.display = "none"

        //update invisible form value
        qFormData.searchType.value = "c"
        cFormData.searchType.value = "c"
    }
    else {
        t2.style.opacity = 0.25
        t1.style.opacity = 1
        qs.style.display = "block"
        cs.style.display = "none"
        CdisplaySpace.style.display = "none"
        QdisplaySpace.style.display = "block"

        //update invisible form value
        qFormData.searchType.value = "q"
        cFormData.searchType.value = "q"
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
                <div class="s-q-content"></div>
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

    
    

    //set preview safely
    const dummyEl = document.createElement("div")
    dummyEl.innerHTML = question.content.substring(0, 61).trim() + (question.content.length > 61 ? "..." : "")
    newQuestion.querySelector(".s-q-content").innerText = dummyEl.innerText //so that HTML tags in preview dont affect formatting, but they are stil hidden

    newQuestion.style.backgroundColor = getSubjectColour(question.subject_id)

    newQuestion.id = question.question_id

    newQuestion.addEventListener("click", (e)=>{
        let index = qIDList.indexOf(Number(newQuestion.id))
        sessionStorage.setItem("qIDS", JSON.stringify(qIDList)) //store question ids and index 
        sessionStorage.setItem("qIndex", index)
    })

    //render latex
    renderMathInElement(newQuestion, {
        delimiters: [
            //block
            {left: '$$', right: '$$', display: true},
            {left: '\\[', right: '\\]', display: true},
            //inline
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false}
        ],
        throwOnError: false //stops page crashing if error
    })

    return newQuestion
}

function collectionTemplate(collection){ 
    let insertData = ""
    if (collection.tag == 0) {
        insertData = 
        `<div class="s-q-year s-q-item">${
            collection.year != 0 ? collection.year : ""}</div>
        <div class="s-q-paper s-q-item">${
            collection.paper != 0 ? "Paper " + collection.paper : ""}</div>`
    }

    let newcollection = document.createElement("div")

    newcollection.innerHTML =`<a href="/collection/${collection.collection_id}">
        <div class="s-q">
            <div class="s-q-text">
                <div class="s-q-name">${collection.name}</div>
                <div class="s-q-content">${collection.preview.join(", ").substring(0, 61).trim() + (collection.preview.join(", ").length >= 61 ? "..." : "")}</div>
            </div>
            <div class="s-q-metadata">
                <div class="row">
                ${collection.user_tag ? `<div class="s-q-los s-q-item">@${collection.user_tag}</div>` : ""}
                    <div class="s-q-los s-q-item">${convertStudyStage(collection.stages[0])} 
                    ${collection.stages.length > 1 ? `+ ${collection.stages.length-1}` : ""}</div>
                    <div class="s-q-subject s-q-item">${collection.subjects[0]}
                    ${collection.subjects.length > 1 ? `+ ${collection.subjects.length-1}` : ""}</div>
                    <div class="s-q-topic s-q-item">${collection.topics[0]}
                    ${collection.topics.length > 1 ? `+ ${collection.topics.length-1}` : ""}</div>
                    <div class="s-q-tag s-q-item-last">${convertTag(collection.tag)}</div>
                </div>
                    
                <div class="row">
                    <div class="s-q-rating s-q-item">${collection.question_num} questions</div>

                    ${insertData}

                </div>
            </div>
        </div>
    </a>`

    newcollection.id = collection.collection_id

    newcollection.addEventListener("click", (e)=>{
        
        let index = cIDList.indexOf(Number(newcollection.id))
        sessionStorage.setItem("cIDS", JSON.stringify(cIDList)) //store collection ids and index 
        sessionStorage.setItem("cIndex", index)
    })

    return newcollection
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

cFormData.stage.addEventListener("change", ()=>{
    cFormData.subject.value = ""
    cFormData.paper.value = -1
    cFormData.topic.value = ""
})

cFormData.subject.addEventListener("keyup", ()=>{
    cFormData.paper.value = -1
    cFormData.topic.value = ""
})

qForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    sendFilters(true, qForm, qFormData, QdisplaySpace)
})

cForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    sendFilters(true, cForm, cFormData, CdisplaySpace)
})

async function sendFilters (deleteOld, form, formdata, displayspace) {
    if (deleteOld) { //if this is a new search and not scrolling down for more content, clear previous content and create a new bottom detector
        formdata.page.value = "1"
        displayspace.innerHTML = ""
        formdata.hasMore = true
        formdata.isLoading = false

        if (qForm == form) {
            qIDList = []
        }
        else {
            cIDList = []
        }
    }

    let oldBottomEl //get old bottom detector for this form

    if (form == qForm) {
        oldBottomEl = document.getElementById("QbottomDetect")
    }
    else if (form == cForm) {
        oldBottomEl = document.getElementById("CbottomDetect")
    }

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await submitSearchData(form, errbar, window, "", true, history, form == qForm ? "q" : "c", deleteOld)

    if (!result) return "no data received"

    if (form == qForm) {
        qIDList.push(...result.map(q => Number(q.question_id))) //generate list of question ids
    }
    else if (form == cForm) {
        cIDList.push(...result.map(c => Number(c.collection_id))) //generate list of col ids
    }

    for (const item of result) { //append new data
        if (form == qForm) {
            QdisplaySpace.appendChild(questionTemplate(item))
        }
        else if (form == cForm) {
            CdisplaySpace.appendChild(collectionTemplate(item))
        }
    }

    if (result.length >= 20) { //if there is potential for more data to be loaded later
        let bottomEl
        if (form == qForm) {
            QdisplaySpace.insertAdjacentHTML('beforeend', '<div id="QbottomDetect" style="height: 10px; opacity: 0;"></div>')
            bottomEl = document.getElementById("QbottomDetect")
        }
        else if (form == cForm) {
            QdisplaySpace.insertAdjacentHTML('beforeend', '<div id="CbottomDetect" style="height: 10px; opacity: 0;"></div>')
            bottomEl = document.getElementById("CbottomDetect")
        }

        observer.observe(bottomEl)
    }
    else {
        formdata.hasMore = false //there is no more data to load
    }
}

async function loadMoreItems(form, formdata, displayspace) {
    if (!formdata.isLoading && formdata.hasMore) { //if its already loading or there are no more to be loaded
        formdata.isLoading = true

        formdata.page.value = Number(formdata.page.value) + 1 //increment page

        await sendFilters(false, form, formdata, displayspace)

        formdata.isLoading = false
    }
}

const observer = new IntersectionObserver((entries) => { //if on screen
    if (!entries[0].isIntersecting) return

    const id = entries[0].target.id

    if (id === "QbottomDetect") {
        loadMoreItems(qForm, qFormData, QdisplaySpace)
    } else {
        loadMoreItems(cForm, cFormData, CdisplaySpace)
    }
}, {
    root: null, 
    rootMargin: '1000px', //data load from 100px from bottom
    threshold: 0.1
})

async function fillForm() { //update filters according to URL data
    const URLdata = new URLSearchParams(window.location.search) //get URL data

    let form
    const st = URLdata.get("searchType")
    if (st == "c") { 
        //if url is collection search, display collections
        form = cFormData

        //update visibility instantly
        t1.style.opacity = 0.25
        t2.style.opacity = 1
        qs.style.display = "none"
        cs.style.display = "block"
        CdisplaySpace.style.display = "block"
        QdisplaySpace.style.display = "none"

        //update invisible form value
        qFormData.searchType.value = "c"
        cFormData.searchType.value = "c"
        state = false
        
    } else { //if url has question as what's being searched for
        form = qFormData
        qFormData.searchType.value = "q"
        cFormData.searchType.value = "q"
    }

    for (const [key, value] of URLdata.entries()) {
        if (!form[key]) continue
        else {
            if (key == "paper") { //modify paper manually
                await updatePaperNum(form.subject.value, form.paper, errbar, window)
            }

            if (key == "page") {
                continue
            }
            
            form[key].value = value

            if (key == "stage") { //trigger study stage update
                form.stage.dispatchEvent(new Event("change"))
            }

            if (key == "subject") { //trigger subject update
                form.subject.dispatchEvent(new CustomEvent("subjectLoaded"))
            }
        }
    }
}

async function loadPage () {
    await fillForm()
    await sendFilters(true, qForm, qFormData, QdisplaySpace)
    await sendFilters(true, cForm, cFormData, CdisplaySpace)
}

loadPage()