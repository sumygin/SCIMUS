let sources = []

//first, need to generate sources for all carousels
//then, need to generate amount of carousels needed and then put them onto the page

class Carousel {
    constructor(source, name, el) {
        this.source = source
        this.name = name
        this.el = el
        this.w = parseFloat(getComputedStyle(this.el).width)
        this.totalw = this.el.scrollWidth - (this.w)

        this.pos = 0
        this.children = []

        this.left = this.el.parentElement.parentElement.children[0]
        this.right = this.el.parentElement.parentElement.children[1]
        this.mask = this.el.parentElement

        if (this.w > this.totalw) {
            this.right.style.transition = "none"
            this.right.style.opacity = 0
        }
        else {
            this.right.addEventListener("click", () => {
                if (!this.animating) {
                    this.animating = true
                    this.pos = Math.min(this.pos+(this.w*0.8), this.totalw)
                    this.el.style.transform = `translateX(${-this.pos}px)` //translate width

                    //left arrow styles
                    this.mask.style.marginLeft = "3em"
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
        }

        this.animating = false

        

        this.left.addEventListener("click", () => {
            if (!this.animating) {
                this.animating = true
                this.pos = Math.max(this.pos-(this.w*0.8), 0)
                this.el.style.transform = `translateX(${-this.pos}px)` //translate width

                //right arrow styles
                this.mask.style.marginRight = "3em"
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
    
    generateChildren() {
        //code to fetch data of questions from their ids
        for (q of this.source) {
            this.children.push() //push question data
        }
    }

    generate() {
        for (q in children) {
            //generate HTML for individual question
        }
        //add generated HTML to itself
    }

    update() {
        //this.el.style.transform = `translateX(${this.pos}px)`
    }
}

class CarQuestion {
    constructor(id){
        this.id = id
    }
}

window.onresize = function() {
    
}

let cars = document.getElementsByClassName("car-content")
let carouselList = []
for (c of cars) {
    carouselList.push(new Carousel([], "", c))
}
