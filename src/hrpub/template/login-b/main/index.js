import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    base,
    cacheTools,
    Cipher
} from 'nc-lightapp-front';

import './index.less';
import './psw.less';
import {Modal} from "./modal";
import CreateAlert from "./alert";
import RSAUtils from "../rsa/security.js";

import {getStoreLang,InitMultiLang,getMultiLang,getStoreBc} from "./lang";

import InputItem from 'antd-mobile/lib/input-item';
import Button from 'antd-mobile/lib/button';
import AntModal from 'antd-mobile/lib/modal';

import ajax from './ajax';

const {NCButton,NCStep,NCCheckbox,NCSelect } = base;
const NCOption = NCSelect.NCOption;

// 增加加密操作 bbqin
const { opaqueEncrypt, opaqueDecrypt} = Cipher;
class Main extends Component {
    constructor(props) {
        super(props);
        let userid = this.getCookie("userloginid");
        if(userid==""||userid=="null"||userid==undefined||userid=="undefined"){
            this.state = {
                showChangePsw: false,
                step:0,
                forgetpsw:false,
                mobileFindPsw:false,
                forgetstep:0,
                mobileFindPswStep:0,
                checked:false
            }
        }else{
            this.state = {
                showChangePsw: false,
                step:0,
                forgetpsw:false,
                mobileFindPsw:false,
                forgetstep:0,
                mobileFindPswStep:0,
                checked:true
            } 
        }
           
    }
    
    componentDidMount() { 
        this.setCookie("busiCenterCode", this.props.busiCenterCode);
        String.prototype.insert = function (index, item) {
            var temp = [];
            for (var i = 0; i < this.length; i++) {
                temp.push(this[i]);
            }
            temp.splice(index, 0, item);
            return temp.join("")
        };       
        let userid = this.getCookie("userloginid");
        if(userid!==""&&userid!=="null"&&userid!==undefined&&userid!=="undefined"){

        // }else{
                document.getElementById('username').value=userid;
        }
        if(this.props.data.codeVerfiy)
            this.randImg();
    }
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
    changeCheck=()=> {
        this.setState({checked:!this.state.checked});
        if(!this.state.checked==false)
            this.setCookie("userloginid","");
    }
    initOption = (type,data) =>{
        let body=[];
        data.map((option,i) => (
            body.push(<NCOption className={"login-"+type+"-option"} value={option.code}>{option.name}</NCOption>)
        ));
        return body;
    }
    onSelect = (type,data) =>{
        if(type==="bc"){
            //this.loginprops.busiCenterCode = data;
            this.setCookie("busiCenterCode",data);
            window.location.reload();
        }
        if(type==="lang"){
            this.setCookie("langCode",data);
            window.location.reload();
        }           
    }

    queryOfferCountAction = () => {
        let _hash = window.location.hash;
        window.location.hash = 'c=60652010';

        return new Promise((resolve, reject) => {
            ajax({
                url: '/nccloud/hrzz/entry/QueryOfferCountAction.do',
                method: 'post',
                success: (res) => {
                    if(res.data) {
                        resolve();
                    }
                    else {
                        // 处理没有offer情况
                        AntModal.alert('您未收到offer');
                        reject();
                    }
                }
            });
        })
            .finally(() => {
                window.location.hash = _hash;
            });
            
    }

