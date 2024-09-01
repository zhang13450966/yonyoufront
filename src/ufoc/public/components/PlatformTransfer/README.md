<!--
 * @Author: bbqin
 * @Date: 2021-07-19 09:47:25
 * @LastEditTime: 2021-07-19 09:47:41
 * @LastEditors: bbqin
 * @Description: 啥功能呢
 * @FilePath: \Platform_Front\src\platform\base\TransferBox\README.md
 * 这锅我不背
-->

# transfer 使用说明

## 功能描述
- 该组件分两种类型：列表型穿梭框和树型穿梭框，通过 treeType 来切换；
- 在树形穿梭框时，根据业务需求，又分两种情形：可以穿梭父节点和只穿梭最底层的叶子节点，根据参数 checkable 来切换

## 参数说明

|参数|说明|类型|默认值|
|:--|:--|:--|:--|
|dataSource|设置数据源|[]|[]|
|targetKeys|展示在右边列表的数据的 key 集合|[]|[]|
|treeType|指定穿梭框渲染的类型，如果treeType为 true,左边渲染的是树型穿梭框，否则为列表穿梭|boolean|false|
|onTargetKeysChange|当右边列表的数据发生变化时执行的回调|func|-|
|showSearch|是否显示搜索框|boolean|false|
|searchPlaceholder|搜索框的提示文字|string|'请输入内容'|
|checkable|只在 treeType 为true时生效，checkable 为 true时，只穿梭叶子节点|boolean|true|
|className|自定义穿梭框的类名，用于写自己的样式|string|-|
|showMoveBtn|是否显示排序按钮|boolean|false|
|titles|自定义左右两边顶部的title|[]|[ '来源', '目标' ]
|operations|自定义穿梭按钮的内容|[]|[ '', '' ]|
|notFoundContent|列表为空时显示的内容|string|'暂无数据'|
|listRender|列表渲染的字段内容|func\|\|string| (item, title) => item[title]|

## 示例
```js
import React, { Component } from 'react';
import Transfer from '../Transfer';

let dataSource = [
    {
        "key": "1",
        "title": "齐齐哈尔",
        "children": [
            {
                "key": "1-1",
                "title": "A区",
                "children": [
                    {
                    "key": "1-1-1",
                    "title": "齐齐哈尔大学"
                    }
                ]
            }
        ]
	},
	{
        "key": "2",
        "title": "佳木斯",
        "children": [
            {
                "key": "2-1",
                "title": "B区",
                "children": [
    	            {
                        "key": "2-1-1",
                        "title": "佳木斯大学"
                    }
                ]
    	    }
        ]
    }
]


export default class TreeTransferDemo extends Component {
	constructor() {
		super();
		this.state = {
			dataSource,
			targetKeys: []
		};
	}
	onTargetKeysChange = (targetKeys) => {
		this.setState({
			targetKeys
		});
	};

	render() {
		const { dataSource, targetKeys } = this.state;
		const transferProps = {
			dataSource,
			targetKeys,
			rowKey: 'key', // 和默认值相同时可以不指定
			rowTitle: 'title',
			rowChildren: 'children',
			treeType: true,
			onTargetKeysChange: this.onTargetKeysChange,
			checkable: true,
			className: 'my-transfer-demo',
			showMoveBtn: true,
			listRender: ({ key, title }) => key + ' ' + title
		};
		return <Transfer {...transferProps} />
	}
}

```
