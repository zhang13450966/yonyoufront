import Utils from "@public/utils";
import { matchRowAndCol } from "./events/shiftdim";
const { langCheck, checkHiddenRowCol, checkHiddenRowCol2 } = Utils;
import { getDrillItemDisabled, getSortAndFilterColumn, getRelCoords } from "./events/methods";

export function buttonList() {
    const { sortAndFilterArea } = this.state;
    return {
        sort: {
            label: langCheck("reportMultiLang", "100301-000111"),
            type: "select",
            children: [
                {
                    label: langCheck("reportMultiLang", "100301-000030"),
                    value: "asc",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000031"),
                    value: "desc",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000032"),
                    value: "cancel_sort",
                },
                // {
                //     label: langCheck("reportMultiLang", "100301-000266"),
                //     value: "onTreeShow",
                //     checkbox: {
                //         disabled: sortAndFilterArea,
                //         isChecked: this.commonParams.treeType,
                //         visible:
                //             this.treeParams.config.isEnable &&
                //             this.treeParams.config.levelAreaType ===
                //                 "levelTree",
                //     },
                // }, 先隐藏功能
            ],
        },
        filter: {
            label: langCheck("reportMultiLang", "100301-000033"),
            value: "filter",
            type: "clickSelect",
            children: [
                {
                    label: langCheck("reportMultiLang", "100301-000034"),
                    value: "cancel_filter",
                },
            ],
        },
        freeze: {
            label: langCheck("reportMultiLang", "100301-000035"),
            type: "select",
            children: [
                {
                    label: langCheck("reportMultiLang", "100301-000022"),
                    value: "lockRow",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000023"),
                    value: "lockColumn",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000024"),
                    value: "lockRowColumn",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000036"),
                    value: "cancel_block",
                },
            ],
        },
    };
}

export function moreList() {
    const dataBtn = this.viewModelChange
        ? {
            label: langCheck("reportMultiLang", "100301-000113"),
            value: "common",
        }
        : {
            label: langCheck("reportMultiLang", "100301-000114"),
            value: "data",
        };
    const toggleRowAndColHeadersDisplay = this.state.settings.rowHeaders
        ? langCheck("reportMultiLang", "100301-000270")
        : langCheck("reportMultiLang", "100301-000271");
    return {
        more: {
            label: langCheck("reportMultiLang", "100301-000112"),
            type: "select",
            children: [
                { ...dataBtn },
                {
                    label: langCheck("reportMultiLang", "100301-000115"),
                    value: "auto",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000116"),
                    value: "row_resize",
                },
                {
                    label: langCheck("reportMultiLang", "100301-000117"),
                    value: "reset",
                },
                // {
                //     label: langCheck("reportMultiLang", "100301-000118"),
                //     value: "column",
                // },
                {
                    label: langCheck("reportMultiLang", "100301-000139"),
                    value: "find",
                    after: "Ctrl+F",
                },
                // {
                //     label: toggleRowAndColHeadersDisplay,
                //     value: "toggleRowColHeaders",
                // },
            ],
        },
    };
}

export function shiftdimAndSearchMenu(props) {
    const { drillRulesList } = props.initParams;
    const { dataViewMenuArr, currentSelectDataViewIndex } = props.state;
    let resultAreaId = "";
    let canShiftdimFlag = false; // 匹配到对应扩展区

    const { row: selectRow, col: selectCol } = getRelCoords.call(props);

    const curAreaDataInfo =
        (props.pageParams &&
            props.pageParams.CellsModel &&
            props.pageParams.CellsModel.AreaDatas) ||
        [];
    const targetArr =
        dataViewMenuArr[currentSelectDataViewIndex] &&
        dataViewMenuArr[currentSelectDataViewIndex].crossareacontentsets;
    curAreaDataInfo.length > 0 &&
        curAreaDataInfo.map(item => {
            if (
                matchRowAndCol(
                    item.area[0],
                    item.area[1],
                    item.area[2],
                    item.area[3],
                    selectRow,
                    selectCol,
                ) &&
                Array.isArray(props.relationAreaPkList) &&
                !props.relationAreaPkList.includes(item.exId)
            ) {
                resultAreaId = item.exId;
            }
            return item;
        });
    Array.isArray(targetArr) &&
        targetArr.length > 0 &&
        targetArr.map(item => {
            // 匹配到对应扩展区
            if (item.areaPk === resultAreaId) {
                canShiftdimFlag = true;
                return item;
            }
        });

    let ret = [];

    if (drillRulesList.length) {
        const { preciseDisabled } = props.state;
        const { disabledDrillColArray } = props.props;
        let { col, row } = props.isClickCoords;
        if (props.viewModelChange) {
            const start = props.reportDataStartPostion;
            row = +row + +start;
        }

        const items = drillRulesList.map(item => {
            const { drillCode, drillName } = item;
            const disabled = getDrillItemDisabled({
                item,
                disabledDrillColArray,
                preciseDisabled,
                coord: { row, col },
            });
            return {
                code: `search:${drillCode}`,
                label: drillName,
                disabled,
            };
        });

        ret = [
            {
                code: "search",
                label: langCheck("reportMultiLang", "100301-000037"),
                submenu: [...items],
            },
        ];
    }

    if (canShiftdimFlag) {
        ret.push({
            code: "shiftdim",
            label: langCheck("reportMultiLang", "dataView-100301-000266"),
        });
    }

    if (ret.length) {
        ret.push({ type: "separator" });
    }

    return ret;
}

