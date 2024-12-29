import React from "react"
import ReactDOM from "react-dom/client"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode"
import _OperEvent from "/Code/Module/_OperEvent/_OperEvent.js"

function Test_CallBack(data){
    console.log("Test_CallBack", data)

    let result = ErrorCode.ERR_OK;
    let moduleParam = {};
    const passParam = {};

    moduleParam = {
        "_action":"timer remove",
        "_id":"$timer",
    }
    result = _OperEvent(moduleParam, passParam);
    if(ErrorCode.IsError(result)){
        return null;
    }

    // moduleParam = {
    //     "_action":"event window",
    //     "_event":"click",
    //     "_isRemove":true,
    //     "_call":Test_CallBack,
    // }
    // result = _OperEvent(moduleParam, passParam);
    // if(ErrorCode.IsError(result)){
    //     return null;
    // }

    //STEP::Call Module
    moduleParam = {
        "_action":"event document",
        "_event":"click",
        "_isRemove":true,
        "_query":"body",
        "_call":Test_CallBack,
    }
    result = _OperEvent(moduleParam, passParam);
    if(ErrorCode.IsError(result)){
        return null;
    }
}

//WHEN::Test for calling module
function TestCall(event) {
    event.stopPropagation();

    //STEP::Init data pool
    let result = ErrorCode.ERR_OK;
    let moduleParam = {};
    const passParam = {};
    Logger.SetId();
    console.debug(Logger.Header(), "Action start, moduleParam:", moduleParam, "passParam:", passParam);

    try{
        //STEP::Call Module
        moduleParam = {
            "_action":"timer add",
            "_id":"$timer",
            "_isLoop":true,
            "_time":1000,
            "_call":{"_call":Test_CallBack,"_data":{"key":"value"}},
        }
        result = _OperEvent(moduleParam, passParam);
        if(ErrorCode.IsError(result)){
            return null;
        }

        // //STEP::Call Module
        // moduleParam = {
        //     "_action":"event window",
        //     "_event":"click",
        //     "_call":Test_CallBack,
        // }
        // result = _OperEvent(moduleParam, passParam);
        // if(ErrorCode.IsError(result)){
        //     return null;
        // }

        // //STEP::Call Module
        // moduleParam = {
        //     "_action":"event document",
        //     "_event":"click",
        //     "_query":"body",
        //     "_call":Test_CallBack,
        // }
        // result = _OperEvent(moduleParam, passParam);
        // if(ErrorCode.IsError(result)){
        //     return null;
        // }

        // //STEP::Call Module
        // moduleParam = {
        //     "_action":"event document",
        //     "_event":"click",
        //     "_query":"body",
        //     "_call":Test_CallBack,
        // }
        // result = _OperEvent(moduleParam, passParam);
        // if(ErrorCode.IsError(result)){
        //     return null;
        // }

    } finally {
        console.debug(Logger.Header(), "Action end, result:", result , "moduleParam:", moduleParam, "passParam:", passParam);
    }
}

//STEP::Generate module test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <button
        className="py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
        onClick={TestCall}
    >
        Test Button
    </button>
);