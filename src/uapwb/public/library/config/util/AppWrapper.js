export function _AppWrapper(config = {}) {
    return function (App) {
        return class Wrapper extends App {
            static displayName = 'Wrapper';

            getTemplate(defaultParam = {}) {
                return new Promise( (resolve, reject) => {
                    this.props.createUIDom({...defaultParam}, (res) => {
                        log.green('页面信息getTemplate', res);
                        resolve(res);
                    });
                });
            }

            constructor(props) {
                super(props);
                overrides(props, config);
                // 区分页面id来源 用来公共代码特殊处理
                Object.defineProperty(this, '$pid', {value: config.pageId});
                top.$appRoot = window.$appRoot = this;

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
        };
    }
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
        modifyMetaForDisplay(meta, config); // ----- 适配display
        // callback ? 原处理方式 : 返回promise
        return callback ? _setMeta(meta, callback) : new Promise(resolve => _setMeta(meta, resolve));
    };
}

function modifyMetaForDisplay(meta, config) {
    __forInspect.clear();

    for (let [id, value] of Object.entries(meta)) {
        let moduletype = _.get(value, 'moduletype');
        // 只要table, form, search, 其他未知不判断
        if (moduletype !== 'table' && moduletype !== 'form' && moduletype !== 'search') continue;

        // 记录use form table search 方便配置use
        __forInspect.collectUse(moduletype, id);

        let items = _.get(value, 'items') || [];
        let fields = _.get(config, `autoDisplay.${id}`) || [];
        for (let item of items) {
            // 记录autoDisplay
            __forInspect.collectAutoDisplay(moduletype, id, item);

            if (
                (item.itemtype === 'input' && fields.includes(item.attrcode))
                ||
                (item.itemtype === 'textarea' && fields.includes(item.attrcode))
                ||
                item.itemtype === 'label'
                ||
                item.itemtype === 'refer'
                ||
                item.itemtype === 'select'
                ||
                item.itemtype === 'radio'
                ||
                item.itemtype === 'checkbox'
            ) {
                item.whichKeyToDisplay = 'auto';
            }
        }
    }

    log.black('字段forInspect, config', __forInspect, config);
}

// 随时查看
top.__forInspect = window.__forInspect = {
    use: {
        // 记录use form table search 方便配置use
        // moduletype: []
    },
    autoDisplay: {
        // 记录autoDisplay 方便节点配置不显示字段
        // id: {fieldType: [code#name...]}, //
    },

    // collect
    collectUse(mt, mCode) {
        this.use[mt] = this.use[mt] || [];
        this.use[mt].push(mCode);
    },
    collectAutoDisplay(mt, id, item) {
        let fPath = `${mt}.${id}.${item.itemtype}`;
        let fItems = _.get(this.autoDisplay, fPath) || [];
        fItems.push(`${item.attrcode}#${item.label}`);

        _.set(this.autoDisplay, fPath, fItems);
    },
    clear() {
        this.use = {};
        this.autoDisplay = {};
    }
};