export function columnMenu(props) {
    return [
        {
            code: "width",
            label: langCheck("reportMultiLang", "100301-000120"),
            submenu: [
                {
                    code: "auto",
                    label: langCheck("reportMultiLang", "100301-000115"),
                },
                {
                    code: "row_resize",
                    label: langCheck("reportMultiLang", "100301-000116"),
                },
                {
                    code: "reset",
                    label: langCheck("reportMultiLang", "100301-000117"),
                },
            ],
        },
        // {
        //     code: "column",
        //     label: langCheck("reportMultiLang", "100301-000118"),
        // },
        {
            code: "hideColumn",
            label: langCheck("reportMultiLang", "100301-000239"),
            hidden: () => {
                return checkHiddenRowCol.call(props);
            },
        },
        {
            code: "unHide",
            label: langCheck("reportMultiLang", "100301-000240"),
            hidden: () => {
                return !checkHiddenRowCol2.call(props);
            },
        },
        { type: "separator" },
        {
            code: "find",
            label: langCheck("reportMultiLang", "100301-000139"),
            after: "Ctrl+F",
        },
    ];
}

export function freezeAndFilterMenu(props) {
    const { fixedColumnsLeft, fixedRowsTop } = props.state.settings;
    let isHidden = fixedColumnsLeft > 0 || fixedRowsTop > 0 ? false : true;
    const { sortAndFilterArea } = props.state;
    const { col } = props.isClickCoords;
    const { filterColumns } = getSortAndFilterColumn.call(props);

    let filterArea = [
        {
            code: "filter",
            label: langCheck("reportMultiLang", "100301-000033"),
            disabled: sortAndFilterArea,
        },
        {
            code: "cancel_filter",
            label: langCheck("reportMultiLang", "100301-000034"),
            hidden() {
                return sortAndFilterArea || !filterColumns[col];
            },
        },
    ];

    if (props.props.showSortAndFilter === false) filterArea = [];

    return [
        ...filterArea,
        {
            code: "freeze",
            label: langCheck("reportMultiLang", "100301-000035"),
            submenu: [
                {
                    code: "freeze:lockRow",
                    label: langCheck("reportMultiLang", "100301-000022"),
                },
                {
                    code: "freeze:lockColumn",
                    label: langCheck("reportMultiLang", "100301-000023"),
                },
                {
                    code: "freeze:lockRowColumn",
                    label: langCheck("reportMultiLang", "100301-000024"),
                },
                {
                    code: "freeze:cancel_block",
                    label: langCheck("reportMultiLang", "100301-000036"),
                    hidden() {
                        return isHidden;
                    },
                },
            ],
        },
        { type: "separator" },
    ];
}

export function sortMenu(props) {
    if (props.props.showSortAndFilter === false) return [];
    const { sortAndFilterArea } = props.state;
    const { col } = props.isClickCoords;
    let treeShowItem = [{ type: "separator" }];
    const { sortColumns } = getSortAndFilterColumn.call(props);

    // if (
    //     props.treeParams.config.isEnable &&
    //     props.treeParams.config.levelAreaType === "levelTree"
    // ) {
    //     treeShowItem.unshift({
    //         code: "onTreeShow",
    //         label: langCheck("reportMultiLang", "100301-000266"),
    //         type: "checkbox",
    //         disabled: sortAndFilterArea,
    //         isChecked: props.commonParams.treeType,
    //     });
    // } 先隐藏功能
    return [
        {
            code: "asc",
            label: langCheck("reportMultiLang", "100301-000030"),
            disabled: sortAndFilterArea,
        },
        {
            code: "desc",
            label: langCheck("reportMultiLang", "100301-000031"),
            disabled: sortAndFilterArea,
        },
        {
            code: "cancel_sort",
            label: langCheck("reportMultiLang", "100301-000032"),
            hidden() {
                return sortAndFilterArea || !sortColumns[col];
            },
        },
        ...treeShowItem,
    ];
}

