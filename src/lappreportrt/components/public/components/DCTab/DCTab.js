import React, { useState, useEffect, useMemo, useRef } from "react";
import "./index.less";
import { List } from "./List";
import PopContainer from "../PopContainer";

import { base } from "nc-lightapp-front";

const { NCTooltip } = base;
const ICONWIDTH = 26; //tool-item的宽度
const STEP = 200;
const crypto_sonar = window.crypto || window.msCrypto;
const array_sonar = new Uint32Array(1);

const ToolCom = ({
    clickId,
    reRenderFlag,
    visibleIndex,
    tab,
    defaultTool,
    toolOnClick,
    id,
    scrollCallback,
    hbTab,
}) => {
    const scroll = useRef();
    const lastTabCount = useRef();
    const maxRight = useRef();
    const currentEvent = useRef();
    const tabCount = tab.length;
    if (lastTabCount.current == undefined) {
        lastTabCount.current = tabCount;
    }
    if (scroll.current == undefined) {
        scroll.current = 0;
    }
    if (currentEvent.current == undefined) {
        currentEvent.current = {};
    }

    const _defaultTool = [
        {
            icon: "icon-shangyiye",
            label: "向前",
            key: "left",
            visible: false,
            disable: false,
        },
        {
            icon: "icon-xiayiye",
            label: "向后",
            key: "right",
            visible: false,
            disable: false,
        },
        {
            icon: "icon-quanbuyingyong",
            label: "全部",
            key: "allList",
            visible: false,
            disable: false,
        },
    ];

    const [_tool, change_tool] = useState(_defaultTool.concat(defaultTool));
    const [showAllList, changeShowAllList] = useState(false);
    const InitTipsVisible = {};
    _tool.forEach((item) => (InitTipsVisible[item.key] = false));
    const [toolTipsVisiable, changeToolTipsVisiable] =
        useState(InitTipsVisible);
    const tabData = tab.map((item, index) => ({
        index: index,
        key: item.Key,
        label: item.label,
    }));
    const _toolClick = (e, item) => {
        if (item.disable == false) {
            if (item.key == "right") {
                if (scroll.current - STEP < maxRight.current) {
                    scroll.current = maxRight.current;
                } else {
                    scroll.current = scroll.current - STEP;
                }
                change_tool(
                    _tool.map((item) => {
                        if (item.key == "right") {
                            if (scroll.current == maxRight.current)
                                item.disable = true;
                            else item.disable = false;
                        } else if (item.key == "left") {
                            item.disable = false;
                        }
                        return item;
                    })
                );

                scrollCallback(scroll.current);
            }
            if (item.key == "left") {
                if (scroll.current < -STEP) {
                    scroll.current = scroll.current + STEP;
                } else {
                    scroll.current = 0;
                }
                change_tool(
                    _tool.map((item) => {
                        if (item.key == "left") {
                            if (scroll.current == 0) item.disable = true;
                            else item.disable = false;
                        } else if (item.key == "right") {
                            item.disable = false;
                        }
                        return item;
                    })
                );
                scrollCallback(scroll.current);
            }
            if (item.key == "allList") {
                const { clientX, clientY } = e;
                currentEvent.current = { clientX, clientY };
                changeShowAllList(true);
            }

            if (toolOnClick) {
                const tool = toolOnClick(e, item) || item;
                change_tool(
                    _tool.map((val) => (val.key == tool.key ? tool : val))
                );
            }
        }
    };
    useEffect(() => {
        change_tool(
            _tool.map((item) => {
                const value = defaultTool.find((val) => item.key == val.key);
                return value || item;
            })
        );
    }, defaultTool);
    useEffect(() => {
        if (visibleIndex != clickId) {
            setTimeout(() => {
                const dctabDom = document.getElementById(id); //tab外层容器
                const tabDoms = dctabDom
                    ? dctabDom.children[0].children[0].children
                    : 0; //tab的dom对象
                const toolDomsWidth = dctabDom
                    ? dctabDom.children[1].offsetWidth
                    : 0; //工具栏的宽度
                const parentWidth = dctabDom ? dctabDom.offsetWidth : 0; //外层容器的宽度
                let tabDomSWidthSum = 0; //tab页签的宽度之和
                for (var i = 0; i <= visibleIndex; i++) {
                    if (tabDoms[i]) {
                        tabDomSWidthSum += tabDoms[i].offsetWidth;
                    }
                }
                //根据宽度之和判断是否显示工具栏的一些按钮
                const tar = parentWidth - tabDomSWidthSum - toolDomsWidth;
                if (tar < 0) {
                    change_tool(
                        _tool.map((item) => {
                            if (item.key == "left") {
                                item.disable = false;
                            }
                            return item;
                        })
                    );
                    scroll.current = tar;
                } else {
                    scroll.current = 0;
                }
                scrollCallback(scroll.current);
            });
        }
    }, [visibleIndex, reRenderFlag]);
    useEffect(() => {
        setTimeout(() => {
            const dctabDom = document.getElementById(id);
            const tabDoms = dctabDom
                ? dctabDom.children[0].children[0].children
                : 0;
            const toolDomsWidth = dctabDom
                ? dctabDom.children[1].offsetWidth + 20
                : 0;
            let tabDomSWidthSum = 0;
            for (var i = 0; i < tabDoms.length; i++) {
                tabDomSWidthSum += tabDoms[i].offsetWidth;
            }
            const parentWidth = dctabDom ? dctabDom.offsetWidth : 0;
            maxRight.current = parentWidth - tabDomSWidthSum - toolDomsWidth;
            //判断左右按钮的可见性
            if (maxRight.current < 0) {
                //如果是新增页签，则默认自动定位到
                const _visbile = _tool.find(
                    (item) => item.key == "right"
                ).visible;
                if (!_visbile) {
                    maxRight.current = maxRight.current - ICONWIDTH * 3;
                }
                if (lastTabCount.current + 1 == tabCount) {
                    scroll.current = maxRight.current;

                    scrollCallback(scroll.current);
                }
                change_tool(
                    _tool.map((item) => {
                        if (
                            item.key == "right" ||
                            item.key == "left" ||
                            item.key == "allList"
                        ) {
                            item.visible = true;
                            item.disable = false;
                        }
                        if (
                            item.key == "right" &&
                            scroll.current == maxRight.current
                        ) {
                            item.disable = true;
                        }
                        if (item.key == "left" && scroll.current == 0) {
                            item.disable = true;
                        }
                        return item;
                    })
                );
            } else {
                change_tool(
                    _tool.map((item) => {
                        if (
                            item.key == "right" ||
                            item.key == "left" ||
                            item.key == "allList"
                        ) {
                            item.visible = false;
                        }
                        return item;
                    })
                );
                scroll.current = 0;
                scrollCallback(scroll.current);
            }

            lastTabCount.current = tabCount;
        });
    }, [tab]);

    const onAllListClick = (item) => {
        if (toolOnClick) {
            toolOnClick(
                {},
                {
                    icon: "icon-canzhao",
                    label: "全部",
                    key: "allList",
                    visible: false,
                    disable: false,
                },
                item
            );
        }
        let tabIndex = 0;
        tab.forEach((value, index) => {
            if (value.Key === item.key) {
                tabIndex = index;
            }
        });
        changeShowAllList(false);
    };

    return (
        <div className="top-tab-tool nc-theme-area-bgc">
            {_tool
                .filter((item) => item.visible)
                .map((item) => {
                    const { label, icon, style = {}, disable } = item;
                    return (
                        <NCTooltip
                            fieldid={item.key}
                            visible={toolTipsVisiable[item.key]}
                            placement="top"
                            overlay={label}
                        >
                            <div
                                onMouseLeave={() => {
                                    toolTipsVisiable[item.key] = false;
                                    changeToolTipsVisiable({
                                        ...toolTipsVisiable,
                                    });
                                }}
                                onMouseEnter={() => {
                                    toolTipsVisiable[item.key] = true;
                                    changeToolTipsVisiable({
                                        ...toolTipsVisiable,
                                    });
                                }}
                                className={`tool-item nc-theme-common-font-c nc-theme-area-bgc ${
                                    disable ? "disable" : ""
                                }`}
                            >
                                <span
                                    style={style}
                                    className={`icon iconfont  ${
                                        icon || "icon-bangzhutishi"
                                    }`}
                                    onClick={(e) => _toolClick(e, item)}
                                ></span>
                            </div>
                        </NCTooltip>
                    );
                })}
            {showAllList ? (
                <PopContainer
                    event={currentEvent.current}
                    onClose={() => changeShowAllList(false)}
                    hbTab={hbTab}
                >
                    <List data={tabData} onClick={onAllListClick}></List>
                </PopContainer>
            ) : null}
        </div>
    );
};

