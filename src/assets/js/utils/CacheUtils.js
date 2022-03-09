// 缓存方法

/**
 * 检查缓存对象中是否有已缓存的数据，如果有，且符合一定条件则使用缓存数据；否则执行请求方法，请求成功后保存数据到缓存对象
 * @param cacheObj 缓存对象
 * @param key key
 * @param requestMethod 请求
 * @param force 强制发送请求
 * @param useCache 判断使用缓存数据的条件
 * @param saveCache 保存缓存数据的方法
 * @returns {Promise<unknown>|*}
 */
export const getCache = ({cacheObj, key, requestMethod, force = false, useCache, saveCache, loadCache}) => {
    const cache = cacheObj[key]
    if (!force && cache && (!useCache || useCache(cache))) {
        console.log("从缓存读取数据 " + key)
        const body = copyObj(loadCache ? loadCache(cache) : cache);
        return new Promise((r) => r(body))
    }
    return requestMethod().then(body => {
        console.log("数据写入缓存 " + key)
        if (saveCache) {
            saveCache(cacheObj, key, body)
        } else {
            cacheObj[key] = body
        }
        return copyObj(body);
    })
}

export const getCacheByTime = ({cacheObj, key, requestMethod, force = false, seconds}) => {
    const now = Math.floor(new Date().getTime() / 1000)
    return getCache({
        cacheObj, key, requestMethod, force,
        useCache: (cache) => now - cache.time < seconds,
        saveCache: (cacheObj, key, body) => cacheObj[key] = {data: body, time: now},
        loadCache: (cache) => cache.data,
    })


}

const copyObj = (body) => JSON.parse(JSON.stringify(body))