export function treeMenu(that) {
    const { isEnable } = that.treeParams.config;
    const { treeType, isListTreeWhenSearch } = that.commonParams;
    if (isListTreeWhenSearch || !isEnable || (isEnable && !treeType)) {
        return [];
    }
    return [
        {
            code: "currentLvl",
            label: langCheck("reportMultiLang", "100301-000241"),
            submenu: [
                {
                    code: "current-tree-unfold_total",
                    label: langCheck("reportMultiLang", "100301-000242"),
                },
                {
                    code: "current-tree-fold_total",
                    label: langCheck("reportMultiLang", "100301-000243"),
                },
                { type: "separator" },
                {
                    code: "current-tree-unfold_1",
                    label:
                        langCheck("reportMultiLang", "100301-000244") +
                        " 1 " +
                        langCheck("reportMultiLang", "100301-000245"),
                },
                {
                    code: "current-tree-unfold_2",
                    label:
                        langCheck("reportMultiLang", "100301-000244") +
                        " 2 " +
                        langCheck("reportMultiLang", "100301-000245"),
                },
                {
                    code: "current-tree-unfold_3",
                    label:
                        langCheck("reportMultiLang", "100301-000244") +
                        " 3 " +
                        langCheck("reportMultiLang", "100301-000245"),
                },
                {
                    code: "current-tree-unfold_many",
                    label:
                        langCheck("reportMultiLang", "100301-000244") +
                        "$$$$" +
                        langCheck("reportMultiLang", "100301-000245"),
                    type: "text",
                },
            ],
        },
        {
            code: "allLvl",
            label: langCheck("reportMultiLang", "100301-000247"),
            submenu: [
                {
                    code: "all-tree-unfold_total",
                    label: langCheck("reportMultiLang", "100301-000242"),
                },
                {
                    code: "all-tree-fold_total",
                    label: langCheck("reportMultiLang", "100301-000243"),
                },
                { type: "separator" },
                {
                    code: "all-tree-unfold_1",
                    label:
                        langCheck("reportMultiLang", "100301-000246") +
                        " 1 " +
                        langCheck("reportMultiLang", "100301-000245"),
                },
                {
                    code: "all-tree-unfold_2",
                    label:
                        langCheck("reportMultiLang", "100301-000246") +
                        " 2 " +
                        langCheck("reportMultiLang", "100301-000245"),
                },
                {
                    code: "all-tree-unfold_3",
                    label:
                        langCheck("reportMultiLang", "100301-000246") +
                        " 3 " +
                        langCheck("reportMultiLang", "100301-000245"),
                },
                {
                    code: "all-tree-unfold_many",
                    label:
                        langCheck("reportMultiLang", "100301-000246") +
                        "$$$$" +
                        langCheck("reportMultiLang", "100301-000245"),
                    type: "text",
                },
            ],
        },
        { type: "separator" },
    ];
}

export function contextConfig(props) {
    return [
        ...sortMenu(props),
        ...freezeAndFilterMenu(props),
        ...shiftdimAndSearchMenu(props),
        ...treeMenu(props),
        ...columnMenu(props),
    ];
}

export const SEARCHID = "light_report";

export const USABLE_BUTTONS = [
    "share",
    "status",
    "history",
    "time",
    "print_setting",
    "bigOutput",
    "print_plugin", //TODO:这块要删掉
];

export function getShareSideboxTitle(key) {
    const map = {
        status: langCheck("reportMultiLang", "100301-000280"), 
        history: langCheck("reportMultiLang", "100301-000122"),
        historyInfo: langCheck("reportMultiLang", "100301-000122"),
    };
    return map[key];
}

export function getExecuteStasus(key) {
    switch (key) {
        case "0":
        case "4":
        case "5":
            return {
                display: langCheck("reportMultiLang", "100301-000073"),
                className: "orange",
            };
        case "1":
        case "3":
        case "6":
        case "8":
        case "1000":
            return {
                display: langCheck("reportMultiLang", "100301-000074"),
                className: "blue",
            };
        case "7":
            return {
                display: langCheck("reportMultiLang", "100301-000076"),
                className: "green",
            };
        case "9":
        case "10001":
            return {
                display: langCheck("reportMultiLang", "100301-000077"),
                className: "red",
            };
    }
}

export const MAX_MERGE_CELL = 200;
