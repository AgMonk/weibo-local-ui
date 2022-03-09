export const putCache = (key, value, storage = localStorage) => {
    storage.removeItem(key);
    storage.setItem(key, JSON.stringify(value))
}

export const getCache = (key, storage = localStorage) => {
    return JSON.parse(storage.getItem(key));
}

export const delCache = (key, storage = localStorage) =>{
    storage.removeItem(key)
}

export const clearCache = (storage = localStorage) => {
    storage.clear();
}

export const getCacheByPrefix = (prefix, storage = localStorage) => {
    let map = {}
    Object.keys(storage)
        .filter(key=>key.startsWith(prefix))
        .forEach(key=>map[key.replace(prefix,"").trim()]=getCache(key,storage))
     return map;

}


