import emitter from '../actions/emitterAction';

export default class ListAction {
    constructor(comp) {
        this.comp = comp;
    }

    handlePageIndexChange = (pageIndex, emitType) => {
        const { dispatch, deptStat } = this.comp.props
        let pageInfo = deptStat.activeTab + 'PageInfo'
        dispatch({
            type: 'deptStat/update',
            payload: {
                [pageInfo]: Object.assign({}, deptStat[pageInfo], {
                    pageIndex
                })
            }
        })
        emitter.emit('searchData:' + emitType)
    }

    handlePageSizeChange = (pageSize, emitType) => {
        const { dispatch, deptStat } = this.comp.props
        let pageInfo = deptStat.activeTab + 'PageInfo'
        dispatch({
            type: 'deptStat/update',
            payload: {
                [pageInfo]: Object.assign({}, deptStat[pageInfo], {
                    pageSize
                })
            }
        })
        emitter.emit('searchData:' + emitType)
        // this.queryListAction()
    }

    queryListAction = () => {
        const { dispatch, deptStat, editTable } = this.comp.props;
        let { beginDate, endDate, defaultDept } = deptStat;
        let tableCode = deptStat.activeTab + '_list';
        dispatch({
            type: 'deptStat/queryListAction',
            payload: {
                key: deptStat.activeTab,
                beginDate,
                endDate,
                deptid: defaultDept
            }
        }).then(res => {
            if (res.success) {
                if (res.data) {
                    editTable.setTableData(tableCode, res.data[tableCode]);
                    dispatch({
                        type: 'deptStat/update',
                        payload: {
                            [deptStat.activeTab + 'PageInfo']: res.data[tableCode].pageInfo
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
        const { dispatch, deptStat, form } = this.comp.props;
        let formCode = deptStat.activeTab + '_card';
        const { setFormStatus, setAllFormValue, getAllFormValue, EmptyAllFormValue, getFormItemsValue, setFormItemsValue } = form;
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
            let minunit = getFormItemsValue(formCode, 'minunit').value;
            setFormItemsValue(formCode, {
                [dayKey]: {
                    display: record.values[dayKey].value + record.values['minunit'].display,
                    value: record.values[dayKey].value
                },
                'isrevoked': {
                    display: record.values['isrevoked'].value ? deptStat.lang['hrkq-0000082'] : deptStat.lang['hrkq-0000083'],
                    value: record.values['isrevoked'].value
                }
            });
            if (formCode === 'leave_card') {
                setFormItemsValue(formCode, {
                    begintime: {
                        display: this.formatDisplayDate(record, 'begintime'),
                        value: record.values['begintime'].value
                    },
                    endtime: {
                        display: this.formatDisplayDate(record, 'endtime'),
                        value: record.values['endtime'].value
                    }
                })
            }
        }
        if (formCode === 'overtime_card') {
            setFormItemsValue(formCode, {otapplylength: {display: record.values['otapplylength'].value + deptStat.lang['hrkq-0000064'], value: record.values['otapplylength'].value}});
        }
        dispatch({
            type: 'deptStat/update',
            payload: {
                showMode: 'card',
                billId: getFormItemsValue(formCode, 'pk_' + deptStat.activeTab).value,
                headerTitle: deptStat.subTitle
            }
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
                return record.values[attrcode].value.slice(0, -9);
            }
        }
    }
    /**
     * @desc: 根据minTime 和 minunit 来初始化不同的时间控件
     * @param {String} minTime 最小请假时间  1  2
     * @param {String} minunit 请假单位   1 小时  2 天
     * @return:
     */
    initCardMeta = (minTime='1', minunit='1', formCode) => {
        const { dispatch, deptStat, form } = this.comp.props;
        const { setItemsVisible, setAllFormValue, EmptyAllFormValue, getFormItemsValue } = form;
        let obj = {}
        let flag = minunit === '1';
        let flag1 = minunit === '2'
        let flag2 = minunit === '2' && minTime === '1'
        if (formCode === 'leave_card') {
            obj = {
                begintime: flag,
                endtime: flag,
                showbegindate: flag1,
                showenddate: flag1,
                start_day_type: flag2,
                end_day_type: flag2
            }
        }
        setItemsVisible(formCode, obj)
    }

    didMount = () => {
        this.queryListAction()
    }
}