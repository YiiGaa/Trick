import React from "react"
import ReactDOM from "react-dom/client"
import _CompInput from "/Code/Component/_CompInput/_CompInput.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall(data) {
    console.log("TestCall CallBack", data)
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_onChange":TestCall
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <div className="w-[30rem]">
                <_CompInput config={config}></_CompInput>
            </div>
        </div>
    </React.StrictMode>
);