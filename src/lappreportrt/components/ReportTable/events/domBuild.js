import React, { useState, useCallback } from "react";
import { getDrillItemDisabled } from "./methods";
import Utils from "@public/utils";
import {
    base,
    formatDatetime,
    toast,
    serverTimeToLocal,
} from "nc-lightapp-front";
const {
    NCDropdown,
    NCMenu,
    NCButton,
    NCHotKeys,
    NCTooltip,
    NCTabs,
    NCCollapse,
} = base;
import { getExecuteStasus } from "../config";
const { Item } = NCMenu;
const NCTabPane = NCTabs.NCTabPane;
import Handsontable from "@public/office";
import Pagintion from "@public/pagination";
import GraphicComponent from "@public/PluginGraphic";
import { changeMessageStatus, downloadAtta } from "@public/utils/requests";
import BtnItemTip from "@public/components/BtnItemTip";
import ToolContainer from "@public/components/ToolContainer";
import EmptyComponent from "@public/components/EmptyComponent";
import moment from "moment";

const { langCheck } = Utils;

//表格部分
export function createHandsontableDOM({ app, afterSelection, realCoords }) {
    const classNames =
        "pixel-ratio-" + Math.round(window.devicePixelRatio * 100);
    const {
        reportBoxHeight,
        findSelectCells,
        graphicParams,
        reportType,
        is_no_pagination,
        pager,
        settings,
        preciseDisabled,
    } = app.state;
    const { coverRowData, ownReportParams = {} } = app.props;

    return (
        <div
            className={`hot-table nc-theme-area-split-bc ${classNames}`}
            id="reportTable"
            fieldid="report-area"
        >
            <div className="report-graphic-box">
                <div
                    style={{ minWidth: 1, flex: 1, height: reportBoxHeight }}
                    fieldid="report-area"
                    className="report-area"
                >
                    <Handsontable
                        ref="hansontable"
                        afterSelection={afterSelection}
                        settings={settings}
                        afterOnCellMouseDown={app.afterOnCellMouseDown}
                        onFindSelectCells={app.onFindSelectCells}
                        findSelectCells={findSelectCells}
                        isFromPreview={ownReportParams.hideContextMenu}
                    />
                    {app.WOTER_MARK_IMAGE && (
                        <div
                            className="watermark"
                            style={{
                                backgroundImage: `url(${app.WOTER_MARK_IMAGE})`,
                            }}
                        ></div>
                    )}
                    {reportType != "2" && !is_no_pagination && (
                        <Pagintion
                            pager={pager}
                            dataRowNum={app.initParams.dataRowNum}
                            preloadMaxRow={app.preloadMaxRow}
                            isClickShowAllCount={app.isClickShowAllCount}
                            isConnection={app.isConnection}
                            getRealCount={app.getRealCount}
                            pageClick={app.pageClick}
                            handleChange={app.handleChange}
                            reportType={reportType}
                        />
                    )}
                </div>
                {graphicParams.isDefaultExpand && (
                    <GraphicComponent
                        ref={(ref) => (app.siderBarInstance = ref)}
                        updateGraphicState={app.updateGraphicState}
                        graphicParams={graphicParams}
                        commonParams={app.commonParams}
                        realCoords={realCoords}
                        sendSearchParams={app.sendSearchParams}
                        coverRowData={coverRowData}
                        pointMap={app.pointMap}
                        preciseDisabled={preciseDisabled}
                        currentSelectedCell={app.tdSelectedArea}
                    />
                )}
            </div>
        </div>
    );
}

//侧边栏
export function createSiderBarDOM({ graphicParams, handleClick }) {
    return graphicParams.sideBarList.length ? (
        <div className="btn-box">
            <NCTooltip
                inverse
                placement={"bottom"}
                overlay={
                    graphicParams.isDefaultExpand
                        ? langCheck("reportMultiLang", "100301-000099")
                        : langCheck("reportMultiLang", "100301-000098")
                }
            >
                <NCButton
                    fieldid="graphic"
                    shape="icon"
                    className={`${
                        window.top.nccColor === "black"
                            ? "black-graphic"
                            : graphicParams.isDefaultExpand
                            ? "active-graphic"
                            : "hide-graphic"
                    }`}
                    onClick={handleClick}
                >
                    <span />
                </NCButton>
            </NCTooltip>
        </div>
    ) : null;
}

