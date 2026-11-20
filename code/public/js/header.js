import "./tooltips.js"
import { sendDataRequest, getUser, showLoginPrompt } from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]

const tPopup = document.getElementById("timer-popup")
const tHover = document.getElementsByClassName("timer-hover")
const canvas = document.getElementById("timer-arc")

const ctx = canvas.getContext("2d")

const backBtn = document.getElementById("b1")
const playBtn = document.getElementById("b2")
const fwdBtn = document.getElementById("b3")
const modeBtn = document.getElementById("mode-btn")

const minsTxt = document.getElementById("mins")
const secsText = document.getElementById("secs")
const timeInputs = document.getElementsByClassName("input-time")
const headerTxt = document.getElementById("header-timer-text")

const timerSound = new Audio()
timerSound.preload = "none" //only download the sound when it's actually needed
timerSound.src = "/resources/timersound.wav"

document.addEventListener("dragstart", e => e.preventDefault())

//HEADER MENUS

//there is no hover on touch screens, so the timer and profile menus open on tap instead
const touchScreen = window.matchMedia("(hover: none)")
const menus = [tHover[0], document.getElementsByClassName("profile-hover")[0]]

document.addEventListener("click", (e) => {
    if (!touchScreen.matches) return

    for (const menu of menus) {
        const popup = menu.querySelector("div")

        if (popup.contains(e.target)) continue //using the menu itself

        if (menu.contains(e.target)) {
            menu.classList.toggle("open")
        }
        else {
            menu.classList.remove("open")
        }
    }
})

document.addEventListener("keydown", (e) => { //escape closes the header menus
    if (e.key != "Escape") return
    for (const menu of menus) menu.classList.remove("open")
    if (document.activeElement?.closest("#header")) document.activeElement.blur()
})

function timerOpen() { //whether the timer popup is on screen
    if (menus[0].classList.contains("open")) return true

    for (const item of tHover) {//thover has 2 elements - if any of them are hovered the popup is showing
        if (item.matches(":hover")) return true
    }
    return false
}

const user = await getUser()

if (!user) { //guests only get the option to log in
    for (const link of document.querySelectorAll('#header a[href="/create"]')) {
        link.addEventListener("click", (e) => {
            e.preventDefault()
            showLoginPrompt("Log in to write questions", "Post your own questions, or ask for help with one you're stuck on.")
        })
    }

    const next = encodeURIComponent(window.location.pathname + window.location.search)
    document.getElementById("profile-popup").innerHTML = `
          <span class="profile-hover-item">
            <a href="/login?next=${next}"><button>Log in</button></a>
          </span>`
}

document.getElementById("logout")?.addEventListener("click", async (e) => {
    e.preventDefault()
    await sendDataRequest("/logout", errbar, window, "", "POST")
})

//TIMER

function saveTimer() { //function to save the timer
    try {
        localStorage.setItem("timer", JSON.stringify(timer))
    } catch (err) {} //storage can be blocked in private mode
}

class Timer {
    constructor(workTime=50*60000, restTime=10*60000) {
        this.targetTime = workTime
        this.startTime = 0
        this.pauseTime = 0
        this.workTime = workTime
        this.restTime = restTime
        this.mode = "work"
        this.running = false
        this.paused = false
        this.totalPauseTime = 0
        this.timeLeft = workTime
    }

    play() {
        const midRun = this.running && this.startTime != 0 //already going, e.g. coming back to the tab
        this.running = true
        if (this.pauseTime == 0 && !midRun) { //if starting timer for first time in session
            this.startTime = Date.now()
        }
        else if (this.paused) {
            this.totalPauseTime += Date.now()-this.pauseTime //add time spent paused to total
        }
        this.paused = false
        setTimerText(false)
        saveTimer()
    }

    pause() {
        if (!this.paused) {
            this.pauseTime = Date.now()
        }
        this.paused = true
        this.running = false
        setTimerText(true)
        saveTimer()
    }

    forward(){
        this.zero()
    }

    back(){
        this.running = false
        this.paused = false
        this.resetPauseTimes()
        this.timeLeft = this.targetTime //reset time to full
        headerTxt.style.color = "black"
        setTimerText(true)
        saveTimer()
    }

