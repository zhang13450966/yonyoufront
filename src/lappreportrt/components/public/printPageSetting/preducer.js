import {
    CHANGE_TRIGGER,
    CHANGE_OPEN_PLAN,
    CHANGE_OPEN_SETTING,
    CHANGE_PLAN_LISTS,
    CHANGE_PLAN_CODE,
    CHANGE_LANGINFO,
    SET_PRINT_PARAMS,
    CHANGE_DEFAULT_PLAN_CODE,
    SET_REPORT_ID,
    IS_PRINT,
} from "./constants";

function preducer(state, action) {
    switch (action.type) {
        //更改启动状态
        case CHANGE_TRIGGER:
            return { ...state, trigger: action.data };
        // 设置reportId
        case SET_REPORT_ID:
            return { ...state, reportId: action.data };
        //更改打开方案弹窗状态
        case CHANGE_OPEN_PLAN:
            return { ...state, openPlan: action.data };
        //更改打开打印设置弹窗状态
        case CHANGE_OPEN_SETTING:
            return { ...state, openSetting: action.data };
        //更改打开打印设置弹窗状态
        case CHANGE_PLAN_LISTS:
            return { ...state, planLists: action.data };
        // 更改当前方案编码
        case CHANGE_PLAN_CODE:
            return { ...state, planCode: action.data };
        // 更改当前方案编码
        case CHANGE_DEFAULT_PLAN_CODE:
            return { ...state, defaultPlanCode: action.data };
        // 更改多语模板数据和当前语种
        case CHANGE_LANGINFO:
            return { ...state, ...action.data };
        // 更改当前方案编码
        case SET_PRINT_PARAMS:
            return { ...state, printParams: action.data };
        case IS_PRINT:
            return { ...state, isPrint: action.data };
    }
}

export default preducer;
