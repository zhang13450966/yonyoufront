import React, {Component} from 'react';
import ReactDom from 'react-dom';

import ajax from '../../login/actions/ajax';
import {getUrlParam} from '../../login/actions/tool';
import {getStoreBc, getMultiLang} from '../../login/actions/language';
import Modal from 'antd-mobile/lib/modal';
import 'antd-mobile/dist/antd-mobile.css';
import {closePage} from '../main/jsbridge';

let code = getUrlParam('code') || '';
let pk_wf_task = getUrlParam('pk_wf_task');
let bcCode = getUrlParam('bcCode');
let encrypturl = getUrlParam('encrypturl');

class ThirdLogin extends Component {
    constructor(props) {
        super(props);

        this.approveEdit = this.approveEdit.bind(this);
        this.loginSubmit = this.loginSubmit.bind(this);
        this.getInitData = this.getInitData.bind(this);
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

    approveEdit() {
        let data ={
            pk_wf_task: pk_wf_task
        };

        return new Promise((resolve, reject) => {
            ajax({
                url: '/nccloud/hrpub/approve/HRApproveEditAction.do',
                data: data,
                success: (res) => {
                    if(res.success) {
                        if(res.data.rslCode === '0') {
                            let url = res.data.url;
                            window.location.href = /^\//.test(url) ? url : `/${url}`;
                        }
                        else if(res.data.rslCode == '-1'){
                            Modal.alert('', res.data.rslMsg, {
                                text: getMultiLang('00032', '确定'),
                                onPress: () => {
                                    closePage();
                                }
                            });
                        }
                    }
                }
            })
        });
    }

    loginSubmit(data) {
        return new Promise((resolve, reject) => {
            ajax({
                url: '/nccloud/hr/login/HRLoginVerfiyAction.do',
                data: data,
                success: (res) => {
                    if(res.success) {
                        if(res.data.rslCode === '0') {
                            resolve(res);
                        }
                        else if(res.data.rslCode == '-1'){
                            Modal.alert('', res.data.rslMsg, {
                                text: getMultiLang('00032', '确定'),
                                onPress: () => {
                                    closePage();
                                }
                            });
                        }
                    }
                }
            });
        });
    }

    async componentDidMount() {
        let res = await this.getInitData();

        await this.loginSubmit({
            bcCode: bcCode ? bcCode : res.data.bcCode,
            code: code,
            encrypturl: encrypturl
        })
        await this.approveEdit();
    }

    render() {
        return (
            <div></div>
        );
    }
}

ReactDom.render(<ThirdLogin/>, document.getElementById('app'));