//  zhanghuag 2018/3/15
//  说明 友空间bridge

// 友空间 h5调原生接口说明 https://wiki.upesn.com/pages/viewpage.action?pageId=360550


import { getStorage } from '../index.js'

// 调用友空间原生方法
const connectWebViewJavascriptBridge = (callback) => {
  if(window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady',
      function() {
        callback(WebViewJavascriptBridge);
      }, false);
  }
}

// 判断当前是否是ykj模块
const isShow = ()=>{
  return window.$platform=='ykj'?true:false
}

// 关闭webview
const closePage = ()=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}

    var data = { 'function': 'closePage'}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      
    });
  });
}

// 隐藏头部导航
const hiddenMenu = ()=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}

    // var data = { 'function': 'hiddenMenu', 'parameters': { 'topOffset': '20' }};
    var data = { 'function': 'configNavBar', 'parameters': {'hide':1,'fullScreen':1}};

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      
    });
  });
}

// 显示头部导航
const showMenu = ()=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}

    // var data = { 'function': 'hiddenMenu', 'parameters': { 'topOffset': '20' }};
    var data = { 'function': 'configNavBar', 'parameters': {'hide':0,'fullScreen':1}};

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      
    });
  });
}


// 配置导航内容
/**
 * @param {Object} configNavBar的配置对象
 * {
 *  'function': 'configNavBar',
 *  'parameters': {}
 * }
 * @cbs {Object} 按钮的回调事件，对应于[leftItems rightItems]中的callback
 *
 */
const configNavBar = (param,  cbs = {})=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}

    var data = {
          'function': 'configNavBar',
          'parameters': {
            'backgroundColor': '#ffffff',
            'tintColor': '#00ff00',
            'progressBarColor': '#0000ff',
            'fullScreen':'0',
            'rightItems':[
              {
                'title':'hello',
                'isSetting':1,
                'titleColor':'#ff0000',
                'icon':'https://ec.yonyoucloud.com/front/new_front/js/modules/eucIM/images/icon_space_assistant.png',
                'iconColor':'#ffff00',
                'callback':JSON.stringify(function(){console.log("测试友空间头部按钮1")})
              },
              {
                'title':'hello',
                'isSetting':1,
                'titleColor':'#ff0000',
                'icon':'https://ec.yonyoucloud.com/front/new_front/js/modules/eucIM/images/icon_space_assistant.png',
                'iconColor':'#ffff00',
                'callback':JSON.stringify(function(){console.log("测试友空间头部按钮2")})
              },
            ]
          }}
    if( !!param ){
      data = param;
    }
   
    if (typeof (cbs) === 'object') {
      Object.keys(cbs).forEach(key => {
         // 注册回调事件
        YonYouJSBridge.registerHandler(key, cbs[key]);
      });
    }
    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      
    });
  });

}

// 附件上传
const selectAttachment = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var parameters=paramobj?paramobj:{ 'type': '1' };
    var data = { 'function': 'selectAttachment', 'parameters': parameters}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}

// 分享功能
const share = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var parameters=paramobj?paramobj:{ 'content': '分享功能' };
    var data = { 'function': 'share', 'parameters': parameters}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}


// 获取客户端信息
const getAppInfo = (callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'getAppInfo'}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}

// 打开一个webview页面
const openWindow = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){
      console.log(e)
    }
    if( typeof paramobj == 'string' ){//字符串，表示url地址
      var data = {
        'function': 'openWindow',
        'parameters': {
          'fullScreen': '0',
          'orientation': '0',
          'url':paramobj
        }
      }
    }else{//对象表示配置对象
      //必填字段
      var data = {
        'function': 'openWindow',
        'parameters': {
          'orientation': (!!paramobj.orientation?paramobj.orientation:'1'),
          'navShow': '2',//默认不显示原生头部，防止出现链接头部
          'fullScreen': '0',
          'url': paramobj.url
        }
      }
      //非必填字段
      for( let keys in paramobj ){
        if( keys !== 'url' && keys !== 'orientation' ){
          data.parameters[keys] = paramobj[keys];
        }
      }
    }
    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
    });
  });
}

//扩展单点属性
const extendParamFun = (obj)=>{
  let ykjInfo=getStorage("ykjInfo");
  let newObj=Object.assign(obj,ykjInfo);
  return newObj
}


// 获取code
const getAppCode = (callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'getAppCode'}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}



// 打开一个webview页面
const fileBrowser = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'fileBrowser', 'parameters': paramobj}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}



// 文件预览
const previewFile = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'previewFile', 'parameters': paramobj}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}

// 大图浏览
const viewImage = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'viewImage', 'parameters': paramobj}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}
// 大图浏览(解决IOS半个图片问题,files参数用数组)
const previewImImage = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'previewImImage', 'parameters': paramobj}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}