//汇总明细
export function createDetailSelectDOM({
    isShowDetailSelect,
    filterMenuClick,
    commonParams,
    isClickSearchBtn,
}) {
    const filterMenu = (
        <NCMenu onClick={filterMenuClick}>
            <Item
                disabled={
                    commonParams.keyIsExecDrill || isClickSearchBtn
                        ? false
                        : true
                }
                className={
                    commonParams.keyIsExecDrill || isClickSearchBtn
                        ? "nc-theme-menu-item"
                        : "nc-theme-menu-item disabled"
                }
                key="detail"
                fieldid="detail"
            >
                {langCheck("reportMultiLang", "100301-000096")}
            </Item>
            {/* 国际化处理： 仅明细*/}
            <Item
                disabled={
                    commonParams.keyIsExecDrill || isClickSearchBtn
                        ? false
                        : true
                }
                className={
                    commonParams.keyIsExecDrill || isClickSearchBtn
                        ? "nc-theme-menu-item"
                        : "nc-theme-menu-item disabled"
                }
                key="all"
                fieldid="all"
            >
                {langCheck("reportMultiLang", "100301-000097")}
            </Item>
            {/* 国际化处理： 仅汇总*/}
        </NCMenu>
    );
    return isShowDetailSelect ? (
        <div className="btn-box" id="detail">
            <NCDropdown
                fieldid="detailList"
                trigger={["click"]}
                overlay={filterMenu}
                animation="slide-up"
                getPopupContainer={() => document.getElementById("detail")}
            >
                <NCButton className="btn" fieldid="detail" is_arrow={true}>
                    {langCheck("reportMultiLang", "100301-000095")}
                    {/* 国际化处理： 明细/汇总*/}
                </NCButton>
            </NCDropdown>
        </div>
    ) : null;
}

//打印按钮构建
export function createPrintListDOM({
    printmenu,
    printOther,
    noDropdownPrint,
    drillType,
    onVisibleChange,
    onHandlePrint,
    dayinVisible,
    printSelectClass,
    onPrintMenuClick,
    printType,
}) {
    const outputOptions = getPrintOptions({ printmenu, printOther });

    const outputMenu = getPrintMenu({
        onPrintMenuClick,
        outputOptions,
        noDropdownPrint,
    });

    return drillType === "2" ? (
        <div className="btn-box" id="dayin">
            {printType === "select" ? (
                <NCDropdown
                    fieldid="print"
                    trigger={["click"]}
                    overlay={outputMenu}
                    animation="slide-up"
                    disabled={noDropdownPrint}
                    onVisibleChange={(e) => onVisibleChange("dayin", e)}
                    getPopupContainer={() => document.getElementById("dayin")}
                >
                    <NCButton
                        fieldid="print"
                        disabled={noDropdownPrint}
                        is_arrow={true}
                    >
                        <span>
                            {langCheck("reportMultiLang", "100301-000038")}
                        </span>
                        <span
                            style={noDropdownPrint ? { color: "#f2f2f2" } : {}}
                            className={`icon iconfont ${
                                dayinVisible
                                    ? "icon-hangcaozuoxiangshang1"
                                    : "icon-hangcaozuoxiala1"
                            }`}
                        />
                    </NCButton>
                </NCDropdown>
            ) : (
                [
                    <NCHotKeys
                        key="123"
                        style={{
                            padding: 0,
                            float: "left",
                        }}
                        keyMap={{
                            // key为内置常量  例如 NC_ADD => ctrl+/
                            addActionSign: NCHotKeys.USUAL_KEYS.NC_BTN_PRINT,
                        }}
                        handlers={{
                            addActionSign: () => {
                                if (noDropdownPrint) return;
                                onHandlePrint();
                            },
                        }}
                        // 触发区域  默认为 document.body
                        focused={true}
                    >
                        <NCTooltip
                            overlay={`${langCheck(
                                "reportMultiLang",
                                "100301-000038"
                            )} (Ctrl+P)`}
                            inverse
                            placement="bottom"
                        >
                            <NCButton
                                fieldid="print"
                                onClick={onHandlePrint}
                                disabled={noDropdownPrint}
                                className="btn left-radius"
                            >
                                {langCheck("reportMultiLang", "100301-000038")}
                                {/* 国际化处理： 打印*/}
                            </NCButton>
                        </NCTooltip>
                    </NCHotKeys>,
                    <NCDropdown
                        fieldid="print"
                        trigger={["click"]}
                        overlay={outputMenu}
                        animation="slide-up"
                        getPopupContainer={() =>
                            document.getElementById("dayin")
                        }
                        overlayClassName={`hanson-export position-left ${printSelectClass}`}
                        onVisibleChange={(e) => onVisibleChange("dayin", e)}
                    >
                        <NCButton
                            className={"output-container"}
                            fieldid="print"
                            is_arrow={true}
                        >
                            <i
                                className={`icon iconfont ${
                                    dayinVisible
                                        ? "icon-hangcaozuoxiangshang1"
                                        : "icon-hangcaozuoxiala1"
                                }`}
                            />
                        </NCButton>
                    </NCDropdown>,
                ]
            )}
        </div>
    ) : null;
}

