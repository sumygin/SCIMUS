const tPopup = document.getElementById("timer-popup")
const tHover = document.getElementsByClassName("timer-hover")
const canvas = document.getElementById("timer-arc")

const ctx = canvas.getContext("2d")
const markerLength = 30

const backBtn = document.getElementById("b1")
const playBtn = document.getElementById("b2")
const fwdBtn = document.getElementById("b3")
const modeBtn = document.getElementById("mode-btn")

const minsTxt = document.getElementById("mins")
const secsText = document.getElementById("secs")
const timeInputs = document.getElementsByClassName("input-time")
const headerTxt = document.getElementById("header-timer-text")

const timerSound = new Audio("/resources/timersound.wav")

document.getElementsByTagName("main")[0].scroll = true

user = {
    workTime:600,
    restTime:60,
    timeStudiedToday:0,
}
//do later -> fetch from user data


class Timer {
    constructor(workTime=50*60000, restTime=10*60000, startTime=0, mode = "work", running=false, pauseTime=0, totalPauseTime=0) {
        this.targetTime = workTime
        this.startTime = startTime
        this.pauseTime = pauseTime
        this.workTime = workTime
        this.restTime = restTime
        this.mode = mode
        this.running = running
        this.totalPauseTime = totalPauseTime
        this.timeLeft = workTime
    }

    play() {
        this.running = true
        if (this.pauseTime == 0) { //if starting timer for first time in session
            this.startTime = Date.now()
        }
        else {
            this.totalPauseTime += Date.now()-this.pauseTime
        }
        setTimerText(false)
    }

    pause() {
        this.pauseTime = Date.now()
        this.running = false
        setTimerText(true)
    }

    forward(){
        this.zero()
    }

    back(){
        this.running = false
        this.resetPauseTimes()
        this.timeLeft = this.targetTime
        console.log(timer)
        headerTxt.style.color = "black"
        setTimerText(true)
        
    }

    zero() {
        updatePlayButton("replay")
        this.running = false
        this.timeLeft = 0
        this.resetPauseTimes()
        headerTxt.style.color = "green"
        if (!tPopup.matches(":hover")) {
            timerSound.play()
        }
    }

    switchMode() {
        if (this.mode == "work") {
            this.mode = "rest"
            this.targetTime = this.restTime
            modeBtn.innerText = "🛏️"
            
        }
        else if (this.mode == "rest") {
            this.mode = "work"
            this.targetTime = this.workTime
            modeBtn.innerText = "📖"
        }
    }

    reset() {
        this.switchMode()
        this.resetPauseTimes()
        this.timeLeft = this.targetTime
        headerTxt.style.color = "black"
        setTimerText(true)
        this.running = false
    }

    resetPauseTimes() {
        this.pauseTime = 0
        this.totalPauseTime = 0
    }
}

function setTimerText(bool) {
    for (el of timeInputs) {
        el.contentEditable = bool
    }
}

function updatePlayButton(update) { 
    switch (update) {
        case "play":
            playBtn.innerHTML = "▶"
            playBtn.style.fontSize = "1rem"
            break
        case "pause":
            playBtn.innerHTML = "❚❚"
            playBtn.style.fontSize = "1rem"
            break
        case "replay":
            playBtn.innerText = "⟲"
            playBtn.style.fontSize = "1rem"
            break
    }
}

let timer = new Timer()

playBtn.addEventListener("click", function() { //PLAY BUTTON EVENTS
    console.log(timer.timeLeft)
    if (timer.timeLeft != 0) {
        if (timer.running) { //pause
            console.log("timer pause")
            updatePlayButton("play")
            timer.pause()
        }
        else {
            console.log("timer play")
            updatePlayButton("pause") //play
            timer.play()
        }
    }
    else {
        console.log("timer reset")
        timer.reset()
        updatePlayButton("play")
    }
})

