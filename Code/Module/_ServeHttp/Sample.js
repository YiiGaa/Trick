import React from "react"
import ReactDOM from "react-dom/client"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode"
import _ServeHttp from "/Code/Module/_ServeHttp/_ServeHttp.js"

const testFileContent = 'A'.repeat(1024);
const testFileBlob = new Blob([testFileContent], { type: 'text/plain' });
const testFile = new File([testFileBlob], 'sample.txt', {type: 'text/plain', lastModified: Date.now()});

//WHEN::Test for calling module
async function TestCall() {
    //STEP::Init data pool
    let result = ErrorCode.ERR_OK;
    let moduleParam = {};
    const passParam = {};
    Logger.SetId();
    console.debug(Logger.Header(), "Action start, moduleParam:", moduleParam, "passParam:", passParam);

    try{
        //STEP::Call Module
        moduleParam = {
            "_action":"normal",
            "_url":"/api/test",
            "_method":"POST",
            "_param":{
                "test":"test",
                "file":testFile
            },
            "_resultKey":"result"
        }
        // moduleParam = {
        //     "_action":"multiple",
        //     "_list": [
        //         {
        //             "_url":"/api/test/1",
        //             "_method":"POST",
        //             "_param":{
        //                 "test1":"test",
        //                 "file":testFile
        //             }
        //         },{
        //             "_url":"/api/test/2",
        //             "_method":"POST",
        //             "_param":{
        //                 "test2":"test",
        //                 "file":testFile
        //             }
        //         }
        //     ]
        // }
        result = await _ServeHttp(moduleParam, passParam);
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
        onClick={()=>{TestCall()}}
    >
        Test Button
    </button>
);