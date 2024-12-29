import React from "react"
import ReactDOM from "react-dom/client"
import _BoxMotion from "/Code/Component/_BoxMotion/_BoxMotion.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import clsx from "clsx";

let show = true;

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_action":"show",
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_map":[
        {"_templ":"child##"},
        {"_templ":"child##"}
    ]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <button
            className="absolute py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
            onClick={TestCall}
        >
            Test Switch
        </button>
        <div className="flex justify-center items-center h-screen">
            <_BoxMotion config={config}>
                <div
                    className={clsx(
                        'size-[6.25rem] rounded-xl bg-[--Theme-Color-Active] transition duration-400',
                        'data-[closed]:scale-50 data-[closed]:rotate-[-120deg] data-[closed]:opacity-0',
                        'data-[leave]:duration-200 data-[leave]:ease-in-out',
                        'data-[leave]:data-[closed]:scale-95 data-[leave]:data-[closed]:rotate-[0deg]'
                    )}
                />
            </_BoxMotion>
        </div>
    </React.StrictMode>
);