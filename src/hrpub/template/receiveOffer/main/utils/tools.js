/**
 * 1
 * Created by yangyang11 on 2017/12/1
 * 根据名字获取背景颜色
 */
import md5 from 'md5'
export const setPhotoColorByName = (name) => {
  let defaultName = ''
  if (!name && name !== 0) {
    defaultName = '#'
  }
  const colors = ['#E14C46', '#00B39E', '#47BAEE', '#85D266', '#FFBB37']
  const nameStr = 'abcdefghijklmnopqrstuvwxyz0123456789#'
  let firstCharacter = defaultName || md5(name)[0]
  let nameIndex = nameStr.indexOf(firstCharacter)
  return colors[nameIndex%colors.length]

}



/**
 * 2
 * Created by zhanghuag on 2018/2/1
 * 对一个数据进行添加操作、并去重，
 * 不可对一维数组去重，参数有误返回null
 *
 * @param {string} [id] -添加数据的唯一标识
 * @param {obj} [current] -需要添加的数据
 * @param {arr} [arr] -被添加的数组
 * @param {string} [num] -限定数组长度，默认5个
 * @param {boolean} [asc] -添加的位置，默认在上方添加
 *
 *
 */

export const refreshArray=(id,current,arr,num,asc)=>{
  var n=num||5;
  var length=arr.length;
  if(!id||!current||!arr){
    console.log("数据有误")
    return null;
  }
  var newarr=arr.filter(function(item) {  return current[id]!==item[id] });
  if(!asc){
    newarr.unshift(current);
    newarr=newarr.slice(0,n);
  }else{
    newarr.push(current);
    newarr=newarr.slice(-n,n);
  }
  return newarr
}


/**
 * 3
 * Created by zhanghuag on 2017/09/05.时间格式化
 * formatTime ##1 时间格式化
 * @module utils/tools
 *
 * @param {object} [data] - 时间对象
 * @param {string} [format] -返回的时间格式
 * format((new Date()),"yyyy-MM-dd hh:mm:ss")
 * @param 加入 NN（noon)支持ampm输出，用replace(/am/i,'上午')替换为上午，下午用法同
 */

