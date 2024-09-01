import React, {Component} from 'react';
import {base, high, toast, promptBox} from 'nc-lightapp-front';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import {languageCreateUIDOM, hrAjax} from 'src/hrpub/common/utils/utils';
import {
    getClientSize,
    getBEDateQueryCondition,
    getCurMonthEndTs,
    getCurMonthStartTs,
    formatTemplate,
    formatValueByRow
} from 'src/hrkq/statistics/common/utils';
import exportHtmlFunc from 'src/hrpub/common/utils/exportHtml';

// css
import './index.less';

// components
import Form from 'src/hrkq/statistics/common/components/Form';

import Header from '../components/Header';
import TableGather from '../components/TableGather';
import TableDetails from '../components/TableDetails';
import Pagination from 'src/hrpub/common/components/Pagination/index';

import config from '../config/index';
import formDownLoad, {getUrlParam} from "../../../public/download";
import addTemplate from "./addTemplate";

let {NCLoading, NCPagination, NCTabs, NCTabs: {NCTabPane}, NCInput, NCButton} = base;

export default class extends Component {
    constructor(props) {
        super(props);
        if (props.use) {
            props.use.editTable('gather_list', 'details_list');
            props.use.form('details_form');
        }
        this.state = {
            lang: {},
            dist: 'list',
            // 窗口尺寸
            window: {
                ...getClientSize()
            },
            pageInfo: {
                pageSize: 10,
                pageIndex: 1,
                total: 0
            },
            tabActive: config.modules[0],
            tabs: [
                ...config.modules
            ],
            showApprove: false,
            approveData: {},
        };

        ['onTabChange', 'initTempalte', 'initData', 'onSearch',
            'onPageInfoChange', 'onResize', 'onExport', 'onExportWithOutQueryId', 'onExportWithInQueryId'].forEach(fun => {
            if (typeof this[fun] == 'function') {
                this[fun] = this[fun].bind(this);
            }
        })
    }

    onTabChange = (id) => {
        const {search: {clearSearchArea}} = this.props;
        const {tabs} = this.state,
            current = tabs.filter((tab) => {
                return tab.id === id;
            })[0];

        this.setState((state, props) => {
            return {
                tabActive: current,
                pageInfo: {
                    ...state.pageInfo,
                    pageIndex: 1,
                    total: 0
                }
            };
        });

        //this.queryParams = {};
        this.initData();

        /*try {
            if (current.queryId) {
                clearSearchArea(current.queryId);
            }
        } catch (e) {
        }*/
    }

    initTempalte = (callback) => {
        languageCreateUIDOM(this.props)({
            appcode: config['appcode'],
            pagecode: config['pagecode'],
        }, {...config['mutilLang']}, (metas, lang, intl) => {
            const props = this.props;
            const {button, template} = metas;
            const {meta} = props;
            this.setState({lang});
            let temp = template ? formatTemplate({template, lang}) : {}
            addTemplate(template, lang)
            this.addOprColumn(template, lang)
            meta.setMeta(temp);
            props.button.setButtons(button);
            callback && callback();
        });
    }

    addOprColumn = (template, lang) => {
        template['details_list'].items.push({
            itemtype: 'customer',
            width: '120px',
            label: lang["hrkq-000005"] /*多语: 操作*/,
            visible: true,
            fixed: 'right',
            name: 'outOperation',
            attrcode: 'opr',
            render: (text, record, index) => {
                let billSource = record.values['billsource'].value;
                let transferflag = record.values['transferflag'].value;
                return (
                    <div>
                        {record.values['billstatus'].value >= 0 &&
                        record.values['applysort'] &&
                        ['1', '2'].indexOf(record.values['applysort'].value) > -1 && billSource !== '2' &&
                        <a
                            href="javascript:void(0)"
                            className="operator-btn"
                            onClick={
                                () => this.showFlowHistory(record)
                            }
                        >
                            {lang['hrkq-000006']}
                        </a>}
                        {billSource === '2' && transferflag !== '1' &&
                        <a
                            href="javascript:void(0)"
                            className="operator-btn"
                            onClick={
                                () => this.editHrBill(record)
                            }
                        >
                            {lang['hrkq-0000108']}
                        </a>}
                        {billSource === '2' && transferflag !== '1' &&
                        <a
                            href="javascript:void(0)"
                            className="operator-btn"
                            onClick={
                                () => this.deleteHrBill(record)
                            }
                        >
                            {lang['hrkq-0000109']}
                        </a>}
                    </div>
                );
            }
        })
    }

