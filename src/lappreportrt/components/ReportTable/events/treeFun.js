/**
 * 1.保存一份原始完整数据，当查询排序时候进行更新，
 * 2.遍历1的数据，如果展示前2级，则给lvl <= 2的加一个 isShow=true 属性标识，过滤原始数据，展示isShow=true的数据
 * 3.根据hasChildren显示 +- 的图标
 * 4.点击加减号时，遍历1的数据，找到子集，添加 isShow=true 或者 isShow=false，过滤展示
 * 5.右键显示几级，遍历数据，找到lvl <= 选择的几级，添加isShow=true，>选择的级别的isShow=false 然后过滤
 * 注意点：1.返回数据是否以树形结构平铺返回（排序）
 *        2.返回的lvl是否正确，是否有中间丢失的情况
 *        3.hasChildren 是否正确
 *        4.维护的展开收起状态是哪个字段？前端加isShow？
 *        5.筛选后返回的是否是一个树形平铺数据？
 *        6.升降序是否是一个树形平铺数据？
 */


// TODO: 分组折叠代码有些乱，抽空调整一下 by Guo
import { tableRender } from "./";
import { getRelCoords } from "./methods";
//树形设置初始化数据
export function checkTreeData(data, bool) {
    let { CellsModel = {} } = data;
    let { AreaDatas = [], DynamicModel } = CellsModel;
    if (AreaDatas.length) {
        let treeLevelSet = {};
        AreaDatas.forEach((item) => {
            if (item.treeLevelSet) treeLevelSet = item.treeLevelSet
        })

        if (treeLevelSet.isEnable) {
            const currentTreeCol = getCurrentCol(treeLevelSet);
            const mergeCols = getMergeCols(DynamicModel[0].areaCells);
            if (this) {
                this.treeParams.config = treeLevelSet;
                this.treeParams.mergeCols = mergeCols;  // 有合并单元格的列，目前只给tree用。
                this.treeParams.areaCells = DynamicModel[0].areaCells;
                this.treeParams.currentData = DynamicModel[0].cellsArray;
            } else {
                //侧边栏的树形
                DynamicModel[0].siderBarTreeParams = {
                    config: treeLevelSet,
                    mergeCols,
                    areaCells: DynamicModel[0].areaCells,
                    currentData: DynamicModel[0].cellsArray
                };
            }

            const num = (bool || treeLevelSet.initLvl == "0") ? 100 : +treeLevelSet.initLvl; //初始展开层级，是0则全部展开
            const { cellsArray, areaCells } = filterTreeData(
                DynamicModel[0].cellsArray,
                DynamicModel[0].areaCells,
                currentTreeCol,
                num,
                treeLevelSet.levelAreaType
            );
            DynamicModel[0].cellsArray = cellsArray;
            DynamicModel[0].areaCells = areaCells;
        }
    }
}

//获取树形展示列
export function getCurrentCol(params) {
    const {
        fieldNameCol,
        innercodeCol,
        parentcodeCol,
        fieldNameCols,
        levelAreaType,
    } = params;
    if (levelAreaType === "groupFold") return fieldNameCols;
    return fieldNameCol || parentcodeCol || innercodeCol;
}

//获取树形有合并单元格的列
export function getMergeCols(areaCells = []) {
    let array = []
    areaCells.forEach(cells => {
        if (cells && Array.isArray(cells)) {
            if (!array.includes(cells[1])) array.push(cells[1])
            if (!array.includes(cells[3])) array.push(cells[3])
        }

    })
    return array;
}

/**
 * 根据层级过滤数据
 * data 原始数据
 * curCol 在第几列进行数据交互
 * lv 展开到第几级
 */
