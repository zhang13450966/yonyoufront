

let setModeDefConfig = {
    // 当前是第一步
    0:function(config = {}){
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
    1:function(config = {}){
        let metransferMap;
        let {type,callback,isQualified} = config;
        let taskOrg = this.state.taskOrg;
            let authorityType = this.state.authorityType;
            let tableSampleTree = this.props.meTransfer.getDataSource("tableSampleTree");
            
            let metransferDataTwo = this.props.meTransfer.getTargetKeys("tableSampleTree");
            if(!metransferDataTwo.length&&isQualified){
                return "error";
            }
            metransferMap = new Map();
            metransferDataTwo.some((i)=>{
                metransferMap.set(i,i);
            });
            loopTree(tableSampleTree,(i)=>{
                if(metransferMap.has(i.key)){
                    if(i.children){
                        i = _.cloneDeep(i);
                        delete i.children;
                        metransferMap.set(i.key,i);
                        
                    }else{
                        metransferMap.set(i.key,i);
                    }
                
                }
            });
            $nccStore.setMeDef(["sefData","stepTwoData","org"],taskOrg);
            // 权限类型
            $nccStore.setMeDef(["sefData","stepTwoData","authorityType"],authorityType);
            $nccStore.setMeDef(["sefData","stepTwoData","rightData"],metransferMap);
            $nccStore.setMeDef(["sefData","stepTwoData","tableSample","data"],tableSampleTree);
            if(config.callback)config.callback();
    },
    //当前是第三步
    2:function(config = {}){
        let metransferMap;
        let {type,callback,isQualified} = config;
    },
    // 当前是第三步自定义组织 点击确定时保存  点击删除后更新  type confirm 确定  delete 删除  data 数据
    "customOrg":function(config = {}){
        let metransferMap;
        let {type,data,callback,orgType} = config;
        // 自定义组织 
        if(orgType==="3"){
             // 点击确定的时候 为增量操作 
            if(type === "confirm"){
                let hisData =  $nccStore.getMeDef(["sefData","stepThreeData","table","customData"]);
                console.log($appRoot.state.json['public_lang-000033'],hisData,data);/* 国际化处理： 确定缓存数据*/
                hisData.merge(data);
                // 写入 
                $nccStore.setMeDef(["sefData","stepThreeData","table","customData"],hisData);
            }
            // 点击删除的时候 为减量操作 
            if(type === "delete"){
                let hisData =  $nccStore.getMeDef(["sefData","stepThreeData","table","customData"]);
                hisData.deletes(data);
                // 写入 
                $nccStore.setMeDef(["sefData","stepThreeData","table","customData"],hisData);
                
            }
        }//非自定义组织
        else{

        }
       
        console.log($appRoot.state.json['public_lang-000034'],$nccStore.getMeDef(["sefData"]));/* 国际化处理： 最新缓存数据*/
        if(config.callback)config.callback();
    }
}


/**
 * @method 根据当前步骤  写入缓存数据 该方法  可以传入下级组件  需要特殊指定 标识  
 * 
 */
export let setModeDef = function(config){
    let {type} = config;
    switch(type){
        case 1://当前是第二步
            return setModeDefConfig[type].call(this,config);
        break;
        // *********************************8888end
        case 0://当前是第一步
            return setModeDefConfig[type].call(this,config);
        break;
        //自定义组织弹窗确定的时候写入缓存数据 
        case "customOrg"://当前是第一步
            return setModeDefConfig[type].call(this,{...config,type:config.contentType});
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

function loopTree(data,callback){
    if(!Array.isArray(data))return;
    data.forEach((i,k)=>{
        callback(i,k);
        if(Array.isArray(i.children)&&i.children.length){
            loopTree(i.children,callback);
        }
    });
}
/**
 * @method 获取需要的步骤 的缓存数据  
 * 若当前步骤没有缓存数据  会返回 null  提供回调能力  回调参数为当前获取到的data
 * 
 */
export let getModeDef = function(type,callback){
    let data = null;
    let virData = null;
    switch(type){
        case 0://当前是第一步
        virData = $nccStore.getMeDef(["sefData","stepOneData"]);
        if(virData&&virData.rightData.size){
            data = virData;
        }
        break;
        case 1://当前是第一步
        virData = $nccStore.getMeDef(["sefData","stepTwoData"]);
        if(virData&&virData.rightData.size){
            data = virData;
        }
        break;
    }
    if(callback)callback(data);
    return data;
}

/**
 * @method 第三步切换组织选择 
 * 切换进自定义 或者从自定义切换出来都需要将当前数据存入缓存数据
 *  next 下一个  current 当前（未切换的）
 */
export let switchoverOrgSet = function(next,current){
    
    // 即将往自定义切换  不用考虑是从自定义切换出来的 
    // if(next===3){

    // }//需要考虑 是否是从自定义切换出来的
    // else{
    //     // 当前是从自定义切换出来的
    //     if(current===3){

    //     }//非自定义切换常规处理
    //     else{

    //     }
    // }

    this.setState({orgChoice:next});
}

/**
 * @method 转换并且设置 第三步 表格数据
 *  isTransition 是否转换  "orgRange"
 *  
 */
export let setMeTableData = function (config = {}){
    let {id,data = new Map(),type,isTransition = true} = config;
    // 转换数据 此时  data 必须是 Map
    let newData = {};
    if(isTransition){
        newData.rows = [];
        [...data.values()].forEach((i)=>{
            newData.rows.push({
                values:{
                    code:{value:i.code,display:i.code},
                    name:{value:i.refpk,display:i.refname}
                }
            })
        })
    }else{
        newData = data;
    }
    console.log($appRoot.state.json['public_lang-000035'],newData);/* 国际化处理： 被设置的表格数据*/
    this.props.editTable.setTableData(id,newData);

    // 
}

/**
 * @method 转换前两步数据 为了生成第三步树数据
 * 
 *  
 */
export let transformOne = function(dataSet){
    // let dataOnes = dataSet;
    let one = {
        pk_task:this.props.that.selectPk_task,
        unitProp:[],
        repMeas:{}
    };
    let object  = _.cloneDeep(dataSet);
    let unitProp = Object.hasGetDelete(object,"unitProp");
    if(unitProp.listSelect&&unitProp.listSelect.size){
        one.unitProp = [...unitProp.listSelect.keys()]
    }
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            one["repMeas"][key] = [];
            if(element.excelSelect&&element.excelSelect.hisSelect&&element.excelSelect.hisSelect.size){
                one["repMeas"][key] = one["repMeas"][key].concat([...element.excelSelect.hisSelect.keys()]);
            }
            if(element.listSelect&&element.listSelect.size){
                // let unitProp
                one["repMeas"][key] = one["repMeas"][key].concat([...element.listSelect.keys()]);
            }

            
        }
    }

    return one;

}

