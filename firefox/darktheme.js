document.querySelector(':root').style['filter'] = "invert(1) hue-rotate(180deg)";

let notInvertedTags = ['img', 'video']

for(e of notInvertedTags)
{
    var elements = document.querySelectorAll(e);
    elements.forEach(x=>{
        x.style['filter'] = "invert(1) hue-rotate(180deg)";
    });
}