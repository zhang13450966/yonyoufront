import { toast } from "nc-lightapp-front";
import { getMergeCells } from "./index";
import Utils from "@public/utils";
const { arraySum, langCheck, isFloat } = Utils;
export const blockFun = function (type) {
    let coords = this.coords;
    if (
        coords.row == null ||
        coords.row == undefined ||
        coords.row < 0 ||
        coords.col < 0
    ) {
        toast({
            color: "warning",
            content: langCheck("tableMultiLang", "100302-000000"),
        }); /* 国际化处理： 请选择单元格进行冻结*/
        return;
    }
    let hansonWidth = document.getElementsByClassName("htCore")[0].scrollWidth;
    let tableWidth =
        document.getElementsByClassName("simple-table")[0].offsetWidth;
    let tableHeight = document.getElementById("simpleTableReport").offsetHeight;
    if (
        hansonWidth <= tableWidth &&
        (type == "lockColumn" || type == "lockRowColumn")
    ) {
        toast({
            content: langCheck("tableMultiLang", "100302-000001"),
            color: "warning",
        }); /* 国际化处理： 表格宽度小于屏幕宽度，暂不支持冻结列*/
        return;
    }

    if (
        this.state.settings.colWidths.length > 0 ||
        this.state.settings.rowHeights.length > 0
    ) {
        let overflowHeight = arraySum(
            this.state.settings.rowHeights.slice(
                0,
                coords.row > 0 ? coords.row + 2 : 1
            )
        );
        let overFlowWidth = arraySum(
            this.state.settings.colWidths.slice(
                0,
                coords.col > 0 ? coords.col + 1 : 1
            )
        );
        if (
            overflowHeight > tableHeight &&
            (type == "lockRow" || type == "lockRowColumn")
        )
            return toast({
                content: langCheck("tableMultiLang", "100302-000005"),
                color: "warning",
            }); /* 国际化处理： 当前位置超出一屏,暂不支持冻结。*/
        if (
            overFlowWidth > tableWidth &&
            (type == "lockColumn" || type == "lockRowColumn")
        )
            return toast({
                content: langCheck("tableMultiLang", "100302-000005"),
                color: "warning",
            }); /* 国际化处理： 当前位置超出一屏,暂不支持冻结。*/
    }

    let selectedInfo = this.tdSelected;
    if (!selectedInfo || selectedInfo.length < 1) {
        return;
    }
    let startRow = selectedInfo[0][0];
    let startCol = selectedInfo[0][1];
    let endRow = selectedInfo[0][2];
    let endCol = selectedInfo[0][3];
    let freezingNum = getRowOffset(this, startRow, startCol, type);

    let lockObj = {};
    lockObj.name = type;
    lockObj.parameter = {};
    if (type == "lockRow") {
        setColumnOfLockParameter(lockObj.parameter, "row", startRow, endRow);
        //更新锁定行列值
        updateFixedSetting(
            this,
            type,
            lockObj.parameter.row,
            "",
            selectedInfo,
            freezingNum,
            coords
        );
        document.querySelector(
            ".ht_master.handsontable div.wtHolder"
        ).scrollTop = 0;
    } else if (type == "lockColumn") {
        setColumnOfLockParameter(lockObj.parameter, "column", startCol, endCol);
        updateFixedSetting(
            this,
            type,
            "",
            lockObj.parameter.column,
            selectedInfo,
            freezingNum,
            coords
        );
        document.querySelector(
            ".ht_master.handsontable div.wtHolder"
        ).scrollLeft = 0;
    } else if (type == "lockRowColumn") {
        setColumnOfLockParameter(lockObj.parameter, "row", startRow, endRow);
        setColumnOfLockParameter(lockObj.parameter, "column", startCol, endCol);
        updateFixedSetting(
            this,
            type,
            lockObj.parameter.row,
            lockObj.parameter.column,
            selectedInfo,
            freezingNum,
            coords
        );
        document.querySelector(
            ".ht_master.handsontable div.wtHolder"
        ).scrollTop = 0;
        document.querySelector(
            ".ht_master.handsontable div.wtHolder"
        ).scrollLeft = 0;
    }
};

