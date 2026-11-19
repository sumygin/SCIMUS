export async function loadData(path) {
    try {
        const res = await fetch(path)
        return await res.json()
    }
    catch (err) {
        console.error(err)
        return []
    }
}

export function upperCaseify(text) {
    text = text.split("")
    for (let i = 0; i<text.length; i++) {
        if (text[i-1] == " " || i == 0) {
            text[i] = text[i].toUpperCase()
        }
    }
    text = text.join("")
    return text
}

//anything that came from a user has to go through this before being put into innerHTML
export function escapeHTML(text) {
    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}

//tags that questions and mark schemes are allowed to use for formatting
const allowedTags = ["P", "BR", "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "CODE", "PRE", "SUB", "SUP",
    "TABLE", "THEAD", "TBODY", "TR", "TD", "TH"]

//keeps formatting tags only, everything else is turned into plain text and all attributes are removed
export function sanitizeHTML(html) {
    const template = document.createElement("template")
    template.innerHTML = String(html ?? "")

    const clean = (node) => {
        for (const child of [...node.childNodes]) {
            if (child.nodeType == Node.TEXT_NODE) continue

            if (child.nodeType != Node.ELEMENT_NODE || ["SCRIPT", "STYLE"].includes(child.tagName)) {
                child.remove()
                continue
            }

            clean(child)

            if (!allowedTags.includes(child.tagName)) {
                child.replaceWith(...child.childNodes) //keep the text inside
                continue
            }

            for (const attr of [...child.attributes]) {
                child.removeAttribute(attr.name)
            }
        }
    }

    clean(template.content)
    return template.content
}

const mathDelimiters = [
    //block
    {left: '$$', right: '$$', display: true},
    {left: '\\[', right: '\\]', display: true},
    //inline
    {left: '$', right: '$', display: false},
    {left: '\\(', right: '\\)', display: false}
]

export function renderMath(el) { //render laTex inside an element
    if (typeof renderMathInElement != "function") return //katex didn't load

    renderMathInElement(el, {
        delimiters: mathDelimiters,
        throwOnError: false //stops page crashing if error
    })
}

//resolves when all images on the page are done, so the page doesn't appear half-loaded
export async function imagesLoaded() {
    const images = Promise.all(
        [...document.images].map(img =>
            img.complete ? Promise.resolve() : new Promise(r => {
                img.addEventListener("load", r, {once: true})
                img.addEventListener("error", r, {once: true})
            })
        )
    )
    const timeout = new Promise(r => setTimeout(r, 3000)) //never keep the page hidden for too long

    await Promise.race([images, timeout])
}

//sends guests to the login page, which brings them back here afterwards
export function goToLogin() {
    const here = window.location.pathname + window.location.search
    window.location.href = `/login?next=${encodeURIComponent(here)}`
}

let userRequest

//the logged in user's tag, or null for guests. only asks the server once per page
export function getUser() {
    if (!userRequest) {
        userRequest = fetch("/api/me")
            .then(res => res.json())
            .then(result => result.user_tag || null)
            .catch(() => null)
    }
    return userRequest
}

export async function getSubjectNames(val) {
    return await loadData(`/api/subjects/names/${encodeURIComponent(val)}`)
}

export async function getSchoolNames(){
    return await loadData(`/api/schools/names`)
}

export async function getTopicNames(val){
    return await loadData(`/api/topics/names/${encodeURIComponent(val)}`)
}

export function reportInvalid(el, message, e) {
    el.setCustomValidity(message)
    el.reportValidity()
    e.preventDefault()
}

let errbarTimeout

function showMessage(errbar, message, colour) {
    if (!errbar) return

    errbar.innerText = message
    errbar.style.color = colour

    //restart the slide-in if a message is already showing
    errbar.classList.remove("show")
    void errbar.offsetWidth
    errbar.classList.add("show")

    clearTimeout(errbarTimeout)
    errbarTimeout = setTimeout(() => {
        errbar.classList.remove("show")
    }, 3000)
}