fwdBtn.addEventListener("click", function(){
    if (timer.timeLeft != 0) {
        timer.forward()
    }
})

backBtn.addEventListener("click", function(){
    if (timer.timeLeft != timer.targetTime) {
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

for (el of timeInputs) {
    el.addEventListener("focus", function() {
        timeInputSelected = true
    })
}

for (el of timeInputs) {
    el.addEventListener("blur", function(){
        timeInputSelected = false

        timer.pauseTime = 0

        let mins = parseInt(minsTxt.innerText || "0", 10) //convert to ints
        let secs = parseInt(secsText.innerText || "0", 10)


        timer.timeLeft = (mins * 60000) + (secs * 1000)
        timer.timeLeft = Math.max(timer.timeLeft, 0)
        timer.timeLeft = Math.min(timer.timeLeft, 90*60000)

        let minutes = Math.floor(timer.timeLeft/60000)
        let seconds = Math.floor((timer.timeLeft%60000)/1000)

        minsTxt.innerHTML = minutes < 10 ? "0" + minutes  : minutes
        secsText.innerHTML = seconds < 10 ? "0" + seconds  : seconds

        timer.targetTime = timer.timeLeft //set target time to time inside
        timer.resetPauseTimes()
    })
    
    el.addEventListener("keydown", function(e) { //prevent anything except digits getting typed
        let isDigit = /\d/.test(e.key)

        if ( e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft" || e.key === "ArrowRight" ) return

        if (!isDigit || (el.innerText.length >= 3)) {
            e.preventDefault()
        }

    })
}

window.addEventListener("visibilitychange", function() {
    if (document.hidden && timer.running) {
        updatePlayButton("play")
        timer.pause()
        timer.running = true
    }
    else if (timer.running){
        timer.play()
        updatePlayButton("pause")
    }
})



function mainLoop() {

    if (timer.running && timer.timeLeft != 0) {
        if (timer.timeLeft < 10) {
            timer.zero()
            timer.time
        }
        else {
            timer.timeLeft = timer.startTime == 0 ? timer.targetTime : timer.targetTime-(Date.now() 
            - timer.startTime - timer.totalPauseTime)
        }

        
    }

    let renderArc = false
    for (item of tHover) {//thover has 2 elements - if any of them are hovered we need to render arc
        if (item.matches(":hover")) {
            renderArc = true
        }
    }

    if (renderArc){
        let theta = -(Math.PI*(timer.timeLeft/(timer.targetTime)))
        if (timer.timeLeft == 0) {
            theta = 0
        }
        let c = [canvas.width/2, canvas.height-10]
        let l = 25

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.beginPath()
        ctx.arc(c[0], c[1], 120, theta, 0, false)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 25
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.arc(c[0], c[1], 130, -Math.PI, theta, false)
        ctx.moveTo(c[0]-110, c[1])
        ctx.lineTo(c[0]-130, c[1])
        ctx.arc(c[0], c[1], 110, -Math.PI, theta, false)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 3
        ctx.fillStyle = "white"
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(c[0]-((120-l)*Math.cos(Math.PI-theta)), c[1] + ((120-l)*Math.sin(Math.PI-theta))) //P1
        ctx.lineTo(c[0]-((120+l)*Math.cos(Math.PI-theta)), c[1] + ((120+l)*Math.sin(Math.PI-theta))) //P2
        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        ctx.stroke()
        ctx.closePath()
    }

    let minutes = Math.floor(timer.timeLeft/60000)
    let seconds = Math.floor((timer.timeLeft%60000)/1000)
    headerTxt.innerHTML = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds: seconds}`

    if (!timeInputSelected){
        minsTxt.innerHTML = minutes < 10 ? "0" + minutes  : minutes
        secsText.innerHTML = seconds < 10 ? "0" + seconds  : seconds
    }



    requestAnimationFrame(mainLoop) //loop animation
}

requestAnimationFrame(mainLoop)