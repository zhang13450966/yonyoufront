import React, { Component } from "react";
import { base, getMultiLang } from "nc-lightapp-front";
const { NCSelect, NCButton, NCTooltip } = base;
const NCOption = NCSelect.NCOption;
import Utils from "@public/utils";
const { langCheck } = Utils;
require("./index.less");

export default class Rolling extends Component {
    constructor(props) {
        super(props);
        this.state = { selectValue: {} };
    }

    componentDidMount() {
        if (!window.reportMultiLang) {
            let callback = json => {
                window.reportMultiLang = json;
                this.forceUpdate();
            };
            getMultiLang({
                moduleId: 100301,
                currentLocale: "zh-CN",
                domainName: "lappreportrt",
                callback,
            });
        }
    }

    //下拉框类型选择change事件，有单选与多选
    onSelectChange = (index, val) => {
        let obj;
        if (Array.isArray(val)) {
            val = val.filter(item => item.indexOf("$$$$") > -1);
            let dis = "",
                rel = "";
            val.forEach((item, index) => {
                let splitValue = item.split("$$$$");
                if (index == val.length - 1) {
                    dis += splitValue[1];
                    rel += splitValue[0];
                } else {
                    dis += `${splitValue[1]}@@`;
                    rel += `${splitValue[0]}@@`;
                }
            });
            obj = { id: index + 1, relValue: rel, disValue: dis };
        } else {
            let splitValue = val.split("$$$$");
            obj = {
                id: index + 1,
                relValue: splitValue[0],
                disValue: splitValue[1],
            };
        }

        this.setState({
            selectValue: {
                ...this.state.selectValue,
                [index]: val,
            },
        });
        this.props.checkPaper(obj, index, "select");
    };

    //清空选中数据
    clearSelectValue = () => {
        this.setState({ selectValue: {} });
    };

    //上下首末页类型点击每一项的事件
    onUpDownClick = pagerData => {
        const { modalRollingArray, pageInfo } = pagerData;
        //未查询不可点击
        if (
            modalRollingArray == null ||
            modalRollingArray[0].perch == 0 ||
            pageInfo.length > 1
        ) {
            return;
        }
        modalRollingArray[0].forEach((item, index) => {
            item.orderIndex = index;
        });
        this.props.showPagerClick(0, modalRollingArray, pageInfo);
    };

    //上下首末按钮点击事件
    rollingUpDown = way => {
        if (!this.props.pagerData.flag) return;
        if (this.props.pagerData.pageInfo[0].choiceStyle == 4) return;
        this.props.rollingUpDown(way);
    };

