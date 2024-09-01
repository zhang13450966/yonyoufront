import React from "react";
import { base } from "nc-lightapp-front";
import Utils from "@public/utils";

const { langCheck } = Utils;
const { NCButton } = base;

function TableOprBtnList(props) {
    let { checkedField } = props;

    function deleteField() {
        let { checkedField, checkedFieldKey, listKey } = props;
        props.deleteField(checkedFieldKey, listKey, checkedField);
    }

    function goUpStairs() {
        let { checkedField, checkedFieldKey, listKey } = props;
        props.goUpstairs(checkedFieldKey, listKey, checkedField);
    }

    function goDownStairs() {
        let { checkedField, checkedFieldKey, listKey } = props;
        props.goDownStairs(checkedFieldKey, listKey, checkedField);
    }

    function doShiftdim() {
        let { checkedField, checkedFieldKey, listKey } = props;
        props.doShiftdim(checkedFieldKey, listKey, checkedField);
    }
    return (
        <div className="table-opr">
            {/* 行列转换 */}
            {props.doShiftdim && props.showTransformRowAndCol && (
                <NCButton onClick={doShiftdim} className="shiftdim">
                    {langCheck("reportMultiLang", "100301-000170")}
                </NCButton>
            )}
            <NCButton
                disabled={!Object.keys(checkedField).length}
                onClick={deleteField}
                className="report-btn del nc-theme-area-split-bc"
            >
                {langCheck("reportMultiLang", "100301-000157")}
            </NCButton>

            <NCButton
                disabled={props.moveTopBtnDis}
                onClick={goUpStairs}
                className="report-btn to-top nc-theme-area-split-bc"
            >
                {langCheck("reportMultiLang", "100301-000158")}
            </NCButton>

            <NCButton
                disabled={props.moveBottomBtnDis}
                onClick={goDownStairs}
                className="report-btn to-bottom nc-theme-area-split-bc"
            >
                {langCheck("reportMultiLang", "100301-000159")}
            </NCButton>
        </div>
    );
}

export default TableOprBtnList;
