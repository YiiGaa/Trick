import {JsonPathValue} from "/Code/Common/Tools/_JsonPath"

//TIPS::Get param according the key
//>>key::The key of the param
//>>defaultValue::The default value. It can be 'null', it is equivalent to not limiting the type
//>>moduleParam::Get the value corresponding to the 'key' in this object
//              - If the acquisition fails, the 'defaultValue' is returned;
//              - If the string starting with 'get##' is obtained, it will continue to search for value in 'passParam' as a 'new key';
//              - If the same value as the 'defaultValue' type is obtained, it will be used as the return value;
//>>passParam::Get the value corresponding to the 'new key'(get from moduleParam) in this object
//            - The 'new key' can be set as json path(use '>>' to locate), such as 'get##key_1>>2>>key_3';
//            - If the acquisition fails, the 'defaultValue' is returned;
//            - If the same value as the 'defaultValue' type is obtained, it will be used as the return value;
//>>return::Value
function ParamRead(key, defaultValue, moduleParam, passParam= null) {
    try {
        //WHEN::Get from passParam
        const realKey = moduleParam[key];
        if (passParam !== null && typeof realKey === "string" && realKey.startsWith("get##")) {
            //STEP-IN::Get value
            let returnValue = JsonPathValue(realKey.substring("get##".length), passParam);
            if (returnValue !== undefined && defaultValue === null) {
                return returnValue;
            } else if (typeof returnValue === typeof defaultValue) {
                return returnValue;
            }

            //WHEN-IN::Value is string(It may be need to trans type)
            if (typeof returnValue === "string") {
                if (typeof defaultValue === 'number') {
                    returnValue = Number(returnValue);
                    if (!isNaN(returnValue)) {
                        return returnValue;
                    }
                } else if (typeof defaultValue === 'boolean') {
                    returnValue = returnValue.toLowerCase() === "true";
                    return returnValue;
                } else if (typeof defaultValue === 'object') {
                    try {
                        returnValue = JSON.parse(returnValue);
                        return returnValue;
                    } catch (e) {
                        return defaultValue;
                    }
                }
            }
            return defaultValue;
        }

        //WHEN::Get from moduleParam
        if (moduleParam.hasOwnProperty(key)) {
            if (defaultValue === null) {
                return moduleParam[key]
            } else if (typeof moduleParam[key] === typeof defaultValue) {
                return moduleParam[key]
            }
        }
    }catch (e) {
        console.debug("Common-Tools ParamRead exception", e);
    }
    return defaultValue;
}

//TIPS::Get param according the key
//>>key::The key of the param.The 'key' can be set as json path(starting with 'get##' and use '>>' to locate), such as 'get##key_1>>2>>key_3'
//>>defaultValue::The default value. It can be 'null', it is equivalent to not limiting the type
//>>moduleParam::Get the value corresponding to the 'key' in this object
//              - If the acquisition fails, the 'defaultValue' is returned;
//              - If the same value as the 'defaultValue' type is obtained, it will be used as the return value;
//>>return::Value
function ParamGet (key, defaultValue, param) {
    try {
        //STEP::Get from param
        if (param.hasOwnProperty(key)) {
            if (defaultValue === null) {
                return param[key]
            } else if (typeof param[key] === typeof defaultValue) {
                return param[key]
            }
        }

        //STEP::Try Json path
        if (typeof key === "string" && key.startsWith("get##")) {
            let returnValue = JsonPathValue(key.substring("get##".length), param);
            if (returnValue !== undefined && defaultValue === null) {
                return returnValue;
            } else if (typeof returnValue === typeof defaultValue) {
                return returnValue;
            }
        }
    }catch (e) {
        console.debug("Common-Tools ParamGet exception", e);
    }
    return defaultValue;
}

//TIPS::Get param according the key, and It will be forcibly converted to string type
//>>key::The key of the param.The 'key' can be set as json path(starting with 'get##' and use '>>' to locate), such as 'get##key_1>>2>>key_3'
//>>defaultValue::The default value（must be string tpye）.
//>>moduleParam::Get the value corresponding to the 'key' in this object
//              - If the acquisition fails, the 'defaultValue' is returned;
//>>return::Value
function ParamGetStr (key, defaultValue, param) {
    try {
        //STEP::Get from param
        if (param.hasOwnProperty(key)) {
            return typeof param[key] === 'object'?JSON.stringify(param[key]):`${param[key]}`;
        }

        //STEP::Try Json path
        if (typeof key === "string" && key.startsWith("get##")) {
            let returnValue = JsonPathValue(key.substring("get##".length), param);
            if (returnValue !== undefined) {
                return typeof param[key] === 'object'?JSON.stringify(returnValue):`${returnValue}`;
            }
        }
    }catch (e) {
        console.debug("Common-Tools ParamGet exception", e);
    }
    return defaultValue;
}

export {ParamRead, ParamGet, ParamGetStr}