    zero() {
        //time actually spent, skipping forward doesn't count the rest
        const studied = Math.round(Math.min(this.targetTime, Math.max(0, this.targetTime-this.timeLeft)))

        updatePlayButton("replay")
        this.running = false
        this.paused = false
        this.timeLeft = 0
        this.resetPauseTimes()
        headerTxt.style.color = "green"
        if (!timerOpen()) { //only play sound if user isnt looking at the timer
            timerSound.play().catch(() => {}) //browsers block sound until the page has been clicked
        }

        //send studied time to server
        if (this.mode == "work" && studied > 0 && user) {
            fetch(`/api/timer/add/${studied}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: "{}"
            }).catch(() => {})
        }

    }

    switchMode() {
        if (this.running) {return} //prevent mode switch while running
        if (this.mode == "work") {
            this.mode = "rest"
            this.targetTime = this.restTime
        }
        else if (this.mode == "rest") {
            this.mode = "work"
            this.targetTime = this.workTime
        }
        updateModeButton()
        saveTimer()
    }

    reset() {
        this.switchMode()
        this.resetPauseTimes()
        this.timeLeft = this.targetTime //reset time to new mode target
        headerTxt.style.color = "black"
        setTimerText(true)
        this.running = false
        this.paused = false
        saveTimer()
    }

    resetPauseTimes() {
        this.pauseTime = 0
        this.totalPauseTime = 0
        saveTimer()
    }
}

function loadSavedTimer() { //load timer data from local storage
    try {
        return JSON.parse(localStorage.getItem("timer"))
    } catch (err) {
        return null
    }
}

//set users preferences to timer values, fallback to defaults if prefs are invalid
const prefs = await sendDataRequest("/api/preferences/get", errbar, window, "")
let workTime = Number(prefs?.[0])*1000*60
let restTime = Number(prefs?.[1])*1000*60
if (!workTime || !restTime || workTime < 0 || restTime < 0) {
    workTime = 50 * 1000 * 60
    restTime = 10 * 1000 * 60
}

const timer = new Timer(workTime, restTime)
const data = loadSavedTimer()

if (data && typeof data == "object") { //if there is saved data, carry on from where the timer was
    for (const key of ["targetTime", "startTime", "pauseTime", "totalPauseTime", "timeLeft"]) {
        if (Number.isFinite(data[key])) timer[key] = data[key]
    }
    if (data.mode == "rest") timer.mode = "rest"
    timer.running = data.running === true
    timer.paused = data.paused === true

    if (timer.running) {
        if (timer.paused && !document.hidden) timer.play() //was paused while moving between pages
        updatePlayButton("pause")
    }

    if (timer.timeLeft == 0) { //timer was already finished when page was closed
        headerTxt.style.color = "green"
        updatePlayButton("replay")
    }

    updateModeButton()
}


function setTimerText(bool) { //toggle whether time inputs are editable
    for (let el of timeInputs) {
        el.contentEditable = bool
    }
}

function updateModeButton() {
    modeBtn.innerHTML = `<img src="/resources/${timer.mode == "rest" ? "rest" : "work"}.PNG" alt="" class="icon">`
    modeBtn.dataset.tip = timer.mode == "rest" ? "On a break. Switch back to studying" : "Studying. Switch to a break"
}

function updatePlayButton(update) { 
    if (!["play", "pause", "replay"].includes(update)) return

    playBtn.innerHTML = `<img src='/resources/${update}.PNG' alt='' class='icon' id='${update}'>`
    playBtn.dataset.tip = {play: "Start", pause: "Pause", replay: "Start the next session"}[update]
    playBtn.style.fontSize = "1rem"
}


playBtn.addEventListener("click", function() { //PLAY BUTTON EVENTS
    if (timer.timeLeft != 0) {
        if (timer.running) { //pause
            updatePlayButton("play")
            timer.pause()
        }
        else {
            updatePlayButton("pause") //play
            timer.play()
        }
    }
    else {
        timer.reset() //replay -> reset and switch mode
        updatePlayButton("play")
    }
})

fwdBtn.addEventListener("click", function(){
    if (timer.timeLeft != 0) {
        timer.forward()
    }
})

backBtn.addEventListener("click", function(){
    if (timer.timeLeft != timer.targetTime) { //only allow back if timer has been started
        timer.back()
        updatePlayButton("play")
    }
})

modeBtn.addEventListener("click", function() {
    if (!timer.running && timer.timeLeft != 0) {
        timer.reset()
    }
})

let timeInputSelected = false

function twoDigits(val) {
    return val < 10 ? "0" + val : String(val)
}

for (const el of timeInputs) {
    el.addEventListener("focus", function() {
        timeInputSelected = true
    })

    el.addEventListener("blur", function(){
        timeInputSelected = false

        let mins = parseInt(minsTxt.innerText, 10) || 0 //convert to ints
        let secs = parseInt(secsText.innerText, 10) || 0

        //clamp time between 0 and 90 mins
        timer.timeLeft = (mins * 60000) + (secs * 1000)
        timer.timeLeft = Math.max(timer.timeLeft, 0)
        timer.timeLeft = Math.min(timer.timeLeft, 90*60000)

        minsTxt.innerText = twoDigits(Math.floor(timer.timeLeft/60000))
        secsText.innerText = twoDigits(Math.floor((timer.timeLeft%60000)/1000))

        timer.targetTime = timer.timeLeft //set target time to time inside
        timer.paused = false
        timer.resetPauseTimes()
    })
    
    el.addEventListener("keydown", function(e) { //prevent anything except digits getting typed
        if (e.key === "Enter") {
            e.preventDefault()
            el.blur()
            return
        }

        if (e.key.length > 1 || e.ctrlKey || e.metaKey) return //backspace, arrows, shortcuts etc

        if (!/\d/.test(e.key) || (el.innerText.length >= 3)) {
            e.preventDefault()
        }
    })

    el.addEventListener("paste", e => e.preventDefault())
}

document.addEventListener("visibilitychange", function() { //change when page is switched
    if (document.hidden && timer.running) {
        updatePlayButton("play")
        timer.pause()

        timer.running = true //keep running flag so timer resumes on return
        saveTimer()
    }
    else if (timer.running){
        timer.play()
        updatePlayButton("pause")
    }
})

function drawArc() {
    let theta = -(Math.PI*(timer.timeLeft/(timer.targetTime))) //angle proportional to time remaining
    if (timer.timeLeft == 0 || !Number.isFinite(theta)) {
        theta = 0
    }
    let c = [canvas.width/2, canvas.height-10]
    let l = 25

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //draw filled arc showing time elapsed
    ctx.beginPath()
    ctx.arc(c[0], c[1], 120, theta, 0, false)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 25
    ctx.stroke()
    ctx.closePath()

    //draw outline arc showing time remaining
    ctx.beginPath()
    ctx.arc(c[0], c[1], 130, -Math.PI, theta, false)
    ctx.moveTo(c[0]-110, c[1])
    ctx.lineTo(c[0]-130, c[1])
    ctx.arc(c[0], c[1], 110, -Math.PI, theta, false)
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.fillStyle = "white"
    ctx.stroke()

    //draw tick marker at current position
    ctx.beginPath()
    ctx.moveTo(c[0]-((120-l)*Math.cos(Math.PI-theta)), c[1] + ((120-l)*Math.sin(Math.PI-theta))) //P1
    ctx.lineTo(c[0]-((120+l)*Math.cos(Math.PI-theta)), c[1] + ((120+l)*Math.sin(Math.PI-theta))) //P2
    ctx.strokeStyle = "black"
    ctx.lineWidth = 5
    ctx.stroke()
    ctx.closePath()
}

function setText(el, text) { //only touch the page when something actually changed
    if (el.innerText != text) el.innerText = text
}

function mainLoop() {

    if (timer.running && !timer.paused && timer.timeLeft != 0) {
        if (timer.timeLeft < 1) {
            timer.zero()
        }
        else {
            timer.timeLeft = timer.startTime == 0 ? timer.targetTime : timer.targetTime-(Date.now() 
            - timer.startTime - timer.totalPauseTime) //elapsed = now - start - total pause time
        }
    }

    if (timerOpen()){
        drawArc()
    }

    //update header and input display
    const shown = Math.max(timer.timeLeft, 0)
    const minutes = twoDigits(Math.floor(shown/60000))
    const seconds = twoDigits(Math.floor((shown%60000)/1000))
    setText(headerTxt, `${minutes}:${seconds}`)

    if (!timeInputSelected){
        setText(minsTxt, minutes)
        setText(secsText, seconds)
    }

    requestAnimationFrame(mainLoop) //loop animation
}

requestAnimationFrame(mainLoop)
