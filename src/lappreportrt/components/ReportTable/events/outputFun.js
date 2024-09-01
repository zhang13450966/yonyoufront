import { toast, ajax, formDownload } from "nc-lightapp-front";
import Utils from "@public/utils";
import { printAuthRequest } from "@public/utils/requests";
import { getCurrentCol } from "./treeFun";
import pluginPrint from "./pluginPrint";
import { SEARCHID } from "@components/ReportTable/config";
const { langCheck } = Utils;

export const commomPrint = function (key) {
    if (key === "bigOutput") {
        //大数据导出
        return bigOutputFun.call(this);
    }
    // 打印导出
    let { pager, fileName } = this.state;
    const {
        ownReportParams = {},
        printExpendFun,
        printOther = [],
    } = this.props;
    const { excelPrintMaxRow, pdfPrintMaxRow } = this.initParams;

    const { FreeReport_QueryTreeVo, maxrow, reportType } = this.pageParams;

    if (reportType === "2" && key === "csv") {
        return toast({
            content: langCheck("reportMultiLang", "100301-000269"),
            color: "warning",
        }); /* 国际化处理： 无可用的打印模板。*/
    }

    //如果是树形展示的表，要加collapseValueArray参数，以便打印及所得
    const { isEnable } = this.treeParams.config;
    let collapseValueArray = "[]";
    if (isEnable) {
        collapseValueArray = JSON.stringify(getTreeParams.call(this));
    }

    const { allRowCount } = pager;

    let fileSuffix = ["print", "print_setting"].includes(key) ? "pdf" : key;

    let printData = {
        fileName: ownReportParams.reportName || fileName,
        fileSuffix,
        maxrow,
        FreeReport_QueryTreeVo,
        collapseValueArray,
        ...this.commonParams,
    };

    //领域自行打印
    if (printOther.length && printExpendFun) {
        let array = printOther.map((item) => item.key);
        if (array.includes(key)) {
            return templatePrint.call(this, key, printOther, printData);
        }
    }

    if (
        key == "xlsx" &&
        (allRowCount == -1 || +allRowCount >= +excelPrintMaxRow)
    ) {
        printAuthRequest({ type: "output" }).then((flag) => {
            this.showConfirm();
        });
        this.outputType = "0";
        return;
    } else {
        if (
            (allRowCount == -1 || +allRowCount >= +pdfPrintMaxRow) &&
            (key == "pdf" || key == "print")
        ) {
            printAuthRequest({ type: "output" }).then((flag) => {
                this.showConfirm();
            });
            this.outputType = "1";
            return;
        }
    }
    if (key !== "print") {
        if (key == "print_setting") {
            // 弹窗
            // key = 'pdf';
            this.printPageSettingRef.triggered(
                printData,
                "print_setting",
                this.commonParams.pk_report
            );
            return;
        } else if (key === "print_plugin") {
            pluginPrint.call(this, printData);
            return;
        }
        printAuthRequest({ type: "output" }).then((flag) => {
            toast({
                content: langCheck("reportMultiLang", "100301-000290"),
                color: "success",
            });
            if (key !== "xlsx" && key !== "pdf" && key !== "csv") {
                this.pageParams.nodekey = key;
                // 打印
                ajax({
                    url: "/nccloud/report/widget/lightreportgetpidaction.do",
                    data: {
                        nodekey: key,
                        appcode: this.commonParams.appcode,
                        FreeReport_QueryTreeVo,
                    },
                    success: (res) => {
                        let printModalArray = res.data;
                        if (printModalArray.length < 1) {
                            toast({
                                content: langCheck(
                                    "reportMultiLang",
                                    "100301-000014"
                                ),
                                color: "warning",
                            }); /* 国际化处理： 无可用的打印模板。*/
                        } else if (printModalArray.length == 1) {
                            templatePrint.call(
                                this,
                                printModalArray[0].templateid
                            );
                        } else {
                            this.setState({ outputModalData: printModalArray });
                            this.refs.outputModal.setState({
                                showOutputModal: true,
                            });
                        }
                    },
                });
            } else {
                if (key == "pdf") {
                    // 弹窗
                    // key = 'pdf';
                    this.printPageSettingRef.triggered(
                        printData,
                        "pdf",
                        this.commonParams.pk_report
                    );
                    return;
                }
                // 导出
                setTimeout(() => {
                    formDownload({
                        params: printData,
                        url: "/nccloud/report/widget/lightreport_ajaxexport.do",
                        enctype: 2,
                        isCipher: true,
                        target: "_self",
                    });
                }, 50);
            }
        });
    } else {
        // 111111
        if (key == "print") {
            // 弹窗
            // key = 'pdf';
            this.printPageSettingRef.triggered(
                printData,
                "print",
                this.commonParams.pk_report
            );
            return;
        }
        // 打印按钮
        setTimeout(() => {
            formDownload({
                params: printData,
                url: "/nccloud/report/widget/printbuttonaction.do",
                enctype: 2,
                isCipher: true,
                previewInModal: true,
            });
        }, 50);
    }
};