// 注册webview监听是事件，当再次回到这个webview，进行函数回调
// 调用方法  NativeObj.viewWatch("",function(){ alert("回调启用了")})
const viewWatch = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}

    YonYouJSBridge.registerHandler('resume', function(data, responseCallback) {
      callbackFun(data, responseCallback)
    });

    var data = { }
    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
    });
  });
}


// 打开原生应用调用机器人
const openRobot = (paramobj,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'openXiaoYou', 'parameters': {'xiaoyou_params':paramobj}}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}


// 打开人脸识别
const faceRecog = (callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'faceRecog', 'parameters': {
      isForSign:false,
      sysId:'diwork',
      groupId:'yongyou'
    }}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}
// 打开空间选择联系人
// var parameters={
//   multi:0, //	1为多选 0为单选
//   mode:1,// 1为联系人 2为手机通讯录
//   select_list:[], //	已选人对象的list
//   max_num:100,//最大选择人数
//   // select_num	n	in	 	 	已选择人数
//   nav_title:'选择联系人', //	选择联系人页面的标题
//   nav_color:'#ffffff',//'#007ddc', // 页面颜色值
//   type:0, //	0:标准选人 1:对外专版选人
//   // qzid	N	int	 	客户端当前空间id	需要选择的空间id
//   canDel:true, //	是否可以删除已选人员
// }
// https://wiki.upesn.com/pages/viewpage.action?pageId=1737169
const selectContacts = (param,callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var parameters={
      multi:0,
      mode:1,
      select_list:[],
      max_num:100,
      nav_title:'选择联系人',
      nav_color:'#ffffff',
      type:0,
      canDel:true,
    }
    parameters=Object.assign(parameters,param);
    var data = { 'function': 'selectContacts', 'parameters': parameters}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}

// 打开im聊天功能
// parameters={
//   chat_mode:0, //0单聊1团队2群组3订阅号
//   send_id:'', //发送者iD
//   qzid:'' //空间id
// }
const openChatWindow = (parameters, callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'openChatWindow', 'parameters': parameters}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}


// 打开嘟嘟电话
// parameters={
//   member_id:'', //用户
//   name:'', //用户名称
//   avatar:'' //用户头像
//   mobile:'' //手机号
// }
// callUer
const callUer = (parameters, callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var data = { 'function': 'callUer', 'parameters': parameters}

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}


// 非调用原生提供文件***********************************************************************
// 获取手机系统类型，ios还是安卓
const getSystem = (callbackFun)=>{
  var system='',devices='';
  var versions = (function() {
    var u = window.navigator.userAgent;
      return {//移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(new RegExp(`AppleWebKit.*Mobile.*`)) || !!u.match(new RegExp(`AppleWebKit`)), //是否为移动终端
          ios: !!u.match(new RegExp(`\\(i[^;]+;( U;)? CPU.+Mac OS X`)), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    })()
    if(versions.ios||versions.iPhone||versions.iPad){
      system='ios';
      devices = (versions.ios&&'ios')||(versions.iPhone&&'iPhone')||(versions.iPad&&'iPad');
    }
    if(versions.android){
      system='android';
      devices='android';
    }
    console.log({system:system,devices:devices})
    callbackFun({system:system,devices:devices})

}
// 获取地理位置
const getLocation = (callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){
      console.log(e);
    }
    var data = {
      'function': 'getLocation'
    }

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result);
    });
  });
}
// 获取友空间用户信息,member_id等信息
const getUserInformation = (callbackFun)=>{
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){
      console.log(e);
    }
    var data = {
      'function': 'getUserInformation'
    }

    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result);
    });
  });
}
 // 获取选择友空间群组
// https://wiki.upesn.com/pages/viewpage.action?pageId=7045768
const selectInsideGroup = (param,callbackFun)=>{
  console.log('selectInsideGroup')
  connectWebViewJavascriptBridge(function(YonYouJSBridge) {
    try{
      YonYouJSBridge.init(function(message, responseCallback) {});
    }catch(e){console.log(e)}
    var parameters={
      multi:1,
      select_list:[],
      nav_title:'选择群组',
      nav_color:'#ffffff',
      group_type: '0' // 0 已加入的团队 1 所有的团队 2 未加入的团队
    }
    parameters=Object.assign(parameters,param);
    var data = { 'function': 'selectInsideGroup', 'parameters': parameters}
    
    YonYouJSBridge.send(JSON.stringify(data), function(responseData) {
      var result = JSON.stringify(JSON.parse(responseData), null, 4);
      callbackFun(result)
      
    });
  });
}


export default {
  connectWebViewJavascriptBridge,
  closePage,
  hiddenMenu,
  showMenu,
  configNavBar,
  selectAttachment,
  share,
  extendParamFun,
  getAppCode,
  getAppInfo,
  openWindow,
  isShow,
  fileBrowser,
  getSystem,
  previewFile,
  openRobot,
  viewImage,
  previewImImage,
  viewWatch,
  selectContacts,
  getLocation,
  faceRecog,
  openChatWindow,
  getUserInformation,
  selectInsideGroup
}
