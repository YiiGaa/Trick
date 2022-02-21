/*@@@@@@Service-start@@@@@@*/
var serviceStart = function(url, data, submitWay, returnFunction, errorFunction, progressFunction, id){
    //Concatenation url
    var tempUrl = url.split("/");
    if(tempUrl[0] == ""){
        if(Config_Service[tempUrl[1]]){
            if(tempUrl[1].indexOf("@")!=-1){
                url = url.replace(tempUrl[1],Config_Service[tempUrl[1]])
            }else{
                url = Config_Service[tempUrl[1]]+url;
            }
        }
    } else {
        if(Config_Service[tempUrl[0]]){
            if(tempUrl[0].indexOf("@")!=-1){
                url = url.replace(tempUrl[0],Config_Service[tempUrl[0]])
            }else{
                url = Config_Service[tempUrl[0]]+"/"+url;
            }
        }
    }
    
    //add replayId
    if(submitWay == "GET") {
        url = url + "?" + Common_JsonToUrl(data)
    }
    //Prevent cache, Open it if you need
    //url = formUrl(url)

    /*@@@@@@Service-end@@@@@@*/
    console.log(url)
    console.log(data)
    console.log(submitWay)
    /*@@@@@@Service-start@@@@@@*/

  if (submitWay == "upload") {
    var param = {
      "url": url,    //post url，
      "data": data,
      "return": returnFunction,      //返回参数
      "error": errorFunction,      //返回服务错误时参数
      "progress": progressFunction,
      "id": id ? id : "",
    }
    FileUpload(param);
  } else if (submitWay == "bigUpload") {
    var param = {
      "url": url,    //post url，
      "data": data,
      "return": returnFunction,      //返回参数
      "error": errorFunction,      //返回服务错误时参数
      "progress": progressFunction,
      "id": id ? id : "",
    }
    var filebigUpload = new FileBigUpload(param);
    filebigUpload.start();
  } else { //Http post
    var param = {
      "data": data,        //参数
      "url": url,    //post url
      "submitWay": submitWay,
      "return": returnFunction,      //返回服务错误时参数
      "error": errorFunction      //返回参数
    }
    HttpPost(param);
  }
}

function formUrl(path) {
	if(path.indexOf("?") > -1) {
		var url = path + "&replayId=" + Math.floor(Math.random() * 100000);
	} else {
		var url = path + "?replayId=" + Math.floor(Math.random() * 100000);
	}
	return url;
}
/*@@@@@@Service-end@@@@@@*/
