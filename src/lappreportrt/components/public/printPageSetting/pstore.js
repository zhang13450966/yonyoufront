import React from "react";

export const pstore = {
    // 触发业务流程
    trigger: false, //启动程序，待定
    reportId: "", //reportId
    openPlan: false, //展示方案弹窗
    openSetting: false, //展示打印设置弹窗
    planLists: [], //方案列表
    planCode: "defaultCode",
    defaultPlanCode: "defaultCode",
    langseq: "1", //当前语种
    langinfo: [], //当前多语模板
    printParams: {}, //打印参数
    isPrint: false,
};

export const Pcontext = React.createContext(pstore);
