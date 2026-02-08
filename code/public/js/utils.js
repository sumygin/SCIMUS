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