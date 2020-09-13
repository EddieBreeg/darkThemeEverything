browser.runtime.onMessage.addListener(onMessage);

let extensionEnabled = true;

function onMessage(message, sender, reply)
{
    console.log(message);
    if(message.type==="amIEnabled")
    {
        if(localStorage.key(message.url)==undefined)
        {
            localStorage.setItem(message.url, JSON.stringify({enabled: false, intensity: 1}));
        }
        var status = JSON.parse(localStorage[message.url]);
        var response = {
            type: "toggle",
            enabled: status.enabled && extensionEnabled,
            intensity: status.intensity
        };
        console.log(response);
        sendToCurrentTab(response);
        console.log("message sent");
    }
    else if(message.type==="getExtensionStatus")
    {
        browser.runtime.sendMessage({
            type: "extensionStatus",
            enabled: extensionEnabled
        });
    }
    else if(message.type==="tabInfo")
    {
        var status = JSON.parse(localStorage[message.url]);
        var response={
            type: "tabStatus",
            url: message.url,
            enabled: status.enabled && extensionEnabled,
            intensity: status.intensity
        };
        browser.runtime.sendMessage(response);
    }
    else if(message.type==="setExtensionStatus")
    {
        extensionEnabled=message.enabled;
    }
    else if(message.type==="setTabStatus")
    {
        localStorage[message.url] = JSON.stringify({enabled: message.enabled, intensity: message.intensity});
    }
}
function sendToCurrentTab(message)
{
    browser.tabs.query({active: true}, tabs=>{
        console.log(tabs[0]);
        browser.tabs.sendMessage(tabs[0].id, message);
    });
}