export const formatTime=(data,format)=>{
  var o = {
    "M+" : data.getMonth()+1, //month
    "d+" : data.getDate(), //day
    "h+" : data.getHours(), //hour
    "m+" : data.getMinutes(), //minute
    "s+" : data.getSeconds(), //second
    "q+" : Math.floor((data.getMonth()+3)/3), //quarter
    "N+" : data.getHours() < 12 ? 'am' : 'pm',//ampm
    "S" : data.getMilliseconds() //millisecond
  };
  if(/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (data.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
      if(new RegExp("("+ k +")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
      }
  }
  return format;
};

/**
 * 4
 * Created by yangyang11 on 2017/12/1
 * 根据名字获取背景颜色
 * @param {String} [url] - 完整的url
 * @returns {Object} [ret] - 返回的序列化后的json参数
 */

export const parseQueryString = (url) =>{
  let reg_url = new RegExp(`^[^\\?]+\\?([\\w\\W]+)$`),
    reg_para = new RegExp(`([^&=]+)=([\\w\\W]*?)(&|$|#)`, 'g'),
    arr_url = reg_url.exec(url),
    ret = {}

  if (arr_url && arr_url[1]) {
    var str_para = arr_url[1], result;
    while ((result = reg_para.exec(str_para)) != null) {
    ret[result[1]] = result[2];
    }
  }
  return ret
};

/**
 * 5
 * Created by yangyang11 on 2018/3/2
 * 加载js文件
 * @param {String} [url] - js文件的相对路径
 * @param {Function} [callback] - js文件加载完成的回调
 */

export const loadJavascriptFile = (url, callback) =>{
  let script=document.createElement("script"),
      heads = document.getElementsByTagName("head")

  script.setAttribute("type", "text/javascript")
  script.setAttribute("src", url)

  if (script.addEventListener) {
    script.addEventListener('load', () =>{
      callback()
    }, false)
  } else if (script.attachEvent) {
    script.attachEvent('onreadystatechange', function () {
      let target = window.event.srcElement
      if (target.readyState == 'loaded') {
        callback()
      }
    })
  }

  if(heads.length)
    heads[0].appendChild(script);
  else
    document.documentElement.appendChild(script)
}

/**
 * 6
 * Created by zhanghuag on 2018/11/23
 * 批量加载js文件
 * @param {array} [url] - js文件的相对路径
 * @param {Function} [callback] - js文件加载完成的回调
 * @param {Boolean} [order] -是否有顺序依赖，true有序加载，false无序加载，默认false
 */

export const loadJavascriptFileArray = (urlArr = [], callback, order) =>{
  // 根据域名判断环境，修改路径
  let origin=location.origin;
  if(origin.indexOf(".com")!=-1){
    origin=origin+"/wap"
  }else{
    origin=''
  }

  if(order){
    let urlLoadNum=0;
    loadRecursion(urlArr,urlLoadNum,callback)
  }else{
    let urlLoadNum=0;
    urlArr.forEach((ele,index,arr)=>{
      let scriptSrc=ele
      if(ele.substr(0,4)!="http"){
        scriptSrc=origin+ele
      }
      loadJavascriptFile(scriptSrc, () => {
        urlLoadNum++;
        if(urlLoadNum===urlArr.length){
          callback()
        }
      })
    })
  }
}
/**
 * 7
 * Created by zhanghuag on 2018/11/24
 * 批量加载js文件，有序进行递归操作
 * @param {Array} [urlArr] - 要进行递归的数组
 * @param {Nubmer} [urlLoadNum] - 数组的角标
 * @param {Function} [callback] -  回调函数
 */

export const loadRecursion=(urlArr,urlLoadNum,callback)=>{
  if(urlLoadNum===urlArr.length){
    callback()
  }else{
    loadJavascriptFile(urlArr[urlLoadNum], () => {
      loadRecursion(urlArr,urlLoadNum+1,callback)
    })
  }
}

/**
 * 8
 * Created by zhanghuag on 2018/3/7
 * 判读数据有效性
 *
 * @param {Array} [validArr] - 待验证数据
 * @param {String} [type] - 验证类型
 *
 * 返回值格式为{result:true/false,toast:'正确'}
 *
 * eg:
 * value:待验证数据,
 * toast:为空的提示语,
 * type:待验证数据的要求类型,
 * typeErrorToast:类型错误的提示语
 *  validArr=[
        {value:that.leavetype,toast:'请选择休假类型',type:'',typeErrorToast:''},
        {value:that.finalStartTime,toast:'请选择开始时间'},
        {value:that.finalEndTime,toast:'请选择结束时间'},
        {value:(that.approverid&&that.approvername),toast:'请选择审批人信息'},
      ]
    type=true/false
      true:表示验证的表单数组全正确后返回{result:true,toast:'正确'}，不进行任何提示，
        使用场景，当有3个接口，当且仅当3个接口都成功后再进行其他的操作
      false:默认值，当表单数组的每一项都正确返回{result:true,toast:'正确'}，任何一项不对都会返回一个包含提示信息的对象数据{result:false,toast:'有误提示'}
        使用场景,当提交表单的时候进行验证
 *
 */
//验证数据有效性 后期封装到工具类中
export const checkDataValidFun=(validArr,type)=>{

  //没有数据，或数据有误
  if(!validArr||validArr.length<1){
    return {result:false,toast:'您没有填写数据'}
  }

  //有数据
  if(type){// 所有数据唯一缺失验证，
    var invalidData=[];
    for(var i=0;i<validArr.length;i++){
      if(validArr[i].value){
        invalidData.push(validArr[i]);
      }
    }
    if(invalidData.length!=validArr.length){
      //有未选择的数据
      return {result:false,toast:'有其他相关单据未选择'}
    }
  }else{// 所有数据逐条验证
    for(var i=0;i<validArr.length;i++){
      if(!validArr[i].value){
        return {result:false,toast:validArr[i].toast}
      }
      if(!testDataType(validArr[i].value,validArr[i].type)){
        return {result:false,toast:validArr[i].typeErrorToast}
      }
    }
  }
  //数据都正确
  return {result:true,toast:'正确'}
}

/**
 * 9
 * 判断数据类型
 * @param {all} [data] - 待验证的数据
 * @param {string} [type] - 比对类型
 */

const testDataType = (data,type) =>{
  if(!type){
    return true
  }
  let dataType=type.toLowerCase()
  let returnType=false
  if(typeof data === 'object'){
    if(dataType==='array'){
      returnType= data instanceof Array?true:false
    }else if(dataType==='null'){
      returnType=  data===null?true:false
    }else {
      returnType=  true
    }
  }else{
    if(typeof data === dataType){
      returnType=  true
    }else{
      returnType=  false
    }
  }
  return returnType
}



/**
 * 10
 * Created by zhanghuag on 2018/3/7
 * 修正url，补全http字段
 * @param {String} [url] - 待修正的url
 */
export const correctHttp=(url)=>{
  if(url==null)return null;
    if(url.substr(0,10)==="data:image"){return url};
    return url.substr(0,4)=="http"?url:"http://"+url;
}



/**
 * 11
 * Created by zhanghuag on 2018/4/9
 * 修正时间字符串，safari不支持’yyyy-MM-dd hh:mm‘,需要转成yyyy/MM/dd hh:mm,
 * 根据类型返回
 * @param {String/Number} [time] - 待修正的time
 */
export const backValidTime=(time)=>{
  if(typeof time=='string'){
    // console.log(time)
    return time.replace(/-/g, "/")
  }else if(typeof time=='number'){
    return time
  }else{
    console.log('数据错误，time')
    return 0
  }

}


/**
 * 12
 * Created by zhanghuag on 2018/7/6
 * 排序方法，根据对象属性值对数进行排序,从小到大排序
 * 使用方法 arr.sort(objectArraySort('keyName'))
 * 根据类型返回
 * @param {String} [keyName] - 排序对象数值对应的属性名
 */
export const objectArraySort=(keyName)=>{
  return function (objP, objN) {
    let valueP = objP[keyName], valueN = objN[keyName];
    if (valueP > valueN) return 1
    else if (valueP < valueN) return -1
    else return 0
   }
}


/**
 * 13
 * @author siyk
 * getDevicePlat获取浏览器平台，ios,android,web
 */
export const getDevicePlat = () => {
  let u = navigator.userAgent;
  let result = '';
  if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){ //android终端
    result = 'android';
  }else if(!!u.match(new RegExp(`\\(i[^;]+;( U;)? CPU.+Mac OS X`))){ //ios终端
    result = 'ios';
  }else{
    result = 'web';
  }
  return result;
}

/**
 * 14
 * Created by zhanghuag on 2018/8/21
 * 创建随机数
 */

export const createUUID = ( (uuidRegEx, uuidReplacer) => {
  return  () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
  };
})(/[xy]/g,  (c) => {
  var r = +('0.'+(+new Date()+'').split('').reverse().join('')) * 16 | 0,
      v = c == "x" ? r : (r & 3 | 8);
  return v.toString(16);
});

