/**
 *根据html页面打印
 *
 * @export
 * @param {*} ele 可以找到table的dom元素 必传
 * @param {string} printInfo 打印的标题 必传
 * @param {number || Object} [separatorRow=8] 一个页面显示多少列，比如3列还是10列//多表头打印情况，需要传入一个对象
 *  beforeCol: 3, //合并列前面有多少个单独的列
 afterCol: 2,//合并列后面有多少个单独的列
 pagesNumber: [7,6,6] //总数为最小的格子数量。需要告诉这个方法该如何划分。否则代码计算的可能会有折行。
 * }
 * @param {string} [rowWidth='190px'] 一列宽为多少
 * @param {string} [fontSize='14px'] 打印字体大小设置
 */
import {getBusinessInfo} from 'nc-lightapp-front';
import {formatDate} from './utils'

let businessInfo = getBusinessInfo() || {};

export default function do_print(ele, printInfo = {}, header = '', separatorRow = 8, rowWidth = '190px', fontSize = '14px') {
    var el = ele.cloneNode(true)
    //如果有，去掉操作列
    var tr = el.querySelector('.u-table-header').querySelector('tr')
    if (tr && tr.lastElementChild.innerHTML.includes('opr')) {
        tr.removeChild(tr.lastElementChild)
        //表格中的操作
        var bodytrs = el.querySelector('.u-table-body').querySelectorAll('tr');
        for (var i = 0, len = bodytrs.length; i < len; i++) {
            bodytrs[i].removeChild(bodytrs[i].lastElementChild)
        }
    }
    el.querySelector('.u-table-header').style.marginBottom = 0;
     el.querySelector('.u-table-header').style.overflow = 'hidden';
    el.querySelector('.u-table-body').style.cssText = '';
    if (el.querySelector('.u-table-footer')) {
        el.querySelector('.u-table-footer').querySelector('.u-table-body').style.cssText = ''
        el.querySelector('.u-table-footer').querySelector('.u-table-fixed-left') &&
            (el.querySelector('.u-table-footer').querySelector('.u-table-fixed-left').querySelector('.u-table-body-inner').style.cssText = '');
        el.querySelector('.u-table-footer').querySelector('.u-table-fixed-right') &&
            (el.querySelector('.u-table-footer').querySelector('.u-table-fixed-right').querySelector('.u-table-body-inner').style.cssText = '') ;
    }
    el.querySelectorAll('table')[0].style.width = '100%';
    el.querySelectorAll('table')[1].style.width = '100%';
    // el.classList.add('print-iframe')
    //分割列
    var cloneNumbers = tr.childNodes.length;
    var numbers = null;
    var totalEle = 0;//分为几个页面打印
    var ths = tr.childNodes;//开始分列
    var footer = document.createElement('div')
    footer.style.cssText = "width: '100%'; marginTop: 10px";
    footer.innerHTML = `
        <div style="float: left">
            <label>${printInfo.maker}:</label> <span>${businessInfo.userName || ''}<span>
        </div>
        <div style="float: right; marginRight: 15px">
            <label>${printInfo.date}:</label> <span>${formatDate(new Date())}<span>
        </div>
        `
    //如果有多表头，则处理表头
    if (typeof separatorRow === 'object') {
        numbers = separatorRow.pagesNumber.length;
        totalEle = new Array(separatorRow.pagesNumber.length);
        var headerTrs = el.querySelector('.u-table-header').querySelectorAll('tr')
        var th = null
        //要给下面的列，前后补上列
        if (headerTrs.length === 2) {
            var firstTr = headerTrs[0];

            for (var k = 0, klen = firstTr.querySelectorAll('.parent-column').length; k < klen; k++) {
                th = document.createElement('th')
                th.style.display = 'none'
                firstTr.insertBefore(th, firstTr.querySelectorAll('.parent-column')[k])
            }
            for (var i = 0; i < separatorRow.beforeCol; i++) {
                var secondTr = headerTrs[1]
                th = document.createElement('th')
                th.style.display = 'none'

                secondTr.insertBefore(th, secondTr.firstChild)
            }
            for (var j = 0; j < separatorRow.afterCol; j++) {
                var secondTr = headerTrs[1]
                th = document.createElement('th')
                th.style.display = 'none'

                secondTr.appendChild(th)
            }
            for (var n = 0; n < numbers; n++) {
                //处理表头
                totalEle[n] = el.cloneNode(true);
                var start = 0
                n === 0 ? start = 0 : start = separatorRow.pagesNumber[n - 1]

                dealHeader(totalEle[n].querySelector('.u-table-header').querySelectorAll('tr')[0], totalEle[n], start, start + separatorRow.pagesNumber[n], rowWidth)
                dealHeader(totalEle[n].querySelector('.u-table-header').querySelectorAll('tr')[1], totalEle[n], start, start + separatorRow.pagesNumber[n], rowWidth)

                //处理表体
                dealBody(totalEle[n], start, start + separatorRow.pagesNumber[n], rowWidth)
                //处理合计行
                if (el.querySelector('.u-table-footer')) {
                    dealTotal(totalEle[n], start, start + separatorRow.pagesNumber[n], rowWidth)
                }
            }
        } else {
            //参数错误
        }
    } else {
        numbers = Math.ceil(cloneNumbers / separatorRow)
        totalEle = new Array(numbers)
        for (var j = 0; j < numbers; j++) {
            //处理表头
            totalEle[j] = el.cloneNode(true);
            dealHeader(totalEle[j].querySelector('.u-table-header').querySelector('tr'), totalEle[j], j * separatorRow, j * separatorRow + separatorRow, rowWidth, separatorRow)
            //处理表体
            dealBody(totalEle[j], j * separatorRow, j * separatorRow + separatorRow, rowWidth, separatorRow)
            //追加制单人
            if (!el.querySelector('.u-table-footer') && j === totalEle.length - 1) {
                totalEle[j].appendChild(footer)
            }
            //处理合计行
            if (el.querySelector('.u-table-footer')) {
                dealTotal(totalEle[j], j * separatorRow, j * separatorRow + separatorRow, rowWidth, cloneNumbers)
                if (j === totalEle.length - 1) {
                    totalEle[j].appendChild(footer)
                }
            }
        }
    }

    //拼接页面
    var htmls = '';
    totalEle.forEach((ele, index) => {
        htmls +=
            `
            <div style="page-break-after: always">
            ${ele.innerHTML}
            </div>
            `
    });

    var iframe = document.createElement('IFRAME');
    var doc = null, head = null;
    // width:100%;height:400px; z-index: 9999 
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;top:0;left: 0;display: none;');
    var newWin = window.open('');
    newWin.document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    // doc.head.appendChild(style)
    doc.write(`
        <title>${printInfo.title}</title>
        <style style="text/css"  media="print">  
            @page { size: landscape; }
            .u-table-thead th, 
            .u-table-body td { 
                font-size: ${fontSize};
                height: 30px;
                border:  0.5pt solid #000;
                word-break: break-word;
            }
             .u-table-body td{
                 border-top: none
            }
            table{
                border-collapse:collapse;
                border:none;
            }    
            .u-table-thead th{
                height: 35px;
                <!--border-bottom: none;  -->
            }  
        </style>
        <div class="print-iframe"> 
            ${header} 
            ${htmls}
        </div>
    `);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    iframe.onload = function (e) {
        document.body.removeChild(iframe);
    };
    newWin.close();

}

