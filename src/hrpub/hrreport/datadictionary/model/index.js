import { hrAjax as proFetch } from 'src/hrpub/common/utils/utils';


export default {
    name: 'dd',

    data: {
        language: {},
        pageStatus: 'tree',
        currentTreePk: '',
        tableId: 'grid',
        parentNodes: []
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
        // 获取左树数据(不传参数)
        getTreeData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadic/HRDataDicQueryAction.do',
                body: payload.postData,
            });
        },
        // 获取表格数据
        getTableData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadic/HRDataDicQueryDetailAction.do',
                body: payload.postData,
            });
        },
        // 保存设置数据
        saveSettingData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadic/HRDataDicSaveAction.do',
                body: payload.postData,
            });
        },
    }
}