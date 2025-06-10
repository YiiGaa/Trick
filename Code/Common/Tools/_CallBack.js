import {ObjectClone} from "/Code/Common/Tools/_Object"
import {ParamGet} from "/Code/Common/Tools/_Param"
import {PubSubSend} from "/Code/Common/Tools/_PubSub"
import {isString} from "lodash-es";

function CallBack_Style(setting){
    //STEP::Get query/style setting
    setting = setting.substring('style##'.length);
    const [query, styleSet] = setting.split(/>>/, 2);

    //STEP::Get element
    const element = document.querySelector(query);
    if(element === null)
        return;

    //STEP::Set style
    const styles = styleSet.split(';');
    styles.forEach(style => {
        if (style.trim()) {
            const [property, value] = style.split(':');
            const prop = property.trim();
            let val = value.trim();
            let important = false;
            if (val.endsWith('!important')) {
                important = true;
                val = val.replace('!important', '').trim();
            }

            if(important)
                element.style.setProperty(prop.trim(), val.trim(), 'important');
            else
                element.style.setProperty(prop.trim(), val.trim());
        }
    });
}

function CallBack_Css(setting) {
    //STEP::Get query/style setting
    let mode = "";
    if(setting.startsWith("css##")) {
        setting = setting.substring('css##'.length);
        mode = "toggle";
    }else if(setting.startsWith("css add##")) {
        setting = setting.substring('css add##'.length);
        mode = "add";
    }else if(setting.startsWith("css remove##")) {
        setting = setting.substring('css remove##'.length);
        mode = "remove";
    }

    //STEP::Get element
    const [query, cssSet] = setting.split(/>>/, 2);
    const element = document.querySelector(query);
    if (element === null)
        return;

    //STEP::Set class
    const classes = cssSet.split(' ');
    switch (mode){
        case "toggle":
            const allExist = classes.every(cls => element.classList.contains(cls));
            if (allExist)
                element.classList.remove(...classes);
            else
                element.classList.add(...classes);
            break;
        case "add":
            element.classList.add(...classes);
            break;
        case "remove":
            element.classList.remove(...classes);
            break;
    }
}


//TIPS::Call back
//>>call::Target callback address
//       - Array type([]), means calling list
//       - String type("") and Starting with 'pack##', calling parent 'pack component'. The data passed is the data recorded in 'parentContext'. After 'pack##', you can set '_action', which will automatically supplement the '_action' set in the data, such as 'pack##onClick'
//       - String type(""), calling the PubSub channel, the data passed is the data recorded in 'data'(param)
//       - Function type, calling the Function, the data passed is the data recorded in 'data'(param)
//       - Object type({}), detailed settings, the format is {"_call":"","_data":{}}, '_call' equivalent to 'call', "_data" equivalent to 'data'
//>>data::Call value
//>>return::true/false
function CallBack(call, data={}, event = null, parentContext = null, isSync=false, isFailMark=false, isPackCallUseData = false){
    try {
        //STEP::Check target
        if (call === null || call === "")
            return;

        //WHEN::Array call list
        if (Array.isArray(call)){
            for (const item of call)
                CallBack(item, data, event, parentContext, isSync, isFailMark, isPackCallUseData);
            return;
        }
        if(data === null)
            data = {};

        //STEP::Call back
        //WHEN::Parent pack component call(pack##)
        if (typeof call === "string" && call.startsWith("pack##")){
            if(parentContext===null)
                return;
            const parentData = isPackCallUseData?data:ParamGet("_data", {}, parentContext);
            const targetCall = ParamGet("_call", ()=>{}, parentContext);
            const actionKey = call.substring('pack##'.length);
            const callData = ObjectClone(parentData);
            callData["_action"] = actionKey;
            targetCall(callData, event);
            return;
        }
        if (typeof call === "string" &&
            (
                call.startsWith("css##") ||
                call.startsWith("css add##") ||
                call.startsWith("css remove##")
            )
        ) {
            CallBack_Css(call);
            return;
        }
        if (typeof call === "string" && call.startsWith("style##")) {
            CallBack_Style(call);
            return;
        }
        //WHEN::PubSub id call
        if (typeof call === "string")
            return PubSubSend(call, ObjectClone(data), isSync, isFailMark);
        //WHEN::Function
        if (call instanceof Function){
            if(isSync)
                return call(ObjectClone(data));
            else
                setTimeout(()=>{
                    call(ObjectClone(data));
                })
            return;
        }
        //WHEN::Custom param, mixing component data(get##) and parentContext data(pack##)
        if (call instanceof Object){
            const _call = ParamGet("_call", null, call);
            let _data = ObjectClone(ParamGet("_data", {}, call));
            const _packData = parentContext===null?{}:ParamGet("_data", {}, parentContext);
            for (const key in _data){
                let value = _data[key];
                if(isString(value))
                    if(value.startsWith('get##')){
                        _data[key] = ParamGet(value, null, data);
                    } else if(value.startsWith('pack##')){
                        const getKey = 'get##'+value.substring('pack##'.length);
                        _data[key] = ParamGet(getKey, null, _packData);
                    }
            }
            if(typeof _call === "string" && _call.startsWith("pack##"))
                isPackCallUseData = true;
            return CallBack(_call, _data, event, parentContext, isSync, isFailMark, isPackCallUseData);
        }
    }catch (e){
        console.debug("Common-Tools CallBack exception", e);
    }
}

export {CallBack};