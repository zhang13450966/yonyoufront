import React, {Component} from 'react';
import ReactDom from 'react-dom';

import ajax from '../../login/actions/ajax';
import {getUrlParam} from '../../login/actions/tool';
import {getStoreBc, getMultiLang} from '../../login/actions/language';
import Modal from 'antd-mobile/lib/modal';
import 'antd-mobile/dist/antd-mobile.css';

import {closePage} from './jsbridge';

let code = getUrlParam('code') || '';
let redirect_uri = getUrlParam('redirect_uri');
let bcCode = getUrlParam('bcCode');
let encrypturl = getUrlParam('encrypturl');

class ThirdLogin extends Component {
    constructor(props) {
        super(props);

        this.getInitData = this.getInitData.bind(this);
        this.loginSubmit = this.loginSubmit.bind(this);
    }

    getInitData() {
        let data ={};
        data.bcCode = getStoreBc();

        return new Promise((resolve, reject) => {
            ajax({
                url: '/nccloud/riart/login/init.do',
                data: data,
                success: (res) => {
                    resolve(res);
                }
            });
        });
    }

    loginSubmit(data) {
        ajax({
            url: '/nccloud/hr/login/HRLoginVerfiyAction.do',
            data: data,
            success: (res) => {
                if(res.success) {
                    if(res.data.rslCode === '0') {
                        let redirectUrl = res.data.url;
                        window.location.href = /^\//.test(redirectUrl) ? redirectUrl : `/${redirectUrl}`;
                    }
                    else if(res.data.rslCode == '-1'){
                        Modal.alert('', res.data.rslMsg, {
                            text: getMultiLang('00032', '确定'),
                            onPress: () => {
                                closePage();
                            }
                        });
                        Toast.fail(res.data.rslMsg);
                    }
                }
            }
        });
    }

    componentDidMount() {
        this.getInitData()
            .then((res) => {
                this.loginSubmit({
                    bcCode: bcCode ? bcCode : res.data.bcCode,
                    code: code,
                    encrypturl: encrypturl
                });
            })
    }

    render() {
        return (
            <div></div>
        );
    }
}

ReactDom.render(<ThirdLogin/>, document.getElementById('app'));