function getRowOffset(that, rowNum, colNum, way) {
    //获取冻结行列数
    let isClickCoords = that.coords;
    if (way == "lockColumn" && isClickCoords.row < 0) {
        rowNum = 10;
    }
    var currentTd = that.refs.hansontable
        .getHotInstance()
        .getCell(rowNum, colNum, false);
    var tdOffset = currentTd.getBoundingClientRect();
    var rowOffset = 0;
    var colOffset = 0;
    var topReferOffset = 0;
    var topRefer = document.querySelector(
        ".ht_clone_top_left_corner.handsontable .htCore thead"
    );
    if (!topRefer) {
        topRefer = document.querySelector("header >div:nth-child(3)");
        topReferOffset = topRefer.getBoundingClientRect();
        rowOffset = tdOffset.bottom - topReferOffset.bottom;
        colOffset = tdOffset.right - topReferOffset.left;
    } else {
        topReferOffset = topRefer.getBoundingClientRect();
        rowOffset = tdOffset.bottom - topReferOffset.bottom;
        colOffset = tdOffset.right - topReferOffset.right;
    }

    var freezingNum = [];
    var heightSum = 0;
    if (isFloat(rowOffset)) {
        //对大屏分辨率的hack
        freezingNum[0] = rowNum;
    } else {
        for (var i = rowNum; i >= 0; i--) {
            heightSum += that.refs.hansontable.getHotInstance().getRowHeight(i);
            if (heightSum >= rowOffset - 22) {
                freezingNum[0] = rowNum - i;
                break;
            }
        }
    }

    var widthSum = 0;
    if (isFloat(colOffset)) {
        freezingNum[1] = colNum;
    } else {
        for (var i = colNum; i >= 0; i--) {
            widthSum += that.refs.hansontable.getHotInstance().getColWidth(i);
            if (widthSum >= colOffset) {
                freezingNum[1] = colNum - i;
                break;
            }
        }
    }

    return freezingNum;
}

function updateFixedSetting(
    that,
    type,
    rowNum,
    colNum,
    selectedInfo,
    freezingNum,
    coords
) {
    //表格总行数 总列数
    // var countRows = that.refs.hansontable.getHotInstance().countRows();
    // var countCols = that.refs.hansontable.getHotInstance().countCols();
    const { settings, result} = that.state;
    var areaCells = settings.mergeCells || [];

    let fixedRowsTop = type ==="lockRow" || type === "lockRowColumn" ? freezingNum[0] || coords.row : 0;
    let fixedColumnsLeft = type === "lockColumn" || type === "lockRowColumn" ? freezingNum[1] || coords.col : 0;

    const { mergeCells: handleMergeCells, hideTextWhenFreeze } = getMergeCells(
        result.mergeInfo,
        fixedColumnsLeft,
        fixedRowsTop
    );

    var freezingAreaCells = [];
    if (type == "lockRow") {
        var changeRowNum = rowNum - freezingNum[0]; //冻结时被舍去的行数
        //获取冻结所需的areaCells数据
        //0: row  1: col  rowspan: 2  colspan: 3
        areaCells.forEach((item) => {
            if (+item[3] >= +changeRowNum) {
                if (+item[1] <= +changeRowNum) {
                    item[1] = changeRowNum;
                }
                freezingAreaCells.push(item);
            }
        });
        //对冻结所需areaCells数据,进行冻结状态合并单元格的处理,主要解决冻结分割处文字遮挡问题
        var mergeCells = freezingMergeCells(
            type,
            selectedInfo,
            freezingNum,
            freezingAreaCells
        );
        that.setState(
            {
                hideTextWhenFreeze,
                settings: {
                    ...that.state.settings,
                    fixedRowsTop,
                    fixedColumnsLeft: 0,
                    mergeCells:
                        mergeCells.length > 0
                            ? mergeCells
                            : handleMergeCells,
                },
            },
            () => that.updateSettings()
        );
    } else if (type == "lockColumn") {
        var changeColNum = colNum - freezingNum[1];

        areaCells.forEach((item) => {
            if (+item[3] >= +changeColNum) {
                if (+item[1] <= +changeColNum) {
                    item[1] = changeColNum;
                }
                freezingAreaCells.push(item);
            }
        });
        var mergeCells = freezingMergeCells(
            type,
            selectedInfo,
            freezingNum,
            freezingAreaCells
        );
        that.setState(
            {
                hideTextWhenFreeze,
                settings: {
                    ...that.state.settings,
                    fixedRowsTop: 0,
                    fixedColumnsLeft,
                    mergeCells:
                        mergeCells.length > 0
                            ? mergeCells
                            : handleMergeCells,
                },
            },
            () => that.updateSettings()
        );
    } else if (type == "lockRowColumn") {
        var changeRowNum = rowNum - freezingNum[0];
        var changeColNum = colNum - freezingNum[1];

        areaCells.forEach((item) => {
            if (+item[2] >= +changeRowNum) {
                if (+item[0] <= +changeRowNum) {
                    item[0] = changeRowNum;
                }
                freezingAreaCells.push(item);
            }
        });

        var freezingAreaCells2 = [];
        freezingAreaCells.forEach((item) => {
            if (+item[3] >= +changeColNum) {
                if (+item[1] <= +changeColNum) {
                    item[1] = changeColNum;
                }
                freezingAreaCells2.push(item);
            }
        });
        var mergeCells = freezingMergeCells(
            type,
            selectedInfo,
            freezingNum,
            freezingAreaCells2
        );
        that.setState(
            {
                hideTextWhenFreeze,
                settings: {
                    ...that.state.settings,
                    fixedRowsTop,
                    fixedColumnsLeft,
                    mergeCells:
                        mergeCells.length > 0
                            ? mergeCells
                            : handleMergeCells,
                },
            },
            () => that.updateSettings()
        );
    }
}

