import React from "react"
import ReactDOM from "react-dom/client"
import _BoxDropdown from "/Code/Component/_BoxDropdown/_BoxDropdown.js"
import Logger from "/Code/Common/Logger/Logger"

//WHEN::Test for calling component
function TestCall(data) {
    console.debug(Logger.Header(), "TestCall: data", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_map":[
        { "_templ":"Menu item 1", "_onClick":TestCall, "_data":"test"},
        { "_templ":"Menu item 2", "_onClick":TestCall},
        { "_templ":"Menu item 3"}
    ],
    "_onClick":TestCall
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <_BoxDropdown config={config}>
                <button
                    className="py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
                >
                    Test Button
                </button>
            </_BoxDropdown>
        </div>
    </React.StrictMode>
);