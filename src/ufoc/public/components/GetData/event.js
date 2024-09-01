import { CONSTANT } from './constant';

/**
 * @method 表单编辑事件
 * 
 */
//  本组件  按钮事件 包含弹窗事件
export let formEvent = {
    "areaKey": {
        attrcode: {
            onAfterEvent: function () {

            }
        }
    },
    // 步骤1 业务单元 表单事件
    [CONSTANT.threeFormMetaId]: {
        bussAndGroup: {
            onAfterEvent: async function (ars) {
                console.log($appRoot.state.json['public_lang-000008'], ars);/* 国际化处理： 业务单元+集团 表单编辑后事件*/
                // if(ars[3].value){

                // }else{

                // }
                // 请求数据 url = bussAndGroupUrl;
                if (ars[3].value) {
                  
                }

            }
        },
        limitType:{
            onAfterEvent:function (ars) {
                console.log($appRoot.state.json['public_lang-000078'], ars);/* 国际化处理： 介于还是啥*/
                // if(ars[3].value){
    
                // }else{
    
                // }
                // 请求数据 url = bussAndGroupUrl;
                let meta = this.props.meta.getMeta();
                if (ars[3].value===4) {
                    meta[CONSTANT.threeFormMetaId].items[2].label = $appRoot.state.json['public_lang-000079'];/* 国际化处理： 开始行*/
                    meta[CONSTANT.threeFormMetaId].items.splice(3,0,CONSTANT.threeFormMetaEndLine());
                    this.props.meta.setMeta(meta);
                }else{
                    meta[CONSTANT.threeFormMetaId].items[2].label = $appRoot.state.json['public_lang-000066'];/* 国际化处理： 行*/
                    let filterArray = meta[CONSTANT.threeFormMetaId].items.filter(i=>i.attrcode==="limitRow2");
                    if(filterArray.length){
                        meta[CONSTANT.threeFormMetaId].items.splice(3,1);
                        
                        this.props.meta.setMeta(meta,()=>{
                            this.props.form.setFormItemsValue(CONSTANT.threeFormMetaId,{limitRow2:{
                                display:"",
                                value:""
                            }})
                        });
                    }
                }
    
            }
        },
        limitRow1:{
            // onBeforeEvent:function(ars){
            //     let meta = this.props.meta.getMeta();
            //     let filterArray = meta[CONSTANT.threeFormMetaId].items.filter(i=>i.attrcode==="limitRow2");
            //     if(filterArray.length){
            //         return false;
            //     }
            // },
            onAfterEvent:function(ars){
                let meta = this.props.meta.getMeta();
                let filterArray = meta[CONSTANT.threeFormMetaId].items.filter(i=>i.attrcode==="limitRow2");
                if(filterArray.length){
                    // return false;
                }
            }
        },
        limitRow2:{
            onAfterEvent:function(ars){
                let meta = this.props.meta.getMeta();
                let filterArray = meta[CONSTANT.threeFormMetaId].items.filter(i=>i.attrcode==="limitRow2");
                if(filterArray.length){
                    // return false;
                }
            }
        }

    },
}

