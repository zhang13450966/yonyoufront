import { languageCreateUIDOM, hrAjax} from 'src/hrpub/common/utils/utils';
import CommonModel from 'src/hrpub/common/model';
import { getCurMonthEnd, getCurMonthStart } from '../util/util.js';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const {appcode, pagecode} = getAppPageConfig()
class Model extends CommonModel {
    constructor(props) {
        super(props);
    }
    name = 'deptStat'

    data = {
        config: {
            appcode,
            pagecode
        },
        overtimePageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        tripPageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        leavePageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        monthPageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        dayPageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        mutilLang:  {
            moduleId : "hrkq0522",
            domainName : "hrkq"
        },
        lang: {},
        billid: '',
        billtype: '',
        showMode: 'list',
        activeTab: 'day',
        subTitle: '员工休假',
        headerTitle: '',
        clientHeight: '',
        clientWidth: '',
        showApproveDetail: false,
        deptOptions: [],
        defaultDept: '',
        beginDate: getCurMonthStart(),
        endDate: getCurMonthEnd(),
        deptAvailable: false,
        dayCol: [],
        dayData: [],
        monthCol: [],
        monthdata: [],
        tabs: ['day', 'month']
    }

    sync = {
        ...this.sync
    }

    async = {
        queryDeptDataAction (dispatch, getState) {
            let url = `/nccloud/hrkq/tsattendrpt/QueryMyDeptListAction.do`;
            return hrAjax({
                url,
                body: {}
            })
        },
        queryListAction (dispatch, getState, { beginDate, endDate, key, deptid, search, jobId, isIncludeSub }) {
            let url = `/nccloud/hrkq/${key}/QueryListAction.do`;
            let deptStat = getState().deptStat;
            return hrAjax({
                url,
                body: {
                    beginDate,
                    endDate,
                    pk_dept: deptid,
                    jobId,
                    name: search,
                    isIncludeSub,
                    pageInfo: deptStat[key + 'PageInfo']
                }
            })
        },
        queryDayListAction (dispatch, getState, { beginDate, endDate, key, deptid, search, jobId, isIncludeSub }) {
            let url = `/nccloud/hrkq/tsattendrpt/QueryDayRptAction.do`;
            let deptStat = getState().deptStat;
            let pageInfo = deptStat[key + 'PageInfo'];
            return hrAjax({
                url,
                body: {
                    beginDate,
                    endDate,
                    staffname: search,
                    deptid,
                    jobId,
                    isIncludeSub,
                    pageSize: pageInfo['pageSize'],
                    pageNum: pageInfo['pageIndex']
                }
            }).then(res => {
                if (res.success) {
                    if (res.data) {
                        dispatch({
                            type: 'deptStat/update',
                            payload: {
                                dayCol: res.data.title,
                                dayData: res.data.data.content,
                                dayPageInfo: {
                                    pageIndex: parseInt(res.data.data.number) + 1 + '',
                                    pageSize: res.data.data.size,
                                    total: res.data.data.totalElements
                                }
                            }
                        })
                    }
                }
            })
        },
        queryMonthListAction (dispatch, getState, { year, month, key, deptid, search, jobId, isIncludeSub }) {
            let url = `/nccloud/hrkq/tsattendrpt/QueryMonthRptAction.do`;
            let deptStat = getState().deptStat;
            let pageInfo = deptStat[key + 'PageInfo'];
            return hrAjax({
                url,
                body: {
                    year,
                    month,
                    deptid,
                    jobId,
                    staffname: search,
                    isIncludeSub,
                    pageSize: pageInfo['pageSize'],
                    pageNum: pageInfo['pageIndex']
                }
            }).then(res => {
                if (res.success) {
                    if (res.data) {
                        dispatch({
                            type: 'deptStat/update',
                            payload: {
                                monthCol: res.data.title,
                                monthData: res.data.data.content,
                                monthPageInfo: {
                                    pageIndex: parseInt(res.data.data.number) + 1 + '',
                                    pageSize: res.data.data.size,
                                    total: res.data.data.totalElements
                                }
                            }
                        })
                    }
                }
            })
        },
        languageCreateUIDOM (dispatch, getState, payload) {
            const callback = payload.callback
            const states = getState()
            const {config, mutilLang} = states.deptStat
            languageCreateUIDOM(payload)({...config}, {...mutilLang}, callback)
        },
    }

}
export default new Model()