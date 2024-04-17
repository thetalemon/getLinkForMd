if (typeof browser === 'undefined') {
  var browser = chrome
}

document.getElementById('btn').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: onRun,
  })
})

function onRun() {
  if (typeof browser === 'undefined') {
    var browser = chrome
  }
  browser.runtime.sendMessage({
    title: `[${document.title}](${location.href})`,
  })
}

function onReceiveMessageBackground(request) {
  navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
    if (result.state === 'granted' || result.state === 'prompt') {
      /* write to the clipboard now */
      navigator.clipboard.writeText(request.title).then(
        () => {
          /* clipboard successfully set */
          document.getElementById('btn').textContent = 'copied!'
        },
        (e) => {
          /* clipboard write failed */
          console.log(e)
        }
      )
    }
  })
}

browser.runtime.onMessage.addListener(onReceiveMessageBackground)
