const btns = document.querySelector(".btns");
const progress = document.querySelector(".circular-progress");
const progressCount = document.querySelector(".circular-progress h1");
const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");

//async iife
(async () => {
  //get current tab
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    //stop connecting
    function stop() {
      progressCount.innerHTML = 0;
      progress.style.setProperty("--percent", 0);
      btns.classList.remove("started");
    }

    // send message to content script on button click
    async function sendMsg(start) {
      if (start) {
        btns.classList.add("started");
      } else {
        stop();
      }
      try {
        await chrome.tabs.sendMessage(tab.id, { start });
      } catch (err) {
        console.log(err);
      }
    }

    //receive message from contentscript to update loading count and progress bar
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request && request.current && request.total) {
        progressCount.innerHTML = request.current;
        console.log(progressCount);
        progress.style.setProperty(
          "--percent",
          (request.current / request.total) * 100
        );

        //stop connecting when every button clicked
        if (request.current === request.total) {
          setTimeout(() => {
            stop();
          }, 3000);
        }
      }
    });

    //button events
    startBtn.addEventListener("click", () => {
      sendMsg(true);
    });
    stopBtn.addEventListener("click", () => {
      console.log(1);
      sendMsg(false);
    });
  } catch (err) {
    console.log(err);
  }
})();