function freezingMergeCells(type, selectedInfo, freezingNum, areaCells) {
    var startRow = selectedInfo[0][0];
    var startCol = selectedInfo[0][1];

    var mergeCells = [];
    if (!areaCells) {
        return mergeCells;
    }

    if (type == "lockRow") {
        //0: row  1: col  rowspan: 2  colspan: 3
        areaCells.forEach((areaCell) => {
            var viarable = startRow - freezingNum[0];
            if (areaCell[0] < startRow && areaCell[2] >= startRow) {
                mergeCells.push({
                    row: areaCell[0] - viarable,
                    col: areaCell[1],
                    rowspan: startRow - areaCell[0],
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
                mergeCells.push({
                    row: startRow - viarable,
                    col: areaCell[1],
                    rowspan: areaCell[2] - startRow + 1,
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
            } else {
                mergeCells.push({
                    row: areaCell[0] - viarable,
                    col: areaCell[1],
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
            }
        });
    } else if (type == "lockColumn") {
        areaCells.forEach((areaCell) => {
            var viarable = startCol - freezingNum[1];
            if (areaCell[1] < startCol && areaCell[3] >= startCol) {
                mergeCells.push({
                    row: areaCell[0],
                    col: areaCell[1] - viarable,
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: startCol - areaCell[1],
                });
                mergeCells.push({
                    row: areaCell[0],
                    col: startCol - viarable,
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: areaCell[3] - startCol + 1,
                });
            } else {
                mergeCells.push({
                    row: areaCell[0],
                    col: areaCell[1] - viarable,
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
            }
        });
    } else if (type == "lockRowColumn") {
        areaCells.forEach((areaCell) => {
            var rowViarable = startRow - freezingNum[0];
            var colViarable = startCol - freezingNum[1];
            if (areaCell[0] < startRow && areaCell[2] >= startRow) {
                mergeCells.push({
                    row: areaCell[0] - rowViarable,
                    col: areaCell[1] - colViarable,
                    rowspan: startRow - areaCell[0],
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
                mergeCells.push({
                    row: startRow - rowViarable,
                    col: areaCell[1] - colViarable,
                    rowspan: areaCell[2] - startRow + 1,
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
            } else if (areaCell[1] < startCol && areaCell[3] >= startCol) {
                mergeCells.push({
                    row: areaCell[0] - rowViarable,
                    col: areaCell[1] - colViarable,
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: startCol - areaCell[1],
                });
                mergeCells.push({
                    row: areaCell[0] - rowViarable,
                    col: startCol - colViarable,
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: areaCell[3] - startCol + 1,
                });
            } else {
                mergeCells.push({
                    row: areaCell[0] - rowViarable,
                    col: areaCell[1] - colViarable,
                    rowspan: areaCell[2] - areaCell[0] + 1,
                    colspan: areaCell[3] - areaCell[1] + 1,
                });
            }
        });
    }

    return mergeCells;
}

// 冻结行列为  选中区域行列号最小的单元格值
function setColumnOfLockParameter(obj, prop, startNum, endNum) {
    if (startNum < endNum) {
        obj[prop] = startNum;
    } else {
        obj[prop] = endNum;
    }
}
