export async function loadData(path) {
    try {
        const res = await fetch(path)
        return await res.json()
    }
    catch (err) {
        console.log(err)
    }
}

export function upperCaseify(text) {
    text = text.split("")
    for (let i = 0; i<text.length; i++) {
        if (text[i-1] == " " || i == 0) {
            text[i] = text[i].toUpperCase()
        }
    }
    text = text.join("")
    return text
}

export async function getSubjectNames(val) {
    return (await fetch(`/api/subjects/names/${val}`)).json()
}

export async function getSchoolNames(){
    return (await fetch(`/api/schools/names`)).json()
}

export async function getTopicNames(val){
    return (await fetch(`/api/topics/names/${val}`)).json()
}

export function reportInvalid(el, message, e) {
    el.setCustomValidity(message)
    el.reportValidity()
    e.preventDefault()
}

 export function success(errbar, message) {
    errbar.innerHTML = message
    errbar.style.color = "green"
    errbar.style.opacity = "1"
    setTimeout(() => {
        errbar.style.opacity = "0"
    }, 3000)
 }

 export function warn(errbar, message) {
    errbar.style.color = "red"
    errbar.innerHTML = message
    errbar.style.opacity = "1"
    setTimeout(() => {
        errbar.style.opacity = "0"
    }, 3000)
 }

 export function generateStarHTML(val) {
    const starEmpty = `<img src="/resources/star_empty.PNG" alt="" class="icon">`
    const starFull = `<img src="/resources/star_full.PNG" alt="" class="icon">`

    if (isNaN(val)) val = 0
    
    val = Math.floor(val)
    let result = ``

    for (let i = 0; i<val; i++) {
        result += starFull   
    }
    for (let i = 0; i<(5-val); i++) {
        result += starEmpty
    }
    return result
}

export async function sendDataRequest(route, errbar, window, successMsg) {
    const res = await fetch(route)

    const result = await res.json()

    if (result.redirect) { //redirect if a link sent back
        window.location.href = result.redirect
    }

    if (!res.ok) { //not successful
        if (result.error) {
            warn(errbar, result.error)
        }
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
        return
    }

    if (successMsg != "") success(errbar, successMsg)

    return result
}

export async function sendFormData(route, form, errbar, window, successMsg, send_result) {
    const formdata = new FormData(form)
    const data = Object.fromEntries(formdata.entries())

    const res = await fetch(route, { //send data
        method:form.method,
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(data),
    })

    const result = await res.json()

    //display response

    if (!res.ok) { //not successful
        warn(errbar, result.error)
        return
    }
    
    if (successMsg != "") success(errbar, successMsg)

    console.log(result)

    setTimeout(() => {    
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
    }, 1000)

    if (send_result) return result
}

export async function sendData(route, data, errbar, window, successMsg, send_result) {    
    const res = await fetch(route, { //send data
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(data),
    })

    const result = await res.json()

    //display response

    if (!res.ok) { //not successful
        warn(errbar, result.error)
        return
    }
    
    if (successMsg != "") success(errbar, successMsg)

    setTimeout(() => {    
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
    }, 1000)

    if (send_result) return result
}


export async function submitSearchData(form, errbar, window, successMsg, send_result,  history, type, deleteOld) {
    const formdata = new FormData(form)

    const params = new URLSearchParams(formdata)
    if (deleteOld) history.replaceState(null, "", `/search/?${params.toString()}`) //only change url if new search has been done


    let res 

    if (type == "q") {
        res = await fetch(`/api/search/question/?${params.toString()}`)
    }
    else if (type == "c") {
        res = await fetch(`/api/search/collection/?${params.toString()}`)
    }
    else if (type == "lb") {
        res = await fetch(`/api/lb/?${params.toString()}`)
    }

    const result = await res.json()

    //display response

    if (!res.ok) { //not successful
        warn(errbar, result.error)
        return
    }
    
    if (successMsg != "") success(errbar, successMsg)

    setTimeout(() => {    
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
    }, 1000)

    if (send_result) return result
}

export function convertStudyStage(val) {
    if (!isNaN(Number(val))) {
        if (val == 0 || val == "0") {
            return "GCSE"
        }
        if (val == 1 || val == "1") {
            return "A-level"
        }
        if (val == 2 || val == "2") {
            return "University+"
        }
    }
    else {
        if (val == "GCSE") {
            return 0
        }
        if (val == "A-level") {
            return 1
        }
        if (val == "University+") {
            return 2
        }
    }
}

export function convertTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Official"
    }
    else if (Number(val) == 2) {
        return "Looking for solution"
    }
    else if (val == "solution" || val == "Looking for solution"){
        return 2
    }
    else if (val == "user" || val == "User-made") {
        return 1
    }
    else if (val == "official" || val == "Official") {
        return 0
    }
    else{
        console.log("TAG CONVERSION ERROR")
    }
}

export function convertCollectionTag(val) {
    if (Number(val) == 1) {
        return "User-made"
    }
    else if (Number(val) == 0) {
        return "Past paper"
    }
    else if (val == "paper" || val == "Past paper") {
        return 0
    }
    else if (val == "user" || val == "User-made") {
        return 1
    }
    else{
        console.log("TAG CONVERSION ERROR")
    }
}

export function likeConverter(val) { //convert overall like consensus from value
    val = Number(val)
    let src
    if (val > 10) {
        src = "/resources/smile.PNG"
    }
    if (val < -10) {
        src =  "/resources/frown.PNG"
    }
    else {
        src =  "/resources/neutral.PNG"
    }
    return `<img src=${src} class="icon" id="-1">`
}

export async function updatePaperNum(value, paper_field, errbar, window) { //generate HTML for paper number selects
    if (!value) return
    const paperNum = Number(await sendDataRequest(`/api/subject/papers/${value}`, errbar, window, ""))
    paper_field.innerHTML = '<option value="-1" style="display: none;" selected>paper number</option>'
    for (let i = 1; i<paperNum+1; i++) {
        paper_field.innerHTML += `<option value="${i}" >Paper ${i}</option>`
    }
}

export function timeConverter(time) {
    const minute = [1000*60, "m"]
    const hour = [60*minute[0], "h"]
    const day = [24*hour[0], "d"]
    const times = [day, hour, minute]

    let result = ""

    for (let t of times) {
        
        let number = Math.floor(time/t[0]) //figure out how many time units are in specified time
        time -= number*t[0] //calculate time left over

        if (number > 0) { //add to result
            result += String(number) + t[1] + " "
        }

    }

    return result == "" ? "0m" : result
}

export function getSubjectColour(subjectID) {
    const subjectColours = {
        1: "hsla(0, 100%, 70%, 0.3)",     
        2: "hsla(270, 100%, 70%, 0.3)",   
        3: "hsla(120, 100%, 70%, 0.3)",   
        4: "hsla(30, 100%, 70%, 0.3)",     
        5: "hsla(210, 100%, 70%, 0.3)",     
        6: "hsla(60, 100%, 70%, 0.3)",      
        7: "hsla(0, 100%, 70%, 0.3)",     
        8: "hsla(120, 100%, 70%, 0.3)",   
        9: "hsla(30, 100%, 70%, 0.3)",     
        10: "hsla(210, 100%, 70%, 0.3)",   
        11: "hsla(270, 80%, 75%, 0.3)",    
        13: "hsla(180, 100%, 70%, 0.3)",    
        14: "hsla(300, 100%, 70%, 0.3)"     
    }
    return subjectColours[subjectID]
}