    onSubmit = ()=>{
        this.loginprops.timezone = new Date().toString().substring(25,33).insert(6,":");
        this.loginprops.userCode = document.getElementById('username').value;
        this.loginprops.userPWD = document.getElementById('password').value;
        if(this.loginprops.codeVerfiy){
            this.loginprops.rangImg = document.getElementById("rand").value;
        }
        if(!this.loginprops.exponent){
            document.getElementById('login-error-msg').innerText = getMultiLang("00043","安全日志数据源异常，请联系环境管理员处理");
            document.getElementById('login-error-msg').title = getMultiLang("00043","安全日志数据源异常，请联系环境管理员处理");
        }
        var key = RSAUtils.getKeyPair(this.loginprops.exponent, '', this.loginprops.modulus);
		this.loginprops.userPWD = RSAUtils.encryptedString(key, this.loginprops.userPWD);
        if(this.state.checked==true){
            this.setCookie("userloginid",this.loginprops.userCode);
        }
        var _this = this;
        // add  by bbqin
        function uuidv4() {
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (+('0.'+(+new Date()+'').split('').reverse().join('')) * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
        let aeskeyCahe = uuidv4();
        // 由于同一个浏览器  只有一个用户
        let cowboy = localStorage.getItem('cowboy');
        aeskeyCahe = cowboy ? opaqueDecrypt(cowboy) : aeskeyCahe;
        let aeskey = RSAUtils.encryptedString(key, aeskeyCahe);
        this.loginprops.aeskey = aeskey;
        
        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',138);
        // ------ end ------

        ajax({
            url: '/nccloud/riart/login/verfiy.do',
            data:_this.loginprops,        
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let rslCode = data.rslCode;
                
                    // 发一个同步ajax  --bbqin
                    // 如果浏览器器中出现了两个用户  以第一个用户的为主  保持同一个浏览器中唯一
                    localStorage.setItem('cowboy', cowboy || opaqueEncrypt(aeskeyCahe)); // 当前的
                    ajax({
                        type: 'post',
                        url: '/nccloud/platform/aes/switch.do',
                        data: { 
                            sysParamJson: {
                                busiaction: '查询请求aes加密开关' 
                            }
                        },
                        async: false,
                        success: function(asd) { // aesSwitchData
                            asd = typeof asd === 'string' ? JSON.parse(asd) : asd;
                            if (asd.data) {
                                if (asd.data.success || asd.success) {
                                    if (asd.data) {
                                        localStorage.setItem('rockin', true);
                                        localStorage.setItem('rockinlog',167);
                                    } else {
                                        localStorage.setItem('rockin', false);
                                        localStorage.setItem('rockinlog',171);
                                    }
                                }
                            }
                        },
                        error: function(res) {
                            localStorage.setItem('rockinlog',176);
                        }
                    });
                    if(rslCode=="0"){
                        this.queryOfferCountAction()
                            .then(() => {
                                sessionStorage.setItem('showNav', true)
                                _this.setCookie("busiCenterCode",_this.loginprops.busiCenterCode);
                                window.location = "/nccloud/resources/hrzz/entry-mobile/myentry/main/index.html";
                            });
                    }else {
                        if(_this.props.data.codeVerfiy){
                            _this.randImg();
                        }   
                        if(rslCode=="1"){
                            document.getElementById('login-error-msg').innerText=data.rslMsg;    
                            document.getElementById('login-error-msg').title = data.rslMsg;
                        }else if(rslCode=="2"){
                            _this.onChangePsw();
                            _this.loginprops.dsName = data.dsName;
                            document.getElementById("tips").innerText=data.rslMsg;
                            document.getElementById("newpsw").focus();
                            
                        }else if(rslCode=="3"){
                            CreateAlert(data.rslMsg,function(){
                                _this.loginprops.notips = 1;
                                _this.onSubmit();
                            },getMultiLang);
                        }else if(rslCode=="4"){                        
                            let chllid = data.chllid;
                            try{                            
                                let snid = sn(_this.loginprops.userCode,true); 
                                let signdata = sign(chllid,_this.loginprops.userCode,true,true);
                                _this.loginprops.p_sn = snid;
                                _this.loginprops.p_signdata = signdata;
                                _this.onSubmit();
                            }catch(e){
                                console.error(e);
                                return;
                            }   
                        }else if(rslCode=="5"){                        
                            CreateAlert(data.rslMsg,function(){
                                _this.loginprops.forcelogin = 1;
                                _this.onSubmit();
                            },getMultiLang);
                        }else if(rslCode=="-1"){
                           
                            document.getElementById('login-error-msg').innerText = data.msg;
                            document.getElementById('login-error-msg').title = data.rslMsg;
                        }                                      
                    }
                }
            }
        })
    }

