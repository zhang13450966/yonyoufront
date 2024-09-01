
import proFetch from '../../../utils/project-fetch';

import mockData from './mock';
import treeJson from './tree.json';
import subTreeJson from './subTree.json';

export default {
    data: {
        context: {},
        language: {},
        pageIns: null,
        pk_ncc_queryscheme:'',
        currentTreeData: '', // 左树选中的值
        queryLeftData: [], // 查询弹窗穿梭狂的左列表
        queryRightData: [], // 穿梭狂右数据
        leftChecked: [], // 左侧被选中数据
        rightChecked: [], // 右侧被选中数据
        currentQueryForm: '', // 当前弹出的是哪个查询form
        ifHideSearchModal: false, // 是否在点击查询的时候隐藏查询
        ifInit: true, // 因为初始化的时候是需要走本地接口，查询走平台接口，偏偏都在一个生命周期内，所以判断一下，机智如我
        folderTreeList: [],
        hasShowQueryCondition: false, // 标记是否显示过查询条件2
        showCustomSearchBody: false, // 点击报表的查询，是否弹出自定义的查询内容，如果是，自定义的内容在action的renderCustomSearchBody方法里
        showAdvSearchPlanBtn: true, // 是否显示保存方案按钮
        customFormData: [], // 自定义查询弹窗内容的模版信息数据
        customFormValue: {}, // 自定义查询弹窗内容填写的值
        customReferValue: {
            refpk: '',
            refcode: ''
        }, // 自定义查询弹窗内容的参照的值
        pageHeight: 'auto', // 页面高度
        searchMeta:{},
        searchProps:{},
        customQueryCondition: {}, // 自定义参照的参数
        refQueryConditionMap: {}, // 参照的queryCondition的对应关系，由ReportParamQueryAction接口获得
        refParams: {}, //用来存查询条件中的参照
    },
    sync: {
        update: (state, payload) => {
            return {
                ...state,
                ...payload
            }
        }
    },
    async: {
        // 获取左树数据
        getTreeData(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            let postData = {};

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }

            return proFetch({
                url: '/nccloud/hr/rpt/FolderQueryAction.do',
                body: postData
            });
        },
        // 左树获取子树数据
        loadSubTreeData(dispatch, getState, payload) {

            let state = getState()['reportQuery'];
            let postData = {
                pk_dir: payload.pk_folder
            };

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }
            return proFetch({
                url: '/nccloud/hr/rpt/ReportQueryAction.do',
                body: postData
            });
        },
        // 获取报表数据
        getReportData(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            let pk_report = payload.pk_report || state.currentTreeData
            if (Array.isArray(pk_report)) {
                pk_report = pk_report.join(',')
            }
            let postData = {
                pk_report: pk_report
            };

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }

            return proFetch({
                url: '/nccloud/hr/rpt/ReportQueryOneAction.do',
                body: postData
            });
        },
        // 表单编辑前事件
        beforeEditForm(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            let postData = payload.postData;

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }

            return proFetch({
                url: '/nccloud/hr/rpt/WaRptQryBeforeEditAction.do',
                body: postData
            });
        },
        // 表单编辑后事件
        afterEditForm(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            let postData = payload.postData;

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }
            return proFetch({
                url: '/nccloud/hr/rpt/WaRptQryAfterEditAction.do',
                body: postData
            });
        },
        // 自定义弹出框获取最初模版数据
        getCustomModalData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hr/rpt/ReportFetchParamAction.do',
                body: {
                    pk_report: payload['pk_report']
                }
            });
        },
        // 获取报表自定义弹窗里的参照的路径
        getReferRefPath(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            return proFetch({
                url: '/nccloud/hr/rpt/ReportParamQueryAction.do',
                body: {
                    pk_org: state.pk_org||state.orgValue&&state.orgValue.refpk,
                    refcode: payload.refCode
                }
            });
        },
        // 新增方案
        addWaQSAction(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            let postData = payload.postData;

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }

            return proFetch({
                url: '/nccloud/hr/rpt/AddWaQSAction.do',
                body: postData
            });
        },
        // 查询方案
        queryWaQSAction(dispatch, getState, payload) {
            let state = getState()['reportQuery'];
            let postData = payload.postData;

            if(state.orgValue) {
                postData['pk_org'] = state.orgValue.refpk
            }

            return proFetch({
                url: '/nccloud/hr/rpt/QueryWaQSAction.do',
                body: postData
            });
        }
    }
};