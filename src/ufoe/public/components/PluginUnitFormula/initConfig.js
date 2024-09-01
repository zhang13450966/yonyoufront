import data from "./mockData.json";

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}}

console.log('模拟公式数据',data.data.tabs);/* 国际化处理： 模拟公式数据*/
 let defaultPropsConfig = {
   //当前活跃 公式内容框 初始化接收值 可定向渲染 后续函数内部每次改变会调用回调 
      formulaAreaActive : {
        key:"key1",
        content:""
      },
      formulaAreaConfig : {
        tabConfig :[
            {
                  key:"key1",
                  name:$appRoot && $appRoot.state.json['public_lang-000147']/* 国际化处理： 切换1*/
            }
        ],
        
    },
    // 公式内容区域初始化值
    contentConfig :[
        {
            key:"key1",
            content:"",//如果有值  在切换或者初始化进入以后会渲染该值
        }
    ],
    symbolAreaConfig :[
        {
          key:"key1",//关联 头部tab 不同tab 不同符号适配  formulaAreaConfig tabConfig key
          operator:[
              { name: "+" },
              { name: "-" },
              { name: "*" },
              { name: "/" },
              { name: ">" },
              { name: "<" },
              { name: "<=" },
              { name: ">=" },
              { name: "=" },
              { name: "<>" },
              { name: "?" },
              { name: "%" },
          ],
          relation:[
              { name: "AND" },
              { name: "OR" },
              { name: "LIKE" },
          ]
        }
    ],
    //是否共用符号 若为true 那么只会使用  symbolAreaConfig中 第一个  可以不传入后续的符号  operator   relation 信息  但是 key 必须传入
    whetherShareSymbol:true,
    // 下半区域
    funcAreaConfig : data.data.tabs,
    funcAreaTab:[
      {
        key: 0,
        name: $appRoot && $appRoot.state.json['public_lang-000148'],/* 国际化处理： 常用函数*/
      },
      {
        key: "key2",
        name: $appRoot && $appRoot.state.json['public_lang-000149'],/* 国际化处理： 一般函数*/
      },
      {
        key: "key3",
        name: $appRoot && $appRoot.state.json['public_lang-000150'],/* 国际化处理： Excel函数*/
      }
    ],
    
    
}

export  default defaultPropsConfig;

