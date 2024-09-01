import { toast } from 'nc-lightapp-front'

export default class TableAction{
    constructor(comp){
        this.comp = comp
        
    }
    
    onTableBoxChange =(key,moduleId,value)=>{
        const {props} = this.comp
        const {main,editTable} = props
        if(main.status === 'browse'){
            toast({color:'warning',content: main.json['hrpub-000153']})
            return
        }
        let display = value ? main.json['hrpub-000113']:main.json['hrpub-000114']
        let number = editTable.getNumberOfRows(moduleId)
        let disabledRow = main.sysData
        for(let i = 0; i<number; i++){
            let metadata = editTable.getValByKeyAndIndex(moduleId,i,'metadata').value
            if(disabledRow.indexOf(metadata) < 0){
                if(key === 'usedflag'){
                    if(!value){
                        editTable.setValByKeyAndIndex(moduleId, i, 'mustflag' , {value: value,display: display})
                    }
                    editTable.setValByKeyAndIndex(moduleId, i, key , {value: value,display: display})
                }
                if(key === 'mustflag'){
                    editTable.setValByKeyAndIndex(moduleId, i, key , {value: value,display: display})
                    if(value){
                        editTable.setValByKeyAndIndex(moduleId, i, 'usedflag' , {value: value,display: display})
                        editTable.setEditableRowKeyByIndex(moduleId,i,'usedflag',false)
                    }else{
                        editTable.setEditableRowKeyByIndex(moduleId,i,'usedflag',true) 
                    }
                }
                
            }
        }
        this.setMustCheckDisable()
    }

    onTitleBoxChange =(index,value)=>{
        const {props} = this.comp
        const {main,dispatch} = props
        let tableInfo = main.tableInfo
        tableInfo[index].psnclinfosetVO.mustEntryFlag = value
        dispatch({
            type: 'main/update',
            payload: {
                tableInfo: tableInfo,
                mustEntryFlag: value
            }
        })
    }

    needFileChange = (index,value) => {
        const {props} = this.comp
        const {main,dispatch} = props
        let tableInfo = main.tableInfo
        tableInfo[index].psnclinfosetVO.isneedfile = value
        dispatch({
            type: 'main/update',
            payload: {
                tableInfo: tableInfo,
                isneedfile: value
            }
        })
    }
    onBeforeTableEvent =(props,moduleId,item,index,value,record)=>{
        // //得到系统数据 不可编辑
        // const {main,form,editTable,dispatch} = props
        // let metadata = record.values.metadata.value
        // let disabledRow = main.sysData
        // let inheritflag = form.getFormItemsValue('psnclrule','inheritflag').value
        // //如果必输选中,则显示不可修改
        // if(item.attrcode === 'usedflag'){
        //     if(inheritflag){
        //         return false
        //     }
        //     if(disabledRow.indexOf(metadata) >-1){
        //         toast({color:'warning',content: main.json['hrpub-000154']})
        //         return false
        //     }
        // }
        // if(item.attrcode === 'mustflag'){
        //     if(inheritflag){
        //         return false
        //     }
        //     if(disabledRow.indexOf(metadata) >-1){
        //         toast({color:'warning',content: main.json['hrpub-000154']})
        //         return false
        //     }
        // }  
        return true
    }

    onAfterTableEvent =(props, moduleId, key, value, record, index)=>{
        const {editTable,dispatch} = props 
        //如果勾选了必输，则显示也勾选中
        if(key === 'mustflag'){
            if(value){
                editTable.setValByKeyAndIndex(moduleId,index,'usedflag',{value: true})
                editTable.setEditableRowKeyByIndex(moduleId,index,'usedflag',false)
                dispatch({
                    type: 'main/update',
                    payload: {
                        mustCheckDisable: false,
                        needCheckDisable: false
                    }
                })
            }else{
                editTable.setEditableRowKeyByIndex(moduleId,index,'usedflag',true)
            }
            // this.setMustCheckDisable()
        }
        if(key === 'usedflag'){
            this.setMustCheckDisable()
        }
    }


    //设置子集必录的可编辑型   新增的checkbox与此逻辑一样  写在一起了
    setMustCheckDisable =()=>{
        const {props} = this.comp
        const {main,editTable,dispatch} = props
        let tableName = 'psnclinfoset'+ main.selectedIndex
        let number  = editTable.getNumberOfRows(tableName)
        let mustCheckDisable = true
        let needCheckDisable = true
        for (let i=0;i<number;i++){
            let usedflag = editTable.getValByKeyAndIndex(tableName,i,'usedflag').value
            if(usedflag){
                mustCheckDisable = false
                needCheckDisable = false
                break 
            }   
        }
        dispatch({
            type: 'main/update',
            payload: {
                mustCheckDisable: mustCheckDisable,
                needCheckDisable: needCheckDisable
            }
        })
    }
}