import React from "react"
import ReactDOM from "react-dom/client"
import _CompRadio from "/Code/Component/_CompRadio/_CompRadio.js"
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
    "_id":"id_test",
    "_value":"key 1",
    "_map":[
        {"_templ":"item 1", "_value":"key 1"},
        {"_templ":"item 2", "_value":"key 2"}
    ],
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <div className="w-[10rem]">
                <_CompRadio config={config}></_CompRadio>
            </div>
        </div>
    </React.StrictMode>
);