// 输出的excel后缀为xlsx, 为真实的excel文件
import XlsxPopulate from './xlsx-populate-no-encryption.min';
import {getBusinessInfo, getMultiLang} from 'nc-lightapp-front';
import {formatDate} from "./utils";

let businessInfo = getBusinessInfo() || {};
let lang = {};
let defaultTitleStyle = {
    verticalAlignment: 'center',
    horizontalAlignment: 'centerContinuous',
    //bold: true,
};
let defaultHeadStyle = {
    verticalAlignment: 'center',
    horizontalAlignment: 'center',
    wrapText: true,
    bold: true,
    border: true
};
let defaultBodyStyle = {
    border: true,
    verticalAlignment: 'center'
    // shrinkToFit: true
};
let centerColumnStyle = {
    verticalAlignment: 'center',
    horizontalAlignment: 'center'
};
let makerStyle = {
    verticalAlignment: 'center'
};
let rowHeight = 18;
const defaultColor = {'red': 'ff0000'}; // 此插件不支持使用 red, black此形式来表示颜色，此处将颜色转化一下表示形式
const allowStyle = ['color']; //允许添加到表格的样式，很多样式会导致报错
let columnLength = 0;
let array = [], headArr = [], tableHead = [], formArr = [];
let subHead = []; // 多表头的子表
let mergeTime = 0; // 几处多表头 
let headNeedMerge = []; // 记录子表头的位置 [[3, 6], [9, 11]]
let footArray = []; // 社保缴交底部有合计一行
let formLen = 0;
let numformatColumn = [];
let numFormatStyle = [];
let addStylePos = []; //
let cellStyle = [];
let mergeColumnAll = [];
let columnWidth = [], maxWidth = 30; //列宽配置
let centerColumnCode = ['psncode', 'clerkcode', 'psnname'], centerColumn = [];
/**
 * 导出表格为Excel
 * @param tableDom 需要导出的表格dom

 * @param config  一些配置，例：
 * {  title: Excel表格标题,
      fileName: 文件名,
      bodyStyle: {fontColor: "0563c1"},  表题的样式
      headStyle: {fontColor: "ff0000"}   表头标题样式
      form: formDataList 参考险种表单页的输出  formDataList = splitFormData(formData, maxColLen) 
     }
 * @param tableData  表格数据，例：
 * { meta: this.props.meta.getMeta()['list'],  表格Meta数据
     data: this.props.table.getAllTableData('list').rows,  表格数据，到rows一级
     showCheckBox: true // 用于有合计行的占位一列, 空出一列 将 ‘合计’两个字放在第一列
     showIndex: true //是否显示序号}
 */

export default function exportHtmlFunc(tableDom, config = {}, tableData) {
    // 全局变量初始化
    columnLength = 0;
    array = [];
    headArr = [];
    tableHead = [];
    formArr = [];
    subHead = []; // 多表头的子表
    mergeTime = 0; // 几处多表头 
    headNeedMerge = []; // 记录子表头的位置 [[3, 6], [9, 11]]
    footArray = []; // 社保缴交底部有合计一行
    formLen = 0;
    addStylePos = [];  //
    cellStyle = [];
    mergeColumnAll = [];
    numformatColumn = [];
    numFormatStyle = [];
    columnWidth = [];
    getLanguage(() => {
        getFormTem(config);
        getTableTem(tableDom, config, tableData);
        renderXlsx(tableDom, config, tableData);
    })
}

function getLanguage(outCallback) {
    let callback = (json, status, init) => {
        if (status) {
            lang = json;
            outCallback();
        }
    };
    getMultiLang({domainName: 'hrpub', moduleId: 'hrpub', callback});
}

// 拿到form表单中的数据并转化为合适的形式
function getFormTem(config) {
    if (config.form) {
        let formDataList = config.form[0];
        formLen = formDataList[0].length
        formArr = formDataList[0]
    }
}

// 有form表单的时候
function renderForm(sheet, config) {
    if (config.form) {
        formArr.forEach((formitem, formindex) => {
            formitem[0].forEach((item, ind) => {
                let rowNum = formindex + 4
                let cellNum = ind + 1
                sheet.row(rowNum).cell(cellNum).value(item).style(defaultBodyStyle)
            })
        })
    }
}

