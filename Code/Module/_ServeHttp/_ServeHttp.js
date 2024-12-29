import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"

const Config = Tools.MergeDefault(Configs.module._ServeHttp,{
    "prefix":{},
    "timeout":3000
});

function Inner_UrlPrefix(_url){
    if(_url.startsWith("/")) {
        for (const key in Config["prefix"]) {
            if (key!=="" && _url.startsWith(key)) {
                _url = Config["prefix"][key]+_url;
                return _url;
            }
        }
        if("" in Config["prefix"])
            _url = Config["prefix"][""]+_url;
    }
    return _url
}

function Inner_UrlGet(_url, _param){
    //STEP::The special processing array is "key=1,key=2"
    const searchParams = new URLSearchParams(_param);
    for (const key in _param)
        if (Array.isArray(_param[key])) {
            _param[key].forEach(value => {
                searchParams.append(key, value);
            });
        } else {
            searchParams.append(key, _param[key]);
        }

    //STEP::Return real url
    if(_url.includes("?"))
        return (_url.endsWith("&")?_url:(_url+"&")) + searchParams.toString();
    else
        return _url +"?" + searchParams.toString();
}

function Inner_TransBody(param, header){
    let hasFile = false;
    for(const key in param){
        if(param[key] instanceof File){
            hasFile = true;
            break;
        }
    }
    if(hasFile) {
        const form = new FormData();
        for(const key in param){
            form.append(key, param[key]);
        }
        header['Content-Type'] = 'multipart/form-data';
        return form;
    } else {
        header['Content-Type'] = 'application/json';
        return JSON.stringify(param);
    }
}

async function Normal(moduleParam, passParam, result){
    //STEP::Get setting
    let _url = Tools.ParamRead("_url", "", moduleParam, passParam);
    const _header = Tools.ParamRead("_header", {}, moduleParam, passParam);
    let _param = Tools.ParamRead("_param", {}, moduleParam, passParam);
    const _method = Tools.ParamRead("_method", "GET", moduleParam, passParam);
    let _resultKey = Tools.ParamRead("_resultKey", "", moduleParam, passParam);
    const _timeout = Tools.ParamRead("_timeout", Config["timeout"], moduleParam, passParam);
    _url = Inner_UrlPrefix(_url);
    if(_method==="GET")
        _url = Inner_UrlGet(_url, _param);
    else
        _param = Inner_TransBody(_param, _header);
    console.debug(Logger.Header(), "Module-_ServeHttp Normal _url:", _url);
    console.debug(Logger.Header(), "Module-_ServeHttp Normal _header:", _header);
    console.debug(Logger.Header(), "Module-_ServeHttp Normal _param:", _param);
    console.debug(Logger.Header(), "Module-_ServeHttp Normal _method:", _method);
    console.debug(Logger.Header(), "Module-_ServeHttp Normal _resultKey:", _resultKey);
    console.debug(Logger.Header(), "Module-_ServeHttp Normal _timeout:", _timeout);

    //STEP::Set time out
    let data;
    const controller = new AbortController();
    const {signal} = controller;
    const timer = setTimeout(() => {
        controller.abort();
    }, _timeout);

    try {
        //STEP::Send request
        let backLoggerId = Logger.GetId();
        const requestInit = {
            method: _method,
            headers: _header,
            signal: signal,
        }
        if(_method !== "GET")
            requestInit["body"] = _param;
        const response = await fetch(_url, requestInit);
        backLoggerId = Logger.SetId(backLoggerId);

        //STEP::Judge whether it is 200
        if (!response.ok) {
            console.debug(Logger.Header(), "Module-_ServeHttp Normal request fail, code:", response.status);
            return ErrorCode.ERR_Module__ServeHttp_Normal_Fail;
        }

        //STEP::Trans data to json
        backLoggerId = Logger.SetId(backLoggerId);
        data = await response.json();
        backLoggerId = Logger.SetId(backLoggerId);
        console.debug(Logger.Header(), "Module-_ServeHttp Normal response:", data);

    } catch(e) {
        if (e.name === 'AbortError') {
            console.debug(Logger.Header(), "Module-_ServeHttp Normal timeout:", _timeout);
            return ErrorCode.ERR_Module__ServeHttp_Normal_Timeout;
        } else {
            throw e;
        }
    } finally {
        clearTimeout(timer);
    }

    //STEP::Input result
    if(_resultKey!==""){
        passParam[_resultKey] = data;
    }else{
        Tools.ObjectClean(passParam);
        if(!Tools.ObjectCopy(passParam, data)){
            passParam["result"] = data;
        }
    }

    return result;
}

