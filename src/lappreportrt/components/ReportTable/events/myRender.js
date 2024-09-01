import Utils from "@public/utils";
const { chkstrlen } = Utils;
import { formatSortAndFilterColumn, getAllColumnsIcons } from "./methods";
//表格渲染器
export default function myRender(
    nstance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
) {
    const { tdStyle, settings, hideTextWhenFreeze, findSelectCells } =
        this.state;
    if (!tdStyle) return;
    const { isShowZero } = this.initParams;

    const { colWidths, fixedColumnsLeft } = settings;
    const isChange = this.viewModelChange;
    const { isFromPreview = false } = this.props.ownReportParams || {};

    let { sortColumns, filterColumns } = getAllColumnsIcons.call(this);
    filterColumns = formatSortAndFilterColumn.call(this, {
        columns: filterColumns,
    });
    sortColumns = formatSortAndFilterColumn.call(this, {
        columns: sortColumns,
    });

    let treeLevelSet = {};
    this.areaDataInfo.length &&
        this.areaDataInfo.forEach((item) => {
            if (item.treeLevelSet) treeLevelSet = item.treeLevelSet;
        });
    const { levelAreaType } = treeLevelSet;

    renderTD({
        td,
        col,
        value,
        row,
        isShowZero,
        hideTextWhenFreeze,
        isFromPreview,
        fixedColumnsLeft,
        sortColumns,
        filterColumns,
        isChange,
        findSelectCells,
        colWidths,
        tdStyle,
        reportDataStartPostion: this.reportDataStartPostion,
        levelAreaType,
    });
}

const TEXT_ALIGN = "text-align";

const VERTICAL_ALIGN = "vertical-align";

const BACKGROUND_IMAGE = "background-image";

const BACKGROUND_POSITION = "background-position";

const BACKGROUND_REPEAT = "background-repeat";

const BACKGROUND_SIZE = "background-size";

const BACKGROUND_COLOR = "background-color";

const FONT_SIZE = "font-size";

const FONT_FAMILY = "font-family";

const PADDING_RIGHT = "padding-right";

const TEXT_INDENT = "text-indent";

let iconCount = 0;

