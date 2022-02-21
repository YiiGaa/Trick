var Config_Service = {
    "test": '/api'
};
var FileBigUpload = function(param) {
    var FileBigUpload_Config={}
    var FileBigUpload_thread = 4;

    FileBigUpload_Config['progress'] = param['progress'];
    FileBigUpload_Config['return'] = param['return'];
    FileBigUpload_Config['error'] = param['error']
    FileBigUpload_Config['url'] = param['url'];
    FileBigUpload_Config['data'] = param['data'];
    FileBigUpload_Config['id'] = param['id']?param['id']:"";

    var FileBigUpload_formDatas = {};
    var FileBigUpload_file = null;
    var FileBigUpload_chunk = 1;
    var FileBigUpload_headPath = "";
    var FileBigUpload_pieceSize = "";
    var FileBigUpload_uploadIndex = 0;
    var FileBigUpload_successNum = 0;
    var FileBigUpload_uploadProcess = []
    var FileBigUpload_uploadMark = []

    this.start = function(){
        try {
            if(FileBigUpload_Config['data']["name"] && FileBigUpload_Config['data']["lastModified"] && FileBigUpload_Config['data']["type"] && FileBigUpload_Config['data']["size"]){
                FileBigUpload_file = FileBigUpload_Config['data'];
            }
            else{
                for(var key in FileBigUpload_Config['data']){
                    if(FileBigUpload_Config['data'][key]["name"] && FileBigUpload_Config['data'][key]["lastModified"] && FileBigUpload_Config['data'][key]["type"] && FileBigUpload_Config['data'][key]["size"]){
                        FileBigUpload_file = FileBigUpload_Config['data'][key];
                        continue;
                    }
                    FileBigUpload_formDatas[key] = FileBigUpload_Config['data'][key];
                }
            }

            FileBigUpload_Init()
        } catch (e) {
            console.log("FileBigUpload param error.reason:"+e);
        }
    }

    var FileBigUpload_Send = function(sendData, stateChangeFunction, processFunction, piece){
        var FileBigUpload_xhr=null;
        if(window.XMLHttpRequest){  //要是支持XMLHttpRequest的则采用XMLHttpRequest生成对象  
            FileBigUpload_xhr=new XMLHttpRequest();  
        }else if(window.ActiveXobiect){//要是支持win的ActiveXobiect则采用ActiveXobiect生成对象。  
            FileBigUpload_xhr=new ActiveXobiect('Microsoft.XMLHTTP');  
        }

        FileBigUpload_xhr.upload.addEventListener("progress", function(e) {
            if(processFunction){
                processFunction(e, FileBigUpload_Config['id'], piece)
            }
        }, false);
        FileBigUpload_xhr.onreadystatechange = function(){
            if(stateChangeFunction){
                var response = {
                    "status":FileBigUpload_xhr.status,
                    "readyState":FileBigUpload_xhr.readyState,
                    "responseText":FileBigUpload_xhr.responseText
                }
                stateChangeFunction(response, piece)
            }
        } 
        FileBigUpload_xhr.open("POST", FileBigUpload_Config['url'], true);
        FileBigUpload_xhr.withCredentials = true;
        //xmlHttp.setRequestHeader("Content-Type", "multipart/form-data; boundary=AaB03x");
		FileBigUpload_xhr.send(sendData);
    }

    var FileBigUpload_Init = function(){
        var sendData = new FormData();
        for(var key in FileBigUpload_formDatas){
            sendData.append(key, FileBigUpload_formDatas[key])
        }
        sendData.append("@action", "prepare")
        sendData.append("@filename", FileBigUpload_file.name)
        sendData.append("@size", FileBigUpload_file.size)
        FileBigUpload_Send(sendData, ReturnFileBigUpload_Init, null)
    }
    var ReturnFileBigUpload_Init = function(result){
        if (result.readyState==4&&result.status==200){
            var response = $.parseJSON(result.responseText); 
            if(response.errorCode == "Status start(FileBigUpload)"){
                FileBigUpload_chunk = response.chunk;
                FileBigUpload_headPath = response.headPath;
                FileBigUpload_pieceSize = response.pieceSize;

                for(var i=0;i<FileBigUpload_chunk;i++){
                    FileBigUpload_uploadMark.push(0)
                    FileBigUpload_uploadProcess.push(0)
                }

                for(var i=0;i<FileBigUpload_thread;i++){
                    FileBigUpload_PieceUpload();
                }
            }else{
                var notify = FileBigUpload_Config['error']
                if(notify){
                    notify(result)
                }
            }
        }else if(result.readyState==4){
            var notify = FileBigUpload_Config['error']
            if(notify){
                notify(result)
            }
        }
    }

    var FileBigUpload_PieceUpload = function(data){
        var index = 0;
        for(index = 0;index < FileBigUpload_uploadMark.length;index++){
            if(FileBigUpload_uploadMark[index] == 0){
                break;
            }
        }
        if(index >= FileBigUpload_uploadMark.length){
            FileBigUpload_PieceEnd()
            return;
        } else {
            FileBigUpload_uploadMark[index] = 1
        }


        var sendData = new FormData();
        for(var key in FileBigUpload_formDatas){
            sendData.append(key, FileBigUpload_formDatas[key])
        }
        sendData.append("@action", "process")
        sendData.append("@file", FileBigUpload_file.slice(index * FileBigUpload_pieceSize, (index+1)*FileBigUpload_pieceSize));
        sendData.append("@head", FileBigUpload_headPath)
        sendData.append("@piece", index)
        
        FileBigUpload_uploadIndex++;
        FileBigUpload_Send(sendData, ReturnFileBigUpload_PieceUpload, FileBigUpload_uploadProgress,index)
    }
    var ReturnFileBigUpload_PieceUpload = function(result, piece){
        if (result.readyState==4&&result.status==200){
            var response = $.parseJSON(result.responseText); 
            if(response.errorCode == "Status process(FileBigUpload)"){                
                FileBigUpload_successNum++;
                FileBigUpload_PieceUpload();
            }else{
                FileBigUpload_uploadMark[piece] = 0
                FileBigUpload_thread--;

                if(FileBigUpload_thread == 0){
                    var notify = FileBigUpload_Config['error']
                    if(notify){
                        notify(result)
                    }
                } 
            }
        }else if(result.readyState==4){
            FileBigUpload_uploadMark[piece] = 0
            FileBigUpload_thread--;

            if(FileBigUpload_thread == 0){
                var notify = FileBigUpload_Config['error']
                if(notify){
                    notify(result)
                }
            }
        }
    }

    var FileBigUpload_PieceEnd = function(){
        if(FileBigUpload_progress<(FileBigUpload_chunk*100)){
            FileBigUpload_thread--;
            return;
        }

        if(FileBigUpload_successNum >= FileBigUpload_chunk){
            var sendData = new FormData();
            for(var key in FileBigUpload_formDatas){
                sendData.append(key, FileBigUpload_formDatas[key])
            }
            sendData.append("@action", "end")
            sendData.append("@head", FileBigUpload_headPath)
            
            FileBigUpload_Send(sendData, ReturnFileBigUpload_PieceEnd, null)
        }
    }
    var ReturnFileBigUpload_PieceEnd = function(result){
        if (result.readyState==4&&result.status==200){
            var response = $.parseJSON(result.responseText); 
            var notify = FileBigUpload_Config['return']
            notify(response)
        }else if(result.readyState==4){
            var notify = FileBigUpload_Config['error']
            if(notify){
                notify(result)
            }
        }
    }
    
    var FileBigUpload_progress = 0;
    var FileBigUpload_uploadProgress = function(evt, id ,piece) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            FileBigUpload_uploadProcess[piece] = percentComplete;
            FileBigUpload_progress = FileBigUpload_progress + percentComplete;
            var notifyPercent =  Math.round(FileBigUpload_progress/FileBigUpload_chunk)

            var param = {
                "progress":notifyPercent,
                "id":id
            }
            var notify = FileBigUpload_Config['progress']
            if(notify){
                notify(param);
            }
        }
        else {
            // document.getElementById('progressNumber').innerHTML = '无法上传！';
            //(FileBigUpload_Config['progress'])(-1);
            alert("无法上传！");
        }
    
    }
}


