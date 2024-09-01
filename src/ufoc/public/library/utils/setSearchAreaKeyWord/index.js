/*
 * @Autor: hgq
 * @Date: 2022-02-10 09:58:27
 */
/**
     * @name: 查询区关键字动态加载公共方法，默认加载到查询区末尾
     * @param {*} areaId 查询区Id
     * @param {*} hbschemeData 查询区编辑时合并方案相关数据
     * @param {*} needOrgRef 是否需要查询区渲染单位参照
     * @param {*} chooseMore 单位参照是否多选
     * @param {*} defaultIncludeChildren 是否包含下级
     * @param {*} filterType 单位参照过滤方式  notLeafAndUserPermission：非叶子节点且用户有权限的组织     userPermission：用户有权限的组织
     */
export async function setSearchAreaKeyWord(setting) {
    let defaultSetting={
        areaId:"", 
        hbschemeData:{},
        needOrgRef:false,
        chooseMore:false,
        filterType:"notLeafAndUserPermission",
        defaultIncludeChildren:false,
        insertIndex:2
    }
    let args=Object.assign(defaultSetting,setting);
    const { areaId,hbschemeData,needOrgRef,chooseMore,filterType,defaultIncludeChildren,insertIndex } = args;
    //通过isAutoLoad属性进行判断是否是动态添加的属性
    let meta = $appRoot.props.meta.getMeta();
    let items = meta[areaId].items;
    //记录上一次的合并方案对应的关键字的值
    let keyFilterItems = [];
    //清除上一次选择合并方案加载的关键字
    let newItems=Object.values(_.filter(items, function(item) {
        if(item.isAutoLoad){
            keyFilterItems.push(item.attrcode);            
        }
        return !item.isAutoLoad;
    }));
    meta[areaId].items = newItems;

    let resData={
        data:{
            keyWordRefInfo:[]
        },
        list:[]
    }
    //清空合并方案 直接删除动态添加的属性
    if(!_.get(hbschemeData,"refpk")){
        meta[areaId].items=newItems
        await $appRoot.props.meta.setMeta(meta)
        return resData
    }
    //选择合并方案
    let queryPara = {
        pk_hbscheme: hbschemeData.refpk
    }
    //发送ajax查询关键字组合
    let res = await $nccUtil.promiseAjax('/nccloud/ufoc/keyword/keyWordRefCreateBase.do', queryPara);  
    const { keyWordRefInfo } = res.data;
    resData.data.keyWordRefInfo=keyWordRefInfo;
   
    keyWordRefInfo.forEach(it=>{
        let itemArr=[]
        itemArr.push(it.code)
        itemArr.push(it.m_strKeyVal)
        resData.list.push(itemArr)
    })
    // 关键字组合items拼装
    let { keyWordItems, dateObj, dateCode } = await getKeyWordItems(keyWordRefInfo, hbschemeData,needOrgRef,chooseMore,filterType,defaultIncludeChildren) 
    //这里需要处理顺序
    newItems.push(...keyWordItems);   
    meta[areaId].items=newItems;
    await $appRoot.props.meta.setMeta(meta)
    //设置高级查询的快照的数据
    setSearchSnapItems(keyWordRefInfo,areaId,keyFilterItems,insertIndex,needOrgRef)
    //设置期间的值
    await $appRoot.props.search.setSearchValByField(areaId, dateCode, dateObj)
    return resData
}
/**
     * @name: 关键字item数组生成
     * @param {*} keyWordRefInfo 后台返回相关的关键字信息
     * @param {*} hbschemeData 查询区编辑时合并方案相关数据
     * @param {*} needOrgRef 是否需要查询区渲染单位参照
     * @param {*} chooseMore 单位参照是否多选
     */
 async function getKeyWordItems(keyWordRefInfo, hbschemeData,needOrgRef,chooseMore,filterType,defaultIncludeChildren) {
    //关键字模板
    let keyWordItems = [];
    // 日期对象
    let dateObj = {}
    //日期编码
    let dateCode = ''
    //日期对象的pk_keyword
    let pk_periodkey=''
    keyWordRefInfo.forEach(item => {
        //item特殊属性说明
        //pk_keyword 记录每个item自己的pk_keyword，方便后续获取数据
        let obj = {
            label: item.name,
            visible: item.isVisible,
            attrcode: item.code,
            queryOperateType: "=@>@>=@<@<=@like@",
            disabled: false,
            isdrag: false,
            pk_keyword: item.pk_keyword,
            required: true,
            isAutoLoad:true,
            isShowUnit:false,
            isdynamic:true,          
            onlyOne: true,
            isnotmeta: true
        }
        if (item.type == '1') {
            //字符型关键字
            obj.placeholder = item.name
            obj.itemtype = "input"
            obj.required = false
        } else if (item.type == '2') {
            //参照型关键字
            obj.itemtype = "refer"
            obj.queryOperateType = "=@";
            obj.refcode = item.refPath
            obj.whichKeyToDisplay = "auto"
            obj.placeholder = item.name
            //单位需要单独判断处理
            if (item.code == 'corp') {
                console.log(hbschemeData)
                //是否需要单位参照
                if(needOrgRef){
                    obj.queryCondition = {
                        pk_rcs:_.get(hbschemeData,'values.pk_repmanastru.value'),
                        chooseMore: chooseMore,
                        pk_hbscheme:_.get(hbschemeData,'refpk'),
                        filterType:filterType,
                        defaultIncludeChildren: defaultIncludeChildren,  
                    }
                }else{
                    return 
                }
            }
            //自定义档案
            if (item.refPath == "uapbd/refer/userdef/DefdocTreeRef/index" || item.refPath == "uapbd/refer/userdef/DefdocGridRef/index") {
                obj.queryCondition = {
                    "refpath": item.refPath,
                    "pk_defdoclist": item.ref_pk,
                }
            }
            let ref_pks = [ //匹配是否加业务单元的数组
                'e4f48eaf-5567-4383-a370-a59cb3e8a451',
                '720dcc7c-ff19-48f4-b9c5-b90906682f45',
                'eae040f4-3c88-413d-abc9-b15774463d46',
                '8c6510dd-3b8a-4cfc-a5c5-323d53c6006f',
                '2ee58f9b-781b-469f-b1d8-1816842515c3',
            ]
            if(item.ref_pk && !ref_pks.includes(item.ref_pk)){ //有ref_pk且不属于refpks的展示 isShowUnit(业务单元)
                obj['isShowUnit']=true
            }
        } else if (item.type == '3') {
            //自然期间
            obj.itemtype = "datepicker"
            obj.placeholder = item.name
            dateObj = item.m_strKeyVal || { value: $nccPlatform.getBusinessInfo().businessDate.substring(0, 10), display: $nccPlatform.getBusinessInfo().businessDate.substring(0, 10) }
            dateCode = item.code || 'date'
            pk_periodkey=item.pk_keyword
        } else if (item.type == '4') {            
            //会计期间参照
            obj.queryOperateType = "=@";
            obj.itemtype = "refer"
            obj.refcode = item.refPath
            obj.whichKeyToDisplay = "auto"
            obj.placeholder = item.name
            obj.queryCondition = {
                pk_keygroup: _.get(hbschemeData, 'values.pk_keygroup.value'),
                pk_accperiodscheme: _.get(hbschemeData, 'values.pk_accperiodscheme.value')
            }
            dateObj = item.m_strKeyVal || { value: $nccPlatform.getBusinessInfo().businessDate.substring(0, 7), display: $nccPlatform.getBusinessInfo().businessDate.substring(0, 7) }
            dateCode = item.code || 'date'
            pk_periodkey=item.pk_keyword
        }
        keyWordItems.push(_.cloneDeep(obj))
    })
    //为单位参照添加过滤条件  因为是从别的item中拿到的数据，所以需要重新遍历
    if(needOrgRef){
        keyWordItems.forEach(item=>{
            if(item.attrcode=="corp"){
                item.queryCondition.pk_periodkey=pk_periodkey
                item.queryCondition.period=_.get(dateObj,'display')
            }
        })
    }
    return { keyWordItems, dateObj, dateCode }
}

