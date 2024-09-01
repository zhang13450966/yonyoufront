export default {
    copyPaste: {
        columnsLimit: 99999,
        rowsLimit: 99999,
    },
    outsideClickDeselects: false,
    data: [[]], // 表格数据
    width: "100%",
    stretchH: "last", // 排列方式
    colHeaders: true,
    rowHeaders: true,
    manualColumnResize: true,
    manualRowResize: true,
    //viewportRowRenderingOffset: 20,
    //renderAllRows: true,
    // fixedRowsTop: 0,
    // fixedColumnsLeft: 0,
    minRows: 63, //最大行数
    minCols: 8, //最小列数
    currentRowClassName: "checkedRow",
    currentColClassName: "checkedCol",
    mergeCells: [], // 合并表格
    minSpareCols: 1, //最后永远多一列空白列
    readOnly: true,
    rowHeights: [], //单元格高度数组
    colWidths: [], //单元格宽度数组
};
