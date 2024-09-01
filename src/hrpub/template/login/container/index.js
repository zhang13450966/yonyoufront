import React from 'react';

import './index.less';
import 'antd-mobile/dist/antd-mobile.css';

import render from '../../../common/frame/render';

import MainAction from '../actions/main';

import model from './state';

import MainPage from '../components/LoginMainPage';
import IdentityVerify from '../components/IdentityVerify';
import ResetPwd from '../components/ResetPassword';

export default render({
    actions: {
        ma: MainAction
    },
    state: model
})(({props, state, action}) => {

    const {
        currentPage
    } = state;

    return (
        <div className="login-page">
            <If condition={currentPage === 'main'}>
                <MainPage 
                    {...state}
                    onChange={action.ma.onChangeInput}
                    setLoginUserNameRef={action.ma.setLoginUserNameRef}
                    onLogin={action.ma.onLogin}
                    turnToPage={action.ma.turnToPage}
                    focusChange={action.ma.focusChangeInputType}
                />
            </If>
            <If condition={currentPage === 'id-verify'}>
                <IdentityVerify
                    {...state}
                    onChange={action.ma.onChangeInput}
                    submitVerify={action.ma.submitVerify}
                    turnToPage={action.ma.turnToPage}
                />
            </If>
            <If condition={currentPage === 'reset-pwd' || currentPage === 'first-login'}>
                <ResetPwd
                    {...state}
                    onChange={action.ma.onChangeInput}
                    turnToPage={action.ma.turnToPage}
                    submitVerify={action.ma.submitVerify}
                    submitResetPwd={action.ma.submitResetPwd}
                    focusChange={action.ma.focusChangeInputType}
                />
            </If>
        </div>
    );

});