import React, { PureComponent } from "react";
import Handsontable from "@public/office";
import { blockFun } from "./block";
import { ajax, toast, getMultiLang } from "nc-lightapp-front";
import Utils from "@public/utils";
import createContextMenu from "../ReportTable/components/ContextMenu";
const { langCheck, checkStrLen } = Utils;
import defaultSettings from "@common/defaultSettings";
require("./index.less");

class SimpleTable extends PureComponent {
    constructor(props) {
        super(props);
        const _this = this;
        this.state = {
            findSelectCells: {}, //查找定位单元格数据
            area: [], //表格数据拥有的范围
            result: null, //表格数据
            originalData: null,
            index: "", //选中行索引
            gridContext: [], //右键数据
            settings: {
                ...defaultSettings,
                cells: function (row, col, prop) {
                    this.renderer = myRender.bind(_this);
                },
                ...this.props.settings,
            },
        };
    }

    componentWillMount() {
        let callback = (json) => {
            window.tableMultiLang = json;
            const menus = this.getContext();
            this.setState({ gridContext: menus });
        };
        getMultiLang({
            moduleId: 100302,
            currentLocale: "zh-CN",
            domainName: "lappreportrt",
            callback,
        });
    }

    componentDidMount() {
        const { gridInstance } = this.props;
        const $grid = document.getElementById("handsontable");
        if ($grid) {
            $grid.oncontextmenu = function () {
                return false;
            };
        }

        if (gridInstance) {
            gridInstance(this.getInstance(), this.updateSettings);
        }
    }

    scrollToTop = () => {
        const { fixedRowsTop } = this.state.settings;
        if (fixedRowsTop && +fixedRowsTop > 0) {
            this.getInstance().scrollViewportTo(fixedRowsTop, 0);
        } else {
            this.getInstance().scrollViewportTo(0, 0);
        }
    };

    //获取右键数据
    getContext = () => {
        const find = {
            label: langCheck("tableMultiLang", "100302-000006"),
            code: "find",
            onSelect: this.onContextSelect,
        };
        const propContext = this.props.gridContext || [];
        return [...propContext, find];
    };

    onContextSelect = () => {
        this.refs.hansontable.onContextMenuClick(
            "find",
            undefined,
            this.tdSelected
        );
    };

    componentWillReceiveProps(props) {
        const { data } = props;
        const { originalData } = this.state;

        let result = data && data.data;
        let index = 0;
        if (result && result.checkTableHeadNum) {
            index = result.checkTableHeadNum;
        }
        if (result && result.cells) {
            let freezing = result.freezing;
            let fixedRowsTop = 0,
                fixedColumnsLeft = 0;
            if (freezing && freezing.isFreeze) {
                fixedRowsTop = freezing.row < 0 ? 0 : freezing.row;
                fixedColumnsLeft = freezing.col < 0 ? 0 : freezing.col;
            }
            const ret = initDefaultData(result.cells);
            const { mergeCells, hideTextWhenFreeze } = getMergeCells(
                result.mergeInfo,
                fixedColumnsLeft,
                fixedRowsTop
            );
            this.setState({
                result,
                originalData: ret.cellsData,
                pk_report: result.pk_report || "",
                hideTextWhenFreeze,
                settings: {
                    ...this.state.settings,
                    data: ret.cellsText,
                    colWidths: coverseWidth(
                        result.widths,
                        result.cells && result.cells[index]
                    ),
                    rowHeights: coverseHeight(result.heights, result.cells),
                    mergeCells,
                    fixedRowsTop,
                    fixedColumnsLeft,
                },
            });
        } else {
            if (originalData) {
                this.setState({
                    result: null,
                    originalData: null,
                    settings: {
                        ...this.state.settings,
                        data: [[]],
                        mergeCells: [],
                    },
                });
            }
        }
    }

    afterSelection(obj, r, c, r2, c2) {
        // this.setState({
        // 	index: r
        // });
    }
    // 业务组调用获取行列
    getReportInfo() {
        const { result } = this.state;
        let reportInfo = this.refs.hansontable.getHotMethods().returnData();
        reportInfo.coords = this.coords;
        if (
            result.widths &&
            result.widths.length > 0 &&
            result.widths[0].colname &&
            reportInfo.colWidths.length > 0
        ) {
            let widthArray = [];
            reportInfo.colWidths.forEach((item, index) => {
                if (reportInfo.colWidths[index].colwidth) {
                    widthArray.push(
                        reportInfo.colWidths[index].colwidth.toString()
                    );
                } else if (reportInfo.colWidths[index] == undefined) {
                    widthArray.push("120");
                } else {
                    widthArray.push(item);
                }
            });

            widthArray.forEach((item, index) => {
                reportInfo.colWidths[index] = {
                    colname:
                        (result.widths[index] &&
                            result.widths[index].colname) ||
                        result.widths[index],
                    colwidth: widthArray[index].toString(),
                };
            });
        }
        return reportInfo;
    }

    getRowRecord() {
        const { index, originalData = [] } = this.state;
        return originalData[index];
    }

