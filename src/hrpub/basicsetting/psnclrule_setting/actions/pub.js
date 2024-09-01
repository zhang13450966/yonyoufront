import {base} from 'nc-lightapp-front'

const {NCCheckbox} = base
export default class pubAction{
    constructor(comp){
        this.comp = comp
        
    }

    initButton =()=>{
        const {props} = this.comp
        const {button,main} = props
        let pk_org  = main.orgValue && main.orgValue.refpk
        let flag = pk_org !== undefined && pk_org !== null
        let psnFlag = main.psnclValue !== undefined && main.psnclValue !== null
        button.setButtonVisible({
            'Edit': flag && psnFlag && main.status === 'browse',
            'Cancel' : flag && psnFlag &&  main.status === 'edit',
            'Save': flag &&  psnFlag && main.status === 'edit', 
            'Copy': flag && psnFlag && main.status === 'browse', 
            'Refresh': flag && psnFlag && main.status === 'browse', 
        })
    } 
    getTreeData =()=>{
        const {props} = this.comp
        const {dispatch,main} = props
        dispatch({
            type: 'main/getTreeData',
            payload: {
                pk_org: main.orgValue.refpk
            }
        }).then(async(res)=>{
            let data = res.data
            if(data){
                let psnclValue = data.length>0 && data[0].key
                let psnclName=  data.length>0 && data[0].name
                await dispatch({
                    type: 'main/update',
                    payload: {  
                        psnclValue: main.psnclValue || psnclValue,
                        psnclName: main.psnclName || psnclName             
                    }
                })
            }
            try{
                this.getTableData()
                this.initButton()
            }catch(e){
                console.log(e)
            }
        })
    }


    getTableData =()=>{
        const {props} = this.comp
        const {dispatch,main,editTable,form} = props
        dispatch({
            type: 'main/getTableData',
            payload: {
                pk_org: main.orgValue.refpk,
                tree_node_id: main.psnclValue
            }
        }).then(async(res)=>{
            if(res.data){
                let tableInfo = res.data.psnclinfosets || []
                let tableData = res.data.psnclinfoitems || []
                let formData = res.data.psnclrule.psnclrule
                let sysData = res.data.sysData || []  //不可更改的系统项目
                let sysDataSet = res.data.sysDataSet || []  //不可更改的子集必录的表
                let forFileSysData = sysDataSet && sysDataSet.filter(item => (item !== 'hrhi.hi_psnjob'))
                forFileSysData.push('hrhi.hi_psnorg')
                let isEdit = res.data.isExtendEditable  //是否继承上级人员类别的信息配置 多选框是否可编辑
                let length = tableInfo.length
                let meta = props.meta.getMeta()
                let psnMeta = meta['psnclinfoset']
                let treeData = []
                tableInfo.length >0 && tableInfo.forEach((info)=>{
                    let data ={
                        code: '',
                        id: info.infopk,
                        key: info.infopk,
                        name: info.infoname,
                        nodeData: {
                            nodeValue: {
                                name: info.infoname,
                                pK_org: main.orgValue.refpk,
                            }
                        },
                        refname: info.infoname,
                        refpk: info.infopk,
                        title:  info.infoname,
                        busiInfoSet: info.busiInfoSet,
                        psnclinfosetVO: info.psnclinfosetVO,
                        sysDataMap: info.sysDataMap,
                        sysDataSetMap: info.sysDataSetMap,
                        metadata: info.metadata
                    }
                    treeData.push(data)
                })
                let temp = props.meta.getMeta();
                for(let i=0;i<length;i++){
                    let metaName = 'psnclinfoset'+ i
                    let addMeta = JSON.parse(JSON.stringify(psnMeta))
                    addMeta.code = metaName
                    temp[metaName] = addMeta
                }
                props.meta.setMeta(temp)
                /**
                 * 如果不重新建表，表格就不能解析CheckBox为‘是’或者‘否’
                 * 暂时先这么处理，后面看一下平台有没有提供别的方法
                 */
                await dispatch({
                    type: 'main/update',
                    payload: {
                        selectedIndex: null
                    }
                })
                let itemValue = formData && formData.rows[0].values.inheritflag.value
                try{
                    form.setAllFormValue({'psnclrule':formData})
                    editTable.setTableData('psnclinfoset' + main.selectedIndex, tableData[main.selectedKeys|| (treeData.length>0 && treeData[0].key)]['psnclinfoset'])
                }catch(e){

                }
                dispatch({
                    type: 'main/update',
                    payload: {
                        tableInfo: tableInfo,
                        tableData: tableData,
                        treeData: treeData,
                        selectedKeys: main.selectedKeys|| (treeData.length>0 && treeData[0].key),
                        selectedIndex: main.selectedIndex || '0',
                        mustEntryFlag: treeData.length>0 && treeData[ main.selectedIndex || 0].psnclinfosetVO.mustEntryFlag,
                        isneedfile: treeData.length>0 && treeData[ main.selectedIndex || 0].psnclinfosetVO.isneedfile,
                        checkValue: itemValue,
                        sysDataSet: sysDataSet,
                        forFileSysData: forFileSysData,
                        sysData: sysData,
                        metadata: treeData.length>0 && treeData[ main.selectedIndex || 0].metadata,
                        isEdit: isEdit
                    }
                })
            }
        })
    }


    modifyMeta =(status='browse')=>{
        const {props,action} = this.comp
        const {main} = props
        let allMeta = props.meta.getMeta()
        let length = main.tableInfo.length
        allMeta['psnclinfoset'+main.selectedIndex].items.map((item)=>{
            if(status === 'edit'){
                if(item.attrcode === 'usedflag' || item.attrcode === 'mustflag'){
                    item.label =(
                        <div>
                            <NCCheckbox
                                onChange = {action.tableAct.onTableBoxChange.bind(this,item.attrcode,'psnclinfoset'+main.selectedIndex)}
                            >{item.label}</NCCheckbox>
                        </div> 
                    )
                }
            }else{
                if(item.attrcode === 'usedflag' ){
                    item.label = main.json['hrpub-000164']
                }else if(item.attrcode === 'mustflag'){
                    item.label = main.json['hrpub-000165']
                }
            }
        })   
        props.meta.setMeta(allMeta)
    }
}