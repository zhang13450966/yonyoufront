import React, {Component} from 'react';
import {base, high, toast, promptBox} from 'nc-lightapp-front';

import {languageCreateUIDOM, hrAjax} from 'src/hrpub/common/utils/utils';
import {
    getClientSize,
    getBEDateQueryCondition,
    getCurMonthEndTs,
    getCurMonthStartTs,
    formatTemplate,
    formatQueryCondition,
    formatValueByRow
} from 'src/hrkq/statistics/common/utils';
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

let {NCLoading, NCPagination, NCTabs, NCTabs: {NCTabPane}, NCInput, NCButton} = base;

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
            leavecode: '',
            isBreastFeed: false, // 是否是哺乳假
            needUploadFile: false,
            showUploader: false,
            billId: '',
            uploadButtonDisabled: false
        };
        props.use.form('leave_card', 'hr_leave_card', 'leaveoff_card');
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
        }, {...config['mutilLang']}, (metas, lang, intl) => {
            const props = this.props;
            const {button, template} = metas;
            const {meta} = props;
            this.setState({lang});

            meta.setMeta(template ? formatTemplate({template, lang}) : {});

            this.initailMeta && this.initailMeta();
            props.button.setButtons(button);
            callback && callback();
        });
    }

    initData = () => {
        clearTimeout(this.initDataTimer);
        this.initDataTimer = setTimeout(() => {
            let {meta, editTable: {setTableData}, search: {getQueryInfo}} = this.props;
            this.setState({loading: true});
            this.queryListAction({
                ...this.queryParams
            }).then(({
                         success, data: {
                    pageid,
                    templetid,
                    [config.tableId]: {
                        pageInfo: {total = 0} = {},
                        areacode,
                        rows = []
                    } = {}
                } = {}
                     }) => {
                if (success) {
                    this.onPageInfoChange({
                        total
                    });
                    setTableData(config.tableId, {rows})
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

    onSearch = ({dateRanger = {}, queryParams = {}} = {}) => {
        let {meta} = this.props;
        this.queryParams = {
            // ... common param
            ...queryParams
        };
        if (dateRanger.endValue > 0) {
            if (config.queryId) {
                this.queryParams = Object.assign({}, this.queryParams, {
                    ...getBEDateQueryCondition({
                        ...dateRanger,
                        oprtype: 'billBetween',
                        logic: 'or'
                    })
                });
            } else {
                this.queryParams = Object.assign({}, this.queryParams, {
                    beginDate: dateRanger.beginValue,
                    endDate: dateRanger.endValue,
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
        let {meta} = this.props;
        let {pageInfo} = this.state,
            url = config.queryAction,
            metaInfo = meta.getMeta(),
            oid = metaInfo && metaInfo[config['queryId']] && metaInfo[config['queryId']].oid;


        let body = {
            oid,
            pageInfo,
            ...getBEDateQueryCondition({
                beginValue: getCurMonthStartTs(),
                endValue: getCurMonthEndTs(),
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
     * @desc: hr录入单据入口
     * @param {type}
     * @return:
     */
    hrCreateBill = async () => {
        const {form} = this.props;
        const {EmptyAllFormValue, setFormStatus, setAllFormValue, getFormItemsValue} = form;
        const formCode = config.hrCreateCard
        hrAjax({
            url: '/nccloud/hrkq/hrentryapply/HrEntryApplyLeaveAddDefaultAction.do',
            body: {
                operat: 0
            }
        }).then(res => {
            if (res.success) {
                setAllFormValue({[formCode]: res.data[formCode]})
                let billId = getFormItemsValue(formCode, 'pk_leave').value
                this.setState({billId})
            }
        })
        EmptyAllFormValue(config.hrCreateCard);
        setFormStatus(config.hrCreateCard, 'add');
        this.initHrCardStatus(config.hrCreateCard, true);
        this.handleBreastFeedType(config.hrCreateCard, false)
        this.handleDateFormControl(config.hrCreateCard, '1', '1', false);
        this.handleOrgReferSqlBuilder()
        await this.setState({
            dist: 'create',
            needUploadFile: false,
            uploadButtonDisabled: false
        })
        this.setHrBillButtonStatus()
    }
    /**
     * @desc: 初始化hr录入表单的状态
     * @param {cardId} 表单Id
     * @param {disabled} 是否不可用
     * @param {type} 区域字段 'timeCt' 时间控件 'referCt' 人员和休假类型 'all' 所有
     * @return:
     */
    initHrCardStatus = (cardId, disabled, type = 'all') => {
        const {form} = this.props;
        const {setFormItemsDisabled} = form;
        let disabledMap = {};
        let timeCt = {
            showbegindate: disabled, // 开始日期
            showenddate: disabled, // 结束日期
            begintime: disabled, // 结束日期
            endtime: disabled, // 结束日期
            start_day_type: disabled, // 结束日期
            end_day_type: disabled // 结束日期
        };
        let referCt = {
            pk_org: false,
            pk_psndoc: disabled, // 选择人员
            pk_leave_type: disabled, // 休假类型
        };
        if (type === 'timeCt') {
            Object.assign(disabledMap, timeCt)
        } else if (type === 'referCt') {
            Object.assign(disabledMap, referCt)
        } else {
            Object.assign(disabledMap, referCt, timeCt)
        }
        setFormItemsDisabled(cardId, disabledMap)
        disabledMap = null
    }
    /**
     * @desc: hr录入单据的编辑后事件
     * @param {type}
     * @return:
     */
    afterHrCardEdited = (props, moduleId, key, value, oldValue) => {
        switch (key) {
            case 'pk_org':
                this.onOrgChanged(value)
                break;
            case 'pk_leave_type':
                this.onLeaveTypeChanged(value)
                break;
            case 'begintime':
            case 'showbegindate':
            case 'start_day_type':
            case 'endtime':
            case 'showenddate':
            case 'end_day_type':
                if (!['start_day_type', 'end_day_type'].includes(key) && value.value) {
                    value.value = value.value.slice(0, -2) + '00'
                }
                this.handelLeavetime(moduleId, key, value.value);
                this.handleLeaveTimeMsg(moduleId, key);
                break;
            case 'breastfeedingleaveday':
                this.handlebreastfeedingleaveday();
                break;
            // 申请人为单个时 可以上传附件
            case 'pk_psndoc':
                this.handlePsnSelected(value);
                break;
        }
    }
    /**
     * @desc: 对于半天假和整天的假别   时间控件不同，
     *        对应的元数据字段也不一致，需要全部处理到 开始时间和结束时间 元数据上
     *        通过开始时间和结束时间字段 触发编辑后事件回调
     * @param {String} cardCode  表单的earaCode
     * @param {String} key   对应的字段
     * @param {String} value 不是编辑后事件中返回的对象，确切的值
     * @return:
     */
    handelLeavetime = (cardCode, key, value) => {
        if (!value) return
        const {form} = this.props;
        let {minTime, lang} = this.state;
        const {setFormItemsValue, getFormItemsValue} = form;
        let time;
        let begintime;
        let endtime;
        switch (key) {
            case 'begintime':
                // 需要赋值 showbegindate 移动端显示单据详情用
                setFormItemsValue(cardCode, {
                    showbegindate: {
                        value
                    }
                })
                break;
            case 'endtime':
                // 需要赋值 showenddate 移动端显示单据详情用
                setFormItemsValue(cardCode, {
                    showenddate: {
                        value
                    }
                })
                break;
            case 'showbegindate':
                // 哺乳假
                if (this.isBreastFeed) {
                    let time = '08:00:00';
                    let val = value.split(' ');
                    val.splice(1, 1, time)
                    setFormItemsValue(cardCode, {
                        begintime: {
                            value: val.join(' '),
                        },
                        showbegindate: {
                            value: val.join(' ')
                        }
                    })
                    break;
                }
                // 半天假
                if (minTime === '1') {
                    // 初始输入 自动默认带出 上午 标志
                    let oldVal = getFormItemsValue(cardCode, 'start_day_type').value;
                    let time = '08:00:00';
                    let display = lang['hrkq-0000081']; // 上午
                    let label = value.split(' ');
                    let val = value.split(' ');
                    label.splice(1, 1, display)
                    val.splice(1, 1, time)
                    if (!oldVal) {
                        setFormItemsValue(cardCode, {start_day_type: {value: '1', display}})
                        setFormItemsValue(cardCode, {
                            begintime: {
                                value: val.join(' ')
                            },
                            showbegindate: {
                                value: val.join(' ')
                            }
                        })
                    } else {
                        // 上午 下午标志 有值  回写到begintime或者endtime上 方便后端查询存储
                        time = oldVal === '2' ? '20:00:00' : '08:00:00';
                        display = oldVal === '2' ? lang['hrkq-0000080'] : lang['hrkq-0000081'];
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {
                            begintime: {
                                value: val.join(' '),
                            },
                            showbegindate: {
                                value: val.join(' ')
                            }
                        })
                    }
                } else {
                    setFormItemsValue(cardCode, {begintime: {value: this.fillDateTime(value, '0')}})
                }
                break;
            case 'showenddate':
                // 哺乳假
                if (this.isBreastFeed) {
                    let time = '08:00:00';
                    let val = value.split(' ');
                    val.splice(1, 1, time)
                    setFormItemsValue(cardCode, {
                        endtime: {
                            value: val.join(' ')
                        },
                        showenddate: {
                            value: val.join(' ')
                        }
                    })
                    break;
                }
                if (minTime === '1') {
                    let oldVal = getFormItemsValue(cardCode, 'end_day_type').value;
                    let time = '08:00:00';
                    let display = lang['hrkq-0000081'] // 上午
                    let val = value.split(' ');
                    let label = value.split(' ');
                    val.splice(1, 1, time)
                    label.splice(1, 1, display)
                    if (!oldVal) {
                        setFormItemsValue(cardCode, {end_day_type: {value: '1', display}})
                        setFormItemsValue(cardCode, {
                            endtime: {
                                value: val.join(' ')
                            },
                            showenddate: {
                                value: val.join(' ')
                            }
                        })
                    } else {
                        time = oldVal === '2' ? '20:00:00' : '08:00:00';
                        display = oldVal === '2' ? lang['hrkq-0000080'] : lang['hrkq-0000081'];
                        val.splice(1, 1, time);
                        label.splice(1, 1, display);
                        setFormItemsValue(cardCode, {
                            endtime: {
                                value: val.join(' ')
                            },
                            showenddate: {
                                value: val.join(' ')
                            }
                        })
                    }
                } else {
                    setFormItemsValue(cardCode, {endtime: {value: this.fillDateTime(value, '0')}});
                }
                break;
            case 'start_day_type':
                time = value === '2' ? '20:00:00' : '08:00:00';
                begintime = getFormItemsValue(cardCode, 'begintime').value;
                if (begintime) {
                    let val = begintime.split(' ');
                    val.splice(1, 1, time);
                    setFormItemsValue(cardCode, {
                        begintime: {value: val.join(' ')},
                        showbegindate: {value: val.join(' ')}
                    });
                }
                break;
            case 'end_day_type':
                time = value === '2' ? '20:00:00' : '08:00:00';
                endtime = getFormItemsValue(cardCode, 'endtime').value;
                if (endtime) {
                    let val = endtime.split(' ');
                    val.splice(1, 1, time);
                    setFormItemsValue(cardCode, {
                        endtime: {value: val.join(' ')},
                        showenddate: {value: val.join(' ')},
                    });
                }
                break;
        }
    }
    /**
     * @desc: 请假时间补充 时 分 秒  半天或者天假别 都会用到begintime、endtime 字段去计算时长，需要把时间copy到begintime字段上
     *        上午 统一添加 08:00:00 下午 统一添加 20:00:00
     *        整天的统一为 00:00:00  date类型控件选到的为当前时间精确到秒~~~
     * @param  value {String} 当前时间
     * @param  type {String} 替换的类型 0 '00:00:00' 1 '08:00:00' 2 '20:00:00' 3 '23:59:59'
     * @return: 替换后的时间
     */
    fillDateTime = (value, type) => {
        type = type - 0;
        const timeArr = ['00:00:00', '08:00:00', '20:00:00', '23:59:59'];
        let arr = value.split(' ');
        arr.splice(1, 1, timeArr[type])
        return arr.join(' ')
    }
    /**
     * @desc: 哺乳假 每天休假时长同步到 休假时长 leaveday字段
     * @param {type}
     * @return:
     */
    handlebreastfeedingleaveday = () => {
        const {form: {getFormItemsValue, setFormItemsValue}} = this.props;
        let value = getFormItemsValue(config.hrCreateCard, 'breastfeedingleaveday').value
        setFormItemsValue(config.hrCreateCard, {
            leaveday: {
                value
            }
        })
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
        const {form} = this.props;
        const {getAllFormValue, setFormItemsValue, getFormItemsValue} = form
        const cardCode = config.hrCreateCard
        const url = '/nccloud/hrkq/hrentryapply/HrEntryApplyLeaveHeadAfterEditAction.do';
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
                    billId = getFormItemsValue(cardCode, 'pk_leave').value
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

    handleLeaveTimeMsg = (moduleId, key) => {
        const {form} = this.props;
        const {getAllFormValue, setFormItemsValue, getFormItemsValue} = form
        const cardCode = moduleId
        const url = '/nccloud/hrkq/hrentryapply/HrEntryApplyLeaveHeadAfterEditAction.do';
        let body = {
            attrCode: key,
            formData: {
                model: getAllFormValue(cardCode)
            }
        }
        hrAjax({
            url,
            body
        }).then(res => {
            if (res.data && res.data.extend && res.data.extend.msg) {
                promptBox(
                    {
                        color: "warning",
                        title: this.state.lang['hrkq-0000102'], /* 国际化处理： 提示*/
                        content: res.data.extend.msg, /* 国际化处理： 你确定要返回吗？*/
                        noCancelBtn: true
                    })
            }
        })
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
            this.initHrCardStatus(config.hrCreateCard, false, 'referCt')
        }
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
                        appCode: '60201030'
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
     * @desc: 设置人员参照和休假类型参照 对 组织参照的联动
     * @param {type}
     * @return:
     */
    handleReferSetting = (orgId = '') => {
        let meta = this.props.meta.getMeta();
        meta[config.hrCreateCard].items.forEach(item => {
            if (item.attrcode === 'pk_leave_type') {
                item.queryCondition = function () {
                    return {
                        orgId,
                        appCode: '60201030'
                    }
                }
            }
            if (item.attrcode === 'pk_psndoc') {
                item.queryCondition = function () {
                    return {
                        GridRefActionExt: 'nccloud.web.hrkq.hrentryapply.sqlbuilder.HrEntryApplyPsndocSqlBuilder',
                        orgId,
                        appCode: '60201030'
                    }
                }
            }
        });
        this.props.meta.setMeta(meta);
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
            },
            pk_leave_type: {
                value: null,
                display: null
            }
        }
        setFormItemsValue(config.hrCreateCard, data)
    }
    /**
     * @desc: 休假类型编辑后事件
     * @param {Object} value
     * @return:
     */
    onLeaveTypeChanged = (value) => {
        const {form} = this.props;
        const {getAllFormValue, setFormItemsValue, getFormItemsValue} = form;
        const cardCode = config.hrCreateCard
        if (value.value) {
            this.setState({
                leavecode: value.refcode
            })
            this.initHrCardStatus(cardCode, false, 'timeCt')
            // 哺乳假
            if (value.refcode === '8') {
                this.handleDateFormControl(cardCode, '2', '2', false)
                this.handleBreastFeedType(cardCode, true)
                //  设置 哺乳假 前端固定 哺乳假单位，最小请假时间  主要解决我的申请页面哺乳假请求时长 undefinned
                setFormItemsValue(cardCode, {minunit: {display: "1", value: "1"}})
            } else {
                this.handleBreastFeedType(cardCode, false)
                let url = '/nccloud/hrkq/hrentryapply/HrEntryApplyLeaveHeadAfterEditAction.do';
                let body = {
                    attrCode: 'pk_leave_type',
                    formData: {
                        model: getAllFormValue(cardCode)
                    }
                }
                hrAjax({
                    url,
                    body
                }).then(res => {
                    if (res.data.valueMap) {
                        setFormItemsValue(cardCode, res.data.valueMap)
                    }
                    if (res.data.extend) {
                        if (res.data.extend['minTime']) {
                            let minTime = res.data.extend['minTime'];
                            this.setState({
                                minTime
                            })
                            let minunit = getFormItemsValue(cardCode, 'minunit').value;
                            this.handleDateFormControl(cardCode, minTime, minunit, false);
                            this.handleRelationData(cardCode, minTime, minunit);
                        }
                    }
                })
            }
        } else {
            this.setState({
                leavecode: ''
            })
        }
    }
    /**
     * @desc:
     * @param {string} minTime 最小请假时间 1 0.5 2 1
     * @param {string} minunit 单位 1 小时 2 天
     * @return:
     */
    handleRelationData = (cardCode, minTime, minunit) => {
        const {form} = this.props;
        const {getAllFormValue, setFormItemsValue, getFormItemsValue} = form;
        let begintime = getFormItemsValue(cardCode, 'begintime').value;
        let endtime = getFormItemsValue(cardCode, 'endtime').value;
        if (!begintime || !endtime) return
        let newBegin, newEnd;
        if (minunit === '1') {
            setFormItemsValue(cardCode, {
                start_day_type: {
                    display: null,
                    value: null
                },
                end_day_type: {
                    display: null,
                    value: null
                }
            })
        } else {
            // 半天假
            if (minTime === '1') {
                let startDayType = begintime.split(' ')[1] > '12:00:00' ? '2' : '1'
                let endDayType = endtime.split(' ')[1] > '12:00:00' ? '2' : '1'
                newBegin = this.fillDateTime(begintime, startDayType);
                newEnd = this.fillDateTime(endtime, endDayType);
                setFormItemsValue(cardCode, {
                    begintime: {
                        display: newBegin,
                        value: newBegin
                    },
                    showbegindate: {
                        display: newBegin,
                        value: newBegin
                    },
                    endtime: {
                        display: newEnd,
                        value: newEnd
                    },
                    showenddate: {
                        display: newEnd,
                        value: newEnd
                    },
                    start_day_type: {
                        value: startDayType
                    },
                    end_day_type: {
                        value: endDayType
                    }
                })
            } else {
                newBegin = this.fillDateTime(begintime, '0');
                newEnd = this.fillDateTime(endtime, '0');
                setFormItemsValue(cardCode, {
                    start_day_type: {
                        display: null,
                        value: null
                    },
                    end_day_type: {
                        display: null,
                        value: null
                    },
                    begintime: {
                        display: newBegin,
                        value: newBegin
                    },
                    showbegindate: {
                        display: newBegin,
                        value: newBegin
                    },
                    endtime: {
                        display: newEnd,
                        value: newEnd
                    },
                    showenddate: {
                        display: newEnd,
                        value: newEnd
                    }
                })
            }
        }
    }
    /**
     * @desc: 哺乳假字段处理
     * @param {type}
     * @return:
     */
    handleBreastFeedType = (cardCode, enable) => {
        const {form} = this.props;
        const {setItemsVisible, setFormItemsRequired} = form;
        let option = {
            breastfeedingleaveway: enable,
            breastfeedingleaveday: enable
        }
        this.isBreastFeed = enable;
        setItemsVisible(cardCode, option)
        setFormItemsRequired(cardCode, option)
    }
    /**
     * @desc: 根据不同假别渲染不同时间控件
     * @param {type}
     * @return:
     */
    handleDateFormControl = (cardCode, minTime, minunit, leaveway) => {
        const {form} = this.props;
        const {setFormItemsRequired, setItemsVisible, setFormItemsDisabled} = form;
        let target = {
            begintime: true, // 开始时间
            endtime: true, // 结束时间
            showbegindate: true, // 开始日期
            showenddate: true, // 结束日期
            start_day_type: true, // 开始 上午下午
            end_day_type: true,   // 结束 上午下午
            breastfeedingleaveway: !!leaveway,
            breastfeedingleaveday: !!leaveway
        }
        if (minunit === '1') {
            // 小时
            target.showbegindate = false;
            target.showenddate = false;
            target.start_day_type = false;
            target.end_day_type = false;
            setItemsVisible(cardCode, target);
            setFormItemsRequired(cardCode, target);
        } else if (minunit === '2') {
            if (minTime === '1') {
                // 半天
                target.begintime = false;
                target.endtime = false;
                setItemsVisible(cardCode, target);
                setFormItemsRequired(cardCode, target);
            } else if (minTime === '2') {
                // 1天
                target.begintime = false;
                target.endtime = false;
                target.start_day_type = false;
                target.end_day_type = false;
                setItemsVisible(cardCode, target);
                setFormItemsRequired(cardCode, target);
            }
        }
    }
    /**
     * @desc: hr录入按钮事件
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
     * @desc: 取消编辑表单
     * @param {type}
     * @return:
     */
    cancleHrBill = (cardCode) => {
        const {form} = this.props;
        const {getFormStatus} = form;
        if (getFormStatus(cardCode) !== 'browse') {
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
        let begin = getFormItemsValue(formCode, 'begintime').value;
        let end = getFormItemsValue(formCode, 'endtime').value;
        // 排除哺乳假 因为哺乳假的时候，开始结束时间相同
        if (begin > end && !this.isBreastFeed) {
            toast({
                color: 'warning',
                content: this.state.lang['hrkq-0000104']  // 结束时间必须晚于开始时间！
            })
            return false
        }
        // 哺乳假单次请假不超过一年
        if (this.state.leavecode === '8') {
            let arr = begin.split(' ')
            let expectYear = arr[0].split('-')[0] - 0 + 1
            let expectEnd = arr[0].replace(/\d+\-/, expectYear + '-')
            if (end.split(' ')[0] > expectEnd) {
                console.log(end.split(' ')[0], expectEnd)
                toast({
                    color: 'warning',
                    content: this.state.lang['hrkq-0000105']  // 哺乳假日期跨度不能超过一年
                })
                return false
            }
        }
        return true
    }
    /**
     * @desc: 非哺乳假 置空 哺乳假的俩个字段
     *        breastfeedingleaveway  休假方式
     *        breastfeedingleaveday  每天休假时长
     *        用于列表处 判断是否是哺乳假的依据，因为单据中没有 leavecode字段，前端没法判断，只能这么处理
     * @param {type}
     * @return:
     */
    resetNonbreastfeedingField = () => {
        const {form: {setFormItemsValue}} = this.props;
        setFormItemsValue(config.hrCreateCard, {
            breastfeedingleaveway: {
                value: null,
                display: null
            },
            breastfeedingleaveday: {
                value: null,
                display: null
            }
        })
    }
    /**
     * @desc: 保存单据信息  非哺乳假  去掉哺乳假的默认参数
     * @param {type}
     * @return:
     */
    saveHrBillData = (formCode) => {
        const {form, editTable: {setTableData}} = this.props;
        const {getAllFormValue, getFormItemsValue} = form;
        if (this.state.leavecode !== '8') {
            this.resetNonbreastfeedingField()
        }
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
                if (res.data) {
                    toast({
                        color: 'danger',
                        content: res.data
                    })
                    return;
                }
                this.setState({
                    dist: 'list'
                })
                this.queryListAction({
                    ...this.queryParams
                }).then(({
                             success, data: {
                        [config.tableId]: {
                            pageInfo: {total = 0} = {},
                            rows = []
                        } = {}
                    } = {}
                         }) => {
                    if (success) {
                        this.onPageInfoChange({
                            total
                        });
                        setTableData(config.tableId, {rows})
                    }
                })
                toast({
                    color: 'success',
                    content: this.state.lang['hrkq-0000106']
                })
            }
        })
    }
    /**
     * @desc: 编辑HR录入的单据
     * @param {object} row 从列表点击编辑会有row参数
     * @return:
     */
    editHrBill = async (row) => {
        const {form} = this.props;
        const {setFormStatus, setFormItemsDisabled, setAllFormValue} = form;
        const cardCode = config.hrCreateCard;
        if (row && row.values) {
            this.setState({
                dist: 'create'
            })
            // 哺乳假的编辑特殊处理 没有单位 字段
            let isBreastfeeding = !!row.values['breastfeedingleaveway'].value;
            let minUnit = row.values['minunit'].value;
            let startDayType = row.values['start_day_type'].value;
            let billId = row.values['pk_leave'].value;
            let minTime = startDayType ? '1' : '2';
            let leaveCode = '';
            this.setState({
                minTime
            })
            if (isBreastfeeding) {
                leaveCode = '8'
                this.handleDateFormControl(cardCode, '2', '2', true)
                this.handleBreastFeedType(cardCode, true)
            } else {
                this.handleDateFormControl(cardCode, minTime, minUnit, false);
            }
            await this.setState({
                leaveCode,
                billId,
                needUploadFile: true
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
            pk_leave_type: true,
            begintime: false,
            endtime: false,
            showbegindate: false,
            showenddate: false,
            start_day_type: false,
            end_day_type: false
        })
        this.setHrBillButtonStatus();
    }
    /**
     * @desc: 删除HR录入的单据
     * @param {type}
     * @return:
     */
    deleteHrBill = (row) => {
        const {form: {getFormItemsValue}, editTable: {setTableData}} = this.props;
        let billType, pk;
        if (row) {
            billType = row['values']['billtype'].value
            pk = row['values']['pk_leave'].value
        } else {
            billType = getFormItemsValue(config.hrCreateCard, 'billtype').value;
            pk = getFormItemsValue(config.hrCreateCard, 'pk_leave').value
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
                        }).then(({
                                     success, data: {
                                [config.tableId]: {
                                    pageInfo: {total = 0} = {},
                                    rows = []
                                } = {}
                            } = {}
                                 }) => {
                            if (success) {
                                this.onPageInfoChange({
                                    total
                                });
                                setTableData(config.tableId, {rows})
                            }
                        })
                    }
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
            stateObj.billId = row.values['pk_leave'].value
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
     * @desc: 设置HR录入单据页面按钮的显示和隐藏
     * @param {type}
     * @return:
     */
    setHrBillButtonStatus = () => {
        const {button, form} = this.props;
        const {getFormStatus} = form;
        const {needUploadFile} = this.state;
        let status = getFormStatus(config.hrCreateCard);
        button.setButtonsVisible({
            save: status === 'edit' || status === 'add',
            cancle: status === 'edit' || status === 'add',
            edit: status === 'browse',
            delete: status === 'browse',
            file: needUploadFile
        })
        // 列表跳转到 浏览态  点击编辑时 不会切换按钮 暂时添加强制刷新
        this.forceUpdate();
    }
    /**
     * @desc: 列表的行双击事件回调
     * @param {type}
     * @return:
     */
    handleRowDoubleClick = async (row, index, props) => {
        const {form} = this.props;
        const {setAllFormValue, EmptyAllFormValue, setFormStatus} = form;
        let sources = row.values['billsource'] && row.values['billsource'].value || '0'
        let billId = row.values['pk_leave'].value;
        let dist, cardCode, uploadButtonDisabled
        // sources 0 员工申请   1 手工录入
        if (sources === '0') {
            cardCode = config.cardId;
            dist = 'detail';
            uploadButtonDisabled = true
        } else if (sources === '1') {
            cardCode = config.hrCreateCard;
            dist = 'create';
            uploadButtonDisabled = false
            let minUnit = row.values['minunit'].value;
            let startDayType = row.values['start_day_type'].value;
            let minTime = startDayType ? '1' : '2';
            this.setState({
                minTime
            })
            let leaveway = row.values.breastfeedingleaveway && row.values.breastfeedingleaveway.value
            this.handleDateFormControl(cardCode, minTime, minUnit, leaveway);
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
    /**
     * @desc: 查看销假单据详情
     * @param {type}
     * @return:
     */
    showLeaveoffInfo = (row) => {
        const {form} = this.props;
        const {EmptyAllFormValue, setFormStatus, setAllFormValue} = form;
        const cardCode = config.leaveOffCard;
        let pk_leave = row['values'] && row['values']['pk_leave'] && row['values']['pk_leave'].value || null;
        if (!pk_leave) return
        EmptyAllFormValue(cardCode)
        hrAjax({
            url: '/nccloud/hrkq/leaveoff/QueryByIdAction.do',
            body: {
                pk_leave
            }
        }).then(res => {
            if (res.success) {
                let rows = res.data && res.data['leaveoff'] && res.data['leaveoff']['leaveoff_card'] && res.data['leaveoff']['leaveoff_card']['rows'] || []
                setAllFormValue({
                    [cardCode]: {
                        rows
                    }
                })
                setFormStatus(cardCode, 'browse')
                this.setState({
                    dist: 'leaveoff'
                })
            }
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
                [config.tableId]: {
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
                    title: lang['hrkq-0000127'], // 休假统计
                    fileName: lang['hrkq-0000127'],
                    maker: lang['hrkq-0000098'],
                    date: lang['hrkq-0000099']
                }, {
                    meta: metaInfo[config['tableId']],
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
        let url = config.exportAction,
            queryKeys = ['leavebegindate', 'leaveenddate', 'leavetypename', 'deptid', 'jobId', 'query', 'leavedaymin', 'leavedaymax', 'minunit', 'approvestatus', 'isIncludeSub'],
            queryParams = {
                leavebegindate: getCurMonthStartTs(),
                leaveenddate: getCurMonthEndTs(),
                ...this.queryParams,
                ...formatQueryCondition(this.queryParams && this.queryParams.querycondition, {
                    pk_org: 'orgId',
                    pk_dept: 'deptid',
                    pk_job: 'jobId',
                    pk_leave_type: 'leavetypename',
                    begintime: 'leavebegindate',
                    endtime: 'leaveenddate',
                    leaveday: ['leavedaymin', 'leavedaymax'],
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
                <div style={{display: dist === 'list' ? '' : 'none'}}>
                    {/* header */}
                    <Header
                        {...props}
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
                            {...props}
                            lang={lang}
                            tableId={config.tableId}
                            showFileUploader={this.handleClickFileUploader}
                            cardId={config.cardId}
                            height={Math.max(document.documentElement.clientHeight - 170, 500)}
                            register={({initailMeta} = {}) => {
                                this.initailMeta = initailMeta;
                            }}
                            deleteHrBill={this.deleteHrBill}
                            editHrBill={this.editHrBill}
                            onRowDoubleClick={this.handleRowDoubleClick}
                            showLeaveoffInfo={this.showLeaveoffInfo}
                        />

                        {/* pagination */}
                        <div className="pagination" style={{margin: '10px 10px 10px'}}>
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
                <div style={{display: dist == 'detail' ? '' : 'none'}}>
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
                <div style={{display: dist == 'create' ? '' : 'none'}}>
                    <Form
                        {...props}
                        cardId={config['hrCreateCard']}
                        onButtonClick={this.handleHrBillButtonClick}
                        onAfterEvent={this.afterHrCardEdited}
                        customButton={true}
                        buttonArea='card_head'
                        title={lang['hrkq-0000116']}
                        onBack={this.cancleHrBill.bind(this, config['hrCreateCard'])}
                    />
                </div>
                <div style={{display: dist == 'leaveoff' ? '' : 'none'}}>
                    <Form
                        {...props}
                        cardId={config['leaveOffCard']}
                        title={lang['hrkq-0000112']} /* 销假单详情 */
                        onBack={this.cancleHrBill.bind(this, config['leaveOffCard'])}
                    />
                </div>

                {/* loading */}
                <NCLoading
                    container={this}
                    show={loading}>
                </NCLoading>
                {/* fileUpload */}
                {showUploader && <NCUploader
                    billId={billId}
                    disableButton={uploadButtonDisabled}
                    customize={{uploadTrpe: '0'}}
                    placement={'right'}
                    onHide={this.hideUploader} // 关闭功能
                    beforeUpload={this.beforeUpload}
                />
                }
            </div>
        );
    }
}

