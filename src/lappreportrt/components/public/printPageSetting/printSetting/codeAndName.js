import React, {
    useState,
    useImperativeHandle,
    forwardRef,
    memo,
    useRef,
    useEffect,
} from "react";
import { base, toast } from "nc-lightapp-front";

// import { Pcontext } from '../pstore';
import Utils from "@public/utils";

const { NCModal, NCButton, NCHotKeys, NCMultiLangText, NCTooltip } = base;

const { langCheck } = Utils;

function inner2out(langValue) {
    const result = {};
    for (let key in langValue) {
        const val = langValue[key].value;
        if (key == "printName1") key = "printName";
        result[key] = val;
    }
    return result;
}

/**
 * 方案名称和方案编码
 * @returns
 */
function CodeAndName(
    { title, submit = () => {}, initName = "", planLists, langinfo, langseq },
    ref
) {
    const currentEditIndex = useRef(0);

    const [isShow, setIsShow] = useState(false);

    const [isError, setIsError] = useState(false);

    const [langValue, setLangValue] = useState({});

    const [currentLangSeq, setCurrnetLangSeq] = useState(langseq);

    useImperativeHandle(ref, () => {
        return {
            open: openModal,
        };
    });

    function openModal(langValue, index) {
        if (langValue) {
            currentEditIndex.current = index;
            const val = {};
            Object.keys(langValue).forEach((key) => {
                const value = langValue[key] + ""; //copy NCC-103684
                if (key == "printName") {
                    key = "printName1";
                }
                val[key] = { value };
            });
            setLangValue(val);
        }
        setIsShow(true);
    }

    /**
     * 校验必填和重复
     */
    function verify() {
        let content = langCheck("reportMultiLang", "formatDesign-000230");
        let result = true;

        const { value } = langValue["printName" + currentLangSeq] || {};
        if (!value) result = false;

        const outNames = inner2out(langValue);

        for (let i = 0; i < planLists.length; i++) {
            // if (currentEditIndex.current == i) continue;

            const plan = planLists[i];

            for (let key in plan) {
                const inVal = outNames[key];

                const ouVal = plan[key];

                if (!!inVal && inVal == ouVal) {
                    result = false;
                    const errorSeq = key.substring(9) || "1";
                    const { langdisplayname } =
                        langinfo.find((lang) => lang.index == errorSeq) || {};
                    content = `${langCheck(
                        "reportMultiLang",
                        "formatDesign-000231"
                    )}`;
                    break;
                }
            }
        }

        if (!result) {
            setIsError(true);
            toast({ content, color: "warning" });
        }
        return result;
    }

    function sureModal() {
        const value =
            (langValue && langValue.printName1 && langValue.printName1.value) ||
            "";
        if (/\s/.test(value)) {
            let content = langCheck("reportMultiLang", "formatDesign-000940");
            toast({ content, color: "warning" });
            return;
        }
        if (verify()) {
            submit(inner2out(langValue));

            closeModal();
        }
    }

    function closeModal() {
        setIsError(false);
        setIsShow(false);
    }

    return (
        <NCModal
            autoFocus
            size='sm'
            fieldid=""
            show={isShow}
            className="report-code-name-modal"
            maxHeight="254"
            onKeyDown={(e) => {
                if (e.keyCode == 13) {
                    sureModal();
                }
            }}
            onShow={() => {
                setTimeout(() => {
                    document
                        .querySelector(
                            ".report-code-name-modal input"
                        )
                        .focus();
                }, 300);
            }}
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
                <NCModal.Title fieldid="">{title}</NCModal.Title>
            </NCModal.Header>
            <NCModal.Body className='print-modal-body'>
                <div
                    className="code-name-container"
                >
                    <div className={`item ${isError ? "error" : ""}`}>
                        <i>*</i>
                        <span>
                            {langCheck(
                                "reportMultiLang",
                                "formatDesign-000232"
                            )}
                        </span>
                        <NCMultiLangText
                            value={langValue}
                            languageMeta={langinfo}
                            attrcode="printName"
                            LangIndex={langseq}
                            onChange={(val) => {
                                setLangValue(val);
                            }}
                            onSelect={(val, seq) => setCurrnetLangSeq(seq)}
                        />
                    </div>
                </div>
            </NCModal.Body>
            <NCModal.Footer>
                <NCTooltip
                    placement="top"
                    inverse
                    overlay="确定(Alt+Y)"
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
                    overlay="取消(Alt+N)"
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

export default memo(forwardRef(CodeAndName));