/**
 *
 * @param {*} ele 要追加的元素
 * @param {*} start 开始截取
 * @param {*} number 截取多少
 */
function dealHeader(eletr, ele, start, number, rowWidth, separatorRow) {
    // var copytr = ele.querySelector('.u-table-header').querySelector('tr');
    var copytr = eletr;
    var trs = copytr.childNodes;
    var separatorTR = Array.prototype.slice.call(trs, start, number);
    for (var tri = 0, trlength = trs.length; tri < trlength; tri++) {
        copytr.removeChild(trs[0])
    }
    var colgroups = ele.querySelector('colgroup').childNodes;
    if (separatorTR.length < separatorRow) {
        let cloneTH = separatorTR[0].cloneNode(true);
        cloneTH.innerHTML = '';
        cloneTH.innerText = '';
        cloneTH.style.border = 'none';
        separatorTR = separatorTR.concat(new Array(separatorRow - separatorTR.length).fill(cloneTH))
    }
    separatorTR.forEach((element, index) => {
        if (colgroups[index]) colgroups[index].style.cssText = `width:${rowWidth}; min-width:${rowWidth}`;
        if (element.querySelector('div')) element.querySelector('div').style.color = '';
        copytr.appendChild(element)
    });
}

function dealBody(ele, start, number, rowWidth, separatorRow) {
    var tbody = ele.querySelector('.u-table-body');
    tbody.querySelector('tbody').style.textAlign = 'center';
    var separatorBodyTR = tbody.querySelectorAll('tr');//tbody中的tr 行数
    var colfroupbody = tbody.querySelector('colgroup').childNodes;
    colfroupbody.forEach((colbody) => {
        colbody.style.cssText = `width:${rowWidth}; min-width:${rowWidth}`
    });

    separatorBodyTR.forEach(element => {
        var tds = element.childNodes;
        var newTds = element.cloneNode(true).childNodes;
        var newEle = Array.prototype.slice.call(newTds, start, number);
        for (var tdi = 0, tdlength = tds.length; tdi < tdlength; tdi++) {
            element.removeChild(tds[0])
        }
        if (newEle.length < separatorRow) {
            if (newEle[0]) {
                let cloneTD = newEle[0].cloneNode(true);
                cloneTD.innerHTML = '';
                cloneTD.innerText = '';
                cloneTD.style.border = 'none';
                newEle = newEle.concat(new Array(separatorRow - newEle.length).fill(cloneTD))
            }

        }
        newEle.forEach((td, tindex) => {
            element.appendChild(td)
        })
    });
}

function dealTotal(ele, start, number, rowWidth, cloneNumbers) {
    var totalFooter = ele.querySelector('.u-table-footer');
    if (totalFooter && totalFooter.querySelector('.u-table-body')) {
        totalFooter.querySelector('.u-table-header') && totalFooter.querySelector('.u-table-header').remove();
        var footbody = totalFooter.querySelector('.u-table-body');
        var colfroupfoot = footbody.querySelector('colgroup').childNodes;
        var totalTr = footbody.querySelector('tr');
        var totalTds = footbody.querySelector('tr').childNodes;
        var newTotalTds = Array.prototype.slice.call(totalTds, start, Math.min(number, cloneNumbers));
        for (var trf = 0, trflength = totalTds.length; trf < trflength; trf++) {
            totalTr.removeChild(totalTds[0])
        }
        newTotalTds.forEach((colfoot, findex) => {
            colfroupfoot[findex].style.cssText = `width:${rowWidth}; min-width:${rowWidth}`;
            totalTr.appendChild(colfoot)
        })
    }
}
