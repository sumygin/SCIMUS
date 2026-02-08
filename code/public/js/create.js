import { upperCaseify, reportInvalid, success, warn} from "./utils.js"

const qName = document.getElementById("qname")
const qText = document.getElementById('qtext')
const msText = document.getElementById("mstext")

const qForm = document.getElementById("qform")
const saveBtn = document.getElementById("save")
const publishBtn = document.getElementById("pub")

const errbar = document.getElementsByClassName("error")[0]

let qID = window.location.href.split("/create")[1].substring(1)
if (isNaN(Number(qID))) qID = -1
if (qID == "") qID = 0

let formElementList = ["stage", "subject", "topic", "tag", "qname", "qtext", "mstext"]
let formData = {}

for (el of formElementList) {
    formData[el] = document.getElementById(el)
}


qName.addEventListener("keyup", () => {
    if (qName.value.length >= 41) {
        qName.value = qName.value.substring(0, 40)
    }
    else {
        qName.value = upperCaseify(qName.value)
    }
})

qText.addEventListener("keyup", () => {
    if (qText.value.length >= 5001) {
        qText.value = qText.value.substring(0, 5000)
    }
})

msText.addEventListener("keyup", () => {
    if (msText.value.length >= 5001) {
        msText.value = msText.value.substring(0, 5000)
    }
})

function clientValidation() { 
    saveBtn.addEventListener("click", (e) => { 
        saveForm(e, false)
    })

    publishBtn.addEventListener("click", (e) => {
        saveForm(e, true)

        //need to edit question data so that published is true
    })
}

let saveForm = async (e, publish) => { //validates then sends form values
    e.preventDefault() //prevent form being sent

    for (const el of Object.values(formData)) {
        el.setCustomValidity("")
    }

    //client side validation
    //["stage", "subject", "topic", "tag", "qname", "qtext", "mstext"]

    if (formData.stage.value == -1) { 
        reportInvalid(formData.stage, "Please select a study stage", e)
        return
    }

    if (formData.tag.value == -1) { 
        reportInvalid(formData.tag, "Please select a question type", e)
        return
    }

    if (formData.qtext.value.length < 10) {
        reportInvalid(formData.qtext, "Question is too short", e)
        return
    }

    if (formData.mstext.value.length < 10) {
        reportInvalid(formData.mstext, "Mark scheme is too short", e)
        return
    }

    if (formData.qname.value.length < 2) {
        reportInvalid(formData.qname, "Title is too short", e)
        return
    }
    
    /*
    if (!window.subjectList) return
    if (!window.subjectList.includes(formData.subject.value)) { 
        reportInvalid(formData.subject, "This is not a valid subject", e)
        return
    }
    if (!window.topicList) return
    if (!window.topicList.includes(formData.topic.value)) { 
        reportInvalid(formData.topic, "This is not a valid topic", e)
        return
    }*/

    //processing form data

    const formdata = new FormData(qForm)
    const data = Object.fromEntries(formdata.entries())

    const res = await fetch(`/question/save/${qID}/${publish}`, { //send data
        method:qForm.method,
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(data),
    })

    const result = await res.json()

    //display response

    if (!res.ok) { //not successful
        warn(errbar, result.error)
        return
    }
    else {
        success(errbar, "Question saved")
        if (result.redirect) { //redirect if a ilnk sent back
            window.location.href = result.redirect
        }
    }
}

async function fetchData() {
    if (qID == 0) return
    if (qID == -1) {
        console.log("HELLO!")
        window.location.href = "/create"
        return
    }

    const res = await fetch(`/question/get/${qID}`)
    const result = await res.json()

    if (!res.ok) { //not successful
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
        return
    }
    else {
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
        for (let item in result) {
            formData[item].value = result[item]
        }
    }
}

fetchData()
clientValidation()

