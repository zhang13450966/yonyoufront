import { ajax } from "nc-lightapp-front";
import Utils from "@public/utils";
const { setMaxRow, checkStrLen } = Utils;
import { SEARCHID, MAX_MERGE_CELL } from "../config";

//表格渲染函数
export const tableRender = function (that, result = {}, type = "") {
    // ----------渲染表格。处理数据
    let defaultRet = JSON.parse(JSON.stringify(result));

    result = handleColumnData.call(that, result);
    const {
        limitCount,
        CellsModel = {},
        operationQueue = "",
        transSaveObject = "",
    } = result;
    const { settings, fieldExpCaptionMap, totalObj } = that.state;
    let fldAreaArray = []; //存放每列有效区域
    let seperateCol = 0; //默认冻结区域
    let seperateRow = 0; //默认冻结区域
    let pager = result.pager || {
        allRowCount: "0",
        pageCount: "1",
        pageIndex: "1",
        pageRowCount: "0",
        pageSize: limitCount || that.state.pager.pageSize || 200,
    };
    if (pager.allRowCount) pager.allRowCount = +pager.allRowCount;

    if (that.viewModelChange) result = handleData(result, that);

    let area = [],
        fldAreas = [],
        calcFields = [],
        len = CellsModel.AreaDatas && CellsModel.AreaDatas.length;
    if (len == 1) {
        area = CellsModel.AreaDatas[0].area;
        fldAreas = CellsModel.AreaDatas[0].fldAreas;
        calcFields = CellsModel.AreaDatas[0].calcFields;
    } else if (len > 1) {
        for (let i = 0; i < len; i++) {
            area = area.concat(CellsModel.AreaDatas[i].area);
            fldAreas = fldAreas.concat(CellsModel.AreaDatas[i].fldAreas);
            calcFields = calcFields.concat(CellsModel.AreaDatas[i].calcFields);
        }
    }

    let newAreas = [];
    for (let i = 0; i < fldAreas.length; i++) {
        let isExists = false;
        for (let j = 0; j < calcFields.length; j++) {
            if (calcFields[j] == fldAreas[i].fldName) {
                isExists = true;
                break;
            }
        }
        if (isExists) {
            continue;
        }
        fldAreas[i].fldArea.forEach((item, index) => {
            fldAreaArray[item[1]] = [];
        });
        newAreas.push(fldAreas[i]);
    }
    newAreas.forEach((areas, index) => {
        areas.fldArea.forEach((item, index) => {
            fldAreaArray[item[1]].push({
                startRow: item[0],
                endRow: item[2],
                id: areas.fldName,
            });
        });
    });

    const { tdStyle, cellsWidth, tableData, rowHeights } =
        getReportSettings(CellsModel) || {};

    //处理表格数据
    if (tableData) {
        let lockSet = CellsModel.tableSetting.lockSet;
        seperateCol =
            settings.fixedColumnsLeft || settings.fixedColumnsLeft == 0
                ? settings.fixedColumnsLeft
                : lockSet.seperateCol;
        seperateRow =
            settings.fixedRowsTop || settings.fixedRowsTop == 0
                ? settings.fixedRowsTop
                : lockSet.seperateRow;

        const { mergeCells, hideTextWhenFreeze, seperateRowNext } =
            getMergeCells(
                result,
                +seperateCol,
                +seperateRow,
                cellsWidth,
                that.treeParams
            );

        if (seperateRowNext) seperateRow = seperateRowNext;

        handlePointMap.call(that, result); //处理区域信息

        that.setState({
            tdStyle,
            result: defaultRet,
            fieldExpCaptionMap:
                defaultRet.fieldExpCaptionMap || fieldExpCaptionMap, //排序筛选等没有此字段，在getRowData要保留
            afterChangeData: result,
            area,
            pager,
            fldAreaArray,
            totalObj: {
                ...totalObj,
                sumNum: "",
                count: "",
            },
            hideTextWhenFreeze,
            settings: {
                ...settings,
                data: tableData,
                fixedRowsTop: seperateRow,
                fixedColumnsLeft: seperateCol,
                colWidths:
                    type === "saveWidth" ? cellsWidth : settings.colWidths,
                rowHeights,
                mergeCells,
            },
        });

        setMaxRow.call(that);

        that.commonParams.operationQueue = operationQueue;
        that.commonParams.transSaveObject =
            transSaveObject || that.commonParams.transSaveObject;
    }
};

