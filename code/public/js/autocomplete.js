const elements = document.getElementsByClassName('autocomplete-input')
const stageSelect = document.getElementById("stage")
let subjectList = []

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
    constructor(element, inputList, creatable, type) {
        this.element = element
        this.input = element.children[0]
        this.space = element.children[1]
        this.list = inputList
        this.selected = false
        this.creatable = creatable
        this.type = type
        this.selectMultiple = this.element.classList.contains("multiple")

        if (this.selectMultiple) {
            this.multiSpace = document.getElementById("multispace")
        }

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
            
            if (((result.length == 0 && !this.creatable))) {
                this.hideSpace()
                return
            }

            //clear html
            this.space.innerHTML = ""
            this.showSpace()

            //render html
            for (item of result) { //ADD MATCHING RESULTS
                let newEl = document.createElement("div")
                newEl.classList.add("auto-item")
                newEl.innerText = item
                newEl.addEventListener("click", () => {
                    this.collapse(newEl.innerText)
                })
                this.space.appendChild(newEl)
            }

            if (this.creatable && !this.list.includes(this.query)) { //ADD EXTRA "ADD" RESULT

                let upperQuery = upperCaseify(this.input.value)
                
                //render html
                let newEl = document.createElement("div") //create new element for space
                newEl.classList.add("auto-item")
                newEl.style.fontStyle = "italic"

                newEl.innerText = `Add ${upperQuery}`

                newEl.addEventListener("click", () => { //select eventlistener
                    this.collapse(upperQuery)
                })
                this.space.appendChild(newEl)
            }
    
        })

        document.addEventListener("click", (e) => { //close when clicked off of
            if (e != this.space) {
                this.hideSpace()
            }
        })

        
    }

    collapse (text) { //response to an option being selected
        this.selected = true //mark on selected
        this.hideSpace()

        if (this.selectMultiple) { //if multiple subjects can be selected
            this.input.value = ""
            if (!this.multiSpace.innerText.includes(text)) { //create new element to be pushed to space
                let newEl = document.createElement("div")
                newEl.classList.add("sbj")
                newEl.innerHTML = `${text} <button class="x">x</button>`
                newEl.querySelector(".x").addEventListener("click", () => {
                    newEl.remove()
                })
                this.multiSpace.appendChild(newEl)
            }
        } else {
            this.input.value = text
        }
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

async function getSubjects(val) {
    return (await fetch(`api/subjects/names/${val}`)).json()
}

async function getSchools(){
    return (await fetch(`api/schools/names`)).json()
}

async function createHandlers() {

    for (el of elements) {
        let inplist = []
        let creatable = false
        let type = ""
        if (el.classList.contains("school")) {
            inplist = await getSchools()
            creatable = true
            type = "school"
        }
        else if (el.classList.contains("subject")) {
            if (!stageSelect) {
                throw SyntaxError("stage selector undefined")
            }
            inplist = subjectList
            type = "subject"
        }
        else if (el.classList.contains("country")) {
            inplist = await loadData("../resources/countries.json")
            type = "country"
        }
        allHandlers.push(new AutoHandler(el, inplist, creatable, type))
    }
}

stageSelect.addEventListener("change", async () => {
    if (stageSelect.value == -1) {
        subjectList.length = 0
    }
    else {
        for (handler of allHandlers) {
            if (handler.type == "subject" && handler.selectMultiple) {
                handler.multiSpace.innerHTML = ""
            }
        }
        subjectList.length = 0
        subjectList.push(...await getSubjects(stageSelect.value))
    }
})

createHandlers()