export const getTypeOf = function (obj) {
    let type = Object.prototype.toString.call(obj);
    return type.replace("[object ", "").replace("]", "");
}

export const copyObj = (obj) => JSON.parse(JSON.stringify(obj))


//根据Id字段去重
export const distinctById = (array) => {
    const map = {}
    array.forEach(i => map[i.id] = i)
    return Object.keys(map).map(i => map[i])
}