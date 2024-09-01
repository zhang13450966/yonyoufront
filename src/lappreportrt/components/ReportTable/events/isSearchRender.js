import { tableRender, buttonDisabledFun, refreshSiderBar } from "./methods";
import { checkTreeData } from "./treeFun";
import { initRollingFilterData, getRollingData } from "./rollingFun";
import Utils from "@public/utils";
const { setGlobalStorage } = Utils;

//查询后数据渲染
export const isSearchRender = function (data, condition, queryInfo) {
    const {
        preloadMaxRow,
        transSaveObject = "",
        dataRowNum,
        excelPrintMaxRow,
        pdfPrintMaxRow,
        key_CUR_USER_ID,
        isShowZero,
        FreeReport_QueryTreeVo,
        reportType,
        repCondition,
    } = data;
    const { graphicParams } = this.state;
    const { getUrlParam, setUrlParam } = this.props;
    const { opents, pk_report, treeType } = this.commonParams;

    this.preloadMaxRow = +preloadMaxRow;
    this.isClickSearchBtn = true;
    this.isConnection = false; // 重置状态

    setGlobalStorage(
        "sessionStorage",
        `trans${opents}${pk_report}`,
        transSaveObject
    );
    this.initParams = {
        ...this.initParams,
        dataRowNum,
        noDropdownPrint: false,
        excelPrintMaxRow,
        pdfPrintMaxRow,
        key_CUR_USER_ID,
        isShowZero, //当返回为false时，表格区字段是0不显示
    };
    this.pageParams = {
        ...this.pageParams,
        FreeReport_QueryTreeVo,
        reportType,
        condition,
        queryInfo,
    };
    if (repCondition && repCondition.pageInfo.length) {
        this.initParams = {
            ...this.initParams,
            repCondition,
            pagerData: {
                ...this.initParams.pagerData,
                type: repCondition.pageType,
                pageInfo: repCondition.pageInfo,
                modalRollingArray: initRollingFilterData.call(
                    this,
                    repCondition.dataArr,
                    repCondition,
                    "search"
                ),
                count: 0,
            },
        };
        getRollingData.call(this, "search");
    } else {
        this.initParams = {
            ...this.initParams,
            pagerData: {
                ...this.initParams.pagerData,
                type: -1,
            },
        };
    }

    const row = getUrlParam("row"); //动态url传参
    if (row) setUrlParam({ row: "" });

    if (graphicParams.sideBarList.length) {
        this.setState({
            graphicParams: {
                ...graphicParams,
                search_params: queryInfo,
            },
        });
    }

    this.commonParams.isListTreeWhenSearch = !treeType ? true : false; //判断当前树形表是列表态还是树形

    checkTreeData.call(this, data);
    tableRender(this, data, "saveWidth");
    refreshSiderBar.call(this, "search");
    setTimeout(() => {
        //为了重置按钮可用性
        buttonDisabledFun.call(this, this.isClickCoords);
    }, 20);
};