/**
 * 15
 * Created by zhanghuag on 2018/8/21
 * 设置多语类型
 * 判断本地是否有多语数据localStorage.__localLange，有使用本地的
 * 没有的获取浏览器提供的多语参数
 * en tw zh
 */

export const systemLang=()=>{
  let lang="zh_CN"
  // 本地设置多语
  let localLang=localStorage.__localLange;
  // 获取友空间里webview的多语信息
  let nativeLang="zh_CN"
  let str=window.navigator&&window.navigator.userAgent;
  let arr=str.split("youZoneLanguage=");
  if(arr.length>1){
    nativeLang=arr[1]
  }
  let tempLang=localLang||nativeLang
  switch (tempLang){
    case 'en':
      lang='en_US'
    break;
    case 'zh':
      lang='zh_CN'
    break;
    case 'tw':
      lang='zh_TW'
    break;
    default:
      lang='zh_CN'
    break
  }
  return lang
}
/**
 * 16
 * @author siyk
 * 按照字段排序函数//按照字段排序函数
 */
export const compare = (prop) => {
  return function (obj1, obj2) {
      var val1 = !!obj1[prop] ? obj1[prop].toLowerCase() : ' ';
      var val2 = !!obj2[prop] ? obj2[prop].toLowerCase() : ' ';
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1.substr(0,1));
          val2 = Number(val2.substr(0,1));
      }
      if (val1 < val2) {
          return -1;
      } else if (val1 > val2) {
          return 1;
      } else {
          return 0;
      }
  }
}
/**
 * 17
 * @author maxk1
 * @date 2018/09/19
 *检测utf16编码转换成实体（emoji表情符的转换）
 */
