import {getBusinessInfo, ajax} from 'nc-lightapp-front';
import {formatDate, getAppPageConfig, snCreateUIDom} from '../utils';
import {appendPrintStyle, getCustomConfig} from './printUtil';
import showConfig from './showConfig';

let businessInfo = getBusinessInfo() || {};
let appInfo = getAppPageConfig();

/**
 *
 * root: 包裹table的dom元素，请不要使用table组件自带的table-scroll啥的
 * para: {
 *  title: 标题
 *  maker: 制作者的多语言文案
 *  date: 制作日期的多语言文案
 *  maxColLen: 每一行最多几列
 *  beforeHtml: 在表格上方的htm字符串
 *  afterHtml: 在表格下方的html字符串
 *  beforeAppend: 允许用户在生成页面前处理表格数据 参数是表格三维数组，需要返回同样的三维数组
 * }
 * tableInfo: { 第三个参数，传入表格的全部数据内容和模版信息，会替换掉从页面获取到的数据
 *     data: [{ 数组
 *         values: {
 *              key: {
 *                  value: 'sss', display: 'ggg'
 *              }
 *          }
 *     }],
 *     tableTmp:  模版里对应的表格信息
 * }
 */

export default async function (...args) {
    const conf = getCustomConfig();
    showConfig({
        ...conf,
        onSure: (config) => print(...args, config)
    })
}

function print(root, {
    title,
    maker,
    date,
    beforeHtml,
    afterHtml,
    beforeAppend,
    afterTable
}, tableInfo, printConf) {


    let newWin = window.open('');
    let newDoc = newWin.document;

    let tableData = getTableData(root);

    if (tableInfo) {
        tableData = exchangeTableBody(tableInfo, tableData);
    }
    let tableDataList = tableData;

    if (printConf.maxCol > 0) {
        tableDataList = splitTableData(tableData, printConf.maxCol);
    } else {
        tableDataList = [tableDataList]
    }

    // 允许使用者自由处理最终数据
    if (beforeAppend) {
        tableDataList = beforeAppend(tableDataList);
    }

    // 插入header
    appendHeader(newDoc, title);

    // 添加样式
    appendStyle(newDoc, printConf);

    // 插入表格前自定义内容
    beforeHtml && appendCustomerHtml(newDoc, beforeHtml);

    // 添加表格
    tableDataList.forEach((tableData, index) => {
        let className = '';
        if (index === tableDataList.length - 1) {
            className = 'print-last-table';
        }
        // 添加表格
        appendTable(newDoc, tableData, className, printConf);
    });

    // 插入表格后自定义内容
    afterHtml && appendCustomerHtml(newDoc, afterHtml);

    // 添加页脚
    appendFooter(newDoc, {
        maker,
        date
    });

    appendPrintStyle(printConf, newDoc);

    if (afterTable && afterTable.data) {
        // 插入header
        let titleNode = newDoc.createElement('h3');
        titleNode.innerText = afterTable.title;
        titleNode.style.textAlign = 'center';
        titleNode.className = 'after-table-title';

        newDoc.body.appendChild(titleNode);
        let footerDiv = newDoc.createElement('div');
        footerDiv.className = 'after-table-bill print-footer';

        footerDiv.innerHTML = `
            <div class="print-maker">
                单据类型:  ${afterTable.billType}
            </div>
            <div class="print-date">
                单据编号:  ${afterTable.billNo}
            </div>
        `;

        newDoc.body.appendChild(footerDiv);
        let afterTableData = [];
        afterTableData = exchangeTableBody(afterTable, afterTableData);
        let afterTableDataList = [afterTableData];
        // 添加表格
        afterTableDataList.forEach((tableData, index) => {
            let className = '';
            if (index === afterTableDataList.length - 1) {
                className = 'print-last-table';
            }
            // 添加表格
            appendTable(newDoc, tableData, className);
        });
    }

    newWin.print();
    newWin.close();
}