/**
 * 设置查询区域快照
 * @param {*} keyWordRefInfo 关键字的信息
 * @param {*} searchAreaId 查询区域Id
 * @param {*} keyFilterItems 新添加的关键字的字段，为了过滤旧的关键字
 * @param {*} insertIndex 查询区插入的位置
 */
async function setSearchSnapItems(keyWordRefInfo,searchAreaId,keyFilterItems,insertIndex,needOrgRef){
    let snapAddList=[];
    keyWordRefInfo.forEach((item,idx)=>{
        let snapObj = {
            attrcode: item.code,
            initialvalue: { display: '', value: '' },
            isExtend: false,
            isconverttimezones: undefined,
            isfixedcondition: false,
            label: item.name,
            refpk: item.code,
            remove: false,
            visible: item.isVisible,
            required: true, // 是否必填
            isnotmeta: true,
            isdynamic: true,
            onlyOne: true
        };

        if (item.type == '1') { //字符     
            snapObj.itemtype = "input";
            snapObj.operationSign = "=@>@>=@<@<=@like@";

        } else if (item.type == '2' || item.type == '4') {//2参照  4会计期间（参照格式）          
            snapObj.itemtype = "refer";
            snapObj.operationSign = "=@";
        } else if (item.type == '3') {
            snapObj.itemtype = "datepicker";
            snapObj.operationSign = "=@>@>=@<@<=@like@";
        }              
        // if(!needOrgRef&&snapObj.attrcode!="corp"){
        //     snapAddList.push(_.cloneDeep(snapObj));
        // }
        if(snapObj.attrcode != "corp" || (snapObj.attrcode == "corp" && needOrgRef)){
            snapAddList.push(_.cloneDeep(snapObj));
            keyFilterItems.push(item.code);
        }
        
    });

     // 高级查询渲染
     let searchSnap = _.cloneDeep($appRoot.props.search.getSearchSnap(searchAreaId));
     //查询区的高级查询
     if (searchSnap.length == 1 && searchSnap[0].attrcode == 'root') {
         let searchInsertIndex = 0;
        //过滤掉上次的关键字
        searchSnap[0].children = searchSnap[0].children.filter((item) => {
            return keyFilterItems.indexOf(item.attrcode) == -1;
        });
         if (insertIndex) {
             searchInsertIndex = insertIndex;
         } else {
             searchSnap[0].children.map((item, index) => {
                 searchInsertIndex = item.isfixedcondition ? index + 1 : searchInsertIndex;
             });
         }
         searchSnap[0].children.splice(searchInsertIndex, 0, ...snapAddList);
    }else{
        let searchInsertIndex = 0;
        // 普通的高级查询
        searchSnap = searchSnap.filter((item) => {
            return keyFilterItems.indexOf(item.attrcode) == -1;
        });      
        if (insertIndex) {
            searchInsertIndex = insertIndex;
        } else {
            searchSnap.map((item, index) => {
                searchInsertIndex = item.isfixedcondition ? index + 1 : searchInsertIndex;
            });
        }
        searchSnap.splice(searchInsertIndex, 0, ...snapAddList);
    }

    $appRoot.props.search.setSearchSnap(searchAreaId, searchSnap);
    
}