import { sendDataRequest, timeConverter } from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]

//fetch ID and check if valid
let uID = window.location.href.split("/profile")[1].substring(1)
if (uID == "") uID = -1

async function loadData() {
    const user = await sendDataRequest(`/api/user/data/${uID}`, errbar, window, "")

    document.querySelector("main").innerHTML = `
    <div class="content-wrapper">
            <div class="div1">
                <div class="usernames">
                    <div class="username">${user.username}</div>
                    <a href="/profile/${user.user_tag}"><div class="tag">@${user.user_tag}</div></a>
                </div>
                <div class="links">
                    <a href="/search/?creator=${user.user_tag}&searchType=q">Go to created questions</a>
                    <a href="/search/?creator=${user.user_tag}&searchType=c">Go to created collections</a>
                </div>
            </div>
            <div class="stats">
                <div class="skl">${user.school}</div>
                <div class="country">${user.country}</div>
                <div class="date">User since ${user.created_at.split(" at")[0]}</div>
                <br>
                <div class="today-studied">${timeConverter(user.studied_today)} total studied today</div>
                <div class="total-studied">${timeConverter(user.studied_total)} total studied all-time</div>
                <div class="q-created">${user.created_total} questions created</div>
                <div class="q-completed">${user.completed_total} questions completed</div>
                <div class="avg-likes">${user.total_likes} total like rating</div>
            </div>
        </div>

        <div class="error"></div>`
}

loadData()