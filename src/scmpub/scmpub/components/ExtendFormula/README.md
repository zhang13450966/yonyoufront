# 公式编辑器扩展

## 需要的接口
1. 查询底部左侧公式页签的接口（写在传给组件的formulaUrl参数）
2. 查询右侧项目和内容的接口（写在components/items.js的componentDidMount中）
3. 公式验证的接口（写在传给组件的validateUrl参数）


## 页面传参示例
- 可以参考price/price/tariffdef/list/index.js中对平台提供的公司编辑器的使用方法

```js
import Items from '../ExtendFormula/components/items';

<ExtendFormula
    onHide={() => {
        this.setState({ show: false });
    }} //点击x按钮的回调
    onCancel={() => {
        this.setState({ show: false });
    }} //点击取消的回调
    onOk={(value) => {
        console.log(value); // 在确定按钮的回调中可以拿到已录入公式的值，在这里取值后调用表格的方法给表格设值
    }} //点击确定回调
    // isValidateOnOK={false} // 点击确定时是否要对公式校验，默认为true
    value={''} //对公式编辑器的输入框设初始值
    show={this.state.show} //控制公式编辑器的显示和隐藏
    metaParam={{
        pk_billtype: 'CM02',
        bizmodelStyle: 'fip',
        classid: ''
    }} //获取原数据属性的参数？？？具体作用暂时未知
    formulaUrl="formulaUrl"
    validateUrl="validateUrl"
    extendBtns={{
        if: '如果',
        else: '否则',
        then: '则',
        and: '并且',
        or: '或者'
    }} // 传进去的按钮数据，这里需要配合多语使用

    /* 以下为固定的参数 */
    className="extend-formulaEditor"
    noShowAttr={[ '元数据属性', '表和字段' ]} // 过滤字段页签，当为["all"]时都不显示，可以只显示配置里传进去的字段页签数据
    attrConfig={[
        {
            tab: '项目和内容',
            key: 'items',
            TabPaneContent: Items
		}
		// params 可选, 给Items传递props, 根据需要来传
            params: {
                xxx:'xxx' // 这里相当于在给Items组件传递了一个props xxx
            }
    ]} //给属性部分添加自定义页签
/>
```


## 数据结构
formulaUrl接口
```json
{
	"data": [
		{
			"displayName": "MAX",
			"inputSig": "max(,)",
            "hintMsg": "求最大值"
        },
        {
			"displayName": "MIN",
			"inputSig": "min(,)",
            "hintMsg": "求最小值"
        }
    ]
}

```

查询右侧项目和内容的接口
```json
{
	"data": [
		{
			"displayName": "常用公式",
			"inputSig": "",
			"hintMsg": "常用公式",
			"children": [
				{
					"displayName": " ( {检验范围上限} - {实际检验值} ) / {扣吨或调价调整基数} * {扣吨或调价调整幅度} ",
					"inputSig": " ( {检验范围上限} - {实际检验值} ) / {扣吨或调价调整基数} * {扣吨或调价调整幅度} ",
					"hintMsg": " ( {检验范围上限} - {实际检验值} ) / {扣吨或调价调整基数} * {扣吨或调价调整幅度}"
				},
				{
					"displayName": " ( {实际检验值} - {检验范围下限} ) / {扣吨或调价调整基数} * {扣吨或调价调整幅度} ",
					"inputSig": " ( {实际检验值} - {检验范围下限} ) / {扣吨或调价调整基数} * {扣吨或调价调整幅度} ",
					"hintMsg": " ( {实际检验值} - {检验范围下限} ) / {扣吨或调价调整基数} * {扣吨或调价调整幅度} "
				}
			]
		},
		{
			"displayName": "当前检验项目",
			"inputSig": "",
			"hintMsg": "当前检验项目",
			"children": [
				{
					"displayName": "基准值下限",
					"inputSig": "{基准值下限}",
					"hintMsg": "基准值下限"
				},
				{
					"displayName": "基准值上限",
					"inputSig": "{基准值上限}",
					"hintMsg": "基准值上限"
				}
			]
		},
		{
			"displayName": "检验信息",
			"inputSig": "",
			"hintMsg": "检验信息",
			"children": [
				{
					"displayName": "实际检验值",
					"inputSig": "{实际检验值}",
					"hintMsg": "实际检验值"
				}
			]
		},
		{
			"displayName": "采购入库单",
			"inputSig": "",
			"hintMsg": "采购入库单",
			"children": [
				{
					"displayName": "应入库数",
					"inputSig": "{应入库数}",
					"hintMsg": "应入库数"
				}
			]
		},
		{
			"displayName": "到货单",
			"inputSig": "",
			"hintMsg": "到货单",
			"children": [
				{
					"displayName": "到货数量",
					"inputSig": "{到货数量}",
					"hintMsg": "到货数量"
				}
			]
		},
		{
			"displayName": "采购合同",
			"inputSig": "",
			"hintMsg": "采购合同",
			"children": [
				{
					"displayName": "采购合同本币含税单价",
					"inputSig": "{采购合同本币含税单价}",
					"hintMsg": "采购合同本币含税单价"
				},
				{
					"displayName": "采购合同数量",
					"inputSig": "{采购合同数量}",
					"hintMsg": "采购合同数量"
				}
			]
		},
		{
			"displayName": "当前检验标准",
			"inputSig": "",
			"hintMsg": "当前检验标准",
			"children": [
				{
					"displayName": "扣吨或调价调整基数",
					"inputSig": "{扣吨或调价调整基数}",
					"hintMsg": "扣吨或调价调整基数"
				},
				{
					"displayName": "扣吨或调价调整幅度",
					"inputSig": "{扣吨或调价调整幅度}",
					"hintMsg": "扣吨或调价调整幅度"
				},
				{
					"displayName": "检验范围下限",
					"inputSig": "{检验范围下限}",
					"hintMsg": "检验范围下限"
				},
				{
					"displayName": "检验范围上限",
					"inputSig": "{检验范围上限}",
					"hintMsg": "检验范围上限"
				}
			]
		},
		{
			"displayName": "采购订单",
			"inputSig": "",
			"hintMsg": "采购订单",
			"children": [
				{
					"displayName": "采购订单本币含税单价",
					"inputSig": "{采购订单本币含税单价}",
					"hintMsg": "采购订单本币含税单价"
				},
				{
					"displayName": "采购订单数量",
					"inputSig": "{采购订单数量}",
					"hintMsg": "采购订单数量"
				}
			]
		},
		{
			"displayName": "其它",
			"inputSig": "",
			"hintMsg": "其它",
			"children": [
				{
					"displayName": "基准含税单价",
					"inputSig": "{基准含税单价}",
					"hintMsg": "基准含税单价"
				}
			]
		}
	],
	"error": null,
	"formulamsg": null,
	"success": true
}

```