    onChangePsw = () =>{
        this.setState({ showChangePsw: true });
    }
    forgetPsw = () =>{
        this.setState({ forgetpsw: true });
    }  
    close= () => {
        this.setState({
            showChangePsw: false,
            step:0
        });
    }
    onNext = () =>{
        this.setState({
            step:this.state.step+1
        });
    }
    onBefore = () =>{
        this.setState({
            step:this.state.step-1<0?0:this.state.step-1
        });
    }
    toClose = (time) =>{
        this.onNext();
        let self = this;
        setTimeout(() => {
            self.close();
          }, time);
    }
    closeForgetPsw= () => {
        this.setState({
            forgetpsw: false,
            forgetstep:0
        });
    }
    onNextForgetPsw = () =>{
        document.getElementById("psw-error-msg").innerText="";
        this.setState({
            forgetstep:this.state.forgetstep+1
        });
    }
    onBeforeForgetPsw = () =>{
        this.setState({
            forgetstep:this.state.forgetstep-1<0?0:this.state.forgetstep-1
        });
        setTimeout(() => {
            this.onFindPwdClearUserText();
        },50);
    }
    onFindPwdClearUserText = () =>{
        document.getElementById("pwduser").value="";
        document.getElementById("pwdemail").value="";
    }
    toGetResetCode = (reSend) =>{
        let op = {};
        op.bc = this.loginprops.busiCenterCode;
        if(reSend) {
            // 是否是重新发送
            op.userCode = this.pUserCode + '';
            op.contact = this.pContact + '';
        }else{
            op.userCode = document.getElementById("pwduser").value;
            op.contact = document.getElementById("pwdemail").value;
            this.pUserCode = op.userCode + '';
            this.pContact = op.contact + '';
        }
        this.hideContact = op.contact;
        op.type = '1';
        let _this = this;
        op.langCode = this.loginprops.langCode;
        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',297);

        ajax({
            url: '/nccloud/riart/login/forpsw.do',
            data:op,        
            success: function (res) {
                let { success, data } = res;
                if (success) {
                   if(data.status=="0"){
                    _this.loginprops.fkey = data.content;
                    if(!reSend) {
                        // 重新发送在当前页面，不需要跳转
                        _this.onNextForgetPsw();
                    }
                    _this.clearText();
                    // 60秒倒计时
                    let time = 60;
                    let secondInterval = setInterval(() => {
                        let emailNode = document.getElementById("email-intetval-seconds-id");
                        if(emailNode) {
                            time--;
                            if(time <= 0) {
                                clearInterval(secondInterval);
                                emailNode.innerText = "重新获取";
                                emailNode.style.cssText = "pointer-events: auto;";
                            }else {
                                let emailNode = document.getElementById("email-intetval-seconds-id");
                                emailNode.innerText = time + "秒后重新获取";
                                emailNode.style.cssText = "pointer-events: none;";
                            }
                        }else {
                            clearInterval(secondInterval);
                        }
                    }, "1000")
                   }else{
                    document.getElementById("psw-error-msg").innerText = data.content;
                   }
                }
            }
        })
    }
    clearText = () =>{
        document.getElementById("pwd1").value = "";
        document.getElementById("pwd2").value = "";
        document.getElementById("pwdverfiy").value = "";
    }
    toVerfiyAndReset = (time) =>{
        document.getElementById("psw-error-msg").innerText="";
        if(document.getElementById("pwd1").value!=document.getElementById("pwd2").value){
            document.getElementById("psw-error-msg").innerText = getMultiLang("00003","两次密码不一致");
            return;
        }
        let _this = this;
        let op = {};
        op.key = this.loginprops.fkey;
        op.identifyCode = document.getElementById("pwdverfiy").value;
        var key = RSAUtils.getKeyPair(this.loginprops.exponent, '', this.loginprops.modulus);
        op.psw = RSAUtils.encryptedString(key, document.getElementById("pwd1").value);
        op.langCode = this.loginprops.langCode;
        op.type = "1";
        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',359);
        // ------ end ------
        ajax({
            url: '/nccloud/riart/login/toreset.do',
            data:op,        
            success: function (res) {
                let { success, data } = res;
                if (success) {
                   if(data.status=="0"){
                    _this.onNextForgetPsw();

                    let time = 5;
                    let secondInterval = setInterval(() => {
                        let closeNode = document.getElementById("forget-pwd-modify-interval-close");
                        if(closeNode) {
                            time--;
                            if(time <= 0) {
                                _this.closeForgetPsw();
                                clearInterval(secondInterval);
                            }else {
                                closeNode.innerText = "请保管好密码，" + time + "秒后自动关闭";
                            }
                        }else {
                            clearInterval(secondInterval);
                        }
                    }, "1000")
                   }else{
                        document.getElementById("psw-error-msg").innerText = data.content;
                   }
                }
            }
        })
    }
    onEnter = (e, k) =>{
        if(e.which==13){
            if(e.target.id=="username"){
                this.refs.password.focus();
            }
            if(e.target.id=="password"){
                if(this.props.data.codeVerfiy)
                    this.refs.rand.focus()
                else
                    this.onSubmit();
            }
            if(e.target.id=="rand"){
                this.refs.rand.blur();
                this.onSubmit();
            }
        }else if(e.target.id=="username"){
            let userCode = document.getElementById('username').value;
            if(userCode==""){
                document.getElementById('password').value="";
            }
        }
    }
    onEnterResetPwd = (e) => {
        if(e.which==13){
            let id = e.target.id;
            if(id == 'newpsw') {
                document.getElementById("newpsw1").focus();
            }else if(id == 'newpsw1') {
                document.getElementById('reset-psd-confirm').focus();
            }
        }
    }
    onReset = () => {
        
        let self = this;
        document.getElementById("psw-error-msg").innerText = "";
        let op = {};
        op.lodpsw = this.loginprops.userPWD
        op.newpsw = document.getElementById("newpsw").value;
        let newpsw1 = document.getElementById("newpsw1").value;
        if(op.newpsw!=newpsw1){
            document.getElementById("psw-error-msg").innerText = getMultiLang("00003","两次密码不一致");
            return;
        }
        let key = RSAUtils.getKeyPair(this.loginprops.exponent, '', this.loginprops.modulus);
        //op.lodpsw = RSAUtils.encryptedString(key,op.lodpsw);
        op.dsName = this.loginprops.dsName;
        op.userCode = this.loginprops.userCode;
        op.newpsw = RSAUtils.encryptedString(key,op.newpsw);
        op.langCode = this.loginprops.langCode;
        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',444);
        this.setCookie('nccloudsessionid', '')
        // ------ end ------
        ajax({
            url: '/nccloud/login/psw/reset.do',
            data:op,        
            success: function (res) {
                let { success, data } = res;
                if (success) {
                    if(data=="1"){
                        document.getElementById("psw-error-msg").innerText = getMultiLang("00030","修改失败请联系管理员！");
                    }else if(data=="0"){
                        self.toClose("5000");
                        self.loginprops.userPWD = document.getElementById('password').value = "";                        
                    }else{
                        document.getElementById("psw-error-msg").innerText = data;
                    }
                }
            }
        })
    }
    hideVersionCheck = () =>{
        document.getElementById("checkVersion").style.display="none";
    }
    showVersionTips = () =>{
        let arr = navigator.userAgent.split(' '); 
        let chromeVersion = '';
        for(let i=0;i < arr.length;i++){
            if(/chrome/i.test(arr[i]))
                chromeVersion = arr[i]
        }
        if(chromeVersion){
            let version = Number(chromeVersion.split('/')[1].split('.')[0]);
            if(version&&version>43){
                return;
            }
        }
        let i=0;
    }
    clearMsg = () =>{
        document.getElementById("login-error-msg").innerText="";
    }
    randImg = ()=>{
        document.getElementById("rand").value="";
        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',496);
        // ------ end ------
        ajax({
            url: '/nccloud/riart/login/rand.do',      
            success: function (res) {
                let { success, data } = res;
                if (success) {         
                    document.getElementById("randImg").src="data:image/png;base64,"+data;
                }
            }
        })
    }
    clickForgetPwdBtn = () =>{
        // 如果启用了短信验证码，就显示选择找回密码的方式页面
        if(this.enableMobileVerCode) {
            this.mobileFindPsw();   
        }else {
            this.forgetPsw();
            setTimeout(() => {
                let switchPhoneNode = document.getElementById("switch-to-phone-id");
                switchPhoneNode.style.cssText = "display: none;";
            },20);
        }
    }
    switchToEmail = () =>{
        this.closeMobileFindPsw();
        this.forgetPsw();
    }
    switchToPhone = () =>{
        this.closeForgetPsw();
        this.mobileFindPsw();
    }
    getContactTitleTip = () =>{
        return '重置密码，输入我们发送到' + this.hideContact + '的验证码';
    }
    // 手机找回密码 start
    mobileFindPsw = () =>{
        this.setState({ mobileFindPsw: true });
    }
    closeMobileFindPsw= () => {
        this.setState({
            mobileFindPsw: false,
            mobileFindPswStep:0
        });
    }
    mobileFindPswRandImg = () =>{
        document.getElementById("mobilepicvercode").value="";
        this.picVerCodeKey = new Date().getTime();
        document.getElementById("mobilefindpwdrandImg").src = this.yhtRandImgUrl + this.picVerCodeKey;
    }
    toMobileFindPwdSendCode = () =>{
        let op = {};
        op.bc = this.loginprops.busiCenterCode;
        op.userCode = document.getElementById("mobilepwduser").value;
        op.contact = document.getElementById("mobilepwdnum").value;
        this.hideContact = op.contact;
        op.type = '2';
        op.picVerCode = document.getElementById("mobilepicvercode").value;
        op.picVerCodeKey = this.picVerCodeKey + "";
        let _this = this;
        op.langCode = this.loginprops.langCode;
	// 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',559);
        ajax({
            url: '/nccloud/riart/login/forpsw.do',
            data:op,        
            success: function (res) {
                let { success, data } = res;
                if (success) {
                   if(data.status=="0"){
                    _this.loginprops.fkey = data.content;
                    _this.onNextMobileFindPsw();
                    _this.onMobileFindPwdOneStepClearText();
                    // 60秒倒计时
                    let time = 60;
                    let secondInterval = setInterval(() => {
                        let emailNode = document.getElementById("mobile-intetval-seconds-id");
                        if(emailNode) {
                            time--;
                            if(time <= 0) {
                                clearInterval(secondInterval);
                                emailNode.innerText = "重新获取";
                                emailNode.style.cssText = "pointer-events: auto;";
                            }else {
                                emailNode.innerText = time + "秒后重新获取";
                                emailNode.style.cssText = "pointer-events: none;";
                            }
                        }else {
                            clearInterval(secondInterval);
                        }
                    }, "1000")
                   }else{
                    document.getElementById("mobile-find-psw-error-msg").innerText = data.content;
                    // 如果是验证码错误，则刷新验证码
                    if(data.status=="0481") {
                        _this.mobileFindPswRandImg();
                    }
                   }
                }
            }
        })
    }
    onMobileFindPwdOneStepClearText = () =>{
        document.getElementById("m-find-pwd-pwd1").value = "";
        document.getElementById("m-find-pwd-pwd2").value = "";
        document.getElementById("m-find-pwd-pwdverfiy").value = "";
    }
    onNextMobileFindPsw = () =>{
        document.getElementById("mobile-find-psw-error-msg").innerText="";
        this.setState({
            mobileFindPswStep:this.state.mobileFindPswStep+1
        });
    }
    onMobileFindPwdClearUserText = () =>{
        document.getElementById("mobilepwduser").value="";
        document.getElementById("mobilepwdnum").value="";
        document.getElementById("mobilepicvercode").value="";
    }
    onBeforeMobileFindPsw = () =>{
        this.setState({
            mobileFindPswStep: this.state.mobileFindPswStep - 1 < 0 ? 0 : this.state.mobileFindPswStep-1
        });
        setTimeout(() => {
            this.onMobileFindPwdClearUserText();
        },50);
    }
    toMobileVerfiyAndReset = (time) =>{
        document.getElementById("mobile-find-psw-error-msg").innerText="";
        if(document.getElementById("m-find-pwd-pwd1").value!=document.getElementById("m-find-pwd-pwd2").value){
            document.getElementById("mobile-find-psw-error-msg").innerText = getMultiLang("00003","两次密码不一致");
            return;
        }
        let _this = this;
        let op = {};
        op.key = this.loginprops.fkey;
        op.identifyCode = document.getElementById("m-find-pwd-pwdverfiy").value;
        var key = RSAUtils.getKeyPair(this.loginprops.exponent, '', this.loginprops.modulus);
        op.psw = RSAUtils.encryptedString(key, document.getElementById("m-find-pwd-pwd1").value);
        op.langCode = this.loginprops.langCode;
        op.type = "2";
        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',639);
        // ------ end ------
        ajax({
            url: '/nccloud/riart/login/toreset.do',
            data:op,        
            success: function (res) {
                let { success, data } = res;
                if (success) {
                   if(data.status=="0"){
                    _this.onNextMobileFindPsw();

                    let time = 5;
                    let secondInterval = setInterval(() => {
                        let closeNodes = document.getElementById("mobile-forget-pwd-modify-interval-close");
                        if(closeNodes) {
                            time--;
                            if(time <= 0) {
                                _this.closeMobileFindPsw();
                                clearInterval(secondInterval);
                            }else {
                                closeNodes.innerText = "请保管好密码，" + time + "秒后自动关闭";
                            }
                        }else {
                            clearInterval(secondInterval);
                        }
                    }, "1000")
                   }else{
                        document.getElementById("mobile-find-psw-error-msg").innerText = data.content;
                   }
                }
            }
        })
    }
    // 手机找回密码 end  
    render() {
        let {
            data,
            busiCenterCode,
            langCode
        } = this.props;  

        data.busiCenterCode = busiCenterCode;
        data.langCode = langCode;

        let {
            bc,
            lang,
            modulus,
            exponent,
            codeVerfiy,
            yhtRandImgUrl,
            enableMobileVerCode
        } = data;

        this.loginprops =data;
        this.yhtRandImgUrl = yhtRandImgUrl;
        this.enableMobileVerCode = enableMobileVerCode;
        this.picVerCodeKey= new Date().getTime();

        let m_top = codeVerfiy?"45px":"55px";
        let m_bottom = codeVerfiy?"30px":"60px";
        let img2 = codeVerfiy ? (
            <div className="randDiv">
                <input 
                    className="u-form-control text1" 
                    ref="rand" 
                    onKeyDown={this.onEnter} 
                    id="rand" 
                    placeholder={getMultiLang("00031","验证码")}
                />
                    <img onClick={this.randImg} id="randImg"/>
                </div>
            ) : "";

        return (
            <div className="login-main">
                <div className="login-content">
                    <div className="content-right">
                        <div className="login-panel-out">
                            <div  
                                className="login-panel" 
                                style={{
                                    paddingTop:m_top,
                                    paddingBottom:m_bottom
                                }}>
                                <input 
                                    style={{
                                        display:"none"
                                    }}
                                    type="text" 
                                    name="fakeusernameremembered"
                                />
                                <input 
                                    style={{
                                        display:"none"
                                    }} 
                                    type="password" 
                                    name="fakepasswordremembered"
                                />
                                <InputItem
                                    name="fakeusernameremembered" 
                                    fieldid="username"  
                                    onFocus={this.clearMsg} 
                                    id="username" 
                                    onKeyDown={this.onEnter}    
                                    className="u-form-control text" 
                                    type="text" 
                                    placeholder={getMultiLang("00002","用户名")}
                                />
                                
                                <InputItem 
                                    name="fakepasswordremembered" 
                                    fieldid="password" 
                                    onFocus={this.clearMsg} 
                                    ref="password" 
                                    id="password" 
                                    onKeyDown={this.onEnter}   
                                    className="u-form-control text" 
                                    type="password" 
                                    placeholder={getMultiLang("00004","密码")}
                                />
                                {img2}
                                <div className="login-error2-msg" id="login-error-msg"></div>
                                <div className="login-btn">
                                    <Button 
                                        id="loginBtn" 
                                        onClick = {this.onSubmit}
                                        type="warning"
                                        style={{
                                            borderRadius: '30px'
                                        }}
                                    >
                                        {getMultiLang("00007","登录")}
                                    </Button>
                                </div>
                                <div 
                                    className="panel-oper"
                                >
                                    <NCCheckbox 
                                        fieldid="记住账号_checkbox"  
                                        onChange={this.changeCheck} 
                                        checked={this.state.checked} 
                                        className="inbox"
                                    >
                                            {getMultiLang("00005","记住账号")}
                                    </NCCheckbox>
                                    <a 
                                        onClick={this.clickForgetPwdBtn} 
                                        className="oper-ps" 
                                        href="#"
                                    >
                                        {getMultiLang("00006","忘记密码")}?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>                
                </div>
                
                
                <Modal visible={this.state.showChangePsw}  step={this.state.step}>
                    <div className="login-tabs">
                    <Modal.Title onClose={this.close}>
                    {getMultiLang("00009","重置密码")}
                    </Modal.Title>
                    <Modal.Content className="reset-psw">
                        <div id="tips" className="tips">{getMultiLang("00010","为保证账户安全,首次登陆需修改初始密码,重新设置密码")}</div>
                        <div className="psw-error-msg psw-reset-msg" id="psw-error-msg"></div>                        
                        <div className="psw-p">
                            <div className="psw-p-label">{getMultiLang("00011","新密码")}</div>
                            <div className="psw-p-input">
                                <input className="u-form-control text" id="newpsw" type="password" placeholder={getMultiLang("00012","请输入")} onKeyDown={this.onEnterResetPwd}/>
                            </div>
                        </div>
                        <div className="psw-p">
                            <div className="psw-p-label">{getMultiLang("00013","确认新密码")}</div>
                            <div className="psw-p-input">
                                <input className="u-form-control text" id="newpsw1" type="password" placeholder={getMultiLang("00012","请输入")} onKeyDown={this.onEnterResetPwd}/>
                            </div>
                        </div>
                    </Modal.Content>
                    <Modal.Foot>
                        <NCButton className="modalCencel" onClick={this.close}>{getMultiLang("00014","取消")}</NCButton>
                        <NCButton className="modalOK confirm-btn" onClick={this.onReset} id="reset-psd-confirm">{getMultiLang("00015","确认")}</NCButton>
                    </Modal.Foot>
                    </div>
                    <div className="login-tabs">
                    <Modal.Title onClose={this.close}>
                    {getMultiLang("00009","重置密码")}
                    </Modal.Title>
                    <Modal.Content>
                        <div className="psw-reset1">{getMultiLang("00016","密码修改成功！请重新登录。")}</div>
                        <div className="psw-reset2">{getMultiLang("00017","5s后自动关闭")}</div>         
                    </Modal.Content>
                    <Modal.Foot>                        
                        <NCButton 
                            className="modalOK" 
                            onClick={this.close}
                        >
                            {getMultiLang("00018","关闭")}
                        </NCButton>
                    </Modal.Foot>
                    </div>                    
                </Modal>
                <Modal visible={this.state.mobileFindPsw}  step={this.state.mobileFindPswStep}>
                    <div className="login-tabs">
                        <Modal.Title onClose={this.closeMobileFindPsw}>
                        {getMultiLang("00006","忘记密码")}
                        </Modal.Title>
                        <Modal.Content className="forget-pwd-content-wrapper">
                            <div class="forget-pwd-tip-wrapper">
                                <div class="icon"><div class="dot"></div></div>
                                <i class="tip">{getMultiLang("00048","身份验证，输入您NC Cloud帐号相关联的用户信息")}</i>
                            </div>
                            <div class="forget-pwd-divider"></div>
                            <div class="forget-pwd-input-wrapper second-step-forget-pwd">
                                <div className="forget-psw-p">
                                    <div className="forget-psw-p-label">{getMultiLang("00002","用户名")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" id="mobilepwduser" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                </div>
                                <div className="forget-psw-p extend-style position-extend-style">
                                    <div className="forget-psw-p-label">{getMultiLang("00038","手机号码")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" id="mobilepwdnum" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                    <div className="switch-to-email-wrapper" onClick={this.switchToEmail}><img src="../../../public/img/switch-type-style.svg" class="img-switch"></img>{getMultiLang("00049","切换至邮箱")}</div>
                                </div>
                                <div className="forget-psw-p extend-style1">
                                    <div className="forget-psw-p-label">{getMultiLang("00039","验证码")}</div>
                                    <div className="forget-psw-p-input">
                                        <input id="mobilepicvercode" class="u-form-control text forget-psw-mobile-ver-code-input" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                        <img onClick={this.mobileFindPswRandImg} class="forget-psw-mobile-ver-code-img" id="mobilefindpwdrandImg" src={this.yhtRandImgUrl + this.picVerCodeKey}/>
                                    </div>
                                </div>
                            </div>
                            <div className="forget-psw-error-msg extent-error-msg" id="mobile-find-psw-error-msg"></div>   
                        </Modal.Content>
                        <Modal.Foot className="forget-pwd-footer">
                            <NCButton className="modalOK extend-fix-style2" onClick={this.toMobileFindPwdSendCode}>{getMultiLang("00024","下一步")}</NCButton>
                            <NCButton 
                                className="modalCencel extend-fix-style1" 
                                onClick={this.closeMobileFindPsw}
                                style={{
                                    marginRight: 0
                                }}
                            >
                                {getMultiLang("00014","取消")}
                            </NCButton>
                        </Modal.Foot>               
                    </div>
                    <div className="login-tabs">
                        <Modal.Title onClose={this.closeMobileFindPsw}>
                        {getMultiLang("00006","忘记密码")}
                        </Modal.Title>
                        <Modal.Content className="forget-pwd-content-wrapper">
                            <div class="forget-pwd-tip-wrapper">
                                <div class="icon"><div class="dot"></div></div>
                                <i class="tip">{this.getContactTitleTip()}</i>
                            </div>
                            <div class="forget-pwd-divider"></div>
                            <div class="forget-pwd-input-wrapper second-step-forget-pwd">
                                <div className="forget-psw-p">
                                    <div className="forget-psw-p-label forget-psw-p-label-extend">{getMultiLang("00041","手机验证码")}</div>
                                    <div className="forget-psw-p-input forget-psw-p-input-extend">
                                        <input className="u-form-control text" name="pwdverfiy" id="m-find-pwd-pwdverfiy" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                        <div class="intetval-seconds-wrapper" id="mobile-intetval-seconds-id" onClick={this.onBeforeMobileFindPsw}>{getMultiLang("00050","60秒后重新获取")}</div>
                                    </div>
                                </div>
                                <div className="forget-psw-p extend-style">
                                    <div className="forget-psw-p-label forget-psw-p-label-extend">{getMultiLang("00011","新密码")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" name="pwd1" id="m-find-pwd-pwd1" type="password" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                </div>
                                <div className="forget-psw-p extend-style">
                                    <div className="forget-psw-p-label forget-psw-p-label-extend">{getMultiLang("00013","确认新密码")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" name="pwd2" id="m-find-pwd-pwd2" type="password" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="forget-psw-error-msg extent-error-msg" id="mobile-find-psw-error-msg"></div>   
                        </Modal.Content>
                        <Modal.Foot className="forget-pwd-footer">
                            <NCButton 
                                className="modalCencel extend-fix-style1" 
                                onClick={this.closeMobileFindPsw}
                            >
                                {getMultiLang("00014","取消")}
                            </NCButton>
                            <div 
                                className="forget-pwd-last-step" 
                                onClick={this.onBeforeMobileFindPsw}
                            >
                                {getMultiLang("00028","上一步")}
                            </div>
                            <NCButton className="modalOK extend-fix-style2" onClick={this.toMobileVerfiyAndReset.bind("5000")}>{getMultiLang("00051","确认修改")}</NCButton>
                        </Modal.Foot>
                    </div>
                    <div className="login-tabs">
                        <Modal.Title onClose={this.closeMobileFindPsw}>
                        {getMultiLang("00006","忘记密码")}
                        </Modal.Title>
                        <Modal.Content className="forget-pwd-content-wrapper third-step-extend-style">
                            <div class="forget-pwd-tip-wrapper">
                                <div class="icon"><div class="dot"></div></div>
                                <i class="tip important-tip">{getMultiLang("00052","密码修改成功!")}</i>
                            </div>
                            <div class="forget-pwd-divider"></div>
                            <img 
                                class="forget-pwd-modify-img" 
                                src="../../../public/images/forget-pwd-modify-success.png"
                            />
                            <div class="forget-pwd-modify-text" id="mobile-forget-pwd-modify-interval-close">image{getMultiLang("00053","请保管好密码，5秒后自动关闭")}</div>
                            <div 
                                class="forget-pwd-third-step-close" 
                                onClick={this.closeMobileFindPsw}
                            >
                                {getMultiLang("00018","关闭")}
                            </div>
                        </Modal.Content>
                    </div>
                    
                </Modal>
                <Modal visible={this.state.forgetpsw}  step={this.state.forgetstep}>
                    <div className="login-tabs">
                        <Modal.Title onClose={this.closeForgetPsw}>
                        {getMultiLang("00006","忘记密码")}
                        </Modal.Title>
                        <Modal.Content className="forget-pwd-content-wrapper">
                            <div class="forget-pwd-tip-wrapper">
                                <div class="icon"><div class="dot"></div></div>
                                <i class="tip">{getMultiLang("00048","身份验证，输入您NC Cloud帐号相关联的用户信息")}</i>
                            </div>
                            <div class="forget-pwd-divider"></div>
                            <div class="forget-pwd-input-wrapper">
                                <div className="forget-psw-p">
                                    <div className="forget-psw-p-label">{getMultiLang("00002","用户名")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" id="pwduser" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                </div>
                                <div className="forget-psw-p extend-style position-extend-style">
                                    <div className="forget-psw-p-label">{getMultiLang("00023","邮箱")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" id="pwdemail" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                    <div className="switch-to-email-wrapper" onClick={this.switchToPhone} id="switch-to-phone-id"><img src="../../../public/img/switch-type-style.svg" class="img-switch"></img>{getMultiLang("00054","切换至手机号")}</div>
                                </div>
                            </div>
                            <div className="forget-psw-error-msg" id="psw-error-msg"></div>   
                        </Modal.Content>
                        <Modal.Foot className="forget-pwd-footer">
                            <NCButton className="modalOK extend-fix-style2" onClick={this.toGetResetCode.bind(this,false)}>{getMultiLang("00024","下一步")}</NCButton>
                            <NCButton className="modalCencel extend-fix-style1" onClick={this.closeForgetPsw}>{getMultiLang("00014","取消")}</NCButton>
                            
                        </Modal.Foot>                       
                    </div>
                    <div className="login-tabs">
                        <Modal.Title onClose={this.closeForgetPsw}>
                        {getMultiLang("00006","忘记密码")}
                        </Modal.Title>
                        <Modal.Content className="forget-pwd-content-wrapper">
                            <div class="forget-pwd-tip-wrapper">
                                <div class="icon"><div class="dot"></div></div>
                                <i class="tip">{this.getContactTitleTip()}</i>
                            </div>
                            <div class="forget-pwd-divider"></div>
                            <div class="forget-pwd-input-wrapper second-step-forget-pwd">
                                <div className="forget-psw-p">
                                    <div className="forget-psw-p-label forget-psw-p-label-extend">{getMultiLang("00027","邮箱验证码")}</div>
                                    <div className="forget-psw-p-input forget-psw-p-input-extend">
                                        <input className="u-form-control text" name="pwdverfiy" id="pwdverfiy" type="text" placeholder={getMultiLang("00012","请输入")}/>
                                        <div class="intetval-seconds-wrapper" id="email-intetval-seconds-id" onClick={this.toGetResetCode.bind(this,true)}>{getMultiLang("00050","60秒后重新获取")}</div>
                                    </div>
                                </div>
                                <div className="forget-psw-p extend-style">
                                    <div className="forget-psw-p-label forget-psw-p-label-extend">{getMultiLang("00011","新密码")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" name="pwd1" id="pwd1" type="password" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                </div>
                                <div className="forget-psw-p extend-style">
                                    <div className="forget-psw-p-label forget-psw-p-label-extend">{getMultiLang("00013","确认新密码")}</div>
                                    <div className="forget-psw-p-input">
                                        <input className="u-form-control text" name="pwd2" id="pwd2" type="password" placeholder={getMultiLang("00012","请输入")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="forget-psw-error-msg extent-error-msg" id="psw-error-msg"></div>   
                        </Modal.Content>
                        <Modal.Foot className="forget-pwd-footer">
                            <NCButton className="modalCencel extend-fix-style1" onClick={this.closeForgetPsw}>{getMultiLang("00014","取消")}</NCButton>
                            <div className="forget-pwd-last-step" onClick={this.onBeforeForgetPsw}>{getMultiLang("00028","上一步")}</div>
                            <NCButton className="modalOK extend-fix-style2" onClick={this.toVerfiyAndReset.bind("5000")}>{getMultiLang("00051","确认修改")}</NCButton>
                        </Modal.Foot>
                    </div>
                    <div className="login-tabs">
                        <Modal.Title onClose={this.closeForgetPsw}>
                        {getMultiLang("00006","忘记密码")}
                        </Modal.Title>
                        <Modal.Content className="forget-pwd-content-wrapper third-step-extend-style">
                            <div class="forget-pwd-tip-wrapper">
                                <div class="icon"><div class="dot"></div></div>
                                <i class="tip important-tip">{getMultiLang("00052","密码修改成功!")}</i>
                            </div>
                            <div class="forget-pwd-divider"></div>
                            <img class="forget-pwd-modify-img" src="../../../public/img/forget-pwd-modify-success.png"></img>
                            <div class="forget-pwd-modify-text" id="forget-pwd-modify-interval-close">{getMultiLang("00053","请保管好密码，5秒后自动关闭")}</div>
                            <div class="forget-pwd-third-step-close" onClick={this.closeForgetPsw}>{getMultiLang("00018","关闭")}</div>
                        </Modal.Content>
                    </div>
                    
                </Modal>
            </div>            
        )
    }
}

// 重置 aes 请求 --bbqin
localStorage.setItem('rockin', false);
localStorage.setItem('rockinlog',968);

const getData = () => { 
    try{
        cacheTools.clear();
    }catch(e){

    }
    let data ={};
    data.bcCode = getStoreBc();
    document.getElementsByTagName("TITLE")[0].text = getMultiLang("00047","大型企业数字化平台");
    ajax({
        url: '/nccloud/riart/login/init.do',
        data:data,
        success: function (res) {
            document.querySelector('#login_div').setAttribute("style","background:url('../../../public/img/bg2.jpg') no-repeat;background-size: 100% 100%;");
            let { success, data } = res;
            if (success) {                
                ReactDOM.render(<Main data={data}  busiCenterCode={(data.bcCode==undefined||data.bcCode=='')?(data.bc.length==0?"":data.bc[0].code):data.bcCode} langCode={getStoreLang(data.lang.length==0?"":data.lang[0].code)}/>, document.querySelector('#login_div'));
            }
        }
    })
}
InitMultiLang("login-001",getData);

