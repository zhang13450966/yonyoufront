/**
 * 视图控制actions
 * @constructor
 * @author neo
 */
import {getColor, snCreateUIDom} from 'src/hrpub/common/utils/utils';
import reactDom from "react-dom";
import React from "react";

export default class ViewAction {
    constructor(comp) {
        this.comp = comp;
        this.comp.props.use.form('infosetform', 'updinfosetitem', 'addinfosetitem', 'card')
        this.comp.props.use.editTable('infosetgrid', 'infosetitemgrid', 'setdisplayorder', 'list', 'sub')
    }

    // 获取模板数据
    getTemplate = async() => {
        const {props, action} = this.comp;
        const {dispatch, meta, button} = props;
        let {infosetmgt} = props;
        const reqData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"60023010nccloud\",\n  \"appcode\": \"${infosetmgt.appcode}\"\n}`,
                rqCode: 'template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"60081010infoset\",\n  \"appcode\": \"${infosetmgt.appcode}\"\n}`,
                rqCode: 'exchange'
            },
            {
                rqUrl: '/platform/appregister/queryallbtns.do',
                rqJson: `{\n  \"pagecode\": \"60023010nccloud\",\n  \"appcode\": \"${infosetmgt.appcode}\"\n}`,
                rqCode: 'button'
            },
            {
                rqUrl: '/platform/appregister/queryappcontext.do',
                rqJson: `{\n  \"appcode\": \"${infosetmgt.appcode}\"}`,
                rqCode: 'context'
            }
        ];
        snCreateUIDom({pagecode: infosetmgt.pagecode, appcode: infosetmgt.appcode}, reqData, (res) => {
            let TEMP = Object.assign({}, res.template, res.exchange);
            let BTN = res.button || {};
            TEMP.infosetgrid.items.forEach((item) => {
                if (item.attrcode === 'infoset_name') {
                    item.renderStatus = 'browse';
                    item.render = (value, record, index) => {
                        const __text__ =
                            record && record.values['infoset_name'] && record.values['infoset_name'].value
                                ? record.values['infoset_name'].value
                                : '___';
                        return (
                            <a
                                href="#"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    dispatch({
                                        type: 'infosetmgt/update',
                                        payload: {
                                            rowpk: record.values.pk_infoset.value,
                                            rowindex: index
                                        }
                                    });
                                    setTimeout(() => {
                                        action.CardAction.setFormData();
                                    }, 100);
                                }}
                            >
                                {__text__}
                            </a>
                        );
                    };
                }
            });
            meta.setMeta(TEMP);
            dispatch({
                type: 'infosetmgt/update',
                payload: {
                    tempPageId: res.template.pageid,
                    tempPageCode: res.template.code
                }
            });
            button.setButtons(BTN);
        });
    };
    // 获取多语
    getLanguage = async () => {
        const {MultiInit, dispatch} = this.comp.props;

        return new Promise((resolve) => {
            MultiInit.getMultiLang({
                moduleId: 'hrpub',
                domainName: 'hrpub',
                callback: (json, status, init) => {
                    dispatch({
                        type: 'infosetmgt/update',
                        payload: {
                            lang: json
                        }
                    });
                    resolve();
                }
            });
        });
    };
    // 获取左树数据
    setTreeData = async () => {
        const {props} = this.comp;
        const {infosetmgt, syncTree, dispatch} = props;
        const params = {
            busiParamJson: {strWhere: '', itemtype: '1001Z7100000000025XL'}
        };
        dispatch({
            type: 'infosetmgt/getTreeData',
            payload: {
                postData: params
            }
        }).then((res) => {
            let root = {
                isleaf: false,
                select: true,
                key: infosetmgt.selectedTreeData,
                title: infosetmgt.lang['hrpub-000087'],
                id: infosetmgt.selectedTreeData,
                innercode: infosetmgt.selectedTreeData,
                pid: '',
                refname: infosetmgt.lang['hrpub-000087'],
                refpk: infosetmgt.selectedTreeData,
                iconBox: {addIcon: false, delIcon: false, editIcon: false}
            };
            if (res && res.data) {
                root.children = res.data;
            }
            syncTree.setSyncTreeData(infosetmgt.treeid, [root]);
        });
    };
    // 设置按钮显示
    setButtonShow = () => {
        const {props} = this.comp;
        const {infosetmgt, button} = props;
        switch (infosetmgt.showMode) {
            case 'card-edit':
                button.setButtonVisible(['save', 'cancel'], true);
                button.setButtonVisible(
                    ['add', 'edit', 'delete', 'setorder', 'syncdata', 'synctemp', 'refresh', 'exchange'],
                    false
                );
                /* 子表按钮禁用 */
                // infosetmgt.editFrom !== 'add' && button.setButtonDisabled([ 'addsubrow' ], false);
                // button.setButtonDisabled([ 'editsubrow', 'deletesubrow' ], true);
                break;
            case 'list-browse':
                button.setButtonVisible(
                    ['add', 'delete', 'setorder', 'syncdata', 'refresh', 'exchange', 'synctemp'],
                    true
                );
                button.setButtonVisible(['edit', 'save', 'cancel'], false);
                infosetmgt.hasMainTableData
                    ? button.setButtonDisabled(
                    ['edit', 'delete', 'setorder', 'syncdata', 'refresh', 'exchange', 'synctemp'],
                    false
                    )
                    : button.setButtonDisabled(
                    ['edit', 'delete', 'setorder', 'syncdata', 'refresh', 'exchange', 'synctemp'],
                    true
                    );
                break;
            case 'card-browse':
                button.setButtonVisible(
                    ['add', 'edit', 'delete', 'setorder', 'syncdata', 'synctemp', 'refresh', 'exchange'],
                    true
                );
                button.setButtonVisible(['save', 'cancel'], false);
                /* 子表按钮禁用 */
                button.setButtonDisabled(['addsubrow', 'editsubrow', 'deletesubrow'], true);
                break;
            default:
                button.setButtonVisible(
                    [
                        'add',
                        'edit',
                        'delete',
                        'setorder',
                        'syncdata',
                        'syncmodel',
                        'refresh',
                        'save',
                        'cancel',
                        'exchange'
                    ],
                    false
                );
        }
        switch (infosetmgt.exShowMode) {
            case 'list-browse':
                button.setButtonVisible(['exadd', 'exdelete', 'exedit', 'exrefresh'], true);
                button.setButtonVisible(['exsave', 'exsaveandnew', 'excancel', 'exsubadd', 'exsubdel'], false);
                infosetmgt.hrorgobj.refpk
                    ? button.setButtonDisabled(['exadd', 'exedit', 'exdelete'], false)
                    : button.setButtonDisabled(['exadd', 'exedit', 'exdelete'], true);
                break;
            case 'card-browse':
                button.setButtonVisible(['exadd', 'exdelete', 'exedit'], true);
                button.setButtonVisible(['exrefresh', 'exsave', 'exsaveandnew', 'excancel'], false);
                /* 子表按钮禁用 */
                button.setButtonDisabled(['exsubadd', 'exsubdel'], true);
                break;
            case 'card-edit':
                button.setButtonVisible(['exrefresh', 'exadd', 'exdelete', 'exedit'], false);
                button.setButtonVisible(['exsave', 'exsaveandnew', 'excancel', 'exsubadd', 'exsubdel'], true);
                /* 子表按钮禁用 */
                button.setButtonDisabled(['exsubadd', 'exsubdel'], false);
                break;
            default:
                button.setButtonVisible(
                    [
                        'exrefresh',
                        'exadd',
                        'exdelete',
                        'exedit',
                        'exsave',
                        'exsaveandnew',
                        'excancel',
                        'exsubadd',
                        'exsubdel'
                    ],
                    false
                );
        }
    };
    // 重写公式编辑input: 信息项公式(item_formula) && 子集信息项条件(sub_formula)
    reWriteFormItem = () => {
        const {infosetmgt} = this.comp.props;
        if (!infosetmgt.bShowInfosetItemModal) return;
        let resetDomClassName = ['.sub_formula', '.item_formula'];
        //使用modal的onEntered方法触发，内容还是没有加载出来，只能一直监听
        let timer = null;
        const check = () => {
            let itemDom = document.querySelector(resetDomClassName[0])
            if (itemDom) {
                resetDomClassName.forEach((item) => {
                    document.querySelector(item).removeEventListener('click', this.handleCurrentRecordClick, false);
                    document.querySelector(item).addEventListener('click', this.handleCurrentRecordClick, false);
                    let children = document.createElement('span');
                    children.className = 'icon-refer';
                    setTimeout(() => {
                        document.querySelector(`${item} .base-form-control-wrapper`) &&
                        !document.querySelector(`${item} .base-form-control-wrapper .icon-refer`) &&
                        document.querySelector(`${item} .base-form-control-wrapper`).appendChild(children);
                    }, 100);
                    if (timer) {
                        clearTimeout(timer)
                    }
                })
            } else {
                timer = setTimeout(check, 100)
            }
        }
        check()
    };
    handleCurrentRecordClick = (ev) => {
        const {props, state} = this.comp;
        const {dispatch, infosetmgt, form} = props;
        let nodes = ev.path || (ev.composedPath && ev.composedPath());
        let parent = nodes.find((item) => {
            return item.className === 'form-item-control ';
        });
        let datatype =
            ev.currentTarget.className.split(' ').find((item) => {
                return item === 'sub_formula' || item === 'item_formula';
            }) === 'item_formula'
                ? 100
                : 101;
        let formulaParams = {
            pk_infoset: infosetmgt.rowpk,
            datatype
        };
        let defaultFormulaStr = ev.currentTarget.querySelector('input').value;

        if (!parent) {
            return;
        } else {
            if (!parent.querySelector('input').disabled) {
                dispatch({
                    type: 'infosetmgt/update',
                    payload: {
                        formulaParams,
                        defaultFormulaStr
                    }
                });
                state.formula.show(formulaParams);
            }
        }
    };
    // 初始化
    didMount = async () => {
        await this.getLanguage();
        await this.getTemplate();
        await this.setTreeData();
        this.setButtonShow();
        // 统一订阅事件
        this.subscribe();
    };
    // 更新数据时页面渲染控制
    didUpdate = () => {
        this.setButtonShow();
        //this.reWriteFormItem();
    };
    updateView = () => {
        this.setButtonShow();
        this.reWriteFormItem();
    }
    // 卸载
    willUnMount = () => {
        this.pubSub.unSubscribe('setMainTableData');
        this.pubSub.unSubscribe('setFormData');
    };
    // 事件订阅部分
    subscribe = () => {
        const {comp: {action}, pubSub} = this;
        pubSub.subscribe('setMainTableData', (...args) => {
            action.TableAction.setMainTableData(...args);
        });
        pubSub.subscribe('setFormData', (...args) => {
            action.CardAction.setFormData(...args);
        });
    };
}
