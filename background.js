//enabling extension if the url matches
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url &&
    tab.url.includes("https://www.linkedin.com/search/results/people")
  ) {
    chrome.action.enable(tabId);
    chrome.action.setIcon({
      path: "images/16x16.png",
    });
  } else {
    chrome.action.disable(tabId);
    chrome.action.setIcon({
      path: "images/disabled_16.png",
    });
  }
});