//获取表格内参数
export function getReportSettings(CellsModel) {
    if (!CellsModel) return {};

    const { DynamicModel } = CellsModel || {};

    const tdStyle = checkClass(DynamicModel[0]);

    const cellsWidth = getCellsWidth(CellsModel);

    const rowHeights = getCellsHeight(CellsModel);

    const tableData = getTableData(DynamicModel, cellsWidth);

    const { levelAreaType } = DynamicModel[0].siderBarTreeParams && DynamicModel[0].siderBarTreeParams.config || {};

    return {
        tdStyle,
        cellsWidth,
        tableData,
        rowHeights,
        levelAreaType
    };
}

//获取表格高度
function getCellsHeight(CellsModel) {
    let rowHeights = CellsModel.rowHeader.headerArray;

    return rowHeights.map((height) => (+height < 24 ? 24 : height));
}

//计算表格宽度
function getCellsWidth(CellsModel) {
    let cellsWidth = CellsModel.columnHeader.headerArray;
    return cellsWidth.map((item) => (+item < 2 ? 0.01 : item));
}

//创建表格数据
function getTableData(DynamicModel, cellsWidth) {
    let cellsArray =
        DynamicModel && DynamicModel[0] && DynamicModel[0].cellsArray;

    if (!cellsArray) return null;

    let maxRowLength = 0,
        tableData = [];
    cellsArray.forEach((items, row) => {
        let itemsArr = [];
        maxRowLength = Math.max(maxRowLength, items.length); //最大列数
        items.forEach((item, col) => {
            // if (cellsWidth[col] < 2) {
            //     itemsArr.push([null]);
            // } else {
            //     itemsArr.push([item]);
            // }
            itemsArr.push([item]);
        });
        tableData.push(itemsArr);
    });

    tableData.forEach((items, i) => {
        if (items.length < maxRowLength) {
            let fillArray = new Array(maxRowLength - items.length).fill([null]);
            tableData[i] = [...tableData[i], ...fillArray];
        }
    });

    return tableData;
}

//列设置
export function handleColumnData(data) {
    const { configOrNot } = this.colinfo || {};
    if (configOrNot === "true") {
        const colArray = [];
        const handleObj = this.colSettingsObj;
        const start = +this.reportDataStartPostion;

        data.CellsModel.DynamicModel[0].cellsArray.forEach((rows, index) => {
            colArray[index] = [];
            rows.forEach((item, col) => {
                const originLoc = handleObj[col] && handleObj[col].originLoc;

                if (handleObj[col] && index >= start) {
                    if (handleObj[col].isHidden === "true") {
                        data.CellsModel.columnHeader.headerArray[col] = 0;
                    } else if (handleObj[col].isHidden === "false") {
                        data.CellsModel.columnHeader.headerArray[col] =
                            data.CellsModel.columnHeader.headerArray[col] < 2
                                ? "80"
                                : data.CellsModel.columnHeader.headerArray[col];
                    }
                    colArray[index][col] = rows[originLoc];
                } else {
                    colArray[index][col] = item;
                }
            });
        });
        data.CellsModel.DynamicModel[0].areaCells = handleFreezeData.call(
            this,
            data
        );
        data.CellsModel.DynamicModel[0].cellsArray = colArray;
    }

    return data;
}

//处理合并单元格
function handleFreezeData(data) {
    if (!data.CellsModel.DynamicModel[0].areaCells) return [];
    const start = +this.reportDataStartPostion;
    const handleObj = this.colSettingsObj;
    let noFreezeArr = data.CellsModel.DynamicModel[0].areaCells.filter(
        (item) => item[0] < start
    );
    let freezeArr = data.CellsModel.DynamicModel[0].areaCells.filter(
        (item) => item[0] >= start
    );

    let mergeCell = [];

    //遍历所有合并单元格，如果没有colspan，则直接push
    //如果有colspan，则要判断改变的单元格位置是否在这个里面，如果在，则colspan要-1
    for (let item of freezeArr) {
        const start = item[1],
            end = item[3],
            startRow = item[0],
            endRow = item[2];
        if (start !== end || startRow !== endRow) {
            diffColumn({ start, end, item }, mergeCell, handleObj, freezeArr);
        } else {
            mergeCell.push(item);
        }
    }
    return [...noFreezeArr, ...mergeCell];
}