function filterTreeData(currentData, areaCells, curCol, lv, type) {
    const array = JSON.parse(JSON.stringify(currentData));
    let mergeCells = JSON.parse(JSON.stringify(areaCells));
    if (type === "groupFold") {
        // 根据层级修改原数据的展开收起
        isCollapseByGroup(array, curCol, lv)
        // 1. 展开层级比实际层级高，则原数据返回
        if (+lv > curCol.length)
            return { cellsArray: array, areaCells: areaCells };
        // 2.否则
        // 2.2 找到最后一层的index
        const idx = Math.min(curCol.length, +lv) - 1;
        // 2.3 找到最后一层的所在列
        const curLvCol = curCol[idx];
        let idList = [];
        const ret = array.filter((arr, index) => {
            if (!arr[curLvCol] || !arr[curLvCol][3].id) return true;
            const curId = arr[curLvCol][3].id;
            const nextArr = array[index + 1];
            const nextId =
                (nextArr &&
                    nextArr[curLvCol] &&
                    nextArr[curLvCol][3] &&
                    nextArr[curLvCol][3].id) ||
                null;
            const isHas = idList.includes(curId);
            const totalType = arr[curLvCol][3].totalType;
            let flag =
                totalType === "after" ? !isHas && curId !== nextId : !isHas;
            if (flag) {
                idList.push(curId);
                if (!totalType) {
                    arr.forEach((a, i) => {
                        if (i > curLvCol) arr[i] = null;
                    });
                }
                return true;
            } else {
                areaCells.forEach((cells, idx) => {
                    if (+cells[0] > index) {
                        mergeCells[idx][0] = mergeCells[idx][0] - 1;
                    }
                    if (
                        +mergeCells[idx][2] > +mergeCells[idx][0] &&
                        +cells[2] >= index
                    ) {
                        mergeCells[idx][2] = mergeCells[idx][2] - 1;
                    }
                });
                return false;
            }
        });
        return {
            cellsArray: ret,
            areaCells: mergeCells.filter(
                (cell) => !(+cell[0] === +cell[2] && +cell[1] === +cell[3])
            ),
        };
    } else {
        array.forEach((arr) => {
            if (arr[curCol] && arr[curCol][3].id) {
                if (+arr[curCol][3].lvl < +lv) {
                    arr[curCol][3].isCollapse = false;
                } else if (+arr[curCol][3].lvl >= +lv) {
                    arr[curCol][3].isCollapse = true;
                }
            }
        });
        const ret = array.filter(
            (arr, index) => {
                if (!arr[curCol] ||
                    !arr[curCol][3].id ||
                    (arr[curCol][3].id && +arr[curCol][3].lvl <= +lv)) {
                    return true
                } else {
                    areaCells.forEach((cells, idx) => {
                        if (+cells[0] > index) {
                            mergeCells[idx][0] = mergeCells[idx][0] - 1;
                        }
                        if (
                            +mergeCells[idx][2] > +mergeCells[idx][0] &&
                            +cells[2] >= index
                        ) {
                            mergeCells[idx][2] = mergeCells[idx][2] - 1;
                        }
                    });
                    return false
                }
            }

        );

        return {
            cellsArray: ret, areaCells: mergeCells.filter(
                (cell) => !(+cell[0] === +cell[2] && +cell[1] === +cell[3])
            ),
        };
    }
}

//点击展开收起按钮
export function clickUnfoldButton() {
    const { config } = this.treeParams;
    // console.log("[ this.treeParams ] >", this.treeParams);
    const { isEnable } = config;
    if (!isEnable) return;

    const { which, target = {} } = this.targetEventDOM || {};
    const { className } = target;

    if (which === 3) return;

    const row = target.getAttribute("data_row");
    const col = target.getAttribute("data_col");

    const { result } = this.state;

    const { isCollapse } =
        (result.CellsModel.DynamicModel[0].cellsArray &&
            result.CellsModel.DynamicModel[0].cellsArray[row] &&
            result.CellsModel.DynamicModel[0].cellsArray[row][col] &&
            result.CellsModel.DynamicModel[0].cellsArray[row][col][3]) ||
        {};


    //  展开
    if (isCollapse === true && className === "iconfont icon-shushouqi") {
        toggleHandler.call(this, { row, col }, "open");
    } else if (
        isCollapse === false &&
        className === "iconfont icon-shu_zk"
    ) {
        toggleHandler.call(this, { row, col }, "close");
    }
}

