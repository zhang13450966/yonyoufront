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
    bussAndGroupArea: {
        bussAndGroup: {
            onAfterEvent: async function (ars) {
                console.log($appRoot.state.json['public_lang-000008'], ars);/* 国际化处理： 业务单元+集团 表单编辑后事件*/
                // if(ars[3].value){

                // }else{

                // }
                // 请求数据 url = bussAndGroupUrl;
                if (ars[3].value) {
                    this.setState({ busiattr: ars[3] });
                    let param = {
                        pk_org: ars[3].value
                    };
                    let vres = await $nccUtil.promiseAjax(URL.bussAndGroupUrl, param);
                    if (vres.success && vres.data) {
                        let roleTreeData = this.props.syncTree.createTreeData(vres.data.role.objs);
                        let userTreeData = this.props.syncTree.createTreeData(vres.data.user.objs);
                        console.log($appRoot.state.json['public_lang-000009'], vres, roleTreeData, userTreeData);/* 国际化处理： 请求用户树的数据*/
                        $nccStore.setMeDef(["sefData", "stepOneData", "leftData", "roleTree", "data"], roleTreeData);
                        $nccStore.setMeDef(["sefData", "stepOneData", "busiattr"], ars[3]);
                        $nccStore.setMeDef(["sefData", "stepOneData", "leftData", "userTree", "data"], userTreeData);
                        this.props.meTransfer.setDataSource("oneRoleTransfer", roleTreeData);
                    }


                } else {
                    // 首先需要清空下部缓存数据 
                    let sdata = {
                        //业务单元数据 控制左边和右边数据
                        busiattr: {},
                        leftData: {
                            //角色树
                            roleTree: {
                                id: "oneRoleTransfer",
                                data: [],
                                //map组数据 
                                keyDataMap: new Map(),
                                select: []
                            },
                            //用户树
                            userTree: {
                                id: "oneUsreTransfer",
                                data: [],
                                keyDataMap: new Map(),
                                select: []

                            }
                        },
                        // 右侧数据  以树的refpk为key  树节点数据为 内容
                        rightData: new Map()

                    };
                    this.setState({ busiattr: {} });
                    $nccStore.setMeDef(["sefData", "stepOneData"], sdata);
                    this.props.meTransfer.setDataSource("oneRoleTransfer", []);
                    this.props.meTransfer.setTargetKeys("oneRoleTransfer", []);
                }

            }
        },

    },
}

// 按钮事件
export let buttonEvent = {
    // 新增
    Add: function () {
        // 增行
        this.props.editTable.addRow(CONSTANT.twoTableId);
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
          
          let allData = this.props.editTable.getAllRows("set_calculation_index_table_meta");
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
