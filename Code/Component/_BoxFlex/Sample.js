import React from "react"
import ReactDOM from "react-dom/client"
import _BoxFlex from "/Code/Component/_BoxFlex/_BoxFlex.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall(data) {
    console.log("** TestCall", data)
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_flex": {
        "all":["column", "wrap"],
        "md":["row", "wrap"]
    },
    "_map":[
        {"_templ":"title","_class":"w-full", "_isFill":false, "_backdrop":true},
        {"_templ":"side","_class":"w-[30rem] max-md:w-full cursor-pointer" ,"_isFill":false, "_backdrop":true, "_call":{"onClick":TestCall}},
        {"_templ":"child##","_class":"w-[30rem] max-md:w-full", "_isFill":true, "_backdrop":true}
    ]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="p-[--Theme-Gap]">
            <_BoxFlex config={config}>
                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nobis, provident? Accusamus accusantium aspernatur corporis cupiditate debitis dicta dignissimos ducimus earum eius error esse expedita facilis id illo incidunt ipsa iusto maiores necessitatibus nemo non porro quasi ratione reprehenderit rerum sapiente soluta, velit? Aliquid facere nihil non saepe sapiente sint. Animi architecto assumenda atque aut beatae consequuntur dolor enim fugit harum hic impedit inventore laboriosam laudantium nam natus nihil obcaecati optio porro provident quasi recusandae reprehenderit sequi sit, suscipit voluptate. Ab dicta minus nesciunt repellat vel. Animi asperiores assumenda, beatae commodi est, iusto, libero non nostrum perspiciatis reprehenderit sint tempora.</div>
            </_BoxFlex>
        </div>
    </React.StrictMode>
);