import { toast } from "nc-lightapp-front";
import {
    tableRender,
    buttonDisabledFun,
    getSendCoord,
    getTargetArea,
    handlePointMap,
    getSortAndFilterColumn,
    setFilterColumn,
} from "./methods";
import Utils from "@public/utils";
import { checkTreeData } from "./treeFun";
import { filterInfoRequest, filterRequest } from "@public/utils/requests";
import { setLastColumnPositionMap } from "./changeIconPosition";
const { langCheck } = Utils;
/**
 * 筛选
 * @param {*} param 选中单元格的坐标内容
 */
export const getFilterInfo = async function (param) {
    //后台根据行列坐标查询是数值型还是字符型，字符型会返回下拉数据
    let {
        isStatistic,
        filterValues = [],
        filterRealValues = [],
        fieldType,
        fieldName = "",
    } = await filterInfoRequest(param);
    if (isStatistic) {
        return toast({
            content: langCheck("reportMultiLang", "100301-000015"),
            color: "warning",
        }); /* 国际化处理： 您选择的是统计字段，暂不支持筛选。*/
    }
    if (!fieldType) {
        return toast({
            content: langCheck("reportMultiLang", "100301-000289"),
            color: "warning",
        }); /* 国际化处理： 当前区域不支持筛选！*/
    }

    const index = filterRealValues.findIndex((item) => item === "%$S(*@#^)");
    filterRealValues = filterRealValues.filter((_, i) => i !== index);
    filterValues = filterValues.filter((_, i) => i !== index);

    const defaultOptions = filterRealValues.map((item, index) => {
        const dis = filterValues[index];
        const label = item !== null && dis !== item ? `${dis} (${item})` : dis;
        return {
            value: item,
            label,
        };
    });
    //筛选modal选择
    const realRow = getRealRow.call(this, {
        row: param.row,
        column: param.column,
    });

    const { filterColumns } = getSortAndFilterColumn.call(this);

    //!这块后台逻辑变了，不需要了，后续重构一下
    const defaultFilterValues = getFilterValues(
        filterColumns,
        param.column,
        realRow
    );

    const filterList = Array.isArray(defaultFilterValues)
        ? defaultFilterValues
        : [];

    const filterValuesList = defaultOptions.filter((item) =>
        filterList.includes(item.value)
    );

    this.refs.filterModal.setState({
        showModal: true,
        selectData: defaultOptions,
        defaultOptions,
        filterRealValues,
        filterType: fieldType,
        fieldName,
        filterValues: filterList,
        filterValuesList,
        operValues: defaultFilterValues || [
            {
                relationOper: "8",
                firstValue: "",
                secondValue: "",
                betweenFirstRelationOper: "6",
                betweenSecondRelationOper: "7",
            },
        ],
    });
};

function getFilterValues(all, col, row) {
    //后端数据变了。这块不需要了
    //return null;
    return all[col] && all[col][row];
}

// filterModal提交
export const getFilterData = function (numberParams = []) {
    const { pager = {} } = this.state;
    const { condition } = this.pageParams;
    const { row, col } = getSendCoord.call(this);
    let parameter = {
        row,
        column: col,
        pageInfo: {
            pageIndex: (pager.pageIndex && pager.pageIndex.toString()) || "",
            pageSize: (pager.pageSize && pager.pageSize.toString()) || "",
        },
        querycondition: condition,
    };
    // 提交筛选器
    let { operValues, filterValues, filterType, defaultOptions } =
        this.refs.filterModal.state;
    if (filterType === "NUMERIC") {
        //数值
        let data = Object.assign({}, parameter, this.commonParams, {
            operValues: numberParams,
            filterValues,
            filterType,
        });
        if (numberParams.length) {
            setFilterFun.call(this, data, numberParams);
        } else {
            cancelFilter.call(this, { ...data, removeitem: "remove" });
        }
    } else {
        // 字符
        //如果全选，则只传显示全部即可
        let copySelectedValues = filterValues.concat();
        // if (numberParams === true) {
        //传输时如果选择全部，不再传%$S(*@#^)
        //     filterValues = ["%$S(*@#^)"];
        // }
        let data = Object.assign({}, parameter, this.commonParams, {
            filterValues,
            filterType,
        }); // 字符串型
        setFilterFun.call(this, data, copySelectedValues);
    }
};

