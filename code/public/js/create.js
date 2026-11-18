import { upperCaseify, reportInvalid, sendDataRequest, sendFormData, setBusy, showPage as revealPage} from "./utils.js"

const qName = document.getElementById("qname")

const qForm = document.getElementById("qform")
const saveBtn = document.getElementById("save")
const publishBtn = document.getElementById("pub")

const errbar = document.getElementsByClassName("error")[0]

//fetch ID from the url. 0 = new question, -1 = invalid
let qID = window.location.pathname.split("/create")[1].replaceAll("/", "")
if (qID == "") qID = 0
else if (!/^\d+$/.test(qID)) qID = -1

let formElementList = ["stage", "subject", "topic", "tag", "qname", "qtext", "mstext"]
let formData = {}

for (let el of formElementList) {
    formData[el] = document.getElementById(el)
}

for (const el of Object.values(formData)) { //reset form invalidity after input edited
    el.addEventListener("input", () => {
        el.setCustomValidity("")
    })
}

qName.addEventListener("input", () => {
    //keep the cursor where it was, changing the value would otherwise move it to the end
    const start = qName.selectionStart
    const end = qName.selectionEnd

    qName.value = upperCaseify(qName.value)
    qName.setSelectionRange(start, end)
})

let sending = false //stops the form being sent twice

function clientValidation() { 
    qForm.addEventListener("submit", (e) => e.preventDefault())

    saveBtn.addEventListener("click", (e) => { 
        saveForm(e, false)
    })

    publishBtn.addEventListener("click", (e) => {
        saveForm(e, true)
    })
}

let saveForm = async (e, publish) => { //validates then sends form values
    e.preventDefault() //prevent form being sent

    for (const el of Object.values(formData)) {
        el.setCustomValidity("")
    }

    //client side validation

    if (formData.stage.value == -1) { 
        reportInvalid(formData.stage, "Please select a study stage", e)
        return
    }

    if (formData.subject.value.trim() == "") { 
        reportInvalid(formData.subject, "Please select a subject", e)
        return
    }

    if (formData.topic.value.trim() == "") { 
        reportInvalid(formData.topic, "Please select a topic", e)
        return
    }

    if (formData.tag.value == -1) { 
        reportInvalid(formData.tag, "Please select a question type", e)
        return
    }

    if (formData.qname.value.trim().length < 10) {
        reportInvalid(formData.qname, "Name must be at least 10 characters", e)
        return
    }

    if (formData.qtext.value.trim().length < 10) {
        reportInvalid(formData.qtext, "Question is too short", e)
        return
    }

    if (formData.mstext.value.trim().length < 10) {
        reportInvalid(formData.mstext, "Mark scheme is too short", e)
        return
    }

    //processing form data

    if (sending) return
    sending = true
    setBusy(saveBtn, true)
    setBusy(publishBtn, true)

    const result = await sendFormData(`/api/question/save/${qID}/${publish}`, qForm, errbar, window, publish ? "Question published" : "Question saved", true)

    if (!result) { //on success the page moves on by itself
        setBusy(saveBtn, false)
        setBusy(publishBtn, false)
    }
    sending = false
}

async function fetchData() {
    if (qID == 0) {
        document.title = `Editing new question - SCIMUS`
        return
    }
    if (qID == -1) {
        window.location.href = "/create"
        return
    }

    const result = await sendDataRequest(`/api/create/get/${qID}`, errbar, window, "")

    if (!result) return
    
    for (let item in result) {
        if (!formData[item]) continue

        formData[item].value = result[item]

        //let the autocomplete fields know so they load the right subject/topic lists
        if (item == "stage") {
            formData.stage.dispatchEvent(new Event("change"))
        }
        if (item == "subject") {
            formData.subject.dispatchEvent(new CustomEvent("subjectLoaded"))
        }
    }

    document.title = `Editing ${result.qname} - SCIMUS`

}

async function showPage() {
    try {
        clientValidation()
        await fetchData()
    }
    finally {
        revealPage()
    }
}

showPage()