function getTableTem(tableDom, config, tableData) {
    // 由于有时候加了showCheckBox但是并没有合计行导致第一列空列 所以加个判断
    let footer = config.isFooter !== 'notfooter'&&document.querySelector('.table-next-footer-wrapper .table-next-footer')||null
    if (tableData.showIndex) {
        tableHead[columnLength] = lang['hrpub-000038'];
        centerColumn.push(columnLength);
        columnLength++;
    }
    if (footer && tableData.showCheckBox && !tableData.showIndex) {
        tableHead[columnLength] = ''
        columnLength++;
    }
    if (config.bodyStyle) {
        defaultBodyStyle = Object.assign({}, defaultBodyStyle, config.bodyStyle)
    }
    if (config.headStyle) {
        defaultHeadStyle = Object.assign({}, defaultHeadStyle, config.headStyle)
    }

    if (tableDom) {
        // const tableDomClone = tableDom.cloneNode(true);
        const tableDomClone = tableDom.cloneNode(true);
        let leftFixedFooter = tableDomClone.querySelector('.table-next-footer .fixed-left')

        let tabFooter = document.querySelector('.table-next-footer-wrapper .table-next-footer')
        // let leftFixedFooter = tableDomClone.querySelector('.wui-table-fixed-left .wui-table-tbody')
        if (config.isFooter !== 'notfooter'&&tabFooter/* && tableData.showCheckBox*/) {
            /*let footStrCOntent = tabFooter.innerHTML.replace(/<\/?.+?>/g, " ").replace('- ', '-')
            let footLrftStr = ''
            let str
            if (leftFixedFooter) {
                footLrftStr = leftFixedFooter.innerHTML.replace(/<\/?.+?>/g, " ");
                let strLeft = footLrftStr.replace(/\s+/g, "").replace(/&nbsp;/ig, " ");
                str = footStrCOntent.replace(/\s+/g, " ");
                str = strLeft + str.replace(/&nbsp;/ig, ""); // 将&nbsp替换为空字符串
            } else {
                str = footStrCOntent.replace(/\s+/g, " ");
                str = str.replace(/&nbsp;/ig, ""); // 将&nbsp替换为空字符串
            }

            // 去除前后的空格
            // str = str.trim()
            footArray[0] = str.split(' ')*/
            footArray[0] = [];
            // if (leftFixedFooter) {
            //     leftFixedFooter.querySelectorAll('td').forEach(td => {
            //         footArray[0].push(td.innerText.trim())
            //     })
            // }
            tabFooter.querySelectorAll('td').forEach(td => {
                if (td.classList.contains('blankrow') || td.style.maxWidth === '1px') return;
                footArray[0].push(td.innerText.trim())
            })
            if(leftFixedFooter&&leftFixedFooter.colSpan>0) {
                for(let i = 1;i<leftFixedFooter.colSpan;i++) {
                    footArray[0].splice(2,0,'')
                }
            }

            if (tableData.showCheckBox && tableData.showIndex) {
                footArray[0].splice(1, 1)
            }
            footArray[0].pop()
            
        }
    }

    tableData && tableData.meta.items.forEach((item, index) => {
        let mergeColum = []; // 一次子表的列位置信息
        if (item.visible && item.attrcode !== 'opr' && item.attrcode !== 'numberindex') {
            // 两级表头
            if (item.children) {
                tableHead[columnLength] = item.label
                // 开始的地方
                mergeColum.push(columnLength)
                let sonHead = [];
                item.children.forEach((subitem, subindex) => {
                    if (subitem.scale && subitem.itemtype === "number") {
                        numformatColumn.push(columnLength)
                        numFormatStyle.push(numScaleChange(subitem.scale))
                    }
                    mergeColumnAll.push(columnLength)
                    // item的visible
                    sonHead.push(subitem.label)
                    setColumnWidth(columnLength, subitem.label, undefined, true)
                    if (subindex === item.children.length - 1) {
                        mergeColum.push(columnLength)
                        headNeedMerge[mergeTime] = mergeColum
                        subHead[mergeTime] = sonHead
                        mergeTime++
                    }
                    columnLength++;
                })
            } else {
                if (item.scale && item.itemtype === "number") {
                    numformatColumn.push(columnLength)
                    numFormatStyle.push(numScaleChange(item.scale))
                }
                if (centerColumnCode.includes(item.attrcode)) {
                    centerColumn.push(columnLength);
                }
                tableHead[columnLength] = item.label
                setColumnWidth(columnLength, item.label, undefined, true)
                columnLength++;
            }
        }
    });


    headArr[0] = tableHead;
    let tableMetaItems = tableData.meta.items
    tableMetaItems.forEach((item, index) => {
        if (item.languageMeta && item.languageMeta.length > 0) {
            let index = '';
            index = item.languageMeta[0].index;
            index = Number(index) > 1 ? index : '';
            item.attrcode = item.attrcode + index;
        }
    })
    tableData.data.forEach((itemData, index) => {
        let arr = []
        let dataIndex = 0;
        if (tableData.showIndex) {
            arr[dataIndex] = index + 1
            dataIndex++;
        }
        if (footer && tableData.showCheckBox && !tableData.showIndex) {
            arr[dataIndex] = ''
            dataIndex++;
        }

        tableMetaItems.forEach((item, subindex) => {
            if (item.visible && item.attrcode !== 'opr' && item.attrcode !== 'numberindex') {
                // 如果两级
                if (item.children) {
                    item.children.forEach(subitem => {
                        arr[dataIndex] = getDisplay(subitem, itemData);
                        setColumnWidth(dataIndex, arr[dataIndex], subitem.itemtype, false, item.scale);
                        dataIndex++;
                    })
                } else {
                    arr[dataIndex] = getDisplay(item, itemData)
                    setColumnWidth(dataIndex, arr[dataIndex], item.itemtype, false, item.scale);
                    dataIndex++;
                    getStylePos(config, item, itemData, dataIndex, index)
                }
            }
            array[index] = arr;
        });
    });
}


