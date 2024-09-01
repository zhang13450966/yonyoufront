公式编辑器设计文档
inintConfig.js: 数据性配置  可后台整文件替代 json
initFunction.js:方法性配置  可直接在此处进行自定义也可以外部传入 此处定义可以作为模块适配使用
设计准则 ：
    当只有一个tab页的时候 顶部 tab 不显示
   所有回调第一个参数为 组件this 可通过组件this 访问组件所有数据以及方法 
   每一个关键回调都会有回调名+Stop 作为标识参数  如果识别到该参数 并且为true 内部事件会停止 不会执行 只会执行 外部传入的回调 若外部没有回调传入 则不作任何操作(当然 如果不支持 那也没关系 应该是没做 但是不会报错 Mendege)
   所有涉及请求的方法  统一返回 promise 
模型分区
1.顶部tab 
2.公式内容区域
3.计算区域
A.确定 取消 验证 按钮以及 验证提示 区域
4.下部tab
5.与下部tab共存的搜索区域
6.函数列表区域
7.函数使用区域
8.底部按钮区域

1、2 区域为一一对应区域 1控制2 向全组件区域抛出 当前tab key 以及 tab content 
<!-- data： 叙述中按照区域叙述  参数传入时 分为不同对象 如  config:{}  customRender:{}
        公式区域数据配置 必须传入
        formulaAreaConfig:{
            tabConfig：[
               {
                    key:"tab1",
                    name:"切换1"
               }
            ]
        },
        // 公式内容区域初始化值
        contentConfig :[
            {
                key:"key1",
                content:"公式1",//如果有值  在切换或者初始化进入以后会渲染该值
            },
            {
            key:"key2",
            content:"公式2",//如果有值  在切换或者初始化进入以后会渲染该值
        }
        ],
        //公式区域自定义渲染方法  非必传 如果传入 则会放弃内部渲染机制
        formulaAreaRender:{
            // elem 内部预备渲染的元素  支持弱修改处理 
            tabRender:function(that,data,elem){//tab渲染自定义函数

            },
            contentRender:function(that,data,elem){//默认的渲染为单独的 

            }
        },
        //当前活跃 公式内容框 初始化接收值 可定向渲染 后续函数内部每次改变会调用回调 
        formulaAreaActive:{
            key:"key1",
            content:""
        }
        //每次内容改变以后回调  type "tab" 切换tab "content" : 内容区域变化 
         // prev 当前 active  next 下一步 active
        formulaAreaTabChange:function(that,type,prev,next){

        }

     -->
3.计算区域 
<!-- 该区域为独立区域 接收配置 完成渲染 同时 接收自定义渲染  以及传入回调
    symbolAreaConfig:[
        {
          key:"key1",//关联 头部tab 不同tab 不同符号适配
          operator:[
              { 
                  name: "+",
                  key:"+",//如果不传  内部会按照name 自动生成
               },
             
             
          ],
          relation:[
              { 
                  name: "AND",
                  key:"AND"
               },
             
          ]
      }
    ]
    whetherShareSymbol:true,
    symbolAreaRender:function(that,data,elem){

    }
    //该方法 为 单向回调  
    symbolAreaClick:function(that,data){

    },
    //校验方法 存在且返回true 程序继续运行 否则 程序停止运行 data 当前点击 
    symbolAreaVerify:function(that,data){

    }


   -->