    showFlowHistory = (row) => {
        if (row.values['billstatus'].value >= 0) {
            this.setState({
                showApprove: true,
                approveData: {
                    billtype: '6QJB',
                    billid: row.values['instanceid'].value
                }
            });
        }
    }

    initData = () => {
        clearTimeout(this.initDataTimer);
        this.initDataTimer = setTimeout(() => {
            const {meta, editTable: {setTableData}, search: {getQueryInfo, clearSearchArea}} = this.props;
            const {tabActive} = this.state;
            this.setState({loading: true});
            this.queryListAction({
                ...this.queryParams
            }).then(({
                         success,
                         data = []
                     } = {}) => {
                if (success) {
                    if (tabActive.tableId) {
                        data = this.formatRowData(data, tabActive.tableId)
                        const {
                            pageid,
                            templetid,
                            [tabActive.tableId]: {
                                pageInfo: {total = 0} = {},
                                areacode,
                                rows = []
                            } = {}
                        } = data;
                        this.onPageInfoChange({
                            total
                        });
                        setTableData(tabActive.tableId, {rows})
                    } else {
                        let {
                            content = [],
                            totalElements = 0,
                            numberOfElements = 0,
                            pageable: {
                                offset,
                                pageNumber,
                                pageSize,
                            } = {}
                        } = data;

                        this.onPageInfoChange({
                            // pageIndex: pageNumber,
                            // pageSize,
                            total: totalElements
                        });

                        this.setState((state, props) => {
                            let current = state.tabs.filter((tab) => {
                                return tab.id == tabActive.id;
                            })[0];
                            current.data = content;

                            return {
                                tabs: state.tabs
                            };
                        });
                    }
                }
                this.setState({loading: false});
            }).catch(({message, stack}) => {
                this.setState({loading: false});
                if (message) {
                    toast({
                        color: "warning",
                        content: message
                    })
                }
                if (stack) {
                    throw new Error(stack);
                }
            })
        });
    }

    formatRowData = (data, tableId) => {
        let {
            content = [],
            totalElements = 0,
            numberOfElements = 0,
            pageable: {
                offset,
                pageNumber,
                pageSize,
            } = {},
            totalPages
        } = data;
        let result = {};
        result[tableId] = {
            "areacode": tableId
        }
        result[tableId]['rows'] = content.map(item => {
            let disabled = true;
            if (tableId === 'details_list') {
                if (item.transferflag == '1' ||
                    item.transferflag == '3' ||
                    (item.transferflag == '0' &&
                        item.billstatus == '1')) { //已转
                    disabled = false
                }
            }
            let rowData = {
                status: "0",
                isOptimized: false,
                values: {},
                disabled: disabled
            };
            Object.keys(item).forEach(key => {
                rowData.values[key] = {
                    display: item[key],
                    value: item[key]
                }
            });
            return rowData;
        });

        result[tableId]['pageInfo'] = {
            pageIndex: Number(pageNumber) + 1,
            pageSize: pageSize,
            total: totalElements,
            totalPage: totalPages
        }
        return result
    }

    onSearch = ({dateRanger: {beginValue, endValue} = {}, queryParams = {}} = {}) => {
        let {meta} = this.props;
        const {tabActive} = this.state;

        this.queryParams = {
            ...queryParams
        };

        if (endValue > 0) {
            if (tabActive.queryId) {
                this.queryParams = Object.assign({}, this.queryParams, {
                    ...getBEDateQueryCondition({
                        beginValue,
                        endValue,
                        beginField: 'begindate',
                        endField: 'enddate',
                    })
                });
            } else {
                this.queryParams = Object.assign({}, this.queryParams, {
                    begindate: beginValue.toString(),
                    enddate: endValue.toString(),
                });
            }
        }

        this.setState((state, props) => {
            return {
                pageInfo: {
                    ...state.pageInfo,
                    pageIndex: 1,
                }
            };
        });

        this.initData();
    }

