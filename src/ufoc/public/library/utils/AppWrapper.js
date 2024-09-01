import {modifyMetaForDisplay} from "./AppWrapper/modifyMetaForDisplay";
import _ from 'lodash';
window._ = top._ = _;

export function _AppWrapper(config = {}) {
    return function (App) {
        return class Wrapper extends App {
            static displayName = 'Wrapper';

            getTemplate(defaultParam = {}) {
                return new Promise((resolve) => {
                    this.props.createUIDom({...defaultParam}, (res) => {
                        log.green('页面信息getTemplate', res);
                        try {
                            Object.defineProperty(this, '$meta', {value: JSON.stringify(res)});
                        } catch (e) {}
                        resolve(res);
                    });
                });
            }

            // _unloadMsg () {
            //     return false;
            //     // return '是否要放弃本次修改？'; // 默认
            // }


            promiseShow = (id, config = {}) => {
                return new Promise(resolve => $appRoot.props.modal.show(id, config, resolve))
            };

            constructor(props) {
                super(props);
                top.$appRoot = window.$appRoot = this;

                // 一些公共接口方法 处理
                classCheck(this);

                // 获取业务多语
                getLang(config);

                // 适配平台
                overrides(props, config);

                // 区分页面id来源 用来公共代码特殊处理
                Object.defineProperty(this, '$pid', {value: config.pageId});

                // 适配平台的表单, 表格, 搜索区域
                let form = _.get(config, 'use.form') || [];
                let search = _.get(config, 'use.search') || [];
                let table = _.get(config, 'use.table') || [];
                let editTable = _.get(config, 'use.editTable') || [];
                let cardTable = _.get(config, 'use.cardTable') || [];

                props.use.form(...form);
                props.use.search(...search);
                props.use.table(...table);
                props.use.editTable(...editTable);
                props.use.cardTable(...cardTable);
            }

            // 开发禁掉
            // 业务不需要判断, render 后就是存在多语的
            // render() {
            //     if ( _.isEmpty(_.get(this, 'state.json'))) return null;
            
            //     return super.render();
            // }
        };
    }
}

function classCheck ($appRoot) {

    if (!_.isFunction($appRoot._unloadMsg)) {
        log.warning(`classCheck $appRoot._unloadMsg = ${$appRoot._unloadMsg} 【此方法用来处理浏览器页签关闭提示】`);
    }
}

function getLang(config) {
    let resources = _.get(config, 'lang.resources');
    if (!Array.isArray(resources)) return;

    resources.push({domainName: 'ufoc', moduleId: 'public_lang'});

    let allPromise = resources.map(item => {
        return new Promise(resolve =>
            $nccPlatform.getMultiLang({...item, callback: (json) => resolve(json)}));
    });
    Promise.all(allPromise).then(jsons => {
        let json = jsons.reduce((pre, now) => ({...pre, ...now}), {});
        $appRoot.setState({json}); // 刷新一下 多语更新?
    })
}

function overrides(props, config) {
    let _setMeta = props.meta.setMeta;
    /**
     * 修改setMeta 方便处理template
     * @typedef {function} requestCallback
     * @suppress
     * @param {object} meta
     * @param {requestCallback} [callback]
     * @return {undefined|promise}
     * */
    props.meta.setMeta = (meta, callback) => {
        // ----- 适配display
        modifyMetaForDisplay(props, meta, config);
        // callback ? 原处理方式 : 返回promise
        return callback ? _setMeta(meta, callback) : new Promise(resolve => _setMeta(meta, resolve));
    };
}