async function Multiple(moduleParam, passParam, result){
    //STEP::Get setting
    const _list = Tools.ParamRead("_list", [], moduleParam, passParam);
    const _timeout = Tools.ParamRead("_timeout", Config["timeout"], moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_ServeHttp Multiple _list:", _list);
    console.debug(Logger.Header(), "Module-_ServeHttp Multiple _timeout:", _timeout);
    const requestList = _list.map(item=>{
        let _url = Tools.ParamRead("_url", "", item, passParam);
        const _method = Tools.ParamRead("_method", "GET", item, passParam);
        let _param = Tools.ParamRead("_param", {}, item, passParam);
        const _header = Tools.ParamRead("_header", {}, item, passParam);
        const _resultKey = Tools.ParamRead("_resultKey", "", item, passParam);
        _url = Inner_UrlPrefix(_url);
        if(_method==="GET")
            _url = Inner_UrlGet(_url, _param);
        else
            _param = Inner_TransBody(_param, _header);

        return {
            "_url":_url,
            "_method":_method,
            "_param":_param,
            "_header":_header,
            "_resultKey":_resultKey,
        }
    });
    console.debug(Logger.Header(), "Module-_ServeHttp Multiple requestList:", requestList);

    //STEP::Set time out
    let data;
    const controller = new AbortController();
    const {signal} = controller;
    const timer = setTimeout(() => {
        controller.abort();
    }, _timeout);

    try {
        //STEP::Send request
        const request = requestList.map(item => {
            const requestInit = {
                method: item._method,
                headers: item._header,
                signal: signal,
            }
            if(item._method !== "GET")
                requestInit["body"] = item._param;
            return fetch(item._url, requestInit);
        });
        const response = await Promise.all(request);

        //STEP::Judge whether it is 200
        response.forEach((item, index) => {
            if (!item.ok) {
                console.debug(Logger.Header(), "Module-_ServeHttp Multiple request fail, code:", response.status, "index:", index);
                result = ErrorCode.ERR_Module__ServeHttp_Multiple_Fail;
            }
        });
        if (ErrorCode.IsError(result)) {
            return result;
        }

        //STEP::Trans data to json
        data = await Promise.all(response.map(item => item.json()));
        console.debug(Logger.Header(), "Module-_ServeHttp Multiple response:", data);
    } catch(e) {
        if (e.name === 'AbortError') {
            console.debug(Logger.Header(), "Module-_ServeHttp Multiple timeout:", _timeout);
            return ErrorCode.ERR_Module__ServeHttp_Multiple_Timeout;
        } else {
            throw e;
        }
    } finally {
        clearTimeout(timer);
    }

    //STEP::Input result
    data.forEach((item, index) => {
        let resultKey = requestList[index]._resultKey;
        if(resultKey===""){
            let add = index;
            do {
                resultKey = `result${add++}`;
            }while(resultKey in passParam);
        }
        passParam[resultKey] = item;
    });
    return result;
}

async function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _action = Tools.ParamRead("_action", "normal", moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_ServeHttp DoStart _action:", _action);

        //STEP::Action
        switch (_action){
            case "normal":
                result = await Normal(moduleParam, passParam, result);
                break;
            case "multiple":
                result = await Multiple(moduleParam, passParam, result);
                break;
            default:
                console.debug(Logger.Header(), "Module-_ServeHttp DoStart lack action:", _action);
                return ErrorCode.ERR_Module__ServeHttp_Action_Lack;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_ServeHttp DoStart exception", e);
        return ErrorCode.ERR_Module__ServeHttp_Exception;
    }
    return result;
}

export default async function _ServeHttp(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_ServeHttp start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = await DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_ServeHttp end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}