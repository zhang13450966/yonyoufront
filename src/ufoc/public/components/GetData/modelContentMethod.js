import { CONSTANT } from "./constant"

let setModeDefConfig = {
    // 当前是第一步
    0: function (config = {}) {
        // let metransferMap;
        // let {type,callback,isQualified} = config;
        // let busiattr = this.state.busiattr;
        //     let roleTree = this.props.meTransfer.getDataSource("oneRoleTransfer");
        //     let userTree = this.props.meTransfer.getDataSource("oneUsreTransfer");

        //     let metransferData = this.props.meTransfer.getTargetKeys("oneRoleTransfer");
        //     if(!metransferData.length){
        //         return "error"
        //     }
        //     metransferMap = new Map();
        //     metransferData.some((i)=>{
        //         metransferMap.set(i,i);
        //     });
        //     loopTree(roleTree,(i)=>{
        //         if(metransferMap.has(i.key)){
        //             metransferMap.set(i.key,i);
        //         }
        //     });
        //     loopTree(userTree,(i)=>{
        //         if(metransferMap.has(i.key)){
        //             if(i.children){
        //                 i = _.cloneDeep(i);
        //                 delete i.children;
        //                 metransferMap.set(i.key,i);

        //             }else{
        //                 metransferMap.set(i.key,i);
        //             }

        //         }
        //     });
        //     $nccStore.setMeDef(["sefData","stepOneData","busiattr"],busiattr);
        //     $nccStore.setMeDef(["sefData","stepOneData","rightData"],metransferMap);
        //     $nccStore.setMeDef(["sefData","stepOneData","leftData","roleTree","data"],roleTree);
        //     $nccStore.setMeDef(["sefData","stepOneData","leftData","userTree","data"],userTree);
        //     if(config.callback)config.callback();
    },
    // 当前是第二步
    1: function (config = {}) {
        let metransferMap;
        let { type, callback, isQualified } = config;
        let taskOrg = this.state.taskOrg;
        let authorityType = this.state.authorityType;
        let tableSampleTree = this.props.meTransfer.getDataSource("tableSampleTree");

        let metransferDataTwo = this.props.meTransfer.getTargetKeys("tableSampleTree");
        if (!metransferDataTwo.length && isQualified) {
            return "error";
        }
        metransferMap = new Map();
        metransferDataTwo.some((i) => {
            metransferMap.set(i, i);
        });
        loopTree(tableSampleTree, (i) => {
            if (metransferMap.has(i.key)) {
                if (i.children) {
                    i = _.cloneDeep(i);
                    delete i.children;
                    metransferMap.set(i.key, i);

                } else {
                    metransferMap.set(i.key, i);
                }

            }
        });
        $nccStore.setMeDef(["sefData", "stepTwoData", "org"], taskOrg);
        // 权限类型
        $nccStore.setMeDef(["sefData", "stepTwoData", "authorityType"], authorityType);
        $nccStore.setMeDef(["sefData", "stepTwoData", "rightData"], metransferMap);
        $nccStore.setMeDef(["sefData", "stepTwoData", "tableSample", "data"], tableSampleTree);
        if (config.callback) config.callback();
    },
    //当前是第三步
    2: function (config = {}) {
        let metransferMap;
        let { type, callback, isQualified } = config;
    },
    // 当前是第三步自定义组织 点击确定时保存  点击删除后更新  type confirm 确定  delete 删除  data 数据
    "customOrg": function (config = {}) {
        let metransferMap;
        let { type, data, callback, orgType } = config;
        // 自定义组织 
        if (orgType === "3") {
            // 点击确定的时候 为增量操作 
            if (type === "confirm") {
                let hisData = $nccStore.getMeDef(["sefData", "stepThreeData", "table", "customData"]);
                console.log($appRoot.state.json['public_lang-000033'], hisData, data);/* 国际化处理： 确定缓存数据*/
                hisData.merge(data);
                // 写入 
                $nccStore.setMeDef(["sefData", "stepThreeData", "table", "customData"], hisData);
            }
            // 点击删除的时候 为减量操作 
            if (type === "delete") {
                let hisData = $nccStore.getMeDef(["sefData", "stepThreeData", "table", "customData"]);
                hisData.deletes(data);
                // 写入 
                $nccStore.setMeDef(["sefData", "stepThreeData", "table", "customData"], hisData);

            }
        }//非自定义组织
        else {

        }

        console.log($appRoot.state.json['public_lang-000034'], $nccStore.getMeDef(["sefData"]));/* 国际化处理： 最新缓存数据*/
        if (config.callback) config.callback();
    }
}


/**
 * @method 根据当前步骤  写入缓存数据 该方法  可以传入下级组件  需要特殊指定 标识  
 * 
 */
