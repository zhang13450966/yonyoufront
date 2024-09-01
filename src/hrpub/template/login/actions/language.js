import axios from 'axios';
let json;
function getStoreLang (lang){
    var sRE = "(?:; )?" + "langCode" + "=([^;]*);?";
    var oRE = new RegExp(sRE);
    if (oRE.test(document.cookie)) {
        return RegExp["$1"];
    } else
        return lang;
}
function InitMultiLang(modules,callback){
    let url = "../../../public/lang/standard/"+getStoreLang("simpchn")+"/"+modules+".json";
    axios.get(url).then((res) => {
        json = res.data;
        callback&&callback(res.data);
    }).catch(function (error) {
        callback&&callback();
    });
}
function getMultiLang(code,name){
    if(json instanceof Object){
        return json[code]?json[code]:name;
    }else
        return name;
}
function getStoreBc (){
    var sRE = "(?:; )?" + "busiCenterCode" + "=([^;]*);?";
    var oRE = new RegExp(sRE);
    if (oRE.test(document.cookie)) {
        // debugger;
        return RegExp["$1"];
    } else
        return "";
}

export {getStoreLang,InitMultiLang,getMultiLang,getStoreBc};