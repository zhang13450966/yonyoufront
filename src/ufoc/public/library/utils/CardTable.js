/*
 * @Descripttion: cardTable 子表工具类对象
 * @Author: huanggqk
 * @Date: 2021-07-29 13:32:35
 * @LastEditTime: 2021-11-08 14:25:47
 */
let _CardTable = {
    /**
     * @name: 新增行到表格末尾
     * @param {*} tableArea 子表区域
     */
    addRow: function (tableArea) {
        $appRoot.props.cardTable.addRow(tableArea, -1)
    },
    /**
     * @name: 删行 删除勾选行
     * @param {*} tableArea 子表区域
     * @param {*} rowArr 删除行的数组
     */
    delRow: function (tableArea, rowArr) {
        $appRoot.props.cardTable.delRowsByIndex(tableArea, rowArr, () => { }, true);
    },
    /**
     * @name: 粘贴至此行 粘贴勾选行数据至操作行下方
     * @param {*} tableArea 子表区域
     * @param {*} index 粘贴位置  
     * @param {*} delKeyArr 不复制的key数组  
     * @param {*} checkedRows 勾选行数据 
     */
    pasteRow: function (tableArea, index, delKeyArr = [],checkedRows=[]) {
        if(!checkedRows.length){
            checkedRows = $appRoot.props.cardTable.getCheckedRows(tableArea);
        }
        let recordArr = []
        checkedRows.forEach(it => {
            let data = _.cloneDeep(it.data)
            if(!_.isEmpty(data["values"]['formula']) && !_.isEmpty(data["values"]['formula']['value'])){
                data["values"]['formula']['display'] = data["values"]['formula']['value']
            }
            if(!_.isEmpty(delKeyArr)){
                delKeyArr.forEach(item => {
                    data["values"][item] = {}
                })
            }
            recordArr.push(data)
        });
        $appRoot.props.cardTable.insertRowsAfterIndex(tableArea, recordArr, index-1)
    },
    /**
     * @name: 粘贴至末行 粘贴勾选行数据
     * @param {*} tableArea 子表区域
     * @param {*} delKeyArr 不复制的key数组 
     * @param {*} checkedRows 勾选行数据 
     */
    pasteToLastRow: function (tableArea, delKeyArr = [],checkedRows=[]) {
        //子表最后一行的index
        let lastIndex = _.get($appRoot.props.cardTable.getAllData(tableArea), 'rows.length') - 1
        if(!checkedRows.length){
            checkedRows = $appRoot.props.cardTable.getCheckedRows(tableArea);
        }
        let recordArr = []
        checkedRows.forEach(it => {
            let data = _.cloneDeep(it.data)
            if(!_.isEmpty(data["values"]['formula']) && !_.isEmpty(data["values"]['formula']['value'])){
                data["values"]['formula']['display'] = data["values"]['formula']['value']
            }
            if(!_.isEmpty(delKeyArr)){
                delKeyArr.forEach(item => {
                    data["values"][item] = {}
                })
            }
            recordArr.push(data)
        });
        $appRoot.props.cardTable.insertRowsAfterIndex(tableArea, recordArr, lastIndex)
    },
    /**
     * 复制行没有具体操作，只是弹出提示，控制按钮状态，各节点自行弹出
     */
    copyRow: function () {

    },
    /**
      * @name: 插行  向上插入
      * @param {*} tableArea 子表区域
      * @param {*} selectRowIndex 插入行的index 
      */
    insertRow: function (tableArea, selectRowIndex) {
        $appRoot.props.cardTable.addRow(tableArea, selectRowIndex, true)
    },
    /**
     * @name: 上移
     * @param {*} tableArea 子表区域
     * @param {*} moveIndex 移动行的位置
     */
    upRow: function (tableArea, moveIndex) {
        if (moveIndex < 1) {
            return
        }
        $appRoot.props.cardTable.moveRow(tableArea, moveIndex, moveIndex - 1)
    },
    /**
     * @name: 下移
     * @param {*} tableArea 子表区域
     * @param {*} moveIndex 移动行的位置
     */
    downRow: function (tableArea, moveIndex) {
        let lastIndex = _.get($appRoot.props.cardTable.getAllData(tableArea), 'rows.length') - 1
        if (moveIndex == lastIndex) {
            return
        }
        $appRoot.props.cardTable.moveRow(tableArea, moveIndex, moveIndex + 1)
    },
}
export {
    _CardTable,
}