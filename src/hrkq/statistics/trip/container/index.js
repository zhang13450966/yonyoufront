import React, { Component } from 'react';
import { base, high, toast, promptBox } from 'nc-lightapp-front';

import { languageCreateUIDOM, hrAjax } from 'src/hrpub/common/utils/utils';
import { getClientSize, getBEDateQueryCondition, getCurMonthEndTs, getCurMonthStartTs, formatTemplate, formatQueryCondition, formatValueByRow } from 'src/hrkq/statistics/common/utils';
import exportHtmlFunc from 'src/hrpub/common/utils/exportHtml';

// const { NCUploader } = high;
import NCUploader from 'uap/common/components/NCUploader';
// css
import './index.less';

// components
import Form from 'src/hrkq/statistics/common/components/Form';

import Header from 'src/hrkq/statistics/common/components/Header';
import EditTable from '../components/EditTable';
import Pagination from 'src/hrpub/common/components/Pagination/index';

import config from '../config/index';
import formDownLoad, {getUrlParam} from "../../../public/download";

let { NCLoading, NCPagination, NCTabs, NCTabs: { NCTabPane }, NCInput, NCButton } = base;

export default class extends Component {
    constructor(props) {
        super(props);

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
            needUploadFile: false,
            showUploader: false,
            billId: '',
            uploadButtonDisabled: false
        };