//渲染表格td
export function renderTD({
    td,
    col,
    value,
    row,
    isShowZero, //显示0值
    hideTextWhenFreeze = [], //需要隐藏文字的合并单元格
    isFromPreview = false, //是否是预览态
    fixedColumnsLeft = 0, //冻结列
    sortColumns = {}, //排序列数据
    filterColumns = {}, //筛选列数据
    isChange = false, //是否显隐表头了
    findSelectCells = {}, //符合查找条件的合并单元格
    colWidths = [], //列宽
    tdStyle = {}, //样式
    reportDataStartPostion = 0, //数据区域起始位置
    levelAreaType, //树形参数
}) {
    let isRed = false,
        isTextNode = true,
        styleMap = {};

    const CURRENT_ROW = isChange ? row + +reportDataStartPostion : row;

    //第一列表格渲染左边框，要不然不显示
    if (col === 0)
        styleMap[positionMap.leftLine] = `${
            1 / window.devicePixelRatio
        }px solid #D9D9D9`;

    let textvalue = "",
        copyTextValue = "";

    td.title = ""; //重置title

    if (!value || !value[0]) {
        textvalue = "";
    } else {
        if (isShowZero === false && !isNaN(value[0][0]) && +value[0][0] === 0) {
            textvalue = "";
        } else {
            textvalue = value[0][0];

            //处理大标题的冻结列重复显示问题
            if (hideTextWhenFreeze.length) {
                const target = hideTextWhenFreeze.find(
                    (item) =>
                        +item.row <= row &&
                        +item.col <= col &&
                        +item.endRow >= row &&
                        +item.endCol >= col
                );
                if (target) {
                    textvalue = "";
                }
            }
        }

        //防止代码注入
        if (textvalue.indexOf(">") > -1 && textvalue.indexOf("<") > -1) {
            textvalue = textvalue.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
            isTextNode = false;
        }

        const targetValue = value[0][3];

        //处理设置的条件参数
        if (targetValue && targetValue.cond && targetValue.cond.length) {
            const tdValue = targetValue.cond[0];

            if (tdValue === "redcolor") {
                isRed = true; //显示红色
            }

            if (Array.isArray(tdValue) && tdValue.length) {
                if (tdValue[0] == "I") {
                    //渲染内置图片
                    if (tdValue[2] != "") {
                        const [head, foot] = tdValue[2].split("/");
                        if (head !== "icondef") {
                            tdValue[2] = "icondef/" + (foot || head);
                        }
                        if (!tdValue[2].endsWith(".png")) tdValue[2] += ".png";
                        const image = require(`../../../static/images/${tdValue[2]}`);
                        styleMap[BACKGROUND_IMAGE] = `url(${image})`;
                        styleMap[BACKGROUND_POSITION] = "5px center";
                        styleMap[BACKGROUND_REPEAT] = "no-repeat";
                        styleMap[BACKGROUND_SIZE] = "auto";
                        styleMap[TEXT_INDENT] = "18px";

                    }
                    if (tdValue[3] !== false) {
                        textvalue = "";
                        styleMap[BACKGROUND_POSITION] = "center center";
                    }
                } else if (tdValue[0] == "N") {
                    const currentStyle = tdStyle[tdValue[1]];
                    if (currentStyle) {
                        styleMap[BACKGROUND_COLOR] = currentStyle.font.bgColor;
                        styleMap.color = currentStyle.font.foreColor;
                        styleMap[FONT_SIZE] = currentStyle.font.fontSize + "px";
                    }
                } else if (tdValue[0] == "D") {
                    //渐变色渲染
                    let percent = (tdValue[2] * 100).toFixed(0) + "%";
                    styleMap.background = `linear-gradient(to right, ${tdValue[3]} 0%, white ${percent}, white 100%)`;
                    if (tdValue[4] !== false) {
                        textvalue = "";
                    }
                }
            } else if (tdValue === "P") {
                //线上图片渲染
                styleMap[BACKGROUND_IMAGE] = `url(${targetValue.cond[1]})`;
                styleMap[BACKGROUND_POSITION] = "center center";
                styleMap[BACKGROUND_REPEAT] = "no-repeat";
                styleMap[BACKGROUND_SIZE] = "auto";
                styleMap[TEXT_INDENT] = "18px";
            }
        }

        td.title = textvalue.replace(/&nbsp;/gi, " ");
        textvalue = textvalue.replace(/\n/gi, "<br />");
        copyTextValue = textvalue;

        if (targetValue.nccloud_drillcode && !isFromPreview) {
            //单元格内字体的链接渲染
            td.classList.add("drill-active");
            copyTextValue = `<span data_drillcode=${targetValue.nccloud_drillcode}>${textvalue}</span>`;
            isTextNode = false;
        }

        //缩进展示
        if (
            levelAreaType === "levelTree" &&
            !targetValue.hasOwnProperty("lvl") &&
            targetValue.key_expand_level &&
            targetValue.key_expand_level > 0
        ) {
            if (textvalue.indexOf("&nbsp;") < 0) {
                let count = targetValue.key_expand_level;
                if (count < 0) count = 0;
                let str = new Array(count * 4)
                    .fill("&nbsp;")
                    .join()
                    .replace(/,/gi, "");
                copyTextValue = str + copyTextValue;
            }
        }

        //缩进字符提取,空格字体统一为Arial 为了统一间距
        let empty = "";
        if (targetValue.lvl && levelAreaType === "levelTree") {
            let count = targetValue.lvl;
            if (+count > 0) {
                empty = empty.padEnd(count * 4 * 6, "&nbsp;");
            }
        }

        //渲染展开收起图标
        if (targetValue.isCollapse === false) {
            if (!targetValue.hasChildren) {
                copyTextValue = `<span style="font-family:'Arial'">${empty}</span>${getIsIndirectIcon(
                    targetValue.isIndirect
                )}${copyTextValue}`;
            } else {
                let icon = targetValue.isIndirect
                    ? "icon-xu-shouqi"
                    : "icon-shu_zk";
                copyTextValue = `<span style="font-family:'Arial'">${empty}</span><i data_row='${CURRENT_ROW}' data_col='${col}'  class='iconfont ${icon}'></i>${copyTextValue}`;
            }
            isTextNode = false;
        } else if (targetValue.isCollapse === true) {
            if (!targetValue.hasChildren) {
                copyTextValue = `<span style="font-family:'Arial'">${empty}</span>${getIsIndirectIcon(
                    targetValue.isIndirect
                )}${copyTextValue}`;
            } else {
                let icon = targetValue.isIndirect
                    ? "icon-xu-zhankai"
                    : "icon-shushouqi";
                copyTextValue = `<span style="font-family:'Arial'">${empty}</span><i data_row='${CURRENT_ROW}' data_col='${col}' class='iconfont ${icon}'></i>${copyTextValue}`;
            }
            isTextNode = false;
        }
    }

    if (value && value[0] && value[0][1]) {
        const { font, line = {}, align } = tdStyle[value[0][1]] || {};

        renderLine(styleMap, line, colWidths, col, fixedColumnsLeft);

        if (font) {
            const { bgColor, foreColor, fontSize, fontName, fontStyle } = font;
            styleMap[BACKGROUND_COLOR] = bgColor;
            styleMap.color = foreColor;
            styleMap[FONT_SIZE] = fontSize + "px";
            //问题1：宋体在win处理&nbsp;会显示一个字的空格，做一下兼容处理
            //导致的问题：数字与正常文字显示颜色会不同
            // if (fontName === "宋体" && copyTextValue.indexOf("&nbsp;") > -1) {
            //     styleMap[FONT_FAMILY] = "Arial," + fontName;
            // } else {
            //     styleMap[FONT_FAMILY] = fontName;
            // }

            styleMap[FONT_FAMILY] = fontName;

            if (fontStyle) {
                if (fontStyle == "1") {
                    styleMap["font-weight"] = 900;
                } else if (fontStyle == "2") {
                    styleMap["font-style"] = "italic";
                } else if (fontStyle == "3") {
                    styleMap["font-style"] = "italic";
                    styleMap["font-weight"] = 900;
                }

                // else if (fontStyle == "4") {
                //     styleMap["text-decoration"] = "underline";
                // }
            }

            if (align.hAlign == 2) {
                styleMap[TEXT_ALIGN] = "left";
            } else if (align.hAlign == 0) {
                styleMap[TEXT_ALIGN] = "center";
            } else if (align.hAlign == 4) {
                styleMap[TEXT_ALIGN] = "right";
            } else {
                styleMap[TEXT_ALIGN] = "left";
            }

            if (align.vAlign == 1) {
                styleMap[VERTICAL_ALIGN] = "top";
            } else if (align.vAlign == 3) {
                styleMap[VERTICAL_ALIGN] = "bottom";
            } else if (align.vAlign == 0) {
                styleMap[VERTICAL_ALIGN] = "middle";
            } else {
                styleMap[VERTICAL_ALIGN] = "middle";
            }

            if (align.fontFold == 1) {
                styleMap["white-space"] = "normal";
                styleMap["word-break"] = "break-all";
                styleMap["word-wrap"] = "break-word";
            }

            if (align.shrink == 1) {
                copyTextValue = shrinkText(td, textvalue, copyTextValue);
                isTextNode = false;
            }
        }
    }

    if (isRed) styleMap.color = "red";

    if (sortColumns[col]) {
        //排序图标渲染
        const SORT_ICON = sortColumns[col][CURRENT_ROW];
        if (SORT_ICON) {
            const image = require(`../../../static/images/title/${SORT_ICON}.png`);
            copyTextValue = `${copyTextValue} <img class="sort-or-filter ${SORT_ICON}" src="${image}" />`;
            isTextNode = false;
            iconCount = 1;
        }
    }

    if (filterColumns[col]) {
        //筛选图标渲染
        if (filterColumns[col][CURRENT_ROW]) {
            let SORT_ICON = false;
            if (sortColumns[col]) {
                SORT_ICON = sortColumns[col][CURRENT_ROW];
            }

            const filterClass = SORT_ICON ? "sort-and-filter" : "filter";
            iconCount = SORT_ICON ? 2 : 1;
            const image = require("../../../static/images/title/filter.png");
            copyTextValue = `${copyTextValue} <img class="sort-or-filter ${filterClass}" src="${image}" />`;
            isTextNode = false;
        }
    }

    if (styleMap[TEXT_ALIGN] === "right" && iconCount) {
        styleMap[PADDING_RIGHT] = 17 * iconCount + "px";
    }
    iconCount = 0;

    //先清空单元格再设值
    while (td.hasChildNodes()) {
        td.removeChild(td.firstChild);
    }

    if (
        isTextNode &&
        copyTextValue.indexOf("&nbsp;") < 0 &&
        copyTextValue.indexOf("<br") < 0
    ) {
        if (copyTextValue) {
            td.appendChild(document.createTextNode(copyTextValue));
        }
    } else {
        if (copyTextValue) {
            td.innerHTML = copyTextValue;
        }
    }

    //渲染查找定位的单元格样式
    if (findSelectCells[`${row}_${col}`]) {
        styleMap["background-color"] = "#fdf1bf";
    }

    td.style.cssText = changeStyleMap(styleMap);
}

