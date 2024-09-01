import {base, promptBox, ajax, toast} from 'nc-lightapp-front';

import {getAppPageConfig, saveValidate} from "src/hrpub/common/utils/utils";

const {pagecode} = getAppPageConfig()

const {NCDatePicker} = base;
export default class HeaderAction {
    constructor(comp) {
        this.comp = comp;
    }

    /**
     * @desc: 返回及取消按钮事件回调
     * @param {type}
     * @return:
     */
    clickBackBtn = () => {
        const {dispatch, myLeave, editTable} = this.comp.props;
        let activeTab = myLeave.activeTab
        let tableCode = myLeave.activeTab + '_list';
        if (myLeave.activeTab === 'leaveoff' || myLeave.activeTab === 'tripoff') {
            myLeave.activeTab === 'leaveoff' ? tableCode = 'leave_list' : tableCode = 'trip_list'
            myLeave.activeTab === 'leaveoff' ? activeTab = 'leave' : activeTab = 'trip'
        }
        if (myLeave.isEdit) {
            promptBox(
                {
                    color: "warning",
                    title: myLeave.json['6040-00005'], /* 国际化处理： 提示*/
                    content: myLeave.json['6040-00006'], /* 国际化处理： 你确定要返回吗？*/
                    beSureBtnClick: () => {
                        dispatch({
                            type: 'myLeave/update',
                            payload: {
                                activeTab,
                                showMode: 'list',
                                isEdit: false,
                                headerTitle: myLeave.json['6040-00007'] //假勤申请
                            }
                        })
                    }
                })
        } else {
            dispatch({
                type: 'myLeave/update',
                payload: {
                    showMode: 'list',
                    activeTab,
                    headerTitle: myLeave.json['6040-00007'] //假勤申请
                }
            })
            dispatch({
                type: 'myLeave/queryListAction',
                payload: {
                    key: activeTab,
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
                                [activeTab + 'PageInfo']: res.data[tableCode].pageInfo
                            }
                        })
                    } else {
                        editTable.setTableData(tableCode, {rows: []})
                        dispatch({
                            type: 'myLeave/update',
                            payload: {
                                [activeTab + 'PageInfo']: Object.assign({}, myLeave[activeTab + 'PageInfo'], {total: null})
                            }
                        })
                    }
                }
            })
        }
    }
    /**
     * @desc: 按钮时间注册回调函数
     * @param {type}
     * @return:
     */
    headerButtonClick = async (props, btncode) => {
        const {dispatch, myLeave, form} = this.comp.props
        const {setFormStatus, setAllFormValue, EmptyAllFormValue} = form

        let formCode = myLeave.activeTab + '_card'
        let tableCode = myLeave.activeTab + '_list'
        switch (btncode) {
            // 新增按钮  初始化 pk 默认数据
            case 'head_add':
                this.addBtnAction(formCode)
                break;
            case 'head_cancel':
                this.clickBackBtn();
                break;
            case 'head_query':
                dispatch({
                    type: 'myLeave/update',
                    payload: {
                        [myLeave.activeTab + 'PageInfo']: Object.assign({}, myLeave[myLeave.activeTab + 'PageInfo'], {
                            pageIndex: 1
                        })
                    }
                })
                this.searchAction(myLeave.activeTab, tableCode);
                break;
            case 'head_save':
                this.saveBill(myLeave.activeTab, formCode);
                break;
            case 'head_submit':
                this.submitBill(myLeave.activeTab, formCode);
                break;
            case 'head_refresh':
                this.searchAction(myLeave.activeTab, tableCode);
                break;
            case 'head_file':
                this.showUploader();
                break;
            case 'head_edit':
                this.editAction(formCode);
                break;
            case 'head_delete':
                this.deleteAction(myLeave.activeTab, formCode);
                break;
        }
    }
    /**
     * @desc: 新增按钮后事件
     * @param {type}
     * @return:
     */
    addBtnAction = async (formCode) => {
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
        let cardDefaultVisiable = {}
        let cardDefaultDisabled = {}
        if (formCode === 'leave_card') {
            cardDefaultVisiable = {
                showbegindate: false, // 开始日期
                showenddate: false, // 结束日期
                begintime: true, // 开始时间
                endtime: true, // 结束时间
                start_day_type: false, // 结束日期
                end_day_type: false, // 结束日期
                vacationquota: false // 休假额度   默认不显示
            }
            cardDefaultDisabled = {
                showbegindate: true, // 开始日期
                showenddate: true, // 结束日期
                begintime: true, // 开始时间
                endtime: true, // 结束时间
                start_day_type: true, // 结束日期
                end_day_type: true // 结束日期
            }
            // renderItem('form', formCode, 'begintime', (
            //     <NCDatePicker
            //         format={'YYYY-MM-DD HH:mm:ss'}
            //         showTime={true}
            //         onSelect={this.handleLeaveDate.bind(this, formCode, 'begintime')}
            //     />
            // ))
            // renderItem('form', formCode, 'endtime', (
            //     <NCDatePicker
            //         format={'YYYY-MM-DD HH:mm:ss'}
            //         showTime={true}
            //         onSelect={this.handleLeaveDate.bind(this, formCode, 'endtime')}
            //     />
            // ))
        } else if (formCode === 'trip_card') {
            cardDefaultDisabled = {
                tripbegintime: true, // 开始日期
                tripendtime: true // 结束日期
            }
            // renderItem('form', formCode, 'tripbegintime', (
            //     <NCDatePicker
            //         format={'YYYY-MM-DD HH:mm:ss'}
            //         showTime={true}
            //         onSelect={this.handleTripDate.bind(this, formCode, 'tripbegintime')}
            //     />
            // ))
            // renderItem('form', formCode, 'tripendtime', (
            //     <NCDatePicker
            //         format={'YYYY-MM-DD HH:mm:ss'}
            //         showTime={true}
            //         onSelect={this.handleTripDate.bind(this, formCode, 'tripendtime')}
            //     />
            // ))
        } else if (formCode === 'overtime_card') {
            cardDefaultVisiable = {
                isallnight: false
            }
            // renderItem('form', formCode, 'overtimebegintime', (
            //     <NCDatePicker
            //         format={'YYYY-MM-DD HH:mm:ss'}
            //         showTime={true}
            //         onSelect={this.handleDate.bind(this, formCode, 'overtimebegintime')}
            //     />
            // ))
            // renderItem('form', formCode, 'overtimeendtime', (
            //     <NCDatePicker
            //         format={'YYYY-MM-DD HH:mm:ss'}
            //         showTime={true}
            //         onSelect={this.handleDate.bind(this, formCode, 'overtimeendtime')}
            //     />
            // ))
        } else if (formCode === 'attendance_card') {
            const conf = await this.getAttConf();
            if (!conf.success) return;
            cardDefaultVisiable = {
                original_sign_time: false,
                fill_time: false
            }
            renderItem('form', formCode, 'fill_date', (
                <NCDatePicker
                    format={'YYYY-MM-DD HH:mm:ss'}
                    showTime={true}
                    disabledDate={(current) => this.disabledDate(current, conf.limitTime)}
                />
            ))
        }
        setItemsVisible(formCode, cardDefaultVisiable);
        setFormItemsDisabled(formCode, cardDefaultDisabled);
        setFormItemsRequired(formCode, cardDefaultVisiable);
        cardDefaultVisiable = null
        cardDefaultDisabled = null
        dispatch({
            type: 'myLeave/update',
            payload: {
                showMode: 'card',
                isEdit: true,
                headerTitle: myLeave.subTitle
            }
        })
        dispatch({
            type: 'myLeave/AddAction',
            payload: {
                key: myLeave.activeTab,
                operat: 0
            }
        }).then(res => {
            setAllFormValue({[formCode]: res.data[formCode]});
            let billId = getFormItemsValue(formCode, 'pk_' + myLeave.activeTab).value;
            let approvestatus = getFormItemsValue(formCode, 'approvestatus').value;
            dispatch({
                type: 'myLeave/update',
                payload: {
                    billId,
                    approvestatus
                }
            })
        })
        setFormStatus(formCode, 'add')
    }

    getAttConf = () => {
        const {dispatch} = this.comp.props
        return new Promise((resolve, reject) => {
            dispatch({
                type: 'myLeave/queryConfig',
                payload: {}
            }).then(res => {
                resolve(res)
            })
        })
    }

    disabledDate = (current, limitTime) => {
        if (limitTime === '-1') return;
        return current && current < new Date(limitTime);
    }
    /**
     * @desc: 表头点击修改事件触发
     * @param {type}
     * @return:
     */
    editAction = async (formCode) => {
        const {dispatch, form, renderItem} = this.comp.props;
        if (formCode === 'overtime_card') { // 加班申请编辑
            /*获取表单中某个字段的值*/
            /*data string/array*/
            const isoverdayValue = form.getFormItemsValue(formCode, 'isoverday').value;
            /*设置表单中某个字段的值*/
            /*values Object,格式为{'attrcode': {value: '', display: ''}}*/
            form.setFormItemsValue(formCode, {
                'isoverday': {
                    value: isoverdayValue === true ? 'Y' : isoverdayValue === false ? 'N' : '',
                    display: isoverdayValue === true ? '是' : isoverdayValue === false ? '否' : ''
                }
            })
        }
        form.setFormStatus(formCode, 'edit');
        let cardDefaultDisabled = {}
        if (formCode === 'leave_card') {
            cardDefaultDisabled = {
                showbegindate: false, // 开始日期
                showenddate: false, // 结束日期
                begintime: false, // 结束日期
                endtime: false, // 结束日期
                start_day_type: false, // 结束日期
                end_day_type: false // 结束日期
            }
            this.getLeaveQuota()
        } else if (formCode === 'trip_card') {
            cardDefaultDisabled = {
                tripbegintime: false, // 开始日期
                tripendtime: false // 结束日期
            }
        } else if (formCode === 'attendance_card') {
            const conf = await this.getAttConf();
            if (!conf.success) return;
            renderItem('form', formCode, 'fill_date', (
                <NCDatePicker
                    format={'YYYY-MM-DD HH:mm:ss'}
                    showTime={true}
                    disabledDate={(current) => this.disabledDate(current, conf.limitTime)}
                />
            ))
        }
        form.setFormItemsDisabled(formCode, cardDefaultDisabled);
        cardDefaultDisabled = null;
        dispatch({
            type: 'myLeave/update',
            payload: {
                isEdit: true
            }
        })
    }
    /**
     * @desc: 编辑休假单据，手动获取额度
     * @param {type}
     * @return:
     */
    getLeaveQuota = () => {
        const formCode = 'leave_card'
        const {dispatch, form} = this.comp.props;
        const {getAllFormValue, setFormItemsValue, setItemsVisible} = form;
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
                    let quota = res.data.valueMap.vacationquota
                    if (quota && quota.value !== null) {
                        setFormItemsValue(formCode, {
                            vacationquota: quota
                        })
                    }
                    let visibleFlag = quota && quota.value
                    setItemsVisible(formCode, {vacationquota: !!visibleFlag})
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
    /**
     * @desc: 单据删除事件触发
     * @param {type}
     * @return:
     */
    deleteAction = (activeTab, formCode) => {
        const {dispatch, myLeave} = this.comp.props
        const pk = myLeave.billId
        dispatch({
            type: 'myLeave/deleteAction',
            payload: {
                activeTab,
                pk
            }
        }).then(res => {
            if (res.success) {
                toast({
                    color: 'success',
                    content: myLeave.json['6040-000012']
                })
                this.clickBackBtn();
            }
        })
    }
    searchAction = async (key, tableCode) => {
        const {dispatch, myLeave} = this.comp.props;
        let res = await dispatch({
            type: 'myLeave/queryListAction',
            payload: {
                key,
                beginDate: myLeave.beginValue,
                endDate: myLeave.endValue
            }
        })
        if (res.success) {
            if (res.data) {
                this.handleListData(res.data[tableCode], tableCode)
            } else {
                this.handleListData({rows: [], pageInfo: {pageIndex: "1", pageSize: "10", total: null}}, tableCode)
            }
        }
    }
    /**
     * @desc: 数据请求完后处理函数封装
     * @param {type}
     * @return:
     */
    handleListData = (data, tableCode) => {
        const {dispatch, myLeave, editTable} = this.comp.props
        /*if (tableCode === 'attendance_list') {
            data.rows && data.rows.forEach(row => {
                row.values['fill_datetime'] = row.values['fill_date'];
                row.values['fill_time'].value = row.values['fill_date'].value.split(' ')[1];
            })
        }*/
        editTable.setTableData(tableCode, data)
        dispatch({
            type: 'myLeave/update',
            payload: {
                [myLeave.activeTab + 'PageInfo']: data.pageInfo
            }
        })
    }
    /**
     * @desc: 表单校验
     * @param {type}
     * @return:
     */
    checkBill = (formCode) => {
        const {dispatch, myLeave, form} = this.comp.props;
        const {isCheckNow} = form;
        return isCheckNow(formCode, 'warning')
    }
    /**
     * @desc: 保存单据
     * @param {type}
     * @return:
     */
    saveBill = async (key, formCode, submitFn) => {
        const {dispatch, myLeave, form} = this.comp.props
        const {getFormItemsValue, setFormItemsValue, setItemsVisible} = form;
        // 必填字段校验
        if (!this.checkBill(formCode)) return;
        //  单据提交前的手动校验  单据时间   时长字段
        if (!this.checkBillBymanual(formCode)) {
            return
        }
        // 校验是否需要上传附件
        if (formCode === 'leave_card' && myLeave.isattachment === '1') {
            // 校验附件上传的长度限制
            let length = form.getFormItemsValue(formCode, 'leaveday').value;
            if (length > myLeave.excessLength) {
                let res = await dispatch({
                    type: 'myLeave/queryBillAttachment',
                    payload: {
                        billId: myLeave.billId
                    }
                })
                if (res.success && !res.data.length) {
                    toast({
                        color: 'warning',
                        content: myLeave.json['6040-00003']  // 请先上传附件！
                    })
                    return
                }
            }
        }

        //  销假单独处理哺乳假时长
        if (myLeave.feedStatus === true) {
            if (formCode === 'leaveoff_card') {
                setFormItemsValue(formCode, {'leaveoffday': form.getFormItemsValue(formCode, 'breastfeedingleaveday')})
            } else {
                setFormItemsValue(formCode, {'leaveday': form.getFormItemsValue(formCode, 'breastfeedingleaveday')})
            }

        } else {
            setFormItemsValue(formCode, {
                'breastfeedingleaveday': {
                    value: '',
                    display: ''
                },
                'breastfeedingleaveway': {
                    value: '',
                    display: ''
                }
            })
        }
        let tempForm = form.getAllFormValue(formCode);
        /*if (formCode === 'attendance_card') {
            try {
                tempForm.rows[0].values.fill_date.value
                    = tempForm.rows[0].values.fill_datetime.value;
                //tempForm.rows[0].values.fill_time.value = new Date(date_time).getTime();
            } catch (e) {

            }
        }*/
        if (formCode === 'outside_card') {
            try {
                tempForm.rows[0].values.signdate.value
                    = tempForm.rows[0].values.sign_time.value;
                //tempForm.rows[0].values.fill_time.value = new Date(date_time).getTime();
            } catch (e) {

            }
        }

        let formData = {
            model: tempForm
        }
        let dr_flag = form.getFormItemsValue(formCode, 'dr_flag');
        if (dr_flag && dr_flag === '1') {
            let pk = getFormItemsValue(formCode, 'mainid').value
            let pk_group = getFormItemsValue(formCode, 'pk_group').value
            dispatch({
                type: 'myLeave/deleteDrAction',
                payload: {
                    pk,
                    pk_group,
                    key: myLeave.activeTab
                }
            }).then(res => {
                dispatch({
                    type: 'myLeave/saveBillAction',
                    payload: {
                        key,
                        formData,
                        formCode
                    }
                }).then(res => {
                    if (res.success) {
                        form.setFormStatus(formCode, 'browse');
                        if (formCode === 'leave_card') {
                            form.setItemsVisible(formCode, {
                                vacationquota: false
                            })
                        }
                        if (res.data && res.data[formCode]) {
                            form.setAllFormValue({
                                [formCode]: res.data[formCode]
                            })
                        }
                        dispatch({
                            type: 'myLeave/update',
                            payload: {
                                isEdit: false
                            }
                        });
                        if (typeof (submitFn) === 'function') {
                            submitFn()
                        }
                    }
                })
            })
        } else {
            saveValidate(this.comp.props, pagecode, formCode, null, 'form', null).then(() => {
                let durationObject = myLeave.durationObject
                dispatch({
                    type: 'myLeave/saveBillAction',
                    payload: {
                        key,
                        formData,
                        formCode,
                        durationObject
                    }
                }).then(res => {
                    if (res.success) {
                        form.setFormStatus(formCode, 'browse');
                        if (formCode === 'leave_card') {
                            form.setItemsVisible(formCode, {
                                vacationquota: false
                            })
                        }
                        if (res.data && res.data[formCode]) {
                            form.setAllFormValue({
                                [formCode]: res.data[formCode]
                            })
                        }
                        dispatch({
                            type: 'myLeave/update',
                            payload: {
                                isEdit: false
                            }
                        });
                        if (typeof (submitFn) === 'function') {
                            submitFn()
                        }
                    }
                })
            })
        }
    }
    /**
     * @desc: 单据未保存 先保存 再掉提交接口  已保存过，直接调提交接口
     *        通过表单的status来判断是否保存过
     * @param {type}
     * @return:
     */
    submitBill = (key, formCode) => {
        const {form} = this.comp.props;
        const {getFormItemsValue} = form;
        let pkKey = 'pk_' + key;
        let pk = getFormItemsValue(formCode, pkKey).value;
        this.saveBill(key, formCode, () => {
            this.submitFn(key, pk)
        })
    }
    submitFn = (key, pk) => {
        const {dispatch, myLeave} = this.comp.props;
        dispatch({
            type: 'myLeave/submitBillAction',
            payload: {
                key,
                pk
            }
        }).then(res => {
            if (res.success) {
                if (res.data && res.data.content) {
                    dispatch({
                        type: 'myLeave/update',
                        payload: {
                            assignedData: res.data.content,
                            assignedDisplay: true
                        }
                    })
                } else {
                    toast({
                        color: 'success',
                        content: myLeave.json['6040-00004']  // 提交成功！
                    });
                    this.clickBackBtn();
                }
            }
        })
    }
    /**
     * @desc: 手动校验单据
     * @param {String} formCode  表单
     * @return:
     */
    checkBillBymanual = (formCode) => {
        if (formCode === 'attendance_card' || formCode === 'outside_card') return true;
        const {form, myLeave} = this.comp.props;
        const {getFormItemsValue} = form;
        let begintime;
        let endtime;
        let length;
        let timeFlag = false;
        let lengthFlag = false;
        if (formCode === 'leave_card') {
            begintime = getFormItemsValue(formCode, 'begintime').value;
            endtime = getFormItemsValue(formCode, 'endtime').value;
            length = getFormItemsValue(formCode, 'leaveday').value;
        } else if (formCode === 'leaveoff_card') {
            if (myLeave.feedStatus) {
                begintime = getFormItemsValue(formCode, 'leaveoffshowbegindate').value;
                endtime = getFormItemsValue(formCode, 'leaveoffshowenddate').value;
                length = begintime && endtime ? 1 : 0;
            } else {
                begintime = getFormItemsValue(formCode, 'leaveoffbegintime').value;
                endtime = getFormItemsValue(formCode, 'leaveoffendtime').value;
                length = getFormItemsValue(formCode, 'leaveoffday').value;
            }
        } else if (formCode === 'overtime_card') {
            begintime = getFormItemsValue(formCode, 'overtimebegintime').value;
            endtime = getFormItemsValue(formCode, 'overtimeendtime').value;
            length = getFormItemsValue(formCode, 'otapplylength').value;
        } else if (formCode === 'trip_card') {
            begintime = getFormItemsValue(formCode, 'tripbegintime').value;
            endtime = getFormItemsValue(formCode, 'tripendtime').value;
            length = getFormItemsValue(formCode, 'tripday').value;
        } else if (formCode === 'tripoff_card') {
            begintime = getFormItemsValue(formCode, 'tripoffbegintime').value;
            endtime = getFormItemsValue(formCode, 'tripoffendtime').value;
            length = getFormItemsValue(formCode, 'tripoffday').value;
        }
        if (begintime > endtime) timeFlag = true;

        if (!length || !(length - 0)) lengthFlag = true;
        let dr_flag = getFormItemsValue(formCode, 'dr_flag')
        if(formCode === 'leaveoff_card' && myLeave.feedStatus){
            if (dr_flag && dr_flag.value === '1') lengthFlag = false;
        }else{
            if (myLeave.feedStatus || dr_flag && dr_flag.value === '1') lengthFlag = false;
        }
        if (timeFlag) {
            // 结束时间必须晚于开始时间！
            toast({
                color: 'danger',
                content: myLeave.json['6040-000011']
            })
            return false
        }
        if (lengthFlag) {
            toast({
                color: 'warning',
                content: myLeave.json['6040-000013']
            })
            return false
        }
        return true
    }

    /**
     * @desc: 显示附件管理
     * @param {type}
     * @return:
     */
    showUploader = (ev) => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                showUploader: true
            }
        })
    }
    onBeginValueChange = (date) => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                beginValue: date
            }
        })
    }

    onEndValueChange = (date) => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                endValue: date
            }
        })
    }

    handleDate = (cardCode, attrcode, c, value) => {
        const {dispatch, myLeave, form} = this.comp.props;
        const {getFormItemsValue, setFormItemsValue, setItemsVisible} = form;
        let begin = attrcode === 'overtimebegintime' ? value : getFormItemsValue(cardCode, 'overtimebegintime').value
        let end = attrcode === 'overtimeendtime' ? value : getFormItemsValue(cardCode, 'overtimeendtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {[attrcode]: {value: null}, otapplylength: {value: null, display: null}})
            setItemsVisible(cardCode, {isallnight: false})
            return
        }
        this.isAllNight(begin, end);
        let length = ((new Date(end).getTime() - new Date(begin).getTime()) / (60 * 60 * 1000)).toFixed(2);
        setFormItemsValue(cardCode, {
            otapplylength: {
                value: length,
                display: length + myLeave.json['6040-000014']
            }
        })
    }
    handleTripDate = (cardCode, attrCode, c, value) => {
        const {dispatch, myLeave, form} = this.comp.props;
        const {getFormItemsValue, setFormItemsValue, setItemsVisible, getAllFormValue} = form;
        setFormItemsValue(cardCode, {[attrCode]: {display: null, value}})
        let begin = attrCode === 'tripbegintime' ? value : getFormItemsValue(cardCode, 'tripbegintime').value
        let end = attrCode === 'tripendtime' ? value : getFormItemsValue(cardCode, 'tripendtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {tripday: {value: null, display: null}})
            return
        }
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
        const {dispatch, myLeave, form} = this.comp.props;
        const {getFormItemsValue, setFormItemsValue, setItemsVisible, getAllFormValue} = form;
        setFormItemsValue(cardCode, {[attrCode]: {display: null, value}})
        let begin = attrCode === 'begintime' ? value : getFormItemsValue(cardCode, 'begintime').value
        let end = attrCode === 'endtime' ? value : getFormItemsValue(cardCode, 'endtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {leaveday: {value: null, display: null}})
            return
        }
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

    isAllNight = (start, end) => {
        const {form} = this.comp.props;
        const {setItemsVisible} = form;
        let allNight = start.split(' ')[0] !== end.split(' ')[0]
        setItemsVisible('overtime_card', {isallnight: allNight})
    }
    // 单据指派
    assignedBill = (value) => {
        const {dispatch, myLeave, form} = this.comp.props;
        const {getFormItemsValue} = form;
        let key = myLeave.activeTab
        let pkKey = 'pk_' + key;
        let formCode = key + '_card'
        let pk = getFormItemsValue(formCode, pkKey).value;
        dispatch({
            type: 'myLeave/submitBillAction',
            payload: {
                key,
                pk,
                content: value
            }
        }).then(res => {
            if (res.success) {
                toast({
                    color: 'success',
                    content: myLeave.json['6040-00004']  // 提交成功！
                });
                dispatch({
                    type: 'myLeave/update',
                    payload: {
                        assignedDisplay: false,
                        assignedData: null
                    }
                })
                this.clickBackBtn();
            }
        })
    }
    cancelAssigned = () => {
        const {dispatch} = this.comp.props;
        dispatch({
            type: 'myLeave/update',
            payload: {
                assignedDisplay: false,
                assignedData: null
            }
        })
    }
    didUpdate = () => {
        const {button, myLeave} = this.comp.props
        let hasAddButton = myLeave.activeTab === 'attendance' || myLeave.activeTab === 'leave' || myLeave.activeTab === 'overtime' || myLeave.activeTab === 'trip' || myLeave.activeTab === 'leaveoff' || myLeave.activeTab === 'tripoff'
        let canEdit = myLeave.approvestatus === '-1'
        let canSubmit = myLeave.approvestatus === '-1'
        let hasFileUpload = myLeave.activeTab === 'outside' || myLeave.activeTab === 'leave' || myLeave.activeTab === 'trip'|| myLeave.activeTab === 'leaveoff' || myLeave.activeTab === 'tripoff'
        button.setButtonsVisible({
            head_add: myLeave.showMode === 'list' && hasAddButton,
            head_edit: myLeave.showMode === 'card' && !myLeave.isEdit && hasAddButton && canEdit,
            head_query: myLeave.showMode === 'list',
            head_refresh: myLeave.showMode === 'list',
            head_file: myLeave.showMode === 'card' && hasFileUpload,
            head_save: myLeave.showMode === 'card' && myLeave.isEdit && hasAddButton,
            head_submit: myLeave.showMode === 'card' && hasAddButton && canSubmit,
            head_cancel: myLeave.showMode === 'card' && myLeave.isEdit && canEdit,
            head_delete: myLeave.showMode === 'card' && hasAddButton && !myLeave.isEdit && canSubmit,
            list_delete: myLeave.showMode === 'card' && !myLeave.isEdit,
            list_withdraw: myLeave.showMode === 'list',
            list_submit: myLeave.showMode === 'list'
        })
    }
}