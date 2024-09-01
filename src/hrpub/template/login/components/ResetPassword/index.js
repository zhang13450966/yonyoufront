import React from 'react';
import './index.less';

import Header from '../InnerHeader';

import Input from 'antd-mobile/lib/input-item';
import Button from 'antd-mobile/lib/button';
import VerifyCodeInput from '../VerifyCodeInput';

import {getMultiLang} from '../../actions/language';

export default (props) => {

    const {
        email,
        onChange,
        turnToPage,
        verifyCode,
        newPwd,
        sureNewPwd,
        showVerifyCode,
        submitVerify,
        submitResetPwd,
        inputType,
        focusChange,
        currentPage
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
                    {getMultiLang('00009', '重置密码')}
                    <If condition={currentPage === 'reset-pwd'}>
                        <div className="id-verify-title-tips">
                            {getMultiLang('00012', '请输入')} {email} {getMultiLang('00059', '收到的验证码')}
                        </div>
                    </If>
                    <If condition={currentPage === 'first-login'}>
                        <div className="id-verify-title-tips">
                            {getMultiLang('00010', '为保证账户安全,首次登陆需修改初始密码,重新设置密码')}
                        </div>
                    </If>
                </div>
                <div className="identity-verify-input-wrapper">
                    <If condition={showVerifyCode}>
                        <span className="id-verify-item-wrapper">
                            <VerifyCodeInput
                                value={verifyCode}
                                onChange={onChange('verifyCode')}
                                regetVerifyCode={submitVerify}
                            />
                        </span> 
                    </If>
                    <span className="id-verify-item-wrapper">
                        <Input
                            placeholder={getMultiLang('00060', '请输入新密码')}
                            value={newPwd}
                            onChange={onChange('newPwd')}
                            type={inputType['newPwd']}
                            onFocus={focusChange('newPwd')}
                        >
                            {getMultiLang('00011', '新密码')}
                        </Input>
                    </span>
                    <span className="id-verify-item-wrapper">
                        <Input
                            placeholder={getMultiLang('00061', '请再次输入新密码')}
                            value={sureNewPwd}
                            onChange={onChange('sureNewPwd')}
                            type={inputType['sureNewPwd']}
                            onFocus={focusChange('sureNewPwd')}
                        >
                            {getMultiLang('00062', '确认密码')}
                        </Input>
                    </span>
                    <Button 
                        className="id-verify-item-button"
                        type="primary"
                        disabled={!newPwd || !sureNewPwd}
                        onClick={submitResetPwd}
                    >
                        {getMultiLang('00063', '确认重置')}
                    </Button>
                </div>
            </div>
        </div>
    );

}