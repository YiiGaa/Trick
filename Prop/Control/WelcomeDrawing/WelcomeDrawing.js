/********************
    @Describe: WelcomeDrawing structure
    @Param: param = [*]
    @Return: null
    @BeCareful:
********************/ 
/*@@@@@@control-start@@@@@@*/

function ControlWelcomeDrawing(params) {
    var ModuleId = {
        "bodyId":"#id_WelcomeDrawing_body"
    }
    var Config = {
        "endCallBackFunction":params["endCallBackFunction"]
    }

    var VueObject_Body;
    this.initialize = function(){
        try {
            VueObject_Body = new Vue({
                el:ModuleId["bodyId"],
                data:{
                    Vue_WelcomeDrawing_Title:params["title"],
                    Vue_WelcomeDrawing_Info:params["info"],
                    Vue_WelcomeDrawing_Text:params["textLixt"][0]
                }
            });

            this.Show()
        } catch (e) {
            console.log("WelcomeDrawing exception.");
            console.log(e);
        }
    };

    var NotifyCallBackFunction = function(key, data) {
        var notify = Config[key]
        if (notify) {
            notify(data)
        }
    }

    var textLixt = params["textLixt"];
    this.Show = function(data){
        $(".WelcomeDrawing_point").css("display","block");
        $(".WelcomeDrawing_title").css("display","none");
        $(".WelcomeDrawing_point").css("width","40px");
        $(".WelcomeDrawing_Background").css("opacity","0");
        VueObject_Body.Vue_WelcomeDrawing_Text = textLixt[0];

        var loopTime = 0;
        var textSize =  textLixt.length;
        var timeLine = anime.timeline({
            duration: 2600,
            loop:textSize,
            loopComplete: function(anim) {
                loopTime++;
                if(loopTime == textSize){
                    VueObject_Body.Vue_WelcomeDrawing_Text = "";
                    $(".WelcomeDrawing_rightpoint").css("transform","translateX(0px)");
                    $(".WelcomeDrawing_leftpoint").css("transform","translateX(0px)");
                    $(".WelcomeDrawing_point").css("display","none");
                    $(".WelcomeDrawing_title").css("display","block");

                    NotifyCallBackFunction("endCallBackFunction", 'end');
                    return;
                }
                
                VueObject_Body.Vue_WelcomeDrawing_Text = textLixt[loopTime%textSize]
                $(".WelcomeDrawing_Background").css("opacity",""+loopTime/textSize*0.2);
            }
        });

        timeLine.add({
            targets: '.WelcomeDrawing_rightpoint',
            translateX: {
                value: '+=200px',
                duration: 1000
            },
            width: {
                value: '-=20px',
                duration: 1800,
                easing: 'easeInOutSine'
            },
            rotate: {
                value: '+=4turn',
                duration: 2500,
                easing: 'easeInOutSine'
            },
        })
        .add({
            targets: '.WelcomeDrawing_leftpoint',
            translateX: {
                value: '-=240px',
                duration: 1000
            },
            width: {
                value: '-=20px',
                duration: 1800,
                easing: 'easeInOutSine'
            },
            rotate: {
                value: '-=4turn',
                duration: 2500,
                easing: 'easeInOutSine'
            }
        },0)
        .add({
            targets: '.WelcomeDrawing_text',
            duration: 2500,
            opacity:1,
        },100);
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
        WelcomeDrawing.Show()
    }, 3000)
}

var WelcomeDrawing;
var ControlInit = function(){
    var WelcomeDrawingInfo = {
        "title":"Trick",
        "info":"Limit for Infinity",        
        "textLixt":[
            "Hello",
            "I am Trick",
            "A modular native web page framework",
            "I think",
            "Development should be"
        ],
      "endCallBackFunction":testfunction,
    };
    WelcomeDrawing = new ControlWelcomeDrawing(WelcomeDrawingInfo);
    WelcomeDrawing.initialize();
}