async function setFilterFun(data, copySelectedValues = []) {
    // 发送请求处理
    const { filterValues, filterType } = data;
    if (filterValues.length < 1 && filterType !== "NUMERIC") {
        data = { ...data, removeitem: "remove" };
    }

    let renderData = await filterRequest(data);

    changeFilterColumns.call(this, data, copySelectedValues, renderData);

    checkTreeData.call(this, renderData, true);
    this.initParams.dataRowNum = renderData.dataRowNum;
    tableRender(this, renderData);
    closeFilterModal.call(this);
    buttonDisabledFun.call(this, this.isClickCoords);
}

/**
 * 取消筛选
 * @param {*}
 */
export const cancelFilter = async function (data) {
    let renderData = await filterRequest(data);

    changeFilterColumns.call(this, data, [], renderData);

    this.isClickShowAllCount = false;
    this.initParams.dataRowNum = renderData.dataRowNum;
    checkTreeData.call(this, renderData);
    tableRender(this, renderData);
};

//关闭模态框
export const closeFilterModal = function () {
    this.refs.filterModal.setState({
        operValues: {
            logicOper: "0",
            firstRelationOper: "",
            secondRelationOper: "",
            firstValue: "",
            secondValue: "",
        },
        filterValues: [],
        showModal: false,
        filterType: null,
    });
};

/**
 * 处理筛选图标显示
 * params：请求参数
 * values：筛选数据
 * model：筛选后的报表数据
 */
function changeFilterColumns(params = {}, values = [], model) {
    let { column, row, removeitem } = params;

    //筛选前的当前区域信息
    const target = getTargetArea.call(this, {
        row,
        col: column,
    });

    const { crossPoint, exId } = target;

    let { filterColumns } = getSortAndFilterColumn.call(this);

    let iconRow = getRealRow.call(this, { row, column });

    if (crossPoint) {
        //交叉表需要单独处理筛选图标
        //icon显示的行位置，如果大于交叉点，则在交叉点的上一位，
        const iconColumns = changeCrossPoint({
            column,
            iconRow,
            values,
            crossPoint,
            removeitem,
            area: model.CellsModel.AreaDatas.find((item) => item.exId === exId)
                .area,
            oldArea: target.area,
            oldColumns: filterColumns,
        });
        setFilterColumn.call(this, { columnMap: iconColumns, exId, model });
    } else {
        if (removeitem) {
            delete filterColumns[column];
        } else {
            filterColumns = {
                ...filterColumns,
                [column]: {
                    [iconRow]: values,
                },
            };
        }
        setFilterColumn.call(this, {
            columnMap: filterColumns,
            exId,
            model,
        });
    }

    //changeIconRowWhenFilter.call(this, model, target);
}

//筛选操作时，因为数据变化导致筛选排序的图标位置变化，
function changeIconRowWhenFilter(model, target) {
    const oldMap = this.pointMap;

    handlePointMap.call(this, model);

    const newMap = this.pointMap;

    const diffNum = target.area[2] - newMap[target.exId].area[2];

    const effectList = getEffectArea(target, oldMap);

    const { sortColumns, filterColumns } = getSortAndFilterColumn.call(this);

    const filterKeys = Object.keys(filterColumns);

    const sortKeys = Object.keys(sortColumns);

    setLastColumnPositionMap(
        this.colSettingsObj,
        changeEffectColums(
            sortColumns,
            JSON.parse(JSON.stringify(effectList)),
            sortKeys,
            diffNum
        )
    );

    setLastColumnPositionMap(
        this.colSettingsObj,
        changeEffectColums(filterColumns, effectList, filterKeys, diffNum)
    );
}

function changeEffectColums(columns, effectList, keys, diffNum) {
    while (effectList.length) {
        const [row, col, endRow, endCol] = effectList.shift();
        keys.forEach((key) => {
            if (+key >= +col && +key <= +endCol) {
                const rowKeys = Object.keys(columns[key]);
                rowKeys.forEach((rowKey) => {
                    if (+rowKey >= +row && +rowKey <= +endRow) {
                        columns[key][rowKey - diffNum] = columns[key][rowKey];
                        delete columns[key][rowKey];
                    }
                });
            }
        });
    }
    return columns;
}

//获取与当前区域筛选时，需要更改的区域
function getEffectArea(cur, all) {
    let ret = [],
        list = Object.values(all).filter((item) => item.area),
        target = cur;
    if (list.length === 1) return ret;

    let minCol = cur.area[1],
        maxCol = cur.area[3],
        curRow = cur.area[0];
    list.sort((a, b) => a.area[0] - b.area[0]);

    while (target) {
        target = list.find(
            (item) =>
                +item.area[0] > +curRow &&
                !(+item.area[3] < +minCol || +item.area[1] > +maxCol)
        );

        if (target) {
            ret.push(target.area);
            minCol = target.area[1];
            maxCol = target.area[3];
            curRow = target.area[0];
        }
    }
    return ret;
}

