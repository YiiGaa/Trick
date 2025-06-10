import React from "react"
import ReactDOM from "react-dom/client"
import _BoxTabs from "/Code/Component/_BoxTabs/_BoxTabs.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_action":"change",
        "_active":1
    };
    Tools.PubSubSend("id_test", data);
}

function TestNotify(data) {
    console.log("**Change select:", data);
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_onChange":TestNotify,
    "_map":[
        {
            "_templTab":"tabs 1",
            "_templPanel":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam commodi dolor, dolorem doloremque fugiat illo, iste iusto libero molestiae molestias nulla perferendis quae rem rerum suscipit tempora, vitae. Dolorum error explicabo itaque nostrum perferendis quia reiciendis suscipit. Eligendi facilis fugiat, iusto minus nemo odit praesentium provident quae quam quibusdam tempora ullam voluptate voluptatem. Adipisci consectetur nesciunt quia. Aspernatur beatae dicta dignissimos ducimus esse et ex fuga, fugiat illum inventore itaque nihil non perferendis quas quia quo ratione sapiente sit tempora temporibus veniam veritatis voluptate. Aliquid architecto cupiditate ea eum incidunt odio rerum soluta sunt voluptas! Ab eveniet illo quam."
        },{
            "_templTab":"tabs 2",
            "_templPanel":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aut dolorem excepturi harum hic laboriosam maiores maxime molestiae nam neque odit perspiciatis porro quam, ratione saepe sapiente temporibus voluptas voluptate."
        },{
            "_templTab":"tabs 3",
            "_templPanel":"Lorem ipsum dolor sit amet, consectetur adipisicing elit."
        }
    ],
    "_class":"rounded-[--Theme-Gap] shadow-[shadow:--Theme-BoxShadow] p-[--Theme-Gap]",
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
                <_BoxTabs config={config}/>
            </div>
        </div>
    </React.StrictMode>
);