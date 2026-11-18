document.documentElement.style.visibility = "hidden"

const headerHTML = `<a href="/"><button><img id="headerIMG" src="/resources/HEADER_logo.png" alt="SCIMUS"></button></a> 
    
    <div id="header-items">
      <a class="header-item" href="/search"><button>SEARCH</button></a>
      <a class="header-item" href="/create"><button>CREATE</button></a>
      <a class="header-item" href="/leaderboards"><button>LEADERBOARDS</button></a>
      <span class="header-item timer-hover"> <span id="timer-text-wrap"><span id="header-timer-text">30:00</span></span>
        <div id="timer-popup" class="timer-hover">
          <a href="/preferences" id="timer-settings"><button class="btns" ><img src="/resources/options.PNG" alt="" class="icon"></button></a>
          
          <canvas id="timer-arc"></canvas>
          <span id="time-text">
            <span id="mins" contenteditable="true" inputmode="numeric" class="input-time">30</span>:<span contenteditable="true" inputmode="numeric" id="secs" class="input-time">00</span>
          </span>
          
          <div id="control-btns">
            <div class="playback">
              <button class="btns" id="b1"><img src="/resources/backward.PNG" alt="" class="icon"></button>
              <button class="btns" id="b2"><img src='/resources/play.PNG' alt='' class='icon' id='play'></button>
              <button class="btns" id="b3"><img src="/resources/forward.PNG" alt="" class="icon" ></button>
            </div>
            <button class="btns" id="mode-btn"><img src="/resources/work.PNG" alt="" class="icon"></button>
          </div>
        </div>
        
      </span> 
      <span class="header-item profile-hover" ><img src="/resources/profile.PNG" alt="" class="icon" id="pfp">
        <div class="profile-hover" id="profile-popup">
          <span class="profile-hover-item">
            <a href="/profile"><button>Profile</button></a>
            <a href="/inbox"><button style="text-align: right;"><img src="/resources/inbox.PNG" alt="" class="icon" id="inbox"></button></a>
          </span>
          <span class="profile-hover-item">
            <a href="/preferences"><button>Preferences</button></a>
          </span>
          <span class="profile-hover-item">
            <a href="/" id="logout"><button>Log out</button></a>
          </span>
        </div>
      </span> 
    </div>`

document.getElementById("header").innerHTML = headerHTML

//keep the page hidden until its images are ready, but never for long
function showPage() {
    if (document.documentElement.hasAttribute("data-hold")) return //these pages show themselves once their data is in
    document.documentElement.style.visibility = "visible"
    document.documentElement.classList.add("shown")
}

const pending = [...document.images].filter(img => !img.complete).map(img => new Promise(r => {
    img.addEventListener("load", r, {once: true})
    img.addEventListener("error", r, {once: true})
}))

Promise.all(pending).then(showPage)
setTimeout(showPage, 3000)
