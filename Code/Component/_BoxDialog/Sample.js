import React from "react"
import ReactDOM from "react-dom/client"
import _BoxDialog from "/Code/Component/_BoxDialog/_BoxDialog.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_isOpen":true
    };
    Tools.PubSubSend("id_test", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_isOpen":true
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <button
            className="py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
            onClick={TestCall}
        >
            Test Button
        </button>
        <_BoxDialog config={config}>
            <h1
                className="text-[length:--Theme-Text-XL]"
            >
                Title
            </h1>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum dolor iure nostrum quia repellendus rerum
                sapiente sunt voluptatibus? Accusantium cupiditate dicta dolores esse est, et facilis, iusto minus molestiae
                nobis nostrum quae quas qui sint, sit suscipit ullam vitae? Adipisci autem debitis, ducimus ex maiores odit
                soluta? A, consequatur et fuga illum incidunt libero molestiae natus odit, perferendis quae quam reprehenderit
                vel voluptatem. Accusamus accusantium aliquam aliquid amet assumenda beatae consectetur corporis cum delectus
                deserunt dolor dolorem eaque eum expedita facere fugiat ipsa ipsum, labore minima officia praesentium quidem
                quis quisquam quod recusandae reprehenderit sint tenetur, totam unde veritatis voluptatem.
            </div>
        </_BoxDialog>
    </React.StrictMode>
);