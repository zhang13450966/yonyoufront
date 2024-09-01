import { toast } from "nc-lightapp-front";
import { sortRequest } from "@public/utils/requests";
import { checkTreeData } from "./treeFun";
import {
    tableRender,
    getTargetArea,
    getSortAndFilterColumn,
    setSortColumn,
} from "./methods";
import Utils from "@public/utils";
import { getRealRow } from "./filterFun";
import { setLastColumnPositionMap } from "./changeIconPosition";

const { langCheck } = Utils;

//排序
export async function sortFun(data) {
    let { column, row } = data; //原始col
    const { crossPoint, exId } = getTargetArea.call(this, {
        row,
        col: column,
    });

    if (crossPoint) {
        if (+crossPoint[0].col <= +column && +crossPoint[0].row <= row) {
            toast({
                content: langCheck("reportMultiLang", "100301-000258"),
                color: "warning",
            }); /* 国际化处理： 暂不支持交叉表指标排序！*/

            return;
        }

        //如果是交叉表，且列大于交叉点，则图标只显示在第一个格子上
        if (+column >= +crossPoint[0].col) {
            column = crossPoint[0].col;
        }
    }

    let realRow = getRealRow.call(this, {
        row,
        column,
    });

    let renderData = await sortRequest(data);

    const { sortColumns } = getSortAndFilterColumn.call(this);

    switch (data.sortType) {
        case "sort_none":
            if (sortColumns[column]) {
                const keys = Object.keys(sortColumns[column]);
                if (keys.length > 1) {
                    delete sortColumns[column][realRow];
                } else {
                    if (sortColumns[column][realRow]) {
                        delete sortColumns[column];
                    }
                }
            }

            break;
        case "sort_asc":
            sortColumns[column] = {
                ...(sortColumns[column] || {}),
                [realRow]: "asc",
            };
            break;
        case "sort_desc":
            sortColumns[column] = {
                ...(sortColumns[column] || {}),
                [realRow]: "desc",
            };
            break;
    }
    //setLastColumnPositionMap(this.colSettingsObj, sortColumns); 不使用了

    setSortColumn.call(this, { columnMap: sortColumns, exId });
    checkTreeData.call(this, renderData, true);
    tableRender(this, renderData);
}
