import React from "react"
import ReactDOM from "react-dom/client"
import _BoxCollapse from "/Code/Component/_BoxCollapse/_BoxCollapse.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"
import { ChevronDownIcon } from '@heroicons/react/20/solid'

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_action":"switch"
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_templButton":"child##0",
    "_templPanel":"child##1",
    "_class":"rounded-[--Theme-Gap] shadow-[shadow:--Theme-BoxShadow] p-[--Theme-Gap]"
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <button
            className="absolute py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
            onClick={TestCall}
        >
            Test Toggle
        </button>
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/2 h-2/3">
                <_BoxCollapse config={config}>
                    <div
                        className="text-[length:--Theme-Text-XL] hover:text-[--Theme-Color-ActiveHover] duration-300 group flex justify-between -items-center"
                    >
                        Title text
                        <ChevronDownIcon
                            className="group-data-[open]:rotate-180 duration-[--Theme-TransDuration] w-[--Theme-Text-XL] items-center"
                        />
                    </div>
                    <div className="text-[--Theme-Color-Text-SM]">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium amet at aut commodi, cum
                        dolore ducimus esse eveniet harum hic id incidunt inventore ipsum magnam magni nisi numquam qui,
                        rerum vel veniam voluptates voluptatum. Asperiores, deserunt minima. Ad aliquam, amet deleniti
                        dignissimos dolorem ea enim expedita hic ipsam ipsum iusto libero minus molestiae molestias nemo
                        nobis nostrum pariatur perspiciatis porro praesentium quod reiciendis rem rerum tempore
                        temporibus ullam veniam voluptates? Architecto optio quo similique totam voluptate. Ad animi
                        assumenda at cum cumque deleniti ducimus est eveniet explicabo fugiat, inventore ipsa nihil
                        porro quia quis saepe, sequi similique soluta voluptatibus.
                    </div>
                </_BoxCollapse>
            </div>
        </div>
    </React.StrictMode>
);