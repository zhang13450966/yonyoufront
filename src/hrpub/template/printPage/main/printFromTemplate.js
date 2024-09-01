// 根据meta模板打印

/**
    template: template,
    moduleId: 'budgetYearList',
    data: tableData,
    title: '单位预算',
    maker: '制作者',
    date: '制作日期',
    printType: 'table' ,
    height: 表格高度,
    maxColLen: 每行设置多少列, 默认为8,
 */
export default function(args) {

    let newWin = window.open('../../../../hrpub/template/printPage/main/index.html');

    newWin.printOption = args;

    newWin.businessInfo = window.top.GETBUSINESSINFO();

    newWin.window.onload = function() {
        this.setTimeout(() => {
            newWin.print();
            newWin.close();
        }, 200);
    }
}