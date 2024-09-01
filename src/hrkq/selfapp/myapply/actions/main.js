import {promptBox, base, toast} from 'nc-lightapp-front';

const {NCDatePicker} = base;
import {headerAction} from './headerAction'

export default class MainAction {

    constructor(comp) {
        this.comp = comp;
    }

    tabChange = (key) => {
        const {dispatch, myLeave} = this.comp.props
        let subTitle;
        switch (key) {
            case 'leave':
                subTitle = myLeave.json['6040-00008'];
                break;

            case 'overtime':
                subTitle = myLeave.json['6040-00009'];
                break;

            case 'trip':
                subTitle = myLeave.json['6040-000010'];
                break;

            case 'attendance':
                subTitle = myLeave.json['6040-000016'];
                break;
            default:
                subTitle = myLeave.json['6040-000017'];
        }
        dispatch({
            type: 'myLeave/update',
            payload: {
                activeTab: key,
                subTitle
            }
        })
    }

    editListAction = (record) => {
        const {dispatch, myLeave, form} = this.comp.props;
        let formCode = myLeave.activeTab + '_card'
        const {setFormStatus, setAllFormValue, EmptyAllFormValue, getFormItemsValue} = form
        EmptyAllFormValue(formCode)
        dispatch({
            type: 'myLeave/update',
            payload: {
                showMode: 'card',
                isEdit: true,
                approvestatus: record.values['approvestatus'] && record.values['approvestatus'].value
            }
        })
        setFormStatus(formCode, 'edit')
        setAllFormValue({
            [formCode]: {
                rows: [record]
            }
        })
    }

    updateStateCustom = (state) => {
        this.comp.props.dispatch({
            type: 'myLeave/update',
            state
        });
    }

    getClientHeight = () => {
        let {width} = document.querySelector('#app').getBoundingClientRect()
        let height = document.documentElement.clientHeight - 200;
        width = width - 256;
        this.comp.props.dispatch({
            type: 'myLeave/update',
            payload: {
                clientHeight: height,
                clientWidth: width
            }
        })
    }