    render() {
        const { rollingPagerData = [], pagerData, allData } = this.props;
        if (!pagerData || !allData) return null;

        const { dataArr = [], defPageDim = {} } = allData;
        const { pageInfo, modalRollingArray = [] } = pagerData;
        let disabled;
        if (dataArr && dataArr.length == 1) {
            disabled = "disabled";
        }
        const { selectValue } = this.state;

        return (
            <div className="rolling-box">
                {/* 上下首末页类型 */}
                {(pagerData.type == 1 || pagerData.type == 2) && (
                    <div className="rolling">
                        {pagerData &&
                            pagerData.upDownRollingArray &&
                            pagerData.upDownRollingArray.map((item, index) => {
                                return (
                                    <div className="pager" key={index}>
                                        <h2
                                            className="pager-title nc-theme-common-font-c"
                                            title={pageInfo[index].name}
                                        >
                                            {pageInfo[index].name}
                                        </h2>
                                        <span
                                            style={{
                                                width:
                                                    pageInfo[index]
                                                        .pageDimCompWidth &&
                                                    pageInfo[index]
                                                        .pageDimCompWidth > 120
                                                        ? pageInfo[index]
                                                            .pageDimCompWidth +
                                                          "px"
                                                        : "120px",
                                            }}
                                            fieldid="nexts"
                                            title={item.disValue || ""}
                                            className="up-down nc-theme-common-font-c nc-theme-area-split-bc next"
                                            onClick={() => {
                                                if (
                                                    pageInfo[index]
                                                        .choiceStyle == 4
                                                )
                                                    return;
                                                this.onUpDownClick.call(
                                                    this,
                                                    pagerData,
                                                );
                                            }}
                                        >
                                            <NCTooltip
                                                inverse
                                                placement="bottom"
                                                overlay={item.disValue}
                                            >
                                                <span className="display">
                                                    {item.disValue || " "}
                                                </span>
                                            </NCTooltip>
                                        </span>
                                    </div>
                                );
                            })}
                        <span>
                            {pagerData.type == 2 && (
                                <i
                                    fieldid="first"
                                    onClick={this.rollingUpDown.bind(
                                        this,
                                        "first",
                                    )}
                                    className={
                                        "icon iconfont icon-shangyiye border-left-none nc-theme-area-split-bc " +
                                        disabled
                                    }
                                />
                            )}
                            <i
                                fieldid="prev"
                                onClick={this.rollingUpDown.bind(this, "prev")}
                                className={
                                    "icon iconfont icon-jiantouzuo border-left-none nc-theme-area-split-bc " +
                                    disabled
                                }
                            />
                            <i
                                fieldid="next"
                                onClick={this.rollingUpDown.bind(this, "next")}
                                className={
                                    "icon iconfont icon-jiantouyou border-left-none nc-theme-area-split-bc " +
                                    disabled
                                }
                            />
                            {pagerData.type == 2 && (
                                <i
                                    fieldid="last"
                                    onClick={this.rollingUpDown.bind(
                                        this,
                                        "last",
                                    )}
                                    className={
                                        "icon iconfont icon-xiayiye border-left-none nc-theme-area-split-bc " +
                                        disabled
                                    }
                                />
                            )}
                        </span>
                        <span
                            className="empty"
                            onClick={this.props.onRollingClear}
                        >
                            {langCheck("reportMultiLang", "100301-000251")}
                        </span>
                    </div>
                )}
                {/* 下拉框类型 */}
                {pagerData.type == 0 && (
                    <div className="rolling">
                        {modalRollingArray.map((item, index) => {
                            let newModalRollingArray = item || [];
                            if (
                                pageInfo[index].choiceStyle == 2 ||
                                pageInfo[index].choiceStyle == 3
                            ) {
                                if (pageInfo[index].relationCondition) {
                                    if (
                                        modalRollingArray !== null &&
                                        modalRollingArray[0].perch == undefined
                                    ) {
                                        pageInfo[
                                            index
                                        ].relationCondition.forEach(
                                            (key, index) => {
                                                let checkedArray =
                                                    (rollingPagerData[index] &&
                                                        rollingPagerData[index]
                                                            .relValue &&
                                                        rollingPagerData[
                                                            index
                                                        ].relValue.split(
                                                            "@@",
                                                        )) ||
                                                    [];
                                                if (checkedArray.length > 1) {
                                                    // 参照多选
                                                    newModalRollingArray =
                                                        newModalRollingArray.filter(
                                                            item =>
                                                                checkedArray.includes(
                                                                    item[key],
                                                                ),
                                                        );
                                                } else {
                                                    newModalRollingArray =
                                                        newModalRollingArray.filter(
                                                            item => {
                                                                if (
                                                                    !rollingPagerData[
                                                                        index
                                                                    ] ||
                                                                    !rollingPagerData[
                                                                        index
                                                                    ].relValue
                                                                ) {
                                                                    return true;
                                                                } else {
                                                                    return (
                                                                        item[
                                                                            key
                                                                        ] ==
                                                                        rollingPagerData[
                                                                            index
                                                                        ]
                                                                            .relValue
                                                                    );
                                                                }
                                                            },
                                                        );
                                                }
                                            },
                                        );
                                    }
                                }
                                return (
                                    <div className="pager">
                                        <h2
                                            className="pager-title nc-theme-common-font-c"
                                            title={pageInfo[index].name}
                                        >
                                            {pageInfo[index].name}
                                        </h2>
                                        <NCSelect
                                            style={{
                                                width:
                                                    pageInfo[index]
                                                        .pageDimCompWidth &&
                                                    pageInfo[index]
                                                        .pageDimCompWidth > 200
                                                        ? pageInfo[index]
                                                            .pageDimCompWidth +
                                                          "px"
                                                        : "200px",
                                            }}
                                            showClear={false}
                                            fieldid="check_select"
                                            className="fieldid_check_select"
                                            placeholder={langCheck(
                                                "reportMultiLang",
                                                "100301-000069",
                                            )} /* 国际化处理： 请选择*/
                                            onChange={this.onSelectChange.bind(
                                                this,
                                                index,
                                            )}
                                            multiple={
                                                pageInfo[index].choiceStyle == 3
                                                    ? true
                                                    : false
                                            }
                                            value={
                                                selectValue[index] ||
                                                defPageDim[
                                                    pageInfo[index].relCode
                                                ]
                                            }
                                        >
                                            {modalRollingArray !== null &&
                                            modalRollingArray[0].perch ==
                                                undefined
                                                ? newModalRollingArray.filter(item => item.disValue).map(
                                                    ele => {
                                                        let dis =
                                                              ele.disValue;
                                                        if (
                                                            !dis &&
                                                              ele.relValue ===
                                                                  "%$S(*@#^)"
                                                        )
                                                            dis = langCheck(
                                                                "reportMultiLang",
                                                                "100301-000018",
                                                            );
                                                        if (
                                                            !dis &&
                                                              ele.relValue ==
                                                                  "null"
                                                        )
                                                            dis = langCheck(
                                                                "reportMultiLang",
                                                                "100301-000019",
                                                            );
                                                        return (
                                                            <NCOption
                                                                key={ele.relValue}
                                                                fieldid={
                                                                    ele.disValue
                                                                }
                                                                value={
                                                                    ele.relValue +
                                                                      "$$$$" +
                                                                      dis
                                                                }
                                                            >
                                                                {dis}
                                                            </NCOption>
                                                        );
                                                    },
                                                )
                                                : null}
                                        </NCSelect>
                                    </div>
                                );
                            } else if (
                                pageInfo[index].choiceStyle == 0 ||
                                pageInfo[index].choiceStyle == 1 ||
                                pageInfo[index].choiceStyle == 4 ||
                                pageInfo[index].choiceStyle == undefined
                            ) {
                                // 参照类型
                                return (
                                    <div className="pager">
                                        <h2
                                            className="pager-title nc-theme-common-font-c"
                                            title={pageInfo[index].name}
                                        >
                                            {pageInfo[index].name}
                                        </h2>
                                        <span
                                            style={{
                                                width:
                                                    pageInfo[index]
                                                        .pageDimCompWidth &&
                                                    pageInfo[index]
                                                        .pageDimCompWidth > 120
                                                        ? pageInfo[index]
                                                            .pageDimCompWidth +
                                                          "px"
                                                        : "120px",
                                            }}
                                            className="up-down nc-theme-common-font-c nc-theme-area-split-bc"
                                            onClick={() => {
                                                if (
                                                    pageInfo[index]
                                                        .choiceStyle == 4
                                                )
                                                    return;
                                                this.props.showPagerClick.call(
                                                    this,
                                                    index,
                                                    modalRollingArray,
                                                    pageInfo,
                                                );
                                            }}
                                        >
                                            <NCTooltip
                                                inverse
                                                placement="bottom"
                                                overlay={
                                                    rollingPagerData[index] &&
                                                    rollingPagerData[index]
                                                        .disValue
                                                        ? rollingPagerData[
                                                            index
                                                        ].disValue.replace(
                                                            /@@/gi,
                                                            ",",
                                                        )
                                                        : pageInfo[index]
                                                            .selectedDisValue
                                                }
                                            >
                                                <span className="display">
                                                    {rollingPagerData[index] &&
                                                    rollingPagerData[index]
                                                        .disValue
                                                        ? rollingPagerData[
                                                            index
                                                        ].disValue.replace(
                                                            /@@/gi,
                                                            ",",
                                                        )
                                                        : pageInfo[index]
                                                            .selectedDisValue}
                                                </span>
                                            </NCTooltip>
                                            {pageInfo[index].choiceStyle !=
                                                4 && (
                                                <b
                                                    fieldid="filtericon"
                                                    className={
                                                        "icon iconfont icon-canzhao"
                                                    }
                                                />
                                            )}
                                        </span>
                                    </div>
                                );
                            }
                        })}
                        <NCButton
                            fieldid="filter"
                            className="filter"
                            onClick={this.props.rollingFilterClick}
                        >
                            {langCheck("reportMultiLang", "100301-000033")}
                        </NCButton>
                        <span
                            className="empty"
                            onClick={() => {
                                this.clearSelectValue();
                                this.props.onRollingClear(pageInfo);
                            }}
                        >
                            {langCheck("reportMultiLang", "100301-000251")}
                        </span>
                    </div>
                )}
            </div>
        );
    }
}
