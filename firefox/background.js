firefox.runtime.onMessage.addListener(onMessage);

let extensionEnabled = true;

function onMessage(message, sender, reply)
{
    console.log(message);
    if(message.type==="amIEnabled")
    {
        if(localStorage.key(message.url)==undefined)
        {
            localStorage.setItem(message.url, false);
        }
        var response = {
            type: "toggle",
            enabled: localStorage[message.url]==="true" && extensionEnabled
        };
        console.log(response);
        sendToCurrentTab(response);
        console.log("message sent");
    }
    else if(message.type==="getExtensionStatus")
    {
        firefox.runtime.sendMessage({
            type: "extensionStatus",
            enabled: extensionEnabled
        });
    }
    else if(message.type==="tabInfo")
    {
        var response={
            type: "tabStatus",
            url: message.url,
            enabled: localStorage[message.url]==="true" && extensionEnabled
        };
        firefox.runtime.sendMessage(response);
    }
    else if(message.type==="setExtensionStatus")
    {
        extensionEnabled=message.enabled;
    }
    else if(message.type==="setTabStatus")
    {
        localStorage[message.url] = message.enabled;
    }
}
function sendToCurrentTab(message)
{
    firefox.tabs.query({active: true}, tabs=>{
        console.log(tabs[0]);
        firefox.tabs.sendMessage(tabs[0].id, message);
    });
}