    getTempalte = () => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'myLeave/languageCreateUIDOM',
            payload: {
                ...this.comp.props,
                callback: this.initailMeta
            }
        })
    }
    getLangCode = (sName) => {
        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        var oRE = new RegExp(sRE);
        if (oRE.test(document.cookie)) {
            return RegExp["$1"];
        }
        return null;
    }
    addOperateCol = (template) => {

        const {myLeave, dispatch} = this.comp.props;
        let target = ['attendance_list', 'outside_list', 'leave_list', 'overtime_list', 'trip_list'];
        let langCode = this.getLangCode('langCode');
        let oprWidth = '150px', oproffWidth = '160px'
        if (langCode === 'english') {
            oprWidth = '240px'
            oproffWidth = '250px'
        }
        let render = (text, record, index) => {
            let billtype = record.values.billtype.value
            let recall = record.values.approvestatus && (record.values.approvestatus.value - 0) === 3
            let flowHistoryFlag = record.values.billsource && record.values.billsource.value === '0' /*&& record.values.approvestatus && (record.values.approvestatus.value - 0) > -1*/
            let revoke = (record.values.billtype.value === '6QCC' || record.values.billtype.value === '6QQJ') && record.values.approvestatus && record.values.approvestatus.value === '1' && (record.values.billsource.value && record.values.billsource.value === '0') && (record.values.tripoffapprovestatus && !record.values.tripoffapprovestatus.value || record.values.leaveoffapprovestatus && !record.values.leaveoffapprovestatus.value)
            return (
                <span>
                    <a style={{cursor: 'pointer', marginRight: '10px', display: flowHistoryFlag ? '' : 'none'}}
                       onClick={this.showFlowHistory.bind(this, record, 1)}>
                        <span style={{
                            cursor: flowHistoryFlag ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000018']}</span> {/* 国际化处理： 流程历史*/}
                    </a>
                    <a style={{cursor: 'pointer', marginRight: '10px', display: recall ? '' : 'none'}}
                       onClick={this.recallBill.bind(this, record)}>
                        <span style={{
                            cursor: recall ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000021']}</span> {/* 国际化处理： 撤回*/}
                    </a>
                    <a style={{cursor: 'pointer', display: revoke ? '' : 'none'}}
                       onClick={this.linkBill.bind(this, record)}>
                        <span style={{
                            cursor: 'pointer'
                        }}>{billtype === '6QQJ' ? myLeave.json['6040-000027'] : myLeave.json['6040-000026']}</span> {/* 国际化处理： 销差销假*/}
                    </a>
                </span>
            );
        }
        let renderoff = (text, record, index) => {
            let recall = record.values.approvestatus.value === '1' && (record.values.leaveoffapprovestatus && record.values.leaveoffapprovestatus.value === '3' || record.values.tripoffapprovestatus && record.values.tripoffapprovestatus.value === '3')
            let look = record.values.approvestatus.value === '1' && (record.values.leaveoffapprovestatus && record.values.leaveoffapprovestatus.value || record.values.tripoffapprovestatus && record.values.tripoffapprovestatus.value)
            let flowHistoryFlag = (record.values.leaveoffapprovestatus && record.values.leaveoffapprovestatus.value) || (record.values.tripoffapprovestatus && record.values.tripoffapprovestatus.value)
            let revoke = record.values.approvestatus && record.values.approvestatus.value === '1'
            let billtype = record.values.billtype.value
            return (
                <span>
                    <a style={{cursor: 'pointer', marginRight: '10px', display: flowHistoryFlag ? '' : 'none'}}
                       onClick={this.showFlowHistory.bind(this, record, 2)}>
                        <span style={{
                            cursor: flowHistoryFlag ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000018']}</span> {/* 国际化处理： 流程历史*/}
                    </a>
                    <a style={{cursor: 'pointer', marginRight: '10px', display: recall ? '' : 'none'}}
                       onClick={this.recallBill.bind(this, record)}>
                        <span style={{
                            cursor: recall ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000021']}</span> {/* 国际化处理： 撤回*/}
                    </a>

                    <a style={{cursor: 'pointer', display: look ? '' : 'none'}}
                       onClick={this.onLookClick.bind(this, record)}
                    >
                        <span style={{
                            cursor: look ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000025']}</span> {/* 国际化处理： 查看*/}
                    </a>

                </span>
            );
        }
        let render1 = (text, record, index) => {
            let recall = record.values.approvestatus.value === '3'
            let flowHistoryFlag = /*record.values.approver && record.values.approver.value &&*/ record.values.approvestatus && (record.values.approvestatus.value - 0) > -1
            return (
                <span>
                    <a style={{cursor: 'pointer'}}
                       onClick={this.showFlowHistory.bind(this, record)}>
                        <span style={{
                            display: flowHistoryFlag ? '' : 'none',
                            cursor: flowHistoryFlag ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000018']}</span> {/* 国际化处理： 流程历史*/}
                    </a>
                    <a style={{cursor: 'pointer', marginRight: '10px', display: recall ? '' : 'none'}}
                       onClick={this.recallBill.bind(this, record)}>
                        <span style={{
                            cursor: recall ? 'pointer' : 'no-drop',
                        }}>{myLeave.json['6040-000021']}</span> {/* 国际化处理： 撤回*/}
                    </a>
                </span>
            );
        }
        let visibleList = []
        target.forEach(key => {
            if (template[key].areaVisible) {
                visibleList.push(key)
            }
            template[key].items.push({
                attrcode: 'operation',
                renderStatus: 'browse',
                itemtype: 'customer',
                label: myLeave.json['6040-000019'], /* 国际化处理： 操作*/
                width: oprWidth,
                visible: true,
                fixed: 'right',
                render: (key === 'attendance_list' || key === 'outside_list') ? render1 : render
            })
            if (key === 'leave_list' || key === 'trip_list') {
                template[key].items.push({
                    attrcode: 'oproff',
                    renderStatus: 'browse',
                    itemtype: 'customer',
                    label: key === 'leave_list' ? myLeave.json['6040-000029'] : myLeave.json['6040-000028'], /* 国际化处理： 操作*/
                    width: oproffWidth,
                    visible: true,
                    fixed: 'right',
                    render: renderoff
                })
            }
        })
        dispatch({
            type: 'myLeave/update',
            payload: {
                visibleList: visibleList
            }
        })
        this.tabChange(visibleList[0] && visibleList[0].split('_')[0])
    }
    initailMeta = (metas, lang, intl) => {
        let {button, template} = metas;
        const props = this.comp.props;
        const {renderItem, meta, dispatch} = props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                json: lang
            }
        })
        this.addOperateCol(template);
        this.handleMeta(template, renderItem)
        meta.setMeta(template ? template : {});
        props.button.setButtons(button);
        dispatch({
            type: 'myLeave/update',
            payload: {
                templateInited: true
            }
        })
    }

    handleMeta = (template, renderItem) => {
        const {myLeave} = this.comp.props;
        let target = ['attendance_list', 'attendance_card', 'leave_card', 'trip_card', 'leaveoff_card', 'tripoff_card', 'leave_list', 'overtime_card', 'trip_list', 'overtime_list'];
        target.forEach(key => {
            template[key].items.forEach(item => {
                if (key === 'attendance_card') {
                    if (item.attrcode === 'transtypeid') {
                        if (!item.queryCondition) {
                            item.queryCondition = {
                                GridRefActionExt: "nccloud.web.hrkq.attendance.sqlbuilder.AttendTransTypeRefSqlBuilder"
                            }
                        } else {
                            item.queryCondition = Object.assign(item.queryCondition, {
                                GridRefActionExt: "nccloud.web.hrkq.attendance.sqlbuilder.AttendTransTypeRefSqlBuilder"
                            })
                        }
                    }
                }
                if (key === 'leave_card') {
                    if (item.attrcode === 'leaveday' || item.attrcode === 'vacationquota') {
                        item.itemtype = 'input'
                    } else if (item.attrcode === 'transtypeid') {
                        if (!item.queryCondition) {
                            item.queryCondition = {
                                GridRefActionExt: "nccloud.web.hrkq.leave.sqlbuilder.LeaveTransTypeRefSqlBuilder"
                            }
                        } else {
                            item.queryCondition = Object.assign(item.queryCondition, {
                                GridRefActionExt: "nccloud.web.hrkq.leave.sqlbuilder.LeaveTransTypeRefSqlBuilder"
                            })
                        }
                    }
                }
                if (key === 'trip_card') {
                    if (item.attrcode === 'tripday') {
                        item.itemtype = 'input'
                    } else if (item.attrcode === 'transtypeid') {
                        if (!item.queryCondition) {
                            item.queryCondition = {
                                GridRefActionExt: "nccloud.web.hrkq.trip.sqlbuilder.TripTransTypeRefSqlBuilder"
                            }
                        } else {
                            item.queryCondition = Object.assign(item.queryCondition, {
                                GridRefActionExt: "nccloud.web.hrkq.trip.sqlbuilder.TripTransTypeRefSqlBuilder"
                            })
                        }
                    }
                }
                if (key === 'leaveoff_card') {
                    if (item.attrcode === 'leaveoffday' || item.attrcode === 'vacationquota' || item.attrcode === 'leaveday') {
                        item.itemtype = 'input'
                    } else if (item.attrcode === 'transtypeid') {
                        if (!item.queryCondition) {
                            item.queryCondition = {
                                GridRefActionExt: "nccloud.web.hrkq.leaveoff.sqlbuilder.LeaveOffTransTypeRefSqlBuilder"
                            }
                        } else {
                            item.queryCondition = Object.assign(item.queryCondition, {
                                GridRefActionExt: "nccloud.web.hrkq.leaveoff.sqlbuilder.LeaveOffTransTypeRefSqlBuilder"
                            })
                        }
                    }
                }
                if (key === 'tripoff_card') {
                    if (item.attrcode === 'tripoffday' || item.attrcode === 'tripday') {
                        item.itemtype = 'input'
                    } else if (item.attrcode === 'transtypeid') {
                        if (!item.queryCondition) {
                            item.queryCondition = {
                                GridRefActionExt: "nccloud.web.hrkq.tripoff.sqlbuilder.TripOffTransTypeRefSqlBuilder"
                            }
                        } else {
                            item.queryCondition = Object.assign(item.queryCondition, {
                                GridRefActionExt: "nccloud.web.hrkq.tripoff.sqlbuilder.TripOffTransTypeRefSqlBuilder"
                            })
                        }
                    }
                }
                if (key === 'overtime_card') {
                    if (item.attrcode === 'otapplylength' || item.attrcode === 'actuallen') {
                        item.itemtype = 'input'
                    }

                    if (item.attrcode === 'transtypeid') {
                        if (!item.queryCondition) {
                            item.queryCondition = {
                                GridRefActionExt: "nccloud.web.hrkq.overtime.sqlbuilder.OverTimeTransTypeRefSqlBuilder"
                            }
                        } else {
                            item.queryCondition = Object.assign(item.queryCondition, {
                                GridRefActionExt: "nccloud.web.hrkq.overtime.sqlbuilder.OverTimeTransTypeRefSqlBuilder"
                            })
                        }
                    }
                }
                if (key === 'attendance_list') {
                    if (item.attrcode === 'fill_time') {
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            return (
                                <span style={{textAlign: 'right'}}>
                                    {record && record.values['fill_date'].value ? record.values['fill_date'].value.split(' ')[1] : ''}
                                </span>
                            );
                        };
                    }
                }
                if (key === 'leave_list') {
                    if (item.attrcode === 'isrevoked') {
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            return (
                                <span style={{textAlign: 'right'}}>
                                    {(record.values && record.values['isrevoked'].value) ? myLeave.json['6040-000034'] : myLeave.json['6040-000035']}
                                </span>
                            );
                        };
                    }
                    if (item.attrcode === 'begintime' || item.attrcode === 'endtime') {
                        item.renderStatus = 'browse';
                        item.render = (text, record, index) => {
                            return (
                                <span style={{textAlign: 'right'}}>

                                    {this.formatDisplayDate(record, item.attrcode)}
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
                                    {record.values.breastfeedingleaveway.value ? myLeave.json['6040-000033'] : ""}{(record.values && record.values['leaveday'].value) + (record.values.breastfeedingleaveway.value ? myLeave.json['6040-000014'] : record.values && record.values['minunit'].display)}
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
                                        {(record.values[item.attrcode].value - 0).toFixed(2) + myLeave.json['6040-000014']}
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
                                        {record.values[item.attrcode].value ? myLeave.json['6040-000034'] : myLeave.json['6040-000035']}
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
        let isHalfDate = !!record.values['start_day_type'].value;
        let values = record.values;
        if (values.breastfeedingleaveday && values.breastfeedingleaveday.value && values.breastfeedingleaveway && values.breastfeedingleaveway.value) {
            // 如果是哺乳假 则 返回 日期 不返回小时 分钟
            return record.values[attrcode].value.slice(0, -8);
        }

        if (isHour) {
            return record.values[attrcode].value.slice(0, -3);
        } else {
            attrcode = attrcode === 'begintime' ? 'showbegindate' : 'showenddate';
            if (isHalfDate) {
                return record.values[attrcode].value.replace(/\s([\d\:]+)/, (a, b) => {
                    return attrcode === 'showbegindate' ? record.values['start_day_type'].display : record.values['end_day_type'].display;
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
    showFlowHistory = (record, type) => {
        const {dispatch, myLeave} = this.comp.props;
        let flowHistoryFlag = (record.values.leaveoffapprovestatus && record.values.leaveoffapprovestatus.value) || (record.values.tripoffapprovestatus && record.values.tripoffapprovestatus.value)
        let billId
        let billtype
        if (flowHistoryFlag) {
            if (myLeave.activeTab === 'leave') {
                if (type == 1) {
                    billtype = '6QQJ'
                    billId = record.values['pk_leave'].value;
                } else if (type == 2) {
                    billtype = '6QXJ'
                    billId = record.values['pk_leaveoff'].value;
                }
            } else if (myLeave.activeTab === 'trip') {
                if (type == 1) {
                    billtype = '6QCC'
                    billId = record.values['pk_trip'].value;
                } else if (type == 2) {
                    billtype = "6QXC"
                    billId = record.values['pk_tripoff'].value;
                }
            } else {
                billtype = record.values['billtype'].value
                billId = record.values['pk_' + myLeave.activeTab].value;
            }
        } else {
            billtype = record.values['billtype'].value
            billId = record.values['pk_' + myLeave.activeTab].value;
        }
        billtype = (record.values['transtype'] && record.values['transtype'].value) || billtype
        dispatch({
            type: 'myLeave/update',
            payload: {
                showApproveDetail: true,
                billId,
                billtype
            }
        })
    }
    /**
     * @desc: 跳转销差销假操作
     * @param {type}
     * @return:
     *
     */
    linkBill = (record) => {
        const formCode = record.values.billtype.value === '6QQJ' ? 'leaveoff_card' : 'tripoff_card'
        const activeTab = record.values.billtype.value === '6QQJ' ? 'leaveoff' : 'tripoff'
        const {dispatch, myLeave, form, renderItem} = this.comp.props
        const {
            setFormStatus,
            setAllFormValue,
            EmptyAllFormValue,
            getFormItemsValue,
            setItemsVisible,
            setFormItemsDisabled,
            setFormItemsRequired
        } = form
        EmptyAllFormValue(formCode)
        dispatch({
            type: 'myLeave/AddAction',
            payload: {
                key: activeTab,
                operat: 0,
                pk_other: activeTab === 'leaveoff' ? record.values.pk_leave.value : record.values.pk_trip.value
            }
        }).then(res => {
            this.setRecokeValue(this.comp.props, res.data[formCode], record, 'add')
        })

    }

    setRecokeValue(props, template, record, status) {
        const {dispatch, form, myLeave, renderItem} = props
        const formCode = record.values.billtype.value === '6QQJ' ? 'leaveoff_card' : 'tripoff_card'
        const activeTab = record.values.billtype.value === '6QQJ' ? 'leaveoff' : 'tripoff'
        const titleName = record.values.billtype.value === '6QQJ' ? myLeave.json['6040-000030'] : myLeave.json['6040-000031']
        let minTime = '1'
        let feedStatus = false
        let cardDefaultVisiable = {}
        let cardDefaultDisabled = {}
        const {
            setFormStatus,
            setAllFormValue,
            EmptyAllFormValue,
            getFormItemsValue,
            setItemsVisible,
            setFormItemsDisabled,
            setFormItemsRequired
        } = form
        if (formCode === 'leaveoff_card') {
            const breastfeedingleaveway = record.values.breastfeedingleaveway.value
            const halfDay = record.values.start_day_type.value
            const minunit = record.values.minunit.value
            let dr_flag = template.rows[0].values.dr_flag.value
            //小时显示组件
            cardDefaultVisiable = {
                leaveshowbegindate: false, // 请假开始日期
                leaveshowenddate: false, // 请假结束日期
                leavebegintime: true, // 请假开始时间
                leaveendtime: true, // 请假结束时间
                leave_start_day_type: false, // 请假上午标记
                leave_end_day_type: false, // 请假上午标记
                leaveoff_start_day_type: false, // 结束日期
                leaveoff_end_day_type: false, // 结束日期
                vacationquota: false,// 休假额度   默认不显示
                leaveoffshowbegindate: false, // 开始日期
                leaveoffshowenddate: false, // 结束日期
                leaveoffbegintime: true, // 开始时间
                leaveoffendtime: true, // 结束时间
                leaveoffday: true, // 实际休假时长
                breastfeedingleaveday: false, // 每天休假时长
                breastfeedingleaveway: false, // 休假方式
            }
            // 天显示组件
            if (minunit === '2') {
                minTime = '2'
                cardDefaultVisiable.leaveshowbegindate = true // 请假开始日期
                cardDefaultVisiable.leaveshowenddate = true // 请假结束日期
                cardDefaultVisiable.leavebegintime = false // 请假开始时间
                cardDefaultVisiable.leaveendtime = false // 请假结束时间
                cardDefaultVisiable.vacationquota = false // 休假额度   默认不显示
                cardDefaultVisiable.leaveoffshowbegindate = true // 开始日期
                cardDefaultVisiable.leaveoffshowenddate = true // 结束日期
                cardDefaultVisiable.leaveoffbegintime = false // 开始时间
                cardDefaultVisiable.leaveoffendtime = false // 结束时间
            }
            // 哺乳假显示
            if (breastfeedingleaveway) {
                feedStatus = true
                minTime = '2'
                cardDefaultVisiable.leaveshowbegindate = false // 请假开始日期
                cardDefaultVisiable.leaveshowenddate = false // 请假结束日期
                cardDefaultVisiable.leavebegintime = true // 请假开始时间
                cardDefaultVisiable.leaveendtime = true // 请假结束时间
                cardDefaultVisiable.vacationquota = false // 休假额度   默认不显示
                cardDefaultVisiable.leaveoffshowbegindate = false // 开始日期
                cardDefaultVisiable.leaveoffshowenddate = false // 结束日期
                cardDefaultVisiable.leaveoffbegintime = true // 开始时间
                cardDefaultVisiable.leaveoffendtime = true // 结束时间
                cardDefaultVisiable.breastfeedingleaveday = true // 每天休假时长
                cardDefaultVisiable.breastfeedingleaveway = true // 休假方式
                cardDefaultVisiable.leaveoffday = false // 实际休假时长
            }
            // 半天假显示
            if (halfDay && !breastfeedingleaveway) {
                minTime = '1'
                cardDefaultVisiable.leave_start_day_type = true // 请假上午标记
                cardDefaultVisiable.leave_end_day_type = true // 请假上午标记
                cardDefaultVisiable.leaveoff_start_day_type = true // 销假上午
                cardDefaultVisiable.leaveoff_end_day_type = true // 销假下午
            }
            // 设置半天假
            if (dr_flag === '1') {
                cardDefaultVisiable.leaveoffshowbegindate = false // 开始日期
                cardDefaultVisiable.leaveoffshowenddate = false // 结束日期
                cardDefaultVisiable.leaveoffbegintime = false // 开始时间
                cardDefaultVisiable.leaveoffendtime = false // 结束时间
                cardDefaultVisiable.leaveoffday = false // 结束时间
            }
            template.rows[0].values.leaveday.display = `${template.rows[0].values.leaveday.value}${template.rows[0].values.minunit.value === "1" ? myLeave.json['6040-000014'] : myLeave.json['6040-000015']}`
            template.rows[0].values.leaveoffday.display = template.rows[0].values.leaveoffday.value ? `${template.rows[0].values.leaveoffday.value}${template.rows[0].values.minunit.value === "1" ? myLeave.json['6040-000014'] : myLeave.json['6040-000015']}` : null
        } else if (formCode === 'tripoff_card') {
            cardDefaultDisabled = {
                tripbegintime: true, // 开始日期
                tripendtime: true // 结束日期
            }
            let dr_flag = template.rows[0].values.dr_flag.value
            // 出差时间有变化 显示 开始、结束日期 和 销差天数
            cardDefaultVisiable.tripoffbegintime = dr_flag !== '1' // 开始日期
            cardDefaultVisiable.tripoffendtime = dr_flag !== '1' // 结束日期
            cardDefaultVisiable.tripoffday = dr_flag !== '1' // 结束时间

            template.rows[0].values.tripday.display = `${template.rows[0].values.tripday.value}${template.rows[0].values.minunit.value === "1" ? myLeave.json['6040-000014'] : myLeave.json['6040-000015']}`
            template.rows[0].values.tripoffday.display = template.rows[0].values.tripoffday.value ? `${template.rows[0].values.tripoffday.value}${template.rows[0].values.minunit.value === "1" ? myLeave.json['6040-000014'] : myLeave.json['6040-000015']}` : null
        }
        setItemsVisible(formCode, cardDefaultVisiable);
        dispatch({
            type: 'myLeave/update',
            payload: {
                feedStatus,
                showMode: 'card',
                isEdit: status === 'add',
                headerTitle: titleName
            }
        })
        setAllFormValue({[formCode]: template});
        let billId = getFormItemsValue(formCode, 'pk_' + activeTab).value;
        let approvestatus = getFormItemsValue(formCode, 'approvestatus').value;
        dispatch({
            type: 'myLeave/update',
            payload: {
                billId,
                minTime,
                activeTab: activeTab,
                approvestatus
            }
        })
        cardDefaultVisiable = null
        cardDefaultDisabled = null
        setFormStatus(formCode, status)
    }

    setDataType(props, minunit, minTime, formId) {
        let meta = props.meta.getMeta()
        let template = meta[formId]
        let templateItems = template.items || []
        let itemType = minunit === '2' ? 'datepicker' : 'datetimepicker'
        let attrcodes = ['leaveoffbegintime', 'leaveoffendtime']
        templateItems.forEach(item => {
            if (attrcodes.includes(item.attrcode)) {
                item.itemtype = itemType
            }
        })
        props.meta.setMeta(meta, () => {
            props.form.updateForm(formId)
        })
    }

    /**
     * @desc: record(行数据) ，index(当前index) props, e (事件对象)
     * @param {type}
     * @return:
     */
    onLookClick = (record) => {
        const {dispatch, myLeave, form, renderItem, button} = this.comp.props
        let formCode = myLeave.activeTab + 'off' + '_card';
        const activeTab = record.values.billtype.value === '6QQJ' ? 'leaveoff' : 'tripoff'
        const {
            setFormStatus,
            setAllFormValue,
            EmptyAllFormValue,
            getFormItemsValue,
            setItemsVisible,
            setFormItemsDisabled,
            setFormItemsRequired
        } = form
        EmptyAllFormValue(formCode)
        dispatch({
            type: 'myLeave/queryByIdAction',
            payload: {
                key: activeTab,
                pk: record.values['pk_' + myLeave.activeTab].value
            }
        }).then(res => {
            this.setRecokeValue(this.comp.props, res.data[myLeave.activeTab + 'off'][formCode], record, 'browse')
        })
    }
    /**
     * @desc: 单据撤回操作
     * @param {type}
     * @return:
     */
    recallBill = (record) => {
        const {dispatch, myLeave, editTable} = this.comp.props;
        let pk = record.values['pk_' + myLeave.activeTab].value;
        let tableCode = myLeave.activeTab + '_list';
        let activeTab = myLeave.activeTab
        let status = record.values.approvestatus.value;
        let revokestatus = record.values.approvestatus.value === '1' && (record.values.tripoffapprovestatus && record.values.tripoffapprovestatus.value || record.values.leaveoffapprovestatus && record.values.leaveoffapprovestatus.value)
        if (status === '1' && revokestatus === '3') {
            pk = record.values['pk_' + myLeave.activeTab + 'off'].value;
            activeTab = myLeave.activeTab + 'off'
        }
        promptBox({
            color: "warning",
            title: myLeave.json['6040-00005'], /* 国际化处理： 提示*/
            content: myLeave.json['6040-000023'], /* 国际化处理： 你确定要撤回该单据吗？*/
            beSureBtnClick: () => {
                dispatch({
                    type: 'myLeave/recallAction',
                    payload: {
                        key: activeTab,
                        pk
                    }
                }).then(res => {
                    if (res.success) {
                        toast({
                            color: 'success',
                            content: myLeave.json['6040-000024']
                        });
                        dispatch({
                            type: 'myLeave/queryListAction',
                            payload: {
                                key: myLeave.activeTab,
                                beginDate: myLeave.beginValue,
                                endDate: myLeave.endValue
                            }
                        }).then(res => {
                            if (res.success) {
                                if (res.data) {
                                    /*if (tableCode === 'attendance_list') {
                                        res.data[tableCode].rows && res.data[tableCode].rows.forEach(row => {
                                            row.values['fill_datetime'] = row.values['fill_date'];
                                            row.values['fill_time'].value = row.values['fill_date'].value.split(' ')[1];
                                        })
                                    }*/
                                    editTable.setTableData(tableCode, res.data[tableCode])
                                    dispatch({
                                        type: 'myLeave/update',
                                        payload: {
                                            [myLeave.activeTab + 'PageInfo']: res.data[tableCode].pageInfo
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    }
    closeApproveDetailDialog = () => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                showApproveDetail: false
            }
        })
    }
    handlePageIndexChange = (pageIndex) => {
        const {dispatch, myLeave} = this.comp.props
        let pageInfo = myLeave.activeTab + 'PageInfo'
        dispatch({
            type: 'myLeave/update',
            payload: {
                [pageInfo]: Object.assign({}, myLeave[pageInfo], {
                    pageIndex
                })
            }
        })
        this.queryListAction()
    }
    didMount = () => {
        if (window.location.href.match(/(localhost|127\.0\.0\.1)/)) window.location.hash = `#ifr?page=2019916105952100`;
        this.getClientHeight()
        this.getTempalte()
    }
}