    autoWidths = () => {
        const { originalData = [], result } = this.state;
        const { widths } = result;

        let len = 17;
        originalData.forEach((row) => {
            row.forEach((item, index) => {
                if (item && item.style === "body" && item.title) {
                    if (widths[index] && +widths[index].colwidth > 1) {
                        let strLen = 0;
                        let text = item.title.replace(/&nbsp;/gi, "");
                        if (text.indexOf("\n") < 0) {
                            strLen = checkStrLen(text) * len;
                        } else {
                            const first = text.split("\n")[0];
                            strLen = checkStrLen(first) * len;
                        }
                        let w = parseInt(strLen);
                        if (w > 80) widths[index].colwidth = w + "";
                    }
                }
            });
        });
        this.refreshWidth(widths);
    };

    refreshWidth = (width) => {
        const colWidths = width.map((item) => item.colwidth);
        const { onAfterAutoWidth } = this.props;
        this.getInstance().updateSettings({
            manualColumnResize: false,
            colWidths,
        });
        this.getInstance().updateSettings({ manualColumnResize: true });
        this.setState({ settings: { ...this.state.settings, colWidths } });
        onAfterAutoWidth && onAfterAutoWidth(width);
    };

    resetWidths = () => {
        const { result } = this.state;
        const width = this.getReportInfo().colWidths;
        let index = 0;
        if (result && result.checkTableHeadNum) {
            index = result.checkTableHeadNum;
        }
        this.setState(
            {
                settings: {
                    ...this.state.settings,
                    colWidths: coverseWidth(
                        width,
                        result.cells && result.cells[index]
                    ),
                },
            },
            () => this.updateSettings()
        );
    };

    resizeWidths = () => {
        const { pk_report } = this.state;
        const width = this.getReportInfo().colWidths;
        let data = {
            pk_report,
            isBusinessSet: "true",
            width,
        };
        ajax({
            url: "/nccloud/report/widget/lightreport_savewidth.do",
            data,
            success: (res) => {
                this.resetWidths();
                toast({
                    content: langCheck("tableMultiLang", "100302-000002"),
                    color: "success",
                }); /* 国际化处理： 保存成功*/
            },
            error: (err) => {
                this.resetWidths();
            },
        });
    };

    /***
     * way: 冻结还是取消冻结
     * type: 冻结的方式
     * obj: Handsontable的ref引用
     */
    freezeFun(way, type) {
        if (way === "block") {
            blockFun.call(this, type);
        } else {
            const { mergeCells, hideTextWhenFreeze } = getMergeCells(
                this.state.result.mergeInfo,
                0,
                0
            );
            this.setState(
                {
                    hideTextWhenFreeze,
                    settings: {
                        ...this.state.settings,
                        fixedRowsTop: 0,
                        fixedColumnsLeft: 0,
                        mergeCells,
                    },
                },
                () => this.updateSettings()
            );
        }
    }

    afterOnCellMouseDown = (e, coords, td) => {
        const { onCellMouseDown, onDrill } = this.props;
        let tdSelected = this.refs.hansontable.getHotInstance().getSelected();
        this.coords = coords;
        this.tdSelected = tdSelected;
        this.state.index = coords.row;

        if (onCellMouseDown) {
            onCellMouseDown(e, coords, td);
        }

        //单元格内点击文字进行联查
        let data_drillcode = e.target.getAttribute("data_drillcode");
        if (data_drillcode && data_drillcode != null) {
            onDrill(coords, data_drillcode);
        }
    };

    updateSettings = () => {
        this.refs.hansontable
            .getHotInstance()
            .updateSettings(this.state.settings);
    };

    getInstance = () => {
        return this.refs.hansontable.getHotInstance();
    };

    onFindSelectCells = (findSelectCells = {}) => {
        this.setState({
            findSelectCells,
        });
    };

    render() {
        const { settings, gridContext, findSelectCells } = this.state;

        createContextMenu({
            contentId: "simpleTableReport",
            menus: gridContext,
            visible: true,
        });

        const classNames =
            "pixel-ratio-" + Math.round(window.devicePixelRatio * 100);

        return (
            <div
                className={`simple-table hot-table nc-theme-area-split-bc ${classNames}`}
                fieldid="report-area"
                style={{ width: "100%", height: "100%", minHeight: 100 }}
                id="simpleTableReport"
            >
                <Handsontable
                    ref="hansontable"
                    afterOnCellMouseDown={this.afterOnCellMouseDown}
                    afterSelection={this.afterSelection.bind(this)}
                    settings={settings}
                    onFindSelectCells={this.onFindSelectCells}
                    findSelectCells={findSelectCells}
                    someEvents={{ ...this.props.someEvents }}
                    isOnlyTable={true}
                />
            </div>
        );
    }
}

