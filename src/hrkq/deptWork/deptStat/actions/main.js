import emitter from '../actions/emitterAction';
import formDownLoad from "../../../public/download";
import {formatValueByRow} from "../../../statistics/common/utils";
import { toast } from 'nc-lightapp-front';

export default class MainAction {

    constructor (comp) {
        this.comp = comp;
    }

    tabChange = (key) => {
        const {dispatch, editTable, deptStat} = this.comp.props
        let subTitle;
        switch (key) {
            case 'leave':
                subTitle = deptStat.lang['hrkq-0000121'];  // 员工休假
                break;

            case 'overtime':
                subTitle = deptStat.lang['hrkq-0000122']; // 员工加班
                break;

            case 'trip':
                subTitle = deptStat.lang['hrkq-0000123']; // 员工出差
                break;

            case 'attendance':
                subTitle = '';
                break;
            default:
                subTitle = '';
        }
        dispatch({
            type: 'deptStat/update',
            payload: {
                activeTab: key,
                subTitle
            }
        })
    }

    editListAction = (record) => {
        const {dispatch, deptStat, form} = this.comp.props;
        let formCode = deptStat.activeTab + '_card'
        const {setFormStatus, setAllFormValue, EmptyAllFormValue} = form
        EmptyAllFormValue(formCode)
        dispatch({
            type: 'deptStat/update',
            payload: {
                showMode: 'card'
            }
        })
        setAllFormValue({
            [formCode]: {
                rows: [record]
            }
        })
    }

    getClientHeight = () => {
        let {width} = document.querySelector('#app').getBoundingClientRect()
        let height = document.documentElement.clientHeight - 240
        width = width - 256
        this.comp.props.dispatch({
            type: 'deptStat/update',
            payload: {
                clientHeight: height,
                clientWidth: width
            }
        })
    }

