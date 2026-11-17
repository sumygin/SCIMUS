import { submitSearchData, timeConverter, escapeHTML} from "./utils.js"
const errbar = document.getElementsByClassName("error")[0]

const elList = ["time", "sort", "school", "country", "displaySpace", "page"
]
let elData = {}

for (let el of elList) {
    elData[el] = document.getElementById(el)
}

//HMTL of header of leaderboard
function headerHTML() {
    const text = `<div class="lb-item" id="headers"> 
                        <div class="lb-info rank">Rank</div>
                        <a href="/profile">
                            <div class="lb-info tag">Tag</div>
                        </a>
                        <div class="lb-info filter">${escapeHTML(elData.sort.options[elData.sort.selectedIndex].text)}</div>
                        <div class="lb-info school">School</div>
                        <div class="lb-info country">Country</div>
                    </div>`
    return text
}

const lForm = document.getElementById("lForm")

//check submit
lForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    sendFilters(true)
})

let hasMore = true
let isLoading = false

function userTemplate(user) {
    let newUser = document.createElement("div")
    newUser.classList.add("lb-item")

    let sortItem = user.studied_total ?? user.studied_today ?? user.created_total ?? user.created_today ?? user.total_likes ?? user.likes_today ?? user.completed_total ?? user.completed_today

    if (user.studied_today != undefined) {
        sortItem = timeConverter(user.studied_today)
    }
    else if (user.studied_total != undefined) {
        sortItem = timeConverter(user.studied_total)
    }

    newUser.innerHTML = `
                            <div class="lb-info rank">${Number(user.rank)}</div>
                            <a href="/profile/${encodeURIComponent(user.user_tag)}">
                                <div class="lb-info tag">@${escapeHTML(user.user_tag)}</div>
                            </a>
                            <div class="lb-info filter">${
                                escapeHTML(sortItem ?? 0)
                            }</div>
                            <div class="lb-info school">${escapeHTML(user.school)}</div>
                            <div class="lb-info country">${escapeHTML(user.country)}</div>`
    
        return newUser
}

async function sendFilters (deleteOld) { //function to request user data
    if (deleteOld) {
        elData.page.value = "1"
        elData.displaySpace.innerHTML = headerHTML()
        hasMore = true
        isLoading = false
    }

    const oldBottomEl = document.getElementById("bottomDetect")

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await submitSearchData(lForm, errbar, window, "", true, history, "lb", false)

    if (!result) return

    for (const user of result) { //append new data
        elData.displaySpace.appendChild(userTemplate(user))
    }

    if (result.length >= 20) { //if there is potential for more data to be loaded later
        elData.displaySpace.insertAdjacentHTML('beforeend', '<div id="bottomDetect" style="height: 10px; opacity: 0;"></div>')
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

        elData.page.value = Number(elData.page.value) + 1 //increment page

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
    rootMargin: '1000px', //start loading before the bottom is reached
    threshold: 0.1
})

sendFilters(true)