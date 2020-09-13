firefox.runtime.onMessage.addListener(onMessage);

let request = {
    type: "amIEnabled",
    url: document.location.origin
};
// asks for status at load time
firefox.runtime.sendMessage(request);

function onMessage(message)
{
    console.log(message)
    if(message.type === "getTabInfo")
    {
        // sending the tab domain name
        console.log('sending tab info');
        
        firefox.runtime.sendMessage({"type": "tabInfo", "url": document.location.origin});
    }
    else if(message.type === "toggle")
    {
        toggleFilter(message.enabled);
    }
}

function toggleFilter(enabled)
{
    // apply the dark theme
    var filter = "";
    if(enabled){filter = "invert(1) hue-rotate(180deg)";}

    document.querySelector(':root').style['filter'] = filter;
    let notInvertedTags = ['img', 'video'];

    for(e of notInvertedTags)
    {
        var elements = document.querySelectorAll(e);
        elements.forEach(x=>{
            x.style.filter = filter;
            console.log(x.src);
        });
    }
}

