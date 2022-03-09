//反转义
export const unEscape = (text) => {
    let temp = document.createElement("div");
    temp.innerHTML = text ? text.replace(/<br\/>/g, '\n') : "";
    let output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}


export const uuid = ()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}