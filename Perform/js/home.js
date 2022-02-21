
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

var WelcomeDrawing;
var ReplayButton;
var PageInitialize = function(){
    /*write your code*/
    
    var WelcomeDrawingInfo = {
        "title":"Trick",
        "info":"Limit for Infinity",        
        "textLixt":[
            "Hello",
            "I am Trick",
            "A modular native web page framework",
            "I think",
            "Development should be",
            "Simple",
            "Regular",
            "And",
            "Compound interest",
        ],
      "endCallBackFunction":Page_WelcomeEnd,
    };
    WelcomeDrawing = new ControlWelcomeDrawing(WelcomeDrawingInfo);
    WelcomeDrawing.initialize();

    var ReplayButtonInfo = {
        "selectCallBackFunction":Page_ReplayClick,
    };
    ReplayButton = new ControlReplayButton(ReplayButtonInfo);
    ReplayButton.initialize();

    LoadData();
}

var PageLoadFinish = function(){
    /*write your code*/
}

var LoadData = function(){
    /*write your code*/

    PageLoadFinish();
}

var Page_WelcomeEnd = function(data){
    ReplayButton.Show();
}

var Page_ReplayClick = function(data){
    WelcomeDrawing.Show();
}

var testfunction = function(data){
    /*Prevent page errors caused by referencing test callback functions*/
}


/****Notes****/
/****Notes****/

