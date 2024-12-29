import React from "react"
import ReactDOM from "react-dom/client"
import _FunLoad from "/Code/Component/_FunLoad/_FunLoad.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    config["_isLoad"] = !config["_isLoad"];
    let data = {
        "_isLoad":config["_isLoad"]
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_isLoad":true,
    "_classLoadList":["","","!w-9/12"]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <button
            className="absolute py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
            onClick={TestCall}
        >
            Test Button
        </button>
        <div className="flex justify-center items-center h-screen">
            <div
                className="bg-[--Theme-Color-Module] p-[--Theme-Gap] rounded-[--Theme-Radius] shadow-[shadow:--Theme-BoxShadow] max-w-screen-lg">
                <_FunLoad config={config}>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque harum illum ipsum iste magnam
                        maiores nobis obcaecati quia reprehenderit ut. Dolorum nulla perspiciatis quos tempore velit?
                        Asperiores aspernatur consequatur dolores facere id officia praesentium sunt tenetur! Adipisci
                        amet aperiam atque consequatur culpa cum cupiditate ducimus eaque, eum exercitationem fuga
                        fugiat in, inventore iure labore laboriosam laborum minima nihil officia praesentium qui
                        reiciendis rerum sed sunt unde vitae voluptatem. Accusantium, aliquam aliquid blanditiis
                        dignissimos distinctio earum est facilis fuga fugit illo illum ipsa labore laborum molestias
                        nisi nulla odit optio possimus provident quae quis repellat repellendus soluta temporibus totam
                        vel, voluptatibus.
                    </div>
                </_FunLoad>
            </div>
        </div>
    </React.StrictMode>
);