import React, { Component } from "react";
import { base, toast } from "nc-lightapp-front";
const { NCModal, NCButton, NCCheckbox, NCCollapse, NCHotKeys, NCTooltip } =
    base;
import Utils from "@public/utils";
const { langCheck } = Utils;
const NCCheckboxGroup = NCCheckbox.CheckboxGroup;
import TimerInput from "../components/TimerInput";
import NumberPage from "./NumberPage";
import { getRequireFlag } from "./methods";
require("./index.less");

export default class FilterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterValues: [],
            filterValuesList: [],
            showModal: false,
            filterType: null, //过滤器类型
            selectData: [], //筛选字符型下拉数据
            fieldName: "",
            defaultOptions: [],
            indeterminate: undefined,
            checkAll: false,
            showSelectData: false,
            filterInputValue: "",
        };
    }

    // 字符型多值筛选change事件
    handleMulSelectChange = (value) => {
        const { selectData = [], defaultOptions = [] } = this.state;
        const checkAll = selectData.some(
            (item) => item.value !== "%$S(*@#^)" && !value.includes(item.value)
        );

        const indeterminate = selectData.find((item) =>
            value.includes(item.value)
        );

        const filterValuesList = defaultOptions.filter((item) =>
            value.includes(item.value)
        );

        this.setState({
            filterValues: value,
            filterValuesList,
            indeterminate: indeterminate,
            checkAll: !checkAll,
        });
    };

    onSearch = (val) => {
        const { defaultOptions, filterValues } = this.state;
        const ret = defaultOptions.filter(
            (item) => item.label.indexOf(val) > -1
        );
        const indeterminate = ret.find((item) =>
            filterValues.includes(item.value)
        );
        const checkAll = ret.every((item) => filterValues.includes(item.value));
        this.setState({
            selectData: ret,
            indeterminate,
            checkAll,
            filterInputValue: val,
        });
    };

    closeModal = () => {
        this.setState({
            showModal: false,
            filterValues: [],
            filterValuesList: [],
            showSelectData: false,
            indeterminate: undefined,
            checkAll: false,
            filterInputValue: "",
        });
    };

    onCheckAllChange = (e) => {
        const { filterValues, selectData } = this.state;
        let plainOptions = selectData.map((item) => item.value),
            filterOptions = [];
        if (!e) {
            filterOptions = filterValues.filter(
                (item) => !plainOptions.includes(item)
            );
            plainOptions = [];
        }

        const filterList = e
            ? [...new Set([...filterValues, ...plainOptions])]
            : filterOptions;

        const filterValuesList = selectData.filter((item) =>
            filterList.includes(item.value)
        );

        this.setState({
            filterValues: filterList,
            filterValuesList,
            indeterminate: undefined,
            checkAll: e,
        });
    };

    toggleCheck = () => {
        this.changeStateOnClose();
        this.setState({ showSelectData: !this.state.showSelectData });
    };

    changeStateOnClose = () => {
        const { filterValues, selectData, checkAll } = this.state;
        if (!filterValues.length) {
            this.state.indeterminate = undefined;
            this.state.checkAll = false;
        } else if (checkAll && filterValues.length < selectData.length) {
            this.state.indeterminate = true;
            this.state.checkAll = false;
        }
    };

    createCollapse = () => {
        const { filterValuesList } = this.state;
        return (
            <div className="collapse-box nc-theme-area-bgc">
                <div className="collapse-header nc-theme-gray-area-bgc">
                    <div className="collapse-title">
                        {langCheck("reportMultiLang", "100301-000250")}
                    </div>
                    <div className="collapse-close">
                        <span
                            onClick={this.emptySelectData}
                            className="text-btn empty"
                        >
                            {langCheck("reportMultiLang", "100301-000251")}
                        </span>
                        <span
                            onClick={this.closeCollapse}
                            className="text-btn close"
                        >
                            {langCheck("reportMultiLang", "100301-000252")}
                        </span>
                    </div>
                </div>
                <ul className="collapse-content">
                    {filterValuesList.map((item) => (
                        <li className="fiter-item nc-theme-menu-item">
                            <span className="info">{item.label}</span>
                            <span
                                onClick={this.deleteItem.bind(this, item.value)}
                                className="delete"
                            >
                                {langCheck("reportMultiLang", "100301-000253")}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    deleteItem = (key) => {
        const { filterValues, filterValuesList } = this.state;

        this.setState({
            filterValues: filterValues.filter((item) => item !== key),
            filterValuesList: filterValuesList.filter(
                (item) => item.value !== key
            ),
        });
    };

    emptySelectData = () => {
        this.setState({ filterValues: [], filterValuesList: [] });
    };

    closeCollapse = () => {
        this.changeStateOnClose();
        this.setState({ showSelectData: false });
    };

    //根据筛选数据，自动选中复选框
    onShow = () => {
        const { defaultOptions, filterValuesList, filterType } = this.state;
        if (filterType === "NUMERIC") return;
        let indeterminate = undefined,
            checkAll = false;
        if (filterValuesList.length) {
            indeterminate = true;
            if (filterValuesList.length === defaultOptions.length) {
                checkAll = true;
            }
            this.setState({
                indeterminate,
                checkAll,
            });
        }
    };

    handleSubmmit = () => {
        const { filterType, operValues, filterValues, defaultOptions } =
            this.state;
        if (filterType === "NUMERIC") {
            const infoList = this.refs.numberPage.getInfo();
            const { isError, item, currentIndex } = getRequireFlag(infoList);
            if (isError) {
                toast({
                    content: langCheck("reportMultiLang", "100301-000267"),
                    color: "warning",
                });
                return;
            }
            this.props.handleSubmmit(infoList);
        } else {
            //这个判断暂时不需要了，直接传勾选的即可
            // let isCheckedAll = false;
            // if (
            //     filterValues.length > 1 &&
            //     filterValues.length === defaultOptions.length &&
            //     typeof operValues[0] !== "string"
            // ) {
            //     isCheckedAll = true;
            // }
            this.props.handleSubmmit();
        }
        this.closeModal();
    };

    //高亮筛选字符
    checkFilterValue = (str) => {
        const { filterInputValue } = this.state;
        if (!filterInputValue) return str;
        const index = str.indexOf(filterInputValue);

        let before = str.substring(0, index);
        let target = str.substring(index, index + filterInputValue.length);
        let after = str.substring(index + filterInputValue.length, str.length);

        return (
            <span>
                {before}
                <span className="filter-string-matching">{target}</span>
                {after}
            </span>
        );
    };

    render() {
        const { handleClose } = this.props;
        let {
            filterType,
            selectData,
            fieldName,
            showModal,
            filterValues,
            indeterminate,
            checkAll,
            showSelectData,
            operValues,
            filterValuesList,
        } = this.state;
        if (!showModal || !filterType) return null;

        const confirmDisabled = filterType === "STRING" && !filterValuesList.length;

        return (
            <NCHotKeys
                keyMap={{
                    sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                    cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL,
                }}
                handlers={{
                    sureBtnHandler: () => {
                        if (confirmDisabled) return;
                        this.handleSubmmit();
                    },
                    cancelBtnHandler: () => {
                        this.closeModal();
                        handleClose();
                    },
                }}
                className="simpleModal-hotkeys-wrapper"
                focused={true}
                attach={document.body}
            >
                <NCModal
                    onHide={this.closeModal}
                    onShow={this.onShow}
                    fieldid="filter"
                    size="md"
                    show={showModal}
                    id="filterModal"
                    className="report-modal-class filterPanel-modal"
                >
                    {!showSelectData && (
                        <NCModal.Header
                            className="report-modal-header"
                            closeButton={true}
                        >
                            <NCModal.Title fieldid={fieldName}>
                                {fieldName}{" "}
                                {langCheck("reportMultiLang", "100301-000033")}
                                {/* 国际化处理： 筛选*/}
                            </NCModal.Title>
                        </NCModal.Header>
                    )}

                    <NCModal.Body className="report-modal-body">
                        {filterType === "STRING" && (
                            <div
                                className={`collapse ${
                                    showSelectData ? "show" : "close"
                                }`}
                            >
                                {this.createCollapse()}
                            </div>
                        )}
                        {filterType === "NUMERIC" ? (
                            <NumberPage
                                ref="numberPage"
                                operValues={operValues}
                            />
                        ) : filterType === "STRING" ? (
                            <div className="filter-box">
                                <TimerInput
                                    onSearch={(val) => this.onSearch(val)}
                                />
                                {selectData.length ? (
                                    <NCCheckbox
                                        className="report-checkbox check-all"
                                        value="$$$all"
                                        indeterminate={indeterminate}
                                        onChange={this.onCheckAllChange}
                                        checked={checkAll}
                                    >
                                        {langCheck(
                                            "reportMultiLang",
                                            "100301-000248"
                                        )}
                                    </NCCheckbox>
                                ) : null}
                                <NCCheckboxGroup
                                    className="report-checkbox-group"
                                    value={filterValues}
                                    onChange={this.handleMulSelectChange}
                                >
                                    {selectData.map((item) => (
                                        <NCCheckbox
                                            key={item.value}
                                            className="report-checkbox nc-theme-area-split-bc"
                                            value={item.value}
                                        >
                                            {this.checkFilterValue(item.label)}
                                        </NCCheckbox>
                                    ))}
                                </NCCheckboxGroup>
                            </div>
                        ) : null}
                    </NCModal.Body>
                    <NCModal.Footer className="report-modal-footer">
                        <div className="selected">
                            {filterType === "STRING" && (
                                <NCButton
                                    onClick={this.toggleCheck}
                                    className="check-count nc-theme-common-font-c"
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000249"
                                    )}
                                    ({filterValuesList.length})
                                </NCButton>
                            )}
                        </div>

                        <div>
                            <NCTooltip
                                inverse
                                trigger={["hover", "focus"]}
                                placement="top"
                                className="model-helper-overlay"
                                overlay={`${langCheck(
                                    "reportMultiLang",
                                    "100301-000059"
                                )}  (${NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM})`}
                            >
                                <NCButton
                                    fieldid="sure"
                                    colors="primary"
                                    className="sure-button"
                                    disabled={confirmDisabled}
                                    onClick={() => {
                                        this.handleSubmmit();
                                    }}
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000059"
                                    )}
                                    {/* 国际化处理： 确定*/}(
                                    <span className="text-decoration-underline">
                                        Y
                                    </span>
                                    )
                                </NCButton>
                            </NCTooltip>
                            <NCTooltip
                                inverse
                                trigger={["hover", "focus"]}
                                placement="top"
                                className="model-helper-overlay"
                                overlay={`${langCheck(
                                    "reportMultiLang",
                                    "100301-000048"
                                )}  (${NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL})`}
                            >
                                <NCButton
                                    fieldid="cancel"
                                    className="cancel-button"
                                    onClick={() => {
                                        this.closeModal();
                                        handleClose();
                                    }}
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "100301-000048"
                                    )}
                                    {/* 国际化处理： 取消*/}(
                                    <span className="text-decoration-underline">
                                        N
                                    </span>
                                    )
                                </NCButton>
                            </NCTooltip>
                        </div>
                    </NCModal.Footer>
                </NCModal>
            </NCHotKeys>
        );
    }
}
