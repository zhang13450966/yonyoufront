
import Cookie from './cookie';

import {
    base,
    cacheTools,
    Cipher
} from 'nc-lightapp-front';

import {
    getStoreLang,
    InitMultiLang,
    getMultiLang,
    getStoreBc
} from "./language";

import Toast from 'antd-mobile/lib/toast';

import {
    insertString,
    uuidv4,
    confirm
} from './tool';

import RSAUtils from "./rsa/security.js";

import RequestAction from './request';
import IdVerifyAction from './identityVerify';

// 增加加密操作 bbqin
const { opaqueEncrypt, opaqueDecrypt} = Cipher;

class MainAction {
    constructor(c) {
        this.c = c;

        this.loginUserNameInput = null;
    }

    extend = [Cookie, RequestAction, IdVerifyAction]

    didMount = () => {
        const {
            props: {
                data: {
                    codeVerfiy
                },
                busiCenterCode
            }
        } = this.c;

        this.setCookie("busiCenterCode", busiCenterCode);

        let userId = this.getCookie("userloginid");

        if(userId && userId !== 'null' && userId !== 'undefined') {
            this.update({
                userName: userId,
                codeVerify: codeVerfiy
            });
        }
        this.update({
            codeVerify: codeVerfiy
        });
        this.getPageHeight();
    }

    // 获取页面的高度
    getPageHeight = () => {
        if(window.getComputedStyle) {
            let app = document.getElementById('login_div');
            let height = window.getComputedStyle(app).height.replace('px', '');

            this.update({
                pageHeight: height
            });
        }
    }

    // 跳转到
    turnToPage = (page, from) => {    
        return () => {
            if(page === 'id-verify' && from === 'main') {
                this.update({
                    userName: '',
                    email: ''
                });
            }
            this.update({
                currentPage: page
            });
        }
    }

    // 存储userName输入框的实例
    setLoginUserNameRef = (ref) => {
        this.loginUserNameInput = ref;
    }

    update = (data, cb) => {
        this.c.setState({
            ...data
        }, cb);
    }

    // 输入用户名密码的时候
    onChangeInput = (field) => {
        return (value, e) => {
            this.update({
                [field]: value
            });
        }
    }

    // 点击登录提交
    onLogin = async (e, postData) => {
        const {state, props} = this.c;
        const {
            userName,
            password
        } = state;
        const {
            data
        } = props;

        if(!data.exponent) {
            Toast.fail(getMultiLang("00043","安全日志数据源异常，请联系环境管理员处理"));
            return;
        }

        if(!userName || !password) {
            return;
        }

        let opt = this.makeLoginOption(postData);

        let res = await this.loginSubmit(opt.postData); 

        if(res.success) {
            this.loginSuccess(res, opt);
        }
    }

    // 登录请求成功的函数
    loginSuccess = (res, opt) => {
        const {
            props: {
                busiCenterCode,
                data: {
                    codeVerfiy
                }
            }
        } = this.c;
        let { data } = res;

        let rslCode = data.rslCode;

        let cowboy = opt.cowboy;
        let aeskeyCahe = opt.aeskeyCahe;

        localStorage.setItem('cowboy', cowboy || opaqueEncrypt(aeskeyCahe));

        this.postSwitch();

        // 登录成功
        if(rslCode === '0') {
            this.queryOfferCountAction()
                .then((res) => {
                    if(res) {
                        sessionStorage.setItem('showNav', true)
                        this.setCookie("busiCenterCode", busiCenterCode);
                        window.location = "/nccloud/resources/hrzz/entry-mobile/myentry/main/index.html";
                    }
                });
        }
        // 登录失败
        else if(rslCode === '1' || rslCode === '-1') {
            Toast.fail(data.rslMsg);
        }
        // 首次登录需要重置密码
        else if (rslCode === '2') {
            this.update({
                currentPage: 'first-login',
                showVerifyCode: false,
                dsName: data.dsName
            });
        }
        // 需要确认在登录的状态
        else if(rslCode === '3' || rslCode === '5') {
            confirm(data.rslMsg, () => {
                if(rslCode === '3') {
                    opt.postData['notips'] = 1
                }
                else if(rslCode === '5') {
                    opt.postData['forcelogin'] = 1;
                }

                this.onLogin(null, opt.postData)
            }, getMultiLang);
        }
    }

    // 拼接登录参数
    makeLoginOption = (postData) => {
        const {state, props} = this.c;
        const {
            userName,
            password
        } = state;
        const {
            data,
            busiCenterCode,
            langCode
        } = props;

        if(!postData) {
            postData = {
                ...data,
                busiCenterCode: busiCenterCode,
                langCode: langCode,
                timezone: insertString(new Date().toString().substring(25,33), 6, ":"),
                userCode: userName,
                userPWD: ''
            };
        }

        let key = RSAUtils.getKeyPair(data.exponent, '', data.modulus);
        let aeskeyCahe = uuidv4();
        let cowboy = localStorage.getItem('cowboy');

        aeskeyCahe = cowboy ? opaqueDecrypt(cowboy) : aeskeyCahe;

        let aeskey = RSAUtils.encryptedString(key, aeskeyCahe);

        postData['userPWD'] = RSAUtils.encryptedString(key, password);
        postData['aeskey'] = aeskey;

        // 重置 aes 请求 --bbqin
        localStorage.setItem('rockin', false);
        localStorage.setItem('rockinlog',138);

        this.update({
            encryptionPWD: postData['userPWD']
        });

        return {
            postData: postData,
            key: key,
            aeskeyCahe: aeskeyCahe,
            cowboy: cowboy,
            aeskey: aeskey
        };
    }

    // input框聚焦就改变程password，为了解决自动填充密码问题
    focusChangeInputType = (field) => {
        return () => {
            this.update({
                inputType: {
                    ...this.c.state.inputType,
                    [field]: 'password'
                }
            });
        }
    }
}

export default MainAction;