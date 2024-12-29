import React from "react"
import ReactDOM from "react-dom/client"
import _BoxFlex from "/Code/Component/_BoxFlex/_BoxFlex.js"
import Logger from "/Code/Common/Logger/Logger"
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

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_map":[
        {"_templ":"child##0","_classItem":"w-full", "_isFill":false, "_backdrop":true},
        {"_templ":"child##0","_classItem":"w-full md:w-[30rem]" ,"_isFill":false, "_backdrop":true},
        {"_templ":"child##1","_classItem":""},
        {"_templ":"child##0","_classItem":"w-full hidden md:block", "_isFill":false, "_backdrop":true}
    ]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="p-[--Theme-Gap]">
            <_BoxFlex config={config}>
                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nobis, provident? Accusamus accusantium aspernatur corporis cupiditate debitis dicta dignissimos ducimus earum eius error esse expedita facilis id illo incidunt ipsa iusto maiores necessitatibus nemo non porro quasi ratione reprehenderit rerum sapiente soluta, velit? Aliquid facere nihil non saepe sapiente sint. Animi architecto assumenda atque aut beatae consequuntur dolor enim fugit harum hic impedit inventore laboriosam laudantium nam natus nihil obcaecati optio porro provident quasi recusandae reprehenderit sequi sit, suscipit voluptate. Ab dicta minus nesciunt repellat vel. Animi asperiores assumenda, beatae commodi est, iusto, libero non nostrum perspiciatis reprehenderit sint tempora.</div>
                <_BoxFlex config={config}>
                    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nobis, provident? Accusamus accusantium aspernatur corporis cupiditate debitis dicta dignissimos ducimus earum eius error esse expedita facilis id illo incidunt ipsa iusto maiores necessitatibus nemo non porro quasi ratione reprehenderit rerum sapiente soluta, velit? Aliquid facere nihil non saepe sapiente sint. Animi architecto assumenda atque aut beatae consequuntur dolor enim fugit harum hic impedit inventore laboriosam laudantium nam natus nihil obcaecati optio porro provident quasi recusandae reprehenderit sequi sit, suscipit voluptate. Ab dicta minus nesciunt repellat vel. Animi asperiores assumenda, beatae commodi est, iusto, libero non nostrum perspiciatis reprehenderit sint tempora.</div>
                    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci blanditiis, eaque et harum libero odio perspiciatis quisquam similique velit voluptas?</div>
                </_BoxFlex>
            </_BoxFlex>
        </div>
    </React.StrictMode>
);