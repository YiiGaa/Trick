import PubSub from "pubsub-js";
import {CallBack} from "./_CallBack";
import {cloneDeep} from 'lodash-es';
const _PubSubQueue = {};

//TIPS::Subscribe PubSub
//>>id::The identity of the PubSub channel.Can listen to the same ID simultaneously
//>>executeFun::The call back function of receive information
//>>handler::The data object, it will be sent to 'executeFun' with PubSub message
//>>return::The token of the PubSub channel
//>>return::null
function PubSubListen (id, executeFun, handler){
    try{
        //STEP::Subscribe message
        if(id === "")
            return null;
        const result = PubSub.subscribe(id, (topic, message) => {
            executeFun(message, handler);
        });
        //STEP::Resend fail message
        if(id in _PubSubQueue){
            setTimeout(()=>{
                for(const item of _PubSubQueue[id]) {
                    PubSub.publish(id, item);
                }
            })
        }
        return result;
    }catch(e){
        console.debug("Common-Tools PubSubListen exception", e);
    }
}

//TIPS::Unsubscribe PubSub
//>>token::The token of the PubSub channel(get from PubSubListen())
//>>return::null
function PubSubCancel (token){
    try{
        if(token !== null) {
            PubSub.unsubscribe(token);
        }
    }catch(e){
        console.debug("Common-Tools PubSubCancel exception", e);
    }
    return null;
}

//TIPS::Send PubSub message
//>>topic::The topic of the PubSub channel.It is usually the same as the id set by PubSubListen().You can also use "." to implement topic-based sending, such as when both "abc.one" and "abc.two" are being subscribed, sending "abc" will notify both channels
//>>message::The data will be sent
//>>isSync::Whether to synchronize sending
//>>isFailMark::If the sending fails, should it be recorded and then resent when there is a new listen
//>>return::true/false
function PubSubSend (topic, message, isSync= false, isFailMark = true){
    let result = false;
    try{
        //STEP::Send message
        if(isSync){
            result = PubSub.publishSync(topic, message);
            if(result===true || isFailMark === false)
                return result;
        }
        const copyData = cloneDeep(message)
        if(!isSync)
            result = PubSub.publish(topic, copyData);

        //WHEN::Send fail
        if(!result && isFailMark){
            if(topic in _PubSubQueue)
                _PubSubQueue[topic].push(copyData);
            else
                _PubSubQueue[topic] = [copyData];
            result = true
        }
    }catch(e){
        console.debug("Common-Tools PubSubSend exception", e);
    }
    return result;
}

//TIPS::Check whether the id has been subscribed
//>>id::The id that needs to be checked
//>>return::true/false
function PubSubCheck(id){
    try{
        return PubSub.hasSubscribers(id);
    }catch(e){
        console.debug("Common-Tools PubSubCheck exception", e);
    }
    return false;
}

export {PubSubListen, PubSubCancel, PubSubSend, PubSubCheck};