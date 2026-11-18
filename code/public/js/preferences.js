import { sendDataRequest, escapeHTML, loader, emptyState } from "./utils.js"

async function loadData() {
    const errbar = document.getElementsByClassName("error")[0]

    const wrapper = document.querySelector(".content-wrapper")
    wrapper.replaceChildren(loader())

    const user = await sendDataRequest(`/api/user/data/self`, errbar, window, "")
    if (!user) {
        wrapper.replaceChildren(emptyState("Couldn't load your preferences. Try refreshing the page."))
        return
    }

    document.querySelector(".content-wrapper").innerHTML = `
    <div class="div1">
        <div class="usernames">
            <div class="username">${escapeHTML(user.username)}</div>
            <a href="/profile">
                <div class="tag">@${escapeHTML(user.user_tag)}</div>
            </a>
        </div>
    </div>
    <div class="actions" id="special">
        <h3>Study timer preferences</h3>
        <div class="notifs action-item"> Study time: <input type="number" inputmode="numeric" min="1" max="90" class="likes-inp study" value="${Number(user.preference_data?.[0]) || 50}">m</div>
        <div class="notifs action-item"> Rest time: <input type="number" inputmode="numeric" min="1" max="90" class="likes-inp rest" value="${Number(user.preference_data?.[1]) || 10}">m</div>
    </div>
    `

    //same checks for both inputs, type is "study" or "rest"
    function watchInput(input, type) {
        input.addEventListener("change", async function() {
            //validate
            const number = Math.round(Number(input.value))

            if (isNaN(number) || number <= 0) {
                input.value = ""
                return
            }

            input.value = Math.min(number, 90)

            await sendDataRequest(`/api/preferences/update/${type}/${input.value}`, errbar, window, "", "POST")
        })
    }

    watchInput(document.querySelector(".study"), "study")
    watchInput(document.querySelector(".rest"), "rest")
}

loadData()
