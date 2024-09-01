import { toast } from "nc-lightapp-front";
import { isSearchRender } from "./isSearchRender";
import Utils from "@public/utils";
import { formatShiftDimSourceAreaData } from "./shiftdim";
import { getColSettingsObj, createRegButton, clearUsedColumn } from "./methods";
import { getSearchData } from "@public/utils/requests";
const {
    langCheck,
    removeGlobalStorage,
    getGlobalStorage,
    getTimeOffset,
    disposeSearch,
    showSearchToast,
} = Utils;
import { getCurrentTab } from "./onTabClick";
//发送查询请求
export default async function sendSearchFun(
    that,
    expandProps,
    props,
    items,
    type,
    queryInfo,
    custcondition_null,
    showCount,
    isFromDrill,
    key_formScheme,
    dataViewFlag
) {
    const { ownReportParams, isSearchFromDesign, afterSearchRequest } =
        that.props;
    const { settings } = that.state;

    // 这里以下是从clickSearchBtn拿过来的
    let condition,
        custcondition = {};
    if (custcondition_null === "isLinkReport") {
        condition = items;
    } else {
        if (
            that.isShowSearchArea &&
            expandProps &&
            expandProps.expandSearchVal
        ) {
            //isShowSearchArea 如果有查询区才走对查询区的拓展
            let ret = expandProps.expandSearchVal(
                    items,
                    props,
                    type,
                    queryInfo
                ),
                result = {};
            if (ret === false) {
                return;
            } else if (ret === true) {
                return true;
            }
            if (ret === "deleteCommonToast") {
                //资金不要公共的查询后提示
                that.deleteCommonToast = true;
                result = disposeSearch(items);
            } else {
                result = disposeSearch(ret);
            }
            condition = result.condition;
        } else {
            let obj = disposeSearch(items);
            condition = obj.condition;
        }
    }

    let sessionCustcondition =
        getGlobalStorage("localStorage", "sessionCustcondition") ||
        getGlobalStorage("sessionStorage", "sessionCustcondition");

    //处理custcondition
    if (
        expandProps &&
        expandProps.custconditions &&
        custcondition_null !== "isLinkReport"
    ) {
        custcondition = expandProps.custconditions(
            items,
            props,
            type,
            queryInfo
        );
        if (custcondition === false) return;
        if (custcondition === true) return true;
    } else if (sessionCustcondition) {
        try {
            custcondition = JSON.parse(sessionCustcondition);
        } catch (err) {}
    }
    that.commonParams.custcondition = custcondition;

    // 这里以上是从clickSearchBtn拿过来的

    if (settings.fixedRowsTop > 0 && custcondition_null !== "isLinkReport") {
        that.getReportInstance().scrollViewportTo(settings.fixedRowsTop, 0);
    } else {
        that.getReportInstance().scrollViewportTo(0, 0);
    }
    // 单据联查时需要的参数
    let userdefObj = getGlobalStorage("localStorage", "LinkReportUserDefObj")
        ? JSON.parse(getGlobalStorage("localStorage", "LinkReportUserDefObj"))
        : getGlobalStorage("sessionStorage", "LinkReportUserDefObj")
        ? JSON.parse(getGlobalStorage("sessionStorage", "LinkReportUserDefObj"))
        : {};

    removeGlobalStorage("localStorage", "LinkReportUserDefObj");
    removeGlobalStorage("sessionStorage", "LinkReportUserDefObj");
    removeGlobalStorage("localStorage", "sessionCustcondition");
    removeGlobalStorage("sessionStorage", "sessionCustcondition");
    const { pager } = that.state;
    let { pageSize, pageIndex } = pager;
    if (pageSize < 10) {
        pageSize = 10;
        toast({
            content: langCheck("reportMultiLang", "100301-000017"),
            color: "warning",
        }); /* 国际化处理： 每页行数应在10—2000之间。*/
    }
    if (pageSize > 50000) {
        pageSize = 50000;
        toast({
            content: langCheck("reportMultiLang", "100301-000017"),
            color: "warning",
        }); /* 国际化处理： 每页行数应在10—2000之间。*/
    }

    if (ownReportParams && ownReportParams.userdefObj)
        userdefObj = ownReportParams.userdefObj;
    let keyReportParamWeb = {}; //处理一下通用的userdefObj参数传递
    let curDataViewCode = "";
    if (condition && condition.conditions.length > 0) {
        condition.conditions.forEach((item) => {
            //param_为一个约定，如果配置了查询条件的编码为param_***，则会把它放进userdefObj中，不配置则正常放在查询条件中
            if (item.field.indexOf("param_") > -1) {
                let key = item.field.split("param_")[1];
                let value = item.value.firstvalue;
                // if (item.value.secondvalue && item.oprtype === "between") {
                //     value += `*${item.value.secondvalue}`;
                // }
                keyReportParamWeb[key] = value;
            }

            if (item.field === "pk_org_v.pk_data_view_org") {
                curDataViewCode = item.value.firstvalue;
            }
        });
    }
    //赋值操作
    if (JSON.stringify(keyReportParamWeb) !== "{}") {
        userdefObj.keyReportParamWeb = keyReportParamWeb;
    }
    let isAdvanced = type === "super" ? true : false;

    that.commonParams.opents = Date.now().toString(); //查询时候要重置opents
    that.commonParams.isAdvanced = isAdvanced;

    let requireTotalData = showCount == "showAllCount" ? "true" : "false"; //分页中是否显示真实行数

    const { dataViewMenuArr = [], currentSelectDataViewIndex } = that.state;
    const curDataViewRes = dataViewMenuArr.filter((item) => {
        return item.code === curDataViewCode;
    });

    if (curDataViewCode && curDataViewRes.length === 0) {
        // 保存的方案里有数据视图 并且数据视图被修改过
        toast({
            content: langCheck("reportMultiLang", "dataView-100301-000272"),
            color: "warning",
        }); /* 国际化处理： 数据视图不存在，请重新选择视图。*/
        return;
    }

    userdefObj = {
        ...userdefObj,
        key_formScheme:
            key_formScheme ||
            (curDataViewRes && curDataViewRes[0]) ||
            dataViewMenuArr[currentSelectDataViewIndex],
    };
    if (
        userdefObj.key_formScheme &&
        userdefObj.key_formScheme.code === "default" && 
        !dataViewFlag
    ) {
        // 如果是预置视图 就不传数据视图的参数 解决上行流量超标问题
        userdefObj.key_formScheme = undefined;
    }

    const searchTS = Date.now();

    let dataParam = {
        pageInfo: {
            pageIndex: (pageIndex && pageIndex.toString()) || "",
            pageSize: (pageSize && pageSize.toString()) || "",
        },
        querycondition: condition,
        key_time_offset: getTimeOffset(),
        userdefObj,
        requireTotalData,
        searchTS,
        controlByLicense: that.initParams.controlByLicense,
        ...that.commonParams,
    };

    //设置当前页签的ts
    const currentTab = getCurrentTab(
        that.commonParams.pk_report,
        that.reportTabMap.tabs
    );
    if (currentTab) currentTab.searchTS = searchTS;

    if (isSearchFromDesign) {
        dataParam = Object.assign({}, dataParam, { smartba_search: true });
    }
    that.sendSearchParams = dataParam;
    let url, data, diffConditon;
    if (isFromDrill) {
        url = "/nccloud/report/widget/lightreport_reportdrill.do";
        data = that.isReportDrillParams;
        data.requireTotalData = requireTotalData;
        diffConditon = that.isReportDrillParams.querycondition;
        that.commonParams.keyIsExecDrill = true;
    } else {
        data = dataParam;
        diffConditon = condition;
        that.commonParams.keyIsExecDrill = false;
    }

    const resultData = await getSearchData({ url, data });

    //提示信息
    if (resultData.shouldHintForSmartMaxRow) {
        toast({
            content: langCheck("reportMultiLang", "100301-000104"),
            color: "warning",
        });
    } else {
        if (!that.deleteCommonToast) showSearchToast(resultData, that);
    }
    afterSearchRequest && afterSearchRequest(resultData.pager, resultData); //暂时为资金使用

    //重置状态
    clearUsedColumn.call(that);

    afterSearchReport.call(that, { resultData, diffConditon, queryInfo });
}

