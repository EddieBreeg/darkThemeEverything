chrome.runtime.onMessage.addListener(onMessage);

let request = {
    type: "amIEnabled",
    url: document.location.origin
};
// asks for status at load time
chrome.runtime.sendMessage(request);

function onMessage(message)
{
    console.log(message)
    if(message.type === "getTabInfo")
    {
        // sending the tab domain name
        console.log('sending tab info');
        
        chrome.runtime.sendMessage({"type": "tabInfo", "url": document.location.origin});
    }
    else if(message.type === "toggle")
    {
        toggleFilter(message.enabled, message.intensity);
    }
}

function toggleFilter(enabled, intensity)
{
    // apply the dark theme
    var filter = "";
    if(enabled){filter = "invert(" + intensity + ") hue-rotate(" + 180*intensity + "deg)";}

    document.querySelector(':root').style['filter'] = filter;
    let notInvertedTags = ['img', 'video', 'svg', "iframe[class=youtube-video]"];

    for(e of notInvertedTags)
    {
        var elements = document.querySelectorAll(e);
        elements.forEach(x=>{
            x.style.filter = filter;
            console.log(x.src);
        });
    }
}

