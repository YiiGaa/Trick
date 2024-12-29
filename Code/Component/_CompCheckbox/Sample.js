import React from "react"
import ReactDOM from "react-dom/client"
import _CompCheckbox from "/Code/Component/_CompCheckbox/_CompCheckbox.js"
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
            <_CompCheckbox config={config}>
                <div className="ml-[--Theme-Gap-XS]">Check</div>
            </_CompCheckbox>
        </div>
    </React.StrictMode>
);