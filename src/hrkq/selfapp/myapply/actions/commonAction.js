
export default class MainAction {

    constructor(comp) {
        this.comp = comp;
    }

    tabChange = (key) => {
        const { dispatch, editTable } = this.comp.props
        let tableCode = key + '_list'
        dispatch({
            type: 'myLeave/update',
            payload: {
                activeTab: key
            }
        })
        dispatch({
            type: 'myLeave/queryListAction',
            payload: {
                key,
                beginDate: '',
                endDate: ''
            }
        }).then(res => {
            if (res.success) {
                let dataList = res.data && res.data[tableCode] || []
                /*if (tableCode === 'attendance_list') {
                    res.data[tableCode].rows && res.data[tableCode].rows.forEach(row => {
                        row.values['fill_datetime'] = row.values['fill_date'];
                        row.values['fill_time'].value = row.values['fill_date'].value.split(' ')[1];
                    })
                }*/
                editTable.setTableData(tableCode, dataList)
                dispatch({
                    type: 'myLeave/update',
                    payload: {
                        pageInfo: res.data && res.data.leave_list.pageInfo
                    }
                })
            }
        })
    }
}