// 数字scale转换
function numScaleChange(num) {
    let res = '0';
    if (num > 0) {
        res += '.'
    }
    for (let i = 0; i < num; i++) {
        res = res + '0'
    }
    return res
}

function setColumnWidth(index, label = '', type, isHead, scale) {
    if (!label || (label + '').length < 4) return;
    let labelWidth;
    if (type === 'number') {
        labelWidth = (label + '').length + (Number(scale) > 0 ? Number(scale) + 2.6 : 1.6);
    } else {
        if (/^[^\u4e00-\u9fa5]+$/.test(label)) {
            labelWidth = (label + '').length * (1 + (isHead ? 0.2 : 0)) + 1.6;
        } else {
            labelWidth = label.length * (2 + (isHead ? 0.2 : 0)) + 1.6;
        }
    }
    let currentWidth = columnWidth[index] || 0;
    if (labelWidth > currentWidth) {
        columnWidth[index] = Math.min(maxWidth, labelWidth);
    }
}


// 薪资发放中个别调整的数据会有颜色
/**
 *
 * @param {*} config
 * @param {*} item meta中的一个item
 * @param {*} itemData 表格的一行数据
 * @param {*} dataIndex 数据在第几列
 * @param {*} index 数据在第几行
 */
function getStylePos(config, item, itemData, dataIndex, index) {
    if (config.customerRenderItems && config.customerRenderItems.length > 0
        && config.customerRenderItems.includes(item.attrcode)
        && item.render && typeof item.render === 'function') {
        const ele = item.render(undefined, itemData);
        if (ele && ele.props) {
            let eleStyle = {};
            if (ele.props.style) {
                let pos = [];
                for (let key in ele.props.style) {
                    if (ele.props.style.hasOwnProperty(key) && allowStyle.includes(key)) {
                        if (key === 'color') {
                            if (defaultColor[ele.props.style[key]]) {
                                ele.props.style[key] = defaultColor[ele.props.style[key]]
                                let tt = ele.props.style[key];
                                eleStyle['fontColor'] = tt
                            } else {
                                /**
                                 * 貌似不支持rbg(0,0,0)类型的颜色，需要再研究
                                 */
                                eleStyle['fontColor'] = ele.props.style[key].startsWith('#') ?
                                    ele.props.style[key].substr(1) : ele.props.style[key];
                            }
                        } else {
                            eleStyle[key] = ele.props.style[key]
                        }

                    }
                }
                pos.push(dataIndex, index);
                addStylePos.push(pos);// [[列， 行], [], []]
                cellStyle.push(eleStyle)
            }
        }
    }
}

