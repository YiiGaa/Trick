import React from "react"
import ReactDOM from "react-dom/client"
import _CompButton from "/Code/Component/_CompButton/_CompButton.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall(data) {
    console.log("TestCall callBack:", data)
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_onClick":TestCall
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <_CompButton config={config}>
                Button
            </_CompButton>
        </div>
    </React.StrictMode>
);