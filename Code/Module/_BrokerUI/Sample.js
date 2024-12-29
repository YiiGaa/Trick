import React from "react"
import ReactDOM from "react-dom/client"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode"
import _BrokerUI from "/Code/Module/_BrokerUI/_BrokerUI.js"

//TIPS::For test
function TestUIAction(param, handler){
    console.log("TestUIAction accept", param);
    param["ui get"] = "ui data";
}
Tools.PubSubListen("id_test", TestUIAction , {});

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
            "_id":"id_test"
        }
        result = _BrokerUI(moduleParam, passParam);
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