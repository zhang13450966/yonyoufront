import { ajax, formDownload } from "nc-lightapp-front";
import {IS_PRINT, CHANGE_TRIGGER, CHANGE_OPEN_PLAN, CHANGE_OPEN_SETTING, CHANGE_PLAN_LISTS, CHANGE_PLAN_CODE, CHANGE_LANGINFO, SET_PRINT_PARAMS, CHANGE_DEFAULT_PLAN_CODE, SET_REPORT_ID } from "./constants";

/**
 * 
 * @param {是否启动业务流程} trigger 
 * @returns 
 */
export function changeTrigger(trigger) {
    return {
        data: trigger,
        type: CHANGE_TRIGGER,
    }
}

/**
 * 设置reportId
 * @param {*} id 
 * @returns 
 */
export function setReportId(id) {
    return {
        data: id,
        type: SET_REPORT_ID
    }
}

/**
 * 开启选择方案弹窗
 * @param {是否开启弹窗} isOpen 
 * @returns 
 */
export function changeOpenPlan(isOpen) {
    return {
        data: isOpen,
        type: CHANGE_OPEN_PLAN,
    }
}

export function isPrint(isPrint) {
    return {
        data:isPrint,
        type: IS_PRINT,
    }
}
/**
 * 开启打印设置弹窗
 * @param {是否开启弹窗} isOpen 
 * @returns 
 */
export function changeOpenSetting(isOpen) {
    return {
        data: isOpen,
        type: CHANGE_OPEN_SETTING,
    }
}

/**
 * 更改方案列表数据
 * @param {reportId} reportId 
 * @returns 
 */
export function changePlanLists(planLists) {
    return {
        data: planLists,
        type: CHANGE_PLAN_LISTS
    }
}

/**
 * 更改当前选择的方案编码
 * @param {方案编码} code 
 * @returns 
 */
export function changePlanCode(code) {

    return {
        data: code,
        type: CHANGE_PLAN_CODE
    }
}

/**
 * 更改进入的方案编码
 * @param {方案编码} code 
 * @returns 
 */
export function changeDefaultPlanCode(code) {

    return {
        data: code,
        type: CHANGE_DEFAULT_PLAN_CODE
    }
}




/**
 * 更改多语模板
 * @param {*} langinfo 
 * @returns 
 */
export function changeLanginfo(langinfo) {

    const { langseq } = langinfo.find(lang => lang.defaultlang) || {};

    const meta = langinfo.map((item) => {
        const { langseq, langcode, languagetype, langdisplayname } = item;
        return {
            index: langseq,
            languageCode: langcode,
            languageType: languagetype,
            langdisplayname
        }
    })
    return {
        type: CHANGE_LANGINFO,
        data: { langinfo: meta, langseq }
    };

}

/**
 * 设置全局打印参数
 * @param {*} printParams 
 * @returns 
 */
export function setPrintParams(printParams) {
    return {
        data: printParams,
        type: SET_PRINT_PARAMS
    }
}

/***********************ajax***************************/

/**
 * 获取方案列表数据
 * @param {reportId} reportId 
 * @returns 
 */
export function getPlans(reportId = '1001Z010000000002M92') {

    const data = { reportId };

    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/printschemeselect.do",
            data,
            success: (res) => {
                if (res.success) {
                    resolve(res.data);
                }
            }
        });
    })

}

/**
 * 获取打印方案对应的明细数据
 * @param {*} reportId  
 * @param {方案编码} printCode 
 * @returns 
 */
export function getPlanDetail(reportId = '1001Z010000000002M92', printCode = 'defaultCode') {

    const data = { reportId, printCode };

    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/singleprintsetting.do",
            data,
            success: (res) => {
                if (res.success) {
                    resolve(res.data);
                }
            }
        });
    })

}

/**
 * 保存方案数据
 * @param {*} reportId 
 * @param {方案详细数据} planDetail 
 * @returns 
 */
export function savePlan(reportId = '1001Z010000000002M92', planDetail) {

    const data = { reportId, ...planDetail };

    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/printsettingsave.do",
            data,
            success: (res) => {
                if (res.success) {
                    resolve(res.success);
                }
            }
        });
    })
}


/**
 * 编辑打印方案名称
 * @param {*} reportId 
 * @param {方案编码} printCode 
 * @param {方案名称} printNames 
 * @returns 
 */
export function editPlan(reportId = '1001Z010000000002M92', printCode, printNames) {

    const data = { reportId, printCode, ...printNames };

    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/printschemesave.do",
            data,
            success: (res) => {
                if (res.success) {
                    resolve(res.success);
                }
            }
        });
    })
}

/**
 * 删除打印方案数据
 * @param {*} reportId 
 * @param {方案编码} printCode 
 * @returns 
 */
export function deletePlan(reportId = '1001Z010000000002M92', printCode) {

    const data = { reportId, printCode };

    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/printschemedel.do",
            data,
            success: (res) => {
                if (res.success) {
                    resolve(res.success);
                }
            }
        });
    })
}

/**
 * 打印接口
 * @param {*} reportId 
 * @param {*} printCode 
 * @returns 
 */
export function printAction(reportId = '1001Z010000000002M92', printCode, printParams, callback) {

    let params = { pk_report: reportId, printCode, ...printParams };

    params.printSet = params.printSet && JSON.stringify(params.printSet);

    callback(printCode);

    formDownload({
        params,
        url: "/nccloud/report/widget/printbuttonaction.do",
        enctype: 2,
        isCipher: true,
        previewInModal: true
    });
}

export function newPrintAction(reportId = '1001Z010000000002M92', printCode, printParams, callback) {

    let params = { pk_report: reportId, printCode, ...printParams };

    params.printSet = params.printSet && JSON.stringify(params.printSet);

    callback(printCode);

    formDownload({
        params,
        url:"/nccloud/report/widget/lightreport_ajaxexport.do",
        enctype: 2,
        isCipher: true,
        target: "_self",
    });
}


/********************工具方法******************** */
export function getLang(langseq, plan) {
    const { printCode, ...otherNames } = plan;
    const printNameKey = langseq - 1 == 0 ? 'printName' : 'printName' + langseq;
    const printName = otherNames[printNameKey];
    return printName;
}
