import React, { Component } from "react";
import Handsontable from "./office";
import { base } from "nc-lightapp-front";
import Utils from "@public/utils";
const { langCheck, getAllCoordsByRange, delcommafy } = Utils;
const { NCModal, NCFormControl, NCCheckbox, NCButton, NCHotKeys } = base;

//表格基础组件之高阶组件，适配两个表格组件的查找功能
function withHandsontable(Wrap) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.currentIndex = -1;
            this.state = {
                findVal: "", //模糊搜索字段
                upperChecked: false, //大小写
                areaChecked: true, //区域
                show: false, //是否显示查找弹窗
                selection: [], //区域数组
                coord: "", //区域字符串
                isNotFind: false, //是否查找到数据
            };
        }

        //key down 事件
        afterDocumentKeyDown = (e) => {
            if (e.realTarget.className.includes("ant-input")) {
                e.stopImmediatePropagation();
                return;
            }
            const { show } = this.state;
            let classes = e.target.parentElement.className;
            if (e.code === "Enter" && show) {
                e.stopImmediatePropagation();
                this.onFind("next");
            } else if (classes.includes("hanson-export"))
                e.stopImmediatePropagation();
        };

        //格式化坐标
        formatCells = (args) => {
            const { start, end } = args;
            const getHeader = (row, col) => {
                return (
                    this.getHotInstance().getColHeader(col) +
                    this.getHotInstance().getRowHeader(row)
                );
            };
            //单个单元格
            if (
                (end && start.row === end.row && start.col === end.col) ||
                end === undefined
            ) {
                return getHeader(start.row, start.col);
            } else {
                return (
                    getHeader(
                        Math.min(start.row, end.row),
                        Math.min(start.col, end.col)
                    ) +
                    ":" +
                    getHeader(
                        Math.max(start.row, end.row),
                        Math.max(start.col, end.col)
                    )
                );
            }
        };

        //右键事件
        onContextMenuClick = (key, selection, coord) => {
            if (this.props.isFromPreview) return;

            if (key === "find") {
                let coord = "";

                let selected = this.getHotInstance().getSelected();
                if (selected) {
                    const [row, col, endRow, endCol] = selected[0];
                    selected = selected.map(([r1, c1, r2, c2]) => ({
                        start: {
                            row: Math.min(r1, r2),
                            col: Math.min(c1, c2),
                        },
                        end: {
                            row: Math.max(r1, r2),
                            col: Math.max(c1, c2),
                        },
                    }));

                    if (
                        selected.length > 1 ||
                        row !== endRow ||
                        col !== endCol
                    ) {
                        coord = selected
                            .map((item) => this.formatCells(item))
                            .join(",");
                    }
                }

                this.setState({
                    show: true,
                    selection: selected || [],
                    coord,
                });
            }
        };

        //导出实例方法
        getHotInstance = () => {
            return this.refs.hotTable.refs.hot.hotInstance;
        };

        //导出实例
        getHotMethods = () => {
            return this.refs.hotTable;
        };

        //模糊搜索文字
        onFindValChange = (findVal) => {
            this.currentIndex = -1;
            this.setState({ findVal });
        };

        //多选框修改
        onCheckedChange = (key) => {
            this.setState({ [key]: !this.state[key] }, () =>
                this.onFind("next")
            );
        };

        //查找
        onFind = (way) => {
            const { upperChecked, findVal, areaChecked } = this.state;
            //没有输入，不执行查询
            if (!findVal) return;

            setTimeout(() => {
                //为何加定时器  NCC-124897  录入英文点击回车后，录入的内容会翻倍显示(l录入的内容需要在查询结果中有)
                if (!this.currentFindInfo) {
                    this.getData();
                }

                if (
                    upperChecked !== this.currentFindInfo.upperChecked ||
                    findVal !== this.currentFindInfo.key ||
                    areaChecked !== this.currentFindInfo.areaChecked
                ) {
                    //重新获取数据
                    this.getData();
                }

                const result = this.currentFindInfo.result,
                    len = result.length;

                if (!len) {
                    return this.setState({ isNotFind: true });
                }

                if (way === "next") {
                    this.currentIndex++;
                } else {
                    this.currentIndex--;
                }
                if (this.currentIndex == len) this.currentIndex = 0;
                if (this.currentIndex < 0) this.currentIndex = len - 1;

                const cur = result[this.currentIndex];
                if (!cur) return;
                const { row, col } = cur;

                //定位单元格
                this.getHotInstance().selectCells([[row, col, row, col]]);
                this.ScrollPos(row, col);
                this.setState({ isNotFind: false });
            }, 200);
        };

        //如果不在当前窗口，要滚动到对应位置
        ScrollPos = (row, col) => {
            const tdRect = document
                .querySelector("#handsontable td.highlight")
                .getBoundingClientRect();
            const tableRect = document
                .getElementById("handsontable")
                .getBoundingClientRect();
            const diff = tableRect.bottom - tdRect.top;
            if (diff < 24) {
                if (col * 100 > tableRect.width) {
                    document
                        .getElementsByClassName("wtHolder")[0]
                        .scrollTo(col * 100 - tableRect.width, row * 23);
                } else {
                    document
                        .getElementsByClassName("wtHolder")[0]
                        .scrollTo(0, row * 23);
                }
            }
        };

        //处理合并单元格，要按照一个计算
        getMergeMap = (cells) => {
            let map = {};
            cells.forEach(({ row, col, rowspan, colspan }) => {
                let endRow = row + rowspan - 1,
                    endCol = col + colspan - 1;
                getAllCoordsByRange({ row, col, endRow, endCol }, map);
            });
            return map;
        };

        //获取要查找的所有数据
        getData = () => {
            const { settings, isOnlyTable } = this.props;
            const { data, mergeCells } = settings;

            const mergeMap = this.getMergeMap(mergeCells);

            const { findVal, upperChecked, areaChecked, coord, selection } =
                this.state;
            let currentFindInfo = {
                result: [],
                key: findVal,
                upperChecked,
                areaChecked,
                coord,
                selection,
            };
            if (!isOnlyTable) {
                //处理通用报表组件
                data.forEach((array, row) => {
                    if (array) {
                        array.forEach((item, col) => {
                            if (item && item[0]) {
                                const currentMergeCell =
                                    mergeMap[`${row}_${col}`];
                                if (currentMergeCell) {
                                    if (
                                        mergeMap[
                                            `${currentMergeCell.row}_${currentMergeCell.col}`
                                        ].isLoop
                                    )
                                        return;
                                    mergeMap[
                                        `${currentMergeCell.row}_${currentMergeCell.col}`
                                    ].isLoop = true;
                                }
                                let copyItem = item[0][0];
                                if (typeof +findVal === "number") {
                                    copyItem = delcommafy(copyItem);
                                }
                                this.addFindData(copyItem, currentFindInfo, {
                                    row,
                                    col,
                                });
                            }
                        });
                    }
                });
            } else {
                //处理单独表格部分组件
                data.forEach((array, row) => {
                    if (array) {
                        array.forEach((item, col) => {
                            if (item) {
                                const currentMergeCell =
                                    mergeMap[`${row}_${col}`];
                                if (currentMergeCell) {
                                    if (
                                        mergeMap[
                                            `${currentMergeCell.row}_${currentMergeCell.col}`
                                        ].isLoop
                                    )
                                        return;
                                    mergeMap[
                                        `${currentMergeCell.row}_${currentMergeCell.col}`
                                    ].isLoop = true;
                                }
                                let copyItem = item + "";
                                if (typeof +findVal === "number") {
                                    copyItem = delcommafy(copyItem);
                                }
                                this.addFindData(copyItem, currentFindInfo, {
                                    row,
                                    col,
                                });
                            }
                        });
                    }
                });
            }
            this.currentFindInfo = currentFindInfo;
            this.currentIndex = -1;
            //onFindSelectCells 传给父组件，选中样式填充
            if (currentFindInfo.result.length) {
                let map = {};
                currentFindInfo.result.forEach(
                    (item) => (map[`${item.row}_${item.col}`] = true)
                );
                this.props.onFindSelectCells &&
                    this.props.onFindSelectCells(map);
            } else {
                this.props.onFindSelectCells &&
                    this.props.onFindSelectCells({});
            }
        };

        //添加查找的数据
        addFindData = (item, info, pos) => {
            const { key, upperChecked, areaChecked, selection } = info;
            if (this.handleIndexOf(item, key)) {
                if (this.handleUpper(item, key, upperChecked)) {
                    if (this.handleIncludeArea(areaChecked, selection, pos)) {
                        info.result.push(pos);
                    }
                }
            }
        };

        //处理是否在区域内
        handleIncludeArea = (flag, selection, pos) => {
            if (!flag || !this.state.coord) return true;

            const len = selection.length;
            const { row, col } = pos;

            let ans = false;
            for (let i = 0; i < len; i++) {
                const { start, end } = selection[i];
                if (
                    +row >= +start.row &&
                    +row <= +end.row &&
                    +col >= +start.col &&
                    +col <= +end.col
                ) {
                    ans = true;
                    break;
                }
            }
            return ans;
        };

        //处理是否大小写
        handleUpper = (item, key, upperChecked) => {
            if (!upperChecked) return true;
            if (item.indexOf(key) > -1) return true;
            return false;
        };

        //处理是否包含
        handleIndexOf = (item, key) => {
            let findValue = key;
            if (typeof +findValue === "number") {
                findValue = delcommafy(findValue);
            }

            if (
                item.indexOf(findValue) > -1 ||
                item.toUpperCase().indexOf(findValue.toUpperCase()) > -1
            ) {
                return true;
            }
            return false;
        };

        //关闭查找弹窗，全部恢复默认设置
        onHide = () => {
            this.currentFindInfo = null;
            this.currentIndex = -1;
            this.setState({
                show: false,
                findVal: "",
                upperChecked: false,
                areaChecked: true,
                selection: [],
                coord: "",
                isNotFind: false,
            });
            this.props.onFindSelectCells && this.props.onFindSelectCells({});
        };

        onShow = () => {
            this.getHotInstance().unlisten();
        };

        render() {
            const {
                findVal,
                upperChecked,
                areaChecked,
                show,
                coord,
                isNotFind,
            } = this.state;

            return [
                <NCModal
                    show={show}
                    className="modal-no-event simple-report-find-modal"
                    resizeClassName="modal-event"
                    centered={false}
                    backdrop={false}
                    onHide={this.onHide}
                    onShow={this.onShow}
                    size="sm"
                    key="find"
                    showPosition={{ x: document.body.clientWidth - 410, y: 90 }}
                >
                    <NCModal.Header closeButton>
                        <NCModal.Title>
                            <span>
                                {langCheck(
                                    "reportMultiLang",
                                    "100301-000139"
                                ) ||
                                    langCheck(
                                        "tableMultiLang",
                                        "100302-000006"
                                    )}
                            </span>
                        </NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                        <div className="find-and-replace">
                            <div className="far-content">
                                <div className="form-row">
                                    <span className="label">
                                        {langCheck(
                                            "reportMultiLang",
                                            "100301-000233"
                                        ) ||
                                            langCheck(
                                                "tableMultiLang",
                                                "100302-000007"
                                            )}
                                    </span>
                                    <NCFormControl
                                        value={findVal}
                                        onChange={this.onFindValChange}
                                        autoFocus
                                        suffix={
                                            this.currentIndex > -1
                                                ? `${this.currentIndex + 1} / ${
                                                      this.currentFindInfo
                                                          .result.length
                                                  }`
                                                : " "
                                        }
                                    ></NCFormControl>
                                </div>
                                <div className="checkbox-wrapper">
                                    <NCCheckbox
                                        checked={upperChecked}
                                        onChange={this.onCheckedChange.bind(
                                            this,
                                            "upperChecked"
                                        )}
                                    >
                                        <span>
                                            {langCheck(
                                                "reportMultiLang",
                                                "100301-000234"
                                            ) ||
                                                langCheck(
                                                    "tableMultiLang",
                                                    "100302-000008"
                                                )}
                                        </span>
                                    </NCCheckbox>
                                </div>
                                {coord && (
                                    <div className="checkbox-wrapper">
                                        <NCCheckbox
                                            checked={areaChecked}
                                            onChange={this.onCheckedChange.bind(
                                                this,
                                                "areaChecked"
                                            )}
                                        >
                                            <span className="area-box">
                                                {langCheck(
                                                    "reportMultiLang",
                                                    "100301-000254"
                                                ) ||
                                                    langCheck(
                                                        "tableMultiLang",
                                                        "100302-000012"
                                                    )}{" "}
                                                {`(${coord})`}
                                            </span>
                                        </NCCheckbox>
                                    </div>
                                )}
                                {isNotFind && (
                                    <div className="checkbox-wrapper">
                                        <span style={{ color: "red" }}>
                                            {langCheck(
                                                "reportMultiLang",
                                                "100301-000235"
                                            ) ||
                                                langCheck(
                                                    "tableMultiLang",
                                                    "100302-000009"
                                                )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <NCButton onClick={this.onFind.bind(this, "prev")}>
                            {langCheck("reportMultiLang", "100301-000236") ||
                                langCheck("tableMultiLang", "100302-000010")}
                        </NCButton>
                        <NCButton onClick={this.onFind.bind(this, "next")}>
                            {langCheck("reportMultiLang", "100301-000237") ||
                                langCheck("tableMultiLang", "100302-000011")}
                        </NCButton>
                    </NCModal.Footer>
                </NCModal>,
                <Wrap
                    ref="hotTable"
                    afterDocumentKeyDown={this.afterDocumentKeyDown}
                    {...this.props}
                />,
                <NCHotKeys
                    style={{ display: "none" }}
                    keyMap={{
                        // key为内置常量  例如 NC_ADD => ctrl+/
                        addActionSign: "Ctrl+F",
                    }}
                    handlers={{
                        addActionSign: () => this.onContextMenuClick("find"),
                    }}
                    focused={true}
                >
                    111
                </NCHotKeys>,
            ];
        }
    };
}

export default withHandsontable(Handsontable);