export function afterSearchReport({
    resultData,
    diffConditon,
    queryInfo,
    prevTabKey,
}) {
    const { colinfo = {}, CellsModel } = resultData;
    const { button, printOther = [] } = this.props;
    const { pk_report } = this.commonParams;

    this.colinfo = colinfo; //列设置
    this.areaDataInfo = formatShiftDimSourceAreaData(
        CellsModel.AreaDatas,
        this.relationAreaPkList
    );
    this.pageParams.CellsModel.AreaDatas = formatShiftDimSourceAreaData(
        CellsModel.AreaDatas,
        this.relationAreaPkList
    );

    this.colSettingsObj = getColSettingsObj(this.colinfo); //列设置对象，用来排序筛选等对比传参

    if (this.oldButtonKeys.length) {
        button.setButtonDisabled(this.oldButtonKeys, false);
        if (printOther) {
            //资产的会动态的删除或增加printOther
            const { print } = this.regKeys || {};
            if (print) {
                const keys = printOther.map((item) => item.key);
                this.regKeys.print = [...print, ...keys];
            }
            const ret = createRegButton.call(this, this.regButton); //为了处理业务传进来的打印按钮
            button.setButtons(ret);
        }
    }

    if (!prevTabKey) {
        this.refs.rolling && this.refs.rolling.clearSelectValue();
        this.state.rollingPagerDataMap[pk_report] = [];
    }

    isSearchRender.call(this, resultData, diffConditon, queryInfo);
}
