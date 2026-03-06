import { sendDataRequest } from "./utils.js"

let studyTime
let restTime

async function loadData() {
    const errbar = document.getElementsByClassName("error")[0]
    console.log(errbar, "hey")

    const user = await sendDataRequest(`/api/user/data/self`, errbar, window, "")

    document.querySelector(".content-wrapper").innerHTML = `
    <div class="div1">
        <div class="usernames">
            <div class="username">${user.username}</div>
            <a href="/profile">
                <div class="tag">@${user.user_tag}</div>
            </a>
        </div>
    </div>
    <div class="actions" id="special">
        <h3>Study timer preferences</h3>
        <div class="notifs action-item"> Study time: <input type="number" class="likes-inp study" value="${user.preference_data[0]}">m</div>
        <div class="notifs action-item"> Rest time: <input type="number" class="likes-inp rest" value="${user.preference_data[1]}">m</div>
    </div>
    `

    studyTime = document.querySelector(".study") //get input fields
    restTime = document.querySelector(".rest")

    studyTime.addEventListener("change", async function() {
        //validate
        if (isNaN(Number(studyTime.value))) {
            studyTime.value = ""
            return
        }

        const number = Number(studyTime.value)
        if (number>90){studyTime.value = "90"}
        if (number<=0){studyTime.value = ""; return}

        await sendDataRequest(`/api/preferences/update/study/${studyTime.value}`, errbar, window, "")
    })

    restTime.addEventListener("change", async function() {
        //validate
        if (isNaN(Number(restTime.value))) {
            restTime.value = ""
            return
        }

        const number = Number(restTime.value)
        if (number>90){restTime.value = "90"}
        if (number<=0){restTime.value = ""; return}

        await sendDataRequest(`/api/preferences/update/rest/${restTime.value}`, errbar, window, "")
    })
}

loadData()