import React, { useContext, useState } from "react";
import { base } from "nc-lightapp-front";
import {
    changePlanCode,
    changeOpenPlan,
    changeOpenSetting,
    getLang,
    newPrintAction,
    printAction,
    changeDefaultPlanCode,
} from "../paction";
import { Pcontext } from "../pstore";
import Utils from "@public/utils";
const { langCheck } = Utils;
import "./index.less";
const { NCModal, NCButton, NCRadio, NCTooltip, NCHotKeys } = base;
const NCRadioGroup = NCRadio.NCRadioGroup;
function PrintPlan() {
    const [visibleToolTip, setVisibleToolTip] = useState(false);

    const [enterIndex, setEnterIndex] = useState(0);
    const {
        store: {
            reportId,
            openPlan,
            isPrint,
            planLists,
            planCode,
            langseq,
            printParams,
        },
        dispatch,
    } = useContext(Pcontext);
    /**
     * 处理选中状态
     * @param {*} value
     */
    function plansChange(value) {
        dispatch(changePlanCode(value));
    }

    function handleTooltip(index) {
        let target = document.querySelector(
            `report-print-plan .plan-modal-body > div > div > label:nth-child(${
                index + 1
            }) > label`
        );
        if (target.scrollWidth > target.clientWidth) {
            setVisibleToolTip(true);
            setEnterIndex(index);
        }
    }

    function handleTooltipLeave() {
        setVisibleToolTip(false);
    }
    /**
     * 弹窗内容
     */
    function generatorModalBody() {
        if (planLists.length == 0) {
            return null;
        }
        const lists = planLists.map((plan, index) => {
            const { printCode } = plan;
            return (
                <NCTooltip
                    placement="top"
                    inverse
                    overlay={getLang(langseq, plan)}
                    trigger={["focus", "hover"]}
                    className="model-helper-overlay"
                    visible={enterIndex == index && visibleToolTip}
                >
                    <NCRadio
                        onMouseOver={() => handleTooltip(index)}
                        onMouseLeave={() => handleTooltipLeave()}
                        plan-code={printCode}
                        className={` ${
                            printCode == planCode ? "is-checked" : ""
                        } plan-item item ${
                            planCode == printCode ? "active" : ""
                        }`}
                        value={printCode}
                    >
                        {getLang(langseq, plan)}
                    </NCRadio>
                </NCTooltip>
            );
        });

        return (
            <NCRadioGroup
                className="plan-list"
                onChange={plansChange}
                value={planCode}
            >
                {lists}
            </NCRadioGroup>
        );
    }

    /**
     *关闭弹窗
     *
     */
    function closeModal() {
        dispatch(changeOpenPlan(false));
    }

    /**
     *点击提交弹窗
     *
     */
    function sureModal() {
        if (isPrint) {
            printAction(
                reportId,
                planCode,
                { printSet: {}, ...printParams },
                (code) => dispatch(changeDefaultPlanCode(code))
            );
        } else {
            newPrintAction(
                reportId,
                planCode,
                { printSet: {}, ...printParams },
                (code) => dispatch(changeDefaultPlanCode(code))
            );
        }
        closeModal();
    }

    /**
     * 打开打印设置弹窗
     */
    function handlePringSetting() {
        closeModal();
        dispatch(changeOpenSetting(true));
    }

    return (
        <NCModal
            fieldid=""
            show={openPlan}
            className="report-print-plan"
            width="500"
            minHeight="250"
        >
            <NCHotKeys
                keyMap={{
                    sureBtn: ["Alt+Y"],
                    cancelBtn: ["Alt+N"],
                }}
                handlers={{
                    sureBtn: () => {
                        sureModal();
                    },
                    cancelBtn: () => {
                        closeModal();
                    },
                }}
                focused={true}
                attach={document.body}
            />
            <NCModal.Header>
                <NCModal.Title fieldid="">
                    {langCheck("reportMultiLang", "100301-000238")}
                </NCModal.Title>
            </NCModal.Header>
            <NCModal.Body className="plan-modal-body">
                {generatorModalBody()}
            </NCModal.Body>
            <NCModal.Footer>
                <NCButton
                    fieldid=""
                    colors=""
                    className="print-setting-button"
                    onClick={handlePringSetting}
                >
                    {langCheck("reportMultiLang", "formatDesign-000226")}
                </NCButton>
                <NCTooltip
                    placement="top"
                    inverse
                    overlay="Alt+Y"
                    trigger={["hover", "focus"]}
                    className="model-helper-overlay"
                >
                    <NCButton
                        fieldid=""
                        colors="primary"
                        className="sure-button"
                        onClick={sureModal}
                    >
                        {langCheck("reportMultiLang", "100301-000059")}(
                        <span className="underline">Y</span>)
                    </NCButton>
                </NCTooltip>
                <NCTooltip
                    placement="top"
                    inverse
                    overlay="Alt+N"
                    trigger={["hover", "focus"]}
                    className="model-helper-overlay"
                >
                    <NCButton
                        fieldid=""
                        className="cancel-button"
                        onClick={closeModal}
                    >
                        {langCheck("reportMultiLang", "100301-000048")}(
                        <span className="underline">N</span>)
                    </NCButton>
                </NCTooltip>
            </NCModal.Footer>
        </NCModal>
    );
}

export default PrintPlan;
