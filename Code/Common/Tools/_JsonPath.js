import {isObject} from "lodash-es";

function JsonPathSet_Set(data, keys, value) {
    if(keys.length === 1){
        if(value === undefined)
            delete data[keys[0]];
        else
            data[keys[0]] = value;
        return true
    } else if(keys.length > 1){
        let key = keys.shift();
        const index = /^(0|[1-9][0-9]*)$/.test(key)?Number(key):-1;

        if(Array.isArray(data) && index<data.length)
            key = index
        else if(Array.isArray(data) && index>=data.length)
            data[index] = {}
        else if(!Array.isArray(data) && !data.hasOwnProperty(key))
            data[key] = {}

        if(typeof data[key] !== 'object')
            data[key] = {}

        return JsonPathSet_Set(data[key], keys, value)
    }
    return false;
}

function JsonPathValue_Get(data, keys, listIndex) {
    if (keys.length === 0) return data;
    const key = keys.shift();
    if(Array.isArray(data) && /^(0|[1-9][0-9]*)$/.test(key)) {
        const index = parseInt(key);
        if (index>=0 && index <= data.length) {
            listIndex.push(index);
            return JsonPathValue_Get(data[key], keys, listIndex);
        }
    } else if (data && isObject(data) && data.hasOwnProperty(key))
        return JsonPathValue_Get(data[key], keys, listIndex);
    return undefined;
}

//TIPS::Get the value by the json path
//>>key::Json path(use '>>' to locate), such as 'get##key_1>>2>>key_3'
//>>data::Source object
//>>listIndex::Mark the array index list
//>>return::Get value
//>>return::undefined
function JsonPathValue(key, data, listIndex=[]) {
    try {
        return JsonPathValue_Get(data,key.split(">>"),listIndex);
    }catch (e) {
        console.debug("Common-Tools JsonPathValue exception", e);
        return undefined;
    }
}

//TIPS::Set the value by the json path
//>>key::Json path(use '>>' to locate), such as 'get##key_1>>2>>key_3'
//>>target::Target object
//>>data::Inserted value, 'undefined' means delete key
//>>return::true/false
function JsonPathSet (key, target, data=undefined) {
    try {
        return JsonPathSet_Set(target, key.split(">>"), data);
    }catch (e) {
        console.debug("Common-Tools JsonPathSet exception", e);
        return false;
    }
}

export {JsonPathValue, JsonPathSet}