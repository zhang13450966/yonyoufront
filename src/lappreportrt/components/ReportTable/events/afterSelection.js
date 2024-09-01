import Utils from "@public/utils";
const { outPutTotalNum, repeatArray } = Utils;
import { toggleCalcFun, buttonDisabledFun, clearTotalNumber } from "./methods";
import { clickUnfoldButton } from "./treeFun";

//框选事件
export default function afterSelection(obj, r, c, r2, c2) {
    const coords = { row: r + "", col: c + "" };
    const { getSelectRowData } = this.props;

    //获取选中的格子，可以是不连续的
    let tdSelected = this.getReportInstance().getSelected();
    this.tdSelectedArea = tdSelected[0];

    this.isClickCoords = { ...coords };


    buttonDisabledFun.call(this, coords);

    
    clickUnfoldButton.call(this);
    let row = r,
        row2 = r2,
        col = c,
        col2 = c2;
    if (r > r2) {
        row = r2;
        row2 = r;
    }
    if (c > c2) {
        col = c2;
        col2 = c;
    }
    // 求和计数
    let { settings, result } = this.state;

    this.selectCells = { row, row2, col, col2 };

    //获取多行的选中数据
    if (getSelectRowData) {
        const { cellsArray = [] } = result.CellsModel.DynamicModel[0];
        if (tdSelected.length < 2) {
            getSelectRowData(cellsArray.slice(row, row2 + 1), {
                row,
                endRow: row2,
                col,
                endCol: col2,
            });
        } else {
            let ret = [],
                posArray = [];
            tdSelected.forEach((item) => {
                const { sRow, sCol, eRow, eCol } = getPos(item);
                ret = [...ret, ...cellsArray.slice(sRow, eRow + 1)];
                posArray.push({
                    row: sRow,
                    col: sCol,
                    endRow: eRow,
                    endCol: eCol,
                });
            });
            getSelectRowData(ret, posArray);
        }
    }

    //给合计 计数 设值
    if (document.getElementById("totalSumNum")) {
        let content = getAllCoords(tdSelected);
        if (content.length < 2) {
            clearTotalNumber();
            return;
        }
        let { mergeCells } = settings;

        content = content.filter((item) => {
            const flag = mergeCells.find((mergeCell) => {
                let row1, row2, col1, col2;
                row1 = +mergeCell.row;
                row2 = row1 + +mergeCell.rowspan;
                col1 = +mergeCell.col;
                col2 = col1 + +mergeCell.colspan;
                return (
                    item.row >= row1 &&
                    item.row < row2 &&
                    item.col >= col1 &&
                    item.col < col2 &&
                    !(item.row === row1 && item.col === col1)
                );
            });
            return !flag;
        });

        let sumArr = [];
        content = repeatArray(content, "row", "col");
        content.forEach((item) => {
            sumArr.push(obj.hotInstance.getDataAtCell(item.row, item.col));
        });

        const innerNum = outPutTotalNum(sumArr);

        if (content.length > 1) {
            toggleCalcFun("block");
        } else {
            toggleCalcFun("none");
        }

        document.getElementById("totalSumNum").innerHTML = innerNum;
        document.getElementById("totalCountNum").innerHTML =
            content.length > 1 ? content.length : "";
    }
}

//获取坐标
function getPos(item) {
    return {
        sRow: Math.min(item[0], item[2]),
        sCol: Math.min(item[1], item[3]),
        eRow: Math.max(item[0], item[2]),
        eCol: Math.max(item[1], item[3]),
    };
}

function getAllCoords(list = []) {
    let ret = [];
    list.forEach((item) => {
        const { sRow, sCol, eRow, eCol } = getPos(item);
        if (sRow != eRow || sCol != eCol) {
            for (let i = sRow; i <= eRow; i++) {
                for (let j = sCol; j <= eCol; j++) {
                    ret.push({ row: i, col: j });
                }
            }
        } else {
            ret.push({ row: sRow, col: sCol });
        }
    });
    return ret;
}