function toggleHandler(coord, type) {
    const { row, col } = coord;
    let { currentData, config, mergeCols } = this.treeParams;
    const { result } = this.state;
    const { fieldNameCol, innercodeCol, parentcodeCol, levelAreaType } = config;
    const curCol = fieldNameCol || innercodeCol || parentcodeCol;
    // 分组
    if (levelAreaType === "groupFold") {
        toggleGroup({
            currentData: JSON.parse(JSON.stringify(currentData)),
            config,
            row,
            col,
            result,
            type,
        });
    }
    // 树
    else {
        toggleTree({
            currentData: JSON.parse(JSON.stringify(currentData)),
            mergeCols,
            row,
            col: curCol,
            result,
            type,
        });
    }
    tableRender(this, result);
}
// 展开收起
export function toggleTree({ currentData, mergeCols, row, col, result, type }) {
    const { id } = result.CellsModel.DynamicModel[0].cellsArray[row][col][3];
    switch (type) {
        case "open":
            const children = currentData.filter(
                (arr) => arr[col] && arr[col][3].pid === id
            );
            result.CellsModel.DynamicModel[0].cellsArray[row][
                col
            ][3].isCollapse = false;

            children.forEach((arr) => (arr[col][3].isCollapse = true));

            result.CellsModel.DynamicModel[0].cellsArray.splice(
                +row + 1,
                0,
                ...children
            );
            // 合并单元格处理
            openMergeCellsByTree(result, row, col, children.length, mergeCols);
            break;
        case "close":
            let ids = [];
            result.CellsModel.DynamicModel[0].cellsArray[row][
                col
            ][3].isCollapse = true;
            result.CellsModel.DynamicModel[0].cellsArray.forEach((arr) => {
                if (
                    arr[col] &&
                    (arr[col][3].pid === id || ids.includes(arr[col][3].pid))
                ) {
                    ids = [...new Set([...ids, arr[col][3].id])];
                }
            });
            result.CellsModel.DynamicModel[0].cellsArray =
                result.CellsModel.DynamicModel[0].cellsArray.filter(
                    (arr) => !arr[col] || !ids.includes(arr[col][3].id)
                );
            // 合并单元格处理
            closeMergeCellsByTree(result, row, col, ids.length, mergeCols)
            break;
    }
}
export function toggleGroup({ currentData, config, row, col, result, type }) {
    const { fieldNameCols } = config;
    const curCol = col;
    const colIndex = fieldNameCols.indexOf(curCol);
    const nextCol = fieldNameCols[colIndex + 1];
    const { id } = result.CellsModel.DynamicModel[0].cellsArray[row][curCol][3];

    switch (type) {
        // 展开
        case "open":
            let ids = [];
            const children = currentData.filter((arr, index) => {
                if (nextCol !== undefined) {
                    if (
                        arr[curCol] &&
                        arr[curCol][3] &&
                        arr[curCol][3].id === id
                    ) {
                        if (!arr[nextCol] || !arr[nextCol][3].id) return true;
                        arr[nextCol][3].isCollapse = false;
                        const curId = arr[nextCol][3].id;
                        const nextArr = currentData[index + 1];
                        const nextRowId =
                            (nextArr &&
                                nextArr[nextCol] &&
                                nextArr[nextCol][3] &&
                                nextArr[nextCol][3].id) ||
                            null;
                        const totalType = arr[nextCol][3].totalType;
                        const isHas = ids.includes(curId);
                        let flag =
                            totalType === "after"
                                ? !isHas && curId !== nextRowId
                                : !isHas;
                        if (flag) {
                            ids.push(curId);
                            if (!totalType) {
                                arr.forEach((a, i) => {
                                    if (i > nextCol) arr[i] = null;
                                });
                            }
                            return true;
                        }
                    }
                    return false;
                } else return arr[curCol] && arr[curCol][3].id === id;
            });
            // 如果存在子节点， 则收起
            if (nextCol !== undefined)
                children.forEach((arr) => {
                    if (arr[nextCol][3] && arr[nextCol][3].id) {
                        arr[nextCol][3].isCollapse = true;
                    }
                });
            // 插入
            result.CellsModel.DynamicModel[0].cellsArray.splice(
                +row,
                1,
                ...children
            );
            fieldNameCols.forEach(c => {
                if (+c <= +col) {
                    result.CellsModel.DynamicModel[0].cellsArray[row][
                        +c
                    ][3].isCollapse = false;
                }
            })

            // 修改合并单元格
            result.CellsModel.DynamicModel[0].areaCells.forEach((cells) => {
                if (+cells[0] > +row) {
                    cells[0] = children.length - 1 + cells[0];
                }
                if (+cells[2] >= +row) {
                    cells[2] = children.length - 1 + cells[2];
                }
            });
            fieldNameCols.forEach(c => {
                if (!isMergeCell(result.CellsModel.DynamicModel[0].areaCells, row, c) && +c <= col && children.length > 0) {
                    result.CellsModel.DynamicModel[0].areaCells.push([
                        +row,
                        +c,
                        +row + children.length - 1,
                        +c,
                    ]);
                }
            })
            break;
        // 收起
        case "close":
            let childrens = result.CellsModel.DynamicModel[0].cellsArray.filter(
                (arr) => arr[col] && arr[col][3] && arr[col][3].id === id
            );
            deleteCloseRowsByGroup(result, row, col, childrens)
            for (let i = 0; i < (+col); i++) {
                if (
                    result.CellsModel.DynamicModel[0].cellsArray[row] &&
                    result.CellsModel.DynamicModel[0].cellsArray[row][i] &&
                    result.CellsModel.DynamicModel[0].cellsArray[row][i][3] &&
                    result.CellsModel.DynamicModel[0].cellsArray[row][i][3].isCollapse !== undefined
                ) {
                    result.CellsModel.DynamicModel[0].cellsArray[row][i][3].isCollapse = false;
                }
            }
            result.CellsModel.DynamicModel[0].cellsArray[row][
                col
            ][3].isCollapse = true;
            closeMergeCellsByGroup(result, row, col, childrens.length)
            break;
    }
}

