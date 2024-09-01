import {formatDate} from "./utils";
import $ from 'jquery';
import {getBusinessInfo, getMultiLang} from 'nc-lightapp-front';

let businessInfo = getBusinessInfo() || {};

let idTmr, id = "export-html-excel", ahtml, lang = {}, hasOpr = false;

/**
 * 导出表格为Excel
 * @param tableDom  需要导出的表格dom
 * @param config  一些配置，例：
 * {  title: Excel表格标题,
        fileName: 文件名 }
 * @param tableData  表格数据，例：
 * { meta: this.props.meta.getMeta()['contractList'],  表格Meta数据
     data: this.props.table.getAllTableData('contractList').rows,  表格数据，到rows一级
     showIndex: true //是否显示序号}
 */
export default function exportHtmlFunc(tableDom, config = {}, tableData) {
    getLanguage(() => {
        const tableDomClone = tableDom.cloneNode(true);
        ahtml = document.createElement("a");
        ahtml.setAttribute("href", "#");
        ahtml.setAttribute("id", id);
        ahtml.setAttribute("style", "display:none");
        $(tableDomClone).append(ahtml);
        let tableTemp;
        if (tableData) {
            tableTemp = getHtmlTempFromData(tableData, config, tableDomClone);
        } else {
            tableTemp = getHtmlTemp(tableDomClone, config);
        }
        method1(tableTemp, config);
        tableDomClone.removeChild(ahtml);
    })
}

function getLanguage(outCallback) {
    let callback = (json, status, inlt) => {
        if (status) {
            lang = json;
            outCallback();
        }
    };
    getMultiLang({domainName: 'hrpub', moduleId: 'hrpub', callback});
}

function getHtmlTempFromData(tableData, config, tableDom) {
    let thStr = '', tdStr = '', colLen = 0, thChildrenStr = '';
    if (tableData.showIndex) {
        colLen++;
        thStr += `<th rowspan=2>${lang['hrpub-000038']}</th>`;
    }
    tableData.meta.items.forEach(item => {
        if (item.visible && item.attrcode !== 'opr' && item.attrcode !== 'numberindex') {
            // 两级表头
            if (item.children) {
                thStr += `<th colspan=${item.children.length}>${item.label}</th>`;
                item.children.forEach(item => {
                    thChildrenStr += `<th>${item.label}</th>`
                    colLen++;
                })
            } else {
                colLen++;
                thStr += `<th rowspan=2>${item.label}</th>`;
            }
        }
        if (item.attrcode === 'opr') {
            hasOpr = true;
        }
    });
    let tabFooter = tableDom.querySelector('.u-table-scroll .u-table-footer .u-table-tbody'), tabFooterStr = '';
    if (tabFooter) {
        if (tableData.showCheckBox) {
            colLen++;
            thStr = `<th></th>` + thStr;
        }
        if (hasOpr) {
            tabFooter.querySelector('tr').removeChild(tabFooter.querySelector('tr').lastElementChild);
        }
        tabFooterStr = tabFooter.innerHTML;
    }
    thStr = '<tr>' + thStr + '</tr>' + '<tr>' + thChildrenStr + '</tr>';
    tableData.data.forEach((itemData, index) => {
        tdStr += '<tr>';
        if (tabFooter && tableData.showCheckBox) {
            tdStr += `<td></td>`
        }
        if (tableData.showIndex) {
            tdStr += `<td>${index + 1}</td>`
        }
        tableData.meta.items.forEach(item => {
            if (item.visible && item.attrcode !== 'opr' && item.attrcode !== 'numberindex') {
                // 如果两级
                if (item.children) {
                    item.children.forEach(item => {
                        tdStr += `<td style="${item.itemtype === 'number' ? 'text-align: right' : ''}">${getDisplay(item, itemData)}</td>`;
                    })
                } else {
                    if (config.customerRenderItems && config.customerRenderItems.length > 0
                        && config.customerRenderItems.includes(item.attrcode)
                        && item.render && typeof item.render === 'function') {
                        const ele = item.render(undefined, itemData);
                        if (ele && ele.props) {
                            let eleStyle = '';
                            if (item.itemtype === 'number') {
                                eleStyle = 'text-align: right;'
                            }
                            if (ele.props.style) {
                                for (let key in ele.props.style) {
                                    if (ele.props.style.hasOwnProperty(key)) {
                                        eleStyle += key + ':' + ele.props.style[key] + ';'
                                    }
                                }
                            }
                            tdStr += `<td style="${eleStyle}">${ele.props.children || ''}</td>`;
                            return;
                        }
                    }
                    tdStr += `<td style="${item.itemtype === 'number' ? 'text-align: right' : ''}">${getDisplay(item, itemData)}</td>`;
                }

            }
        });
        tdStr += '</tr>';
    });
    let htmlStr = `<table class="excel-table" style="vnd.ms-excel.numberformat:@"><tr>`;
    if (config.title) {
        htmlStr += `<tr><th class="excel-title" colspan=${colLen}>${config.title}</th></tr><tr></tr>`;
    }
    let footerStr = `<tr></tr><tr class="excel-footer"><td>${lang['hrpub-000036']}:</td><td>${businessInfo.userName || ''}</td>`;
    /* 国际化处理： 制单人*/
    let nums = colLen - 4, emptyTd = '';
    if (nums > 0) emptyTd = '<td></td>'.repeat(nums);
    footerStr += emptyTd + `<td>${lang['hrpub-000037']}:</td><td>${getToday()}</td>`;
    /* 国际化处理： 制表日期*/
    //如果有参数为html,添加到最终的html中
    let html = config.html ? `<tr class="form">${config.html}</tr><tr></tr><tr></tr>` : ``;
    return htmlStr + html + thStr + tdStr + tabFooterStr + footerStr + '</tr></table>';
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
        displayStr = item.scale ? Number(displayValue).toFixed(item.scale) : displayValue
        displayValue = item.scale ? Number(displayValue).toFixed(item.scale) : displayValue
    }
    return displayStr || displayValue || '';
}

