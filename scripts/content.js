const SEC = 3; // timeout between each connection request
let isStarted = false; // is connecting

console.log("content-script loaded");

//receive message from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //update isStarted
  isStarted = request.start;

  //coecting if connection started
  if (isStarted) {
    //get all connection buttons by using css attribute selector
    const btns = document.querySelectorAll(
      '.reusable-search__result-container button[aria-label*="connect"]'
    );

    //timer function to delay in between each connection
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));

    //async iife
    (async function () {
      for (let i = 0; i < btns.length; i++) {
        //delay
        await timer(SEC * 1000);

        // clicking each button if started else breaking the loop
        if (isStarted) {
          //clicking connect button
          btns[i].click();

          //if "send message" popup appears, clicking the button to close it
          await timer(100);
          let popup = document.querySelector(
            "#artdeco-modal-outlet .artdeco-button--primary"
          );
          if (popup) {
            //delaing to show popup instead of immidate popup flicker
            await timer(100);
            //clicking popup button
            popup.click();
          }
          //send current connection count and total count
          try {
            await chrome.runtime.sendMessage({
              current: i + 1,
              total: btns.length,
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          //breaking the loop
          break;
        }
      }
    })();
  }
});