//右键的展开收起
export function onContextTreeClick(key, num) {
    const { result } = this.state;
    const count = getNum(key, num);
    const { row: clickRow } = this.isClickCoords;
    const coords = getRelCoords.call(this); //动态col
    const { row, col } = coords;

    const currentTreeCol = getCurrentCol(this.treeParams.config);
    const { levelAreaType } = this.treeParams.config;
    if (key.indexOf("all") > -1) {
        //全部内容层级
        const { cellsArray, areaCells } = filterTreeData(
            this.treeParams.currentData,
            this.treeParams.areaCells,
            currentTreeCol,
            count,
            levelAreaType
        );
        result.CellsModel.DynamicModel[0].cellsArray = cellsArray;
        result.CellsModel.DynamicModel[0].areaCells = areaCells;
    } else {
        // 当前内容层级
        if (levelAreaType === "groupFold") {
            // 1. 获取当前选中节点的id
            const cellsArray = result.CellsModel.DynamicModel[0].cellsArray;
            const id =
                cellsArray &&
                cellsArray[row] &&
                cellsArray[row][col] &&
                cellsArray[row][col][3] &&
                cellsArray[row][col][3].id;
            // 1.1 当前节点不存在id，则什么都不做
            if (!id) return;

            // 2. 先收起，后展开
            // 2.1 找到【当前数据下所有子节点】
            const curChildrens = findChildrenByGroup(cellsArray, col, id)
            // 2.2 删除 【当前数据下所有子节点】
            deleteCloseRowsByGroup(result, row, col, curChildrens)
            // 2.3 设置收起图标
            result.CellsModel.DynamicModel[0].cellsArray[row][col][3].isCollapse = true;
            // 2.4 收起之后合并单元格
            closeMergeCellsByGroup(result, row, col, curChildrens.length)

            // 3 展开
            if (key.indexOf("unfold") > -1) {
                // 3.1 找到【全量数据下所有子节点】
                const allChildrens = findChildrenByGroup(this.treeParams.currentData, col, id)
                const curLv = currentTreeCol.indexOf(col) + 1
                const allChildrensByFilter = filterChildrenDataByGroup(allChildrens, currentTreeCol, curLv + count)
                // 3.2 插入 【全量数据下所有子节点】
                result.CellsModel.DynamicModel[0].cellsArray.splice(
                    +row,
                    1,
                    ...allChildrensByFilter
                );
                // 3.3 设置图标
                result.CellsModel.DynamicModel[0].cellsArray[row][col][3].isCollapse = false;
                // 3.4 移动合并单元格
                openMergeCellsByGroup(result, row, col, allChildrensByFilter.length)
                // 3.5 新增合并单元格
                let mergeIds = []
                currentTreeCol.slice(0, curLv + count - 1).forEach(c => {
                    let curId = null
                    let startRow = +row - 1
                    let endRow = +row - 1
                    allChildrensByFilter.forEach(arr => {
                        let rId = arr[c] && arr[c][3].id
                        if (rId !== curId) {
                            if (startRow !== endRow) mergeIds.push([startRow, c, endRow, c])
                            curId = rId
                            startRow = endRow + 1
                            endRow = endRow + 1
                        } else {
                            endRow = endRow + 1
                        }
                    });
                    if ((startRow !== endRow) && curId) mergeIds.push([startRow, c, endRow, c])
                });
                result.CellsModel.DynamicModel[0].areaCells.push(...mergeIds);
            }
        } else {
            const cell =
                result.CellsModel.DynamicModel[0].cellsArray[row][
                currentTreeCol
                ];
            const item = cell && cell[3] || {}
            if (!item.id) return;
            if (count < 1) {
                item.isCollapse = true;
            } else {
                item.isCollapse = false;
            }
            const children = findChildren(
                this.treeParams.currentData,
                currentTreeCol,
                item,
                count,
                result
            );
            if (children && children.length) {
                result.CellsModel.DynamicModel[0].cellsArray.splice(
                    +row + 1,
                    0,
                    ...children
                );
                openMergeCellsByTree(result, row, col, children.length, this.treeParams.mergeCols);
                // result.CellsModel.DynamicModel[0].areaCells.forEach((cells) => {
                //     if (+cells[0] > +row) {
                //         cells[0] = children.length + cells[0];
                //     }
                //     if (+cells[2] >= +row) {
                //         cells[2] = children.length + cells[2];
                //     }
                // });
            }
        }
    }
    tableRender(this, result);
}
/**
 * 判断当前单元格是否为合并单元格
 * @param {*} data
 * @param {*} currentCol
 * @param {*} currentId
 * @returns
 */