export const utf16toEntities = (str) =>{
  let patt=/[\ud800-\udbff][\udc00-\udfff]/g;
  // 检测utf16字符
  str = str.replace(patt, function(char){
    var H, L, code;
    if (char.length===2) {
      H = char.charCodeAt(0); // 取出高位
      L = char.charCodeAt(1); // 取出低位
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
  return str;
}
/**
 * 18
 * @author maxk1
   * @date 2018/10/16
 *
 */
export const getHrefQuery = (data) =>{
  let queryObj = {}
  // if (/code=/.test(location.href)) {
    const reg1 = new RegExp(`([^?&=#]+)=([^?&=#]*)`, 'g')
    location.href.replace(reg1, (...arg) => {
      queryObj[arg[1]] = arg[2]
    })
    return queryObj
  // }
}

/**
 * 19
 * Created by zhanghuag on 2018/9/21
 * 带参数的翻译
 * @param {String} [str] - 被修正的字符串
 * @param {Array} [arr] - 修正参数
 * 例：
 *  translateParam("人员{0}的考勤规则已存在！",[200])
 *  "人员200的考勤规则已存在！"
 */
export const translateParam=(str,arr)=>{
  let message=str;
  if(arr.length>0){
    arr.forEach((element,index)=>{
      let myregex = new RegExp("{["+index+"}]*}","g");
      message=message.replace(myregex,element)
    })
  }
  console.log(message)
  return message
}
/**
 * 20
 * Created by zhanghuga on 2018/12/20
 * 获取底部按钮距离顶部的距离
 * @param {string,number} [num] 要去除掉的高度，单位是rem
 * @param {boolean} [isHeightAll] 是否返回屏幕高度，为true的时候num为必填，但会忽略num的内容
 */

 export const getDistanceTop = (num,isHeightAll) =>{
    let rem=parseInt(document.documentElement.style.fontSize);
    let Height = document.documentElement.clientHeight;
    let currentNum=num||0;
    if(isHeightAll){
      return Height
    }else{
      return Height-(currentNum*rem);
    }

 }

/**
 * 21
 * Created by zhanghuga on 2018/12/20
 * 数字转换为金额，使用逗号进行分割
 * @param {number} [num] 待转换的金额
 * @param {number} [digit] 保留小数位数,为-1表示保留原有的小数位
 */

export const  moneyFormat = (num, digit = 2) => {
  let returnNum = 0
  let currentDigit = !isNaN(digit) ? digit : 2
  let tempArr = []
  if (!isNaN(num) && num !== 0) {
      returnNum = num
  }
  if (currentDigit === -1) {
    tempArr = returnNum.toString().split('.')
    currentDigit = tempArr[1] ? tempArr[1].toString().length : 0
  }
  if (!isNaN(currentDigit)) {
    currentDigit = Math.abs(currentDigit)
  }
  returnNum = Number(returnNum)
  if (currentDigit === 0) {
    returnNum = returnNum.toFixed(2).replace(new RegExp(`(\\d)(?=(\\d{3})+\\.)`, 'g'), '$1,')
    returnNum = returnNum.split('.')[0]
  } else {
    returnNum = returnNum.toFixed(currentDigit).replace(new RegExp(`(\\d)(?=(\\d{3})+\\.)`, 'g'), '$1,')
  }
  return returnNum
}

/**
 * 22
 * Created by zhanghuga on 2018/12/20
 * 判断是否是iPhonex
 */

export const  isIphoneX = () => {
  let width=window.screen.width||window.screen.availWidth
  let height=window.screen.height||window.screen.availHeight
  if(width==375&&height==812){
      return true
  }else{
      return false
  }
}

// 隐藏父窗口并改变最小宽度
export const hiddenPWAndSetWidth = function () {
  var parentDocument = window.parent.document
  var parentApp = parentDocument.getElementById('app')
  //parentApp.style.minWidth = '100%'
  var parentLayout = getClass(parentDocument, 'nc-workbench-layout')[0]
  //parentLayout.style.minWidth = '100%'
  var parentTopContainer = getClass(parentDocument, 'nc-workbench-top-container')[0]
  //parentTopContainer.style.display = 'none'
  console.log(parentApp, parentLayout, parentTopContainer)
}

// 通过类名获取元素
function getClass(oParent, classname){
  var oChild = oParent.getElementsByTagName('*');
  var arr = [];

  for(var i = 0, len = oChild.length; i < len; i ++){
      console.log(oChild[i].className)
      if(oChild[i].className == classname){
          arr.push(oChild[i]);
      }
  }
  return arr;
}