import {ObjectClone} from "/Code/Common/Tools/_Object"
import {ParamGet} from "/Code/Common/Tools/_Param"
import {PubSubSend} from "/Code/Common/Tools/_PubSub"

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
        if (Array.isArray(call)) {
            for (const item of call)
                CallBack(item, data, event, parentContext, isSync, isFailMark, isPackCallUseData);
            return;
        }
        if(data === null)
            data = {};

        //STEP::Call back
        //WHEN::Parent pack component call(pack##)
        if (typeof call === "string" && call.startsWith("pack##")) {
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
            _data = ObjectClone(_data);
            const _packData = parentContext===null?{}:ParamGet("_data", {}, parentContext);
            for (const key in _data){
                let value = _data[key];
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