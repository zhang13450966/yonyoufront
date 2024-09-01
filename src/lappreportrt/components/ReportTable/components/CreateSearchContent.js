import { SEARCHID } from "../config";
import { clickSearchBtn } from "../events";

export default function CreateSearchContent(props) {
    let { parentProps, changeDataViewRef, isInTimeShare } = props;
    const { search } = parentProps;
    const { NCCreateSearch } = search;

    if (isInTimeShare) parentProps = parentProps.parentProps;

    return NCCreateSearch(
        SEARCHID, // 模块id
        {
            hiddenFunList: parentProps.hiddenFunList,
            clickSearchBtn:
                props.clickSearchBtn || clickSearchBtn.bind(this, parentProps),
            searchBtnName: props.searchBtnName || parentProps.searchBtnName,
            showAdvBtn: isInTimeShare
                ? true
                : this.onlySearchArea || parentProps.showAdvBtn,
            onAfterEvent: (key, data, c, d, e) => {
                if (key === "pk_org_v.pk_data_view_org") {
                    // 选择查询区数据视图后 要切换数据视图当前视图
                    changeDataViewRef && changeDataViewRef(key, data);
                }
                parentProps.onAfterEvent &&
                    parentProps.onAfterEvent.call(
                        this,
                        parentProps,
                        SEARCHID,
                        key,
                        data,
                        c,
                        d,
                        e
                    );
            },
            onBeforeEvent: parentProps.onBeforeEvent,
            showAdvSearchPlanBtn: parentProps.showAdvSearchPlanBtn || true,
            replaceAdvBtnEve: parentProps.replaceAdvBtnEve,
            replaceAdvBody: parentProps.replaceAdvBody,
            addAdvTabs: parentProps.addAdvTabs,
            addAdvBody: parentProps.addAdvBody,
            oid: this.oid,
            isSynInitAdvSearch: parentProps.isSynInitAdvSearchFlag || false,
            replaceRightBody: parentProps.replaceRightBody,
            saveSearchPlan: parentProps.saveSearchPlan,
            setRequiredByField: parentProps.setRequiredByField,
            onOperateTypeChange:
                parentProps.onOperateTypeChange &&
                parentProps.onOperateTypeChange.bind(
                    this,
                    parentProps,
                    SEARCHID
                ),
            clickPlanEve:
                parentProps.clickPlanEve &&
                parentProps.clickPlanEve.bind(this, parentProps),
            advSearchClearEve:
                parentProps.advSearchClearEve &&
                parentProps.advSearchClearEve.bind(this, parentProps, SEARCHID),
            clickAdvBtnEve:
                parentProps.clickAdvBtnEve &&
                parentProps.clickAdvBtnEve.bind(this, parentProps, SEARCHID),
            renderCompleteEvent:
                parentProps.renderCompleteEvent &&
                parentProps.renderCompleteEvent.bind(
                    this,
                    parentProps,
                    SEARCHID
                ),
            statusChangeEvent:
                parentProps.statusChangeEvent &&
                parentProps.statusChangeEvent.bind(this, parentProps, SEARCHID),
            setInitValueEvent:
                parentProps.setInitValueEvent &&
                parentProps.setInitValueEvent.bind(this, parentProps, SEARCHID),
            context: parentProps.searchContext || "",
            opneBtnClick: this.opneBtnClick,
            isTemplateOrder: parentProps.isTemplateOrder,
            removeQuerConditionEve: parentProps.removeQuerConditionEve,
            changeItemVisibleByField: parentProps.changeItemVisibleByField,
            modalCloseEve: (a, b, c, d, e) => {
                const dom = document.querySelector(".NC_searchAdvModalBox");
                if (dom) dom.classList.add("hideAdvModal");
                parentProps.modalCloseEve &&
                    parentProps.modalCloseEve(parentProps);
                window.parent.postMessage(
                    JSON.stringify({ isSearch: false }),
                    window.parent.location.origin
                );
            },
        }
    );
}
