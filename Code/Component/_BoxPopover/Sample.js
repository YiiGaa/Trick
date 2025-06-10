import React from "react"
import ReactDOM from "react-dom/client"
import _BoxPopover from "/Code/Component/_BoxPopover/_BoxPopover.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import {ChevronDownIcon} from "@heroicons/react/20/solid";

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    // let data = {
    //     "_action":"setting",
    //     "_text":"xxx1"
    // };
    // Tools.PubSubSend("id_test", data);

    let data = {
        "_action":"show"
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_templButton":"child##0",
    "_templPanel":"child##1",
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <button
            className="absolute py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
            onClick={TestCall}
        >
            Test Show
        </button>
        <div className="flex justify-center items-center h-screen">
            <_BoxPopover config={config}>
                <div
                    className="transition-colors text-[length:--Theme-Text-XL] group-data-[open]:text-[--Theme-Color-ActiveHover] hover:text-[--Theme-Color-ActiveHover] duration-[--Theme-TransDuration] group flex justify-between -items-center"
                >
                    Title text
                    <ChevronDownIcon
                        className="transition-transform group-data-[open]:rotate-180 duration-[--Theme-TransDuration] w-[--Theme-Text-XL] items-center"
                    />
                </div>
                <div>
                    <li className="text-[--Theme-Color-Text-SM]">
                        Lorem ipsum dolor 1
                    </li>
                    <li className="text-[--Theme-Color-Text-SM]">
                        Lorem ipsum dolor 2
                    </li>
                    <li className="text-[--Theme-Color-Text-SM]">
                        Lorem ipsum dolor 3
                    </li>
                </div>
            </_BoxPopover>
        </div>
    </React.StrictMode>
);