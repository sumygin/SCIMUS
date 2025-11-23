let logbtn = document.getElementById("log-switch")
let t1 = logbtn.children[0]
let t2 = logbtn.children[1]
let state = true

t2.style.opacity = 0.5

logbtn.addEventListener("click",() => {
    if (state) {
        t1.style.opacity = 0.5
        t2.style.opacity = 1
    }
    else {
        t2.style.opacity = 0.5
        t1.style.opacity = 1
    }

    state = !state
})