//获取交叉表筛选的row
export function getRealRow({ row, column, exareaID }) {
    const { crossPoint, area } = getTargetArea.call(this, {
        row,
        col: column,
        exareaID,
    });
    const { mergeCells } = this.state.settings;
    let returnRow = area[0];
    if (!crossPoint) return returnRow;

    let dataStartIndex = this.viewModelChange
        ? +this.reportDataStartPostion
        : 0;

    if (+returnRow <= +crossPoint[0].row) {
        if (
            crossPoint[1] == 1 &&
            +crossPoint[0].col <= +column &&
            +row >= +crossPoint[0].row
        ) {
            //如果只有一个指标，且指标筛选，图标显示在交叉点那一行
            returnRow = crossPoint[0].row;
        } else if (+row >= +crossPoint[0].row) {
            returnRow = crossPoint[0].row - 1;
        }
    }

    const currentMergeCell = mergeCells.find(
        ({ row, col, rowspan }) =>
            column == col &&
            rowspan > 1 &&
            +row + dataStartIndex <= +returnRow &&
            +returnRow < +row + rowspan + dataStartIndex
    );
    //如果是行合并单元格，取左上角格子坐标
    if (currentMergeCell) returnRow = currentMergeCell.row + dataStartIndex;
    return returnRow;
}

/**
 * 处理交叉表筛选功能
 * 筛选返回带数据的map
 */
function changeCrossPoint(params) {
    const cloumns = getCloumns(params);

    return cloumns;
}

//todo纵向拓展的没有处理 directe
function getCloumns(params) {
    const { crossPoint, column } = params;
    const [pos, count, directe] = crossPoint;
    //交叉点左侧的，直接覆盖
    if (+column < pos.col) {
        return getCrossLeftColumns({ ...params, pos, count, directe });
    }

    return getCrossRightColumns({ ...params, pos, count, directe });
}

//处理交叉区左侧数据
function getCrossLeftColumns(params) {
    const { column, iconRow, values, removeitem, oldColumns, area, oldArea } =
        params;
    if (removeitem) {
        delete oldColumns[column];
        return oldColumns;
    }

    const [oldRow, oldCol, oldEndRow, oldEndCol] = oldArea;
    const [newRow, newCol, newEndRow, newEndCol] = area;

    if (+oldEndCol > +newEndCol) {
        //交叉点左侧筛选时，可能数据会变少，要删除变少部分的图标
        Object.keys(oldColumns).forEach((key) => {
            if (+key > +newEndCol && +key <= +oldEndCol) {
                const rowKeys = Object.keys(oldColumns[key]);
                if (rowKeys.length > 1) {
                    rowKeys.forEach((rowKey) => {
                        if (+rowKey >= +newRow && +rowKey <= +newEndRow) {
                            delete oldColumns[key][rowKey];
                        }
                    });
                } else {
                    delete oldColumns[key];
                }
            }
        });
    }
    return {
        ...oldColumns,
        [column]: {
            [iconRow]: values,
        },
    };
}

function getCrossRightColumns(params) {
    const {
        column,
        iconRow,
        values,
        removeitem,
        count,
        pos,
        area,
        oldColumns,
    } = params;
    const [row, col, endRow, endCol] = area;
    let currentNum = +pos.col + ((column - pos.col) % count),
        result = {},
        proNum = 0;

    if (removeitem) {
        while (currentNum <= +endCol) {
            if (oldColumns[currentNum]) {
                //如果当前列有2个及以上的筛选数据，只删除对应行的，只有一列，但是不属于本行不进行删除
                const keys = Object.keys(oldColumns[currentNum]);
                if (keys.length > 1) {
                    delete oldColumns[currentNum][iconRow];
                } else {
                    if (oldColumns[currentNum][iconRow])
                        delete oldColumns[currentNum];
                }
            }
            currentNum += +count;
        }
        return oldColumns;
    }

    while (currentNum <= +endCol) {
        result[currentNum] = {
            //旧的过滤列有，直接覆盖
            ...(oldColumns[currentNum] || {}),
            [iconRow]: values,
        };
        currentNum += +count;
    }

    while (proNum <= +endCol) {
        //旧的有，并且不跟当前的相同，则增加
        if (!result[proNum] && oldColumns[proNum]) {
            result[proNum] = {
                ...oldColumns[proNum],
            };
        }
        proNum += 1;
    }
    return result;
}
