var PageLoad = function(){
    lib_Load('../../Common/Lib/', PageLoad_Service)
}

var PageLoad_Service = function(){
    serviceLoad('../../Service/', PageLoad_Control)
}

var PageLoad_Control = function(){
    DebuggingTools_InsertControl(PageInitialize)
}

/*@@@@@@page-start@@@@@@*/
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

/*@@@@@@page-end@@@@@@*/
