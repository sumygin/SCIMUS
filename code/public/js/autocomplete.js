const elements = document.getElementsByClassName('autocomplete-input')

let allHandlers = []

class AutoHandler {
    constructor(element, inputList, creatable) {
        this.element = element
        this.input = element.children[0]
        this.space = element.children[1]
        this.list = inputList
        this.selected = false
        this.init()
        this.creatable = creatable
    }

    init () {
        this.hideSpace()

        this.input.addEventListener("keyup", () => {
            this.selected = false //mark it as non-selected so form cannot be submitted
            //detect matching items in list
            let query = this.input.value.toLowerCase()
            let result = []

            for (item of this.list) {
                if (item.toLowerCase().startsWith(query)) {
                    result.push(item)
                    if (result.length >= 10){
                        break
                    }
                }
            }

            if (result.length == 0 && this.creatable) {
                //clear html
                this.space.innerHTML = ""
                this.showSpace()
                
                //render html
                let newEl = document.createElement("div")
                newEl.classList.add("auto-item")
                newEl.style.fontStyle = "italic"
                newEl.innerText = `Add ${item}...`
                newEl.addEventListener("click", () => {
                    this.add(newEl.innerText)
                })
                this.space.appendChild(newEl)
            }

            if (result.length == 0 || this.input.value == "") {
                this.hideSpace()
                return 
            }

            //clear html
            this.space.innerHTML = ""
            this.showSpace()

            //render html
            for (item of result) {
                let newEl = document.createElement("div")
                newEl.classList.add("auto-item")
                newEl.innerText = item
                newEl.addEventListener("click", () => {
                    this.collapse(newEl.innerText)
                })
                this.space.appendChild(newEl)
            }
        })

        document.addEventListener("click", (e) => {
            if (e != this.space) {
                this.hideSpace()
            }
        })
    }

    collapse (text) {
        this.input.value = text
        this.selected = true
        this.hideSpace()
    }

    hideSpace () {
        this.space.innerHTML = ""
        this.space.style.display = "none"
    }

    showSpace() {
        this.space.style.display = "flex"
    }

    add(text) {

    }

}

async function loadData(path) {
    const res = await fetch(path)
    return await res.json()
}

async function createHandlers() {
    const countries = await loadData("../resources/countries.json")


    for (el of elements) {
        let inplist = []
        if (el.classList.contains("school")) {

        }
        else if (el.classList.contains("subject")) {

        }
        else if (el.classList.contains("country")) {
            inplist = countries
        }
        if (inplist.length != 0) {
            allHandlers.push(new AutoHandler(el, inplist, false))
        }
    }
}

createHandlers()