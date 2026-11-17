import { sendDataRequest, escapeHTML } from "./utils.js"
const errbar = document.getElementsByClassName("error")[0]

const displaySpace = document.getElementById("displaySpace")

let hasMore = true
let isLoading = false
let page = 1

//messages are plain text apart from links to profiles, which the server writes as <a href="/profile/tag">@tag</a>
function messageHTML(message) {
    return escapeHTML(message).replace(
        /&lt;a href=&quot;\/profile\/([a-z0-9_.-]+)&quot;&gt;@([a-z0-9_.-]+)&lt;\/a&gt;/g,
        (match, tag, name) => `<a href="/profile/${tag}">@${name}</a>`
    )
}

function notifTemplate(notif) {
    let newNotif = document.createElement("div")
    newNotif.classList.add("msg-item")

    newNotif.innerHTML = `
                            <div class="msg-text">
                        <div class="message">${messageHTML(notif.message)}</div>
                    </div>
                    <div class="timestamp">
                        ${escapeHTML(notif.created_at)}
                    </div>
                    ${notif.question_id ? `<a href="/question/${Number(notif.question_id)}" class="hyperlink">
                        GO TO
                    </a>` : `<span class="hyperlink"></span>`}`
    
    if (!notif.viewed) {
        newNotif.style.fontWeight = "bolder"
    }
    
    return newNotif
}

async function loadNotifications() { //function to request notifications
    const oldBottomEl = document.getElementById("bottomDetect")

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await sendDataRequest(`/api/inbox/${page}`, errbar, window, "")

    if (!result) return

    for (const notif of result) { //append new data
        displaySpace.appendChild(notifTemplate(notif))
    }

    if (result.length >= 20) { //if there is potential for more data to be loaded later
        displaySpace.insertAdjacentHTML('beforeend', '<div id="bottomDetect" style="height: 10px; opacity: 0;"></div>')
        const bottomEl = document.getElementById("bottomDetect")
        observer.observe(bottomEl)
    }
    else {
        hasMore = false //there is no more data to load
    }
}

async function loadMoreItems() {
    if (!isLoading && hasMore) { //if its already loading or there are no more to be loaded
        isLoading = true

        page++ //increment page

        await loadNotifications()

        isLoading = false
    }
}

const observer = new IntersectionObserver((entries) => {
    
    if (entries[0].isIntersecting) { //if on screen
        loadMoreItems()
    }
}, {
    root: null, 
    rootMargin: '1000px', //start loading before the bottom is reached
    threshold: 0.1
})

loadNotifications()
