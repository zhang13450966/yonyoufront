// 当前行列信息是否在目标行列信息中
export function matchRowAndCol(
    startRow,
    startCol,
    endRow,
    endCol,
    targetRow,
    targetCol
) {
    if (
        Number(targetRow) >= Number(startRow) &&
        Number(targetRow) <= Number(endRow) &&
        Number(targetCol) >= Number(startCol) &&
        Number(targetCol) <= Number(endCol)
    ) {
        return true;
    }
    return false;
}

// 某些区域不可交叉转置 设置disabled字段
export function formatShiftDimSourceAreaData(sourceData, disableData) {
    const sourceDataLength =
        sourceData && Array.isArray(sourceData) && sourceData.length > 0;

    let result = sourceData;
    if (sourceDataLength) {
        result = sourceData.map((item) => {
            const newItem = {
                ...item,
                disabled: disableData && disableData.includes(item.exId),
            };
            return newItem;
        });
    }
    return result;
}
