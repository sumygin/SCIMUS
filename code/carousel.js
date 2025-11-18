let sources = []

//first, need to generate sources for all carousels
//then, need to generate amount of carousels needed and then put them onto the page

class Carousel {
    constructor(source, name, el) {
        this.source = source
        this.name = name
        this.el = el
        console.log(this.el)

        this.pos = 0
        this.children = []

        this.left = this.el.parentElement.children[0]
        this.right = this.el.parentElement.children[1]
        console.log(this.left, this.right)
        this.right.addEventListener("click", function() {
            alert("RIGHT")
            this.el.style.transform = translateX("10px") 
            this.el.style.color = "red"
            this.el.innerHTML = ""
        })
        this.left.style.display = "hidden"
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

let cars = document.getElementsByClassName("car-content")
let carouselList = []
for (c of cars) {
    carouselList.push(new Carousel([], "", c))
}
