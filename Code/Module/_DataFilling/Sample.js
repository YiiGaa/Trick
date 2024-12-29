import React from "react"
import ReactDOM from "react-dom/client"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode"
import _DataFilling from "/Code/Module/_DataFilling/_DataFilling.js"

//WHEN::Test for calling module
function TestCall() {
    //STEP::Init data pool
    let result = ErrorCode.ERR_OK;
    let moduleParam = {};
    const passParam = {
        "key-1":"value",
        "key-2":1,
        "key-3":true,
        "key-4":{
            "key-4-1":true,
            "key-4-2":[
                {"key-4-2-2":"2"},
                true,
                123
            ]
        },
        "key-5":[
            {"key-5-1":"1", "key-5-2":"2"}
        ],
        "key-6":{
            "key-6-1":[
                "1",
                {"key-6-1-1":"123"}
            ]
        },
        "key-11": {
            "aaa":"aaa"
        }
    };
    Logger.SetId();
    console.debug(Logger.Header(), "Action start, moduleParam:", moduleParam, "passParam:", passParam);

    try{
        //STEP::Call Module
        moduleParam = {
            "_setting":{
                "key-1":null,
                "key-2":11,
                "opt##key-3":3.5,
                "key-4":{
                    "key-4-1":3.4,
                    "key-4-2":[
                        {"key-4-2-1":"value"},
                        false
                    ]
                },
                "push##key-5":[
                    "123",
                    true
                ],
                "key-6>>key-6-1>>1>>key-6-1-1":false,
                "key-7":"uuid",
                "key-8":"uuid short",
                "key-9":"random id",
                "key-10":"get##key-4+time",
                "key-1@get##key-2@":"time",
                "switch##key-11>>aaa":{
                    "reg##a":true
                }
            }
        }
        result = _DataFilling(moduleParam, passParam);
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