const elList = ["time", "sort", "school", "country", "displaySpace"
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

async function sendFilters (deleteOld, form, formdata, displayspace) {
    if (deleteOld) { //if this is a new search and not scrolling down for more content, clear previous content and create a new bottom detector
        formdata.page.value = "1"
        displayspace.innerHTML = ""
        formdata.hasMore = true
        formdata.isLoading = false
    }

    let oldBottomEl //get old bottom detector for this form

    if (form == qForm) {
        oldBottomEl = document.getElementById("QbottomDetect")
    }
    else if (form == cForm) {
        oldBottomEl = document.getElementById("CbottomDetect")
    }

    if (oldBottomEl){
        observer.unobserve(oldBottomEl)
        oldBottomEl.remove() //remove old bottom detector
    }

    let result = await submitSearchData(form, errbar, window, "", true, history, form == qForm ? "q" : "c", deleteOld)

    if (!result) return "no data received"

    if (form == qForm) {
        qIDList.push(...result.map(q => Number(q.question_id))) //generate list of question ids
    }
    else if (form == cForm) {
        cIDList.push(...result.map(c => Number(c.collection_id))) //generate list of col ids
    }

    for (const item of result) { //append new data
        if (form == qForm) {
            QdisplaySpace.appendChild(questionTemplate(item))
        }
        else if (form == cForm) {
            CdisplaySpace.appendChild(collectionTemplate(item))
        }
    }

    if (result.length >= 20) { //if there is potential for more data to be loaded later
        let bottomEl
        if (form == qForm) {
            QdisplaySpace.insertAdjacentHTML('beforeend', '<div id="QbottomDetect" style="height: 10px; opacity: 0;"></div>')
            bottomEl = document.getElementById("QbottomDetect")
        }
        else if (form == cForm) {
            QdisplaySpace.insertAdjacentHTML('beforeend', '<div id="CbottomDetect" style="height: 10px; opacity: 0;"></div>')
            bottomEl = document.getElementById("CbottomDetect")
        }

        observer.observe(bottomEl)
    }
    else {
        formdata.hasMore = false //there is no more data to load
    }
}

async function loadMoreItems(form, formdata, displayspace) {
    if (!formdata.isLoading && formdata.hasMore) { //if its already loading or there are no more to be loaded
        formdata.isLoading = true

        formdata.page.value = Number(formdata.page.value) + 1 //increment page

        await sendFilters(false, form, formdata, displayspace)

        formdata.isLoading = false
    }
}

const observer = new IntersectionObserver((entries) => { //if on screen
    if (!entries[0].isIntersecting) return

    const id = entries[0].target.id

    if (id === "QbottomDetect") {
        loadMoreItems(qForm, qFormData, QdisplaySpace)
    } else {
        loadMoreItems(cForm, cFormData, CdisplaySpace)
    }
}, {
    root: null, 
    rootMargin: '1000px', //data load from 100px from bottom
    threshold: 0.1
})