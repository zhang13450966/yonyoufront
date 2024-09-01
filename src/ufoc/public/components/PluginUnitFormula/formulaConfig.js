// 特殊公式配置对象 分为返回结果和启动参数 
export let returnToTheResult = {
    // 最终处理返回公式需要的诗句
    "ufoe/exports/components/Mselect/index":function(datas){
        
        let {treeNode={},data = {}} = datas;
        console.log("Mselect.target",data);
        let nodeName = treeNode.refcode||"";
        let valueName = "";
        let hisSelect;
       
        if(data.hisSelect){
            hisSelect = data.hisSelect;
        }else{
            hisSelect = data;
        }
        
        //需要处理多个的情况,做以下修改

        // let dataOne = hisSelect.pop();
        let dataOne = [...hisSelect][0]; 
        if(!dataOne){
            return `'${nodeName+"->"+valueName}'`
        }


        // if(dataOne[1].data){
        //     valueName = dataOne[1].data.values&&dataOne[1].data.values.name&&dataOne[1].data.values.name.value;
        // }else{
        //     valueName=dataOne[1].m_htExtFmt.name;
        // }

        [...hisSelect].forEach( it => {
            if(it[1].data){
                valueName += nodeName + "->" ;
                valueName += it[1].data.values&&it[1].data.values.name&&it[1].data.values.name.value + ',';
            }else{
                valueName += nodeName + "->" ;
                valueName += it[1].m_htExtFmt.name + ',';
            }
        })
        valueName = valueName.substr(0,valueName.length - 1);

        // return `'${nodeName+"->"+valueName}'`
        return `'${valueName}'`
    },
    "platformItem":function(datas){
        return `'${datas.refname}'`
    },
    "public":function(datas){
        return `'${datas.refname}'`
    }
}
// 启动参数
export let launchParameters = {
    // 最终处理返回公式需要的诗句
    "ufoe/exports/components/Mselect/index":function(datas={}){
        return {
            rightRight : false,
            isRadio : true,
            isMark:false,
            ...datas
        }
    },
    "mselect":function(){
        return {
           
        }
    },
    "public":function(datas){
        return {

        }
    }
}
