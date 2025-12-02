let qcbtn = document.getElementById("qc-switch")
let t1 = qcbtn.children[0]
let t2 = qcbtn.children[1]
let qs = document.getElementById("questionSearch")
let cs = document.getElementById("collectionSearch")
let state = true
cs.style.display = "none"

t2.style.opacity = 0.25

qcbtn.addEventListener("click",() => {
    if (state) {
        t1.style.opacity = 0.25
        t2.style.opacity = 1
        qs.style.display = "none"
        cs.style.display = "block"
    }
    else {
        t2.style.opacity = 0.25
        t1.style.opacity = 1
        qs.style.display = "block"
        cs.style.display = "none"
    }

    state = !state
})