const DCTab = ({
    reRenderFlag = "",
    contextMenu = "",
    defaultTool = [],
    toolOnClick = () => {},
    defaultActive,
    tabOnClick = () => {},
    tab,
    onClose,
    showTool,
    visibleIndex = 0,
    hbTab = false,
}) => {
    const [_tab, _tabOnchage] = useState(tab);
    const [_scroll, change_scroll] = useState(0);
    const contentId = useMemo(
        () =>
            "dc-tab" +
            parseInt(
                (crypto_sonar.getRandomValues(array_sonar)[0] / 10000000000) *
                    100000
            ),
        ""
    );
    const [clickId, changeClickId] = useState(-1); //用于记录单击标签时产生的顺序号，用于区分外部方法跳转页签的情况

    useEffect(() => {
        _tabOnchage(tab);
    }, [tab]);
    //标签数据
    const tabCom = _tab.map((item, index, array) => {
        const { Key, label, closable, style, icon = [] } = item;
        const closeEvent = (e) => {
            e.stopPropagation();
            if (Key == defaultActive) {
                var activeKey = "";
                if (array.length != 1) {
                    if (index === array.length - 1) {
                        activeKey = array[index - 1].Key;
                    } else {
                        activeKey = array[index + 1].Key;
                    }
                    //如果注册了onClose方法，则有外部组件执行关闭切换逻辑
                    if (typeof onClose != "function") {
                        tabOnClick(activeKey, Key);
                    }
                }
            }
            _tabOnchage(_tab.filter((k) => k.Key != Key));
            typeof onClose === "function" &&
                onClose(Key, activeKey || defaultActive);
        };

        const closeCom = (
            <i className="close-icon" onMouseDown={(e) => closeEvent(e)}></i>
        );

        const customCom = icon.map((val) => {
            return (
                <span>
                    <i className={`icon iconfont ${val} custom-icon`}></i>
                </span>
            );
        });
        const onclick = () => {
            if (Key != defaultActive) {
                changeClickId(index);
                tabOnClick(Key, defaultActive);
                //activeOnchage(Key);
            }
        };
        const dom = (
            <div
                className={`dc-tab-pane nc-theme-common-font-c ${
                    defaultActive == Key ? "active" : ""
                }`}
                onMouseDown={onclick}
            >
                <div className="transform-contant nc-theme-common-font-c nc-theme-area-split-bc" style={style}>
                    <span className="label">{label}</span>
                    {customCom}
                    {closable ? closeCom : null}
                </div>

                <div className="transform-right nc-theme-area-split-bc"></div>
            </div>
        );
        return item.tips ? (
            <NCTooltip
                delayShow={800}
                fieldid={item.tips}
                placement="bottom"
                overlay={item.tips}
                trigger="hover"
            >
                {dom}
            </NCTooltip>
        ) : (
            dom
        );
    });
    const scrollCallback = (scroll) => {
        change_scroll(scroll);
    };

    return (
        <div className="dc-tab" id={contentId}>
            <div className="dv-tab-nav-scroll">
                <div
                    className="visibel-container"
                    style={{ transform: `translate3d(${_scroll}px, 0px, 0px)` }}
                >
                    {tabCom}
                </div>
            </div>
            {showTool ? (
                <ToolCom
                    clickId={clickId}
                    reRenderFlag={reRenderFlag}
                    visibleIndex={visibleIndex}
                    defaultTool={defaultTool}
                    scrollCallback={scrollCallback}
                    tab={_tab}
                    toolOnClick={toolOnClick}
                    id={contentId}
                    hbTab={hbTab}
                />
            ) : null}
        </div>
    );
};
export default DCTab;
