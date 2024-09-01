import React from 'react';

import './index.less';

import Input from 'antd-mobile/lib/input-item';
import Button from 'antd-mobile/lib/button';

import {getStoreLang,InitMultiLang,getMultiLang,getStoreBc} from "../../actions/language";

export default (props) => {

    const {
        userName,
        password,
        onChange,
        setLoginUserNameRef,
        onLogin,
        turnToPage,
        inputType,
        focusChange,
        pageHeight
    } = props;

    return (
        <div 
            className="login-main-page"
            style={{
                height: `${pageHeight}px`
            }}
        >
            <div className="login-main-page-up-content">
                <span 
                    className="login-main-page-logo"
                />
            </div>
            <div className="login-main-page-down-content">
                <div className="login-main-page-item-wrapper">
                    <Input
                        placeholder={getMultiLang("00002","用户名")}
                        className="login-main-page-input"
                        style={{
                            textAlign: 'center'
                        }}
                        value={userName}
                        onChange={onChange('userName')}
                        ref={setLoginUserNameRef}
                        clear={true}
                    />
                </div>
                <div className="login-main-page-item-wrapper">
                    <Input
                        placeholder={getMultiLang("00004","密码")}
                        className="login-main-page-input"
                        style={{
                            textAlign: 'center'
                        }}
                        type={inputType['password']}
                        value={password}
                        onChange={onChange('password')}
                        clear={true}
                        onFocus={focusChange('password')}
                    />
                </div>
                <div className="login-main-page-item-wrapper login-button">
                    <Button
                        type="primary"
                        className="login-main-page-login-button"
                        disabled={!userName || !password}
                        onClick={onLogin}
                    >
                        {getMultiLang("00007","登录")}
                    </Button>
                </div>
            </div>
            <div 
                className="login-main-forget-pwd"
            >
                <span
                    onClick={turnToPage('id-verify', 'main')}
                >
                    {getMultiLang("00006","忘记密码")}
                </span>
            </div>
        </div>
    );

}