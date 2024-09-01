/**
 * @desc 通过配置，获取按钮控制方法
 * @example
 * - ref = $util.getBtnStatusFunc(config);
 * - ref.Add(); // config.Add 的配置将会执行
 * - ref.Add({visible: {Add: false}, disabled: {Add: false}}); // 增加覆盖配置
 * --- config 如下
 * - config.ALL 配置所有当前按钮控制所有的Key, 所有Key的value默认false, 通过其他字段去个性化要显示的
 * - config.Add/Cancel 配置当Add按钮点击时 显示字段和禁用字段
 * - config.Edit(thisConfig) 用方法的形式动态配置
 * -- 参数为config本身解决箭头函数func, 返回 {visible: [], disabled: []}
 *
 * @return {{[string]: function({visible: [], disabled: []})}}
 *
    const config = {
        ALL: [
            "Add",
            "Edit",
            "Delete",
            "Refresh",
            "Setting",
            "Save",
            "Cancel"
        ],
        Add: {
            visible: ['Add', 'Delete', 'Save', 'Cancel'],
            disabled: ['Edit', 'Refresh'],
        },
        Edit(thisConfig) {
            return { ...this.Add  }
        },
        Cancel: {
            visible: ['Add', 'Edit', 'Delete', 'Refresh', 'Setting'],
            disabled: ['Save', 'Cancel'],
        }
    };
 *
 */

export function _getBtnStatusFunc(config = {}) {
    let defaultStatus = arrayToObj(config.ALL, false);

    let btnStatusFunc = {};
    for (let [BtnKey, objOrFunc] of Object.entries(config)) {
        btnStatusFunc[BtnKey] = ({visible = {}, disabled = {}} = {}) => {
            let status = _.isFunction(objOrFunc) ? objOrFunc.call(config, config) : objOrFunc;

            let finVisible = {...defaultStatus, ...arrayToObj(status.visible), ...visible};
            let finDisabled = {...defaultStatus, ...arrayToObj(status.disabled), ...disabled};

            $appRoot.props.button.setButtonVisible(finVisible);
            $appRoot.props.button.setButtonDisabled(finDisabled);

            let finStatus = {
                configStatus: status,
                paramStatus: {visible, disabled},
                finalStatus: {finVisible, finDisabled}
            };
            log.info('btnStatusFunc', {finStatus, fnLoc: btnStatusFunc[BtnKey]});
            return finStatus
        }
    }

    return _.omit(btnStatusFunc, 'ALL');
}

// config status value;
function arrayToObj (array = [], setBool = true) {
    return array.reduce((t, c) => ({...t, [c]: setBool}), {});
}