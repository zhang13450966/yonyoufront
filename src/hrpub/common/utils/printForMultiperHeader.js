import {getBusinessInfo} from 'nc-lightapp-front';
import {formatDate} from 'src/hrpub/common/utils/utils'

let businessInfo = getBusinessInfo() || {};
// 可适用于多表头
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
export default function (root, {
    title,
    maker,
    date,
    maxColLen = 6,
    beforeHtml,
    afterHtml,
    beforeAppend
}, tableInfo) {

    let newWin = window.open('');
    let newDoc = newWin.document;

    let tableData = getTableData(root);

    if (tableInfo) {
        // tableData无实际数据 解决sonar检查删除此参数
        tableData = exchangeTableBody(tableInfo);
    }

    let tableDataList = splitTableData(tableData, maxColLen);


    // 允许使用者自由处理最终数据
    if (beforeAppend) {
        tableDataList = beforeAppend(tableDataList);
    }


    // 插入header
    appendHeader(newDoc, title);

    // 添加样式
    appendStyle(newDoc);

    // 插入表格前自定义内容
    beforeHtml && appendCustomerHtml(newDoc, beforeHtml);

    // 添加表格
    tableDataList.forEach((tableData, index) => {
        let className = '';
        if (index === tableDataList.length - 1) {
            className = 'print-last-table';
        }
        // 添加表格
        appendTable(newDoc, tableData, className);
    });

    // 插入表格后自定义内容
    afterHtml && appendCustomerHtml(newDoc, afterHtml);

    // 添加页脚
    appendFooter(newDoc, {
        maker,
        date
    });
    // newWin.open()
    newWin.print();
    newWin.close();
}

// 如果调用的时候传入了表格数据，则留下表头，数据用传入的
function exchangeTableBody(tableInfo) {
    let srcData = tableInfo.data;
    let tmp = tableInfo.tableTmp;
    let tableData = [];
    let visibleCol = [];
    tmp.items.map((item) => {
        if (item.visible) {
            if (item.children) {
                item.children.map((child) => {
                    if (child.visible) {
                        child.parent = {
                            label: item.label,
                            attrcode: item.attrcode
                        };
                        if (tableData[0]) {
                            tableData[0].push(child);
                        } else {
                            tableData[0] = [child];
                        }
                        visibleCol.push(child);
                    }
                })
            } else {
                if (tableData[0]) {
                    tableData[0].push(item);
                } else {
                    tableData[0] = [item];
                }
                visibleCol.push(item);
            }
        }
    });
    if (visibleCol.length < length) {
        let i = length - visibleCol.length;
        while (i > 0) {
            visibleCol.unshift('');
            i--;
        }
    }

    srcData.map((item) => {
        let bodyData = [];
        visibleCol.forEach((col) => {
            if (col) {
                let colData = item.values[col.attrcode];
                if (colData && col.options) {
                    col.options.map((opt) => {
                        if (opt.value === colData.value) {
                            if (Number(col.scale) > 0) {
                                opt.value = opt.value && Number(opt.value).toFixed(Number(col.scale))
                            }
                            colData.display = opt.display;
                        }
                    })
                }
                if (colData) {
                    if (Number(col.scale) > 0) {
                        colData.value = colData.value && Number(colData.value).toFixed(Number(col.scale))
                    }
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

    //tableData.splice(1, 0, head)

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
function splitTableData(tableData, maxColLen = 6) {
    let tableDataList = [];
    // 首先判断一行有几列
    let tableLen = Math.ceil(tableData[0].length / maxColLen);

    let i = 0;

    while (i < tableLen) {
        // 第i个表格数据
        let tempSplitData = [];
        tableData.map((trData, index) => {
            tempSplitData.push(trData.splice(0, maxColLen));
        });
        tableDataList.push(tempSplitData);
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
    // 单位预算和部门预算中的表格使用antd中的
    // let tableContent = root.querySelector('.u-table-content') || root.querySelector('.ant-table-content');

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
function appendStyle(doc) {
    let newStyle = doc.createElement('style');

    newStyle.innerHTML = `
        thead, tfoot, tr, th, td {
            page-break-inside: avoid;
        }
        .print-table {
            border-collapse:collapse;
            border:1px solid #d0d0d0;
            page-break-after: always;
        }
        .print-last-table {
            page-break-after: auto;
        }
        .print-td {
            border: 1px solid #d0d0d0;
            width: 190px;
            text-align: center;
            height: 40px;
            word-break: break-all;
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
        .print-table-head{
            //display: table-header-group;
            font-weight: bold;
        }
    `;

    doc.body.appendChild(newStyle);
}

// 插入table
function appendTable(newDoc, tableData, tableClass) {
    let newTable = newDoc.createElement('table');
    newTable.className = `print-table ${tableClass || ''}`;
    tableData.map((tr, index) => {
        if (index === 0) {
            let newTr = newDoc.createElement('tr');
            newTr.className = 'print-tr print-table-head';
            let subNewTr = newDoc.createElement('tr');
            subNewTr.className = 'print-tr print-table-head';
            let comTd = [];
            tr.map((td, index1) => {
                let newTd = newDoc.createElement('td');
                newTd.className = 'print-td';
                if (!td.parent) {
                    newTd.innerText = td.label;
                    newTd.setAttribute('rowspan', '2');
                    newTd.setAttribute('colspan', '1');
                    newTr.appendChild(newTd);
                } else {
                    let subNewTd = newDoc.createElement('td');
                    subNewTd.className = 'print-td';
                    newTd.innerText = td.parent.label;
                    subNewTd.innerText = td.label;
                    let subTdNum = tr.filter(item => item.parent && item.parent.attrcode === td.parent.attrcode).length;
                    newTd.setAttribute('rowspan', '1');
                    if (!comTd.includes(td.parent.attrcode)) {
                        newTd.setAttribute('colspan', subTdNum);
                        comTd.push(td.parent.attrcode);
                        newTr.appendChild(newTd);
                    }
                    subNewTd.setAttribute('rowspan', '1');
                    subNewTd.setAttribute('colspan', '1');
                    subNewTr.appendChild(subNewTd);
                }
            });
            newTable.appendChild(newTr);
            newTable.appendChild(subNewTr);
        } else {
            let newTr = newDoc.createElement('tr');
            newTr.className = 'print-tr';
            tr.map((td, index1) => {
                let newTd = newDoc.createElement('td');
                newTd.className = 'print-td';
                newTd.innerText = td;
                newTr.appendChild(newTd);
            });
            newTable.appendChild(newTr);
        }
    });

    newDoc.body.appendChild(newTable);
}