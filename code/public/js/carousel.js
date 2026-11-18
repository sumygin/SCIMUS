import { generateStarHTML, getSubjectColour, sendDataRequest, escapeHTML, emptyState } from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]

let carousels = []


class Carousel {
    constructor(name, el) { //construct object
        this.name = name
        this.el = el

        this.animating = false
        

        this.pos = 0
        this.children = []

        this.left = this.el.parentElement.parentElement.children[0]
        this.right = this.el.parentElement.parentElement.children[1]
        this.mask = this.el.parentElement

        this.right.addEventListener("click", () => {
                if (!this.animating) {
                    this.animating = true
                    this.pos = Math.min(this.pos+(this.w*0.8), this.totalw)
                    this.el.style.transform = `translateX(${-this.pos}px)` //translate width

                    //left arrow styles
                    this.mask.style.marginLeft = "1.5em"
                    setTimeout(() => {
                        this.mask.style.webkitMaskImage = "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)";
                        this.mask.style.maskImage = "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)";
                    }, 250)
                    setTimeout(() => { //show left arrow
                        this.left.style.opacity = 1
                        
                    }, 500)

                    //right arrow styles
                    if (this.pos == this.totalw) {
                        this.mask.style.marginRight = "0"
                        this.right.style.opacity = 0
                        setTimeout(() => {
                            this.mask.style.webkitMaskImage = "linear-gradient(to right, transparent, black 5%)";
                            this.mask.style.maskImage = "linear-gradient(to right, transparent, black 5%)";
                        }, 250)
                    }

                    setTimeout(() => {
                        this.animating = false
                    }, 1000)
                }
            })
        
        this.left.addEventListener("click", () => {
            if (!this.animating) {
                this.animating = true
                this.pos = Math.max(this.pos-(this.w*0.8), 0)
                this.el.style.transform = `translateX(${-this.pos}px)` //translate width

                //right arrow styles
                this.mask.style.marginRight = "1.5em"
                setTimeout(() => {
                    this.mask.style.webkitMaskImage = "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)";
                    this.mask.style.maskImage = "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)";
                }, 250)
                setTimeout(() => { //show left arrow
                    this.right.style.opacity = 1
                }, 500)

                if (this.pos == this.totalw) {
                    this.right.style.opacity = 0
                }

                //left arrow styles
                if (this.pos == 0) {
                    this.mask.style.marginLeft = "0"
                    this.left.style.opacity = 0
                    setTimeout(() => {
                        this.mask.style.webkitMaskImage = "linear-gradient(to left, transparent, black 5%)";
                        this.mask.style.maskImage = "linear-gradient(to left, transparent, black 5%)";
                    }, 250)
                }
                setTimeout(() => {
                    this.animating = false
                }, 1000)
            }
        })

        
        }

    setWidth() {
        this.w = this.el.clientWidth
        this.totalw = this.el.scrollWidth - this.el.clientWidth

        if (this.totalw <= 0) {
            this.right.style.transition = "none"
            this.right.style.opacity = 0
        }
    }


updateArrowVisibility() {
    // hide left arrow if at start
    this.left.style.opacity = (this.pos <= 0) ? 0 : 1

    // hide right arrow if content fits container
    this.right.style.opacity = (this.totalw <= 0 || this.pos >= this.totalw) ? 0 : 1
}
}
    

function carTemplate(car) {
    const newCar = document.createElement("div") //new carousel element
    newCar.classList.add("carousel")

    let name = escapeHTML(car.name)
    if (car.href) { //generate link for title if applicable
        name = `<a href="${escapeHTML(car.href)}">${name}</a>`
    }

    newCar.innerHTML = `
            <div class="car-title">${name}</div>
            <div class="car-container">
                <img class="img1" src="/resources/arrow.png" alt=""><img class="img2" src="/resources/arrow.png" alt="">
                <div class="car-mask">
                    <div class="car-content">
                        
    
                    </div>
                </div>
            </div>`

    const carContent = newCar.querySelector(".car-content") //display space to insert into
    for (const q of car.questions) { //insert questions into hTML
        carContent.appendChild(qTemplate(q))
    }

    carousels.push(new Carousel(car.name, carContent))
    return newCar
}

function qTemplate(q) {
    const newQ = document.createElement("a") //create question element
    newQ.href = `/question/${Number(q.question_id)}`
    newQ.classList.add("car-question")

    let emoji //decide like rating emoji depending on likes
    if (q.like_rating < -10) {
        emoji = "frown"
    }
    else if (q.like_rating > 10) {
        emoji = "smile"
    }
    else {
        emoji = "neutral"
    }

    newQ.innerHTML = `
                            <div class="car-q-header">${escapeHTML(q.subject)}<br><div class="topic">${escapeHTML(q.topic)}</div></div>
                                <div class="car-q-content">
                                    <div class="car-q-title">${escapeHTML(q.name)}</div>
                                    <div class="car-q-rating">${generateStarHTML(q.avg_diff_rating)}</div>
                                    <div class="car-q-info"><img src="/resources/view.PNG" alt="" class="icon">${Number(q.views)}   <img src="/resources/${emoji}.PNG" alt="" class="icon"> ${Number(q.like_rating)}</div>
                                </div>
                            `
    newQ.querySelector(".car-q-content").style.backgroundColor = getSubjectColour(q.subject_id) //colours

    return newQ
}

const main = document.querySelector(".globalCarContainer") //get container

//grey placeholder rows while the questions load
for (let i = 0; i < 3; i++) {
    main.insertAdjacentHTML("beforeend", `
        <div class="carousel skeleton-carousel" aria-hidden="true">
            <div class="skeleton skeleton-title"></div>
            <div class="car-container">
                <div class="skeleton-row">${'<div class="skeleton skeleton-card"></div>'.repeat(8)}</div>
            </div>
        </div>`)
}

//first, need to generate sources for all carousels
const carouselData = await sendDataRequest("/api/homepage", errbar, window, "")

main.querySelectorAll(".skeleton-carousel").forEach(el => el.remove())

//then, need to generate amount of carousels needed and then put them onto the page
for (const car of carouselData || []) { //insert into container
    if (car.questions.length > 0) {
        main.appendChild(carTemplate(car))
    }
}

if (!carouselData) {
    main.appendChild(emptyState("Couldn't load questions right now. Try refreshing the page."))
}
else if (main.children.length == 0) {
    main.appendChild(emptyState("No questions yet"))
}

function setWidths() { //reset carousel widths on resize
    for (const carObj of carousels) {
        carObj.setWidth()
        carObj.updateArrowVisibility()
    }
}

window.addEventListener("resize", setWidths)

setWidths()