function isMergeCell(areaCells, row, col) {
    return areaCells.some(cells => {
        return (cells[0] <= +row &&
            cells[1] <= +col &&
            cells[2] >= +row &&
            cells[3] >= +col)
    })
}
function getMergeCellIdx(areaCells, row, col) {
    let idx = false;
    areaCells.find((cells, index) => {
        idx = (cells[0] <= +row &&
            cells[1] <= +col &&
            cells[2] >= +row &&
            cells[3] >= +col) ? index : idx
    })
    return idx
}
/**
 *
 * @param {*} data 当前遍历数据
 * @param {*} levelCols 层级列数组，例如：[1,2,3] or [1,3,4]
 * @param {*} currentCol 当前点击列
 * @param {*} currentId 当前点击id
 */
function findChildrenByGroup(data, currentCol, currentId) {
    return data.filter(arr => arr[currentCol] && arr[currentCol][3] && arr[currentCol][3].id === currentId)
}

// 根据层级处理数据的展开收起属性
function isCollapseByGroup(array, cols, lv) {
    array.forEach((arr) => {
        cols.forEach((col) => {
            if (arr[col] && arr[col][3].id) {
                if (+arr[col][3].lvl < +lv) {
                    arr[col][3].isCollapse = false;
                } else if (+arr[col][3].lvl >= +lv) {
                    arr[col][3].isCollapse = true;
                }
            }
        });
    });
}

// 1111根据层级处理数据的展开收起属性
function filterChildrenDataByGroup(currentData, curCol, lv) {
    let array = JSON.parse(JSON.stringify(currentData))
    // 2.1 根据层级修改原数据的展开收起
    isCollapseByGroup(array, curCol, lv)
    if (+lv > curCol.length) return array
    // 2.2 找到最后一层的index
    const idx = Math.min(curCol.length, +lv) - 1;
    // 2.3 找到最后一层的所在列
    const curLvCol = curCol[idx];
    let idList = [];
    return array.filter((arr, index) => {
        const curId = arr && arr[curLvCol] && arr[curLvCol][3] && arr[curLvCol][3].id;
        const nextArr = array[index + 1];
        const nextId =
            (nextArr &&
                nextArr[curLvCol] &&
                nextArr[curLvCol][3] &&
                nextArr[curLvCol][3].id) ||
            null;
        const isHas = idList.includes(curId);
        const totalType = arr[curLvCol][3].totalType;
        let flag =
            totalType === "after" ? !isHas && curId !== nextId : !isHas;
        if (flag) {
            idList.push(curId);
            if (!totalType) {
                arr.forEach((a, i) => {
                    if (i > curLvCol) arr[i] = null;
                });
            }
            return true;
        } else {
            return false;
        }
    });
}

