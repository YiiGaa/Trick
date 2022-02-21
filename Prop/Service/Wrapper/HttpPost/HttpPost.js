/********************
    @Describe: Http post
    @Param: param = {
                "data":{*},        //参数
                "url":"*",      //post url，
                "return":*      //返回参数
            }
    @Return: success             //是否成功
    @BeCareful:依赖JQuery库
********************/ 
/*@@@@@@Service-start@@@@@@*/
var HttpPost = function(param) {
    try {
         if(param['submitWay'] != "GET") {
             $.ajax({
                 //提交数据的类型 POST GET
                 type: param['submitWay'],
                 url: param['url'],
                 contentType: "application/json",
                 datatype: "json",
                 xhrFields: {
                    withCredentials: true
                 },
                 crossDomain: true,
                 data: JSON.stringify(param['data']),
                 success: function (data) {
                    param['return'](data);
                 },
                 complete: function (XMLHttpRequest, textStatus) {

                 },
                 error: function (data) {
                    if(param['error']){
                        param['error'](data);
                    }else{
                        console.log(data)
                    }
                 }
             });
         } else {
             $.ajax({
                 //提交数据的类型 POST GET
                 type: param['submitWay'],
                 url: param['url'],
                 success: function (data) {
                     param['return'](data);
                 },
                 xhrFields: {
                    withCredentials: true
                 },
                 crossDomain: true,
                 complete: function (XMLHttpRequest, textStatus) {

                 },
                 error: function (data) {
                    if(param['error']){
                        param['error'](data);
                    } else {
                        console.log(data)
                    }
                 }
             });
         }
    } catch (e) {
        console.log("HttpPost param error.reason:"+e);
    }
}
/*@@@@@@Service-end@@@@@@*/

/*@@@@@@@@sample  
*/

// sample();

function returns(data){
    console.log("returns");
    console.log(data);
}

function sample(){
    var param = {
                "data":{name:'1',pwd:'2'},        //参数
                "submitWay":"POST",
                "url":"http://10.1.31.135:8081/neumedia/ws/neucut/test1",    //post url，
                "return":returns      //返回参数
     }
     HttpPost(param);
}

/*
@@@@@@@@@@@@@@@@@@@@@@@*/