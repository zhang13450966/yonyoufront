## 基本结构
- 主体 card-content 其中可以传入style来改变整个卡片的背景或者位置等样式参数
- 头部 card-head 卡片标题
- 主体部 roll 包含主要的数字以及描述
- 尾部 card-foot 卡片脚部，包含刷新按钮以及ICon
## 基本使用

(```)

import ButtonCard from '../../../../hrpub/common/components/hr-card';//引入组件
//组件应用
<ButtonCard 
        reflashClick = {onclick}
        Description = {{
        title:"入职办理",      
        titleDes:"盼我疯魔还盼我孑孓不独活，想我冷艳还想我轻佻又下贱", 

    numberArr:[{number:"88",numberDes:"入职啦",state:false,onClick:onclick1},
                {number:"98",numberDes:"入职嘞" ,state:true,onClick:onclick1},  
               {number:"48",numberDes:"入职嘿",state:true,onClick:onclick1},     
               {number:"58",numberDes:"入职吼",state:true,onClick:onclick1}       
             ],
                 img:'../../../public/images/turnRight.png'                  
             }} />

(```)

## 参数配置
- 头部    Description   title:卡片标题部分 titleDes:标题部分的主体解释部分
- 主体部   numberArr:数组   number:数字 numberDes:数字正下的描述 state:false为红色，true为正常 onClick:为该数字的点击回调
- 尾部   reflashClick:刷新按钮事件传入 img:右下角的小图标
