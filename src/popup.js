chrome.runtime.onMessage.addListener(onMessage);

var extensionEnabled=true; // default value
chrome.runtime.sendMessage({
    type: "getExtensionStatus"
}); // asks for the extension status
var tabEnabled=false; // default value
var tabURL;
sendToCurrentTab({
    type: "getTabInfo"
}); // asks for current tab info

var mainToggle = document.getElementById('main-switch');
var secondToggle = document.getElementById('second-switch');
console.log(extensionEnabled);
console.log(tabEnabled);

// event when the main switch is changed
mainToggle.addEventListener("change", function(){
    extensionEnabled=mainToggle.checked;
    chrome.runtime.sendMessage({
        type: "setExtensionStatus",
        enabled: extensionEnabled
    });
    sendToCurrentTab({
        type: "toggle",
        enabled: tabEnabled && extensionEnabled
    });
})
// event when the second switch is changed
secondToggle.addEventListener('change', function(){
    tabEnabled = secondToggle.checked;
    sendToCurrentTab({
        type: "toggle",
        enabled: tabEnabled && extensionEnabled
    });
    chrome.runtime.sendMessage({
        type: "setTabStatus",
        url: tabURL,
        enabled: tabEnabled
    })
})

mainToggle.checked = extensionEnabled;
secondToggle.checked = tabEnabled;

function onMessage(message)
{
    console.log(message);
    if(message.type==="extensionStatus")
    {
        // sets the extension status
        extensionEnabled = message.enabled;
        mainToggle.checked=extensionEnabled;
    }
    else if(message.type==="tabInfo")
    {
        // current tab url
        tabURL=message.url;
    }
    else if(message.type==="tabStatus")
    {
        // updates tab status
        tabEnabled=message.enabled;
        secondToggle.checked=tabEnabled;
        // toggle request for the tab
        sendToCurrentTab({
            type: "toggle",
            enabled: extensionEnabled && tabEnabled
        });
        chrome.runtime.sendMessage({
            type: "setTabStatus",
            url: tabURL,
            enabled: tabEnabled
        });
    }
}

// sends a message to the currently selected tab
function sendToCurrentTab(message)
{
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}