const diffColumn = function (coords, mergeCell, handleObj, freezeArr) {
    let count = 0,
        statck = [],
        startMark = null,
        endMark = null,
        startIndex = null;
    const { start, end, item } = coords;
    Object.values(handleObj).forEach((element) => {
        if (+element.originLoc >= +start && +element.originLoc <= +end) {
            //暂存区域内的列
            statck.push(element);
        }
    });

    statck
        .sort((a, b) => a.order - b.order)
        .forEach((element, index) => {
            if (element.order === element.originLoc) {
                endMark = Math.min(endMark || element.order, element.order);
            } else {
                endMark = null;
            }
            if (+element.order < +start && +start > 0) {
                count += 1;
            } else {
                if (startMark == null) {
                    startMark = +element.order;
                    startIndex = index;
                } else {
                    if (element.order - startMark !== index - startIndex) {
                        count += 1;
                    }
                }
            }
        });

    let diff = end - start - count;
    if (startMark || startMark == 0) {
        if (diff > -1)
            mergeCell.push([
                item[0],
                `${startMark}`,
                item[2],
                `${+startMark + diff}`,
            ]);
        if (endMark && endMark < +end && endMark > +startMark + diff)
            mergeCell.push([item[0], `${endMark}`, item[2], `${end}`]);
    } else {
        //如果不匹配，如果当前单元格之前为合并行，则也要合并行。现在是颠倒是后面计算没问题，但是前面的如果是合并行，则会有问题，做一个兼容处理
        statck
            .sort((a, b) => a.order - b.order)
            .forEach((element, index) => {
                if (+element.order <= +start) {
                    const cur = freezeArr.find(
                        (e) => element.originLoc == e[1] && e[0] != e[2]
                    );
                    if (cur)
                        mergeCell.push([
                            cur[0],
                            element.order,
                            cur[2],
                            element.order,
                        ]);
                }
            });
    }
};

//获取列设置的map
export function getColSettingsObj(colinfo) {
    const { mark } = colinfo || {};
    const handleObj = {};
    if (mark) {
        const ret = colinfo[mark];
        ret.forEach((item) => {
            handleObj[item.order] = item;
        });
    }
    return handleObj;
}

//处理表格样式
function checkClass(data) {
    //获取样式数据
    let aligns = data.aligns;
    let fonts = data.fonts;
    let lines = data.lines;
    let formats = data.formats;

    const newFonts = {};
    const newLines = {};
    const newAligns = {};
    const newFormats = {};

    if (aligns) {
        aligns.forEach((item) => {
            newAligns[item.id] = item.detail;
        });
    }
    if (fonts) {
        fonts.forEach((item) => {
            newFonts[item.id] = item.detail;
        });
    }
    if (lines) {
        lines.forEach((item) => {
            newLines[item.id] = item.detail;
        });
    }
    if (formats) {
        formats.forEach((format) => {
            const oneFormat = {
                font: newFonts[format.detail.fontId],
                align: newAligns[format.detail.alignId],
                line: newLines[format.detail.lineId],
                isData: format.isData,
            };
            newFormats[format.id] = oneFormat;
        });
    }
    return newFormats;
}

/**
 *
 * @param {*} ret 接口返回的数据
 * @param {*} seperateCol 冻结列
 * @param {*} seperateRow 冻结行
 * @param {*} cellsWidth 单元格宽度
 * @returns
 */