export let setModeDef = function (config) {
    let { type } = config;
    switch (type) {
        case 1://当前是第二步
            return setModeDefConfig[type].call(this, config);
            break;
        // *********************************8888end
        case 0://当前是第一步
            return setModeDefConfig[type].call(this, config);
            break;
        //自定义组织弹窗确定的时候写入缓存数据 
        case "customOrg"://当前是第一步
            return setModeDefConfig[type].call(this, { ...config, type: config.contentType });
            // let busiattr = this.state.busiattr;
            // let roleTree = this.props.meTransfer.getDataSource("oneRoleTransfer");
            // let userTree = this.props.meTransfer.getDataSource("oneUsreTransfer");

            // let metransferData = this.props.meTransfer.getTargetKeys("oneRoleTransfer");
            // if(!metransferData.length){
            //     return "error"
            // }
            // metransferMap = new Map();
            // metransferData.some((i)=>{
            //     metransferMap.set(i,i);
            // });
            // loopTree(roleTree,(i)=>{
            //     if(metransferMap.has(i.key)){
            //         metransferMap.set(i.key,i);
            //     }
            // });
            // loopTree(userTree,(i)=>{
            //     if(metransferMap.has(i.key)){
            //         if(i.children){
            //             i = _.cloneDeep(i);
            //             delete i.children;
            //             metransferMap.set(i.key,i);

            //         }else{
            //             metransferMap.set(i.key,i);
            //         }

            //     }
            // });
            // $nccStore.setMeDef(["sefData","stepOneData","busiattr"],busiattr);
            // $nccStore.setMeDef(["sefData","stepOneData","rightData"],metransferMap);
            // $nccStore.setMeDef(["sefData","stepOneData","leftData","roleTree","data"],roleTree);
            // $nccStore.setMeDef(["sefData","stepOneData","leftData","userTree","data"],userTree);
            // let roleData =  $nccStore.getMeDef(["sefData","stepOneData","leftData","roleTree","data"]);
            // this.props.meTransfer.setDataSource("oneRoleTransfer",roleData);


            break;
    }


}

function loopTree(data, callback) {
    if (!Array.isArray(data)) return;
    data.forEach((i, k) => {
        callback(i, k);
        if (Array.isArray(i.children) && i.children.length) {
            loopTree(i.children, callback);
        }
    });
}
/**
 * @method 获取需要的步骤 的缓存数据  
 * 若当前步骤没有缓存数据  会返回 null  提供回调能力  回调参数为当前获取到的data
 * 
 */
export let getModeDef = function (type, callback) {
    let data = null;
    let virData = null;
    switch (type) {
        case 0://当前是第一步
            virData = $nccStore.getMeDef(["sefData", "stepOneData"]);
            if (virData && virData.rightData.size) {
                data = virData;
            }
            break;
        case 1://当前是第一步
            virData = $nccStore.getMeDef(["sefData", "stepTwoData"]);
            if (virData && virData.rightData.size) {
                data = virData;
            }
            break;
    }
    if (callback) callback(data);
    return data;
}

/**
 * @method 第三步切换组织选择 
 * 切换进自定义 或者从自定义切换出来都需要将当前数据存入缓存数据
 *  next 下一个  current 当前（未切换的）
 */
export let switchoverOrgSet = function (next, current) {

    // 即将往自定义切换  不用考虑是从自定义切换出来的 
    // if (next === 3) {

    // }//需要考虑 是否是从自定义切换出来的
    // else {
    //     // 当前是从自定义切换出来的
    //     if (current === 3) {

    //     }//非自定义切换常规处理
    //     else {

    //     }
    // }

    this.setState({ orgChoice: next });
}

/**
 * @method 转换并且设置 第三步 表格数据
 *  isTransition 是否转换  "orgRange"
 *  
 */
export let setMeTableData = function (config = {}) {
    let { id, data = new Map(), type, isTransition = true } = config;
    // 转换数据 此时  data 必须是 Map
    let newData = {};
    if (isTransition) {
        newData.rows = [];
        [...data.values()].forEach((i) => {
            newData.rows.push({
                values: {
                    code: { value: i.code, display: i.code },
                    name: { value: i.refpk, display: i.refname }
                }
            })
        })
    } else {
        newData = data;
    }
    console.log($appRoot.state.json['public_lang-000035'], newData);/* 国际化处理： 被设置的表格数据*/
    this.props.editTable.setTableData(id, newData);

    // 
}

/**
 * @method 转换前两步数据 为了生成第三步树数据
 * 
 *  
 */
