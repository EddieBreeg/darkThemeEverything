function scanTabs(tabs)
{
    for(tab of tabs)
    {
        console.log(tab);
    }
}

chrome.tabs.query({}, scanTabs);