export const getMergeCells = function (
    ret,
    seperateCol,
    seperateRow,
    cellsWidth,
    isHandle
) {
    if (!ret) return [];

    //和并列数据提取
    let mergeCells = [],
        hideTextWhenFreeze = [],
        seperateRowNext = +seperateRow,
        flag = true;

    const { areaCells } =
        ret.CellsModel &&
        ret.CellsModel.DynamicModel &&
        ret.CellsModel.DynamicModel[0];

    //表格合并列行
    if (areaCells && areaCells.length) {
        const rowInMergeCell = areaCells.find(
            (array) =>
                seperateRowNext > +array[0] &&
                seperateRowNext <= +array[2] &&
                +array[3] > 1
        );
        if (rowInMergeCell) {
            seperateRowNext = +rowInMergeCell[2] + 1;
            flag = false;
        }

        const bigMergeCell = areaCells.filter((item, i) => {
            const [row, col, endRow, endCol] = item;
            if (endRow - row >= MAX_MERGE_CELL) {
                return [...item, i];
            }
        });
        let smallMergeCell = areaCells.filter(
            ([row, col, endRow, endCol]) => endRow - row < MAX_MERGE_CELL
        );

        if (!isHandle) {
            handleBigCell(bigMergeCell, smallMergeCell);
        } else {
            smallMergeCell = [...bigMergeCell, ...smallMergeCell];
        }

        smallMergeCell.forEach((items) => {
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
                    const leftArea = getSum(cellsWidth, col, seperateCol);
                    const rightArea = getSum(
                        cellsWidth,
                        seperateCol,
                        +items[3] + 1
                    );
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

                    if (leftArea > rightArea) {
                        hideTextWhenFreeze.push({
                            row,
                            col: +seperateCol,
                            endRow: +items[2],
                            endCol: +items[3],
                        });
                    } else {
                        hideTextWhenFreeze.push({
                            row,
                            col,
                            endRow: +items[2],
                            endCol: seperateCol - 1 < 0 ? 0 : seperateCol - 1,
                        });
                    }
                } else {
                    mergeCells.push(areaObj);
                }
            } else if (seperateRowNext > 0 && rowspan > 1) {
                if (seperateRowNext >= row && seperateRowNext < row + rowspan) {
                    mergeCells.push({
                        row,
                        col,
                        rowspan: seperateRowNext - row,
                        colspan,
                    });
                    mergeCells.push({
                        row: seperateRowNext,
                        col,
                        rowspan: row + rowspan - seperateRowNext,
                        colspan,
                    });
                } else {
                    mergeCells.push(areaObj);
                }
            } else {
                mergeCells.push(areaObj);
            }
        });
    }

    return {
        mergeCells,
        hideTextWhenFreeze,
        seperateRowNext: flag ? null : seperateRowNext,
    };
};

export function toggleCalcFun(type) {
    document.getElementById("calcContent").style.display = type;
}

//排序筛选等按钮的可用性设置
export function buttonDisabledFun(coords = {}) {
    const { col, row } = coords;
    const { fldAreaArray } = this.state;
    const { noDropdownPrint } = this.initParams;

    if (!coords.row && coords.row != 0)
        return this.setState({ preciseDisabled: true });

    let inSearchArea = false,
        sortAndFilterArea = false;

    if (fldAreaArray[col]) {
        sortAndFilterArea = true;
        for (let i = 0; i < fldAreaArray[col].length; i++) {
            if (
                +row <= +fldAreaArray[col][i].endRow &&
                +row >= +fldAreaArray[col][i].startRow
            ) {
                inSearchArea = true;
                break;
            }
        }
    }

    // inSearchArea 控制联查  sortAndFilterArea 控制升降序，筛选，
    this.inSearchArea = inSearchArea;
    if (!noDropdownPrint) {
        if (!this.emptyDataFlag) {
            this.setState({
                preciseDisabled: !inSearchArea,
                sortAndFilterArea: !sortAndFilterArea,
            });
        } else {
            this.setState({
                preciseDisabled: true,
                sortAndFilterArea: true,
            });
        }
    } else {
        this.setState({
            preciseDisabled: true,
            sortAndFilterArea: true,
        });
    }
}

//数据视图 普通视图
function handleData(ret, that) {
    const start = that.reportDataStartPostion;

    if (+start > 0) {
        //冻结行

        let freezeRow = that.pageParams.startFreezeLine.row || 1;

        freezeRow = sliceData(ret, start, freezeRow);

        if (!that.IS_CLICK_BLOCK && that.pageParams.freezeLine === "y")
            that.state.settings.fixedRowsTop = freezeRow;
    }

    return ret;
}

export function sliceData(ret, start, freezeRow) {
    let currentRow = freezeRow;
    //填充数据的截取
    ret.CellsModel.DynamicModel[0].cellsArray =
        ret.CellsModel.DynamicModel[0].cellsArray.slice(
            start,
            ret.CellsModel.DynamicModel[0].cellsArray.length
        );

    //合并单元格的截取
    if (ret.CellsModel.DynamicModel[0].areaCells) {
        ret.CellsModel.DynamicModel[0].areaCells =
            ret.CellsModel.DynamicModel[0].areaCells.filter(
                (item) => +item[0] >= start
            );
        let array = ret.CellsModel.DynamicModel[0].areaCells;
        ret.CellsModel.DynamicModel[0].areaCells = array.map((item) => {
            let result = [
                (item[0] - start).toString(),
                item[1],
                (item[2] - start).toString(),
                item[3],
            ];
            if (result[0] == 0 && +result[2] > 0) {
                currentRow = Math.max(+result[2] + 1, +currentRow);
            }
            return result;
        });
    }

    //单元格高度的截取
    ret.CellsModel.rowHeader.headerArray =
        ret.CellsModel.rowHeader.headerArray.slice(
            start,
            ret.CellsModel.rowHeader.headerArray.length
        );

    //有效数据范围
    ret.CellsModel.AreaDatas.forEach((areas) => {
        areas.fldAreas.forEach((area) => {
            area.fldArea.forEach((_, index) => {
                area.fldArea[index][0] = area.fldArea[index][0] - start;
                area.fldArea[index][2] = area.fldArea[index][2] - start;
            });
        });
    });

    return currentRow;
}

