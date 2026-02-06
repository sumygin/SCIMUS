import {loadData} from './utils.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function passwordCheck(pw) {
    const hasNumber = /[0-9]/.test(pw)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|~]/.test(pw)
    return hasNumber && hasSpecial
}

let logbtn = document.getElementById("log-switch")
let t1 = logbtn.children[0]
let t2 = logbtn.children[1]
let logForm = document.getElementById("loginForm")
let regForm = document.getElementById("regForm")
let state = true
regForm.style.display = "none"

let formElementList = ["name", "username", "tag", "email", "password", "password_1", "school", "country", "stage", "subject"]
let formData = {}

for (el of formElementList) {
    formData[el] = document.getElementById(el)
}

t2.style.opacity = 0.25

logbtn.addEventListener("click",() => {
    if (state) {
        t1.style.opacity = 0.25
        t2.style.opacity = 1
        logForm.style.display = "none"
        regForm.style.display = "flex"
    }
    else {
        t2.style.opacity = 0.25
        t1.style.opacity = 1
        logForm.style.display = "flex"
        regForm.style.display = "none"
    }

    state = !state
})

function reportInvalid(el, message, e) {
    el.setCustomValidity(message)
    el.reportValidity()
    e.preventDefault()
}

for (const el of Object.values(formData)) { //reset form invalidity after input edited
    el.addEventListener("input", () => {
        el.setCustomValidity("")
    })
}

let countriesList
async function clientValidation() { 
    countriesList = await loadData("../resources/countries.json")
    const multispace = document.getElementById("multispace")
    const hiddenSpace = document.getElementById("hiddenSpace")
    const errbar = document.getElementsByClassName("error")[0]

    regForm.addEventListener("submit", async e => { 
        for (const el of Object.values(formData)) {
            el.setCustomValidity("")
        }

        //client side validation

        if (!emailRegex.test(formData.email.value)) { 
            reportInvalid(formData.email, "This is not an email", e)
            return
        }
        if (formData.password.value !== formData.password_1.value) {
            reportInvalid(formData.password_1, "Passwords do not match", e)
            return
        }
        if (formData.password.value.length < 8) {
            reportInvalid(formData.password, "Password must be at least 8 characters", e)
            return
        }
        if (formData.name.value.length < 3) {
            reportInvalid(formData.name, "Name is too short", e)
            return
        }
        if (formData.username.value.length < 3) {
            reportInvalid(formData.username, "Username is too short", e)
            return
        }
        if (formData.tag.value.length < 3) {
            reportInvalid(formData.tag, "Tag is too short", e)
            return
        }

        if (!passwordCheck(formData.password.value)) {
            reportInvalid(formData.password, "Password must have at least one special character and number", e)
            return
        }   
        if (!countriesList.includes(formData.country.value)) {
            reportInvalid(formData.country, "Country is invalid", e)
            return
        }
        if (formData.stage.value == -1) {
            reportInvalid(formData.stage, "Please select a study stage", e)
            return
        }
        if (multispace.innerText.length < 5) {
            reportInvalid(formData.subject, "You must select at least one subject", e)
            return
        }
        if (formData.tag.value.includes(" ")) {
            reportInvalid(formData.tag, "Tag cannot contain spaces", e)
            return
        }
        
        hiddenSpace.value = multispace.textContent

        e.preventDefault() //prevent form being sent

        //processing form data

        const formdata = new FormData(regForm)
        const data = Object.fromEntries(formdata.entries())

        const res = await fetch(regForm.action, { //send data
            method:regForm.method,
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(data),
        })

        const result = await res.json()

        //display response

        console.log(res.ok, result)

        if (!res.ok) { //not successful
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
    })

    logForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        //processing form data

        const formdata = new FormData(logForm)
        const data = Object.fromEntries(formdata.entries())

        const res = await fetch(logForm.action, { //send data
            method:logForm.method,
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(data),
        })

        const result = await res.json()

        //display response

        console.log(res.ok, result)

        if (!res.ok) { //not successful
            errbar.innerHTML = result.error
            errbar.style.opacity = "1"
            setTimeout(() => {
                errbar.style.opacity = "0"
            }, 3000)
            return
        }
        else {
            errbar.innerHTML = "Log-in successful"
            errbar.style.color = "green"
            errbar.style.opacity = "1"
            setTimeout(() => {
                window.location.href = "/home"
                errbar.style.opacity = "0"
            }, 1000)
        }
    })
}

clientValidation()