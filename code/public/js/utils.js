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

    success(errbar, successMsg)

    return result
}

export async function sendFormData(route, form, errbar, window, successMsg) {
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
    
    success(errbar, successMsg)

    setTimeout(() => {    
        if (result.redirect) { //redirect if a link sent back
            window.location.href = result.redirect
        }
    }, 1000)
}