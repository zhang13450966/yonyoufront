import proFetch from '../../../../hrpub/common/utils/project-fetch'

export default {
    name: 'enterpriseGroup',
    data: {
        pageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            totalPage: 1
        }, //分页信息
        json: {}, //初始多语信息
        isApply: false,
        shwoTable: false,
        modelTitle: '新增',
        showModel: false,
        saveFun: '',
        imgBase64: '',
        pk_group: '',
        proname: '',
        profile: '',
        enablestate: '2',
        pk_orgprofile: ''
    },
    sync: {
        update(state, payload) {
            return {
                ...state,
                ...payload
            };
        }
    },
    async: {
        // 获取主页面表格数据
        getMainTableData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/orgprofile/QueryOrgProFileAction.do',
                body: payload.postData
            });
        },
        // 企业介绍保存操作
        orgProFileSaveAction (dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/orgprofile/OrgProFileSaveAction.do',
                body: payload.postData
            });
        },
        // 企业介绍删除操作
        orgProFileDeleteAction (dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/orgprofile/OrgProFileDeleteAction.do',
                body: payload.postData
            });
        },
        // 企业介绍启用/停用
        orgProFileEnableAction (dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/orgprofile/OrgProFileEnableAction.do',
                body: payload.postData
            });
        },
        // 企业介绍查询详情
        orgProFileQueryOneAction (dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/orgprofile/OrgProFileQueryOneAction.do',
                body: payload.postData
            });
        }
    }

}