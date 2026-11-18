import { loadData, escapeHTML, generateStarHTML, getSubjectColour, renderMath, skeletons, clearLoading } from "./utils.js"

const stages = ["GCSE", "A-level", "University+"]

//real totals from the database. left out entirely if they can't be loaded
async function showStats() {
    const stats = await loadData("/api/stats")
    if (!stats || !stats.questions) return

    const parts = [
        `<span><b>${Number(stats.questions)}</b> questions</span>`,
        `<span><b>${Number(stats.subjects)}</b> subjects</span>`,
    ]
    if (stats.boards?.length) {
        parts.push(`<span class="boards">${stats.boards.map(escapeHTML).join(", ")}</span>`)
    }

    document.getElementById("stats").innerHTML = parts.join(`<span class="dot">&middot;</span>`)
}

function questionCard(q) {
    const card = document.createElement("a")
    card.classList.add("q-card")
    card.href = `/question/${Number(q.question_id)}`

    let emoji = "neutral" //overall like rating
    if (q.like_rating > 10) emoji = "smile"
    if (q.like_rating < -10) emoji = "frown"

    card.innerHTML = `
        <div class="q-card-subject">${escapeHTML(q.subject)}<div class="q-card-topic">${escapeHTML(q.topic)}</div></div>
        <div class="q-card-body">
            <div class="q-card-title">${escapeHTML(q.name)}</div>
            <div class="q-card-text">${escapeHTML(q.content)}</div>
            <div class="q-card-info">
                ${generateStarHTML(q.avg_diff_rating)}
                <span><img src="/resources/view.PNG" alt="" class="icon"> ${Number(q.views)}</span>
                <span><img src="/resources/${emoji}.PNG" alt="" class="icon"> ${Number(q.like_rating)}</span>
            </div>
        </div>`

    card.querySelector(".q-card-body").style.backgroundColor = getSubjectColour(q.subject_id)
    renderMath(card)

    return card
}

async function showPreview() {
    const space = document.getElementById("preview")
    space.appendChild(skeletons("q-card-skeleton", 6))

    const questions = await loadData("/api/search/question/?sort=likes")
    clearLoading(space)

    if (!Array.isArray(questions) || questions.length == 0) {
        document.getElementById("preview-block").remove()
        return
    }

    for (const q of questions.slice(0, 8)) {
        space.appendChild(questionCard(q))
    }
}

async function showSubjects() {
    const space = document.getElementById("subjects")

    const lists = await Promise.all([0, 1, 2].map(stage => loadData(`/api/subjects/names/${stage}`)))

    lists.forEach((names, stage) => {
        if (!Array.isArray(names) || names.length == 0) return

        const group = document.createElement("div")
        group.classList.add("subject-group")
        group.innerHTML = `<div class="subject-stage">${stages[stage]}</div><div class="chips"></div>`

        for (const name of names) {
            const chip = document.createElement("a")
            chip.classList.add("chip")
            chip.innerText = name
            chip.href = `/search/?${new URLSearchParams({stage: stage, subject: name, searchType: "q"})}`
            group.querySelector(".chips").appendChild(chip)
        }

        space.appendChild(group)
    })

    if (space.children.length == 0) {
        document.getElementById("subjects-block").remove()
    }
}

//sections fade up as they scroll into view. anything at or above the bottom of the screen is shown,
//so a fast scroll or jumping to the end can't skip past one and leave it hidden
function revealOnScroll() {
    const sections = [...document.querySelectorAll(".reveal")]
    let waiting = false

    function check() {
        waiting = false
        const bottom = window.innerHeight - 40

        for (const section of sections) {
            if (!section.classList.contains("in") && section.getBoundingClientRect().top < bottom) {
                section.classList.add("in")
            }
        }
    }

    function onScroll() {
        if (!waiting) {
            waiting = true
            requestAnimationFrame(check)
        }
    }

    document.documentElement.classList.add("js-reveal")

    //this site scrolls the body rather than the window, so listen for scrolling anywhere
    document.addEventListener("scroll", onScroll, {capture: true, passive: true})
    window.addEventListener("resize", onScroll)
    check()
}

//arrow at the bottom of the first screen, goes away once the page has been scrolled
function scrollHint() {
    const hint = document.getElementById("scroll-hint")
    hint.addEventListener("click", () => {
        document.querySelector(".hero + .block").scrollIntoView({behavior: "smooth", block: "start"})
    })

    document.addEventListener("scroll", () => {
        const scrolled = Math.max(document.body.scrollTop, document.documentElement.scrollTop) > 60
        hint.classList.toggle("gone", scrolled)
    }, {capture: true, passive: true})
}

scrollHint()
revealOnScroll()
showStats()
showPreview()
showSubjects()
