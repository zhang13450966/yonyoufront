## 用途

> 根据页面表格或者传入数据，调用浏览器打印功能进行打印， 接受三个参数

## 参数

### 第一个参数

| 字段 | 功能 | 默认值 |
|-----|------|-------|
| root | 包裹table的dom元素，请不要使用table组件自带的table-scroll啥的 | - |

### 第二个参数
| 字段 | 功能 | 默认值 |
|-----|------|-------|
| title | 标题 | - |
| maker | 制作者的多语言文案 | - |
| date | 制作日期的多语言文案 | - |
| maxColLen | 每一行最多几列 | 8 |
| beforeHtml | 在表格上方的htm字符串 | - |
| afterHtml | 在表格下方的html字符串 | - |
| beforeAppend | 允许用户在生成页面前处理表格数据 参数是表格三维数组，需要返回同样的三维数组 | - |

### 第三个参数
| 字段 | 功能 | 默认值 |
|-----|------|-------|
| data | 表格数据 | - |
| tableTmp | 模版里对应的表格信息 | - |

## 用法

```js
print(document.getElementById('keyPsnMainTable'), {
    title: language['hi6007-000244'],
    maker: language['hi6007-000245'],
    date: language['hi6007-000246'],
    beforeAppend: (data) => {
        data[0].map((item) => {
            item.splice(0, 1);
        });
        data[1].map((item) => {
            item.splice(item.length - 1, 1);
        });
        data[1].map((item) => {
            if(/false/.test(item[2])) {
                item[2] = hisOptions['N']
            }
            else if(/true/.test(item[2])) {
                item[2] = hisOptions['Y']
            }
        });

        return data;
    }
}, {
    data: [{
        values: {
            name: {
                value: 'sss'
            }
        }
    }],
    tableTmp: template['ncc60071025list']
});
```