// 如果调用的时候传入了表格数据，则留下表头，数据用传入的
function exchangeTableBody(tableInfo, tableData) {
    let srcData = tableInfo.data;
    let tmp = tableInfo.tableTmp;

    tableData.length = 0;
    tableData[0] = [];

    let visibleCol = [];

    tmp.items.map((item) => {
        if (item.visible) {
            if (item.languageMeta && item.languageMeta.length > 0) {
                let index = '';
                index = item.languageMeta[0].index;
                index = Number(index) > 1 ? index : '';
                item.attrcode = item.attrcode + index;
            }

            visibleCol.push(item);
            tableData[0].push(item.label);
        }
    });

    // if(visibleCol.length < tableData[0].length) {
    //     let i = tableData[0].length - visibleCol.length;
    //     while(i > 0) {
    //         visibleCol.unshift('');
    //         i--;
    //     }
    // }

    srcData.map((item) => {
        let bodyData = [];
        visibleCol.forEach((col) => {
            if (col) {
                let colData = item.values[col.attrcode];
                //如果是多语文本
                if (col.itemtype === 'residtxt') {
                    colData = colData ? colData : item.values[col.attrcode.replace(/\d+$/, '')]
                }
                if (col.options) {
                    col.options.map((opt) => {
                        if (opt.value === colData.value) {
                            colData.display = opt.display;
                        }
                    })
                }
                if (colData) {
                    if ('display' in colData) {
                        bodyData.push(colData.display)
                    } else if (colData.value === undefined) {
                        bodyData.push('');
                    } else {
                        bodyData.push(colData.value);
                    }
                } else {
                    bodyData.push('');
                }
            } else {
                bodyData.push('');
            }
        });
        tableData.push(bodyData);
    });

    return tableData
}

// 清除空行
function cleanEmptyTr(tableData) {
    tableData.map((table) => {
        table.map((tr, index) => {
            if (!tr.join('') || tr.join('') === '""') {
                table.splice(index, 1);
            }
        })
    });
}

// 插入自定义内容
function appendCustomerHtml(doc, customerHtml) {
    let oDiv = doc.createElement('div');
    oDiv.innerHTML = customerHtml;
    doc.body.appendChild(oDiv);
}

// 向header里插入东西
function appendHeader(doc, title) {

    let titleNode = doc.createElement('h3');
    titleNode.innerText = title;
    titleNode.style.textAlign = 'center';

    doc.body.appendChild(titleNode);
}

// 插入页脚时间和制表人
function appendFooter(doc, {
    maker,
    date,
}) {

    let footerDiv = doc.createElement('div');
    footerDiv.className = 'print-footer';

    footerDiv.innerHTML = `
        <div class="print-maker">
            ${maker}: ${businessInfo.userName || ''}
        </div>
        <div class="print-date">
            ${date}: ${formatDate(new Date())}
        </div>
    `;

    doc.body.appendChild(footerDiv);
}

// 按照最多列拆分表格数据
function splitTableData(tableData, maxColLen) {
    let tableDataList = [];

    // 首先判断一行有几列
    let tableLen = Math.ceil(tableData[0].length / maxColLen);

    let i = 0;

    while (i < tableLen) {

        // 第i个表格数据
        tableDataList[i] = [];

        tableData.map((trData) => {
            let endIndex = maxColLen
            if (trData.length < maxColLen) {
                endIndex = trData.length;
            }
            let newTr = trData.splice(0, endIndex);
            tableDataList[i].push(newTr);
        });

        i++;
    }

    return tableDataList;
}

// 获取表格数据
function getTableData(root) {
    return [[]];
    /**
     * 平台表格结构变化，不再支持打印页面数据
     */
    // let tableData = [[]];

    // 以下是实验数据
    // let tableContent = root.querySelector('.u-table-content');

    // let nTableWrapperList = [];
    // let nTableData = [[], [], []];

    // Array.prototype.map.call(tableContent.children, (child) => {
    //     let childClassName = child.className

    //     if (childClassName.indexOf('u-table-scroll') >= 0) {
    //         nTableWrapperList[0] = child;
    //     } else if (childClassName.indexOf('u-table-fixed-left') >= 0) {
    //         nTableWrapperList[1] = child;
    //     } else if (childClassName.indexOf('u-table-fixed-right') >= 0) {
    //         nTableWrapperList[2] = child;
    //     }
    // });

    // nTableWrapperList.forEach((item, index) => {
    //     let tableHeader = item.querySelector('.u-table-header');
    //     let tableBody = item.querySelector('.u-table-body') || item.querySelector('.u-table-body-outer');
    //     let tableFooter = item.querySelector('.u-table-footer');

    //     tableHeader && [].map.call(tableHeader.querySelectorAll('table'), (table) => {
    //         nTableData[index] = nTableData[index].concat(mapTable(table));
    //     });
    //     tableBody && [].map.call(tableBody.querySelectorAll('table'), (table) => {
    //         nTableData[index] = nTableData[index].concat(mapTable(table));
    //     });
    //     tableFooter && [].map.call(tableFooter.querySelectorAll('table'), (footer) => {
    //         nTableData[index] = nTableData[index].concat(mapTable(footer));
    //     });
    // });

    // nTableData[1].map((item, trIndex) => {
    //     let start1 = 0;
    //     let start0 = 0;
    //     while (start1 < item.length) {
    //         // item[start1]
    //         nTableData[0][trIndex][start0] = item[start1];
    //         start1++;
    //         start0++;
    //     }
    // });
    // nTableData[2].map((item, trIndex) => {
    //     let start2 = item.length - 1;
    //     let start0 = nTableData[0][trIndex].length - 1;

    //     while (start2 >= 0) {
    //         nTableData[0][trIndex][start0] = item[start2];
    //         start2--;
    //         start0--;
    //     }
    // });
    // tableData = nTableData[0];

    // return tableData;
}

