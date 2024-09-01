/**
 * 联查
 * @param {*} val
 */
import Utils from "@public/utils";
import { toast } from "nc-lightapp-front";
const { splitURI, langCheck, setGlobalStorage, getTimeOffset } = Utils;
import { getRelCoords } from "./methods";
import { getDrillInfo } from "@public/utils/requests";

export default function relationSearch(key) {
    if (!this.inSearchArea) {
        toast({
            content: langCheck("reportMultiLang", "100301-000016"),
            color: "warning",
        }); /* 国际化处理： 请在有效数据区域内进行联查*/
        return;
    }
    const { setConnectionSearch, openTo } = this.props;
    let { pager, settings } = this.state;
    const { condition } = this.pageParams;
    let { drillRulesList } = this.initParams;
    const {
        opents,
        reportId,
        operationQueue,
        oid,
        transSaveObject,
        custcondition,
    } = this.commonParams;
    const coords = getRelCoords.call(this);

    const row = coords.row;
    const column = coords.col > -1 ? coords.col : "0";

    let url = window.location.pathname,
        drillCodeKey = key.key || key,
        graphicUrlFlag = false;

    let {
        analysisParams = {},
        targetStoryBoardPk: pk_storyboard,
        fldName,
        targetid,
        targetcode,
        targetname,
        targetpage,
        targetRepPk,
        webDrillType,
        targetPath,
    } = drillRulesList.find(item => item.drillCode === drillCodeKey) || {};

    if ((webDrillType == 3 || webDrillType == 4) && !targetPath)
        graphicUrlFlag = true;

    targetPath = splitURI(targetPath) ? splitURI(targetPath) : splitURI(url);

    if (graphicUrlFlag)
        targetPath =
            "/nccloud/resources/graphic_report/graphicReportDesign/pages/busi/index.html";

    setGlobalStorage(
        "sessionStorage",
        `condition${reportId}*${drillCodeKey}`,
        JSON.stringify(condition),
    );
    setGlobalStorage(
        "sessionStorage",
        `trans${opents}${reportId}`,
        transSaveObject,
    );
    setGlobalStorage(
        "sessionStorage",
        `custcondition${opents}${reportId}`,
        JSON.stringify(custcondition || {}),
    );

    let currentRowData = settings.data[this.isClickCoords.row];

    let drillUrlObj = {
        ar: targetid,
        n: targetname,
        appcode: targetcode,
        pageCode: targetpage,
        row,
        column,
        opents,
        targetRepPk,
        reportId,
        drillCode: drillCodeKey,
        webDrillType: webDrillType && webDrillType.toString(),
        oid,
        operationQueue,
        pageIndex: (pager.pageIndex && pager.pageIndex.toString()) || "",
        pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        pk_storyboard,
        analysis_params: JSON.stringify(analysisParams),
    };

    let allData = {
        row,
        column,
        targetRepPk,
        dirllcode: drillCodeKey,
        fldName,
        currentRowData,
        ...this.sendSearchParams,
        ...this.commonParams,
        pageInfo: {
            pageIndex: (pager.pageIndex && pager.pageIndex.toString()) || "",
            pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        },
        querycondition: condition,
        isAdvanced: true,
        key_time_offset: getTimeOffset(),
        userdefObj: {},
        requireTotalData: true,
        currentReportData: settings.data,
    };

    if (setConnectionSearch) {
        let itemObj = key.key ? { key: key.key } : { key: key };
        setConnectionSearch(
            transSaveObject,
            itemObj,
            allData,
            this.props,
            targetPath,
            drillUrlObj,
            `trans${opents}${reportId}`,
            currentRowData,
        );
    } else {
        if (webDrillType == 5) {
            getSearchInfo(allData, this.props);
        } else {
            openTo(targetPath, drillUrlObj);
        }
    }
}

async function getSearchInfo(param, props) {
    const ret = await getDrillInfo(param);
    props.openTo(ret.url, {
        ...ret,
        status: "browse",
    });
}
