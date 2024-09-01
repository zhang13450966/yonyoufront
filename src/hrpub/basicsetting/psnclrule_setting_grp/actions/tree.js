
export default class TreeAction {
    constructor(comp){
        this.comp = comp
        
    }

    onSelect =async(value)=>{
        const {props,action} = this.comp
        const {main,dispatch} = props
        let treeData = main.treeData
        let selectedData = null
        let selectedIndex = 0
        if(value && value.length>0){
            if(main.status === 'edit' || value[0] === '0-0'){
                return 
            }
        }else{
            return 
        }
        treeData.forEach((data,i)=>{
            if(data.key === value[0]){
                selectedIndex = i;
                selectedData = data
            }
        })
        await dispatch({
            type: 'main/update',
            payload: {
                selectedKeys: selectedData.key,
                selectedIndex: selectedIndex,
                mustEntryFlag: selectedData.psnclinfosetVO.mustEntryFlag,
                isneedfile: selectedData.psnclinfosetVO.isneedfile
            }
        })
        try{
            action.pubAct.getTableData()
        }catch(e){
            console.log(e)
        }
    }
}