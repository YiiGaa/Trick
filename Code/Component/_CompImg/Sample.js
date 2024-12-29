import React from "react"
import ReactDOM from "react-dom/client"
import _CompImg from "/Code/Component/_CompImg/_CompImg.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_src":"//img.png"
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <div className="w-[40rem]">
                <_CompImg config={config}>
                </_CompImg>
            </div>
        </div>
    </React.StrictMode>
);