//获取打印Menu
function getPrintMenu({ onPrintMenuClick, outputOptions, noDropdownPrint }) {
    return (
        <NCMenu
            onClick={(val) => {
                onPrintMenuClick(val.key);
            }}
        >
            {outputOptions.map((item) => {
                if (item.key) {
                    return (
                        <Item
                            disabled={
                                noDropdownPrint || item.disabled ? true : false
                            }
                            className={
                                noDropdownPrint || item.disabled
                                    ? "nc-theme-menu-item disabled"
                                    : "nc-theme-menu-item"
                            }
                            key={item.key}
                            fieldid={item.display}
                            printExpend={true}
                            title={item.display}
                        >
                            {item.display}
                        </Item>
                    );
                } else if (item.nodekey) {
                    return (
                        <Item
                            disabled={noDropdownPrint ? true : false}
                            className={
                                noDropdownPrint
                                    ? "nc-theme-menu-item disabled"
                                    : "nc-theme-menu-item"
                            }
                            key={item.nodekey}
                            title={item.name}
                            fieldid={item.name}
                        >
                            {item.name}
                        </Item>
                    );
                } else {
                    return (
                        <Item
                            disabled={noDropdownPrint ? true : false}
                            className={
                                noDropdownPrint
                                    ? "nc-theme-menu-item disabled"
                                    : "nc-theme-menu-item"
                            }
                            key={item.value}
                            fieldid={item.value}
                        >
                            {item.display}
                        </Item>
                    );
                }
            })}
        </NCMenu>
    );
}

//获取打印下拉数据
function getPrintOptions({ printmenu, printOther }) {
    return [
        {
            display: langCheck("reportMultiLang", "100301-000025"),
            value: "xlsx",
        },
        {
            display: langCheck("reportMultiLang", "100301-000026"),
            value: "csv",
        },
        {
            display: langCheck("reportMultiLang", "100301-000027"),
            value: "pdf",
        },
        ...printmenu,
        ...printOther,
    ];
}

//高级按钮构建
export function createHighButtonDOM({
    showHighSearchBtn,
    drillType,
    handleClick,
}) {
    return showHighSearchBtn && drillType !== "2" ? (
        <div className="btn-box">
            <NCButton
                fieldid="search"
                shape="border"
                colors="primary"
                className="btn high-btn"
                onClick={handleClick}
            >
                {langCheck("reportMultiLang", "100301-000029")}
                {/* 国际化处理： 查询*/}
            </NCButton>
        </div>
    ) : null;
}

