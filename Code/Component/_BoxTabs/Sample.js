import React from "react"
import ReactDOM from "react-dom/client"
import _BoxTabs from "/Code/Component/_BoxTabs/_BoxTabs.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_action":"setting",
        "_active":1
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_map":[
        {
            "_templTab":"child##0",
            "_templPanel":"child##1"
        },{
            "_templTab":"child##2",
            "_templPanel":"child##3"
        }
    ],
    "_classBody":"rounded-[--Theme-Gap] shadow-[shadow:--Theme-BoxShadow] p-[--Theme-Gap]",
    "_classTabs":"flex flex-row space-x-[--Theme-Gap]",
    "_classTabsItem":"w-full data-[hover]:text-[--Theme-Color-ActiveHover] duration-[--Theme-TransDuration] data-[selected]:text-[--Theme-Color-Active] text-[length:--Theme-Text-LG]",
    "_classPanel":"pt-[--Theme-Gap-SM]",
    "_classPanelItem":"overflow-hidden"
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
            <div className="w-1/2 h-2/3">
                <_BoxTabs config={config}>
                    <div className="group relative pb-[--Theme-Gap-SM]">
                        tabs 1
                        <div
                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-[--Theme-Color-Active] scale-x-0 duration-[--Theme-TransDuration] group-data-[hover]:scale-x-100 group-data-[selected]:scale-x-100"></div>
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur deleniti distinctio
                        eveniet expedita, inventore itaque possimus recusandae sunt ullam. Ab at commodi explicabo
                        necessitatibus nulla quas quasi recusandae? Aperiam dignissimos distinctio dolor exercitationem
                        facere id illum maxime molestias necessitatibus nobis nostrum qui, sed similique sint veniam. A
                        ad asperiores at culpa cumque, deleniti expedita explicabo fugiat incidunt ipsa ipsam, maiores
                        minima mollitia necessitatibus nemo nisi nulla officiis perferendis placeat quibusdam quidem
                        quod, quos similique tempora tempore veniam voluptas voluptatem voluptatum!
                    </div>
                    <div className="group relative pb-[--Theme-Gap-SM]">
                        tabs 2
                        <div
                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-[--Theme-Color-Active] transform scale-x-0 transition-transform duration-[--Theme-TransDuration] group-data-[hover]:scale-x-100 group-data-[selected]:scale-x-100"></div>
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aut dolorem excepturi harum
                        hic laboriosam maiores maxime molestiae nam neque odit perspiciatis porro quam, ratione saepe
                        sapiente temporibus voluptas voluptate.
                    </div>
                </_BoxTabs>
            </div>
        </div>
    </React.StrictMode>
);