function getHtmlTemp(tableDom, config) {
    const headDom = tableDom.querySelector('.u-table-scroll .u-table-thead');
    const th = headDom.children[0];
    //处理表头
    removeOpr(th);
    const colLen = headDom.querySelectorAll('th').length;
    let regStr = `width="\\d*(\\.\\d+)?"|style="[^"]*"`;
    let reg = new RegExp(regStr, 'g')
    let thStr = headDom.innerHTML.replace(reg, '');
    let tr = tableDom.querySelector('.u-table-scroll .u-table-tbody').children;
    //处理表体
    for (let i = 0; i < tr.length; i++) {
        removeOpr(tr[i])
    }
    let tdStr = tableDom.querySelector('.u-table-scroll .u-table-tbody').innerHTML;
    let htmlStr = `<table class="excel-table" style="vnd.ms-excel.numberformat:@"><tr>`;
    if (config.title) {
        htmlStr += `<tr><th class="excel-title" colspan=${colLen}>${config.title}</th></tr><tr></tr>`;
    }
    let tabFooter = tableDom.querySelector('.u-table-scroll .u-table-footer .u-table-tbody'), tabFooterStr = '';
    if (tabFooter) {
        tabFooterStr = tabFooter.innerHTML;
    }
    let footerStr = `<tr></tr><tr class="excel-footer"><td>${config.maker}:</td><td>${businessInfo.userName || ''}</td>`;
    /* 国际化处理： 制单人*/
    let nums = colLen - 4, emptyTd = '';
    if (nums > 0) emptyTd = '<td></td>'.repeat(nums);
    footerStr += emptyTd + `<td>${config.date}:</td><td>${getToday()}</td>`;
    /* 国际化处理： 制表日期*/
    //如果有参数为html,添加到最终的html中
    let html = config.html ? `<tr class="form">${config.html}</tr><tr></tr><tr></tr>` : ``
    return htmlStr + html + thStr + tdStr + tabFooterStr + footerStr + '</tr></table>';
}

//去除自定义列
function removeOpr(dom) {
    if (dom.lastElementChild.innerHTML.includes('opr')) {
        dom.lastElementChild.remove();
        removeOpr(dom)
    }
}

function getToday() {
    return formatDate(new Date())
}

function getExplorer() {
    let explorer = window.navigator.userAgent;
    //ie
    if ('ActiveXObject' in window) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}