        ['initTempalte', 'initData', 'onSearch',
            'onPageInfoChange', 'onResize', 'onExport', 'onExportWithOutQueryId', 'onExportWithInQueryId'].forEach(fun => {
            if (typeof this[fun] == 'function') {
                this[fun] = this[fun].bind(this);
            }
        })
    }

    initTempalte = (callback) => {
        languageCreateUIDOM(this.props)({
            appcode: config['appcode'],
            pagecode: config['pagecode'],
        }, { ...config['mutilLang'] }, (metas, lang, intl) => {
            const props = this.props;
            const { button, template } = metas;
            const { meta } = props;

            this.setState({ lang });

            meta.setMeta(template ? formatTemplate({ template, lang }) : {});

            this.initailMeta && this.initailMeta();

            props.button.setButtons(button);

            callback && callback();
        });
    }

    initData = () => {
        clearTimeout(this.initDataTimer);
        this.initDataTimer = setTimeout(() => {
            let { meta, editTable: { setTableData }, search: { getQueryInfo } } = this.props;
            this.setState({ loading: true });
            this.queryListAction({
                ...this.queryParams
            }).then(({ success, data: {
                pageid,
                templetid,
                [config.tableId]: {
                    pageInfo: { total = 0 } = {},
                    areacode,
                    rows = []
                } = {}
            } = {} }) => {
                if (success) {
                    this.onPageInfoChange({
                        total
                    });
                    setTableData(config.tableId, { rows })
                }
                this.setState({ loading: false });
            }).catch(({ message, stack }) => {
                this.setState({ loading: false });
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

    onSearch = ({ dateRanger = {}, queryParams = {} } = {}) => {
        let { meta } = this.props;
        this.queryParams = {
            // ... common param
            ...queryParams
        };
        if (dateRanger.endValue > 0) {
            if (config.queryId) {
                this.queryParams = Object.assign({}, this.queryParams, {
                    ...getBEDateQueryCondition({
                        ...dateRanger,
                        beginField: 'tripbegintime',
                        endField: 'tripendtime',
                        oprtype: 'billBetween',
                        logic: 'or'
                    })
                });
            } else {
                this.queryParams = Object.assign({}, this.queryParams, {
                    tripbegintime: dateRanger.beginValue,
                    tripendtime: dateRanger.endValue,
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

    onPageInfoChange = ({ pageIndex, pageSize, total } = {}) => {
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
        let { meta } = this.props;
        let { pageInfo } = this.state,
            url = config.queryAction,
            metaInfo = meta.getMeta(),
            oid = metaInfo && metaInfo[config['queryId']] && metaInfo[config['queryId']].oid;

        let body = {
            oid,
            pageInfo,
            ...getBEDateQueryCondition({
                beginValue: getCurMonthStartTs(),
                endValue: getCurMonthEndTs(),
                beginField: 'tripbegintime',
                endField: 'tripendtime',
                oprtype: 'billBetween',
                logic: 'or'
            }),
            ...params,
        };

        console.log('queryListAction: ', body)

        return hrAjax({
            url,
            body
        })
    }

    /**
    *  导出
    */
    onExport = () => {
        if (config.queryId) {
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
                pageInfo,
                lang
            },
            props: {
                meta,
                table
            }
        } = this,
            metaInfo = meta.getMeta();

        this.setState({ loading: true });
        this.queryListAction({
            ...this.queryParams,
            pageInfo: {
                pageIndex: 1,
                pageSize: pageInfo.total || 10,
            }
        }).then(({ success, data: {
                pageid,
                templetid,
                [config.tableId]: {
                    pageInfo: { total = 0 } = {},
                    areacode,
                    rows = []
                } = {}
            } = {} }) => {
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
                    title: lang['hrkq-0000128'],  // 出差统计
                    fileName: lang['hrkq-0000128'],
                    maker: lang['hrkq-0000098'],
                    date: lang['hrkq-0000099']
                }, {
                    meta: metaInfo[config['tableId']],
                    data: rows,
                    showIndex: true
                })
            }
            this.setState({ loading: false });
        }).catch(({ message, stack }) => {
            this.setState({ loading: false });
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
        let url = config.exportAction,
            queryKeys = ['tripbegintime', 'tripendtime', 'triptypename', 'deptid', 'jobId', 'query','tripdaymin', 'tripdaymax', 'minunit', 'approvestatus', 'isIncludeSub'],
            queryParams = {
                tripbegintime: getCurMonthStartTs().toString(),
                tripendtime: getCurMonthEndTs().toString(),
                ...this.queryParams,
                ...formatQueryCondition(this.queryParams && this.queryParams.querycondition, {
                    pk_org: 'orgId',
                    pk_dept: 'deptid',
                    pk_job: 'jobId',
                    pk_trip_type: 'triptypename',
                    begintime: 'tripbegindate',
                    endtime: 'tripenddate',
                    tripday: ['tripdaymin', 'tripdaymax'],
                })
            };

        queryKeys.forEach(item => {
            let key = item.key || item,
                alias = item.alias || item;

            if (queryParams &&
                queryParams[key] !== undefined) {
                url += `${(/\?/.test(url) ? '&' : '?')}${alias}=${queryParams[key]}`;
            }
        })

        console.log('onExport: ', this.queryParams, queryParams, url);
        const body = getUrlParam(url);
        formDownLoad({
            url,
            body,
            method: 'get',
            enctype: 1
        })
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
    hrCreateBill = async () => {
        const { form } = this.props;
        const {EmptyAllFormValue, setFormStatus, setAllFormValue, getAllFormValue, getFormItemsValue} = form;
        const formCode = config.hrCreateCard
        hrAjax({
            url: '/nccloud/hrkq/hrentryapply/HrEntryApplyTripAddDefaultAction.do',
            body: {
                operat: 0
            }
        }).then(res => {
            if (res.success) {
                setAllFormValue({[formCode]: res.data[formCode]})
                const billId = getFormItemsValue(formCode, 'pk_trip').value
                this.setState({billId})

            }
        })
        EmptyAllFormValue(config.hrCreateCard);
        setFormStatus(config.hrCreateCard, 'add');
        this.initHrCardStatus(config.hrCreateCard, true);
        this.handleOrgReferSqlBuilder()
        await this.setState({
            dist: 'create',
            needUploadFile: false,
            uploadButtonDisabled: false
        })
        console.log(getAllFormValue(config.tripOffCard))
        this.setHrBillButtonStatus()
    }
    /**
     * @desc:
     * @param {type}
     * @return:
     */
    initHrCardStatus = (cardId, disabled) => {
        const { form } = this.props;
        const { setFormItemsDisabled } = form;
        let disabledMap = {
            pk_org: false,
            pk_psndoc: disabled, // 选择人员
            triptypeid: disabled, // 出差类型
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
                        appCode: '60201050'
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
        switch (btncode) {
            case 'save':
                this.saveHrBill();
                break;
            case 'cancle':
                this.cancleHrBill(config.hrCreateCard);
                break;
            case 'edit':
                this.editHrBill()
                break;
            case 'delete':
                this.deleteHrBill()
                break;
            case 'file':
                this.handleClickFileUploader()
                break;

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
     * @desc: 删除HR录入的单据
     * @param {type}
     * @return:
     */
    deleteHrBill = (row) => {
        const { form, editTable: { setTableData } } = this.props;
        const { getFormItemsValue } = form;
        let billType, pk;
        if (row) {
            billType = row['values']['billtype'].value
            pk = row['values']['pk_trip'].value
        } else {
            billType = getFormItemsValue(config.hrCreateCard, 'billtype').value;
            pk = getFormItemsValue(config.hrCreateCard, 'pk_trip').value
        }
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
                        }).then(({success, data: {
                            [config.tableId]: {
                                pageInfo: { total = 0 } = {},
                                rows = []
                            } = {}
                        } = {}}) => {
                            if (success) {
                                this.onPageInfoChange({
                                    total
                                });
                                setTableData(config.tableId, { rows })
                            }
                        })
                    }
                })
            }
        })
    }
    /**
     * @desc: 校验表单必填
     * @param formCode {string}
     * @return: {boolean}
     */
    basicBillCheck = (formCode) => {
        const { form } = this.props;
        const { isCheckNow } = form;
        return isCheckNow(formCode, 'warning')
    }
    /**
     * @desc: hr录入表单时间校验
     * @param formCode {string}
     * @return: {Booean}
     */
    billTimeCheck = (formCode) => {
        const { form } = this.props;
        const { getFormItemsValue } = form;
        let begin = getFormItemsValue(formCode, 'tripbegintime').value;
        let end = getFormItemsValue(formCode, 'tripendtime').value;
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
        const { form, editTable: { setTableData } } = this.props;
        const { getAllFormValue, getFormItemsValue } = form;
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
                this.queryListAction({...this.queryParams}).then(({success, data: {
                    [config.tableId]: {
                        pageInfo: { total = 0 } = {},
                        rows = []
                    } = {}
                } = {}}) => {
                    if (success) {
                        this.onPageInfoChange({
                            total
                        });
                        setTableData(config.tableId, { rows })
                    }
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
    cancleHrBill = (cardCode) => {
        const { form } = this.props;
        const { getFormStatus } = form;
        if(getFormStatus(cardCode) !== 'browse'){
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
     * @param {type}
     * @return:
     */
    editHrBill = (row) => {
        const { form } = this.props;
        const { setFormStatus, setFormItemsDisabled, setAllFormValue } = form;
        const cardCode = config.hrCreateCard;
        if (row && row.values) {
            this.setState({
                dist: 'create'
            })
            setAllFormValue({
                [cardCode]: {
                    rows: [row]
                }
            })
        }
        setFormStatus(cardCode, 'edit')
        setFormItemsDisabled(cardCode, {
            pk_org: true,
            pk_psndoc: true,
            triptypeid: true
        })
        this.setHrBillButtonStatus()
    }
    /**
     * @desc: 查看销差单据详情
     * @param {type}
     * @return:
     */
    showTripoffInfo = (row) => {
        const { form } = this.props;
        const { EmptyAllFormValue, setFormStatus, setAllFormValue } = form;
        const cardCode = config.tripOffCard;
        let pk_trip = row['values'] &&  row['values']['pk_trip'] && row['values']['pk_trip'].value || null;
        if (!pk_trip) return
        EmptyAllFormValue(cardCode)
        hrAjax({
            url: '/nccloud/hrkq/tripoff/QueryByIdAction.do',
            body: {
                pk_trip
            }
        }).then(res => {
            if (res.success) {
                let rows = res.data && res.data['tripoff'] && res.data['tripoff']['tripoff_card'] && res.data['tripoff']['tripoff_card']['rows'] || []
                setAllFormValue({
                    [cardCode]: {
                        rows
                    }
                })
                setFormStatus(cardCode, 'browse')
                this.setState({
                    dist: 'tripoff'
                })
            }
        })
    }
    /**
     * @desc: 设置HR录入单据页面按钮的显示和隐藏
     * @param {type}
     * @return:
     */
    setHrBillButtonStatus = () => {
        const { button, form } = this.props;
        const { getFormStatus } = form;
        const status = getFormStatus(config.hrCreateCard);
        const { needUploadFile } = this.state;
        button.setButtonsVisible({
            save: status === 'edit' || status === 'add',
            cancle: status === 'edit' || status === 'add',
            edit: status === 'browse',
            delete: status === 'browse',
            file: needUploadFile
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
            case 'triptypeid':
                this.onTripTypeChanged(value)
            break;
            case 'tripbegintime':
            case 'tripendtime':
                let val = value.value.slice(0,-2)+'00'
                props.form.setFormItemsValue(moduleId, {
                    [key]: {
                        value: val
                    }
                })
                break;
            // 申请人为单个时 可以上传附件
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
     * @desc: 出差类型编辑后事件 获取单位 minunit
     * @param {Object} value
     * @return:
     */
    onTripTypeChanged = (value) => {
        const { form } = this.props;
        const { getAllFormValue, setFormItemsValue } = form;
        const cardCode = config.hrCreateCard
        if (value.value) {
            let url = '/nccloud/hrkq/hrentryapply/HrEntryApplyTripHeadAfterEditAction.do';
            let body = {
                attrCode: 'triptypeid',
                formData: {
                    model: getAllFormValue(cardCode)
                }
            }
            hrAjax({
                url,
                body
            }).then(res => {
                if (res.data && res.data.valueMap) {
                    setFormItemsValue(cardCode, res.data.valueMap)
                }
            })
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
            if (item.attrcode === 'triptypeid') {
                item.queryCondition = function () {
                    return {
                        orgId,
                        appCode: '60201050'
                    }
                }
            }
            if (item.attrcode === 'pk_psndoc') {
                item.queryCondition = function () {
                    return {
                        GridRefActionExt: 'nccloud.web.hrkq.hrentryapply.sqlbuilder.HrEntryApplyPsndocSqlBuilder',
                        orgId,
                        appCode: '60201050'
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
            this.setState({
                needUploadFile: false,
                billId: ''
            }, () => {
                this.setHrBillButtonStatus()
            })
            return
        }

        const { form } = this.props;
        const { getAllFormValue, setFormItemsValue, getFormItemsValue } = form
        const cardCode = config.hrCreateCard
        const url = '/nccloud/hrkq/hrentryapply/HrEntryApplyTripHeadAfterEditAction.do';
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
                let needUploadFile = false
                let billId = ''
                if (psns.value && psns.value.split(',').length === 1) {
                    needUploadFile = true
                    billId = getFormItemsValue(cardCode, 'pk_trip').value
                }
                this.setState({
                    needUploadFile,
                    billId
                }, () => {
                    this.setHrBillButtonStatus()
                })
            }
        })
    }

    /**
     * @desc: 点击附件管理按钮
     * @param {Object} row  行数据  如果传递了 先设置 billId
     * @return:
     */
    handleClickFileUploader = (row) => {
        let stateObj = {
            showUploader: true
        }
        if (row && row.values) {
            stateObj.billId = row.values['pk_trip'].value
            let billsource = row.values['billsource'] && row.values['billsource'].value || '0'
            stateObj.uploadButtonDisabled = billsource === '0'

        }
        this.setState(stateObj)
    }
    /**
     * @desc: 关闭附件管理按钮
     * @param {type}
     * @return:
     */
    hideUploader = () => {
        this.setState({
            showUploader: false
        })
    }

    /**
     * @desc: 附件上传前事件
     * @param {type}
     * @return:
     */
    beforeUpload = () => {

    }

    /**
     * @desc: org参照数据变动后清空人员和休假类型数据
     * @param {type}
     * @return:
     */
    clearRelationData = () => {
        const { form } = this.props;
        const { setFormItemsValue } = form;
        let data = {
            pk_psndoc: {
                value: null,
                display: null
            },
            triptypeid: {
                value: null,
                display: null
            }
        }
        setFormItemsValue(config.hrCreateCard, data)
    }
    /**
     * @desc: 列表的行双击事件回调
     * @param {type}
     * @return:
     */
    handleRowDoubleClick = async (row, index, props) => {
        const { form } = this.props;
        const { setAllFormValue, EmptyAllFormValue, setFormStatus } = form;
        let sources = row.values['billsource'] && row.values['billsource'].value || '0'
        let billId = row.values['pk_trip'].value;
        let dist,cardCode, uploadButtonDisabled
        if (sources === '0') {
            cardCode = config.cardId
            dist = 'detail'
            uploadButtonDisabled = true
        } else if (sources === '1') {
            cardCode = config.hrCreateCard
            dist = 'create'
            uploadButtonDisabled = false
        }
        EmptyAllFormValue(cardCode);
        await this.setState({
            dist,
            needUploadFile: true,
            billId,
            uploadButtonDisabled
        });
        setFormStatus(cardCode, 'browse');
        setAllFormValue({
            [cardCode]: {
                rows: [row]
            }
        })
        this.setHrBillButtonStatus()
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
                search: { NCCreateSearch },
                editTable: { createEditTable },
                table: { createSimpleTable },
                form: { setFormStatus, setAllFormValue, EmptyAllFormValue, getFormItemsValue },
                button: { createButtonApp }
            },
            state,
            state: {
                tabs,
                dist,
                window,
                pageInfo,
                loading,
                lang,
                showUploader,
                billId,
                uploadButtonDisabled
            }
        } = this;

        let metaInfo = meta.getMeta(),
            queryOid = metaInfo && metaInfo[config['queryId']] && metaInfo[config['queryId']].oid;

        return (
            <div class={`container-wrap`}>
                <div style={{ display: dist == 'list' ? '' : 'none' }}>
                    {/* header */}
                    <Header
                        { ...props }
                        lang={lang}
                        queryId={config.queryId}
                        queryOid={queryOid}
                        title={metaInfo.name}
                        onSearch={this.onSearch}
                        custom={
                            <div class="custom-btn" style={{marginLeft: 'auto'}}>
                                {createButtonApp({
                                    area: 'table_head', //如果页面中的有多个区域有按钮，这里的area当做筛选条件，只渲染按钮的后台数据中area字段为这里指定值的按钮；
                                    onButtonClick: (props, btncode) => {
                                        this.hrCreateBill()
                                    }// 按钮的点击事件
                                })}
                                <NCButton shape="border" onClick={this.onExport}>{lang['hrkq-0000085']}</NCButton>
                            </div>
                        }/>

                    {/* content */}
                    <div class="content">

                        {/* table must tableId */}
                        <EditTable
                            { ...props }
                            lang={lang}
                            tableId={config.tableId}
                            showFileUploader={this.handleClickFileUploader}
                            cardId={config.cardId}
                            height={Math.max(window.height - 165, 300)}
                            register={({ initailMeta } = {}) => {
                                this.initailMeta = initailMeta;
                            }}
                            onRowDoubleClick={this.handleRowDoubleClick}
                            editHrBill={this.editHrBill}
                            deleteHrBill={this.deleteHrBill}
                            showTripoffInfo={this.showTripoffInfo}
                        />

                        {/* pagination */}
                        <div className="pagination" style={{ margin: '20px 10px 10px' }}>
                            {parseInt(pageInfo.total || 0) > 0 ?
                                <Pagination
                                    defaultCurrent={1}
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
                </div>
                <div style={{ display: dist == 'detail' ? '' : 'none' }}>
                    <Form
                        {...props}
                        cardId={config['cardId']}
                        title={metaInfo && metaInfo[config['cardId']] && metaInfo[config['cardId']].name || ''}
                        onBack={() => {
                            this.setState({
                                dist: 'list'
                            })
                        }}
                    />
                </div>
                <div style={{display: dist == 'create'? '':'none'}}>
                    <Form
                        {...props}
                        cardId={config['hrCreateCard']}
                        onButtonClick={this.handleHrBillButtonClick}
                        onAfterEvent={this.afterHrCardEdited}
                        customButton={true}
                        buttonArea='card_head'
                        title={lang['hrkq-0000118']}
                        onBack={this.cancleHrBill.bind(this, config['hrCreateCard'])}
                    />
                </div>
                <div style={{display: dist == 'tripoff'? '':'none'}}>
                    <Form
                        {...props}
                        cardId={config['tripOffCard']}
                        onAfterEvent={this.afterHrCardEdited}
                        title={lang['hrkq-0000111']} /* 销差单详情 */
                        onBack={this.cancleHrBill.bind(this, config['tripOffCard'])}
                    />
                </div>

                {/* loading */}
                <NCLoading
                    container={this}
                    show={loading} >
                </NCLoading>
                {/* fileUpload */}
                {showUploader && <NCUploader
                    billId={billId}
                    disableButton={uploadButtonDisabled}
                    customize = {{uploadTrpe: '0'}}
                    placement={'right'}
                    onHide={ this.hideUploader } // 关闭功能
                    beforeUpload={ this.beforeUpload }
                    />
                }
            </div>
        );
    }
}

