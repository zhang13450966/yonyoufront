import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import TimerInput from "@public/TimerInput";
import { TREE_ID } from "../constants";
import Utils from "@public/utils";
import DraggleLayout from "./DraggleLayout";
import "../index.less";

const { langCheck } = Utils;

function TreeArea(props) {
    let { createAsyncTree, isResizing, setResizeModalFlag, currentE } = props;

    const contentRef = useRef();
    const leftDomRef = useRef();
    const rightDomRef = useRef();
    const [init, setInit] = useState(false);
    const [specialStyle, setSpecialStyle] = useState({});

    const [curSelectIndex, setCurSelectIndex] = useState(0);
    const renderAreaFlag =
        Array.isArray(props.curViewData.areacontentsets) &&
        props.curViewData.areacontentsets.length;

    useEffect(() => {
        setInit(true);
    }, []);

    useEffect(() => {
        if (isResizing) {
            setSpecialStyle({
                height: `${
                    contentRef.current.offsetHeight -
                    leftDomRef.current.offsetHeight -
                    17
                }px`,
            });
        } else {
            setSpecialStyle({});
        }
    }, [currentE]);

    const draggleLayoutProps = {
        contentDom: contentRef.current,
        leftDom: leftDomRef.current,
        rightDom: rightDomRef.current,
        extraLength: 17,
        setResizeModalFlag,
    };

    return (
        <div className="tree-area" ref={contentRef}>
            {/* 扩展区 */}

            <div className="expand-area-container" ref={leftDomRef}>
                <div className="expand-area-title nc-theme-common-font-c">
                    {langCheck("reportMultiLang", "100301-000169")}
                </div>
                {renderAreaFlag &&
                    props.curViewData.areacontentsets.map((item, index) => {
                        return (
                            <div
                                className={classnames("expand-area-item nc-theme-menu-item", { "nc-theme-otab-area-bgc": curSelectIndex === index })}
                                onClick={() => {
                                    props.selectExpandArea(item, index);
                                    setCurSelectIndex(index);
                                }}
                            >
                                {item.areaName}
                            </div>
                        );
                    })}
            </div>

            {/* 父组件加载完再加载子组件 从而通过ref拿到父组件的dom节点 */}
            {init && <DraggleLayout {...draggleLayoutProps} />}

            <div
                ref={rightDomRef}
                className="area-expand-right-dom nc-theme-common-font-c"
                style={specialStyle}
            >
                <div className="tree-desc">
                    {langCheck("reportMultiLang", "100301-000160")}
                </div>
                {/* <div className="tree-filter">
          <TimerInput onSearch={(val) => props.onSearch(val)} />
        </div> */}
                <div
                    className="tip nc-theme-disabled-font-c"
                    title={langCheck("reportMultiLang", "100301-000161")}
                >
                    {langCheck("reportMultiLang", "100301-000161")}
                </div>
                <div className="tree-container">
                    {createAsyncTree({
                        treeId: TREE_ID,
                        loadTreeData: props.loadTreeData, //加载子节点数据
                        draggable: true,
                        needSearch: true,
                        showModal: false,
                        needDrop:false,
                        onDragStartEve: props.onDragStartEve,
                        searchChangeEve: props.searchChangeEve,
                        clearSearchVal: props.clearSearchVal,
                        needEdit: false,
                    })}
                </div>
            </div>
        </div>
    );
}
export default TreeArea;
