import React from "react"
import ReactDOM from "react-dom/client"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode"
import _OperStorage from "/Code/Module/_OperStorage/_OperStorage.js"

//WHEN::Test for calling module
function TestCall() {
    //STEP::Init data pool
    let result = ErrorCode.ERR_OK;
    let moduleParam = {};
    const passParam = {};
    Logger.SetId();
    console.debug(Logger.Header(), "Action start, moduleParam:", moduleParam, "passParam:", passParam);

    try{
        //STEP::Call Module
        moduleParam = {
            "_action":"save",
            "_key":"key-1",
            "_isSession":true,
            "_expire":3600,
            "_value":{"key":"value"}
        }
        result = _OperStorage(moduleParam, passParam);
        if(ErrorCode.IsError(result)){
            return null;
        }

        //STEP::Call Module
        moduleParam = {
            "_action":"get",
            "_key":"key-1",
            "_isSession":true
        }
        result = _OperStorage(moduleParam, passParam);
        if(ErrorCode.IsError(result)){
            return null;
        }

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