export function getKeys(data, obj) {
    data.forEach((item) => {
        if (item.key && item.title) {
            if (obj.hasOwnProperty(item.key)) {
                obj[item.key].push(item.key);
            } else if (obj.hasOwnProperty(item.parentCode)) {
                obj[item.parentCode].push(item.key);
            } else if (obj.hasOwnProperty(item.topParentCode)) {
                obj[item.topParentCode].push(item.key);
            }
        }
        if (item.children) getKeys(item.children, obj);
    });
    return obj;
}

export function fillChild(printmenu) {
    printmenu = printmenu.map((item) => {
        return {
            area: "button_area",
            key: item.nodekey,
            parentCode: "print_drop_down",
            title: item.name,
            topParentCode: "print",
            type: "general_btn",
        };
    });
    return printmenu;
}

//获取列最大宽度
export function getMaxWidth(data, oldWidths, tdSelectedArea) {
    let ret = data.CellsModel.DynamicModel[0].cellsArray;
    if (!tdSelectedArea) tdSelectedArea = [0, 0, 0, ret[0].length - 1];

    let len = 17;
    oldWidths = oldWidths.map((item, index) => {
        if (index >= tdSelectedArea[1] && index <= tdSelectedArea[3]) {
            if (item < 2) return item;
            return 80;
        }
        return item;
    });

    const start = 0; //拓展区上方也进行处理NCC-193169 this.reportDataStartPostion;
    if (start > 0) ret = ret.slice(start, ret.length - 1);

    ret.forEach((row) => {
        row.forEach((item, index) => {
            if (index >= tdSelectedArea[1] && index <= tdSelectedArea[3]) {
                if (item && item[0]) {
                    if (oldWidths[index] > 1) {
                        let strLen = 0;
                        let text = item[0].replace(/&nbsp;/gi, "");
                        if (text.indexOf("\n") < 0) {
                            strLen = checkStrLen(text) * len;
                        } else {
                            const first = text.split("\n")[0];
                            strLen = checkStrLen(first) * len;
                        }
                        if (oldWidths[index] <= strLen)
                            oldWidths[index] = parseInt(strLen);
                    }
                }
            }
        });
    });
    return oldWidths;
}

//列设置时可能当前选中列与真实列对应不上，需要特殊处理
export function getRelCoords() {
    if (!this.isClickCoords.hasOwnProperty("row"))
        return { row: "0", col: "0" };
    let coords = { ...this.isClickCoords };
    if (+coords.row < 0) coords.row = "0";
    if (+coords.col < 0) coords.col = "0";

    if (this.viewModelChange) {
        const start = this.reportDataStartPostion;
        coords.row = Number(coords.row) + Number(start) + "";
    }
    if (
        this.colinfo.configOrNot &&
        this.colinfo.configOrNot === "true" &&
        this.colSettingsObj[coords.col]
    )
        coords.col = this.colSettingsObj[coords.col].originLoc;
    return coords;
}

//构建注册按钮
export function createRegButton(buttons) {
    if (!buttons) return [];
    const { printOther = [] } = this.props;

    const metaButton = JSON.parse(JSON.stringify(buttons));

    const printMenu = [...printOther].map((item) => ({
        area: "button_area",
        btncolor: "button_secondary",
        key: item.key,
        parentCode: "print_drop_down",
        title: item.display,
        topParentCode: "print",
        type: "general_btn",
    }));
    metaButton.forEach((item) => {
        if (
            item.key === "print" &&
            item.children &&
            item.children[0] &&
            item.children[0].children
        ) {
            item.children[0].children = [
                ...item.children[0].children,
                ...printMenu,
            ];
        }
    });

    return metaButton;
}