export let transformOne = function (dataSet) {
    // let dataOnes = dataSet;
    let one = {
        pk_task: this.props.that.selectPk_task,
        unitProp: [],
        repMeas: {}
    };
    let object = _.cloneDeep(dataSet);
    let unitProp = Object.hasGetDelete(object, "unitProp");
    if (unitProp.listSelect && unitProp.listSelect.size) {
        one.unitProp = [...unitProp.listSelect.keys()]
    }
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            one["repMeas"][key] = [];
            if (element.excelSelect && element.excelSelect.hisSelect && element.excelSelect.hisSelect.size) {
                one["repMeas"][key] = one["repMeas"][key].concat([...element.excelSelect.hisSelect.keys()]);
            }
            if (element.listSelect && element.listSelect.size) {
                // let unitProp
                one["repMeas"][key] = one["repMeas"][key].concat([...element.listSelect.keys()]);
            }


        }
    }

    return one;

}
// 第二步 弹窗确定事件
export let twoModalBeSureBtnClick = function (...ars) {
    console.log($appRoot.state.json['public_lang-000099'], ars);/* 国际化处理： 弹窗确认事件*/
    // 获取旧数据  用于对比 筛选 CONSTANT.two_modal_table_id
    //  let hisTable = this.props.editTable.getAllRows(CONSTANT.twoTableId);
    // this.props.table.getCheckedRows
    let selectTable = this.props.editTable.getCheckedRows(CONSTANT.two_modal_table_id);
    selectTable = selectTable.map(i => {
        return i.data
    })
    console.log($appRoot.state.json['public_lang-000080'], selectTable);/* 国际化处理： 新增的数据*/
    this.props.editTable.insertRowsAfterIndex(CONSTANT.twoTableId, selectTable);
    this.props.modal.close("two_modal_id");

}
// 表格编辑前事件
export let onBeforeEventThree = function (...ars) {
    console.log($appRoot.state.json['public_lang-000100'], ars); /* 国际化处理： 表单编辑前事件*///createRefer
    let meta = this.props.meta.getMeta();
    if (ars[5].values[CONSTANT.treeTableConfig[3].key].value === "1") {
        meta["three_table_id"].items[4].itemtype = "input";
        if (meta["three_table_id"].items[4].render) {
            delete meta["three_table_id"].items[4].render;
        }
    } else {
        meta["three_table_id"].items[4].itemtype = "customer";
        meta["three_table_id"].items[4].render = this.createRefer();
    }
}
// 表格编辑后事件
export let ononAfterEventThree = function (...ars) {
    console.log($appRoot.state.json['public_lang-000101'], ars); /* 国际化处理： 表单编辑后事件*///createRefer
    let meta = this.props.meta.getMeta();
    if(ars[2]==="valueType"){
        if (ars[3] === "1") {
            meta["three_table_id"].items[4].itemtype = "input";
            if (meta["three_table_id"].items[4].render) {
                delete meta["three_table_id"].items[4].render;
            }
    
           
        }

        this.props.editTable.setValByKeyAndIndex(ars[1], ars[5], CONSTANT.treeTableConfig[4].key, { value: "", display: "" });
    }
    
    

}

/**
 * @method 参数形式调用该方法 目前只试验过表格
 *  config 详细 需要的参数 
 *  that 外部组件this  必须的 ,type="editTable", 搭配使用平台组件类型  暂时只支持表格 id 组件id
 *   getParmsFn 扩展参数方法  需要返回 当前组件需要的参数  unitFormulaId 公式组件的id 
 *  attrCode :相应操作列的code 
 *   
 *   createRefer({
      that:this,
      type:"editTable",
      getParmsFn:()=>{},
      valueFn:(text, record, index)=>{
          return  record.values[CONSTANT.treeTableConfig[4].key].value
      }
      unitFormulaId:CONSTANT.getDataTreeTable4,
        id:CONSTANT.three_table_id,
       attrCode:CONSTANT.treeTableConfig[4].key,
//      isBowser:true,//是否开启浏览态
        faultTolerant:(text, record, index)=>{
            
            return record.values[CONSTANT.treeTableConfig[3].key].value === "3"
        }
 *   })
 */
export let createRefer = function ()  {
    return this.props.unitFormula.createRefer(
            {
                that:this,
                type:"editTable",
                getParmsFn:()=>{},
                valueFn:(text, record, index)=>{
                    return  record.values[CONSTANT.treeTableConfig[4].key].value
                },
                unitFormulaId:CONSTANT.getDataTreeTable4,
                id:CONSTANT.three_table_id,
                attrCode:CONSTANT.treeTableConfig[4].key,
                // isBowser:true,//是否开启浏览态
                faultTolerant:(text, record, index)=>{
                    return record.values[CONSTANT.treeTableConfig[3].key].value === "3"
                }
            }
    )


}

/**
 * @author Mendege 2020.24
 * @description 获取树节点 上级 树节点  直到根节点
 *  refpk 找寻节点pk  itself 返回结果是否包含本身 默认false 不包含
  */
 export function getTreeNodeParents(refpk,itself = false){
    //缓存数据  暂时的  本方法执行完成以后会清空
   // this.virTreeData = this.props.syncTree;
   let treeId = CONSTANT.oneTreeId;
   let parents_refpks = [];
   let virNodeData = this.props.syncTree.getSyncTreeValue(treeId,refpk);
   if(itself){
       parents_refpks.unshift(refpk);
   }
   do{
       parents_refpks.unshift(virNodeData.pid);
       virNodeData = this.props.syncTree.getSyncTreeValue(treeId,virNodeData.pid);
   }while(virNodeData&&virNodeData.pid);
   console.log($appRoot.state.json['public_lang-000102'],parents_refpks);/* 国际化处理： 当前链条数据*/
   return parents_refpks;
}