function getDisplay(item, value) {
    if (!value.values[item.attrcode]) return '';
    let displayStr = value.values[item.attrcode].display, displayValue = value.values[item.attrcode].value;
    if (item.itemtype === 'residtxt') {
        displayStr = displayStr ? displayStr : value.values[item.attrcode.replace(/\d+$/, '')].display
        displayValue = displayValue ? displayValue : value.values[item.attrcode.replace(/\d+$/, '')].value
    }
    if (!displayStr && item.options) {
        if (item.itemtype === "checkbox_switch" || item.itemtype === "switch" || item.itemtype === 'radio') {
            displayValue = displayValue ? 'Y' : 'N';
        }
        const option = item.options.find(option => option.value === displayValue);
        if (option) {
            displayStr = option.display;
        }
    }
    if (item.itemtype === 'number') {
        if (displayStr === undefined && displayValue === undefined) {
            return '';
        }
        // displayStr 和 displayValue 都为undefined 时， 输出值为NaN
        // displayStr = item.scale ? Number(displayValue).toFixed(item.scale) : displayValue
        // displayValue = item.scale ? Number(displayValue).toFixed(item.scale) : displayValue

        displayStr = Number(displayValue);
        displayValue = Number(displayValue);
    }
    return isEmpty(displayStr) ? (displayValue || '') : displayStr;
}

function isEmpty(val) {
    return val === null || val === undefined || val === ''
}

/**
 * 表头
 * @param {*} sheet
 * @param {*} tableHeadRow 表头开始行
 */
function renderHead(sheet, tableHeadRow) {

    if (headNeedMerge.length > 0) {  // [[4,8], [10, 13] ]
        tableHead.forEach((i, d) => {
            if (mergeColumnAll.includes(d)) {
                sheet.row(tableHeadRow).cell(d + 1).value(i).style(defaultHeadStyle)
            } else {
                sheet.range(sheet.row(tableHeadRow).cell(d + 1), sheet.row(tableHeadRow + 1).cell(d + 1)).value(i).merged(true).style(defaultHeadStyle)
            }
        })
        headNeedMerge.forEach((MergeItemPos, MergeIndex) => {
            let subHeadData = [];
            subHeadData[0] = subHead[MergeIndex]
            let c = [MergeItemPos[0]] // 子表头开始时的位置
            sheet.range(sheet.row(tableHeadRow).cell(MergeItemPos[0] + 1), sheet.row(tableHeadRow).cell(MergeItemPos[1] + 1)).merged(true).value(tableHead[c]).style(defaultHeadStyle)
            sheet.range(sheet.row(tableHeadRow + 1).cell(MergeItemPos[0] + 1), sheet.row(tableHeadRow + 1).cell(MergeItemPos[1] + 1)).value(subHeadData).style(defaultHeadStyle)
        })
    } else {
        sheet.range(sheet.row(tableHeadRow).cell(1), sheet.row(tableHeadRow).cell(columnLength)).value(headArr).style(defaultHeadStyle);
        //sheet.row(tableHeadRow).height(40)
    }
}

/**
 * 渲染标题
 * @param {*} sheet
 * @param {*} tableBodyRow 表体内容（不带表头）开始的行数
 * @param {*} footerRow  有表尾时的表尾行数  如 底部含有合计行时
 * @param {*} config
 */