//联查构建
export function createDrillListDOM(params) {
    const {
        drillRulesList = [],
        disabledDrillColArray,
        preciseDisabled,
        relationSearch,
        coord,
    } = params;
    const Items = getMenuItem(params);

    const searchMenu = (
        <NCMenu
            className="button-config-menu button-app-dropdown-menu-wrapper"
            onClick={relationSearch}
        >
            {Items}
        </NCMenu>
    );

    return drillRulesList.length ? (
        <div className="btn-box" id="liancha">
            {drillRulesList.length > 1 ? (
                <NCDropdown
                    fieldid="drill"
                    trigger={["click"]}
                    overlay={searchMenu}
                    animation="slide-up"
                    getPopupContainer={() => document.getElementById("liancha")}
                >
                    <NCButton
                        fieldid="drill"
                        is_arrow={true}
                        className="dropdown-component"
                    >
                        {langCheck("reportMultiLang", "100301-000037")}
                        <span className="arrow icon iconfont icon-hangcaozuoxiala1" />

                        {/* 国际化处理： 联查*/}
                    </NCButton>
                </NCDropdown>
            ) : (
                <NCButton
                    fieldid="drill"
                    className="btn"
                    disabled={getDrillItemDisabled({
                        item: drillRulesList[0],
                        disabledDrillColArray,
                        preciseDisabled,
                        coord,
                    })}
                    onClick={() => {
                        relationSearch(drillRulesList[0].drillCode);
                    }}
                >
                    {drillRulesList[0].drillName}
                    {/* 国际化处理： 联查*/}
                </NCButton>
            )}
        </div>
    ) : null;
}

//联查项
function getMenuItem({
    drillRulesList = [],
    disabledDrillColArray,
    preciseDisabled,
    coord,
}) {
    const menuItems = drillRulesList.map((item) => {
        return (
            <Item
                disabled={getDrillItemDisabled({
                    item,
                    disabledDrillColArray,
                    preciseDisabled,
                    coord,
                })}
                className={
                    getDrillItemDisabled({
                        item,
                        disabledDrillColArray,
                        preciseDisabled,
                        coord,
                    })
                        ? "nc-theme-menu-item dropdown-btn-item-box disabled"
                        : "nc-theme-menu-item dropdown-btn-item-box"
                }
                key={item.drillCode}
                fieldid={item.drillName}
                title={item.drillName}
            >
                <BtnItemTip overlay={item.drillName}>
                    <span className="btn-item-left">{item.drillName}</span>
                </BtnItemTip>
            </Item>
        );
    });
    return menuItems;
}

const useUpdate = () => {
    const [_, setState] = useState(0);
    return useCallback(() => {
        setState((num) => num + 1);
    });
};

//构建分享侧边栏dom结构
export function CreateShareBodyDOM(params) {
    const [activeItem, setActiveItem] = useState({});
    const [activeKey, setActiveKey] = useState("current");
    const {
        type,
        data,
        onSliderItemClick,
        isReviewHistory,
        changeNotReadCount,
    } = params;
    const update = useUpdate();
    let dom = null;

    async function onItemClick(item, isDownload) {
        setActiveItem(item);
        switch (activeKey) {
            case "current":
                if (item.isread !== "Y") {
                    await changeMessageStatus({ data: [item.pk_message] });
                }
                if (isDownload) {
                    downloadAtta(item.path, item.filename);
                }
                if (item.isread !== "Y") changeStatus(item);
                break;
            case "timing":
                onSliderItemClick(item);
                break;
        }
    }

    function changeStatus(item) {
        for (let i = 0; i < data.length; i++) {
            if (item && item.path === data[i].path) {
                data[i].isread = "Y";
                break;
            }
            if (!item && data[i].isread && data[i].isread !== "Y") {
                data[i].isread = "Y";
            }
        }
        const notReadItem = data.find((item) => item.isread !== "Y");
        //更新按钮状态
        if (!notReadItem) {
            changeNotReadCount();
        }
        update();
    }

    async function readAll() {
        const notReadPks = data
            .filter((item) => item.isread && item.isread !== "Y")
            .map((item) => item.pk_message);
        await changeMessageStatus({ data: notReadPks });
        toast({
            content: langCheck("reportMultiLang", "100301-000286"),
            color: "success",
        }); // /* 国际化处理： 报表格式设计发生变化，对应的数据视图已失效*/
        changeStatus();
    }

    if (type === "status") {
        const firstData = data.filter((item) => item.taskName);
        const secondData = data.filter((item) => !item.taskName);
        dom = createTabDOM({
            activeKey,
            setActiveKey,
            tabList: [
                {
                    tab: langCheck("reportMultiLang", "100301-000282"),
                    key: "timing",
                    dom: createShareStatusDOM({ data: secondData }),
                },
                {
                    tab: langCheck("reportMultiLang", "100301-000281"),
                    key: "current",
                    dom: createShareStatusDOM({ data: firstData }),
                },
            ],
        });
    } else if (["historyInfo", "history"].includes(type)) {
        const currentData = data.filter((item) => item.isread);
        const timingData = data.filter((item) => !item.isread);
        dom = (
            <div className="history-info-container">
                {activeKey === "current" ? (
                    <NCButton className="read" onClick={readAll}>
                        {langCheck("reportMultiLang", "100301-000278")}
                    </NCButton>
                ) : null}
                {createTabDOM({
                    activeKey,
                    setActiveKey,
                    tabList: [
                        {
                            tab: langCheck("reportMultiLang", "100301-000107"),
                            key: "current",
                            dom: CreateHistoryOrIsreadDOM({
                                data: currentData,
                                onItemClick,
                                isReviewHistory,
                                activeItem,
                            }),
                        },
                        {
                            tab: langCheck("reportMultiLang", "100301-000100"),
                            key: "timing",
                            dom: CreateHistoryOrIsreadDOM({
                                data: timingData,
                                onItemClick,
                                isReviewHistory,
                                activeItem,
                            }),
                        },
                    ],
                })}
            </div>
        );
    }
    return dom;
}