// 删除由收起行动作收起的数据
function deleteCloseRowsByGroup(result, row, col, childrens) {
    const totalType =
        childrens &&
        childrens[0] &&
        childrens[0][col] &&
        childrens[0][col][3] &&
        childrens[0][col][3].totalType;
    const length = childrens.length
    switch (totalType) {
        case "before":
            result.CellsModel.DynamicModel[0].cellsArray.splice(
                +row + 1,
                length - 1
            );
            break;
        case "after":
            result.CellsModel.DynamicModel[0].cellsArray.splice(
                +row,
                length - 1
            );
            break;
        default:
            result.CellsModel.DynamicModel[0].cellsArray[row].forEach(
                (c, i) => {
                    if (i > col) result.CellsModel.DynamicModel[0].cellsArray[row][i] = null;
                }
            );
            result.CellsModel.DynamicModel[0].cellsArray.splice(
                +row + 1,
                length - 1
            );
            break;
    }
}

// 展开时合并单元格的处理--分组
function openMergeCellsByGroup(result, row, col, length) {
    result.CellsModel.DynamicModel[0].areaCells.forEach((cells) => {
        if (+cells[0] > +row) {
            cells[0] = length - 1 + cells[0];
        }
        if (+cells[2] >= +row) {
            cells[2] = length - 1 + cells[2];
        }
    });
    result.CellsModel.DynamicModel[0].areaCells.push([
        +row,
        +col,
        +row + length - 1,
        +col,
    ]);
}

// 收起时合并单元格的处理--分组
function closeMergeCellsByGroup(result, row, col, length) {
    result.CellsModel.DynamicModel[0].areaCells.forEach((cells) => {
        // 当前点击行在此合并单元格内
        if (
            +cells[0] >= +row &&
            +cells[2] <= (+row + length - 1) &&
            +cells[1] >= +col &&
            +cells[3] >= +col &&
            (+cells[2] - +cells[0] + 1) <= length
        ) {
            cells[0] = -1
            cells[1] = -1
            cells[2] = -1
            cells[3] = -1
        }
        if (+cells[0] > +row) {
            cells[0] = 1 + +cells[0] - length;
        }
        if (+cells[2] >= +row) {
            cells[2] = 1 + +cells[2] - length;
        }

        if (
            (+cells[0] < 0 || +cells[2] < 0 || +cells[2] === (+row)) &&
            +cells[1] >= +col &&
            +cells[3] >= +col
        ) {
            cells[0] = -1
            cells[1] = -1
            cells[2] = -1
            cells[3] = -1
        }
    });
    result.CellsModel.DynamicModel[0].areaCells =
        result.CellsModel.DynamicModel[0].areaCells.filter(
            (cell) => !(+cell[0] === +cell[2] && +cell[1] === +cell[3])
        );
}

// 展开时合并单元格的处理--树形
function openMergeCellsByTree(result, row, col, length, mergeCols) {
    const areaCells = result.CellsModel.DynamicModel[0].areaCells;
    const data = result.CellsModel.DynamicModel[0].cellsArray;
    // 遍历所有合并单元格，找到展开时下方要下移的单元格
    areaCells.forEach((cells) => {
        if (+cells[0] > +row) {
            cells[0] = length + cells[0];
        }
        if (+cells[2] >= +row) {
            cells[2] = length + cells[2];
        }
    });
    // 判断当前单元格和下一个单元格是否为一样的单元格，是的话
    mergeCols.forEach(c => {
        const idx = getMergeCellIdx(areaCells, row, c)
        if (idx === false && needMerge(data, row, c)) { // 不是合并单元格
            result.CellsModel.DynamicModel[0].areaCells.push([
                +row,
                +c,
                +row + length,
                +c,
            ])
        }
    })
}

