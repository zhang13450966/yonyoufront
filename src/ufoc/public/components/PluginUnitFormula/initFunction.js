let defaultPropsCallback = {
    symbolAreaRender:null,
    //该方法 为 单向回调  
    symbolAreaClick:null,
    //校验方法 存在且返回true 程序继续运行 否则 程序停止运行 data 当前点击 
    symbolAreaVerify:null,
    //公式区域自定义渲染方法  非必传 如果传入 则会放弃内部渲染机制
    formulaAreaRender:{
        // elem 内部预备渲染的元素  支持弱修改处理 
        tabRender:null,
        contentRender:null
    },
    
    //每次内容改变以后回调  type "tab" 切换tab "content" : 内容区域变化 
     // prev 当前 active  next 下一步 active
    formulaAreaTabChange:null,
    // +++++++++++++++++ 下半部区域 
    //下半区域tab切换回调
    funcAreaClick:null,
    //分类展开收起回调
    funcClassifyClick:null,
    //函数点击回调
    funcFormatClick:null,
    //生成 使用区域 dom data 当前选中的函数信息 funcs.info
    selectedValueDom:null,
     //生成函数列表dom  info 函数对象  event 原本应该挂载在  使用函数上的事件
    //可以 不使用  在自定义弹窗内容时 可以使用 以后的内容
    createFunDom:null,
    confirmConfig:{
        //event:{confirmClick:fun,cancelClick:fun,verifyClick:fun}内部原有事件 可以直接使用 
        //内部逻辑可衔接 
        confirmDom:null,
        //提示区域自定义dom
        promptAreaDom:null,
        confirmCallback:{
            confirmCallbackStop:true,
            confirmCallback:null,//确定回调
            cancelCallback:null,//取消回调
            verifyCallback:null
        }   
    },
    requestFuncAreaConfig:null,
    // 公式参数方法  该方法为配置型方法  如果某个公式 需要额外参数 请传入该方法 并且最终生成的是 对象 以公式地址作为key 
    // 可以联系相应后台 或者前端获取key值  ---Mendeg
    getParms :function(key){
            return {};
    }
}
export default defaultPropsCallback;
