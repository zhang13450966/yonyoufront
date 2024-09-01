import React from 'react';
import ReactDom from 'react-dom';

import HomePage from '../container';

import {
    getStoreLang,
    InitMultiLang,
    getMultiLang,
    getStoreBc
} from "../actions/language";

import {
    cacheTools
} from 'nc-lightapp-front';

import ajax from '../actions/ajax';

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
        data: data,
        success: function (res) {
            let { success, data } = res;
            if (success) {
                ReactDom.render(
                    <HomePage
                        data={data}
                        busiCenterCode={
                            (data.bcCode==undefined||data.bcCode=='') ? 
                                (data.bc.length==0 ? "" : data.bc[0].code ) :
                                data.bcCode
                        }
                        langCode={getStoreLang(data.lang.length==0 ? "" : data.lang[0].code)}
                    />,
                    document.getElementById('login_div')
                );
            }
        }
    })
}

InitMultiLang("login-001",getData);