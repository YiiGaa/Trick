import jp from "jsonpath";

function _ChangeRealPath (key) {
    let jsonPath = "$";
    const pieceArr = key.split(">>");

    for (const piece of pieceArr) {
        if (/^(0|[1-9][0-9]*)$/.test(piece)) {
            jsonPath += `[${piece}]`;
        } else {
            jsonPath += `["${piece}"]`;
        }
    }
    return jsonPath;
}

//TIPS::Get the value by the json path
//>>key::Json path(use '>>' to locate), such as 'get##key_1>>2>>key_3'
//>>data::Source object
//>>return::Get value
//>>return::undefined
function JsonPathValue (key, data) {
    try {
        return jp.value(data, _ChangeRealPath(key));
    }catch (e) {
        console.debug("Common-Tools JsonPathValue exception", e);
        return undefined;
    }
}

//TIPS::Set the value by the json path
//>>key::Json path(use '>>' to locate), such as 'get##key_1>>2>>key_3'
//>>target::Target object
//>>data::Inserted value
//>>return::true/false
function JsonPathSet (key, target, data=undefined) {
    try {
        return jp.apply(target, _ChangeRealPath(key), ()=>data);
    }catch (e) {
        console.debug("Common-Tools JsonPathSet exception", e);
        return false;
    }
}

export {JsonPathValue, JsonPathSet}