//排序筛选时获取有效数据内的行
export function getSendCoord() {
    const { fldAreaArray } = this.state;
    const { col, row } = getRelCoords.call(this); //动态col
    const { crossPoint, area } = getTargetArea.call(
        this,
        {
            row,
            col,
        },
        "current"
    );

    if (area) return { row, col };

    //不在拓展区，找出第一个
    let start = 0;
    if (!crossPoint) {
        //非交叉表，要找到数据行，进行数据传输
        //交叉表，传原始坐标，如果不在数据区域，后端抛错
        if (this.viewModelChange) {
            start = this.reportDataStartPostion;
        }
        try {
            const cur = fldAreaArray[col];
            const { startRow } = cur[0];
            start = +start + +startRow;
        } catch (err) {}
    }

    return {
        col,
        row: (start || row) + "",
    };
}

//获取注册的按钮是否显示，如果不显示，则要显示默认的打印
export function getRegButtonDisplay() {
    return new Promise((reslove) => {
        ajax({
            url: "/nccloud/report/widget/queryIsHaveButtons.do",
            data: {},
            success: (res) => {
                reslove(res.data);
            },
        });
    });
}

function getSum(widths, start, end) {
    const arr = widths.slice(start, end);
    let num = 0;
    arr.forEach((item) => {
        num += +item;
    });
    return num;
}

//数据视图，常规视图切换
export function resetDisabled(type) {
    const { row, col } = this.isClickCoords;
    let currentCoord = { row, col };
    const start = this.reportDataStartPostion;
    if (type === "dataView") {
        currentCoord.row = +row + +start;
    } else {
        currentCoord.row = row - start;
    }

    buttonDisabledFun.call(this, currentCoord);
}

export function handlePointMap(model) {
    const { pointMap, CellsModel } = model;
    const { AreaDatas } = CellsModel;
    if (pointMap) this.pointMap = pointMap;
    AreaDatas.forEach((item) => {
        const { exId, area } = item;
        if (this.pointMap[exId]) {
            this.pointMap[exId] = {
                ...this.pointMap[exId],
                area,
                exId,
            };
        }
    });
}

//根据坐标获取当前拓展区
export function getTargetArea(params, type) {
    const { row, col, exareaID } = params;
    const AreaDatas = Object.values(this.pointMap) || [];

    const target = AreaDatas.find(({ area, exId }) => {
        if (exareaID) {
            return exareaID === exId;
        }
        return (
            area &&
            +row >= +area[0] &&
            +row <= +area[2] &&
            +col >= +area[1] &&
            +col <= +area[3]
        );
    });
    if (type === "current") return target || {};
    return target || AreaDatas[0] || {};
}

//获取联查下拉数据
export function getSearchMenuArr(drillRules = []) {
    const { changeSearchByBusi } = this.props;
    let drillRulesList = []; //联查列表

    if (drillRules.length) {
        drillRules.forEach((array) => {
            array.forEach((items) => {
                items.drills.forEach((obj) => {
                    obj = Object.assign({}, obj, {
                        fldName: items.fldName,
                        area: items.area,
                    });
                    drillRulesList.push(obj);
                });
            });
        });
        drillRulesList = drillRulesList.sort((a, b) => {
            return a.buttonOrder - b.buttonOrder;
        });
        if (changeSearchByBusi) {
            drillRulesList = changeSearchByBusi(drillRulesList);
        }
    }

    return drillRulesList;
}

//获取联查按钮可用性
export function getDrillItemDisabled({
    item,
    disabledDrillColArray,
    preciseDisabled,
    coord,
}) {
    const { area } = item;
    const { row, col } = coord;

    if (!area || !row) return preciseDisabled;

    let disabled =
        (disabledDrillColArray && disabledDrillColArray.includes(col)) ||
        preciseDisabled;

    const { startCell, endCell } = area;

    if (!disabledDrillColArray || !disabledDrillColArray.includes(col)) {
        if (!preciseDisabled) {
            if (+startCell.row > +row || +endCell.row < +row) {
                disabled = true;
            }
        }
    }

    return disabled;
}

//处理侧边栏数据
export function handleSideBarSetParams({ sideBarSet }) {
    if (!sideBarSet || !sideBarSet.length) return {};
    const { isDefaultExpand } = sideBarSet[0];
    return {
        isDefaultExpand,
        sideBarList: sideBarSet,
    };
}