function createTabDOM({ activeKey, setActiveKey, tabList = [] }) {
    return (
        <NCTabs
            activeKey={activeKey}
            tabBarStyle="simple"
            destroyInactiveTabPane={true}
            onChange={(key) => setActiveKey(key)}
            className="report-tabs-container"
        >
            {tabList.map((item) => {
                const { tab, key, dom } = item;
                return (
                    <NCTabPane tab={tab} key={key}>
                        {dom}
                    </NCTabPane>
                );
            })}
        </NCTabs>
    );
}

function createShareStatusDOM({ data }) {
    return (
        <ul className="share-slider-box nc-theme-common-font-c">
            {data.map((item, index) => {
                return createShareStatusItem(item, index);
            })}
        </ul>
    );
}

function createShareStatusItem(item, index) {
    const [showID, setShowID] = useState("");

    function onClick(item) {
        if (item.taskName && item.taskToResultsVos.length) {
            if (showID === item.taskName) {
                setShowID("");
            } else {
                setShowID(item.taskName);
            }
        }
    }

    const {
        status,
        subject,
        createTime,
        ts,
        taskName,
        taskToResultsVos = [],
        senderName,
    } = item;
    const { display, className } = getExecuteStasus(status);

    const classN = taskToResultsVos.length ? "parent" : "";

    return (
        <li
            className={`status nc-theme-xrow-bgc ${classN}`}
            key={createTime || ts}
        >
            <div className={classN} onClick={() => onClick(item)}>
                <p className="status-p">
                    <span>{index + 1}：</span>
                    <span>{subject || taskName}</span>
                </p>
                {senderName ? (
                    <p className="status-p">
                        {langCheck("reportMultiLang", "100301-000283")}
                        {senderName}
                    </p>
                ) : null}
                <p className="status-p">
                    {taskToResultsVos.length
                        ? langCheck("reportMultiLang", "100301-000284")
                        : null}
                    <span className={className}>{display}</span>
                </p>
                {createTime || ts ? (
                    <p className="status-p">
                        {formatDatetime(
                            serverTimeToLocal(moment(createTime || ts))
                        )}
                    </p>
                ) : null}
            </div>
            {taskToResultsVos.length ? (
                <NCCollapse.Panel
                    collapsible
                    expanded={item.taskName === showID}
                >
                    {createShareStatusDOM({ data: taskToResultsVos })}
                </NCCollapse.Panel>
            ) : null}
            {taskToResultsVos.length ? (
                <span
                    className={`icon iconfont ${
                        item.taskName === showID
                            ? "icon-hangcaozuoxiala1"
                            : "icon-hangcaozuoxiangshang1"
                    }`}
                    onClick={() => onClick(item)}
                />
            ) : null}
        </li>
    );
}

