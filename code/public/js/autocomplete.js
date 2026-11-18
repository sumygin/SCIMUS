import {loadData, upperCaseify, getSchoolNames, getTopicNames, getSubjectNames, updatePaperNum} from './utils.js'

const errbar = document.getElementsByClassName("error")[0]

const elements = document.getElementsByClassName('autocomplete-input')
const stageSelects = document.getElementsByClassName("stageFIELD")
const subjectSelects = document.getElementsByClassName("subjectFIELD")
const topicSelects = document.getElementsByClassName("topicFIELD")

const paperFields = document.getElementsByClassName("paperFIELD")

let dependencies = []
let counters = {subject:0, topic:0}

let allHandlers = []


class AutoHandler {
    constructor(element, inputList, creatable, type, fields) {
        this.element = element //link to original html element
        this.input = element.children[0] //input field
        this.space = element.children[1] //space in which to display autocomplete options
        this.list = inputList //input list to use

        this.selected = false //whether the field has been clicked on

        this.creatable = creatable //whether the field can have new options added
        this.type = type //type of field
        this.selectMultiple = this.element.classList.contains("multiple") //whether you can select multiple (subjects on register page)

        this.fields = fields //additional fields to update subject/topic/paper number

        if (this.selectMultiple) {
            this.multiSpace = document.getElementById("multispace")
        }

        this.init()
    }

    init () {
        this.hideSpace()

        this.input.setAttribute("autocomplete", "off") //browser suggestions would cover ours

        const showMatches = () => {
            this.selected = false //mark it as non-selected so form cannot be submitted

            //detect matching items in list
            let query = this.input.value.toLowerCase()
            let result = []

            for (const item of this.list) {
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
            for (const item of result) { //ADD MATCHING RESULTS
                let newEl = document.createElement("div")
                newEl.classList.add("auto-item")
                newEl.innerText = item
                newEl.addEventListener("click", () => {
                    this.collapse(newEl.innerText)
                })
                this.space.appendChild(newEl)
            }

            if (this.creatable && this.input.value.trim() != "" && !this.list.includes(upperCaseify(this.input.value))) { //ADD EXTRA "ADD" RESULT

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

            if (this.space.children.length == 0) this.hideSpace()
        }

        //a close that is still waiting from the last blur mustn't shut the list that is opening now
        const show = () => {
            clearTimeout(this.hideTimer)
            showMatches()
        }

        this.input.addEventListener("input", show)
        this.input.addEventListener("focus", show)
        this.input.addEventListener("blur", () => {
            clearTimeout(this.hideTimer)
            this.hideTimer = setTimeout(() => this.hideSpace(), 200) //small delay so a click on an option still counts
        })

        document.addEventListener("click", (e) => { //close when clicked off of
            if (e.target != this.input) {
                this.hideSpace()
            }
        })

        if (this.type == "subject") {
            this.input.addEventListener("subjectLoaded", (e) => {
                
                this.updateTopicList(this.input.value)
            })
        }

        if (this.fields?.stageSelect) { //detect change in study stage and update
            this.fields.stageSelect.addEventListener("change", async () => {
                if (this.fields.stageSelect.value == -1) { //if invalid/not selected, delete subject list
                    this.list.length = 0
                }
                else if (["0", "1", "2", 0, 1, 2].includes(this.fields.stageSelect.value)){
                    if (this.selectMultiple) { //if this has a multispace (register page) clear it
                        this.multiSpace.innerHTML = ""
                    }

                    this.list.length = 0
                    this.list.push(...await getSubjectNames(this.fields.stageSelect.value))
                }
            })
        }
    }

    async updateTopicList(value) { //function to update the topic list of the relevant topic field
        if (this.fields?.topicList != undefined && value != "" && value) {
            this.fields.topicList.length = 0
            this.fields.topicList.push(...await getTopicNames(value))
        }
    }

    collapse(text) { //response to an option being selected
        this.selected = true //mark on selected
        this.hideSpace()

        if (this.selectMultiple) { //if multiple subjects can be selected
            this.input.value = ""
            if (!this.multiSpace.textContent.includes(text)) { //create new element to be pushed to space
                let newEl = document.createElement("div")
                newEl.classList.add("sbj")

                const removeBtn = document.createElement("button")
                removeBtn.type = "button" //otherwise it would submit the form
                removeBtn.classList.add("x")
                removeBtn.innerText = "×"
                removeBtn.addEventListener("click", () => {
                    newEl.remove()
                })

                newEl.append(`${text} `, removeBtn)
                this.multiSpace.appendChild(newEl)
            }
        } else {
            this.input.value = text

            if (this.type == "subject") { //if this is a subject handler, then update the possible topic list
                this.updateTopicList(this.input.value)
            }

            if (this.type == "subject" && this.fields?.paper_field) { //if there is a field to enter paper number, update its HTML
                updatePaperNum(this.input.value, this.fields?.paper_field, errbar, window)
            }
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



async function createHandlers() { //create all handlers depending on their class
    if (stageSelects) {
        for (const select of stageSelects) { //for each stage select push a new dictionary
            dependencies.push({
                stage:select,
                subjectList:[],
                topicList:[],
                paper_field:undefined
            })
        }
    }

    if (subjectSelects) { //add subject fields to correct dictionary
        for (let i = 0; i<subjectSelects.length; i++) {
            dependencies[i].subjectList = []
        }
    }

    if (topicSelects) { //add topic fields to correct dictionary
        for (let i = 0; i<topicSelects.length; i++) {
            dependencies[i].topicList = []
        }
    }

    if (paperFields) { //add paper fields to correct dictionary
        for (let i = 0; i<paperFields.length; i++) {
            dependencies[i].paper_field = paperFields[i]
        }
    }

    for (const el of elements) {
        //define variables
        let inplist = []
        let creatable = el.classList.contains("creatable")
        let type = ""
        let fields

        if (el.classList.contains("school")) { //skls
            inplist = await getSchoolNames()
            type = "school"
        }

        else if (el.classList.contains("country")) { //countries
            inplist = await loadData("/resources/countries.json")
            type = "country"
        }

        else if (el.classList.contains("subject")) {
            if (!stageSelects) {
                throw SyntaxError("stage selector undefined")
            }

            const curID = counters.subject //save which subject field this is (e.g. 0th, 1st, etc)
            counters.subject++ //inc id

            fields = { //prepare fields dict to be used inside the object
                stageSelect:dependencies[curID].stage,
                topicList:dependencies[curID].topicList,
                paper_field:dependencies[curID].paper_field
            }

            inplist = dependencies[curID].subjectList
            type = "subject"
        }

        else if (el.classList.contains("topic")) {
            if (!subjectSelects) {
                throw SyntaxError("subject selector undefined")
            }

            const curID = counters.topic //save which topic field this is (e.g. 0th, 1st, etc)
            counters.topic++ //inc id

            inplist = dependencies[curID].topicList
            type = "topic"
        }

        allHandlers.push(new AutoHandler(el, inplist, creatable, type, fields))
    }
}

createHandlers()
