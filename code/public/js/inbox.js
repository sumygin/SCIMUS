import { sendDataRequest, submitSearchData} from "./utils.js"
const errbar = document.getElementsByClassName("error")[0]

const elList = ["displaySpace"]

let elData = {}

for (let el of elList) {
    elData[el] = document.getElementById(el)
}

let hasMore = true
let isLoading = false
let page

function notifTemplate(notif) {
    let newNotif = document.createElement("div")
    newNotif.classList.add("msg-item")

    newNotif.innerHTML = `
                            <div class="msg-text">
                        <div class="message">${notif.message}</div>
                    </div>
                    <div class="timestamp">
                        ${notif.created_at}
                    </div>
                    <a href="/question/${notif.question_id}" class="hyperlink">
                        GO TO
                    </a>`
    
    if (!notif.viewed) {
        newNotif.style.fontWeight = "bolder"
    }
    
    return newNotif
}

async function sendFilters (deleteOld) { //function to request user data
    if (deleteOld) {
        page = "1"
        elData.displaySpace.innerHTML = ""
        hasMore = true
        isLoading = false
    }

    const oldBottomEl = document.getElementById("bottomDetect")

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await sendDataRequest(`api/inbox/${page}`, errbar, window, "")

    if (!result) return

    console.log(result)

    for (const notif of result) { //append new data
        elData.displaySpace.appendChild(notifTemplate(notif))
    }

    if (result.length >= 20) { //if tehre is potential for more data to be loaded later
        elData.displaySpace.insertAdjacentHTML('beforeend', '<div id="bottomDetect" style="height: 10px; opacity: 0;"></div>')
        const bottomEl = document.getElementById("bottomDetect")
        observer.observe(bottomEl)
    }
    else {
        hasMore = false //tehre is no more data to load
    }
}

async function loadMoreItems() {
    if (!isLoading && hasMore) { //if its already loading or there are no more to be loaded
        isLoading = true

        elData.page = Number(elData.page.value) + 1 //increment page

        await sendFilters(false) //send current filters to server and request data back

        isLoading = false
    }
}

const observer = new IntersectionObserver((entries) => {
    
    if (entries[0].isIntersecting) { //if on screen
        loadMoreItems()
    }
}, {
    root: null, 
    rootMargin: '1000px', //data load from 100px from bottom
    threshold: 0.1
})

sendFilters(true)