

import {
    toast
} from 'nc-lightapp-front';



export default class Actions {
    constructor(comp) {
        this.comp = comp;
        Object.assign(this, comp.props);
    }

    // 初始化页面
    init = () => {
        this.getLanguage();
        this.getTemplate();
    }

    

    

    // 获取模版
    getTemplate = () => {
        return new Promise((resolve, reject) => {
            this.createUIDom(this.appConfig, (res) => {
                this.dispatch({
                    type: 'reportAss/update',
                    payload: {
                        context: res.context
                    }
                });
                this.meta.setMeta(res.template);
                this.button.setButtons(res.button);
                resolve();
            });
        });
        
    }

    // 获取多语言
    getLanguage = () => {
        this.MultiInit.getMultiLang({
            moduleId: 'hi6007',
            domainName: 'hrhi',
            callback: (json, status, init) => {
                this.dispatch({
                    type: 'reportAss/update',
                    payload: {
                        language: json
                    }
                });
            }
        });
    }
}