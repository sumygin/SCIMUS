//small labels for buttons that are only an icon. any element with a data-tip attribute gets one:
//on hover with a mouse, on keyboard focus, or by pressing and holding on a touch screen

const tip = document.createElement("div")
tip.className = "tooltip"
tip.setAttribute("role", "tooltip")
tip.id = "tooltip"
document.body.appendChild(tip)

let target //element the tooltip is showing for
let showTimer
let hideTimer
let lastHidden = 0

const gap = 8 //space between the element and the tooltip
const edge = 8 //closest the tooltip gets to the edge of the screen

function place() {
    if (!target || !target.isConnected) return hide()

    const box = target.getBoundingClientRect()
    const width = tip.offsetWidth
    const height = tip.offsetHeight

    //above the element if there's room, otherwise below it
    let top = box.top - height - gap
    let below = false
    if (top < edge + 60) { //leave the header alone
        top = box.bottom + gap
        below = true
    }

    let left = box.left + box.width / 2 - width / 2
    left = Math.max(edge, Math.min(left, window.innerWidth - width - edge))

    //the little pointer still points at the middle of the element even when the box is pushed in from the edge
    const pointer = Math.max(10, Math.min(box.left + box.width / 2 - left, width - 10))

    tip.style.left = `${Math.round(left)}px`
    tip.style.top = `${Math.round(top)}px`
    tip.style.setProperty("--pointer", `${Math.round(pointer)}px`)
    tip.classList.toggle("below", below)
}

function show(el) {
    const text = el.dataset.tip
    if (!text) return

    clearTimeout(hideTimer)
    target = el
    tip.textContent = text
    el.setAttribute("aria-describedby", "tooltip")

    tip.classList.remove("show")
    tip.style.display = "block"
    place()
    void tip.offsetWidth //restart the fade
    tip.classList.add("show")
}

function hide() {
    clearTimeout(showTimer)
    if (target) target.removeAttribute("aria-describedby")
    if (tip.classList.contains("show")) lastHidden = Date.now()

    target = undefined
    tip.classList.remove("show")
    hideTimer = setTimeout(() => {
        if (!target) tip.style.display = "none"
    }, 200)
}

function tipTarget(el) {
    return el instanceof Element ? el.closest("[data-tip]") : null
}

//MOUSE: a short wait before showing, unless another tooltip was just open
document.addEventListener("pointerover", (e) => {
    if (e.pointerType == "touch") return

    const el = tipTarget(e.target)
    if (el == target) return

    clearTimeout(showTimer)
    if (!el) {
        if (target) hide()
        return
    }

    if (target) hide()
    const delay = Date.now() - lastHidden < 300 ? 0 : 450
    showTimer = setTimeout(() => show(el), delay)
})

document.addEventListener("pointerout", (e) => {
    if (e.pointerType == "touch") return

    const leaving = tipTarget(e.target)
    if (leaving && !leaving.contains(e.relatedTarget)) {
        clearTimeout(showTimer)
        if (leaving == target) hide()
    }
})

//pressing the button hides its label so it doesn't sit over whatever opens
document.addEventListener("pointerdown", (e) => {
    if (e.pointerType != "touch") {
        clearTimeout(showTimer)
        hide()
    }
}, true)

//KEYBOARD
document.addEventListener("focusin", (e) => {
    const el = tipTarget(e.target)
    if (el && e.target.matches(":focus-visible")) show(el)
})

document.addEventListener("focusout", () => {
    if (target) hide()
})

document.addEventListener("keydown", (e) => {
    if (e.key == "Escape" && target) hide()
})

//TOUCH: press and hold shows the label without pressing the button
let holdTimer
let holdStart
let held = false

document.addEventListener("touchstart", (e) => {
    const el = tipTarget(e.target)
    if (!el || e.touches.length != 1) return

    holdStart = {x: e.touches[0].clientX, y: e.touches[0].clientY}
    held = false
    clearTimeout(holdTimer)
    holdTimer = setTimeout(() => {
        held = true
        show(el)
        clearTimeout(hideTimer)
        hideTimer = setTimeout(hide, 2000)
    }, 500)
}, {passive: true})

document.addEventListener("touchmove", (e) => {
    if (!holdStart) return
    const moved = Math.hypot(e.touches[0].clientX - holdStart.x, e.touches[0].clientY - holdStart.y)
    if (moved > 10) clearTimeout(holdTimer) //scrolling, not holding
}, {passive: true})

document.addEventListener("touchend", () => {
    clearTimeout(holdTimer)
    holdStart = undefined
}, {passive: true})

//the tap that finishes a press-and-hold doesn't also press the button
document.addEventListener("click", (e) => {
    if (held) {
        held = false
        e.preventDefault()
        e.stopPropagation()
    }
}, true)

//keep it next to its element
window.addEventListener("resize", () => target && place())
document.addEventListener("scroll", () => target && hide(), {capture: true, passive: true})

//buttons that change what they do (watch / stop watching) update the label while it's showing
new MutationObserver(() => {
    if (target && tip.textContent != target.dataset.tip) {
        tip.textContent = target.dataset.tip || ""
        place()
    }
}).observe(document.body, {subtree: true, attributes: true, attributeFilter: ["data-tip"]})
