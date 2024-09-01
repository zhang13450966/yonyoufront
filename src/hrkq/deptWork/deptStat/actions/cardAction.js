export default class CardAction {
    constructor(comp) {
        this.comp = comp;
    }
    
    /**
     * @desc: 触发后端的编辑后事件处理相关的业务
     * @param {type} 
     * @return: 
     */
    editAction = (cardCode, key, callbackFn) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        dispatch({
            type: 'deptStat/afterEditCard',
            payload: {
                formData: {
                    model: getAllFormValue(cardCode)
                },
                attrCode: key
            }
        }).then(res => {
            if (res.data.valueMap) {
                setFormItemsValue(cardCode, res.data.valueMap)
            }
            if (res.data.itemMetaMap) {
                Object.keys(res.data.itemMetaMap).forEach(key => {
                    if (key === 'disabled') {
                        setFormItemsDisabled(cardCode, res.data.itemMetaMap[key])
                    } else if (key === 'required') {
                        setFormItemsRequired(cardCode, res.data.itemMetaMap[key])
                    } else if (key === 'visible') {
                        setItemsVisible(cardCode, res.data.itemMetaMap[key])
                    }
                })
            }
            if (res.data.extend) {
                // let keys = Object.keys(res.data.extend);
                if (res.data.extend['minTime']) {
                    let minTime = res.data.extend['minTime'];
                    dispatch({
                        type: 'deptStat/update',
                        payload: {
                            minTime
                        }
                    })
                    let minunit = getFormItemsValue(cardCode, 'minunit').value
                    this.handleDateFormControl(cardCode, minTime, minunit)
                }
                if (res.data.extend['isattachment']) {
                    // todo   附件上传是否必须
                    let isattachment = res.data.extend['isattachment']
                    dispatch({
                        type: 'deptStat/update',
                        payload: {
                            isattachment
                        }
                    })
                }
            }
            if (typeof(callbackFn) === 'function') callbackFn()
        })
    }
    /**
     * @desc: 类型变更后手动清除时间 变更相关元数据的设置
     * @param {type} 
     * @return: 
     */
    clearTypeRelData = (cardCode, valueMap) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        setFormItemsValue(cardCode, valueMap)
    }
    /**
     * @desc: 
     * @param {type} minTime 1 0.5  2 1
     * @param {type} minunit 1 小时  2 天
     * @return: 
     */
    handleDateFormControl = (cardCode, minTime, minunit) => {
        const { dispatch, deptStat, form, meta } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let target = {
            begintime: true, // 开始时间
            endtime: true, // 结束时间
            showbegindate: true, // 开始日期
            showenddate: true, // 结束日期
            start_day_type: true, // 开始 上午下午
            end_day_type: true   // 结束 上午下午
        }
        if (minunit === '1') {
            // 小时
            target.showbegindate = false
            target.showenddate = false
            target.start_day_type = false
            target.end_day_type = false
            setItemsVisible(cardCode, target)
        } else if (minunit === '2') {
            if (minTime === '1') {
                // 半天
                target.begintime = false
                target.endtime = false
                setItemsVisible(cardCode, target)
            } else if (minTime === '2') {
                // 1天
                target.begintime = false
                target.endtime = false
                target.start_day_type = false
                target.end_day_type = false
                setItemsVisible(cardCode, target)
            }
        }
    }
    /**
     * @desc: 清空和选择休假类别后设置日期控件的disabled属性
     * @param {type} 
     * @return: 
     */
    setDateDisabled = (cardCode, disabled) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { setFormItemsDisabled } = form;
        let disabledMap = {};
        if (cardCode === 'leave_card') {
            disabledMap = {
                showbegindate: disabled, // 开始日期
                showenddate: disabled, // 结束日期
                begintime: disabled, // 结束日期
                endtime: disabled, // 结束日期
                start_day_type: disabled, // 结束日期
                end_day_type: disabled // 结束日期
            }
        } else if (cardCode === 'trip_card') {
            disabledMap = {
                tripbegintime: disabled, // 开始日期
                tripendtime: disabled // 结束日期
            }
        }
        setFormItemsDisabled(cardCode, disabledMap)
        disabledMap = null
    }
    /**
     * @desc: 对于半天假和整天的假别  时间控件不同，
     *        对应的元数据字段也不一致，需要全部处理到 开始时间和结束时间 元数据上 
     *        通过开始时间和结束时间字段触发编辑后事件回调
     * @param {String} cardCode  表单的earaCode
     * @param {String} key   对应的字段
     * @param {String} value 不是编辑后事件中返回的对象，确切的值
     * @return: 
     */
    handelLeavetime = (cardCode, key, value) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        // 是否触发计算时长的标志位
        let falg = false;
        let minTime = deptStat.minTime;
        let time
        switch (key) {
            case 'begintime':
                if (getFormItemsValue(cardCode, 'endtime').value) falg = true;
            break;
            case 'endtime':
                if (getFormItemsValue(cardCode, 'begintime').value) falg = true;
            break;
            case 'showbegindate':
                if (minTime === '1') {
                    let oldVal = getFormItemsValue(cardCode, 'start_day_type').value;
                    let time = '08:00:00';
                    let display = deptStat.lang['hrkq-0000081'];
                    let label = value.split(' ');
                    let val = value.split(' ');
                    label.splice(1, 1, display)
                    val.splice(1, 1, time)
                    if (!oldVal) {
                        setFormItemsValue(cardCode, {start_day_type: {value: '1', display: deptStat.lang['hrkq-0000081']}})
                        setFormItemsValue(cardCode, {begintime: {
                            value: val.join(' '),
                            display: label.join(' ')
                        }})
                    } else {
                        time = oldVal === '2' ? '20:00:00' : '08:00:00';
                        display = oldVal === '2' ? deptStat.lang['hrkq-0000080'] :deptStat.lang['hrkq-0000081'];
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {begintime: {
                            value: val.join(' '),
                            display: label.join(' ')
                        }})
                    }
                } else {
                    setFormItemsValue(cardCode, {begintime: {value: value}})
                } 
                if (getFormItemsValue(cardCode, 'endtime').value) falg = true;
            break;
            case 'showenddate':
                if (minTime === '1') {
                    let oldVal = getFormItemsValue(cardCode, 'end_day_type').value;
                    let time = '08:00:00';
                    let display = deptStat.lang['hrkq-0000081']
                    let val = value.split(' ');
                    let label = value.split(' ');
                    val.splice(1, 1, time)
                    label.splice(1, 1, display)
                    if (!oldVal) {
                        setFormItemsValue(cardCode, {end_day_type: {value: '1'}})
                        setFormItemsValue(cardCode, {endtime: {
                            value: val.join(' '),
                            display: label.join(' ')
                        }})
                    } else {
                        time = oldVal === '2' ? '20:00:00' : '08:00:00';
                        display = oldVal === '2' ? deptStat.lang['hrkq-0000080'] : deptStat.lang['hrkq-0000081'];
                        val.splice(1, 1, time)
                        label.splice(1, 1, display)
                        setFormItemsValue(cardCode, {endtime: {
                            value: val.join(' '),
                            display: label.join(' ')
                        }})
                    }
                } else {
                    setFormItemsValue(cardCode, {endtime: {value: value}})
                } 
                if (getFormItemsValue(cardCode, 'begintime').value) falg = true;
            break;
            case 'start_day_type':
                time = value === '2' ? '20:00:00' : '08:00:00';
                let begintime = getFormItemsValue(cardCode, 'begintime').value;
                if (begintime) {
                    let val = begintime.split(' ');
                    val.splice(1, 1, time);
                    setFormItemsValue(cardCode, {begintime: {value: val.join(' ')}});
                }
                if (getFormItemsValue(cardCode, 'endtime').value && getFormItemsValue(cardCode, 'begintime').value) falg = true;
            break;
            case 'end_day_type':
                time = value === '2' ? '20:00:00' : '08:00:00';
                let endtime = getFormItemsValue(cardCode, 'endtime').value;
                if (endtime) {
                    let val = endtime.split(' ');
                    val.splice(1, 1, time);
                    setFormItemsValue(cardCode, {endtime: {value: val.join(' ')}});
                }
                if (getFormItemsValue(cardCode, 'begintime').value && getFormItemsValue(cardCode, 'endtime').value) falg = true;
            break;
        }
        let type = getFormItemsValue(cardCode, 'pk_leave_type').value;
        if (!type) falg = false
        if (falg) this.editAction(cardCode, 'begintime');
    }
    /**
     * @desc: 出差开始结束时间，校验及触发编辑后事件
     * @param {type} 
     * @return: 
     */
    handelTriptime = (cardCode, key, value) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let falg = false;
        if (key === 'tripbegintime') {
            if (getFormItemsValue(cardCode, 'tripendtime').value) falg = true;
        } else {
            if (getFormItemsValue(cardCode, 'tripbegintime').value) falg = true;
        }
        let type = getFormItemsValue(cardCode, 'triptypeid').value;
        if (!type) falg = false
        if (falg) this.editAction(cardCode, 'tripbegintime');
    }
    /**
     * @desc: 前端计算加班申请时长
     * @param {type} 
     * @return: 
     */
    calculateOvertimeLength = (cardCode, attrCode) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue } = form;
        let begin = getFormItemsValue(cardCode, 'overtimebegintime').value
        let end = getFormItemsValue(cardCode, 'overtimeendtime').value
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {[attrCode]: {value: null}})
            setItemsVisible(cardCode, {isallnight: false})
            return
        }
        this.isAllNight(begin, end);
        let length = ((new Date(end).getTime() - new Date(begin).getTime()) / (60*60*1000)).toFixed(2);
        setFormItemsValue(cardCode, {otapplylength: {
            value: length,
            display: length + deptStat.lang['hrkq-00000814']
        }})
    }
    /**
     * @desc: 判断所选时间是否跨夜
     * @param {Date} start 开始时间
     * @param {Date} end   结束时间
     * @return: 是否跨夜 [Boolean]
     */
    isAllNight = (start, end) => {
        const { form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue, setItemsVisible } = form;
        let allNight = start.split(' ')[0] !== end.split(' ')[0]
        setItemsVisible('overtime_card', {isallnight: allNight}) 
    }
    onBeforeEvent = () => {
        return true
    }
    queryTypeById = (id) => {

    }
    clickBackBtn = () => {
    }
}