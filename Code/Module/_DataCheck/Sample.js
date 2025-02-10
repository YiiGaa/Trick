import React from "react"
import ReactDOM from "react-dom/client"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode"
import _DataCheck from "/Code/Module/_DataCheck/_DataCheck.js"

//WHEN::Test for calling module
function TestCall() {
    //STEP::Init data pool
    let result = ErrorCode.ERR_OK;
    let moduleParam = {};
    const passParam = {
        "key-1":true,
        "key-2":[123],
        "key-3":"teest",
        "key-4":"best",
        "key-5":5.4,
        "key-6":{
            "key-6-1":true,
            "key-6-2":["123", "456"],
            "key-6-3":[
                {"key-6-3-1":"value","key-6-3-2":"value","key-6-3-3":123},
                {"key-6-3-1":"value","key-6-3-2":"value","key-6-3-3":123},
                true
            ],
            "key-6-4":{
                "abc":{
                    "x":"123"
                },
                "aaa":{
                    "xx":[
                        "true",
                        {"xx":"yy"}
                    ]
                }
            }
        },
        "key-7":{"key-7-1":"value","key-7-2":"value","key-7-3":123},
        "key-8":{"clean":true}
    };
    Logger.SetId();
    console.debug(Logger.Header(), "Action start, moduleParam:", moduleParam, "passParam:", passParam);

    try{
        //STEP::Call Module
        moduleParam = {
            "_isClean":true,
            "_param":{
                "key-1":true,
                "key-2":"",
                "key-3":"reg##te+st",
                "key-4":"str##",
                "key-5":"double##3.5/5.4",
                "key-6":{
                    "key-6-1":true,
                    "2##key-6-2":[],
                    "key-6-3":[
                        {"key-6-3-1":"value","key-6-3-2":"value"},
                        true,
                        123
                    ],
                    "key-6-4>>abc>>x":"123",
                    "key-6-4>>aaa>>xx>>1>>xx":"yy"
                },
                "key-7":{}
            }
        }
        result = _DataCheck(moduleParam, passParam);
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