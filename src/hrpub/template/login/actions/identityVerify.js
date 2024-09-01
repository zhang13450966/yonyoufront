

import Toast from 'antd-mobile/lib/toast';
import RSAUtils from "./rsa/security.js";

import {
    getStoreLang,
    InitMultiLang,
    getMultiLang,
    getStoreBc
} from "./language";

export default class IdVerifyAction {
    constructor(child, context) {
        this.ma = child;
        this.c = context;
    }

    // 提交身份验证信息, 并且发送验证码
    submitVerify = async () => {
        let postData = this.makeVerifyOpt();

        let res = await this.ma.idVerify(postData);

        if(res.success) {
            if(res.data.status === '0') {
                this.ma.update({
                    fkey: res.data.content,
                    currentPage: 'reset-pwd',
                    showVerifyCode: true
                });
            }
            else {
                Toast.fail(res.data.content);
            }
        }
    }

    // 拼接身份验证信息的提交提交参数
    makeVerifyOpt = () => {
        const {props, state} = this.c;
        
        let postData = {
            bc: props.busiCenterCode,
            userCode: state.userName,
            contact: state.email,
            type: '1',
            langCode: props.langCode
        }


        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',297);

        return postData;
    }

    // 提交重置密码
    submitResetPwd = async () => {
        const {currentPage} = this.c.state;
        let postData = {};
        
        if(currentPage === 'first-login') {
            postData = this.makeFirstLoginOpt();
        }
        else {
            postData = this.makeResetOpt();
        }

        if(postData) {
            let res = {};
            if(currentPage === 'first-login') {
                res = await this.ma.postResetFromFirstLogin(postData);
            }
            else {
                res = await this.ma.postResetPwd(postData);
            }

            if(currentPage === 'first-login') {
                this.resetSuccessFromFirstLogin(res);
            }
            else {
                this.resetSuccessFromForget(res);
            }
        }
    }

    // 第一次登录重置密码成功回调
    resetSuccessFromFirstLogin = (res) => {
        if(res.success) {
            if(res.data === '0') {
                Toast.success(getMultiLang('00016', '密码修改成功！请重新登录'), 3, () => {
                    this.toMainPage();
                });
            }
            else if(res.data === '1') {
                Toast.fail(getMultiLang('00030', '修改失败请联系管理员！'));
            }
            else {
                Toast.fail(res.data);
            }
        }
    }

    // 重新跳回到首页
    toMainPage = () => {
        this.ma.update({
            currentPage: 'main', // 当前页面 main id-verify reset-pwd
            userName: '', // 登录的用户名
            password: '', // 登录的密码
            codeVerify: false, // 是否有验证码
            email: '', // 用户邮箱
            fkey: '', // 验证第一步返回的值
            newPwd: '', // 新密码
            sureNewPwd: '', // 确认新密码
            verifyCode: '', // 邮箱验证码
            showVerifyCode: true, // 是否需要显示邮箱验证码输入框
            inputType: {
                newPwd: 'text',
                sureNewPwd: 'text'
            }, // input框动态设置type，为了解决自动填充密码问题
        });
    }

    // 忘记密码重置成功回调
    resetSuccessFromForget = (res) => {
        if(res.success) {
            if(res.data.status === '0') {
                Toast.success(getMultiLang('00053', '请保管好密码'), 3, () => {
                    this.toMainPage();
                });
            }
            else {
                Toast.fail(res.data.content);
            }
        }
    }

    // 拼接第一次登录重置的参数
    makeFirstLoginOpt = () => {
        const {props, state} = this.c; 
        const {data, langCode} = props;

        if(state.newPwd !== state.sureNewPwd) {
            Toast.fail(getMultiLang('00003', '两次密码不一致'));
            return false;
        }
        
        let postData = {
            lodpsw: state.encryptionPWD,
            newpsw: '',
            dsName: state.dsName,
            userCode: state.userName,
            langCode: langCode
        };

        let key = RSAUtils.getKeyPair(data.exponent, '', data.modulus);
        postData['newpsw'] = RSAUtils.encryptedString(key, state.newPwd);

        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',444);
        this.ma.setCookie('nccloudsessionid', '')

        return postData;
    }

    // 拼接重制密码的参数
    makeResetOpt = () => {
        const {props, state} = this.c; 
        const {data, langCode} = props;

        if(state.newPwd !== state.sureNewPwd) {
            Toast.fail(getMultiLang('00003', '两次密码不一致'));
            return false;
        }
        
        let postData = {
            key: state.fkey,
            identifyCode: state.verifyCode,
            psw: '',
            langCode: langCode,
            type: '1'
        };

        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',359);

        let psw = RSAUtils.getKeyPair(data.exponent, '', data.modulus);
        psw = RSAUtils.encryptedString(psw, state.newPwd);
        
        postData['psw'] = psw;

        return postData;
    }
}