function myRender(nstance, td, row, col, prop, defaultValue, cellProperties) {
    const { originalData, findSelectCells } = this.state;
    let textvalue,
        value = originalData && originalData[row] && originalData[row][col];
    if (!value || !value.title || typeof value.title == "undefined") {
        textvalue = "";
    } else {
        textvalue = value.title + ""; //转成字符串
    }

    if (textvalue.indexOf(">") > -1 && textvalue.indexOf("<") > -1) {
        textvalue = textvalue.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
    }

    if (value && value.drill) {
        td.classList.add("drill-active");
        textvalue = `<span data_drillcode=${value.drill}>${textvalue}</span>`;
    }

    td.innerHTML = textvalue;
    td.title = textvalue.replace(/&nbsp;/gi, " ");
    td.style.overflow = "hidden";
    td.style.whiteSpace = "nowrap";
    td.style.textOverflow = "ellipsis";
    td.style.borderWidth = 1 / window.devicePixelRatio + "px";

    if (value) {
        td.style.fontSize = "12px";
        if (value.align) {
            td.style.textAlign = value.align;
            td.style.verticalAlign = "middle";
        }
        if (value.style == "head") {
            td.style.backgroundColor = "rgb(216, 230, 244)";
            td.style.color = "rgb(21, 66, 139)";
        } else if (value.style == "title") {
            td.style.backgroundColor = "rgb(255, 255, 255)";
            td.style.color = "rgb(21, 66, 139)";
            td.style.fontSize = "20px";
            td.style.height = "36px";
        } else if (value.style == "sum") {
            td.style.backgroundColor = "rgb(255, 248, 178)";
            td.style.color = "rgb(0, 0, 0)";
        } else if (value.style == "glRowColor") {
            td.style.backgroundColor = value.bgColor
                ? `${value.bgColor}`
                : "rgb(255, 255, 255)";
            td.style.color = value.color ? `${value.color}` : "rgb(0, 0, 0)";
        } else {
            td.style.backgroungColor = "rgb(255, 255, 255)";
            td.style.color = "rgb(0, 0, 0)";
        }
    }
    //渲染查找定位的单元格样式
    if (findSelectCells[`${row}_${col}`]) {
        td.style["background-color"] = "#fdf1bf";
    }
}

function coverseWidth(widths, data = []) {
    let titleWidth = [];
    data.forEach((item, index) => {
        if (item === null) {
            data.splice(index, 1);
        }
    });
    if (widths && widths.length > 0 && widths[0].colname) {
        data.forEach((item, index) => {
            widths.forEach((ele) => {
                if (item.key == ele.colname) {
                    titleWidth[index] = ele.colwidth;
                } else if (!item.key) {
                    titleWidth[index] = "120";
                }
            });
        });
    } else if (!widths || widths.length < 2) {
        for (let i = 0; i < data.length + 1; i++) {
            titleWidth[i] = "120";
        }
    } else if (
        (widths && widths.length > 0 && typeof widths[0] == "string") ||
        typeof widths[0] == "number"
    ) {
        return widths;
    }

    return titleWidth;
}

function coverseHeight(data, cells) {
    let titleHeight = [];
    if (!data || JSON.stringify(data) == "{}" || data.length < 1) {
        for (let i = 0; i < cells.length; i++) {
            titleHeight[i] = 23;
        }
        return titleHeight;
    } else {
        return data;
    }
}

function initDefaultData(data) {
    let cellsData = [],
        cellsText = [];

    data.forEach((row, index) => {
        cellsText[index] = [];
        cellsData[index] = [];
        row.forEach((cell, i) => {
            if (cell === null) cell = {};
            cellsText[index].push(cell.title);
            cell.m_row = index;
            cell.m_col = i;
            cellsData[index].push(cell);
        });
    });
    return { cellsData, cellsText };
}

export function getMergeCells(result, seperateCol, seperateRow) {
    //和并列数据提取

    let mergeCells = [],
        hideTextWhenFreeze = [];
    result &&
        result.forEach((items) => {
            const row = +items[0],
                col = +items[1],
                rowspan = items[2] - items[0] + 1,
                colspan = items[3] - items[1] + 1;
            let areaObj = {
                row,
                col,
                rowspan,
                colspan,
            };

            if (seperateCol > 0 && row === 0) {
                if (
                    +seperateCol >= col &&
                    +seperateCol <= +items[3] &&
                    col != seperateCol
                ) {
                    mergeCells.push({
                        row,
                        col,
                        rowspan,
                        colspan: seperateCol - col,
                    });
                    mergeCells.push({
                        row,
                        col: +seperateCol,
                        rowspan,
                        colspan: items[3] - seperateCol + 1,
                    });

                    hideTextWhenFreeze.push({
                        row,
                        col: +seperateCol,
                        endRow: +items[2],
                        endCol: +items[3],
                    });
                } else {
                    mergeCells.push(areaObj);
                }
            } else if (+seperateRow > 0 && rowspan > 1) {
                if (+seperateRow >= row && +seperateRow < row + rowspan) {
                    mergeCells.push({
                        row,
                        col,
                        rowspan: seperateRow - row,
                        colspan,
                    });
                    mergeCells.push({
                        row: seperateRow,
                        col,
                        rowspan: row + rowspan - seperateRow,
                        colspan,
                    });
                } else {
                    mergeCells.push(areaObj);
                }
            } else {
                mergeCells.push(areaObj);
            }
        });

    return { mergeCells, hideTextWhenFreeze };
}
export default SimpleTable;
