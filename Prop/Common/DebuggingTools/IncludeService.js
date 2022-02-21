var serviceLoadList = Lib_ServiceList;
var serviceConfig = {
                    "path":"",
                    "callBackFunction":"",
                    "i":0
                }

var includeService = function(){
    var loadPath = "";
    if(serviceConfig.i < serviceLoadList.length){
        loadPath = serviceConfig['path'] +serviceLoadList[serviceConfig.i];
        serviceConfig['loadingModule'] = serviceLoadList[serviceConfig.i];
    } else  {
        (serviceConfig['callBackFunction'] != null) ? (serviceConfig['callBackFunction'])() : null;
        return;
    }

    jQuery.getScript(loadPath)
        .done(function() {  
            console.log("service load Success :"+serviceConfig['loadingModule']);

            serviceConfig.i++;
            includeService();
        })  
        .fail(function() {  
            console.log("service load FailLoad :"+serviceConfig['loadingModule'])
        });
}

function serviceLoad(pathUrl, callBackFunction){
    serviceConfig['path'] = pathUrl;
    serviceConfig['callBackFunction'] = callBackFunction;
    includeService();
}