// 搞出table数据 
function mapTable(table) {
    let tableData = [];
    let trList = table.querySelectorAll('tr');

    [].map.call(trList, (tr) => {
        let trData = [];
        let tdList = tr.querySelectorAll('td');
        let thList = tr.querySelectorAll('th');

        [].map.call(tdList, (td) => {
            trData.push(td.innerText);
        });
        [].map.call(thList, (th) => {
            trData.push(th.innerText);
        });
        tableData.push(trData);
    });

    return tableData;
}

// 插入样式
function appendStyle(doc, printConf) {
    let newStyle = doc.createElement('style');

    newStyle.innerHTML = `
        body{
            margin: 0;
            font-size: 16px;
        }
        thead, tfoot, tr, th, td {
            page-break-inside: avoid;
        }
        .print-table {
            border-collapse:collapse;
            border:1px solid #d0d0d0;
            page-break-after: always;
            white-space: nowrap;
            width: 100%;
        }
        .print-last-table {
            page-break-after: auto;
        }
        .print-td {
            border: 1px solid #d0d0d0;
            text-align: center;
            height: 40px;
            word-break: break-all;
            padding: 0 2px;
        }
        .print-footer {
            overflow: hidden;
            width: 100%;
            margin-top: 20px;
        }
        .print-footer .print-maker {
            float: left;
        }
        .print-footer .print-date {
            float: right;
        }
        .after-table-title{
            margin-top: 50px;
        }
        .after-table-bill.print-footer{
            margin: 20px 10%;
            width: 80%;            
        }
        .print-table-head{
            display: table-header-group;
            font-weight: bold;
        }
    `;

    let cumStyle = doc.createElement('style');
    if (printConf.maxChar && printConf.maxChar !== 0) {
        cumStyle.innerHTML = `
            .print-table{
                table-layout: fixed;
            }
            .print-td{
                white-space: normal;
            }
        `
    } else {
        cumStyle.innerHTML = `
            .print-td{
                white-space: nowrap;
                width: 190px;
            }
        `
    }
    doc.body.appendChild(newStyle);
    doc.body.appendChild(cumStyle);
}

// 插入table
function appendTable(newDoc, tableData, tableClass, printConf) {

    let newTable = newDoc.createElement('table');

    newTable.className = `print-table ${tableClass || ''}`;
    let colWidth = {};

    tableData.map((tr, index) => {
        let newTr = newDoc.createElement('tr');
        newTr.className = `print-tr ${index === 0 ? 'print-table-head' : ''}`;

        tr.map((td, index) => {
            let newTd = newDoc.createElement('td');
            newTd.className = 'print-td';

            newTd.innerText = td;
            newTr.appendChild(newTd);
            if (printConf.maxChar && printConf.maxChar !== 0) {
                let tdWidth, max = Number(printConf.maxChar);
                if (/^[^\u4e00-\u9fa5]+$/.test(td)) {
                    if ((td + "").length / 2 > max) {
                        tdWidth = max * 16 + 8 + 4;
                    } else {
                        tdWidth = ((td + "").length / 2) * 16 + 8 + 4;
                    }
                } else {
                    if ((td + "").length > max) {
                        tdWidth = max * 16 + 8 + 4;
                    } else {
                        tdWidth = ((td + "").length) * 16 + 8 + 4;
                    }
                }
                if (!colWidth[index] || colWidth[index] < tdWidth) {
                    colWidth[index] = tdWidth
                }
            }
        });
        newTable.appendChild(newTr);
    });

    if (printConf.maxChar && printConf.maxChar !== 0) {
        let allTd = newTable.querySelectorAll('.print-table-head>td');
        for (let key in colWidth) {
            allTd[key].style.width = colWidth[key] + 'px';
        }
    }
    newDoc.body.appendChild(newTable);
}