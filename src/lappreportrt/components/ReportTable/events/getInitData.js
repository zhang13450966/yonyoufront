import Utils from "@public/utils";
const {
    showSearchToast,
    setGlobalStorage,
    getGlobalStorage,
    removeGlobalStorage,
} = Utils;
import {
    getRollingData,
    sendSearchFun,
    tableRender,
    initRollingFilterData,
} from "./index";
import {
    fillChild,
    getColSettingsObj,
    getSearchMenuArr,
    handleSideBarSetParams,
    refreshSiderBar,
    setSearchValueByDrill,
} from "./methods";

//初始化表格
export const getInitData = function (resData, flag, noDropdownPrint, row) {
    const {
        ownReportParams = {},
        button,
        search,
        getUrlParam,
        changeDrillConditions,
    } = this.props;
    const { graphicParams, settings } = this.state;

    if (!resData) {
        //无数据要清空
        return this.setState({
            settings: {
                ...settings,
                data: [[]],
                mergeCells: [],
            },
        });
    }

    this.areaDataInfo = resData.CellsModel.AreaDatas;

    const {
        reportType,
        CellsModel,
        fieldExpCaptionMap,
        drill_query_condition = [],
        printmenu = [],
        drillRules = [],
        reportId,
        opents,
        sideBarSet = [],
        pageSize,
        reportViewState = "dataView",
        ReportDataStartPostion = {},
        dataRowNum,
        excelPrintMaxRow,
        pdfPrintMaxRow,
        key_CUR_USER_ID,
        isShowZero,
        controlByLicense,
        FreeReport_QueryTreeVo,
        colinfo = {},
        repCondition = {},
        transSaveObject = "",
        preloadMaxRow,
        freezeLine = "n",
        startFreezeLine = {},
        is_no_pagination = false, //是否显示分页
        isHideCoordinate = false,
        sideBarSetWidth,
        app_reportvos = [],
    } = resData;

    if (reportType == 1) {
        let AreaDatas = CellsModel.AreaDatas;
        let fldAreasArray = [];
        AreaDatas.map((item) => {
            fldAreasArray = fldAreasArray.concat(item.fldAreas);
        });
        fldAreasArray = fldAreasArray.filter((item) => item.fldArea[0][1] == 0);
        this.sortToastText =
            (fldAreasArray[0] &&
                fieldExpCaptionMap[fldAreasArray[0].fldName]) ||
            "";
    }
    if (row) showSearchToast(resData, this);
    let drillConditions =
        drill_query_condition.length &&
        typeof changeDrillConditions === "function"
            ? changeDrillConditions(this.props, drill_query_condition)
            : drill_query_condition; //联查查询条件

    const drillRulesList = getSearchMenuArr.call(this, drillRules); //联查列表

    this.commonParams = {
        ...this.commonParams,
        pk_report: reportId,
        reportId,
        opents,
    };

    this.pageParams = {
        ...this.pageParams,
        reportType,
        FreeReport_QueryTreeVo,
        CellsModel,
        freezeLine,
        startFreezeLine,
    };

    //显示隐藏行号列标
    if (isHideCoordinate) {
        settings.rowHeaders = false;
        settings.colHeaders = false;
    }

    //侧边栏
    if (sideBarSet.length) {
        //整理侧边栏数据
        this.state.graphicParams = {
            ...graphicParams,
            width: sideBarSetWidth,
            ...handleSideBarSetParams({ sideBarSet }),
        };
        if (sideBarSet[0].isDefaultExpand) {
            refreshSiderBar.call(this, "init");
        }
    }

    //分页条数
    if (pageSize) {
        this.state.pager.pageSize = +pageSize;
    }

    this.state.is_no_pagination = is_no_pagination;

    if (reportType == "2" || is_no_pagination) {
        this.state.reportBoxHeight = "100%";
    }

    //多页签处理
    if (app_reportvos.length > 1) {
        if (!this.reportTabMap.tabs)
            this.reportTabMap = handleTabsParams(app_reportvos, reportId);
        this.state.reportBoxHeight = "calc(100% - 32px)";
    }

    //数据从第几行开始
    this.reportDataStartPostion = ReportDataStartPostion.row || 0;

    //数据视图还是普通视图
    if (reportViewState === "dataView") {
        this.viewModelChange = true;
        let { seperateRow } = CellsModel.tableSetting.lockSet;
        if (seperateRow && +seperateRow > 0) {
            //如果有默认冻结，并且隐藏表头，把设置的默认冻结上移
            const diffCount = seperateRow - this.reportDataStartPostion;
            if (diffCount > 0) {
                this.state.settings.fixedRowsTop = diffCount;
            }
        }
    }

    this.initParams = {
        dataRowNum,
        noDropdownPrint,
        excelPrintMaxRow,
        pdfPrintMaxRow,
        key_CUR_USER_ID,
        isShowZero, //当返回为false时，表格区字段是0不显示
        drillConditions,
        printmenu,
        drillRulesList,
        controlByLicense,
    };

    if (!noDropdownPrint && this.oldButtonKeys.length) {
        //联查时要让注册按钮可用，与init里互斥
        button.setButtonDisabled(this.oldButtonKeys, false);
    }

    this.colinfo = colinfo; //列设置
    this.colSettingsObj = getColSettingsObj(this.colinfo); //列设置对象，用来排序筛选等对比传参
    if (this.colinfo.mark) {
        const lockData = this.colinfo[this.colinfo.mark]
            .filter((item) => item.isLock === "true")
            .sort((a, b) => {
                return a.order - b.order;
            });
        if (lockData.length > 0) {
            this.state.settings.fixedColumnsLeft =
                Number(lockData[lockData.length - 1].order) + 1;
        }
    }

    if (repCondition.pageInfo && repCondition.pageInfo.length) {
        //页维度
        let status = flag ? "search" : "init";
        let repParams = {
            repCondition,
            pagerData: {
                ...this.initParams.pagerData,
                type: repCondition.pageType,
                pageInfo: repCondition.pageInfo,
                modalRollingArray: initRollingFilterData.call(
                    this,
                    repCondition.dataArr,
                    repCondition,
                    status
                ),
            },
        };
        this.initParams = { ...this.initParams, ...repParams };
        if (this.initParams.pagerData && this.initParams.pagerData.type != 0) {
            getRollingData.call(this, status);
        }
    }

    if (printmenu.length && this.META_SET_ON_SEARCH === "1") {
        //异步处理。如果模板接口的按钮已经赋值了，则此接口返回的打印按钮要再次赋值，否则直接在模板接口赋值
        const oldBtns = button.getButtons();
        let fillArray = fillChild(printmenu);

        let keys = fillArray.map((item) => item.key);
        if (this.regKeys && this.regKeys.print)
            this.regKeys.print = [...this.regKeys.print, ...keys];
        oldBtns.forEach((item) => {
            if (item.key === "print") {
                item.children[0].children = [
                    ...item.children[0].children,
                    ...fillArray,
                ];
            }
        });
        button.setButtons(oldBtns);
    }

    if (
        !ownReportParams.notSetSearchOnInitDrill &&
        this.isShowSearchArea &&
        this.META_SET_ON_SEARCH === "1" &&
        this.initParams.drillConditions.length
    ) {
        //联查时的默认赋值，this.METASETONSEARCH为此接口与createUIDom接口的判断
        setSearchValueByDrill({ drillConditions, search });
    }

    if (flag) {
        setGlobalStorage(
            "sessionStorage",
            `trans${opents}${reportId}`,
            transSaveObject
        );
        this.preloadMaxRow = +preloadMaxRow;
        this.isConnection = true;
    }
    let LinkReport =
        ownReportParams.LinkReport ||
        getGlobalStorage("localStorage", "LinkReport") ||
        getGlobalStorage("sessionStorage", "LinkReport");
    if (LinkReport && !row) {
        this.isClickShowAllCount = true;
        const isSetCondition = getUrlParam("isSetCondition");
        let condition =
            typeof LinkReport === "string"
                ? JSON.parse(LinkReport)
                : LinkReport;

        if (isSetCondition && this.isShowSearchArea) {
            //走初始化并请求数据的，如果需要赋查询区默认值
            if (this.META_SET_ON_SEARCH === "1") {
                setSearchValueByDrill({
                    drillConditions: condition.conditions,
                    search,
                });
            } else {
                this.initParams.drillConditions = condition.conditions;
            }
        }
        sendSearchFun(
            this,
            this.props,
            this.props,
            condition,
            "simple",
            {},
            "isLinkReport"
        );
        removeGlobalStorage("localStorage", "LinkReport");
        removeGlobalStorage("sessionStorage", "LinkReport");
    } else {
        tableRender(this, resData, "saveWidth");
    }
};

function handleTabsParams(reportvos, reportId) {
    const tabs = reportvos.map((item) => ({
        ...item,
        label: item.name,
        Key: item.pk,
    }));
    return {
        tabs,
        activeKey: reportId,
    };
}
