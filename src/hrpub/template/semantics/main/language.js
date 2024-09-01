
import axios from 'axios';

function getStoreLang (lang){
    var sRE = "(?:; )?" + "langCode" + "=([^;]*);?";
    var oRE = new RegExp(sRE);
    if (oRE.test(document.cookie)) {
        return RegExp["$1"];
    } else
        return lang;
}
function InitMultiLang(modules,callback){
    let url = "/nccloud/resources/hrpub/public/lang/standard/"+getStoreLang("simpchn")+"/"+modules+".json";
    axios.get(url).then((res) => {
        callback&&callback(res.data);
    }).catch(function (error) {
        callback&&callback();
    });
}

export default InitMultiLang