export const templatePrint = function (type, printOther = [], printData = {}) {
    const { fileName, pager } = this.state;
    const { FreeReport_QueryTreeVo, condition, nodekey = "" } = this.pageParams;
    const { printUrlChange, ownReportParams = {}, printExpendFun } = this.props;
    let userjson = {
        pageInfo: {
            pageIndex: (pager.pageIndex && pager.pageIndex.toString()) || "",
            pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        },
        querycondition: condition,
        FreeReport_QueryTreeVo,
        ...this.commonParams,
    };

    let outputJson = {
        filename: ownReportParams.reportName || fileName,
        funcode: this.commonParams.appcode,
        nodekey,
        oids: this.commonParams.oid ? [this.commonParams.oid] : [],
        printTemplateID: type,
        userjson: JSON.stringify(userjson),
    };
    let urlPdf = "/nccloud/report/widget/printreportbypdfaction.do";

    if (printUrlChange) {
        const newUrl = printUrlChange(nodekey);
        if (newUrl) {
            urlPdf = newUrl;
        }
    }
    //领域自行打印
    if (printOther && printOther.length > 0 && printExpendFun) {
        let array = printOther.map((item) => item.key);
        if (array.includes(type)) {
            outputJson = Object.assign({}, outputJson, userjson, printData, {
                key: type,
                fileSuffix: "pdf",
            });
            printExpendFun(outputJson);
            return;
        }
    }

    formDownload({
        params: outputJson,
        url: urlPdf,
        enctype: 2,
        isCipher: true,
        previewInModal: true,
    });
};

export function getTreeParams() {
    const { config } = this.treeParams;
    const { result } = this.state;
    let cols = getCurrentCol(config);

    if (!Array.isArray(cols)) cols = [cols];
    let allIds = [];
    let ids = [];
    let totalType = "";
    result.CellsModel.DynamicModel[0].cellsArray.forEach((item) => {
        for (let i = cols.length - 1; i >= 0; i--) {
            let col = cols[i];
            let cellParam = (item[col] && item[col][3]) || {};
            let id = cellParam.id || "";
            !totalType && (totalType = cellParam.totalType);
            // if (totalType === "after" && !id) break;
            if (id && !allIds.includes(id)) {
                allIds.push(id);
                if (
                    cellParam.isCollapse &&
                    !ids.includes(id) &&
                    !ids.includes(cellParam.pid)
                ) {
                    ids.push(id);
                    // break;
                }
            }
        }
        // cols.forEach(col=>{
        //     if (item[col] && item[col][3] && item[col][3].id && item[col][3].isCollapse) {
        //         if (!ids.includes(item[col][3].id) && !ids.includes(item[col][3].pid))
        //                 ids.push(item[col][3].id)
        //             }
        // })
        // for (let i = 0; i < cols.length; i++) {
        //     let col = cols[i]
        //     if (item[col] && item[col][3] && item[col][3].id && item[col][3].isCollapse) {
        //         ids.add(item[col][3].id)
        //         break;
        //     }
        // }
    });
    return Array.from(ids).map((id) => ({ id }));
}

export function bigOutputFun() {
    const { getAllSearchData } = this.props.search;
    let data = { ...this.sendSearchParams };

    if (!data.querycondition) {
        const querycondition = getAllSearchData(SEARCHID);
        if (!querycondition) return;
        data = {
            ...data,
            querycondition,
            ...this.commonParams,
            key_time_offset: this.key_time_offset,
        };
    }

    ajax({
        url: "/nccloud/report/widget/bigdataexport.do",
        data,
        success: () => {
            toast({
                content: langCheck("reportMultiLang", "100301-000094"),
                color: "success",
                duration: 5,
            });
        },
    });
}
