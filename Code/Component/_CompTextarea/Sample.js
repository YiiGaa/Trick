import React from "react"
import ReactDOM from "react-dom/client"
import _CompTextarea from "/Code/Component/_CompTextarea/_CompTextarea.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_action":"xxx",
        "xxx":"xxx"
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test"
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <div className="w-[30rem]">
                <_CompTextarea config={config}>
                </_CompTextarea>
            </div>
        </div>
    </React.StrictMode>
);