function CreateHistoryOrIsreadDOM({
    data = [],
    isReviewHistory = false,
    activeItem = {},
    onItemClick,
}) {
    if (!data.length) {
        return (
            <EmptyComponent
                message={langCheck("reportMultiLang", "100301-000287")}
            />
        );
    }
    return (
        <ul className="share-slider-box nc-theme-common-font-c">
            {data.map((item) => {
                const { title, ts, subkect, isread, sendername } = item;

                let readClass = "";
                if (isread) {
                    readClass = isread === "Y" ? "is-read" : "not-read";
                }

                return (
                    <li
                        key={ts}
                        className={`history nc-theme-xrow-bgc ${
                            isReviewHistory === true && activeItem.ts === ts
                                ? "active"
                                : ""
                        }`}
                        onDoubleClick={() => onItemClick(item, "download")}
                    >
                        <NCTooltip overlay={title || subkect} placement="top">
                            <p className="title">{title || subkect}</p>
                        </NCTooltip>
                        <span className="ts">
                            {ts
                                ? formatDatetime(serverTimeToLocal(moment(ts)))
                                : null}
                        </span>
                        <br />
                        {sendername && (
                            <span className="ts">
                                {langCheck("reportMultiLang", "100301-000279")}
                                {sendername}
                            </span>
                        )}
                        {isread ? (
                            <i className={`read-icon ${readClass}`}>
                                {isread === "Y"
                                    ? langCheck(
                                          "reportMultiLang",
                                          "100301-001120"
                                      )
                                    : langCheck(
                                          "reportMultiLang",
                                          "100301-001121"
                                      )}
                            </i>
                        ) : null}
                        {isread ? (
                            <NCTooltip
                                placement="topRight"
                                overlay={langCheck(
                                    "reportMultiLang",
                                    "100301-000285"
                                )}
                            >
                                <span
                                    className="icon iconfont icon-xiazai1"
                                    onClick={() =>
                                        onItemClick(item, "download")
                                    }
                                />
                            </NCTooltip>
                        ) : (
                            <NCTooltip
                                placement="topRight"
                                overlay={langCheck(
                                    "reportMultiLang",
                                    "100301-000123"
                                )}
                            >
                                <span
                                    className="icon iconfont icon-chakan1"
                                    onClick={() => onItemClick(item)}
                                />
                            </NCTooltip>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export function createHistoryInfoDOM() {
    const { notReadCount = 0 } = this.state;
    const flag = +notReadCount > 0;
    let display = +notReadCount > 9 ? "..." : notReadCount;

    return (
        <div className="btn-box">
            <ToolContainer
                overlay={langCheck("reportMultiLang", "100301-000122")}
                content={
                    <NCButton
                        shape="icon"
                        onClick={() => {
                            this.handleClick("historyInfo");
                        }}
                    >
                        <i
                            style={{ fontSize: "16px" }}
                            className={`${
                                flag ? "not-read" : ""
                            } icon iconfont icon-fenxianglishi`}
                        />
                        {flag ? (
                            <span className="not-read-count">{display}</span>
                        ) : null}
                    </NCButton>
                }
            />
        </div>
    );
}

export function createFullScreenDOM() {
    const { isFullScreen } = this.state;
    return (
        <div className="btn-box">
            <ToolContainer
                overlay={
                    isFullScreen
                        ? langCheck("reportMultiLang", "100301-000255")
                        : langCheck("reportMultiLang", "100301-000256")
                }
                content={
                    <NCButton
                        colors="secondary"
                        shape="icon"
                        onClick={this.handleClick.bind(this, "maxBox")}
                    >
                        <i
                            style={{ fontSize: "15px" }}
                            className={`iconfont ${
                                isFullScreen
                                    ? "icon-zuixiaohua"
                                    : "icon-zuidahua"
                            }`}
                        />
                    </NCButton>
                }
            />
        </div>
    );
}