    onPageInfoChange = ({pageIndex, pageSize, total} = {}) => {
        let update = {};
        if (pageIndex >= 1) {
            update['pageIndex'] = pageIndex;
        }
        if (pageSize >= 1) {
            update['pageSize'] = pageSize;
        }
        if (total >= 0) {
            update['total'] = total;
        }
        this.setState((state, props) => {
            return {
                pageInfo: {
                    ...state.pageInfo,
                    ...update
                }
            };
        });
    }

    queryListAction = (params) => {
        let {tabActive, pageInfo} = this.state,
            url = `${tabActive.queryAction}`,
            tmp;

        if (tabActive.queryId) {
            // for template
            tmp = {
                pageInfo
            }
        } else {
            // for not template
            tmp = {
                pageSize: pageInfo.pageSize,
                pageNum: pageInfo.pageIndex,
                begindate: getCurMonthStartTs().toString(),
                enddate: getCurMonthEndTs().toString()
            }
        }

        let body = {
            ...tmp,
            ...params
        };

        return hrAjax({
            url,
            body
        })
    }

    /**
     *  导出
     */
    onExport = () => {
        const {
            state: {
                tabActive
            }
        } = this;

        if (tabActive.queryId) {
            this.onExportWithInQueryId();
        } else {
            this.onExportWithOutQueryId();
        }
    }

    /**
     * 查询模版的导出
     */
    onExportWithInQueryId = () => {
        const {
                state: {
                    tabActive,
                    pageInfo,
                    lang
                },
                props: {
                    meta,
                    table
                }
            } = this,
            metaInfo = meta.getMeta();

        this.setState({loading: true});
        this.queryListAction({
            ...this.queryParams,
            pageInfo: {
                pageIndex: 1,
                pageSize: pageInfo.total || 10,
            }
        }).then(({
                     success, data: {
                pageid,
                templetid,
                [tabActive.tableId]: {
                    pageInfo: {total = 0} = {},
                    areacode,
                    rows = []
                } = {}
            } = {}
                 }) => {
            if (success) {
                rows.forEach((row) => {
                    for (let attrcode in row.values) {
                        if (row.values.hasOwnProperty(attrcode)) {
                            let item = row.values[attrcode];
                            item['value'] = formatValueByRow(row, attrcode, lang) || item['value'];
                        }
                    }
                });
                exportHtmlFunc(document.querySelector('.edit-table-wrap'), {
                    title: lang[tabActive.i18n],
                    fileName: lang[tabActive.i18n],
                    maker: lang['hrkq-0000098'],
                    date: lang['hrkq-0000099']
                }, {
                    meta: metaInfo[tabActive['tableId']],
                    data: rows,
                    showIndex: true
                })
            }
            this.setState({loading: false});
        }).catch(({message, stack}) => {
            this.setState({loading: false});
            if (message) {
                toast({
                    color: "warning",
                    content: message
                })
            }
            if (stack) {
                throw new Error(stack);
            }
        })
    }

    /**
     * 非查询模版的导出
     */
    onExportWithOutQueryId = () => {
        let {tabActive, pageInfo} = this.state,
            url = tabActive.exportAction,
            queryKeys = ['begindate', 'enddate', 'begindatestr', 'enddatestr', {
                key: 'orgId',
                alias: 'orgid'
            }, 'orglist', 'psnclid', 'querystr', 'transferflag',
                'overtimetype', 'billsource', 'billsourcedept', 'approvestatus', 'approvestatusnotinlist', 'minlen', 'maxlen', 'appyerid',
                'ordertype', 'sorttype', 'orderstr', 'staffid', 'staffids', {
                    key: 'deptId',
                    alias: 'deptid'
                }, 'jobId', 'userName', 'isIncludeSub'],
            queryParams = {
                begindate: getCurMonthStartTs().toString(),
                enddate: getCurMonthEndTs().toString(),
                ...this.queryParams
            };

        queryKeys.forEach(item => {
            let key = item.key || item,
                alias = item.alias || item;

            if (queryParams &&
                queryParams[key] !== undefined) {
                url += `${(/\?/.test(url) ? '&' : '?')}${alias}=${queryParams[key]}`;
            }
        })
        const body = getUrlParam(url);
        formDownLoad({
            url,
            body,
            method: 'get',
            enctype: 1
        })
        /*return formDownLoad({
            params: body,
            url: url,
            method: 'post',
            enctype: 1
        })*/
    }

