import React from 'react';
import './index.less';

import Header from '../InnerHeader';

import Input from 'antd-mobile/lib/input-item';
import Button from 'antd-mobile/lib/button';

import {getMultiLang} from '../../actions/language';

export default (props) => {

    const {
        userName,
        email,
        onChange,
        submitVerify,
        turnToPage
    } = props;

    return (
        <div className="identity-verify-page">
            <Header
                title={getMultiLang('00057', '找回密码')}
                backTo="main"
                closeTo="main"
                turnToPage={turnToPage}
                from="id-verify"
            />
            <div className="identity-verify-content">
                <div className="id-verify-title">
                    {getMultiLang('00058', '身份验证')}
                    <div className="id-verify-title-tips">
                        {getMultiLang('00048', '请输入您NC Cloud账号相关用户信息')}
                    </div>
                </div>
                <div className="identity-verify-input-wrapper">
                    <span className="id-verify-item-wrapper">
                        <Input
                            placeholder="请输入用户名"
                            value={userName}
                            onChange={onChange('userName')}
                        >
                            {getMultiLang('00002', '用户名')}
                        </Input>
                    </span>
                    <span className="id-verify-item-wrapper">
                        <Input
                            placeholder="请输入邮箱"
                            value={email}
                            onChange={onChange('email')}
                        >
                            {getMultiLang('00023', '邮箱')}
                        </Input>
                    </span>
                    <Button 
                        className="id-verify-item-button"
                        type="primary"
                        disabled={!userName || !email}
                        onClick={submitVerify}
                    >
                        {getMultiLang('00024', '下一步')}
                    </Button>
                </div>
            </div>
        </div>
    );

}