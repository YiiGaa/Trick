import React from "react"
import ReactDOM from "react-dom/client"
import _BoxGrid from "/Code/Component/_BoxGrid/_BoxGrid.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall(data) {
    console.log("** TestCall", data)
}

//STEP::Setting component config for test
let config = {
    "_as":"div",
    "_prop":{},
    "_call":{},
    "_grid":[
        "30rem 1fr 1fr",
        "side title title ", "auto",
        "side info info", "auto",
        "side text text", "auto",
    ],
    "_class":"",
    "_map":[
        {
            "_area":"side",
            "_templ":"side",
            "_backdrop":true,
            "_call":{
                "onClick":TestCall
            }
        },{
            "_area":"title",
            "_templ":"title",
            "_backdrop":true,
        },{
            "_area":"info",
            "_templ":"info",
            "_backdrop":true,
        },{
            "_area":"text",
            "_templ":"child##",
            "_backdrop":true,
        }
    ]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <div className="p-[--Theme-Gap]">
            <_BoxGrid config={config}>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nobis, provident? Accusamus
                    accusantium aspernatur corporis cupiditate debitis dicta dignissimos ducimus earum eius error
                    esse
                    expedita facilis id illo incidunt ipsa iusto maiores necessitatibus nemo non porro quasi ratione
                    reprehenderit rerum sapiente soluta, velit? Aliquid facere nihil non saepe sapiente sint. Animi
                    architecto assumenda atque aut beatae consequuntur dolor enim fugit harum hic impedit inventore
                    laboriosam laudantium nam natus nihil obcaecati optio porro provident quasi recusandae
                    reprehenderit
                    sequi sit, suscipit voluptate. Ab dicta minus nesciunt repellat vel. Animi asperiores assumenda,
                    beatae commodi est, iusto, libero non nostrum perspiciatis reprehenderit sint tempora.
                </div>
                <div>
                    Orther text
                </div>
            </_BoxGrid>
        </div>
    </React.StrictMode>
);