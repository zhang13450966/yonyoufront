import { promptBox, base, toast } from 'nc-lightapp-front';
import moment from 'moment';
export default class CardAction {
    constructor(comp) {
        this.comp = comp;
    }
    /**
     * @desc: 手动校验单据
     * @param {String} formCode  表单
     * @return:
     */
    checkBillBymanual = (formCode) => {
        const { form, myLeave } = this.comp.props;
        const { getFormItemsValue } = form;
        let begintime;
        let endtime;
        let length;
        let timeFlag = false;
        let lengthFlag = false;
        let minunit = getFormItemsValue(formCode, 'minunit').value
       if (formCode === 'leaveoff_card') {
            begintime = getFormItemsValue(formCode, 'leaveoffshowbegindate').value ;
            endtime = getFormItemsValue(formCode, 'leaveoffshowenddate').value;
            length = getFormItemsValue(formCode, 'leaveoffday').value;
        } else if (formCode === 'tripoff_card') {
            begintime = getFormItemsValue(formCode, 'tripoffbegintime').value;
            endtime = getFormItemsValue(formCode, 'tripoffendtime').value;
            length = getFormItemsValue(formCode, 'tripoffday').value;
        }
        if (begintime > endtime) timeFlag = true
        if (!length || !(length - 0) ) lengthFlag = true
        if (timeFlag) {
            // 结束时间必须晚于开始时间！
            toast({
                color: 'danger',
                content: myLeave.json['6040-000011']
            })
            return false
        }
        if (timeFlag&&lengthFlag) {
            toast({
                color: 'warning',
                content: myLeave.json['6040-000013']
            })
            return false
        }
        return true
    }
     /**
     * @desc:
     * @param {type} minTime 1 0.5  2 1
     * @param {type} minunit 1 小时  2 天
     * @return:
     */
    handleoffDateFormControl = (cardCode, minTime, minunit) => {
        const { dispatch, myLeave, form, meta } = this.comp.props;
        const { setFormItemsRequired, setItemsVisible ,getFormItemsValue } = form;
        let breastfeedingleaveway = getFormItemsValue(cardCode, 'breastfeedingleaveway').value

        let target = {
            leaveoffbegintime: true, // 开始时间
            leaveoffendtime: true, // 结束时间
            leaveoffshowbegindate: true, // 开始日期
            leaveoffshowenddate: true, // 结束日期
            leaveoff_start_day_type: true, // 开始 上午下午
            leaveoff_end_day_type: true,   // 结束 上午下午
            leaveoffday: !breastfeedingleaveway
        }
        if (myLeave.feedStatus) {
            // 1天
            target.leaveoffbegintime = false;
            target.leaveoffendtime = false;
            target.leaveoff_start_day_type = false;
            target.leaveoff_end_day_type = false;
            setItemsVisible(cardCode, target);
            setFormItemsRequired(cardCode, target);
        } else  if (minunit === '1') {
            // 小时
            target.leaveoffshowbegindate = false;
            target.leaveoffshowenddate = false;
            target.leaveoff_start_day_type = false;
            target.leaveoff_end_day_type = false;
            setItemsVisible(cardCode, target);
            setFormItemsRequired(cardCode, target);
        } else if (minunit === '2') {
            if (minTime === '1'  ) {
                // 半天
                target.leaveoffbegintime = false;
                target.leaveoffendtime = false;
                setItemsVisible(cardCode, target);
                setFormItemsRequired(cardCode, target);
            } else if (minTime === '2') {
                // 1天
                target.leaveoffbegintime = false;
                target.leaveoffendtime = false;
                target.leaveoff_start_day_type = false;
                target.leaveoff_end_day_type = false;
                setItemsVisible(cardCode, target);
                setFormItemsRequired(cardCode, target);
            }
        }
    }
    // 销差切换显示
    revokeTripoffChoose (carCode,key,value) {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let target = {
            tripoffbegintime: false, // 开始时间
            tripoffendtime: false, // 结束时间
            tripoffday:false
        }
        if (value === '1') {
            let tripbegintime = getFormItemsValue(carCode,'tripbegintime')
            let tripendtime = getFormItemsValue(carCode,'tripendtime')
            setItemsVisible(carCode,target)
            setFormItemsValue(carCode,{
                tripoffbegintime:tripbegintime,
                tripoffendtime: tripendtime,
                tripoffday:{
                    value:0,
                    dispaly:0
                }
            })
        } else {
            target.tripoffbegintime = true, // 开始时间
            target.tripoffendtime = true, // 结束时间
            target.tripoffday = true
            setItemsVisible(carCode,target)
            setFormItemsValue(carCode,{
                tripoffendtime:{},
                tripoffbegintime: {},
                tripoffday:{}
            })

        }
    }
    // 销假切换显示
    revokeLeaveoffChoose (carCode,key,value) {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let target = {
            leaveoffbegintime: false, // 开始时间
            leaveoffendtime: false, // 结束时间
            leaveoffshowbegindate: false, // 开始日期
            leaveoffshowenddate: false, // 结束日期
            leaveoff_start_day_type: false, // 开始 上午下午
            leaveoff_end_day_type: false,   // 结束 上午下午
            leaveoffday:false
        }
        if (value === '1') {
            let leavebegintime = getFormItemsValue(carCode,'leavebegintime')
            let leaveendtime = getFormItemsValue(carCode,'leaveendtime')
            let leaveshowbegindate = getFormItemsValue(carCode,'leaveshowenddate')
            let leaveshowenddate = getFormItemsValue(carCode,'leaveshowenddate')
            let leave_start_day_type = getFormItemsValue(carCode,'leave_start_day_type')
            let leave_end_day_type = getFormItemsValue(carCode,'leave_end_day_type')
            setItemsVisible(carCode,target)
            setFormItemsValue(carCode,{
                leaveoffbegintime:leavebegintime,
                leaveoffendtime: leaveendtime,
                leaveoffshowbegindate:leaveshowbegindate,
                leaveoffshowenddate:leaveshowenddate,
                leaveoffday:{
                    value:0,
                    dispaly:0
                }
            })
        } else {
            let minTime = getFormItemsValue(carCode,'leaveoff_start_day_type').value?'1':'2'
            let minunit = getFormItemsValue(carCode,'minunit').value
            this.handleoffDateFormControl(carCode,minTime,minunit)
            setFormItemsValue(carCode,{
                leaveoffbegintime:{},
                leaveoffendtime: {},
                leaveoffshowbegindate:{},
                leaveoffshowenddate:{},
                leaveoffday:{}
            })

        }
    }
    /**
     * @desc: 表单的编辑后事件(变动后触发)  1. 选择类型后，相应的组件修改 2. 选择时间后，动态计算时长
     * @param {Comment} props
     * @param {String} moduleId  区域id
     * @param {String} key  操作的键
     * @param {String} value 当前值
     * @param {String} oldValue 旧值
     * @return:
     */
    onAfterEvent = (props, moduleId, key, value, oldValue) => {
        const {form} = props;
        const { dispatch, myLeave } = this.comp.props;
        const {getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue} = form;
        let obj
        if (moduleId === 'leaveoff_card') {
           obj = {
            leaveoffbegintime: {
                display: null,
                value: null
            },
            leaveoffendtime: {
                display: null,
                value: null
            },
            leaveoffshowbegindate: {
                display: null,
                value: null
            },
            leaveoff_start_day_type: {
                display: null,
                value: null
            },
            leaveoffshowenddate: {
                display: null,
                value: null
            },
            leaveoff_end_day_type: {
                display: null,
                value: null
            },
        }

        if (['leaveoffbegintime', 'leaveoffshowbegindate', 'leaveoff_start_day_type','leaveoffendtime', 'leaveoffshowenddate', 'leaveoff_end_day_type'].indexOf(key) !== -1 && value.value) {
            if(!['leaveoff_start_day_type', 'leaveoff_end_day_type'].includes(key) && value.value){
                value.value = value.value.slice(0,-2)+'00'
                props.form.setFormItemsValue(moduleId, {
                    [key]: value
                })
            }
            this.handelLeaveofftime(moduleId, key, value.value);
            if (!this.checkBillBymanual(moduleId)){
                return false
            }
        }
        // 销假 为请假
        if (key == 'dr_flag') {
            this.revokeLeaveoffChoose(moduleId,key,value.value)
          }
        }
        if  (moduleId === 'tripoff_card') {
            if (!this.checkBillBymanual(moduleId)){
                 return false
            }
            obj = {
                tripday: {
                    display: null,
                    value: null
                }
            }
            if (['tripoffbegintime', 'tripoffendtime'].indexOf(key) !== -1 && value.value) {
                value.value = value.value.slice(0, -2) + '00'
                props.form.setFormItemsValue(moduleId, {
                    [key]: value
                })
                this.handelTripofftime(moduleId, key, value.value);
            }
            // 销差 未出差
        if (key == 'dr_flag') {
            this.revokeTripoffChoose(moduleId,key,value.value)
          }
        }
        if (moduleId === 'leave_card') {
            obj = {
                begintime: {
                    display: null,
                    value: null
                },
                showbegindate: {
                    display: null,
                    value: null
                },
                start_day_type: {
                    display: null,
                    value: null
                },
                endtime: {
                    display: null,
                    value: null
                },
                showenddate: {
                    display: null,
                    value: null
                },
                end_day_type: {
                    display: null,
                    value: null
                },
                leaveday: {
                    display: null,
                    value: null
                }
            }
            if (key === 'pk_leave_type') {
                if (!value.value) {
                    this.clearTypeRelData(moduleId, obj);
                    this.setDateDisabled(moduleId, true);
                    setItemsVisible(moduleId, {vacationquota: false});
                    return
                }

                this.setDateDisabled(moduleId, false);
                this.clearTypeRelData(moduleId, obj);
                // 哺乳假显示控制
                dispatch({
                    type: 'myLeave/update',
                    payload: {
                        feedStatus: value.refcode === '8' ? true : false
                    }
                })
                if ( value.refcode === '8') {
                     setFormItemsValue(moduleId,{leaveday: {
                        value: 1
                    }})
                    setItemsVisible(moduleId, {leaveday: false,  breastfeedingleaveday: true, breastfeedingleaveway: true});
                } else {
                    setItemsVisible(moduleId, {leaveday: true,  breastfeedingleaveday: false, breastfeedingleaveway: false});
                }
                // 哺乳假时长赋值给leaveday
                if (key === 'breastfeedingleaveday') {
                    setFormItemsValue(moduleId,{leaveday: {
                        value
                    }})
                }
                this.editAction(moduleId, key, () => {
                    setItemsVisible(moduleId, {vacationquota: getFormItemsValue(moduleId, 'vacationquota').value !== undefined && getFormItemsValue(moduleId, 'vacationquota').value !== null})
                });
            } else if (['begintime', 'showbegindate', 'start_day_type', 'endtime', 'showenddate', 'end_day_type'].indexOf(key) !== -1) {
                if(!['start_day_type', 'end_day_type'].includes(key) && value.value){
                    value.value = value.value.slice(0,-2)+'00'
                    props.form.setFormItemsValue(moduleId, {
                        [key]: value
                    })
                }
                    this.handelLeavetime(moduleId, key, value.value);
            }
        } else if (moduleId === 'trip_card') {
            obj = {
                // tripbegintime: {
                //     display: null,
                //     value: null
                // },
                // tripendtime: {
                //     display: null,
                //     value: null
                // },
                tripday: {
                    display: null,
                    value: null
                }
            }
            if (key === 'triptypeid') {
                if (!value.value) {
                    this.clearTypeRelData(moduleId, obj);
                    this.setDateDisabled(moduleId, true);
                    return
                }
                this.setDateDisabled(moduleId, false);
                this.clearTypeRelData(moduleId, obj);
                this.handelTriptime(moduleId, 'tripbegintime')
            } else if (['tripbegintime', 'tripendtime'].indexOf(key) !== -1 && value.value) {

                value.value = value.value.slice(0, -2) + '00'
                props.form.setFormItemsValue(moduleId, {
                    [key]: value
                })

                this.handelTriptime(moduleId, key, value.value);
            }

        } else if (moduleId === 'overtime_card') {
            if (key === 'overtimebegintime' || key === 'overtimeendtime' || key === 'isoverday' || key === 'isallnight') {

                if(key === 'overtimebegintime' || key === 'overtimeendtime'){
                    // value.value = value.value.slice(0, -2) + '00'
                    props.form.setFormItemsValue(moduleId, {
                        [key]: value
                    })
                }else{
                    key = 'overtimeendtime'
                }
                this.handelOvertime(moduleId, key, value.value);
                // this.calculateOvertimeLength(moduleId, key)
            }
        }
        obj = null
    }
    /**
     * @desc: 触发后端的编辑后事件处理相关的业务
     * @param {type}
     * @return:
     */
    editAction = (cardCode, key, callbackFn) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        if (myLeave.activeTab === "leave" && myLeave.feedStatus) {
            key = 'pk_leave_type'
        }
        let model = getAllFormValue(cardCode)
        dispatch({
            type: 'myLeave/afterEditCard',
            payload: {
                formData: {
                    model
                },
                attrCode: key
            }
        }).then(res => {
            if(myLeave.feedStatus){
                res.data.valueMap.leaveoffday = model.rows[0].values.breastfeedingleaveday
            }
            if (res.data.valueMap) {
                setFormItemsValue(cardCode, res.data.valueMap)
                // if (cardCode === 'tripoff_card') {
                // }
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
                        type: 'myLeave/update',
                        payload: {
                            minTime
                        }
                    })
                    let minunit = getFormItemsValue(cardCode, 'minunit').value
                    this.handleDateFormControl(cardCode, minTime, minunit)
                }
                if(cardCode === 'overtime_card' && res.data.extend['durationObject']){
                    let durationObject = res.data.extend['durationObject']
                    dispatch({
                        type: 'myLeave/update',
                        payload: {
                            durationObject
                        }
                    })
                }
                if (res.data.extend['startTime'] && res.data.extend['endTime']) {
                    if(cardCode === 'leaveoff_card'){
                        setFormItemsValue(cardCode, {
                            leaveoffbegintime: {
                                value: res.data.extend['startTime']
                            },
                            leaveoffendtime: {
                                value: res.data.extend['endTime']
                            }
                        })
                    }else if(cardCode === 'tripoff_card'){
                        setFormItemsValue(cardCode, {
                            tripoffbegintime: {
                                value: res.data.extend['startTime']
                            },
                            tripoffendtime: {
                                value: res.data.extend['endTime']
                            }
                        })
                    }else{
                        setFormItemsValue(cardCode, {
                            begintime: {
                                value: res.data.extend['startTime']
                            },
                            endtime: {
                                value: res.data.extend['endTime']
                            }
                        })
                    }
                }
                if (res.data.extend['isattachment']) {
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
            if (typeof(callbackFn) === 'function') callbackFn()
        })
    }
    /**
     * @desc: 类型变更后手动清除时间 变更相关元数据的设置
     * @param {type}
     * @return:
     */
    clearTypeRelData = (cardCode, valueMap) => {
        const { dispatch, myLeave, form } = this.comp.props;
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
        const { dispatch, myLeave, form, meta } = this.comp.props;
        const { setFormItemsRequired, setItemsVisible ,setFormItemsValue } = form;
        let target = {
            begintime: true, // 开始时间
            endtime: true, // 结束时间
            showbegindate: true, // 开始日期
            showenddate: true, // 结束日期
            start_day_type: true, // 开始 上午下午
            end_day_type: true   // 结束 上午下午
        }
        if(cardCode === 'tripoff_card'){
            setFormItemsValue(cardCode, {
                'breastfeedingleaveday':{},
                'breastfeedingleaveway':{}
            });
        }
        if (myLeave.feedStatus) {
            // 1天
            target.begintime = false;
            target.endtime = false;
            target.start_day_type = false;
            target.end_day_type = false;
            setItemsVisible(cardCode, target);
            setFormItemsRequired(cardCode, target);
        } else  if (minunit === '1') {
            // 小时
            target.showbegindate = false;
            target.showenddate = false;
            target.start_day_type = false;
            target.end_day_type = false;
            setItemsVisible(cardCode, target);
            setFormItemsRequired(cardCode, target);
        } else if (minunit === '2') {
            if (minTime === '1'  ) {
                // 半天
                target.begintime = false;
                target.endtime = false;
                setItemsVisible(cardCode, target);
                setFormItemsRequired(cardCode, target);

                setFormItemsValue(cardCode, {
                    'breastfeedingleaveday':{
                        value: '1'
                    },
                    'breastfeedingleaveway':{
                        value: '1'
                    }
                });
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
     * @desc: 清空和选择休假类别后设置日期控件的disabled属性
     * @param {type}
     * @return:
     */
    setDateDisabled = (cardCode, disabled) => {
        const { dispatch, myLeave, form } = this.comp.props;
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
     * @desc: 对于半天假和整天的假别   时间控件不同，
     *        对应的元数据字段也不一致，需要全部处理到 开始时间和结束时间 元数据上
     *        通过开始时间和结束时间字段 触发编辑后事件回调
     * @param {String} cardCode  表单的earaCode
     * @param {String} key   对应的字段
     * @param {String} value 不是编辑后事件中返回的对象，确切的值
     * @return:
     */
    handelLeaveofftime = (cardCode, key, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        // 是否触发计算时长的标志位
        let falg = false;
        let minTime = getFormItemsValue(cardCode, 'leave_start_day_type').value
        let breastfeedingleaveway = getFormItemsValue(cardCode, 'breastfeedingleaveway').value
        let time, display, begintime, endtime, val, label, oldVal, startDayType, endDayType;
        switch (key) {
            case 'leaveoffbegintime':
                setFormItemsValue(cardCode, {
                    leaveoffshowbegindate: {
                        value
                    }
                })
                if (getFormItemsValue(cardCode, 'leaveoffendtime').value) falg = true;
            break;
            case 'leaveoffendtime':
                setFormItemsValue(cardCode, {
                    leaveoffshowenddate: {
                        value
                    }
                })
                if (getFormItemsValue(cardCode, 'leaveoffbegintime').value) falg = true;
            break;
            case 'leaveoffshowbegindate':
                setFormItemsValue(cardCode, {
                    leaveoffbegintime: {
                    value
                    }
                })
                // 半天假
                if (minTime && !breastfeedingleaveway) {
                    setItemsVisible(cardCode, {'leaveoff_start_day_type':true})
                    // 初始输入 自动默认带出 上午 标志
                    oldVal = getFormItemsValue(cardCode, 'leaveoff_start_day_type').value;
                    label = value.split(' ');
                    val = value.split(' ');
                    if (!oldVal) {
                        time = '08:00:00';
                        display = myLeave.json['6040-00001']; // 上午
                        label.splice(1, 1, display);
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {leaveoff_start_day_type: {value: '1', display}})
                        setFormItemsValue(cardCode, {
                            leaveoffbegintime: {
                                value: val.join(' '),
                                display: label.join(' ')
                            },
                            leaveoffshowbegindate: {
                                value: val.join(' ')
                            }
                        })
                    } else {
                        // 上午 下午标志 有值  回写到begintime或者endtime上 方便后端查询存储
                        time = oldVal === '2' ? '20:00:00' : '08:00:00';
                        display = oldVal === '2' ? myLeave.json['6040-00002'] : myLeave.json['6040-00001'];
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {
                            leaveoffbegintime: {
                                value: val.join(' '),
                                display: label.join(' ')
                            },
                            leaveoffshowbegindate: {
                                value: val.join(' ')
                            }
                        })
                    }
                    endtime = getFormItemsValue(cardCode, 'leaveoffshowenddate').value;
                    if (endtime) {
                        endDayType = getFormItemsValue(cardCode, 'leaveoff_end_day_type').value;
                        time = endDayType === '2' ? '20:00:00' : '08:00:00';
                        val = endtime.split(' ');
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {
                            leaveoffendtime: {value: val.join(' ')},
                            leaveoffshowenddate: {value: val.join(' ')},
                        });
                    }
                }
                if (getFormItemsValue(cardCode, 'leaveoffshowenddate').value) falg = true;
            break;
            case 'leaveoffshowenddate':
                    setFormItemsValue(cardCode, {
                        leaveoffendtime: {
                        value
                         }
                       })
                if (minTime && !breastfeedingleaveway) {
                    setItemsVisible(cardCode, {'leaveoff_end_day_type':true})
                    oldVal = getFormItemsValue(cardCode, 'leaveoff_end_day_type').value;
                    val = value.split(' ');
                    label = value.split(' ');
                    if (!oldVal) {
                        time = '08:00:00';
                        display = myLeave.json['6040-00001'] // 上午
                        val.splice(1, 1, time)
                        label.splice(1, 1, display)
                        setFormItemsValue(cardCode, {leaveoff_end_day_type: {value: '1', display}})
                        setFormItemsValue(cardCode, {
                            leaveoffendtime: {
                                value: val.join(' '),
                                display: label.join(' ')
                            },
                            leaveoffshowenddate: {
                                value: val.join(' ')
                            }
                        })
                    } else {
                        time = oldVal === '2' ? '20:00:00' : '08:00:00';
                        display = oldVal === '2' ? myLeave.json['6040-00002'] : myLeave.json['6040-00001'];
                        val.splice(1, 1, time);
                        label.splice(1, 1, display);
                        setFormItemsValue(cardCode, {
                            leaveoffendtime: {
                                value: val.join(' '),
                                display: label.join(' ')
                            },
                            leaveoffshowenddate: {
                                value: val.join(' ')
                            }
                        })
                    }
                    begintime = getFormItemsValue(cardCode, 'leaveoffshowbegindate').value;
                    if (begintime) {
                        startDayType = getFormItemsValue(cardCode, 'leaveoff_start_day_type').value;
                        time = startDayType === '2' ? '20:00:00' : '08:00:00';
                        val = begintime.split(' ');
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {
                            leaveoffbegintime: {value: val.join(' ')},
                            leaveoffshowbegindate: {value: val.join(' ')}
                        });
                    }
                }
                begintime = getFormItemsValue(cardCode, 'leaveoffshowbegindate').value;
                if (begintime) falg = true;

            break;
            case 'leaveoff_start_day_type':
            case 'leaveoff_end_day_type':
                startDayType = getFormItemsValue(cardCode, 'leaveoff_start_day_type').value;
                endDayType = getFormItemsValue(cardCode, 'leaveoff_end_day_type').value;
                begintime = getFormItemsValue(cardCode, 'leaveoffshowbegindate').value;
                if (begintime) {
                    time = startDayType === '2' ? '20:00:00' : '08:00:00';
                    val = begintime.split(' ');
                    val.splice(1, 1, time);
                    setFormItemsValue(cardCode, {
                        leaveoffbegintime: {value: val.join(' ')},
                        leaveoffshowbegindate: {value: val.join(' ')}
                    });
                }
                endtime = getFormItemsValue(cardCode, 'leaveoffshowenddate').value;
                if (endtime) {
                    time = endDayType === '2' ? '20:00:00' : '08:00:00';
                    val = endtime.split(' ');
                    val.splice(1, 1, time);
                    setFormItemsValue(cardCode, {
                        leaveoffendtime: {value: val.join(' ')},
                        leaveoffshowenddate: {value: val.join(' ')},
                    });
                }
                if (getFormItemsValue(cardCode, 'leaveoffendtime').value && getFormItemsValue(cardCode, 'leaveoffbegintime').value) falg = true;
            break;
        }

        if (falg) this.editAction(cardCode, key);
    }

    /**
     * @desc: 计算出可以填补单据的日期
     * @param {type}
     * @return: [Boolean]
     */
    isIncludeLimitDate = (limit, curDate) => {
        const { myLeave } = this.comp.props;
        limit = limit - 0
        if (limit === -1) {
            return false
        }
        let expectedDate = moment().subtract(limit, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        if (curDate < expectedDate) {
            toast({
                color: 'warning',
                content: myLeave.json['6040-000036']
            })
            return true
        }
    }

    /**
     * @desc: 对于半天假和整天的假别   时间控件不同，
     *        对应的元数据字段也不一致，需要全部处理到 开始时间和结束时间 元数据上
     *        通过开始时间和结束时间字段 触发编辑后事件回调
     *        新增单据填补时段的限制  20200311
     * @param {String} cardCode  表单的earaCode
     * @param {String} key   对应的字段
     * @param {String} value 不是编辑后事件中返回的对象，确切的值
     * @return:
     */
    handelLeavetime = (cardCode, key, value) => {
        const { myLeave, form } = this.comp.props;
        const { setFormItemsValue, getFormItemsValue } = form;
        // 单据填补时段限制的标志位
        let canscheduday = getFormItemsValue(cardCode, 'scheduday') && getFormItemsValue(cardCode, 'scheduday').value || -1
        console.log(canscheduday)
         // 是否触发计算时长的标志位
        let falg = false;
        let minTime = myLeave.minTime;
        let time, display, begintime, endtime, val, label, oldVal, startDayType, endDayType;
        setFormItemsValue(cardCode, {leaveday: {
            value: null,
            display: null
        }});
        // 有确切的值的情况 后端用 begintime 和 endtime 来计算时长，
        // 半天假或者天假 如果计算出实际时长，后端会返回一个后端计算时长的真正begintime 和 endtime
        // 需要保存单据的时候再把这个值赋值到begintime 和 endtime上方便日月报的计算单据时长
        if (value) {
            switch (key) {
                case 'begintime':
                    // 需要赋值 showbegindate 移动端显示单据详情用
                    setFormItemsValue(cardCode, {
                        showbegindate: {
                            value
                        }
                    })
                    if (this.isIncludeLimitDate(canscheduday, value)) {
                        setFormItemsValue(cardCode, {
                            begintime: {
                                value: '',
                                display: ''
                            }
                        })
                        return
                    }
                    if (getFormItemsValue(cardCode, 'endtime').value) falg = true;
                break;
                case 'endtime':
                    // 需要赋值 showenddate 移动端显示单据详情用
                    setFormItemsValue(cardCode, {
                        showenddate: {
                            value
                        }
                    })
                    if (this.isIncludeLimitDate(canscheduday, value)) {
                        setFormItemsValue(cardCode, {
                            begintime: {
                                value: '',
                                display: ''
                            }
                        })
                        return
                    }
                    if (getFormItemsValue(cardCode, 'begintime').value) falg = true;
                break;
                case 'showbegindate':
                    // 半天假
                    if (minTime === '1') {
                        // 初始输入 自动默认带出 上午 标志
                        oldVal = getFormItemsValue(cardCode, 'start_day_type').value;
                        label = value.split(' ');
                        val = value.split(' ');
                        if (!oldVal) {
                            time = '08:00:00';
                            display = myLeave.json['6040-00001']; // 上午
                            label.splice(1, 1, display);
                            val.splice(1, 1, time);
                            setFormItemsValue(cardCode, {
                                begintime: {
                                    value: val.join(' '),
                                    display: label.join(' ')
                                },
                                showbegindate: {
                                    value: val.join(' ')
                                },
                                start_day_type: {
                                    value: '1',
                                    display
                                }
                            })
                        } else {
                            // 上午 下午标志 有值  回写到begintime或者endtime上 方便后端查询存储
                            // '1' 上午 '2' 下午
                            time = oldVal === '2' ? '20:00:00' : '08:00:00';
                            display = oldVal === '2' ? myLeave.json['6040-00002'] : myLeave.json['6040-00001'];
                            val.splice(1, 1, time);
                            label.splice(1, 1, display);
                            setFormItemsValue(cardCode, {
                                begintime: {
                                    value: val.join(' '),
                                    display: label.join(' ')
                                },
                                showbegindate: {
                                    value: val.join(' ')
                                }
                            })
                        }
                        // 由于每次计算时长后 会把后端返回的实际时间赋值到begintime和endtime上，
                        // 所以下次计算时长时，开始时间和结束时间都要重新赋值
                        endtime = getFormItemsValue(cardCode, 'showenddate').value;
                        if (endtime) {
                            endDayType = getFormItemsValue(cardCode, 'end_day_type').value;
                            time = endDayType === '2' ? '20:00:00' : '08:00:00';
                            val = endtime.split(' ');
                            val.splice(1, 1, time);
                            setFormItemsValue(cardCode, {
                                endtime: {value: val.join(' ')},
                                showenddate: {value: val.join(' ')}
                            });
                        }
                    } else {
                        endtime = getFormItemsValue(cardCode, 'showenddate').value;
                        if (endtime) {
                            setFormItemsValue(cardCode, {
                                endtime: {value: this.fillDateTime(endtime, 0)},
                                showenddate: {value: this.fillDateTime(endtime, 0)}
                            });
                        }
                        setFormItemsValue(cardCode, {
                            begintime: {value: this.fillDateTime(value, 0)},
                            showbegindate: {value: this.fillDateTime(value, 0)}
                        })
                    }
                    if (this.isIncludeLimitDate(canscheduday, this.fillDateTime(value, 0))) {
                        setFormItemsValue(cardCode, {
                            showbegindate: {
                                value: '',
                                display: ''
                            },
                            begintime: {
                                value: '',
                                display: ''
                            }
                        })
                        return
                    }
                    if (getFormItemsValue(cardCode, 'endtime').value) falg = true;
                break;
                case 'showenddate':
                    if (minTime === '1') {
                        oldVal = getFormItemsValue(cardCode, 'end_day_type').value;
                        val = value.split(' ');
                        label = value.split(' ');
                        if (!oldVal) {
                            time = '08:00:00';
                            display = myLeave.json['6040-00001'] // 上午
                            val.splice(1, 1, time)
                            label.splice(1, 1, display)
                            setFormItemsValue(cardCode, {
                                endtime: {
                                    value: val.join(' '),
                                    display: label.join(' ')
                                },
                                showenddate: {
                                    value: val.join(' ')
                                },
                                end_day_type: {
                                    value: '1',
                                    display
                                }
                            })
                        } else {
                            time = oldVal === '2' ? '20:00:00' : '08:00:00';
                            display = oldVal === '2' ? myLeave.json['6040-00002'] : myLeave.json['6040-00001'];
                            val.splice(1, 1, time);
                            label.splice(1, 1, display);
                            setFormItemsValue(cardCode, {
                                endtime: {
                                    value: val.join(' '),
                                    display: label.join(' ')
                                },
                                showenddate: {
                                    value: val.join(' ')
                                }
                            })
                        }
                        begintime = getFormItemsValue(cardCode, 'showbegindate').value;
                        if (begintime) {
                            startDayType = getFormItemsValue(cardCode, 'start_day_type').value;
                            time = startDayType === '2' ? '20:00:00' : '08:00:00';
                            val = begintime.split(' ');
                            val.splice(1, 1, time);
                            setFormItemsValue(cardCode, {
                                begintime: {value: val.join(' ')},
                                showbegindate: {value: val.join(' ')}
                            });
                        }
                    } else {
                        begintime = getFormItemsValue(cardCode, 'showbegindate').value;
                        if (begintime) {
                            setFormItemsValue(cardCode, {
                                begintime: {value: this.fillDateTime(begintime, 0)},
                                showbegindate: {value: this.fillDateTime(begintime, 0)}
                            });
                        }
                        setFormItemsValue(cardCode, {
                            endtime: {value: this.fillDateTime(value, 0)},
                            showenddate: {value: this.fillDateTime(value, 0)}
                        });
                    }
                    if (this.isIncludeLimitDate(canscheduday, this.fillDateTime(value, 0))) {
                        setFormItemsValue(cardCode, {
                            showenddate: {
                                value: '',
                                display: ''
                            },
                            endtime: {
                                value: '',
                                display: ''
                            }
                        })
                        return
                    }
                    begintime = getFormItemsValue(cardCode, 'begintime').value;
                    if (begintime) falg = true;

                break;
                case 'start_day_type':
                case 'end_day_type':
                    startDayType = getFormItemsValue(cardCode, 'start_day_type').value;
                    endDayType = getFormItemsValue(cardCode, 'end_day_type').value;
                    begintime = getFormItemsValue(cardCode, 'showbegindate').value;
                    if (begintime) {
                        time = startDayType === '2' ? '20:00:00' : '08:00:00';
                        val = begintime.split(' ');
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {
                            begintime: {value: val.join(' ')},
                            showbegindate: {value: val.join(' ')}
                        });
                    }
                    endtime = getFormItemsValue(cardCode, 'showenddate').value;
                    if (endtime) {
                        time = endDayType === '2' ? '20:00:00' : '08:00:00';
                        val = endtime.split(' ');
                        val.splice(1, 1, time);
                        setFormItemsValue(cardCode, {
                            endtime: {value: val.join(' ')},
                            showenddate: {value: val.join(' ')},
                        });
                    }
                    if (getFormItemsValue(cardCode, 'endtime').value && getFormItemsValue(cardCode, 'begintime').value) falg = true;
                break;
            }
        } else {
            let targeKey = ''
            if (key === 'showbegindate' || key === 'start_day_type') {
                targeKey = 'begintime';
            } else if (key === 'showenddate' || key === 'end_day_type') {
                targeKey = 'endtime';
            }
            setFormItemsValue(cardCode, {
                [targeKey]: {value: null, display: null}
            });
        }

        let type = getFormItemsValue(cardCode, 'pk_leave_type').value;
        let feedstatus = myLeave.feedStatus
        let  breastfeedingleaveday = getFormItemsValue(cardCode, 'breastfeedingleaveday')
        if (!type) falg = false
        if (feedstatus) {
            setFormItemsValue(cardCode, {
                leaveday: breastfeedingleaveday,
            });
        }
        if (falg && !feedstatus ) this.editAction(cardCode, 'begintime');
    }

     /**
     * @desc: 销差开始结束时间，校验及触发编辑后事件
     * @param {type}
     * @return:
     */
    handelTripofftime = (cardCode, key, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let falg = true;
        if (!getFormItemsValue(cardCode, 'tripoffendtime').value) falg = false;
        if (!getFormItemsValue(cardCode, 'tripoffbegintime').value) falg = false;
        if (falg) this.editAction(cardCode, 'tripoffendtime');
    }
    /**
     * @desc: 请假时间补充 时 分 秒  半天或者天假别 都会用到begintime、endtime 字段去计算时长，需要把时间copy到begintime字段上
     *        上午 统一添加 08:00:00 下午 统一添加 20:00:00
     *        整天的统一为 00:00:00  date类型控件选到的为当前时间精确到秒~~~
     * @param  value {String} 当前时间
     * @param  type {Number} 替换的类型 0 '00:00:00' 1 '08:00:00' 2 '20:00:00' 3 '23:59:59'
     * @return: 替换后的时间
     */
    fillDateTime = (value, type) => {
        const timeArr = ['00:00:00', '08:00:00', '20:00:00', '23:59:59'];
        let arr = value.split(' ');
        arr.splice(1, 1, timeArr[type])
        return arr.join(' ')
    }
    /**
     * @desc: 出差开始结束时间，校验及触发编辑后事件
     * @param {type}
     * @return:
     */
    handelOvertime = (cardCode, key, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let begin = getFormItemsValue(cardCode, 'overtimebegintime').value
        let end = getFormItemsValue(cardCode, 'overtimeendtime').value
        if (!begin || !end) return
        if (begin >= end) {
            toast({
                color: 'danger',
                content: myLeave.json['6040-000011']
            })
            setFormItemsValue(cardCode, {[key]: {value: null}})
            setItemsVisible(cardCode, {isallnight: false})
            return
        }
        this.isAllNight(begin, end);
        this.editAction(cardCode, key)
    }
     /**
     * @desc: 出差开始结束时间，校验及触发编辑后事件
     * @param {type}
     * @return:
     */
    handelTriptime = (cardCode, key, value) => {
        const { dispatch, myLeave, form } = this.comp.props;
        const { getAllFormValue, setFormItemsRequired, setItemsVisible, setFormItemsDisabled, setFormItemsValue, getFormItemsValue } = form;
        let falg = true;
        if (!getFormItemsValue(cardCode, 'tripendtime').value) falg = false;
        if (!getFormItemsValue(cardCode, 'tripbegintime').value) falg = false;
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
        const { dispatch, myLeave, form } = this.comp.props;
        const { getFormItemsValue, setFormItemsValue, setItemsVisible } = form;
        let begin = getFormItemsValue(cardCode, 'overtimebegintime').value
        let end = getFormItemsValue(cardCode, 'overtimeendtime').value
        // 单据填补时段限制的标志位
        let canscheduday = getFormItemsValue(cardCode, 'scheduday') && getFormItemsValue(cardCode, 'scheduday').value || -1
        if (this.isIncludeLimitDate(canscheduday, this.fillDateTime(attrCode === 'overtimeendtime' ? end : begin, 0))) {
            setFormItemsValue(cardCode, {
                [attrCode]: {
                    value: '',
                    display: ''
                },
                otapplylength: {
                    value: '',
                    display: ''
                }
            })
            setItemsVisible(cardCode, {isallnight: false})
            return
        }
        if (!begin || !end) return
        if (begin >= end) {
            setFormItemsValue(cardCode, {
                [attrCode]: {value: null},
                otapplylength: {
                    value: '',
                    display: ''
                }
            })
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
    /**
     * @desc: 判断所选时间是否跨夜
     * @param {Date} start 开始时间
     * @param {Date} end   结束时间
     * @return: 是否跨夜 [Boolean]gd
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
}
