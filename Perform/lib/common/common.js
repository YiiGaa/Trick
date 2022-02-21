//format second to 00:00:00
function Common_formatSeconds(value) { 
    var theTime = parseInt(value);// 秒 
    var theTime1 = 0;// 分 
    var theTime2 = 0;// 小时 
    // alert(theTime); 
    if(theTime > 60) { 
        theTime1 = parseInt(theTime/60); 
        theTime = parseInt(theTime%60); 
        // alert(theTime1+"-"+theTime); 
        if(theTime1 > 60) { 
            theTime2 = parseInt(theTime1/60); 
            theTime1 = parseInt(theTime1%60); 
        } 
    }
    var result = theTime <= 9? "0"+parseInt(theTime) : ""+parseInt(theTime); 
    if(theTime1 > 0) { 
        //result = ""+parseInt(theTime1)+":"+result; 
        result = theTime1 <= 9? "0"+parseInt(theTime1)+":"+result : ""+parseInt(theTime1)+":"+result;  
    } else {
        result = "00:"+result;
    }
    if(theTime2 > 0) { 
        result = theTime2 <= 9? "0"+parseInt(theTime2)+":"+result : ""+parseInt(theTime2)+":"+result;  
    } else {
        result = "00:"+result;
    }
    return result; 
} 

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//判断Array中是否包含某个值
Array.prototype.contain = function(obj){
    for(var i=0; i<this.length; i++){
        if(this[i] === obj)
            return true;
    }
    return false;
};

/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
function Common_debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result
  
    var later = function () {
      // 据上一次触发时间间隔
      var last = Date.now() - timestamp
  
      // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  
    return function () {
      context = this
      args = arguments
      timestamp = Date.now()
      var callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
  
      return result
    }
  }
  
  /**
   * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
   *
   * @param  {function}   func      传入函数
   * @param  {number}     wait      表示时间窗口的间隔
   * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
   *                                如果想忽略结尾边界上的调用，传入{trailing: false}
   * @return {function}             返回客户调用函数
   */
function Common_throttle(func, wait, options) {
    var context, args, result
    var timeout = null
    // 上次执行时间点
    var previous = 0
    if (!options) options = {}
    // 延迟执行函数
    var later = function () {
      // 若设定了开始边界不执行选项，上次执行时间始终为0
      previous = options.leading === false ? 0 : Date.now()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function () {
      var now = Date.now()
      // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
      if (!previous && options.leading === false) previous = now
      // 延迟执行时间间隔
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
      // remaining大于时间窗口wait，表示客户端系统时间被调整过
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout)
        timeout = null
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
        // 如果延迟执行不存在，且没有设定结尾边界不执行选项
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
}

//换算文件大小
function Common_bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1000, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
 
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

function  Common_compareMBSize (bytes,  limit)  {  
    return  (bytes  /  1000000)  >  limit  ?  true  :  false
}

//预览本地图片
function Common_LocalPhoto(file,imgId){
    //判断是否支持FileReader
    if (window.FileReader) {
        var reader = new FileReader();
    } else {
        alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
    }

    //获取文件
    var file = fileDom.files[0];
    var imageType = /^image\//;
    //是否是图片
    if (!imageType.test(file.type)) {
        return null;
    }
    //读取完成
    reader.onload = function(e) {
        //获取图片dom
        var img = document.getElementById(imgId);
        //图片路径设置为读取的图片
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

//预览本地视频/音频
function Common_LocalVideoAudio(file){
    var url = URL.createObjectURL(file);
    return url;
}

//将Json变成Url
function Common_JsonToUrl(data){
    var result = "";
    for(var key in data){
        result += (key+"="+data[key]+"&");
    }

    if(result != ""){
        result = result.substring(0,result.length - 1)
    }
    return result;
}

//获取url参数
function Common_GetUrlParam(name){
    try {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null){
            if(Common_isNumber(unescape(r[2])) || r[2] =="true" || r[2] =="false"){
                return  unescape(r[2]);
            } else {
                return  decodeURIComponent(r[2]);
            }
        }
    } catch (error) {}
    return null;
}

//获取hash参数
function Common_GetUrlHash(name){
    try {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.hash.substr(1).match(reg);
        if(r!=null){
            if(Common_isNumber(unescape(r[2])) || r[2] =="true" || r[2] =="false"){
                return  unescape(r[2]);
            } else {
                return  decodeURIComponent(r[2]);
            }
        }
    } catch (error) {}
   return null;
}

function Common_isNumber(obj) {
    return typeof obj === 'number' && isFinite(obj)    
}

//全屏
Common_FullScreen=function(id,element){
    var elem; 
    if(element == null){
        if(id == null || id == ""){
            elem=document.body;
        } else {
            elem=document.getElementById(id);
        }
    } else {
        elem = element
    }
    if(elem.webkitRequestFullScreen){  
        elem.webkitRequestFullScreen();     
    }else if(elem.mozRequestFullScreen){  
        elem.mozRequestFullScreen();  
    }else if(elem.requestFullScreen){  
        elem.requestFullscreen();  
    }else{  
        console.log("浏览器不支持全屏API或已被禁用");
        return;
    }  
}

//退出全屏
Common_exitFullscreen=function(){  
    var elem=document;  
    if(elem.webkitCancelFullScreen){  
        elem.webkitCancelFullScreen();      
    }else if(elem.mozCancelFullScreen){  
        elem.mozCancelFullScreen();  
    }else if(elem.cancelFullScreen){  
        elem.cancelFullScreen();  
    }else if(elem.exitFullscreen){  
        elem.exitFullscreen();  
    }else{  
        console.log("浏览器不支持全屏API或已被禁用");
        return; 
    }  
}

function Common_isEmpty(obj){
    return (typeof obj === 'undefined' || obj === null || obj === "");
}

function Common_homeUrlReplace(data,key){
    if(data == null || data == ""){
        return null;
    }else{
        data = data.replace(all_SourceUrlReplace[key]["orginal"],all_SourceUrlReplace[key]["new"]);
    }
    return data;
}

function Common_dataChange(data, target){
    for(var key in target){
        var re = new RegExp(key, "g");
        data = data.replace(re, target[key])
    }
    return data;
}

function Common_saveAs(source, target) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(source, target);
    } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');
        link.href = source;
        link.download = target;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
    };
}