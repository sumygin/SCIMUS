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
const headerTxt = document.getElementById("header-timer-text")

user = {
    workTime:600,
    restTime:60,
    timeStudiedToday:0,
}
//do later -> fetch from user data


class Timer {
    constructor(targetTime, workTime=0, restTime=0, startTime=0, mode = "study", running=false, pauseTime=0, totalPauseTime=0) {
        this.targetTime = targetTime
        this.startTime = startTime
        this.pauseTime = pauseTime
        this.workTime = workTime
        this.restTime = restTime
        this.mode = mode
        this.running = running
        this.totalPauseTime = totalPauseTime
        this.timeLeft = targetTime
    }

    play() {
        if (!this.running) {
            this.running = true
            if (this.pauseTime == 0) { //if starting timer for first time in session
                this.startTime = Date.now()
            }

            else {
                this.totalPauseTime += Date.now()-this.pauseTime
            }
        }
        else {
            this.pauseTime = Date.now()
            this.runnning = false
        }
    }
}

let timer = new Timer(30*60*1000)
console.log(timer)

playBtn.addEventListener("click", function() {
    if (timer.timeLeft > 0) {
        timer.play()
        if (timer.running) {
            this.innerHTML = "▶️"
        }
        else {
            this.innerHTML = "⏸️"
        }
    }
    else {
        console.log(timer.timeLeft)
    }
})

function mainLoop() {

    if (timer.running) {
        timer.timeLeft = timer.startTime == 0 ? timer.targetTime : timer.targetTime-(Date.now() 
        - timer.startTime - timer.totalPauseTime)
    }

    for (item of tHover) //thover has 2 elements
        if (item.matches(":hover")) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.beginPath()
            
            ctx.arc(canvas.width/2, canvas.height-10, 120, -Math.PI, 0, false)
            ctx.strokeStyle = "black"
            ctx.lineWidth = 20
            ctx.stroke()
            break
        }

    let minutes = Math.floor(timer.timeLeft/60000)
    let seconds = Math.floor((timer.timeLeft%60000)/1000)
    let toptext = `${minutes < 10 ? minutes + "0" : minutes}:${seconds < 10 ? seconds + "0" : seconds}`
    headerTxt.innerHTML = toptext
    minsTxt.innerHTML = minutes < 10 ? minutes + "0" : minutes
    secsText.innerHTML = seconds < 10 ? seconds + "0" : seconds

    requestAnimationFrame(mainLoop) //loop animation
}

requestAnimationFrame(mainLoop)