    onResize = () => {
        /**
         * 节流算法优化，固定时间内频繁执行，只执行第一次
         * rongqb 20190425
         */
        if (!this.onResizeTimer) {
            let size = getClientSize();

            this.setState({
                window: size
            });
        }
        clearTimeout(this.onResizeTimer);
        this.onResizeTimer = setTimeout(() => {
            this.onResizeTimer = null;
        }, 100);
    }

    /**
     * @desc: hr录入单据入口
     * @param {type}
     * @return:
     */
    hrCreateBill = () => {
        const {form} = this.props;
        const {EmptyAllFormValue, setFormStatus, setAllFormValue, setItemsVisible} = form;
        const formCode = config.hrCreateCard
        hrAjax({
            url: '/nccloud/hrkq/hrentryapply/HrEntryApplyOvertimeAddDefaultAction.do',
            body: {
                operat: 0
            }
        }).then(res => {
            if (res.success) {
                setAllFormValue({[formCode]: res.data[formCode]})
            }
        })
        EmptyAllFormValue(config.hrCreateCard);
        setFormStatus(config.hrCreateCard, 'add');
        setItemsVisible(config.hrCreateCard, {isallnight: false})
        this.initHrCardStatus(config.hrCreateCard, true);
        this.handleOrgReferSqlBuilder()
        this.setState({
            dist: 'create'
        })
        this.setHrBillButtonStatus()
    }

    /**
     * @desc:
     * @param {type}
     * @return:
     */
    initHrCardStatus = (cardId, disabled) => {
        const {form} = this.props;
        const {setFormItemsDisabled} = form;
        let disabledMap = {
            pk_psndoc: disabled, // 选择人员
            pk_org: false
        };
        setFormItemsDisabled(cardId, disabledMap)
        disabledMap = null
    }

    /**
     * @desc: 处理组织参照的sqlbuilder
     * @param {type}
     * @return:
     */
    handleOrgReferSqlBuilder = () => {
        let meta = this.props.meta.getMeta();
        meta[config.hrCreateCard].items.forEach(item => {
            if (item.attrcode === 'pk_org') {
                item.queryCondition = function () {
                    return {
                        TreeRefActionExt: 'nccloud.web.hrkq.hrentryapply.sqlbuilder.HrEntryApplyOrgSqlBuilder',
                        appCode: '60201040'
                    }
                }
            }
            if (item.attrcode === 'pk_psndoc') {
                item.isMultiSelectedEnabled = true
            }
        });
        this.props.meta.setMeta(meta);
    }

    /**
     * @desc:
     * @param {type}
     * @return:
     */
    handleHrBillButtonClick = (props, btncode) => {
        if (btncode === 'save') {
            this.saveHrBill()
        } else if (btncode === 'cancle') {
            this.cancleHrBill()
        }
    }

    /**
     * @desc: hr录入单据保存
     * @param {type}
     * @return:
     */
    saveHrBill = () => {
        if (!this.basicBillCheck(config.hrCreateCard)) return
        if (!this.billTimeCheck(config.hrCreateCard)) return
        this.saveHrBillData(config.hrCreateCard)
    }
    /**
     * @desc: 校验表单必填
     * @param formCode {string}
     * @return: {boolean}
     */
    basicBillCheck = (formCode) => {
        const {form} = this.props;
        const {isCheckNow} = form;
        return isCheckNow(formCode, 'warning')
    }

    /**
     * @desc: hr录入表单时间校验
     * @param formCode {string}
     * @return: {Booean}
     */
    billTimeCheck = (formCode) => {
        const {form} = this.props;
        const {getFormItemsValue} = form;
        let begin = getFormItemsValue(formCode, 'overtimebegintime').value;
        let end = getFormItemsValue(formCode, 'overtimeendtime').value;
        if (begin > end) {
            toast({
                color: 'warning',
                content: this.state.lang['hrkq-0000104']  // 结束时间必须晚于开始时间！
            })
        }
        return begin < end
    }