//修改大合并单元格
function handleBigCell(bigMergeCell, smallMergeCell) {
    while (bigMergeCell.length) {
        const cur = bigMergeCell.shift();
        let index = +cur[0],
            pos = cur[4],
            arr = [];
        while (index + MAX_MERGE_CELL <= +cur[2]) {
            arr.push([
                index.toString(),
                cur[1],
                (+index + MAX_MERGE_CELL).toString(),
                cur[3],
            ]);
            index += MAX_MERGE_CELL + 1;
        }
        if (index < +cur[2]) {
            arr.push([index.toString(), cur[1], cur[2], cur[3]]);
        }
        smallMergeCell.splice(pos, 0, ...arr);
    }
}

//获取排序字段
export function getSortType(way) {
    return way === "asc"
        ? "sort_asc"
        : way == "desc"
        ? "sort_desc"
        : way == "cancel_sort"
        ? "sort_none"
        : "";
}

//修改列宽
export function changeColWidth(colWidths = [], way) {
    for (let i = 0; i < colWidths.length; i++) {
        if (+colWidths[i] < 2) {
            if (way === "column" && colWidths[i] == 1) {
                colWidths[i] = "1";
            } else {
                colWidths[i] = "0";
            }
        }
        colWidths[i] = Math.ceil(colWidths[i]) + "";
    }
}

//组装行数据
export function buildRowData({ fieldExpCaptionMap, result, coord }) {
    const { row, col } = coord;
    const areas = result.CellsModel.AreaDatas; //area [7hang, 0lie dao, 10hang, 36lie] {hang: 9, lie: 2}
    let rowData = result.CellsModel.DynamicModel[0].cellsArray[row];
    rowData = rowData ? JSON.parse(JSON.stringify(rowData)) : [];

    if (areas.length) {
        for (let i = 0; i < areas.length; i++) {
            let [startRow, startCol, endRow, endCol] = areas[i].area;

            if (
                +startRow <= +row &&
                +endRow >= +row &&
                +startCol <= +col &&
                +endCol >= +col
            ) {
                for (let j = 0; j < areas[i].fldAreas.length; j++) {
                    if (
                        +areas[i].fldAreas[j].fldArea[0][0] <= +row &&
                        +areas[i].fldAreas[j].fldArea[0][2] >= +row
                    ) {
                        areas[i].fldAreas[j].fldDisplay =
                            fieldExpCaptionMap[areas[i].fldAreas[j].fldName];
                        rowData[areas[i].fldAreas[j].fldArea[0][1]].push(
                            areas[i].fldAreas[j]
                        );
                    }
                }
            }
        }
    }
    return rowData;
}

//冻结时修改表格边框线
export function changeTableBorderOnFreeze() {
    let dom = document.querySelector(".ht_clone_left tbody");
    let dom2 = document.querySelector(".ht_clone_top tbody");
    let dom3 = document.querySelector(".ht_clone_top_left_corner table");
    if (dom) dom.classList.remove("render-border");
    if (dom2) dom.classList.remove("render-border");
    if (dom3) {
        dom3.classList.remove("render-top-border");
        dom3.classList.remove("render-left-border");
    }
}

//清空合计计数
export function clearTotalNumber() {
    toggleCalcFun("none");
    document.getElementById("totalSumNum").innerHTML = "";
    document.getElementById("totalCountNum").innerHTML = "";
}

//转化成表格可识别数据
export function formatSortAndFilterColumn({ columns = {}, exId }) {
    let columnMap = {};
    Object.keys(columns).forEach((id) => {
        if (!exId || id === exId) {
            Object.keys(columns[id]).forEach((col) => {
                Object.keys(columns[id][col]).forEach((row) => {
                    columnMap[col] = {
                        ...(columnMap[col] || {}),
                        [row]: columns[id][col][row],
                    };
                });
            });
        }
    });

    return columnMap;
}

//获取全部的排序跟筛选图标列表
export function getAllColumnsIcons(reportID) {
    const { pk_report } = this.commonParams;

    return {
        sortColumns: this.SORT_COLUMNS[reportID || pk_report] || {},
        filterColumns: this.FILTER_COLUMNS[reportID || pk_report] || {},
    };
}

//获取报表排序跟筛选图标列表
export function getSortAndFilterColumn(reportID) {
    const { exId } = getCurrentEXArea.call(this);

    const { sortColumns, filterColumns } = getAllColumnsIcons.call(
        this,
        reportID
    );

    return {
        sortColumns: formatSortAndFilterColumn({
            columns: sortColumns,
            exId,
        }),
        filterColumns: formatSortAndFilterColumn({
            columns: filterColumns,
            exId,
        }),
    };
}

