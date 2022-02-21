/********************
    @Describe: ReplayButton structure
    @Param: param = [*]
    @Return: null
    @BeCareful:
********************/ 
/*@@@@@@control-start@@@@@@*/

function ControlReplayButton(params) {
    var ModuleId = {
        "bodyId":"#id_ReplayButton_body"
    }
    var Config = {
        "selectCallBackFunction":params["selectCallBackFunction"]
    }

    var VueObject_Body;
    this.initialize = function(){
        try {
            VueObject_Body = new Vue({
                el:ModuleId["bodyId"],
                data:{
                    Vue_ReplayButton_isHide:true
                },
                methods:{
                    Vue_ReplayButton_Function: function (data) {
                        VueObject_Body.Vue_ReplayButton_isHide = true;
                        NotifyCallBackFunction("selectCallBackFunction", data)
                    }
                }
            });
        } catch (e) {
            console.log("ReplayButton exception.");
            console.log(e);
        }
    };

    var NotifyCallBackFunction = function(key, data) {
        var notify = Config[key]
        if (notify) {
            notify(data)
        }
    }

    this.Show = function(data){
        VueObject_Body.Vue_ReplayButton_isHide = false;
    }

    this.Hide = function(data){
        VueObject_Body.Vue_ReplayButton_isHide = true;
    }
}

/*@@@@@@control-end@@@@@@*/

/**Loading Common Lib**/
var ControlLoad = function(){
    lib_Load('../../Common/Lib/', ControlInit);
}

/**The following code is the test code**/
var testfunction = function(data){
    console.log(data)

    setTimeout(function(){
        ReplayButton.Show()
    }, 3000)
}
                   
var ReplayButton;
var ControlInit = function(){
    var ReplayButtonInfo = {
        "selectCallBackFunction":testfunction,
    };
    ReplayButton = new ControlReplayButton(ReplayButtonInfo);
    ReplayButton.initialize();

    setTimeout(function(){
        ReplayButton.Show()
    }, 3000)
}
