DebuggingTools_asyncWattingFlag = true;

var DebuggingTools_InsertControl_LoopId = 0;
var DebuggingTools_fillingArr = [];
var DebuggingTools_Body = "";
var DebuggingTools_Lib = [];
var DebuggingTools_config = {
                            "startFilling":"<!--@@",
                            "endFilling":"@@-->",
                            "startTempl":"<!--######",
                            "endTempl":"######-->",
                            "callBackFunction":"",
                            "startLib":'\\.\\/lib\\/',
                            "endLib":'\\"'
                        }
var DebuggingTools_InsertControl = function(callBackFunction){
    DebuggingTools_config['callBackFunction'] = callBackFunction;

    var body = document.body.innerHTML;
    DebuggingTools_Body = body;
    var fillingRegx =new RegExp(eval('/'+DebuggingTools_config['startFilling']+'(.+?)'+DebuggingTools_config['endFilling']+'/g'));

    DebuggingTools_fillingArr = body.match(fillingRegx);
    DebuggingTools_InsertControl_LoopId = 0;
    DebuggingTools_InsertControl_Loop();
}

var DebuggingTools_InsertControl_Loop = function(){
    var controlPath = '../../Control';
    try{
        var Templ = (DebuggingTools_fillingArr[DebuggingTools_InsertControl_LoopId].replace(DebuggingTools_config['startFilling'], DebuggingTools_config['startTempl'])).replace(DebuggingTools_config['endFilling'], DebuggingTools_config['endTempl']);
    }catch(e){//when have none control
        (DebuggingTools_config['callBackFunction'])();
        return;
    }
    var templRegx =new RegExp(eval('/'+Templ+'(.+?)'+Templ+'/g'));
    var libRegx =new RegExp(eval('/'+DebuggingTools_config['startLib']+'(.+?)'+DebuggingTools_config['endLib']+'/g'));

    var control = (DebuggingTools_fillingArr[DebuggingTools_InsertControl_LoopId].replace(DebuggingTools_config['startFilling'], "")).replace(DebuggingTools_config['endFilling'], "");
    var controlTarget = controlPath + "/" + control + "/" + control + ".html";
    var controlTargetJs = controlPath + "/" + control + "/" + control + ".js";
    var controlTargetCss = controlPath + "/" + control + "/" + control + ".css";
    console.log("Control load "+control);
    //load control html
    $.ajax({
        //提交数据的类型 POST GET
        type: 'GET',
        url: controlTarget,
        success: function (data) {
            var tempHtml = data;
            var tempHtml = tempHtml.replace(/[\r\n]/g, "");
            var tempArr = tempHtml.match(templRegx);
            var libArr = tempHtml.match(libRegx);
    
            if(libArr!= null){ 
                for(var i=0;i<libArr.length;i++){
                    var templib = (libArr[i].replace('"',"")).replace('./lib',controlPath + "/" + control + "/" +"lib");
                    DebuggingTools_Lib.push(templib);
                }
            }
            //console.log(tempArr[0]);   //tempArr[0]为取出来的控件html
            //insert control html
            DebuggingTools_Body = DebuggingTools_Body.replace(DebuggingTools_fillingArr[DebuggingTools_InsertControl_LoopId], tempArr[0]);
    
            //load control css
            $("<link>")
                .attr({ rel: "stylesheet",
                type: "text/css",
                href: controlTargetCss
                })
                .appendTo("head");
            
            //load control js
            jQuery.getScript(controlTargetJs)
                .done(function() {  
                    DebuggingTools_InsertControl_LoopId++;
                    if(DebuggingTools_InsertControl_LoopId < DebuggingTools_fillingArr.length){
                        DebuggingTools_InsertControl_Loop();
                    }else{
                        document.body.innerHTML = DebuggingTools_Body;
    
                        if(DebuggingTools_Lib.length == 0){
                            (DebuggingTools_config['callBackFunction'])();
                        } else {
                            DebuggingTools_InsertControl_LoadLib(0);
                        }
                    }
                })  
                .fail(function() {  
                    console.log("control js load FailLoad :"+controlTargetJs)
                });
        },
        error: function (data) {
            console.log("control load Error :"+control)
        }
    });
}



var DebuggingTools_InsertControl_LoadLib = function(id){

    console.log("lib load :" + DebuggingTools_Lib[id]);
    if((DebuggingTools_Lib[id]).indexOf("css") != -1){
        $("<link>")
            .attr({ rel: "stylesheet",
            type: "text/css",
            href: DebuggingTools_Lib[id]
            })
            .appendTo("head");
        DebuggingTools_InsertControl_LoadLib_Loop(id);
    } else {
        jQuery.getScript(DebuggingTools_Lib[id])
            .done(function() {  
                DebuggingTools_InsertControl_LoadLib_Loop(id);
            })
            .fail(function(error) {
                if(error.readyState==0){
                    console.log("lib load FailLoad :" + DebuggingTools_Lib[id])
                }else{
                    console.log("lib load FailLoad(It may has been loaded by other module.) :" + DebuggingTools_Lib[id])
                    DebuggingTools_InsertControl_LoadLib_Loop(id);
                }
            });
    }
}

var DebuggingTools_InsertControl_LoadLib_Loop = function(id){
    id++;
    if(id < DebuggingTools_Lib.length){
        DebuggingTools_InsertControl_LoadLib(id);
    } else {
        //window.location.reload()
        (DebuggingTools_config['callBackFunction'])();
    }
}