function method1(curTbl, config) {//整个表格拷贝到EXCEL中
    if (getExplorer() === 'ie') {
        let oXL = null;
        try {
            oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
        } catch (e) {
            console.error("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对未标记为可安全执行脚本的ActiveX初始化并脚本运行 → 启用，并重启浏览器。");
            return false;
        }
        var oWB = oXL.Workbooks.Add(); //获取workbook对象
        var oSheet = oWB.ActiveSheet;//激活当前sheet
        //激活当前sheet
        let sel = document.body.createTextRange();
        let el = $.parseHTML(curTbl);
        el[0].setAttribute("id", 'ie' + id);
        el[0].setAttribute("style", "display:none");
        $(document.body).append(el[0]);
        sel.moveToElementText(document.getElementById('ie' + id));
        document.body.removeChild(el[0]);
        //sel.moveToElementText(curTbl); //把表格中的内容移到TextRange中
        try {
            sel.select(); //全选TextRange中内容
        } catch (e1) {
            // sel.description
            console.log(el)
        }
        sel.execCommand("Copy");//复制TextRange中内容
        oSheet.Paste();//粘贴到活动的EXCEL中
        oXL.Visible = true; //设置excel可见属性
        let fname = oXL.Application.GetSaveAsFilename(config.fileName + ".xls", "Excel Spreadsheets (*.xls), *.xls");
        oWB.SaveAs(fname);
        oWB.Close();
        oXL.Quit();
    } else {
        tableToExcel(curTbl, config)
    }
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}

/*
    template ： 定义文档的类型，相当于html页面中顶部的<!DOCTYPE> 声明。（个人理解，不确定）
    encodeURIComponent:解码
    unescape() 函数：对通过 escape() 编码的字符串进行解码。
    window.btoa(window.encodeURIComponent(str)):支持汉字进行解码。
    \w ：匹配包括下划线的任何单词字符。等价于’[A-Za-z0-9_]’
    replace()方法：用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
    {(\w+)}：匹配所有 {1个或更多字符} 形式的字符串；此处匹配输出内容是 “worksheet”
    正则中的() ：是为了提取匹配的字符串。表达式中有几个()就有几个相应的匹配字符串。
    讲解(/{(\w+)}/g, function(m, p) { return c[p]; } ：
        /{(\w+)}/g 匹配出所有形式为“{worksheet}”的字符串；
        function参数：  m  正则所匹配到的内容，即“worksheet”；
                        p  正则表达式中分组的内容,即“(\w+)”分组中匹配到的内容，为“worksheet”；
        c ：为object，见下图3
        c[p] : 为“worksheet”

*/
const tableToExcel = (function () {
    let uri = 'data:application/vnd.ms-excel;base64,',
        template = getTemplate(),
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        // 下面这段函数作用是：将template中的变量替换为页面内容ctx获取到的值
        format = function (s, c) {
            return s.replace(new RegExp(`{(\\w+)}`, 'g'),
                function (m, p) {
                    return c[p];
                }
            )
        };
    return function (curTbl, config) {
        // 获取表单的名字和表单查询的内容
        let ctx = {worksheet: config.worksheetName || 'Worksheet', content: curTbl};
        // format()函数：通过格式操作使任意类型的数据转换成一个字符串
        // base64()：进行编码
        /*document.getElementById(id).href = uri + base64(format(template, ctx));
        if (config.fileName) document.getElementById(id).download = config.fileName + ".xls";//自定义文件名
        document.getElementById(id).click();*/
        let dataUrl = uri + base64(format(template, ctx));
        let url = window.URL.createObjectURL(dataURLtoBlob(dataUrl));
        ahtml.href = url;
        if (config.fileName) ahtml.download = config.fileName + ".xls";
        ahtml.click();
        window.URL.revokeObjectURL(url);
    }
})();

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function getTemplate() {
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
xmlns:x="urn:schemas-microsoft-com:office:excel" 
xmlns="http://www.w3.org/TR/REC-html40"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--[if gte mso 9]>
<xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>{worksheet}</x:Name>
                    <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                </x:ExcelWorksheet>
            </x:ExcelWorksheets>
        </x:ExcelWorkbook>
    </xml>
<![endif]-->
<style type="text/css">
   .excel-table th,
   .excel-table td{
        border:  0.5pt solid #000;
    }
    .excel-table .form td {
        border: none;
    }
   .excel-table .excel-title,
   .excel-table .excel-footer td{
        border:  none;
   }
</style>
</head><body>{content}</body></html>`
}
