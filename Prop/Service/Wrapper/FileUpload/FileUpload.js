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
}

function sample(){
    var param = {
                "url":"http://gztv.neutest.cn:8080/testing/upload",    //post url，
                "data":document.getElementById('fileToUpload').files[0],
                "return":returns,      //返回参数
                "progress":progress
     }
     FileUpload(param);
}

/*
@@@@@@@@@@@@@@@@@@@@@@@*/