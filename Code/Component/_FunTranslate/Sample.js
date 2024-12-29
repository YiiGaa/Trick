import React from "react"
import ReactDOM from "react-dom/client"
import _FunTranslate from "/Code/Component/_FunTranslate/_FunTranslate.js"
import Logger from "/Code/Common/Logger/Logger"
import Lang from "/Code/Common/Lang/Lang"
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

//STEP::Simple init i18next
Lang.InitSimple("def",{
    "def":{
        "translation":{
            "desc":"A modular native web page framework, designed by <a>Stop Refactoring</a>"
        }
    }
})

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_value":"desc",
    "_html":{
        "a":"<a target='_blank' href='https://github.com/YiiGaa/Trick'/>"
    }
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="flex justify-center items-center h-screen">
            <_FunTranslate config={config}>
            </_FunTranslate>
        </div>
    </React.StrictMode>
);