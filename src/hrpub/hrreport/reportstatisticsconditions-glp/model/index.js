import { hrAjax as proFetch } from 'src/hrpub/common/utils/utils';


export default {
    name: 'rsc',

    data: {
        language: {},
        tableId: 'grid',
        serchCondition: {}, // 查询
        parentNodes: [],
        parentNodes1: [], // 弹框左侧
        currentTreePk: '',
        pk_datadic: '', // 弹窗左侧的树
        conTableData: {
            rows: []
        }, //弹窗右侧树数据
        addModalVisible: false,
        detailChecked: false,
        treeEditVisible: false,
        editTreeVisible: false,
        sqlContrl: '',
        areaValTotal: '',
        saveAreaValue: '', // 显示详情以后点击不显示 显示的值 保存显示之前的
        textareaRef: null,
        treeType: '', // 修改树还是新增
        sequence: 0, //序号控制
        currentPosition: null, // 光标位置
        state: '', // 增加 修改 复制
        readOnly: false, // 文本只可读
        searchModalVisible: false,
        pageInfo: {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            totalPage: 1
        },
        orgVal: null
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
                url: '/nccloud/hrpub/hrstatcond/HRStatCondSortQueryAction.do',
                body: payload.postData,
            });
        },
        // 获取表格数据
        getTableData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondQueryDetailAction.do',
                body: payload.postData,
            });
        },
        // 查询 （全查询）
        getAllData(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondQueryAction.do',
                body: payload.postData,
            });
        },
        // 保存
        saveAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondSaveAction.do',
                body: payload.postData,
            });
        },
        
        // 新增
        addAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondAddAction.do',
                body: payload.postData,
            });
        },
        // 修改
        editAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondEditAction.do',
                body: payload.postData,
            });
        },
        // 复制
        copyAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondCopyAction.do',
                body: payload.postData,
            });
        },
        // 删除
        delAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondDeleteAction.do',
                body: payload.postData,
            });
        },
        // 定位
        locateAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondLocateAction.do',
                body: payload.postData,
            });
        },
        // 编辑前事件
        beforeEditAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondBeforeEditAction.do',
                body: payload.postData,
            });
        },
         // 编辑后事件
         afterEditAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondAfterEditAction.do',
                body: payload.postData,
            });
        },
        // sql详情
        detailAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondDetailAction.do',
                body: payload.postData,
            });
        },
        // 增加/修改分类保存
        sortSaveAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondSortSaveAction.do',
                body: payload.postData,
            });
        },
        // 删除分类
        sortDelAction(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrpub/hrstatcond/HRStatCondSortDeleteAction.do',
                body: payload.postData,
            });
        },
        // 
    }
}