const elements = document.getElementsByClassName('autocomplete-input')

let allHandlers = []

function upperCaseify(text) {
    text = text.split("")
    for (let i = 0; i<text.length; i++) {
        if (text[i-1] == " " || i == 0) {
            text[i] = text[i].toUpperCase()
        }
    }
    text = text.join("")
    return text
}

class AutoHandler {
    constructor(element, inputList, creatable) {
        console.log("HELLO", this.list)
        this.element = element
        this.input = element.children[0]
        this.space = element.children[1]
        this.list = inputList
        this.selected = false
        this.creatable = creatable

        this.init()
    }

    init () {
        this.hideSpace()

        this.input.addEventListener("keyup", () => {
            this.selected = false //mark it as non-selected so form cannot be submitted

            //detect matching items in list
            let query = this.input.value.toLowerCase()
            let result = []

            for (item of this.list) {
                if (item.toLowerCase().includes(query)) {
                    result.push(item)
                    if (result.length >= 10) break
                }
            }

            //sort result by ones that match, otherwise keep it
            result.sort((a, b) => {
                const aMatch = a.toLowerCase().startsWith(query)
                const bMatch = b.toLowerCase().startsWith(query)

                if (aMatch && !bMatch) return -1
                if (!aMatch && bMatch) return 1
                return 0
            });
            
            if (((result.length == 0 && !this.creatable) || this.input.value == "")) {
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

            if (this.creatable) {

                let upperQuery = upperCaseify(this.input.value)
                
                //render html
                let newEl = document.createElement("div")
                newEl.classList.add("auto-item")
                newEl.style.fontStyle = "italic"
                console.log(this.input.innerText)
                newEl.innerText = `Add ${upperQuery}`
                newEl.addEventListener("click", () => {
                    this.collapse(upperQuery)
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
}

async function loadData(path) {
    try {
        const res = await fetch(path)
        return await res.json()
    }
    catch (err) {
        console.log(err)
    }
    
}

async function createHandlers() {
    const countries =  await loadData("../resources/countries.json")
    const schools = ["St Olave's Grammar School"]
    const subjects = ["Maths", ]


    for (el of elements) {
        let inplist = []
        let creatable = false
        if (el.classList.contains("school")) {
            inplist = schools
            creatable = true
        }
        else if (el.classList.contains("subject")) {
            inplist = subjects
        }
        else if (el.classList.contains("country")) {
            inplist = countries
        }
        if (inplist.length != 0) {
            allHandlers.push(new AutoHandler(el, inplist, creatable))
        }
    }
}

createHandlers()