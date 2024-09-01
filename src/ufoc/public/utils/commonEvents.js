
//表体编辑排序
export function orderPosition (moduleId,key) {
    let tabledata = $appRoot.props.cardTable.getAllRows(moduleId);
    for(let i=0;i<tabledata.length;i++){
        if(tabledata[i].values[key] && tabledata[i].values[key].value && i+1 == tabledata[i].values[key].value){
            continue;
        }
        $appRoot.props.cardTable.setValByKeyAndIndex(moduleId, i, key, { value:i+1 }, null, false);
    }
    $appRoot.props.cardTable.setTableData(moduleId,{
        rows: tabledata
    });
   
}