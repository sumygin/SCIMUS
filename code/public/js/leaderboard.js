import { sendDataRequest, submitSearchData} from "./utils.js"
const errbar = document.getElementsByClassName("error")[0]

const elList = ["time", "sort", "school", "country", "displaySpace", "page"
]
let elData = {}

for (let el of elList) {
    elData[el] = document.getElementById(el)
}

//HMTL of header of leaderboard
const headerHTML = `<div class="lb-item" id="headers"> 
                    <div class="lb-info rank">Rank</div>
                    <a href="/profile">
                        <div class="lb-info tag">Tag</div>
                    </a>
                    <div class="lb-info filter">Time studied</div>
                    <div class="lb-info school">School</div>
                    <div class="lb-info country">Country</div>
                </div>`

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
    newUser.innerHTML = `
                            <div class="lb-info rank">${user.rank}</div>
                            <a href="/user/${user.user_tag}">
                                <div class="lb-info tag">@${user.user_tag}</div>
                            </a>
                            <div class="lb-info filter">${user.studied_total}</div>
                            <div class="lb-info school">${user.school}</div>
                            <div class="lb-info country">${user.country}</div>`
    
        return newUser
}

async function sendFilters (deleteOld) { //function to request user data
    if (deleteOld) {
        elData.page.value = "1"
        elData.displaySpace.innerHTML = headerHTML
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
    rootMargin: '1000px', //data load from 100px from bottom
    threshold: 0.1
})

sendFilters(true)