import { upperCaseify, reportInvalid} from "./utils.js"

const qName = document.getElementById("qname")
const qText = document.getElementById('qtext')
const msText = document.getElementById("mstext")
let flipped = false

const flipBtn = document.getElementById("flip")

const qForm = document.getElementById("qform")
const saveBtn = document.getElementById("save")
const publishBtn = document.getElementById("pub")

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

function clientValidation() { 
    const subjectList = window.subjectList
    const topicList = window.topicList
    console.log(subjectList, topicList)
    const errbar = document.getElementsByClassName("error")[0]

    saveBtn.addEventListener("click", (e) => { 
        saveForm(e)
    })

    publishBtn.addEventListener("click", (e) => {
        saveForm(e)
        //need to edit question data so that published is true
    })
}

let saveForm = async (e) => { //validates then sends form values
    for (const el of Object.values(formData)) {
        el.setCustomValidity("")
    }

    if (subjectList == undefined || topicList == undefined) return

    console.log(formData)

    //client side validation
    //["stage", "subject", "topic", "tag", "qname", "qtext", "mstext"]

    console.log(subjectList, formData.subject)

    if (!subjectList.includes(formData.subject.value)) { 
        reportInvalid(formData.subject, "This is not a valid subject", e)
        return
    }
    if (!topicList.includes(formData.topic.value)) { 
        reportInvalid(formData.topic, "This is not a valid topic", e)
        return
    }

    if (formData.stage.value == -1) { 
        reportInvalid(formData.stage, "Please select a study stage", e)
        return
    }

    if (formData.tag.value == -1) { 
        reportInvalid(formData.stage, "Please select a question type", e)
        return
    }

    e.preventDefault() //prevent form being sent

    //processing form data

    const formdata = new FormData(qForm)
    const data = Object.fromEntries(formdata.entries())

    const res = await fetch(qForm.action, { //send data
        method:qForm.method,
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(data),
    })

    const result = await res.json()

    //display response

    console.log(res.ok, result)

    if (!res.ok) { //not successful
        errbar.style.color = "red"
        errbar.innerHTML = result.error
        errbar.style.opacity = "1"
        setTimeout(() => {
            errbar.style.opacity = "0"
        }, 3000)
        return
    }
    else {
        errbar.innerHTML = "Register successful"
        errbar.style.color = "green"
        errbar.style.opacity = "1"
        setTimeout(() => {
            window.location.href = "/login"
            errbar.style.opacity = "0"
        }, 1000)
    }
}

async function fetchData() {

}

fetchData()
clientValidation()