// 收起时合并单元格的处理--树形
function closeMergeCellsByTree(result, row, col, length, mergeCols) {
    const areaCells = result.CellsModel.DynamicModel[0].areaCells;
    // 中的合并单元格，只处理cells[2]
    mergeCols.forEach(c => {
        const idx = getMergeCellIdx(areaCells, row, c)
        if (idx !== false) {  // 是合并单元格
            areaCells[idx][2] = areaCells[idx][2] - length
            // 按道理来说不会出现length > (cell[2]-cell[0]+1)
        }
    })
    // 遍历所有合并单元格，找到收起时下方要上移的单元格
    areaCells.forEach((cells) => {
        if (+cells[0] > +row) {
            cells[0] = (+cells[0]) - length;
            cells[2] = (+cells[2]) - length;
        }
    });
    result.CellsModel.DynamicModel[0].areaCells =
        result.CellsModel.DynamicModel[0].areaCells.filter(
            (cell) => !(+cell[0] === +cell[2] && +cell[1] === +cell[3])
        );
}
// 是的需要合并, 仅限树
function needMerge(data, row, col) {
    const cell = (data && data[row] && data[row][col]) || []
    const nextCell = (data && data[+row + 1] && data[+row + 1][col]) || []
    const name = cell[0]
    const nextName = nextCell[0]
    return (name !== undefined) && (name === nextName)
}
// 当前展开时获取children，删除原有的，
function findChildren(data, curCol, item, num = 0, result) {
    const { id, lvl } = item;
    let mergeCells = JSON.parse(JSON.stringify(result.CellsModel.DynamicModel[0].areaCells));
    let ids = [],
        removeIds = [],
        currentEndLvl = lvl,
        endLvl = +lvl + num;

    // 在所有数据中找到子项，即要移除的子项removeIds 和要留的项ids
    data.forEach((arr, index) => {
        if (
            arr[curCol] &&
            (arr[curCol][3].pid === id ||
                removeIds.includes(arr[curCol][3].pid))
        ) {
            if (+arr[curCol][3].lvl <= +endLvl) {
                currentEndLvl = Math.max(currentEndLvl, arr[curCol][3].lvl);
                ids = [...new Set([...ids, arr[curCol][3].id])];
            }
            removeIds = [...new Set([...removeIds, arr[curCol][3].id])];
        }
    });

    // 现有数据里 删掉那些数据
    result.CellsModel.DynamicModel[0].cellsArray =
        result.CellsModel.DynamicModel[0].cellsArray.filter(
            (arr, index) => {
                if (!arr[curCol] || !removeIds.includes(arr[curCol][3].id)) {
                    return true
                } else {
                    result.CellsModel.DynamicModel[0].areaCells.forEach((cells, idx) => {
                        if (+cells[0] > index) {
                            mergeCells[idx][0] = mergeCells[idx][0] - 1;
                        }
                        if (
                            +mergeCells[idx][2] > +mergeCells[idx][0] &&
                            +cells[2] >= index
                        ) {
                            mergeCells[idx][2] = mergeCells[idx][2] - 1;
                        }
                    });
                    return false
                }
            }
        );
    result.CellsModel.DynamicModel[0].areaCells = mergeCells.filter(
        (cell) => !(+cell[0] === +cell[2] && +cell[1] === +cell[3])
    )
    if (num === 0) return []; //如果是全部收起，则不返回子集

    const children = data.filter(
        (arr) => arr[curCol] && ids.includes(arr[curCol][3].id)
    );
    children.forEach((arr, index) => {
        if (+arr[curCol][3].lvl < +currentEndLvl) {
            children[index][curCol][3].isCollapse = false;
        } else {
            children[index][curCol][3].isCollapse = true;
        }
    });
    return children;
}

//获取展开或者收起的层级
function getNum(key, num) {
    if (num) return +num;
    if (key.indexOf("total") > -1) {
        if (key.indexOf("unfold") > -1) return 100;
        if (key === "current-tree-fold_total") return 0;
        return 1;
    }
    return +key.split("_")[1];
}
