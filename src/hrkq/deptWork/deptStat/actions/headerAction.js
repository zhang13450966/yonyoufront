import { promptBox, base } from 'nc-lightapp-front';
const { NCMessage } = base;
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
        const { dispatch, deptStat } = this.comp.props;
        dispatch({
            type: 'deptStat/update',
            payload: {
                showMode: 'list',
                headerTitle: deptStat.lang['hrkq-0000126']
            }
        })
    }
    /**
     * @desc: 按钮时间注册回调函数
     * @param {type} 
     * @return: 
     */
    headerButtonClick = async (props, btncode) => {
        const { dispatch, deptStat, form } = this.comp.props
        let formCode = deptStat.activeTab + '_card'
        let tableCode = deptStat.activeTab + '_list'
        switch (btncode) {
            case 'head_query':
                dispatch({
                    type: 'deptStat/update',
                    payload: {
                        [deptStat.activeTab + 'PageInfo']: Object.assign({}, deptStat[deptStat.activeTab + 'PageInfo'], {
                            pageIndex: 1
                        })
                    }
                })
                this.searchAction(deptStat.activeTab, tableCode);
            break;
            case 'head_refresh': 
            this.searchAction(deptStat.activeTab, tableCode);
            break;
        }
    }
    
    searchAction = async (key, tableCode) => {
        const { dispatch, deptStat } = this.comp.props;
        let res = await dispatch({
            type: 'deptStat/queryListAction',
            payload: {
                key,
                beginDate: deptStat.beginValue,
                endDate: deptStat.endValue
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
        const { dispatch, deptStat, editTable } = this.comp.props
        editTable.setTableData(tableCode, data)
        dispatch({
            type: 'deptStat/update',
            payload: {
                [deptStat.activeTab + 'PageInfo']: data.pageInfo
            }
        })
    }

    /**
     * @desc: 显示附件管理
     * @param {type} 
     * @return: 
     */
    showUploader = (ev) => {
        const { dispatch } = this.comp.props;
        dispatch({
            type: 'deptStat/update',
            payload: {
                showUploader: true
            }
        })
    }
    onBeginValueChange = (date) => {
        const { dispatch } = this.comp.props;
        dispatch({
            type: 'deptStat/update',
            payload: {
                beginValue: date
            }
        })
    }

    onEndValueChange = (date) => {
        const { dispatch } = this.comp.props;
        dispatch({
            type: 'deptStat/update',
            payload: {
                endValue: date
            }
        })
    }
    didUpdate = () => {
        const { button, deptStat } = this.comp.props
        button.setButtonsVisible({
            head_query: deptStat.showMode === 'list',
            head_refresh:  deptStat.showMode === 'list',
            head_file:  deptStat.showMode === 'card',
        })
    }
}