// 按钮事件
export let buttonEvent = {
    // three_table_id
    ThreeAdd:function () {
        // 增行
        this.props.editTable.addRow(CONSTANT.three_table_id);
        let meta = this.props.meta.getMeta();
        meta["three_table_id"].items[4].itemtype="input";
        if(meta["three_table_id"].items[4].render){
            delete meta["three_table_id"].items[4].render;
        }

        
    },
     // 删除
     ThreeDelete: function () {
        // 获取选中行数据
        let selectData = this.props.editTable.getCheckedRows(CONSTANT.three_table_id);
        console.log($appRoot.state.json['public_lang-000010'],selectData);/* 国际化处理： 选中行数据*/
        // 是否需要确认暂时未定;
        if(selectData.length){
            selectData = selectData.map(i=>i.index);
            this.props.editTable.deleteTableRowsByIndex(CONSTANT.three_table_id,selectData);
        }else{
            $nccPlatform.toast({
                color: 'warning',
                content: $appRoot.state.json['public_lang-000011'],/* 国际化处理： 请选中行！*/
            })
        }
    },
    // 新增
    Add: function () {
        // 增行
        // this.props.editTable.addRow(CONSTANT.twoTableId);

        this.props.modal.show("two_modal_id",{},async ()=>{
            // 需要在此请求数据  并且过滤数据  过滤来源为当前表格数据
             // 新增按钮
             try {
                let vres =  await $nccUtil.promiseAjax(CONSTANT.getDataSmartDefFieldGet,{
                    pk_def:this.slectTreePk
                });
                
                // 获取旧数据  用于对比 筛选
                let hisTable = this.props.editTable.getAllRows(CONSTANT.twoTableId);
                console.log($appRoot.state.json['public_lang-000080'],vres,hisTable);/* 国际化处理： 新增的数据*/
                let hisDataMap = new Map();
                hisTable.forEach(i=>{
                    hisDataMap.set(i.values.m_fldname.value)
                })
                let newVres = {rows:[]};
                vres.data.fieldList.forEach(i=>{
                    if(!hisDataMap.has(i.m_fldname.value)){
                        newVres.rows.push({
                            values:i
                        })
                    }
                })
                // 设置表格数据
                console.log(newVres);
                this.props.editTable.setTableData(CONSTANT.two_modal_table_id, newVres);
             } catch (error) {
                console.error(error);
             }
            
            
        });
    },
    // 删除
    Delete: function () {
        // 获取选中行数据
        let selectData = this.props.editTable.getCheckedRows(CONSTANT.twoTableId);
        console.log($appRoot.state.json['public_lang-000010'],selectData);/* 国际化处理： 选中行数据*/
        // 是否需要确认暂时未定;
        if(selectData.length){
            selectData = selectData.map(i=>i.index);
            this.props.editTable.deleteTableRowsByIndex(CONSTANT.twoTableId,selectData);
        }else{
            $nccPlatform.toast({
                color: 'warning',
                content: $appRoot.state.json['public_lang-000011'],/* 国际化处理： 请选中行！*/
            })
        }
    },
    // 置顶
    Top: function () {
        // 获取选中行数据
        let selectData = this.props.editTable.getCheckedRows(CONSTANT.twoTableId);
        console.log($appRoot.state.json['public_lang-000010'],selectData);/* 国际化处理： 选中行数据*/
        // 是否需要确认暂时未定;
        if(selectData.length){
            selectData = selectData.map(i=>i.index);
            // 取出第一个  第一个为置顶操作 后续 位置通通改变为 第二 第三 第四
            let size = selectData.map((i,k)=>k);
            selectData.forEach((element,k) => {
                this.props.editTable.moveRow(CONSTANT.twoTableId,element,size[k]);
            });
            
        }else{
            $nccPlatform.toast({
                color: 'warning',
                content: $appRoot.state.json['public_lang-000011'],/* 国际化处理： 请选中行！*/
            })
        }
    },
    // 上移
    MoveUp: function () {
         // 获取选中行数据
         let selectData = this.props.editTable.getCheckedRows(CONSTANT.twoTableId);
         console.log($appRoot.state.json['public_lang-000010'],selectData);/* 国际化处理： 选中行数据*/
         // 是否需要确认暂时未定;
         if(selectData.length){
             selectData = selectData.map(i=>i.index);
             let t;
             // 取出第一个  第一个为置顶操作 后续 位置通通改变为 第二 第三 第四
             let size = selectData.map((i,k)=>{
                 if(k===0){
                    return  t = i?(i-1):i;
                 }else{
                     return t+=1
                 }
             });
             selectData.forEach((element,k) => {
                 this.props.editTable.moveRow(CONSTANT.twoTableId,element,size[k]);
             });
             
         }else{
             $nccPlatform.toast({
                 color: 'warning',
                 content: $appRoot.state.json['public_lang-000011'],/* 国际化处理： 请选中行！*/
             })
         }
    },
    // 下移
    MoveDown: function () {
          // 获取选中行数据
          let selectData = this.props.editTable.getCheckedRows(CONSTANT.twoTableId);
          
          let allData = this.props.editTable.getAllRows(CONSTANT.twoTableId);
          console.log($appRoot.state.json['public_lang-000010'],selectData,allData);/* 国际化处理： 选中行数据*/
          // 是否需要确认暂时未定;
          if(selectData.length){
              
              selectData = selectData.map(i=>i.index);
              selectData = selectData.reverse();
              let maxLength = allData.length;
              let t;
              // 取出第一个  第一个为置顶操作 后续 位置通通改变为 第二 第三 第四
              let size = selectData.map((i,k)=>{
                if(k===0){
                    return  t = ((i+1)>=maxLength)?(maxLength-1):(i+1);
                 }else{
                     return t-=1
                 }
                  
              });
            //   [0,2]  ====> 6 [2,0]  2+1  0+3-1
            //   selectData = selectData.reverse();
            //   size = size.reverse();
              selectData.forEach((element,k) => {
                  this.props.editTable.moveRow(CONSTANT.twoTableId,element,size[k]);
              });
              
          }else{
              $nccPlatform.toast({
                  color: 'warning',
                  content: $appRoot.state.json['public_lang-000011'],/* 国际化处理： 请选中行！*/
              })
          }
    },
    // 置底
    Bottom: function () {
        // 获取选中行数据
        let selectData = this.props.editTable.getCheckedRows(CONSTANT.twoTableId);
        console.log($appRoot.state.json['public_lang-000010'],selectData);/* 国际化处理： 选中行数据*/
        // 是否需要确认暂时未定;
        if(selectData.length){
            selectData = selectData.map(i=>i.index);
            // 取出第一个  第一个为置顶操作 后续 位置通通改变为 第二 第三 第四
            let size =[];
            while(selectData.length){
                size.push(selectData.pop())
            }
            size.forEach((element,k) => {
                this.props.editTable.setRowPosition(CONSTANT.twoTableId,element,"down");
            });
            
        }else{
            $nccPlatform.toast({
                color: 'warning',
                content: $appRoot.state.json['public_lang-000011'],/* 国际化处理： 请选中行！*/
            })
        }
    }
}


