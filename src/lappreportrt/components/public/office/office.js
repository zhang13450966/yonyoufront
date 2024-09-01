import React, { Component } from "react";
import { HotTable } from "@handsontable/react";
require("handsontable/dist/handsontable.full.css");
require("./index.less");

const licenseKey = "22061-34b57-72013-74b09-0e213";

export default class Handsontable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coords: { row: null, col: null }, // 选中单元格坐标
            colWidths: [], //单元格宽度
            rowHeights: [], //单元格高度
        };
    }

    returnData() {
        //返回自身状态
        return this.state;
    }

    //返回自身单元格数量
    returnTotalNum() {
        let cols = this.refs.hot.hotInstance.countCols();
        let rows = this.refs.hot.hotInstance.countRows();
        return cols * rows;
    }

    //列resize
    afterColumnResize = (col, size) => {
        let colWidths = this.props.settings.colWidths;
        colWidths.splice(col, 1, size);
        this.setState({
            colWidths,
        });
    };

    //行resize
    afterRowResize = (row, size) => {
        let rowHeights = this.props.settings.rowHeights;
        rowHeights.splice(row, 1, size);
        this.setState({
            rowHeights,
        });
    };

    //处理复制数据
    beforeCopy = (data, coords) => {
        if (!this.props.isOnlyTable) {
            let copyData = "";
            data.forEach((array, index) => {
                let enter = index == data.length - 1 ? "" : "\n";
                array.forEach((item, idx) => {
                    let sym = idx == array.length - 1 ? "" : "\t";
                    if (
                        item &&
                        (item.title ||
                            item.title === null ||
                            item.key ||
                            item.style)
                    ) {
                        let text = item.title
                            ? item.title.replace(/&nbsp;/gi, " ")
                            : " ";
                        copyData += text + sym;
                    } else {
                        if (item && item[0] && item[0].length && item[0][0]) {
                            let str = Array.isArray(item)
                                ? item[0][0].trim() + sym
                                : item.trim() + sym;
                            copyData += str.replace(/&nbsp;/gi, " ");
                        } else {
                            copyData += " " + sym;
                        }
                    }
                });
                copyData += enter;
            });
            let reportTextarea =
                document.getElementsByClassName("hidden-textarea");
            if (reportTextarea[0]) {
                document.body.removeChild(reportTextarea[0]);
            }
            let textarea = document.createElement("textarea", { id: "aaa" });
            textarea.className = "hidden-textarea";
            document.body.appendChild(textarea);
            textarea.value = copyData;
            textarea.select();
            document.execCommand("Copy");
            return false;
        }
    };

    //浅比较数据
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.findSelectCells !== nextProps.findSelectCells ||
            this.props.settings.data !== nextProps.settings.data ||
            this.props.settings.colHeaders !== nextProps.settings.colHeaders ||
            this.props.settings.colWidths !== nextProps.settings.colWidths ||
            (nextProps.contextMenu &&
                this.props.contextMenu &&
                //按钮的disabled属性
                ((nextProps.contextMenu.items.asc &&
                    nextProps.contextMenu.items.asc.disabled !=
                        this.props.contextMenu.items.asc.disabled) ||
                    //取消冻结按钮hidden属性
                    (nextProps.contextMenu.items["freeze"] &&
                        nextProps.contextMenu.items[
                            "freeze"
                        ].submenu.items[3].hidden() !=
                            this.props.contextMenu.items[
                                "freeze"
                            ].submenu.items[3].hidden()) ||
                    (nextProps.contextMenu.items["search"] &&
                        this.props.contextMenu.items["search"] &&
                        nextProps.contextMenu.items["search"].submenu.items[0]
                            .disabled !=
                            this.props.contextMenu.items["search"].submenu
                                .items[0].disabled)))
        );
    }

    render() {
        const {
            settings,
            afterSelection,
            afterOnCellMouseDown,
            afterGetColHeader,
            afterDocumentKeyDown,
            contextMenu,
            ownContext,
            someEvents,
        } = this.props;
        return (
            <HotTable
                licenseKey={licenseKey}
                id="handsontable"
                ref="hot"
                root="hot"
                search="true"
                settings={settings}
                afterColumnResize={this.afterColumnResize}
                afterRowResize={this.afterRowResize}
                afterSelectionEnd={
                    afterSelection && afterSelection.bind(this, this.refs.hot)
                }
                afterOnCellMouseDown={afterOnCellMouseDown}
                afterGetColHeader={afterGetColHeader}
                beforeCopy={this.beforeCopy}
                afterDocumentKeyDown={afterDocumentKeyDown}
                contextMenu={contextMenu || ownContext}
                {...someEvents}
            />
        );
    }
}