    /**
     * @desc: 保存单据信息
     * @param {type}
     * @return:
     */
    saveHrBillData = (formCode) => {
        const {form, editTable: {setTableData}} = this.props;
        const {getAllFormValue, getFormItemsValue} = form;
        const {tabActive} = this.state;
        let billType = getFormItemsValue(formCode, 'billtype').value
        hrAjax({
            url: '/nccloud/hrkq/hrentryapply/HrEntryApplySaveAction.do',
            body: {
                billType,
                formData: {
                    model: getAllFormValue(formCode)
                }
            }
        }).then(res => {
            if (res.success) {
                this.setState({
                    dist: 'list'
                })
                this.queryListAction({
                    ...this.queryParams
                }).then(({
                             success,
                             data = []
                         } = {}) => {
                    if (success) {
                        if (tabActive.tableId) {
                            data = this.formatRowData(data, tabActive.tableId)
                            const {
                                pageid,
                                templetid,
                                [tabActive.tableId]: {
                                    pageInfo: {total = 0} = {},
                                    areacode,
                                    rows = []
                                } = {}
                            } = data;
                            this.onPageInfoChange({
                                total
                            });
                            setTableData(tabActive.tableId, {rows})
                        } else {
                            let {
                                content = [],
                                totalElements = 0,
                                numberOfElements = 0,
                                pageable: {
                                    offset,
                                    pageNumber,
                                    pageSize,
                                } = {}
                            } = data;

                            this.onPageInfoChange({
                                // pageIndex: pageNumber,
                                // pageSize,
                                total: totalElements
                            });

                            this.setState((state, props) => {
                                let current = state.tabs.filter((tab) => {
                                    return tab.id == tabActive.id;
                                })[0];
                                current.data = content;

                                return {
                                    tabs: state.tabs
                                };
                            });
                        }
                    }
                    this.setState({loading: false});
                })
                if (res.data) {
                    toast({
                        color: 'danger',
                        content: res.data
                    })
                } else {
                    toast({
                        color: 'success',
                        content: this.state.lang['hrkq-0000106']
                    })
                }
            }
        })
    }

    /**
     * @desc: 取消编辑表单
     * @param {type}
     * @return:
     */
    cancleHrBill = () => {
        const {form} = this.props;
        const {getFormStatus} = form;
        if (getFormStatus(config.hrCreateCard) !== 'browse') {
            promptBox(
                {
                    color: "warning",
                    title: this.state.lang['hrkq-0000102'], /* 国际化处理： 提示*/
                    content: this.state.lang['hrkq-0000103'], /* 国际化处理： 你确定要返回吗？*/
                    beSureBtnClick: () => {
                        this.setState({
                            dist: 'list'
                        })
                    }
                })
        } else {
            this.setState({
                dist: 'list'
            })
        }
    }
    /**
     * @desc: 编辑HR录入的单据
     *        单据编辑要编辑主单，调用移动端加班节点使用的接口来查询主单详情 (可能会有坑)
     * @param {type}
     * @return:
     */
    editHrBill = (row) => {
        const {form} = this.props;
        const {setFormStatus, setFormItemsDisabled, setAllFormValue} = form;
        const pk_overtime = row.values['instanceid'].value;
        if (!pk_overtime) {
            toast({
                color: "warning",
                content: '单据ID为空!'
            })
            return
        }
        const cardCode = config.hrCreateCard;

        setFormStatus(cardCode, 'edit')
        setFormItemsDisabled(cardCode, {
            pk_org: true,
            pk_psndoc: true
        })
        hrAjax({
            url: '/nccloud/hrkq/overtime/QueryByIdNccAction.do',
            body: {
                pk_overtime
            }
        }).then(res => {
            if (res.success) {
                let rows = res.data && res.data['overtime'] && res.data['overtime']['overtime_card'] && res.data['overtime']['overtime_card']['rows'] || []
                setAllFormValue({
                    [cardCode]: {
                        rows
                    }
                })
                this.setState({
                    dist: 'create'
                })
                this.isAllNight()
            }

        })
        this.setHrBillButtonStatus()
    }
    /**
     * @desc: 删除HR录入的单据
     * @param {type}
     * @return:
     */
    deleteHrBill = (row) => {
        let billType = '6QJB';
        let pk = row.values['instanceid'].value;
        const {tabActive} = this.state;
        const {editTable: {setTableData}} = this.props;
        promptBox({
            color: "warning",
            title: this.state.lang['hrkq-0000102'], /* 国际化处理： 提示*/
            content: this.state.lang['hrkq-0000107'], /* 国际化处理： 您确定要删除该单据吗？*/
            beSureBtnClick: () => {
                hrAjax({
                    url: '/nccloud/hrkq/hrentryapply/HrEntryApplyDeleteAction.do',
                    body: {
                        billType,
                        pk
                    }
                }).then(res => {
                    if (res.success) {
                        this.setState({
                            dist: 'list'
                        })
                        this.queryListAction({
                            ...this.queryParams
                        }).then(({
                                     success,
                                     data = []
                                 } = {}) => {
                            if (success) {
                                if (tabActive.tableId) {
                                    data = this.formatRowData(data, tabActive.tableId)
                                    const {
                                        pageid,
                                        templetid,
                                        [tabActive.tableId]: {
                                            pageInfo: {total = 0} = {},
                                            areacode,
                                            rows = []
                                        } = {}
                                    } = data;
                                    this.onPageInfoChange({
                                        total
                                    });
                                    setTableData(tabActive.tableId, {rows})
                                } else {
                                    let {
                                        content = [],
                                        totalElements = 0,
                                        numberOfElements = 0,
                                        pageable: {
                                            offset,
                                            pageNumber,
                                            pageSize,
                                        } = {}
                                    } = data;

                                    this.onPageInfoChange({
                                        // pageIndex: pageNumber,
                                        // pageSize,
                                        total: totalElements
                                    });

                                    this.setState((state, props) => {
                                        let current = state.tabs.filter((tab) => {
                                            return tab.id == tabActive.id;
                                        })[0];
                                        current.data = content;

                                        return {
                                            tabs: state.tabs
                                        };
                                    });
                                }
                            }
                            this.setState({loading: false});
                        })
                    }
                })
            }
        })
    }
    /**
     * @desc: hr录入编辑后事件
     * @param {type}
     * @return:
     */
    afterHrCardEdited = (props, moduleId, key, value, oldValue) => {
        switch (key) {
            case 'pk_org':
                this.onOrgChanged(value)
                break;
            case 'overtimebegintime':
            case 'overtimeendtime':
                let val = value.value.slice(0, -2) + '00'
                props.form.setFormItemsValue(moduleId, {
                    [key]: {
                        value: val
                    }
                })
                this.isAllNight()
                break;
            case 'pk_psndoc':
                this.handlePsnSelected(value);
                break;
        }
    }