//greys out a button while its request is being sent, so it can't be pressed twice
export function setBusy(button, busy) {
    if (!button) return
    button.disabled = busy
    button.setAttribute("aria-busy", busy)
}

//message shown in a list that has nothing in it
export function emptyState(text) {
    const el = document.createElement("div")
    el.classList.add("empty-state")
    el.innerText = text
    return el
}

//shows the page once it's ready, with a short fade in
export function showPage() {
    const html = document.documentElement
    const wasLoading = html.classList.contains("page-loading")

    html.classList.remove("page-loading")
    html.style.visibility = "visible"
    html.classList.add("shown")

    if (wasLoading) { //fade the content in now that it has replaced the loading message
        const main = document.querySelector("main")
        main.style.animation = "none"
        void main.offsetWidth
        main.style.animation = ""
    }
}

//opens a popup or panel. stops a closing animation that is still running on it
export function openAnimated(el, display = "block") {
    el.closingToken = null
    el.classList.remove("closing")
    el.style.display = display
}

//plays an element's closing animation, then hides it
export function closeAnimated(el, after) {
    if (!el || el.style.display == "none" || getComputedStyle(el).display == "none" || el.classList.contains("closing")) return

    const token = {}
    el.closingToken = token
    el.classList.add("closing")

    const finish = () => {
        if (el.closingToken !== token) return //it was opened again in the meantime
        el.closingToken = null
        el.classList.remove("closing")
        el.style.display = "none"
        if (after) after()
    }

    el.addEventListener("animationend", finish, {once: true})
    setTimeout(finish, 400) //in case the animation never runs
}

//a little pop when a number changes
export function bump(el) {
    if (!el) return
    el.classList.remove("bump")
    void el.offsetWidth
    el.classList.add("bump")
}

//"Loading" with three pulsing dots
export function loader(text = "Loading") {
    const el = document.createElement("div")
    el.classList.add("loader")
    el.setAttribute("role", "status")
    el.innerHTML = `<span class="loader-text"></span><span class="dots"><i></i><i></i><i></i></span>`
    el.querySelector(".loader-text").innerText = text
    return el
}

//grey shimmering blocks that stand in for content until it arrives
export function skeletons(className, count) {
    const group = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div")
        el.classList.add("skeleton", className)
        group.appendChild(el)
    }
    return group
}

//takes away any loading messages or placeholders inside an element
export function clearLoading(el) {
    el.querySelectorAll(":scope > .loader, :scope > .skeleton, :scope > .skeleton-carousel").forEach(item => item.remove())
}

export function success(errbar, message) {
    showMessage(errbar, message, "green")
}

export function warn(errbar, message) {
    showMessage(errbar, message || "Something went wrong", "red")
}

//"1 question", "2 questions"
export function plural(count, word) {
    count = Number(count) || 0
    return `${count} ${word}${count == 1 ? "" : "s"}`
}

export function generateStarHTML(val) {
    const starEmpty = `<img src="/resources/star_empty.PNG" alt="" class="icon">`
    const starFull = `<img src="/resources/star_full.PNG" alt="" class="icon">`

    val = Number(val)
    if (isNaN(val)) val = 0

    val = Math.min(5, Math.max(0, Math.floor(val)))
    let result = ``

    for (let i = 0; i<val; i++) {
        result += starFull
    }
    for (let i = 0; i<(5-val); i++) {
        result += starEmpty
    }
    return result
}

//sends a request and reads the json response, returns [response, result]
async function request(route, options, errbar) {
    try {
        const res = await fetch(route, options)
        const result = await res.json()
        return [res, result]
    }
    catch (err) {
        console.error(err)
        warn(errbar, "Could not reach the server, please try again")
        return [undefined, undefined]
    }
}

