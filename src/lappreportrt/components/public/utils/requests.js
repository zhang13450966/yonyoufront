import { ajax } from "nc-lightapp-front";

//数据视图，常规视图 切换
export const viewModelRequest = (app) => (reportViewState) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/reportChangeView.do",
            data: {
                pk_report: app.commonParams.pk_report,
                opents: app.commonParams.opents,
                reportViewState,
            },
            success: (res) => {
                resolve(true);
            },
        });
    });
};

//打印鉴权
export const printAuthRequest = (data = {}) => {
    return new Promise((resolve) => {
        // ajax({
        //     url: "/nccloud/report/widget/lightreportprintauthoritycheck.do",
        //     data,
        //     success: (res) => {
        //         resolve(true);
        //     },
        // });
        resolve(true);
    });
};

//获取筛选数据
export const filterInfoRequest = (data = {}) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_filterInfo.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
};

//筛选
export const filterRequest = (data = {}) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_filter.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
};

//明细汇总
export const detailOrCountRequest = (data = {}) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_onlydetailorcount.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
};

//分页
export const turnPageRequest = (data = {}) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_turnpage.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
};

//重置列宽
export const resetWidthRequest = (data = {}) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_resetwidth.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
};

//排序
export const sortRequest = (data = {}) => {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_sort.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
};

//联查单据接口
export function getDrillInfo(data) {
    return new Promise((reslove) => {
        ajax({
            url: "/nccloud/report/widget/billdrill.do",
            data,
            success: (res) => {
                reslove(res.data);
            },
        });
    });
}

export function saveGraphicSliderWidth(width) {
    const { pk_report, opents } = this.commonParams;
    ajax({
        url: "/nccloud/report/widget/saveStoryBoardPreviewWidth.do",
        data: {
            width: width.toString(),
            pk_report,
            opents,
        },
        success: (res) => {},
    });
}

//侧边栏刷新图表
export function refreshGraphic(data) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/graphicbeforerefreshaction.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
            error: (err) => {
                console.log(555555, err);
            },
        });
    });
}

//侧边栏刷新报表
export function refreshReport(data) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightreport_reportdrill.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//显示隐藏行号列标
export function toggleCoordinate(data) {
    ajax({
        url: "/nccloud/report/widget/dohidecoordinateinfo.do",
        data,
        success: (res) => {},
    });
}

//获取初始化数据
export function getInitParams({
    url = "/nccloud/report/widget/lightreport_query.do",
    data,
}) {
    return new Promise((resolve) => {
        ajax({
            url,
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//获取订阅历史
export function getSubScribHistory(pk_task_instance) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/lightbq/showsubscribgehistory.do",
            data: { pk_task_instance },
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//查询接口
export function getSearchData({ url, data }) {
    return new Promise((resolve) => {
        ajax({
            url: url || "/nccloud/report/widget/lightreport_querydata.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//实时分享状态接口
export function getShareStatusData({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/querysharetask.do",
            data,
            loading: false,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//定时分享状态数据
export function getTimeTimingShareInformationList({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/timingShareInformationAction.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//获取分享状态数据
export function getShareStatusCenterData(data) {
    return Promise.all([
        getShareStatusData(data),
        getTimeTimingShareInformationList(data),
    ]);
}

//订阅历史
export function getShareHistoryData({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/lightbq/singlerepsubscribetaskhistory.do",
            data,
            loading: false,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//获取未读消息数量
export function getNotReadMessageCount({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/getNotReadMessageCount.do",
            data,
            loading: false,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

//定时分享查看消息状态
export function getTimeMessageList({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/realTimeShareMessageListAction.do",
            data,
            loading: false,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

export function getMessageCenterData(data) {
    return Promise.all([getTimeMessageList(data), getShareHistoryData(data)]);
}

//修改状态
export function changeMessageStatus({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/changeMessageStatus.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}

export function downloadAtta(pk_doc, filename) {
    let downaction = `${location.origin}/nccloud/riart/message/download.do`;
    let params = {
        pk_doc: [pk_doc],
        filename: [filename],
        name: [filename],
        html: true,
    };
    let data = { pk_doc: pk_doc, filename: filename, name: filename };

    let $form = document.createElement("form");
    $form.target = "";
    $form.method = "POST";
    $form.action = downaction; //坑爹的宗志强。实现类：MessageAttachDownloadAction
    $form.type = "hidden";
    for (let key in data) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        $form.appendChild(input);
    }
    document.body.appendChild($form);
    $form.submit(); //此处手动发起http请求，让浏览器自己处理返回的字节流。
    document.body.removeChild($form);
}

//获取侧边栏表头数据
export function getReportFormatQuery({ data }) {
    return new Promise((resolve) => {
        ajax({
            url: "/nccloud/report/widget/lightReportFormatQuery.do",
            data,
            success: (res) => {
                resolve(res.data);
            },
        });
    });
}
