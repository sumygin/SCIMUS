let logbtn = document.getElementById("log-switch")
let t1 = logbtn.children[0]
let t2 = logbtn.children[1]
let logForm = document.getElementById("loginForm")
let regForm = document.getElementById("regForm")
let state = true
regForm.style.display = "none"

t2.style.opacity = 0.5

logbtn.addEventListener("click",() => {
    if (state) {
        t1.style.opacity = 0.5
        t2.style.opacity = 1
        logForm.style.display = "none"
        regForm.style.display = "block"
    }
    else {
        t2.style.opacity = 0.5
        t1.style.opacity = 1
        logForm.style.display = "block"
        regForm.style.display = "none"
    }

    state = !state
})