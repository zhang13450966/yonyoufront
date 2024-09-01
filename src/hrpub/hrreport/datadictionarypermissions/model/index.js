import { hrAjax as proFetch } from 'src/hrpub/common/utils/utils';


export default {
    name: 'ddp',

    data: {
        language: {},
        addModalVisible: false,
        currentTreePk: '',
        stepsCurrent: 0,
        tableId: 'grid',
        parentNodes: [],
        activeKey: "role",
        roleLeftDatas: [],
        userLeftDatas: [],
        rightList: [],
        transData: [],
        HRDataDicSort: [],
        rightList1: [], // 第二步Hr信息集右边的数据
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
         // 获取左树数据
         getTreeData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadicpower/HRDataDicPowerQueryAction.do',
                body: payload.postData,
            });
        },
        // 获取表格数据
        getTableData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadicpower/HRDataDicPowerQueryDetailAction.do',
                body: payload.postData,
            });
        },
        // 保存
        saveAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadicpower/HRDataDicPowerSaveAction.do',
                body: payload.postData,
            });
        },
        // 新增
        addAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadicpower/HRDataDicPowerAddAction.do',
                body: payload.postData,
            });
        },
        // 删除
        delAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrdatadicpower/HRDataDicPowerDeleteAction.do',
                body: payload.postData,
            });
        },
    }
}