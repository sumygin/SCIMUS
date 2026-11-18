import { sendDataRequest, timeConverter, escapeHTML, plural, loader } from "./utils.js"

const errbar = document.getElementsByClassName("error")[0]

//fetch tag from the url
const uID = decodeURIComponent(window.location.pathname.split("/profile/")[1] || "")

async function loadData() {
    if (uID == "") {
        window.location.href = "/profile"
        return
    }

    document.querySelector(".content-wrapper").replaceChildren(loader())

    const user = await sendDataRequest(`/api/user/data/${encodeURIComponent(uID)}`, errbar, window, "")

    if (!user) {
        document.querySelector(".content-wrapper").innerHTML = `
            <div class="div1">
                <div class="usernames">
                    <div class="tag">User not found</div>
                </div>
            </div>`
        return
    }

    const tag = escapeHTML(user.user_tag)
    const creator = encodeURIComponent(user.user_tag)

    document.querySelector(".content-wrapper").innerHTML = `
            <div class="div1">
                <div class="usernames">
                    <div class="username">${escapeHTML(user.username)}</div>
                    <a href="/profile/${creator}"><div class="tag">@${tag}</div></a>
                </div>
                <div class="links">
                    <a href="/search/?creator=${creator}&searchType=q">Go to created questions</a>
                    <a href="/search/?creator=${creator}&searchType=c">Go to created collections</a>
                </div>
            </div>
            <div class="stats">
                <div class="skl">${escapeHTML(user.school)}</div>
                <div class="country">${escapeHTML(user.country)}</div>
                <div class="date">User since ${escapeHTML(String(user.created_at).split(" at")[0])}</div>
                <br>
                <div class="today-studied">${timeConverter(user.studied_today)} total studied today</div>
                <div class="total-studied">${timeConverter(user.studied_total)} total studied all-time</div>
                <div class="q-created">${plural(user.created_total, "question")} created</div>
                <div class="q-completed">${plural(user.completed_total, "question")} completed</div>
                <div class="avg-likes">${Number(user.total_likes) || 0} total like rating</div>
            </div>`
    
    document.title = `${user.username} - SCIMUS`
}

loadData()
