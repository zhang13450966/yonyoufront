import { promptBox } from "nc-lightapp-front";
import sendSearchFun from "./sendSearch";
import Utils from "@public/utils";
const { langCheck } = Utils;
// 点击查询，获取查询区数据
/***
 * props: 原始props
 * expandProps: 拓展后的props
 * items: 查询条件
 */
export default function clickSearchBtn(
    expandProps,
    props,
    items,
    type,
    queryInfo
) {
    //报表组合订阅的判断
    if (this.onlySearchArea) {
        const { getSearchSnap, getQueryInfo } = this.props.search;
        const searchInfo = getSearchSnap("light_report");
        //不输入查询条件时的判断
        const info = getQueryInfo("light_report");
        window.parent.postMessage(
            JSON.stringify({
                items,
                type,
                queryInfo: queryInfo || info,
                searchInfo,
                isSearch: true,
            }),
            window.parent.location.origin
        );
        return;
    }

    const { isReviewHistory } = this.state;
    if (isReviewHistory) {
        this.prevSearchParams = {
            expandProps,
            props,
            items,
            type,
            queryInfo,
        };
        return promptBox({
            color: "warning",
            content: langCheck("reportMultiLang", "100301-000124"),
            beSureBtnClick: this.onPromptClick,
        });
    } else {
        this.prevSearchParams = {};
    }

    if (items === false || !this.commonParams.pk_report) {
        return;
    }
    this.isClickShowAllCount = true;
    let key_formScheme = {};
    if (Object.keys(this.dataViewMiddleCacheData).length === 0) {
        key_formScheme =
            Object.keys(this.shiftdimData).length > 0
                ? this.shiftdimData
                : null;
    } else {
        // 预览的时候 点查询要查当前预览状态的数据
        key_formScheme = this.dataViewMiddleCacheData;
    }
    sendSearchFun(
        this,
        expandProps,
        props,
        items,
        type,
        queryInfo,
        null,
        false,
        false,
        key_formScheme
    );
}
