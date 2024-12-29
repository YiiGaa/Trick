import React from "react"
import ReactDOM from "react-dom/client"
import _CompSelect from "/Code/Component/_CompSelect/_CompSelect.js"
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
    "_textPlaceholder":"Select Please ...",
    "_map":[
        { _value: "value 1", _templ: 'Durward Reynolds', _text:'Durward'},
        { _value: "value 2", _templ: 'Kenton Towne', _text:'Kenton'},
        { _value: "value 3", _templ: 'Therese Wunsch', _text:'Therese'},
        { _value: "value 4", _templ: 'Benedict Kessler', _text:'Benedict'},
        { _value: "value 5", _templ: 'Katelyn Rohan', _text:'Katelyn'},
    ]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <div className="w-[20rem]">
                <_CompSelect config={config}>
                </_CompSelect>
            </div>
        </div>
    </React.StrictMode>
);