let headerHMTL = `<a href="/"><button><img id="headerIMG" src="resources/HEADER_logo.png" alt="SCIMUS" srcset=""></button></a> 
    
    <div id="header-items">
      <a class="header-item" href="/search"><button>SEARCH</button></a>
      <a class="header-item" href="/create"><button>CREATE</button></a>
      <a class="header-item" href="/leaderboards"><button>LEADERBOARDS</button></a>
      <span class="header-item timer-hover"> <span id="timer-text-wrap"><span id="header-timer-text">30:00</span></span>
        <div id="timer-popup" class="timer-hover">
          <a href="/preferences" id="timer-settings"><button class="btns" >⚙️</button></a>
          
          <canvas id="timer-arc"></canvas>
          <span id="time-text">
            <span id="mins" contenteditable="true" class="input-time">30</span>:<span contenteditable="true" id="secs" class="input-time">00</span>
          </span>
          
          <div id="control-btns">
            <div class="playback">
              <button class="btns" id="b1">⏮</button>
              <button class="btns" id="b2">▶</button>
              <button class="btns" id="b3">⏭</button>
            </div>
            <button class="btns" id="mode-btn">📖</button>
          </div>
        </div>
        
      </span> 
      <span class="header-item profile-hover" >pfp
        <div class="profile-hover" id="profile-popup">
          <span class="profile-hover-item">
            <a href="/profile"><button>Profile</button></a>
            <a href="/inbox"><button style="text-align: right;">📧</button></a>
          </span>
          <span class="profile-hover-item">
            <a href="/search"><button>My stuff</button></a>
          </span>
          <span class="profile-hover-item">
            <a href="/settings"><button>Settings</button></a>
          </span>
          <span class="profile-hover-item">
            <a href="/preferences"><button>Preferences</button></a>
          </span>
        </div>
      </span> 
    </div>`

document.getElementById("header").innerHTML = headerHMTL