function changeStyleMap(styleMap) {
    let arr = [];
    Object.keys(styleMap).forEach((key) => {
        arr.push(`${key}:${styleMap[key]}`);
    });
    return arr.join(";");
}

function getIsIndirectIcon(isIndirect) {
    return isIndirect ? `<i class='iconfont icon-xu-kong'></i>` : "";
}

//缩小字体填充
function shrinkText(td, text, copyTextValue) {
    //todo：缩小比例计算还有问题
    const LEN = chkstrlen(text, 1, 0.6);
    const scale = (td.clientWidth - 8) / (LEN * 13); //padding:8px 字号13px
    return `<span style="transform: scale(${Math.min(
        1,
        scale
    )}); transform-origin: 0; display: inline-block">${copyTextValue}</span>`;
}

const positionMap = {
    topLine: "border-top",
    bottomLine: "border-bottom",
    leftLine: "border-left",
    rightLine: "border-right",
};

const positionMap2 = {
    topLine: "top",
    bottomLine: "bottom",
    leftLine: "left",
    rightLine: "right",
};

const positionMap3 = {
    5: "2",
    6: "3",
    7: "4",
};

const positionMap4 = {
    2: "dashed",
    3: "dotted",
    4: "dotted",
};

function renderLine(styleMap, lines, colWidths, col, fixedColumnsLeft = 0) {
    let boxShadow = {},
        flag = false;
    for (const [key, val] of Object.entries(lines)) {
        const borderColor = lines[key][`${positionMap2[key]}Color`];
        if (positionMap[key] && borderColor) {
            const widthKey = lines[key][`${positionMap2[key]}Width`];

            if (widthKey != "0") {
                const borderType = positionMap4[widthKey] || "solid";
                let borderWidth = 1 / window.devicePixelRatio + 0.1 + "px";

                if (widthKey && positionMap3[widthKey]) {
                    borderWidth =
                        positionMap3[widthKey] / window.devicePixelRatio + "px";
                }
                const borderStyle = `${borderWidth} ${borderType} ${borderColor}`;
                if (
                    parseInt(borderWidth) > 1 &&
                    (key === "bottomLine" || key === "topLine")
                ) {
                    flag = true;

                    styleMap[
                        positionMap[key]
                    ] = `1px ${borderType} ${borderColor}`;
                    boxShadow[positionMap[key]] = {
                        borderWidth,
                        borderColor,
                    };
                } else {
                    styleMap[positionMap[key]] = borderStyle;
                }
            }
        }
    }

    if (flag) renderShadow(styleMap, boxShadow);

    if (colWidths[col] < 2) {
        // styleMap.border = "0"; // 解决在125%下  隐藏列边框消失问题  NCC-198917
        styleMap.visibility = "none";
    }
}

function renderShadow(styleMap, boxShadow) {
    let styles = [];
    Object.keys(boxShadow).forEach((key) => {
        const w = parseInt(boxShadow[key].borderWidth) / 2 + "px";
        switch (key) {
            case positionMap.topLine:
                styles = [
                    ...styles,
                    `inset 0px -${w} 0px 0px ${boxShadow[key].borderColor}`,
                ];
                break;
            case positionMap.bottomLine:
                styles = [
                    ...styles,
                    `inset 0px ${w} 0px 0px ${boxShadow[key].borderColor}`,
                ];
                break;
            case positionMap.leftLine:
                styles = [
                    ...styles,
                    `inset -${w} 0px  0px 0px ${boxShadow[key].borderColor}`,
                ];
                break;
            case positionMap.rightLine:
                styles = [
                    ...styles,
                    `inset ${w} 0px 0px 0px ${boxShadow[key].borderColor}`,
                ];
                break;
        }
    });
    styleMap["box-shadow"] = styles.join(",");
}