    /**
     * @desc: 表单的组织参照change事件
     * @param  value {Object}
     * @return:
     */
    onOrgChanged = (value) => {
        this.clearRelationData()
        if (!value.value) {
            this.initHrCardStatus(config.hrCreateCard, true)
        } else {
            this.handleReferSetting(value.value)
            this.initHrCardStatus(config.hrCreateCard, false)
        }
    }

    /**
     * @desc: 设置人员参照和休假类型参照 对 组织参照的联动
     * @param {type}
     * @return:
     */
    handleReferSetting = (orgId = '') => {
        let meta = this.props.meta.getMeta();
        meta[config.hrCreateCard].items.forEach(item => {
            if (item.attrcode === 'pk_psndoc') {
                item.queryCondition = function () {
                    return {
                        GridRefActionExt: 'nccloud.web.hrkq.hrentryapply.sqlbuilder.HrEntryApplyPsndocSqlBuilder',
                        orgId,
                        appCode: '60201040'
                    }
                }
            }
        });
        this.props.meta.setMeta(meta);
    }

    /**
     * @desc: 选择人员后的回调  用于控制 附件管理 按钮的显示与隐藏
     *        获取每个人员的请假单(拆单后)的主键(pk_leave)  用做附件上传的billId
     * @param {object} psns 参照选择的人员对象  object
     * @return:
     */
    handlePsnSelected = (psns) => {
        if (!psns.value) {
            return
        }
        const {form} = this.props;
        const {getAllFormValue, setFormItemsValue, getFormItemsValue} = form
        const cardCode = config.hrCreateCard
        const url = '/nccloud/hrkq/hrentryapply/HrEntryApplyOvertimeHeadAfterEditAction.do';
        let body = {
            attrCode: 'pk_psndoc',
            formData: {
                model: getAllFormValue(cardCode)
            }
        }
        hrAjax({
            url,
            body
        }).then(res => {
            if (res.success && res.data) {
                setFormItemsValue(cardCode, res.data.valueMap)
            }
        })
    }

