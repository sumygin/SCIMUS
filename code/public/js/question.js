document.documentElement.style.visibility = "hidden"

const qElementList = ["stage", "subject","paper","question","topic","name","user_tag","rating","views",
    "qtext","mstext","formula","spec","formula","likes","watches","solves","ratings","comments","collections", "tag"]
let elData = {}

const starEmpty = `<img src="/resources/star_empty.PNG" alt="" class="icon">`
const starFull = `<img src="/resources/star_full.PNG" alt="" class="icon">`

function generateStarHTML(val) {
    val = Math.floor(val)
    let result = ``
    for (let i = 0; i<val; i++) {
        result += starFull   
    }
    for (let i = 0; i<(5-val); i++) {
        result += starEmpty
    }
    return result
}


for (el of qElementList) {
    elData[el] = document.getElementById(el)
}

let qID = window.location.href.split("/question")[1].substring(1)
if (isNaN(Number(qID))) qID = -1
if (qID == "") qID = -1


async function fetchData() {
    if (qID == -1) {
        window.location.href = "/home"
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
        for (let item in result) {
            if (item == "spec" || item == "formula") {
                elData[item].href = result[item]
            }
            else if (item == "rating") {
                elData[item].innerHTML = generateStarHTML(Number(result[item]))
            }
            else {
                elData[item].innerText = result[item]
            }
        }
    }
}

async function showPage() {
    await Promise.all([
        fetchData(), 
    ])
    await Promise.all(
      [...document.images].map(img =>
          img.complete ? Promise.resolve() : new Promise(r => img.onload = r)
      )
    )
    document.documentElement.style.visibility = "visible"
}

showPage()