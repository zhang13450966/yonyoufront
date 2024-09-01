//!列设置功能去掉，这里不会执行了
import {
    getSortAndFilterColumn,
    setSortColumn,
    setFilterColumn,
} from "./methods";
//列设置时要对应修改排序筛选的列位置
export function changeSortAndFilterIconPosition() {
    const { sortColumns, filterColumns } = getSortAndFilterColumn.call(this);

    const filterList = Object.keys(filterColumns); //进行过筛选的列
    const sortList = Object.keys(sortColumns);

    const sortObj = getNewCloumns(this.colSettingsObj, sortColumns);

    const filterObj = getNewCloumns(this.colSettingsObj, filterColumns);

    if (sortList.length) {
        const { newIconMap, newPositionMap } = sortObj;
        setSortColumn.call(this, {
            columnMap: newIconMap,
            positionMap: newPositionMap,
        });
    }

    if (filterList.length) {
        const { newIconMap, newPositionMap } = filterObj;

        setFilterColumn.call(this, {
            columnMap: newIconMap,
            positionMap: newPositionMap,
        });
    }
}

function getNewCloumns(colSettingsObj, defaultColumns) {
    const { columnPositionMap } = defaultColumns; //当前与原始坐标映射关系
    let newIconMap = {},
        newPositionMap = {};

    const len = Object.keys(defaultColumns).length;

    if (len) {
        const colPositon = reversePosition(colSettingsObj);

        Object.keys(columnPositionMap).forEach((key) => {
            const { order } = colPositon[key];
            const oldOrder = columnPositionMap[key];
            newPositionMap[key] = order;
            newIconMap[order] = defaultColumns[oldOrder];
        });
    }

    return {
        newIconMap,
        newPositionMap,
    };
}

function reversePosition(oldMap) {
    let newMap = {};

    Object.values(oldMap).forEach((item) => {
        const { originLoc } = item;
        newMap[originLoc] = item;
    });
    return newMap;
}

//获取icon显示的位置
export function getIconColumn(col) {
    if (this.colinfo.configOrNot && this.colinfo.configOrNot === "true") {
        //如果进行设列设置，要进行列转换处理
        const target = Object.values(this.colSettingsObj).find(
            (item) => item.originLoc == col
        );
        return target.order;
    }
    return col;
}

//获取列设置后的列位置
export function setLastColumnPositionMap(colSettingsObj, currentColumns) {
    //记录一份原始位置，根据最后的this.FILTER_COLUMNS生成当前位置跟原始位置的对应，key:原始位置 value: 当前位置
    //当列设置时，遍历这一份原始位置，value更新到当前列设置的位置，且根据value找到this.FILTER_COLUMNS,并重新生成列设置后的map
    const columnSettingsList = Object.keys(colSettingsObj);

    if (columnSettingsList.length) {
        //如果进行了列设置，保留它的原始坐标及当前坐标，以便再次列设置时候使用
        let columnPositionMap = {};
        Object.keys(currentColumns).forEach((key) => {
            const item = colSettingsObj[key];
            if (item) {
                columnPositionMap[item.originLoc] = item.order;
            } else {
                columnPositionMap[key] = key;
            }
        });
        currentColumns.__proto__.columnPositionMap = columnPositionMap;
    }
}
