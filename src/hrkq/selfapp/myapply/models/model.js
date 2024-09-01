import { languageCreateUIDOM, hrAjax} from 'src/hrpub/common/utils/utils';
import CommonModel from 'src/hrpub/common/model';
import { getCurMonthEnd, getCurMonthStart } from '../util/util.js';
import { getAppPageConfig } from 'src/hrpub/common/utils/utils';
const {appcode, pagecode} = getAppPageConfig()

class Model extends CommonModel {
    constructor(props) {
        super(props);
    }
    name = 'myLeave'
    
    data = {
        durationObject:{},
        feedStatus: false, //是否是哺乳假
        name: '请假',
        saveStyle: '',
        json: {},
        showMode: 'list',
        headerTitle: '',
        subTitle: '补考勤申请',
        isEdit: true,
        templateInited: false,
        config: {
            appcode,
            pagecode
        },
        buttons: [],
        context: {},
        leavePageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        leaveoffPageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
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
        tripoffPageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        outsidePageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        attendancePageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: null
        },
        mutilLang:  {
            moduleId : "60656040",
            domainName : "hrkq"
        },
        activeTab: '', // attendance
        clientHeight: '',
        clientWidth: '',
        showUploader: false,
        groupLists: [],
        billId: '', //  当前的单据id
        approvestatus: null,
        minTime: '', // 最小请假时间
        isattachment: '0', // 是否需要上传附件
        excessLength: '0', // 超过多少天或者小时后才上传附件
        showApproveDetail: false,
        lang: {},
        beginValue: getCurMonthStart(),
        endValue: getCurMonthEnd(),
        assignedDisplay: false, //指派弹窗 是否显示
        assignedData: null, //指派弹窗数据
        visibleList: []
    }

    sync = {
        ...this.sync
    }

    async = {
        deleteDrAction (dispatch, getState, {key, pk, pk_group}) {
            let url = `/nccloud/hrkq/${key}/DeleteDrAction.do`;
            let body = {}
            body.pk= pk
            body.pk_group = pk_group
            return hrAjax({
                url,
                body
            })
        },
        queryByIdAction (dispatch, getState, { key, pk}) {
            let url = `/nccloud/hrkq/${key}/QueryByIdAction.do`;
            let body = {}
            if (key === 'tripoff'){
                body['pk_'+ key.slice(0,-3)] = pk
            } 
            if (key === 'leaveoff'){
                body['pk_'+ key.slice(0,-3)] = pk
            } 
            return hrAjax({
                url,
                body
            })
        },
        queryListAction (dispatch, getState, { beginDate, endDate, key }) {
            let myLeave = getState().myLeave
            let url = `/nccloud/hrkq/${key}/QueryListAction.do`;
            return hrAjax({
                url,
                body: {
                    beginDate,
                    endDate,
                    pageInfo: myLeave[myLeave.activeTab + 'PageInfo']
                }
            })
        },
        AddAction (dispatch, getState, { key, operat, pk_other = '' }) {
            let url = `/nccloud/hrkq/${key}/DefaultAction.do`;
            let body = {operat}
            if (pk_other){
               body.pk_other = pk_other
            } 
            return hrAjax({
                url,
                body
            })
        },
        languageCreateUIDOM (dispatch, getState, payload) {
            const callback = payload.callback
            const states = getState()
            const {config, mutilLang} = states.myLeave
            languageCreateUIDOM(payload)({...config}, {...mutilLang}, callback)
        },
        saveBillAction (dispatch, getState, { key, formData, formCode,durationObject }) {
            let body = durationObject ? {formData,durationObject} : {formData}
            let url = `/nccloud/hrkq/${key}/SaveAction.do`;
            return hrAjax({
                url,
                body: body,
                delayTime: 1
            })
        },
        submitBillAction (dispatch, getState, { key, pk, content }) {
            let url = `/nccloud/hrkq/${key}/CommitAction.do`;
            return hrAjax({
                url,
                body: {pk, content},
                delayTime: 1
            })
        },
        deleteAction (dispatch, getState, {activeTab, pk}) {
            let url = `/nccloud/hrkq/${activeTab}/DeleteAction.do`;
            return hrAjax({
                url,
                body: {pk}
            })
        },
        recallAction (dispatch, getState, { key, pk }) {
            let url = `/nccloud/hrkq/${key}/ReCallAction.do`;
            return hrAjax({
                url,
                body: {pk}
            })
        },
        afterEditCard (dispatch, getState, payload) {
            const states = getState();
            const {activeTab} = states.myLeave
            let url = `/nccloud/hrkq/${activeTab}/HeadAfterEditAction.do`;
            return hrAjax({
                url,
                body: payload
            })
        },
        queryBillAttachment (dispatch, getState, { billId }) {
            let url = `/nccloud/platform/attachment/query.do`;
            return hrAjax({
                url,
                body: {
                    billId,
                    fullPath: billId,
                    uploadTrpe: "0"
                }
            })
        },
        queryConfig (dispatch, getState, { billId }) {
            let url = `/nccloud/hrkq/attendance/queryConfig.do`;
            return hrAjax({
                url,
                body: {
                    billId,
                    fullPath: billId,
                    uploadTrpe: "0"
                }
            })
        },
    }
}

export default new Model()