function postOptions(data, method="POST") {
    return {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data || {}),
    }
}

export async function sendDataRequest(route, errbar, window, successMsg, method="GET", data) {
    const [res, result] = await request(route, method == "GET" ? undefined : postOptions(data, method), errbar)
    if (!res) return

    if (res.status == 401) { //needs an account
        goToLogin()
        return
    }

    if (result.redirect) { //redirect if a link sent back
        window.location.href = result.redirect
    }

    if (!res.ok) { //not successful
        if (result.error && !result.redirect) {
            warn(errbar, result.error)
        }
        return
    }

    if (successMsg != "") success(errbar, successMsg)

    return result
}

export async function sendData(route, data, errbar, window, successMsg, send_result, quiet) {
    const [res, result] = await request(route, postOptions(data), quiet ? undefined : errbar)
    if (!res) return

    if (res.status == 401) { //needs an account
        goToLogin()
        return
    }

    //display response

    if (!res.ok) { //not successful
        if (!quiet) warn(errbar, result.error)

        if (result.redirect) {
            window.location.href = result.redirect
        }
        return
    }

    if (successMsg != "") success(errbar, successMsg)

    setTimeout(() => {
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
    }, 1000)

    if (send_result) return result
}

export async function sendFormData(route, form, errbar, window, successMsg, send_result) {
    const formdata = new FormData(form)
    const data = Object.fromEntries(formdata.entries())

    return await sendData(route, data, errbar, window, successMsg, send_result)
}

export async function submitSearchData(form, errbar, window, successMsg, send_result,  history, type, deleteOld) {
    const formdata = new FormData(form)

    const params = new URLSearchParams(formdata)
    if (deleteOld && type != "lb") history.replaceState(null, "", `/search/?${params.toString()}`) //only change url if new search has been done

    const routes = {
        q: "/api/search/question/",
        c: "/api/search/collection/",
        lb: "/api/lb/"
    }

    const result = await sendDataRequest(`${routes[type]}?${params.toString()}`, errbar, window, successMsg)

    if (send_result) return result
}

export function convertStudyStage(val) {
    if (!isNaN(Number(val))) {
        if (val == 0 || val == "0") {
            return "GCSE"
        }
        if (val == 1 || val == "1") {
            return "A-level"
        }
        if (val == 2 || val == "2") {
            return "University+"
        }
    }
    else {
        if (val == "GCSE") {
            return 0
        }
        if (val == "A-level") {
            return 1
        }
        if (val == "University+") {
            return 2
        }
    }
    return ""
}

export function convertTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Official"
    }
    else if (Number(val) == 2) {
        return "Looking for solution"
    }
    else if (val == "solution" || val == "Looking for solution"){
        return 2
    }
    else if (val == "user" || val == "User-made") {
        return 1
    }
    else if (val == "official" || val == "Official") {
        return 0
    }
    return ""
}

export function convertCollectionTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Past paper"
    }
    else if (val == "paper" || val == "Past paper") {
        return 0
    }
    else if (val == "user" || val == "User-made") {
        return 1
    }
    return ""
}

export function likeConverter(val) { //convert overall like consensus from value
    val = Number(val)
    let src = "/resources/neutral.PNG"
    if (val > 10) {
        src = "/resources/smile.PNG"
    }
    else if (val < -10) {
        src =  "/resources/frown.PNG"
    }
    return `<img src="${src}" alt="" class="icon">`
}

export async function updatePaperNum(value, paper_field, errbar, window) { //generate HTML for paper number selects
    if (!value) return
    const paperNum = Number(await sendDataRequest(`/api/subject/papers/${encodeURIComponent(value)}`, errbar, window, ""))
    let options = '<option value="-1" style="display: none;" selected>paper number</option>'
    for (let i = 1; i<paperNum+1; i++) {
        options += `<option value="${i}" >Paper ${i}</option>`
    }
    paper_field.innerHTML = options
}

