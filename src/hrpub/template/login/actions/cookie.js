

export default class Cookie {
    getCookie = (sName) => {
        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        var oRE = new RegExp(sRE);
    
        if (oRE.test(document.cookie)) {
            return RegExp["$1"];
        } else
            return null;
    };
    setCookie = (sName, sValue) => {
        var date=new Date(); 
        date.setTime(date.getTime()+365*24*60*60*1000);
        var sCookie = sName + "=" + sValue+";expires="+date.toGMTString()+";path=/";        
        document.cookie = sCookie;
    };

    delCookie = (name) => {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
}