import localforage from 'localforage';
import {cloneDeep, isObject} from "lodash-es"
import Logger from "/Code/Common/Logger/Logger";

const CacheHandler = localforage.createInstance({
    name: "trick-_ServeHttp",
});

export async function CacheGet(_url, _method, _header, _param, _cacheExpire, _isJson) {
    let data = undefined;
    try{
        const cacheKey = `${_url}-${JSON.stringify(_method)}-${JSON.stringify(_header)}-${JSON.stringify(_param)}`
        let backLoggerId = Logger.GetId();
        const value = await CacheHandler.getItem(cacheKey);
        Logger.SetId(backLoggerId);

        if (isObject(value) && value.hasOwnProperty("expired") && value.hasOwnProperty("value") && value.hasOwnProperty("_cacheExpire")) {
            if (value["_cacheExpire"] === _cacheExpire && value["_isJson"] === _isJson && Date.now() <= value["expired"]) {
                console.debug(Logger.Header(), "Module-_ServeHttp request get from cache, _url:", _url, ", _method:", _method, ", _param:", _param, ", _header:", _header);
                data = value["value"];
            }
        }
        if (!data && value !== null)
            CacheHandler.removeItem(cacheKey)
    } catch (e) {}
    return data;
}

export function CacheSet(_url, _method, _header, _param, _cacheExpire, _isJson, data) {
    try{
        const cacheKey = `${_url}-${JSON.stringify(_method)}-${JSON.stringify(_header)}-${JSON.stringify(_param)}`
        const value = {
            "_cacheExpire":_cacheExpire,
            "_isJson":_isJson,
            "expired":Date.now() + _cacheExpire * 1000,
            "value":data
        }
        CacheHandler.setItem(cacheKey, cloneDeep(value));
    } catch (e) {}
}