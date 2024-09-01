
import {snCreateUIDom} from '../utils/utils';
import {
    toast,
    promptBox
} from 'nc-lightapp-front';
import deepCopy from '../utils/deep-copy';
import print from '../utils/print';
import exportHtml from '../utils/exportHtml';

export default class CommonAction {
    constructor(comp) {
        this.comp = comp;
    }

    exportHtml = (...args) => {
        return exportHtml(...args);
    }

    deepCopy = (...args) => {
        return deepCopy(...args);
    }

    print = (...args) => {
        return print(...args);
    }

    promptBox = (...args) => {
        return promptBox(...args);
    }

    toast = (...args) => {
        return toast(...args);
    }

    // 获取多语
    getLanguage = (moduleId, domainName, callback) => {
        const {props} = this.comp;
        const {
            MultiInit
        } = props;

        return new Promise((resolve, reject) => {
            MultiInit.getMultiLang({
                moduleId: moduleId,
                domainName: domainName,
                callback: (json, status, init) => {
                    if(typeof callback === 'function') {
                        callback(json, status, init);
                    }
                    resolve(json);
                }
            });
        });
    }

    // 由开发者自定义处理模版函数
    processTemplate = (res) => {
        return res.template;
    }

    // 初始化设置模版之后执行
    afterGetTemplate = () => {
    }

    // 获取多模版数据
    /** 
     * 
     * reqData = [{
        rqUrl: '/platform/templet/querypage.do',
        rqJson: `{\n  \"pagecode\": \"60092010nccloud\",\n  \"appcode\": \"60092010\"\n}`,
        rqCode: 'template'
    }, {
        rqUrl: '/platform/templet/querypage.do',
        rqJson: `{\n  \"pagecode\": \"60092010cb\",\n  \"appcode\": \"60092010\"\n}`,
        rqCode: 'org_situation'
    }, {
        rqUrl: '/platform/templet/querypage.do',
        rqJson: `{\n  \"pagecode\": \"60081010batch\",\n  \"appcode\": \"60092010\"\n}`,
        rqCode: 'batch_add'
    }, {
        rqUrl: '/platform/appregister/queryallbtns.do',
        rqJson: `{\n  \"pagecode\": \"60092010nccloud\",\n  \"appcode\": \"60092010\"\n}`,
        rqCode: 'button'
    }, {
        rqUrl: '/platform/appregister/queryappcontext.do',
        rqJson: `{\n  \"appcode\": \"60092010\"}`,
        rqCode: 'context'
    }];
     * 
    */
    getMultiTemplate = (reqData, callback) => {
        const {props} = this.comp;
        const {
            meta, 
            button
        } = props;
        return new Promise((resolve, reject) => {
            snCreateUIDom(this.appConfig, reqData, (res) => {
                if(typeof callback === 'function') {
                    callback(res);
                }
                else {
                    console.log(res);
                    let template = this.processTemplate(res);

                    meta.setMeta(template, this.afterGetTemplate);
                    button.setButtons(res.button ? res.button : []);
                }
                resolve(res);
            });
        });
        
    }

    // 获取模版数据
    // 从this.appConfig里获取当前app信息
    // 如果有callback作为参数，则执行callback
    getTemplateData = (callback) => {
        const {props, action} = this.comp;
        const {
            meta, 
            button,
            createUIDom
        } = props;
        
        return new Promise((resolve, reject) => {
            createUIDom(this.appConfig, (res) => {
                if(typeof callback === 'function') {
                    callback(res);
                }
                else {
                    let template = this.processTemplate(res);
                    meta.setMeta(template, this.afterGetTemplate);
                    button.setButtons(res.button);
                }
                resolve(res);
            });
        });
        
    }
}