//设置报表排序图标
export function setSortColumn({ reportId, columnMap, positionMap, exId }) {
    const { pk_report } = this.commonParams;

    if (!this.SORT_COLUMNS[reportId || pk_report]) {
        this.SORT_COLUMNS[reportId || pk_report] = {};
    }

    this.SORT_COLUMNS[reportId || pk_report][exId] = columnMap;

    // if (positionMap) this.SORT_COLUMNS[reportId || pk_report].__proto__.columnPositionMap =
    //     positionMap;
}

//设置报表排序图标
export function setFilterColumn({
    reportId,
    columnMap,
    positionMap,
    exId,
    model,
}) {
    const { pk_report } = this.commonParams;

    if (!this.FILTER_COLUMNS[reportId || pk_report]) {
        this.FILTER_COLUMNS[reportId || pk_report] = {};
    }

    this.FILTER_COLUMNS[reportId || pk_report][exId] = columnMap;

    changeEffectAreaIconPosition.call(this, {
        exId,
        model,
    });

    // if (positionMap)
    //     this.FILTER_COLUMNS[reportId || pk_report].__proto__.columnPositionMap =
    //         positionMap;
}

//修改相关联的坐标位置
function changeEffectAreaIconPosition({ exId, model }) {
    const { sortColumns, filterColumns } = getAllColumnsIcons.call(this);

    const oldMap = this.pointMap;
    handlePointMap.call(this, model);
    const newMap = this.pointMap;

    const change = (columns) => {
        const keys = Object.keys(columns);

        //处理已有的筛选条件，如果是多个拓展区筛选，还需要处理其他拓展区的
        keys.forEach((key) => {
            if (key !== exId) {

                const diffRowNum = oldMap[key].area[0] - newMap[key].area[0];

                if (diffRowNum) {
                    //如果其他拓展区row改变了，则对它的icon位置相应修改
                    const currentKeys = Object.keys(columns[key]);
                    currentKeys.forEach((col) => {
                        const iconRows = Object.keys(columns[key][col]);
                        iconRows.forEach((row) => {
                            columns[key] = {
                                ...columns[key],
                                [col]: {
                                    [row - diffRowNum]: columns[key][col][row],
                                },
                            };
                            delete columns[key][col][row];
                        });
                    });
                }
            }
        });
    };

    change(sortColumns);
    change(filterColumns);
}

//清空当前表的排序或者筛选使用过的列
export function clearUsedColumn(reportId) {
    const { pk_report } = this.commonParams;

    this.SORT_COLUMNS[reportId || pk_report] = {};
    this.FILTER_COLUMNS[reportId || pk_report] = {};
}

//获取当前单元格是否是合并单元格，返回当前合并单元格
function getCurrentMergeCell(mergeCells, coord) {
    if (!mergeCells.length) return coord;

    const target = mergeCells.find((mergeCell) => {
        let row1, row2, col1, col2;
        row1 = +mergeCell.row;
        row2 = row1 + +mergeCell.rowspan;
        col1 = +mergeCell.col;
        col2 = col1 + +mergeCell.colspan;
        return (
            coord.row >= row1 &&
            coord.row < row2 &&
            coord.col >= col1 &&
            coord.col < col2
        );
    });

    return target;
}

//获取当前左上单元格
export function getTargetCoordWhenInMergeCell(mergeCells, coord) {
    const mergeCell = getCurrentMergeCell(mergeCells, coord);
    if (!mergeCell) {
        return coord;
    }
    return mergeCell;
}

//刷新侧边栏
export function refreshSiderBar(type) {
    setTimeout(() => {
        this.siderBarInstance && this.siderBarInstance.refreshGraphic(type); //刷新侧边栏
    }, 200);
}

//联查时候的设置产寻去
export function setSearchValueByDrill({ drillConditions = [], search }) {
    for (let i = 0; i < drillConditions.length; i++) {
        const { value, display, field, opertype } = drillConditions[i];
        let itemValue =
            value && value.hasOwnProperty("firstvalue")
                ? value.firstvalue
                : value;
        if (Array.isArray(itemValue)) itemValue = itemValue.join(",");
        search.setSearchValByField(
            SEARCHID,
            field,
            {
                value: itemValue,
                display: display ? display : undefined,
            },
            opertype
        );
    }
}

//根据坐标获取当前拓展区
export function getCurrentEXArea() {
    const { col, row } = getRelCoords.call(this); //动态col
    const target = getTargetArea.call(this, {
        row,
        col,
    });
    return target;
}
