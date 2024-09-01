import { hrAjax as proFetch } from 'src/hrpub/common/utils/utils';

export default {
    name: 'replacecalendar',
    data: {
        orgValue: null, // 人力资源组织
        language: {}, // 多语
        context: {}, // 上下文
        page: 'edit', // 当前页面， main主页面，add新增页面，edit修改页面
        addPageStatus: 'edit', // 新增页面的状态，edit编辑态，browse浏览态       
        fileManagerModalVisible: false, // 附件管理弹显示显示隐藏
        fileManagerBillId: '', // 传递给福建管理的id
        fromApprove: true, // 是否来自于审批中心的打开
        approveBillType: '', // 审批详情弹窗的billType
        approveBillId: '', // 审批详情弹窗的billId
        approveModalVisible: false, // 审批详情弹窗的显示和隐藏
        showOrgRefer: false, // 是否显示组织参照
        compositedisplay: false, //指派弹窗 是否显示
        compositedata: null, //指派弹窗数据
        compositepostdata: null,//指派弹窗确认事件传到后台数据
        pageHeight: 0, // 获取页面高度
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
    
        // 跳转到新增页面前进行验证
        checkToAddPage(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/entrymng/EntryAddAction.do',
                body: payload.postData
            });
        },
        // 新增页面编辑前
        formEditBefore(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hryf/entrymng/EntryBeforeEditAction.do',
                body: payload.postData,
                loading: false
            });
        },

        // 获取一条数据
        getBillDetail(dispatch, getState, payload) {
            return proFetch({
                url: '/nccloud/hrkq/replacecalendar/QueryByIdApproveAction.do',
                body: payload
            });
        }
    }
};