export function timeConverter(time) {
    const minute = [1000*60, "m"]
    const hour = [60*minute[0], "h"]
    const day = [24*hour[0], "d"]
    const times = [day, hour, minute]

    time = Number(time) || 0
    let result = ""

    for (let t of times) {

        let number = Math.floor(time/t[0]) //figure out how many time units are in specified time
        time -= number*t[0] //calculate time left over

        if (number > 0) { //add to result
            result += String(number) + t[1] + " "
        }

    }

    return result == "" ? "0m" : result
}

export function getSubjectColour(subjectID) {
    const subjectColours = {
        1: "hsla(0, 100%, 70%, 0.3)",
        2: "hsla(270, 100%, 70%, 0.3)",
        3: "hsla(120, 100%, 70%, 0.3)",
        4: "hsla(30, 100%, 70%, 0.3)",
        5: "hsla(210, 100%, 70%, 0.3)",
        6: "hsla(60, 100%, 70%, 0.3)",
        7: "hsla(0, 100%, 70%, 0.3)",
        8: "hsla(120, 100%, 70%, 0.3)",
        9: "hsla(30, 100%, 70%, 0.3)",
        10: "hsla(210, 100%, 70%, 0.3)",
        11: "hsla(270, 80%, 75%, 0.3)",
        13: "hsla(180, 100%, 70%, 0.3)",
        14: "hsla(300, 100%, 70%, 0.3)"
    }
    return subjectColours[subjectID]
}

//shared by the search and collection pages
export function questionTemplate(question) {
    let insertData = ""
    if (question.tag == 0) {
        insertData =
        `<div class="s-q-year s-q-item">${
            question.year ? Number(question.year) : ""}</div>
        <div class="s-q-paper s-q-item">${
            question.paper_num ? "Paper " + Number(question.paper_num) : ""}</div>
        <div class="s-q-questionNo s-q-item">${
            question.question_num ? "Q" + Number(question.question_num) : ""}</div>`
    }

    const newQuestion = document.createElement("div")

    newQuestion.innerHTML =`<a href="/question/${Number(question.question_id)}">
        <div class="s-q">
            <div class="s-q-text">
                <div class="s-q-name">${escapeHTML(question.name)}</div>
                <div class="s-q-content">${escapeHTML(question.content)}</div>
            </div>
            <div class="s-q-metadata">
                <div class="row">
                    ${question.user_tag ? `<div class="s-q-los s-q-item">@${escapeHTML(question.user_tag)}</div>` : ""}
                    <div class="s-q-los s-q-item">${convertStudyStage(question.study_stage)}</div>
                    <div class="s-q-subject s-q-item">${escapeHTML(question.subject)}</div>
                    <div class="s-q-topic s-q-item">${escapeHTML(question.topic)}</div>
                    <div class="s-q-tag s-q-item-last">${convertTag(question.tag)}</div>
                </div>

                <div class="row">
                    <div class="s-q-views s-q-item" data-tip="Views"><img src="/resources/view.PNG" alt="" class="icon"> ${Number(question.views)}</div>


                    <div class="s-q-comments s-q-item" data-tip="Comments"><img src="/resources/comments.PNG" alt="" class="icon"> ${Number(question.num_comments)}</div>

                    <div class="s-q-likes s-q-item" data-tip="Like rating">${likeConverter(question.like_rating)} ${Number(question.like_rating)}</div>

                    <div class="s-q-rating s-q-item" data-tip="How hard people found it, and how many rated it">${generateStarHTML(Number(question.total_diff_rating)/Number(question.num_diff_ratings))} ${Number(question.num_diff_ratings)}</div>

                    ${insertData}

                </div>
            </div>
        </div>
    </a>`

    newQuestion.style.backgroundColor = getSubjectColour(question.subject_id)
    newQuestion.id = question.question_id

    renderMath(newQuestion)

    return newQuestion
}
