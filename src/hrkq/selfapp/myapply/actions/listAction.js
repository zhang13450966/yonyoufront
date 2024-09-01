import { base, toast } from 'nc-lightapp-front';
const { NCDatePicker } = base;
export default class ListAction {
    constructor(comp) {
        this.comp = comp;
    }
    onBtnOperation = () => {

    }

    handlePageIndexChange = (pageIndex) => {
        const { dispatch, myLeave } = this.comp.props
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

    handlePageSizeChange = (pageSize) => {
        const { dispatch, myLeave } = this.comp.props
        let pageInfo = myLeave.activeTab + 'PageInfo'
        dispatch({
            type: 'myLeave/update',
            payload: {
                [pageInfo]: Object.assign({}, myLeave[pageInfo], {
                    pageSize
                })
            }
        })
        this.queryListAction()
    }

    queryListAction = () => {
        const { dispatch, myLeave, editTable } = this.comp.props;
        const { beginValue, endValue } = myLeave;
        let tableCode = myLeave.activeTab + '_list';
        dispatch({
            type: 'myLeave/queryListAction',
            payload: {
                key: myLeave.activeTab,
                beginDate: beginValue,
                endDate: endValue
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
                    editTable.setTableData(tableCode, res.data[tableCode]);
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
    /**
     * @desc: record(行数据) ，index(当前index) props, e (事件对象)
     * @param {type}
     * @return:
     */
    onRowDoubleClick = (record, index, props, eve) => {
        console.info('object');
        const { dispatch, myLeave, form, renderItem } = this.comp.props;
        let minTime = '';
        let formCode = myLeave.activeTab + '_card';
        const { setFormStatus, setAllFormValue, setItemsVisible, EmptyAllFormValue, setFormItemsValue } = form;
        EmptyAllFormValue(formCode);
        setFormStatus(formCode, 'browse');
        setAllFormValue({
            [formCode]: {
                rows: [record]
            }
        })
        if (formCode === 'leave_card' || formCode === 'trip_card') {
            let typeKey = formCode === 'leave_card' ? 'pk_leave_type' : 'triptypeid';
            let dayKey = formCode === 'leave_card' ? 'leaveday' : 'tripday';
            let minunit = record.values.minunit.value;
            setFormItemsValue(formCode, {[dayKey]: {display: record.values[dayKey].value + record.values['minunit'].display, value: record.values[dayKey].value}});
            if (formCode === 'leave_card') {

                let leaveway = record.values.breastfeedingleaveway&&record.values.breastfeedingleaveway.value
                // 判断是否为半天假
                let start_day_type = record.values.start_day_type&&record.values.start_day_type.value;
                /*renderItem('form', formCode, 'begintime', (
                    <NCDatePicker
                        format={'YYYY-MM-DD HH:mm:ss'}
                        showTime={true}
                        onBlur={this.handleLeaveDate.bind(this, formCode, 'begintime')}
                    />
                ))
                renderItem('form', formCode, 'endtime', (
                    <NCDatePicker
                        format={'YYYY-MM-DD HH:mm:ss'}
                        showTime={true}
                        onBlur={this.handleLeaveDate.bind(this, formCode, 'endtime')}
                    />
                ))*/
                if (leaveway) {
                    setItemsVisible(formCode, {'breastfeedingleaveway': true,'breastfeedingleaveday': true,'leaveday':false, endtime: false, begin:false, showbegindate: true, showenddate: true})
                }
                dispatch({
                    type: 'myLeave/update',
                    payload: {
                        feedStatus: !!leaveway
                    }
                })
                minTime = start_day_type ? '1' : '2'
                this.initCardMeta(start_day_type, minunit, formCode, !!leaveway, record);
                this.initLeaveData();
            } else  {
                /*renderItem('form', formCode, 'tripbegintime', (
                    <NCDatePicker
                        format={'YYYY-MM-DD HH:mm:ss'}
                        showTime={true}
                        onSelect={this.handleTripDate.bind(this, formCode, 'tripbegintime')}
                    />
                ))
                renderItem('form', formCode, 'tripendtime', (
                    <NCDatePicker
                        format={'YYYY-MM-DD HH:mm:ss'}
                        showTime={true}
                        onSelect={this.handleTripDate.bind(this, formCode, 'tripendtime')}
                    />
                ))*/
            }

        }
        if (formCode === 'overtime_card') {
            setFormItemsValue(formCode, {
                otapplylength: {
                    display: (record.values['otapplylength'].value - 0).toFixed(2) + myLeave.json['6040-000014'] ,
                    value: record.values['otapplylength'].value
                }
            });
            this.isAllNight(record.values['overtimebegintime'].value, record.values['overtimeendtime'].value)
            /*renderItem('form', formCode, 'overtimebegintime', (
                <NCDatePicker
                    format={'YYYY-MM-DD HH:mm:ss'}
                    showTime={true}
                    onSelect={this.handleDate.bind(this, formCode, 'overtimebegintime')}
                />
            ))
            renderItem('form', formCode, 'overtimeendtime', (
                <NCDatePicker
                    format={'YYYY-MM-DD HH:mm:ss'}
                    showTime={true}
                    onSelect={this.handleDate.bind(this, formCode, 'overtimeendtime')}
                />
            ))*/
        }

        dispatch({
            type: 'myLeave/update',
            payload: {
                showMode: 'card',
                isEdit: false,
                minTime,
                billId: record.values['pk_' + myLeave.activeTab].value,
                headerTitle: myLeave.subTitle,
                approvestatus: record.values['approvestatus'] && record.values['approvestatus'].value
            }
        })
    }

    initLeaveData = () => {
        const formCode = 'leave_card'
        const {dispatch, form} = this.comp.props;
        const {getAllFormValue} = form;
        dispatch({
            type: 'myLeave/afterEditCard',
            payload: {
                formData: {
                    model: getAllFormValue(formCode)
                },
                attrCode: 'pk_leave_type'
            }
        }).then(res => {
            if (res.success) {
                if (res.data && res.data.valueMap) {
                    if (res.data.extend && res.data.extend['isattachment']) {
                        // todo   附件上传是否必须
                        let isattachment = res.data.extend['isattachment']
                        let excessLength = res.data.extend['attachmentExcessDay'] || res.data.extend['attachmentExcessHour'] || '0'
                        dispatch({
                            type: 'myLeave/update',
                            payload: {
                                isattachment,
                                excessLength
                            }
                        })
                    }
                }
            }
        })
    }

    handleDate = (cardCode, attrcode, c, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue, setItemsVisible } = form;
        let begin = attrcode === 'overtimebegintime' ? value : getFormItemsValue(cardCode, 'overtimebegintime').value
        let end = attrcode === 'overtimeendtime' ? value : getFormItemsValue(cardCode, 'overtimeendtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {[attrcode]: {value: null}, otapplylength: {value: null, display: null}})
            setItemsVisible(cardCode, {isallnight: false})
            return
        }
        this.isAllNight(begin, end);
        let length = ((new Date(end).getTime() - new Date(begin).getTime()) / (60*60*1000)).toFixed(2);
        setFormItemsValue(cardCode, {otapplylength: {
            value: length,
            display: length + myLeave.json['6040-000014']
        }})
    }
    isAllNight = (start, end) => {
        const { form } = this.comp.props;
        const { setItemsVisible } = form;
        let allNight = start.split(' ')[0] !== end.split(' ')[0]
        setItemsVisible('overtime_card', {isallnight: allNight})
    }
    handleTripDate = (cardCode, attrCode, c, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue, setItemsVisible, getAllFormValue, getFormItemsVisible } = form;
        let begin = attrCode === 'tripbegintime' ? value : getFormItemsValue(cardCode, 'tripbegintime').value
        let end = attrCode === 'tripendtime' ? value : getFormItemsValue(cardCode, 'tripendtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {tripday: {value: null, display: null}})
            return
        }
        setFormItemsValue(cardCode, {[attrCode]: {display: null, value}})

        dispatch({
            type: 'myLeave/afterEditCard',
            payload: {
                formData: {
                    model: getAllFormValue(cardCode)
                },
                attrCode: 'tripbegintime'
            }
        }).then(res => {
            if (res.success) {
                if (res.data.valueMap) {
                    setFormItemsValue(cardCode, res.data.valueMap)
                }
            }
        })
    }
    handleLeaveDate = (cardCode, attrCode, c, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue, setItemsVisible, getAllFormValue } = form;
        let begin = attrCode === 'begintime' ? value : getFormItemsValue(cardCode, 'begintime').value
        let end = attrCode === 'endtime' ? value : getFormItemsValue(cardCode, 'endtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {leaveday: {value: null, display: null}})
            return
        }
        setFormItemsValue(cardCode, {[attrCode]: {display: null, value}})

        dispatch({
            type: 'myLeave/afterEditCard',
            payload: {
                formData: {
                    model: getAllFormValue(cardCode)
                },
                attrCode: 'begintime'
            }
        }).then(res => {
            if (res.success) {
                if (res.data.valueMap) {
                    setFormItemsValue(cardCode, res.data.valueMap)
                }
            }
        })
    }
    /**
     * @desc: 根据halfDate 和 minunit 来初始化不同的时间控件
     * @param {String} halfDate 是否为半天假
     * @param {String} minunit 请假单位   1 小时  2 天
     * @return:
     */
    initCardMeta = (halfDate, minunit='1', formCode, feedStatus = false, record) => {
        const { form, myLeave} = this.comp.props;
        const { setItemsVisible, setFormItemsRequired, getFormItemsVisible } = form;
        let obj = {};
        let flag = minunit === '1';
        let flag1 = minunit === '2';
        let flag2 = !!(minunit === '2' && halfDate);
        let cardDefaultVisiable = {
            'breastfeedingleaveway': false,
            'breastfeedingleaveday': false,
            'showbegindate': false, // 开始日期
            'showenddate': false, // 结束日期
            'begintime': true, // 开始时间
            'endtime': true, // 结束时间
            'start_day_type': false, // 结束日期
            'end_day_type': false, // 结束日期
            'leaveday': true, // 结束日期
            'vacationquota': false // 休假额度   默认不显示
        }
        const vacationquota = record&&record.values&&record.values.vacationquota && record.values.vacationquota.value;
        cardDefaultVisiable.vacationquota = !!(vacationquota && vacationquota > 0)
        if (formCode === 'leave_card') {
            if (feedStatus) {
                cardDefaultVisiable.breastfeedingleaveway = true
                cardDefaultVisiable.breastfeedingleaveday = true
                cardDefaultVisiable.showbegindate = true // 开始日期
                cardDefaultVisiable.showenddate = true // 结束日期
                cardDefaultVisiable.begintime = false // 开始时间
                cardDefaultVisiable.endtime = false // 结束时间
                cardDefaultVisiable.leaveday = false // 请假时长
                obj = {
                    begintime: false,
                    endtime: false,
                    showbegindate: true,
                    showenddate: true,
                    start_day_type: false,
                    end_day_type: false,
                    vacationquota: false
                }
            } else {
                cardDefaultVisiable.begintime = flag
                cardDefaultVisiable.endtime = flag
                cardDefaultVisiable.showbegindate = flag1
                cardDefaultVisiable.showenddate = flag1
                cardDefaultVisiable.start_day_type = flag2
                cardDefaultVisiable.end_day_type = flag2
                obj = {
                    begintime: flag,
                    endtime: flag,
                    showbegindate: flag1,
                    showenddate: flag1,
                    start_day_type: flag2,
                    end_day_type: flag2,
                    vacationquota: false
                }
            }

        }
        setItemsVisible(formCode, cardDefaultVisiable);
        setFormItemsRequired(formCode, obj);
    }

    didMount = () => {
        this.queryListAction()
    }
}