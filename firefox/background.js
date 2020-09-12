function scanTabs(tabs)
{
    for(tab of tabs)
    {
        console.log(tab);
    }
}

firefox.tabs.query({}, scanTabs);