    getTempalte = () => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'deptStat/languageCreateUIDOM',
            payload: {
                ...this.comp.props,
                callback: this.initailMeta
            }
        })
    }
    addOperateCol = (template, lang) => {
        let target = ['leave_list', 'trip_list', 'overtime_list'];
        let render = (text, record, index) => {
            let billSource = record['values'] && record['values']['billsource'] && record['values']['billsource']['value'];
            let flowHistoryFlag = record.values.approvestatus && (record.values.approvestatus.value - 0) > -1
            if(billSource === '0'){
                return (
                    <span>
                    <a style={{cursor: 'pointer', marginLeft: '20px'}}
                       onClick={this.showFlowHistory.bind(this, record)}>
                        <span style={{
                            display: flowHistoryFlag ? '' : 'none',
                            cursor: flowHistoryFlag ? 'pointer' : 'no-drop',
                        }}>{lang['hrkq-000006']}</span> {/* 国际化处理： 流程历史*/}
                    </a>
                </span>
                );
            }else{
                return ''
            }
        }
        target.forEach(key => {
            template[key].items.push({
                attrcode: 'opr',
                renderStatus: 'browse',
                itemtype: 'customer',
                label: lang['hrkq-000005'], /* 国际化处理： 操作*/
                width: '100px',
                visible: true,
                fixed: 'right',
                render
            })
        })
    }
    initailMeta = (metas, lang, intl) => {
        let {template} = metas;
        const props = this.comp.props;
        const {meta, dispatch} = props;
        let tabs = [ 'leave', 'overtime', 'trip']
        tabs = tabs.filter(tab => template[tab + '_list'] && template[tab + '_list'].areaVisible);
        tabs = tabs.concat('day', 'month')
        this.addOperateCol(template, lang);
        this.handleMeta(template, lang);

        meta.setMeta(template ? template : {});
        dispatch({
            type: 'deptStat/update',
            payload: {
                lang: lang,
                tabs: tabs
            }
        })
    }

    handleMeta = (template, lang) => {
        let target = ['leave_card', 'trip_card', 'leave_list', 'overtime_card', 'trip_list', 'overtime_list'];
        target.forEach(key => {
            template[key].items.forEach(item => {
                if (key === 'leave_card') {
                    if (item.attrcode === 'leaveday' || item.attrcode === 'begintime' || item.attrcode === 'endtime') {
                        item.itemtype = 'input'
                    }
                }
                if (key === 'trip_card' && item.attrcode === 'tripday') {
                    item.itemtype = 'input'
                }
                if (key === 'overtime_card' && (item.attrcode === 'otapplylength' || item.attrcode === 'actuallen')) {
                    item.itemtype = 'input'
                }
                if (key === 'leave_list') {
                    if (item.attrcode === 'isrevoked') {
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            return (
                                <span style={{textAlign: 'right'}}>
                                    {(record.values && record.values['isrevoked'].value) ? lang['hrkq-0000082'] : lang['hrkq-0000083']}
                                </span>
                            );
                        };
                    }
                    if(item.attrcode === 'begintime' || item.attrcode === 'endtime'){
                        item.renderStatus = 'browse';
                        item.render = (text, row, index) => {
                            return (
                                <span style={{ textAlign: 'right' }} class="dddd">
                                        {formatValueByRow(row, item.attrcode, lang)}
                                    </span>
                            );
                        };
                    }
                    if (item.attrcode === 'leaveday') {
                        item.itemtype = 'input'
                        item.renderStatus = 'browse'
                        item.render = (text, record, index) => {
                            return (
                                <span style={{textAlign: 'right'}}>
                                      {record.values && record.values['breastfeedingleaveway'].value ? `每天${record.values['leaveday'].value}小时` : ""}{record.values && record.values['breastfeedingleaveway'].value ? "" : (record.values && record.values['leaveday'].value) + (record.values && record.values['minunit'].display)}
                                </span>
                            );
                        };
                    }
                }
                if (key === 'trip_list') {
                    if (item.attrcode === 'tripday') {
                        item.itemtype = 'input';
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            return (
                                <span>
                                    {(record.values && record.values['tripday'].value) + (record.values && record.values['minunit'].display)}
                                </span>
                            );
                        };
                    }
                    if (item.attrcode === 'tripbegintime' || item.attrcode === 'tripendtime') {
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            return (
                                <span style={{textAlign: 'right'}}>
                                    {record.values && record.values[item.attrcode].value.slice(0, -3)}
                                </span>
                            );
                        };
                    }
                }
                if (key === 'overtime_list') {
                    if (item.attrcode === 'otapplylength' || item.attrcode === 'actuallen') {
                        item.itemtype = 'input';
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            if (record.values && record.values[item.attrcode].value) {
                                return (
                                    <span>
                                        {record.values[item.attrcode].value + lang['hrkq-0000064']}
                                    </span>
                                );
                            } else {
                                return null
                            }
                        };
                    }
                    if (item.attrcode === 'isallnight') {
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            if (record.values && record.values[item.attrcode]) {
                                return (
                                    <span>
                                    {/* 是 / 否 */}
                                        {record.values[item.attrcode].value ? lang['hrkq-0000082'] : lang['hrkq-0000083']}
                                </span>
                                );
                            } else {
                                return null
                            }
                        };
                    }
                }
            })
        })
    }
    /**
     * @desc: 根据休假类型的单位和最小请假时间 格式化请假时间
     * @param {type}
     * @return: 最终要显示的日期
     */
    formatDisplayDate = (record, attrcode) => {
        if (!record || !record.values || !record.values[attrcode].value) return '';
        let isHour = record.values['minunit'].value === '1';
        let isHalfDate = !!record.values['start_day_type'].value
        if (isHour) {
            return record.values[attrcode].value.slice(0, -3);
        } else {
            if (isHalfDate) {
                return record.values[attrcode].value.replace(/\s(\d|:)+/, (a, b) => {
                    return attrcode === 'begintime' ? record.values['start_day_type'].display : record.values['end_day_type'].display;
                })
            } else {
                return record.values[attrcode].value.slice(0, -8);
            }
        }
    }
    /**
     * @desc:
     * @param {type}
     * @return:
     */
    showFlowHistory = (record) => {
        const {dispatch, deptStat} = this.comp.props;
        let billId = record.values['pk_' + deptStat.activeTab].value;
        let billtype = record.values['billtype'].value;
        dispatch({
            type: 'deptStat/update',
            payload: {
                showApproveDetail: true,
                billId,
                billtype
            }
        })
    }
    closeApproveDetailDialog = () => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'deptStat/update',
            payload: {
                showApproveDetail: false
            }
        })
    }
    getDeptData = () => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'deptStat/queryDeptDataAction',
            payload: {}
        }).then(res => {
            if (res.success) {
                dispatch({
                    type: 'deptStat/update',
                    payload: {
                        defaultDept: res.data.length && res.data[0].id || '',
                        deptOptions: res.data,
                        deptAvailable: true
                    }
                })
            }
        })
    }
    /**
     * @desc: 部门变化后
     * @param {type}
     * @return:
     */
    onDeptChange = (id) => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'deptStat/update',
            payload: {
                defaultDept: id
            }
        })
    }
    queryList = ({search, beginDate, endDate, monthDate, jobId, isIncludeSub, isResearch}) => {
        const {dispatch, deptStat, editTable} = this.comp.props;
        let {defaultDept} = deptStat;
        if (beginDate && endDate) {
            let beginTime = new Date(beginDate).setHours(0, 0, 0, 0)
            let endTime = new Date(endDate).setHours(0, 0, 0, 0)
            let flag = beginTime > endTime
            if (flag) {
                toast({
                    color: 'danger',
                    content: deptStat.lang['hrkq-0000104']
                });
                return
            }
        }
        if(isResearch){
            let pageInfoKey = deptStat.activeTab + 'PageInfo';
            dispatch({
                type: 'deptStat/update',
                payload: {
                    [pageInfoKey]: Object.assign({}, deptStat[pageInfoKey], {
                        pageIndex: 1
                    })
                }
            })
        }
        if (deptStat.activeTab === 'day') {
            beginDate = new Date(beginDate).getTime() + '';
            endDate = new Date(endDate).getTime() + '';
            dispatch({
                type: 'deptStat/queryDayListAction',
                payload: {
                    key: deptStat.activeTab,
                    search,
                    beginDate,
                    endDate,
                    deptid: defaultDept,
                    jobId,
                    isIncludeSub
                }
            })
        } else if (deptStat.activeTab === 'month') {
            let date = monthDate.split('-');
            dispatch({
                type: 'deptStat/queryMonthListAction',
                payload: {
                    key: deptStat.activeTab,
                    search,
                    year: date[0],
                    month: date[1],
                    deptid: deptStat.defaultDept,
                    jobId,
                    isIncludeSub
                }
            })
        } else {
            dispatch({
                type: 'deptStat/queryListAction',
                payload: {
                    key: deptStat.activeTab,
                    search,
                    beginDate,
                    endDate,
                    deptid: defaultDept,
                    jobId,
                    isIncludeSub
                }
            }).then(res => {
                if (res.success) {
                    let tableCode = deptStat.activeTab + '_list';
                    let pageInfoKey = deptStat.activeTab + 'PageInfo';
                    let pageInfo = Object.assign({}, deptStat[pageInfoKey])
                    if (res.data) {
                        editTable.setTableData(tableCode, res.data[tableCode]);
                        pageInfo = Object.assign({}, pageInfo, res.data[tableCode].pageInfo)
                    } else {
                        pageInfo = Object.assign({}, pageInfo, {total: null})
                        editTable.setTableData(tableCode, {rows: []});
                    }
                    dispatch({
                        type: 'deptStat/update',
                        payload: {
                            [pageInfoKey]: pageInfo
                        }
                    })
                }
            })
        }
    }
    queryMonthList = () => {
        const {dispatch, deptStat} = this.comp.props;
        let {defaultDept} = deptStat;
        let year = new Date().getFullYear() + '';
        let month = new Date().getMonth() + 1 + '';
        dispatch({
            type: 'deptStat/queryMonthListAction',
            payload: {
                key: deptStat.activeTab,
                search: '',
                year,
                month,
                deptid: defaultDept
            }
        })
    }
    queryDayList = () => {
        const {dispatch, deptStat, editTable} = this.comp.props;
        let {defaultDept, beginDate, endDate} = deptStat;
        beginDate = new Date(beginDate).getTime() + '';
        endDate = new Date(endDate).getTime() + '';
        dispatch({
            type: 'deptStat/queryDayListAction',
            payload: {
                key: deptStat.activeTab,
                search: '',
                beginDate,
                endDate,
                deptid: defaultDept
            }
        })
    }
    /**
     * @desc: 月报导出数据
     * @param {type}
     * @return:
     */
    exportMonthToExcel = (searchVal, monthDate, jobId) => {
        const {deptStat} = this.comp.props;
        let {defaultDept} = deptStat;
        let Date = monthDate.split('-')
        const url = `/ncchr/attendqueryRpt/exportAttendMonthRptdata`

        formDownLoad({
            url,
            body: {
                year: Date[0],
                month: Date[1],
                deptid: defaultDept,
                isIncludeSub: true,
                staffname: searchVal,
                jobId
            },
            method: 'get',
            enctype: 1
        })
    }
    /**
     * @desc: 日报导出数据
     * @param {type}
     * @return:
     */
    exportDayToExcel = (searchVal, beginDate, endDate, jobId) => {
        const {deptStat} = this.comp.props;
        let {defaultDept} = deptStat;
        beginDate = new Date(beginDate).getTime()
        endDate = new Date(endDate).getTime()
        const url = `/ncchr/attendqueryRpt/exportAttendRptdata`
        formDownLoad({
            url,
            body: {
                beginDate,
                endDate,
                deptid: defaultDept,
                isIncludeSub: true,
                staffname: searchVal,
                jobId
            },
            method: 'get',
            enctype: 1
        })
    }
    handlePageIndexChange = (pageIndex, emitType) => {
        const {dispatch, deptStat} = this.comp.props
        let pageInfo = deptStat.activeTab + 'PageInfo'
        dispatch({
            type: 'deptStat/update',
            payload: {
                [pageInfo]: Object.assign({}, deptStat[pageInfo], {
                    pageIndex: pageIndex + ''
                })
            }
        })
        emitter.emit('searchData:' + emitType)
        // if (deptStat.activeTab === 'day') {
        //     this.queryDayList()
        // } else {
        //     this.queryMonthList()
        // }
    }
    handlePageSizeChange = (pageSize, emitType) => {
        const {dispatch, deptStat} = this.comp.props
        let pageInfo = deptStat.activeTab + 'PageInfo'
        dispatch({
            type: 'deptStat/update',
            payload: {
                [pageInfo]: Object.assign({}, deptStat[pageInfo], {
                    pageSize: pageSize + ''
                })
            }
        })
        emitter.emit('searchData:' + emitType)
        // if (deptStat.activeTab === 'day') {
        //     this.queryDayList()
        // } else {
        //     this.queryMonthList()
        // }
    }
    didMount = () => {
        if (window.location.href.match(/(localhost|127\.0\.0\.1)/)) window.location.hash = `#ifr?page=20191205151400`;
        this.getClientHeight();
        this.getTempalte();
        this.getDeptData()
    }
}