    /**
     * @desc: org参照数据变动后清空人员和休假类型数据
     * @param {type}
     * @return:
     */
    clearRelationData = () => {
        const {form} = this.props;
        const {setFormItemsValue} = form;
        let data = {
            pk_psndoc: {
                value: null,
                display: null
            }
        }
        setFormItemsValue(config.hrCreateCard, data)
    }
    /**
     * @desc: 如果跨天展示是否通宵加班
     * @param {type}
     * @return:
     */
    isAllNight = () => {
        const {form} = this.props;
        const {getFormItemsValue, setItemsVisible} = form;
        let start = getFormItemsValue(config.hrCreateCard, 'overtimebegintime').value
        let end = getFormItemsValue(config.hrCreateCard, 'overtimeendtime').value
        if (start && end) {
            let allNight = start.split(' ')[0] !== end.split(' ')[0]
            setItemsVisible(config.hrCreateCard, {isallnight: allNight})
        }
    }
    /**
     * @desc: 设置HR录入单据页面按钮的显示和隐藏
     * @param {type}
     * @return:
     */
    setHrBillButtonStatus = () => {
        const {button, form} = this.props;
        const {getFormStatus} = form;
        let status = getFormStatus(config.hrCreateCard);
        button.setButtonsVisible({
            save: status === 'edit' || status === 'add',
            cancle: status === 'edit' || status === 'add',
            edit: status === 'browse',
            delete: status === 'browse'
        })
    }

    componentDidMount() {
        this.initTempalte(this.initData);
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        document.removeEventListener('resize', this.onResize);
    }

