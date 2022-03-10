const defaultHasElement = (array, element) => {
    return array && array.includes(element)
}

Array.prototype.distinct = function (hasElement = defaultHasElement) {
    const a = [];
    for (let i = 0; i < this.length; i++) {
        if (!hasElement(a, this[i])) {
            a.push(this[i])
        }
    }
    return a
}