4.下部tab
5.与下部tab共存的搜索区域
6.函数列表区域
7.函数使用区域
4567 为关联区域 4控制5 控制6 控制7 层级控制  本区域统称函数区域
<!-- 
    funcAreaConfig:[
      {
        "tabName": "常用函数",//tab name
        key:0,//tab  key 如果没有 内部会自动生成
        "funcTypes": [
          {
            "funcTypeName": "报表变量", //函数分类name
            funcTypeKey:0,//报表分类 key 如果没有 内部会自动生成
            "funcs": [
              {
                "funcFormat": "PAGEDIM(页维度,显示内容)", //函数name
                "info": {
                  "funcName": "PAGEDIM",
                  "funcType": 1,
                  "paramTypeList": [6, 0],
                  "returnType": 2,
                  "funcDesc": "取页维度值",
                  "paramNames": ["页维度", "显示内容"],
                  "fixedParam": true,
                  "paramRefProcesses": [
                    "com.ufida.report.free.plugin.formula.AnaFormulaPageDimProcessor",
                    "com.ufida.report.free.plugin.formula.AnaFormulaPageDimValueProcessor"
                  ],
                  "isNeedWizard": true
                },
                "paramLen": "2",
                "paramList": [
                  "页维度",
                  "纯字符串，如'abc'",
                  "显示内容",
                  "整数，如1,2"
                ],
                "processorMapping": {
                  "com.ufida.report.free.plugin.formula.AnaFormulaPageDimValueProcessor": {
                    "0": "实际值",
                    "1": "显示值"
                  }
                },
                "funcCode": "PAGEDIM",
                "funcName": "PAGEDIM",
                "simpDesc": "取页维度值",
                "valueIndex": {},
                "status": "0",
                "m_isDirty": false
              },
              {
                "funcFormat": "FRQUERYITEM(查询项,显示内容)",
                "info": {
                  "funcName": "FRQUERYITEM",
                  "funcType": 1,
                  "paramTypeList": [6, 0],
                  "returnType": 2,
                  "funcDesc": "取查询项值",
                  "paramNames": ["查询项", "显示内容"],
                  "fixedParam": true,
                  "paramRefProcesses": [
                    "com.ufida.report.free.plugin.formula.AnaFormulaFrQueryItemProcessor",
                    "com.ufida.report.free.plugin.formula.AnaFormulaRealOrDisValueProcessor"
                  ],
                  "isNeedWizard": true
                },
                "paramLen": "2",
                "paramList": [
                  "查询项",
                  "纯字符串，如'abc'",
                  "显示内容",
                  "整数，如1,2"
                ],
                "processorMapping": {
                  "com.ufida.report.free.plugin.formula.AnaFormulaRealOrDisValueProcessor": {
                    "0": "实际值",
                    "1": "显示值"
                  }
                },
                "funcCode": "FRQUERYITEM",
                "funcName": "FRQUERYITEM",
                "simpDesc": "取查询项值",
                "valueIndex": {},
                "status": "0",
                "m_isDirty": false
              }
            ],
            "valueIndex": {},
            "status": "0",
            "m_isDirty": false
          },
         
        ],
        "valueIndex": {},
        "status": "0",
        "m_isDirty": false
      },
     
    ],
    funcAreaActive:{
        activeTabKey:"",
        activefuncKey:"",
        activeFuncFormatName:"",//当前选中函数名
    }
    //tab切换回调
    funcAreaClick:function(that,){

    },
    //分类展开收起回调
    funcClassifyClick:function(that){

    }
    //函数点击回调
    funcFormatClick:function(){

    },
    //生成函数列表dom  info 函数对象  event 原本应该挂载在  使用函数上的事件
    //可以 不使用  在自定义弹窗内容时 可以使用 以后的内容
    createFunDom:function(that,info,event){

    }
    //生成 使用区域 dom data 当前选中的函数信息 funcs.info
    selectedValueDom:function(that,data,elem){

    }

 -->
A.确定 取消 验证 按钮以及 验证提示 区域
<!-- 
    confirmConfig:{
        //event:{confirmClick:fun,cancelClick:fun,verifyClick:fun}内部原有事件 可以直接使用 
        //内部逻辑可衔接 
        confirmDom:function(that,event){

        },
        //提示区域自定义dom
        promptAreaDom:function(that,data){

        },
        confirmCallback:{
            confirmCallbackStop:true,
            confirmCallback:fun,//确定回调
            cancelCallback:fun,//取消回调
            verifyCallback:fun,//验证回调
        }
    }
 -->

8.底部按钮区域 
<!-- 
    暂时 未提供  后续提供 
 -->

 