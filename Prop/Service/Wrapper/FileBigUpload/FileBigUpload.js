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


/*@@@@@@Service-end@@@@@@*/

/*@@@@@@@@sample  
*/

// sample();

function returns(data){
    console.log("returns");
    console.log(data);
}

function progress(data){
    console.log("progress");
    console.log(data);
    document.getElementById("progress").innerHTML = data["progress"]+"%"
}

function error(data){
    console.log("error");
    console.log(data);
}

function sample(){
    var param = {
                "url":"/api/blog/test/upload",    //post url，
                "data":document.getElementById('fileToUpload').files[0],
                "return":returns,      //返回参数
                "progress":progress,
                "error":error
    }
    
    var fileUpload = new FileBigUpload(param);
    fileUpload.start();
}

/*
@@@@@@@@@@@@@@@@@@@@@@@*/