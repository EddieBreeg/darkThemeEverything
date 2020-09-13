firefox.runtime.onMessage.addListener(onMessage);

let extensionEnabled = true;

function onMessage(message, sender, reply)
{
    console.log(message);
    // when a tab asks for status information on load
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
    // extension status request from popup
    else if(message.type==="getExtensionStatus")
    {
        firefox.runtime.sendMessage({
            type: "extensionStatus",
            enabled: extensionEnabled
        });
    }
    // tab information
    else if(message.type==="tabInfo")
    {
        var response={
            type: "tabStatus",
            url: message.url,
            enabled: localStorage[message.url]==="true" && extensionEnabled
        };
        firefox.runtime.sendMessage(response);
    }
    // updates extension status
    else if(message.type==="setExtensionStatus")
    {
        extensionEnabled=message.enabled;
    }
    // updates tab status
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