var FileUpload = function (param) {
  var FileUpload_xhr = null;
  var FileUpload_Config = {}
  FileUpload_Config['progress'] = param['progress'];
  FileUpload_Config['return'] = param['return'];
  FileUpload_Config['error'] = param['error'];
  FileUpload_Config['url'] = param['url'];
  FileUpload_Config['data'] = param['data'];
  FileUpload_Config['id'] = param['id'] ? param['id'] : "";

  try {
    var formData = new FormData();
    if (FileUpload_Config['data']["name"] && FileUpload_Config['data']["lastModified"] && FileUpload_Config['data']["type"] && FileUpload_Config['data']["size"]) {
      formData.append("file", FileUpload_Config['data']);
    }
    else {
      for (var key in FileUpload_Config['data']) {
        formData.append(key, FileUpload_Config['data'][key]);
      }
    }
    if (window.XMLHttpRequest) {  //要是支持XMLHttpRequest的则采用XMLHttpRequest生成对象  
      FileUpload_xhr = new XMLHttpRequest();
    } else if (window.ActiveXobiect) {//要是支持win的ActiveXobiect则采用ActiveXobiect生成对象。  
      FileUpload_xhr = new ActiveXobiect('Microsoft.XMLHTTP');
    }

    FileUpload_xhr.upload.addEventListener("progress", function (e) {
      FileUpload_uploadProgress(e, FileUpload_Config['id'], FileUpload_Config)
    }, false);
    FileUpload_xhr.onreadystatechange = function () {
      FileUpload_state_Change(FileUpload_xhr, FileUpload_Config)
    }
    FileUpload_xhr.open("POST", FileUpload_Config['url'], true);
    FileUpload_xhr.withCredentials = true;
    //xmlHttp.setRequestHeader("Content-Type", "multipart/form-data; boundary=AaB03x");
    FileUpload_xhr.send(formData);
  } catch (e) {
    console.log("FileUpload param error.reason:" + e);
  }
}

var FileUpload_state_Change = function (FileUpload_xhr, FileUpload_Config) {
  if (FileUpload_xhr.readyState == 4 && FileUpload_xhr.status == 200) {
    var response = $.parseJSON(FileUpload_xhr.responseText);
    (FileUpload_Config['return'])(response);
  } else if (FileUpload_xhr.readyState == 4) {
    var notify = FileBigUpload_Config['error']
    if (notify) {
      notify(FileUpload_xhr)
    }
  }
}


var FileUpload_uploadProgress = function (evt, id, FileUpload_Config) {
  if (evt.lengthComputable) {
    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
    var param = {
      "progress": percentComplete,
      "id": id
    }
    var notify = FileUpload_Config['progress']
    if (notify) {
      notify(param);
    }
  }
  else {
    // document.getElementById('progressNumber').innerHTML = '无法上传！';
    //(FileUpload_Config['progress'])(-1);
    alert("无法上传！");
  }

}
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

