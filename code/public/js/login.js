const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

let logbtn = document.getElementById("log-switch")
let t1 = logbtn.children[0]
let t2 = logbtn.children[1]
let logForm = document.getElementById("loginForm")
let regForm = document.getElementById("regForm")
let state = true
regForm.style.display = "none"

let formElementList = ["name", "username", "tag", "email", "password", "password_1", "school", "country", "stage", "multispace"]
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

regForm.addEventListener("submit", e => {
    console.log(emailRegex.test(formData.email))
    if (formData.password.value !== formData.password_1.value) {
        reportInvalid(formData.password_1, "Passwords do not match", e)
    }
    else if (!emailRegex.test(formData.email)) {
        reportInvalid(formData.email, "This is not an email!", e)
    }
    else {
        for (el of formData) {
            el.setCustomValidity("")
        }
    }
})