function renderTableBody(sheet, tableBodyRow, footerRow, config) {
    array.length > 0 && sheet.cell(`A${tableBodyRow}`).value(array).style(defaultBodyStyle) // 表体
    if (numformatColumn) {
        numformatColumn.forEach((numItem, numIndex) => {
            sheet.column(numItem + 1).style({numberFormat: numFormatStyle[numIndex]})
        })

    }
    // 单独加样式的cell
    if (config.customerRenderItems && config.customerRenderItems.length > 0) {
        addStylePos.forEach((item, index) => {
            let styleRowNum = item[1] + tableBodyRow
            let styleColNum = item[0]
            sheet.row(styleRowNum).cell(styleColNum).style(cellStyle[index])
        })
    }
    if (footArray.length > 0) {
        let resultFoot = footArray[0].map(value => {
            if (!value) return value;
            let temp = Number(value);
            if (typeof temp === 'number' && !isNaN(temp)) {
                return temp
            }
            return value;
        });
        sheet.cell(`A${footerRow}`).value([resultFoot]).style(defaultBodyStyle)
    }
}

function renderMakeInfo(sheet, makeRow) {
    sheet.row(`${makeRow}`).cell(1).value(`${lang['hrpub-000036'] || '制单人'}:`)
    sheet.row(`${makeRow}`).cell(2).value(`${businessInfo.userName || ''}`)
    if (columnLength >= 4) {
        sheet.row(`${makeRow}`).cell(columnLength - 1).value(`${lang['hrpub-000037'] || '制单日期'}:`)
        sheet.row(`${makeRow}`).cell(columnLength).value(`${formatDate(new Date())}`)
    } else {
        sheet.row(`${makeRow}`).cell(3).value(`${lang['hrpub-000037'] || '制单日期'}:`)
        sheet.row(`${makeRow}`).cell(4).value(`${formatDate(new Date())}`)
    }
    sheet.row(`${makeRow}`).style(makerStyle);
}

function renderColumnWidth(sheet) {
    for (let i = 0; i < columnWidth.length; i++) {
        if (!columnWidth[i]) continue;
        sheet.column(i + 1).width(columnWidth[i]);
    }
}

function renderRowHeight(sheet, startRow, endRow) {
    for (let i = startRow; i <= endRow; i++) {
        sheet.row(i).height(rowHeight);
    }
}

function renderCenterColumn(sheet) {
    centerColumn.forEach(column => sheet.column(column + 1).style(centerColumnStyle))
}

function renderXlsx(tableDom, config, tableData) {
    let title = config.title ? config.title : ''
    let fileName = config.fileName ? config.fileName : 'out'
    // 是否有表单数据
    let isForm = formLen > 0 ? formLen + 1 : 0;
    // 是否存在二级表头
    let isMerge = headNeedMerge.length > 0 ? 1 : 0;
    // 是否含有底部数据（如合计行）
    let isTableFoot = footArray ? footArray.length : 0
    // 表头开始行数
    let tableHeadRow = isForm + 3 + 1
    // 表体开始行数
    let tableBodyRow = 3 + headArr.length + isMerge + 1 + isForm // 3指标题及其上下两行共占了3行
    // 底部行
    let footerRow = array.length + 3 + headArr.length + isMerge + 1 + isForm
    // 制单信息行数
    let makeRow = array.length + 3 + headArr.length + isMerge + 2 + isTableFoot + isForm

    XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            let sheet = workbook.sheet(0);
            // 默认都是从第一列开始
            sheet.range(sheet.row(2).cell(1), sheet.row(2).cell(columnLength)).merged(true).value(title).style(defaultTitleStyle); // 标题
            //sheet.row(2).height(rowHeight);
            //sheet.row(2).cell(1).value(title);
            renderForm(sheet, config);// 表单
            renderHead(sheet, tableHeadRow); // 表头
            renderTableBody(sheet, tableBodyRow, footerRow, config); // 表体
            //设置需要居中的列
            //renderCenterColumn(sheet);
            // 制单信息
            renderMakeInfo(sheet, makeRow);
            //设置列宽
            renderColumnWidth(sheet);
            //renderRowHeight(sheet, tableBodyRow, makeRow);
            sheet.range(sheet.row(2).cell(1), sheet.row(2).cell(columnLength)).style(defaultTitleStyle);
            // cell.style(name, value)
            workbook.outputAsync()
                .then(function (blob) {
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        // If IE, you must uses a different method.
                        window.navigator.msSaveOrOpenBlob(blob, `${fileName}.xlsx`);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = `${fileName}.xlsx`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                });
        });
}