    render() {
        const {
            props = {},
            props: {
                meta,
                search: {NCCreateSearch},
                editTable: {createEditTable},
                table: {createSimpleTable},
                form: {setFormStatus, setAllFormValue, EmptyAllFormValue, getFormItemsValue},
                button: {createButtonApp}
            },
            state = {},
            state: {
                tabs,
                dist,
                window,
                tabActive,
                pageInfo,
                loading,
                lang,
                headerHeight,
                approveData,
                showApprove
            }
        } = this;

        let metaInfo = meta.getMeta(),
            queryOid = metaInfo && metaInfo[tabActive['queryId']] && metaInfo[tabActive['queryId']].oid;

        return (
            <div className={`container-wrap`}>
                <div style={{display: dist === 'list' ? '' : 'none'}}>
                    {/* header */}
                    <Header
                        {...props}
                        lang={lang}
                        queryOid={queryOid}
                        title={metaInfo.name}
                        queryId={tabActive.queryId}
                        tabActive={tabActive}
                        onSearch={this.onSearch}
                        onHeightChange={(height) => {
                            this.setState({
                                headerHeight: height
                            })
                        }}
                    />

                    <div class="tabs-nav-bar">
                        {/* tabs */}
                        <NCTabs
                            navtype="turn"
                            tabBarPosition="top" //tab头的定位，可以是['left','right','top','bottom']中选择
                            contenttype="moveleft"
                            activeKey={tabActive.id} //设置当前激活的tabPanel的key
                            onChange={this.onTabChange}>
                            {tabs.map((tab, index) => {
                                let params = {
                                    lang,
                                    tabActive,
                                    cardId: tab.cardId,
                                    tableId: tab.tableId,
                                    data: tab.data,
                                    height: Math.max(window.height - (headerHeight ? (headerHeight + 106) : 158), 300),
                                    onRowDoubleClick: (row, index, props) => {
                                        //let sources = row.values['billsource'].value
                                        let dist, cardCode
                                        /*if (sources === '0') {
                                            cardCode = config.cardId
                                            dist = 'detail'
                                        } else if (sources === '1') {
                                            cardCode = config.hrCreateCard
                                            dist = 'create'
                                        }*/
                                        cardCode = tab.cardId
                                        dist = 'detail'
                                        EmptyAllFormValue(cardCode);
                                        this.setState({
                                            dist
                                        });
                                        setFormStatus(cardCode, 'browse');
                                        setAllFormValue({
                                            [cardCode]: {
                                                rows: [row]
                                            }
                                        })
                                    }
                                };
                                return (<NCTabPane forceRender={true} tab={lang[tab.i18n]} key={tab.id}>
                                    {((tab) => {
                                        switch (tab.id) {
                                            case 'gather':
                                                return (<TableGather {...props} {...params}/>);
                                            case 'details':
                                                return (<TableDetails {...props} {...params}
                                                                      refresh={this.initData}
                                                                      transferTotal={
                                                                          (tab.data || []).filter(row => {
                                                                              if (row.transferflag == '1' ||
                                                                                  (row.transferflag == '0' &&
                                                                                      row.billstatus == '1')) { //待转并且审核通过
                                                                                  return true;
                                                                              }
                                                                          }).length
                                                                      }
                                                                      register={({onTransfer, onUnTransfer}) => {
                                                                          this.onTransfer = onTransfer;
                                                                      }}
                                                    /*editHrBill={this.editHrBill}
                                                    deleteHrBill={this.deleteHrBill}*/
                                                                      onChecked={({transfer, unTransfer}) => {
                                                                          this.setState({
                                                                              transfer,
                                                                              unTransfer
                                                                          });
                                                                      }}/>);
                                        }
                                    })(tab)}
                                </NCTabPane>);
                            })}
                        </NCTabs>
                        <div class="btn-group">
                            {createButtonApp({
                                area: 'table_head', //如果页面中的有多个区域有按钮，这里的area当做筛选条件，只渲染按钮的后台数据中area字段为这里指定值的按钮；
                                onButtonClick: (props, btncode) => {
                                    this.hrCreateBill()
                                }// 按钮的点击事件
                            })}
                            {tabActive.id == 'details' &&
                            <NCButton size="lg" disabled={!state.transfer || state.transfer.length == 0} shape="border"
                                      colors="info"
                                      onClick={() => this.onTransfer(true)}>{lang['hrkq-0000039']}</NCButton>
                            }
                            {tabActive.id == 'details' &&
                            <NCButton size="lg" disabled={!state.unTransfer || state.unTransfer.length == 0}
                                      shape="border" colors="info"
                                      onClick={() => this.onTransfer(false)}>{lang['hrkq-0000040']}</NCButton>
                            }
                            <NCButton size="lg" shape="border" colors="info"
                                      onClick={this.onExport}>{lang['hrkq-0000085']}</NCButton>
                        </div>
                    </div>


                    {/* pagination */}
                    <div className="pagination" style={{margin: '20px 10px 10px'}}>
                        {parseInt(pageInfo.total || 0) > 0 ?
                            <Pagination
                                total={pageInfo.total}
                                pageSize={pageInfo.pageSize}
                                showQuickJumper={true}
                                showSizeChanger={true}
                                current={pageInfo.pageIndex}
                                onChange={(pageIndex) => {
                                    this.onPageInfoChange({
                                        pageIndex
                                    });
                                    this.initData();
                                }}
                                onShowSizeChange={(pageSize) => {
                                    this.onPageInfoChange({
                                        pageSize,
                                        pageIndex: 1
                                    });
                                    this.initData();
                                }}
                            /> : null}
                    </div>
                </div>
                <div style={{display: dist == 'detail' ? '' : 'none'}}>
                    <Form
                        {...props}
                        cardId={tabActive['cardId']}
                        title={metaInfo && metaInfo[tabActive['cardId']] && metaInfo[tabActive['cardId']].name || ''}
                        onBack={() => {
                            this.setState({dist: 'list'})
                        }}
                    />
                </div>
                <div style={{display: dist == 'create' ? '' : 'none'}}>
                    <Form
                        {...props}
                        cardId={config['hrCreateCard']}
                        onButtonClick={this.handleHrBillButtonClick}
                        onAfterEvent={this.afterHrCardEdited}
                        customButton={true}
                        buttonArea='card_head'
                        title={lang['hrkq-0000117']}
                        onBack={this.cancleHrBill}
                    />
                </div>

                {/* loading */}
                <NCLoading
                    container={this}
                    show={loading}>
                </NCLoading>

                {/* 流程历史 */}
                {approveData.billtype && approveData.billid &&
                <ApproveDetail show={showApprove}
                               close={() => {
                                   this.setState({
                                       showApprove: false
                                   })
                               }}
                               billtype={approveData.billtype}    // 此处billtype为交易类型
                               billid={approveData.billid}
                />
                }
            </div>
        );
    };
}