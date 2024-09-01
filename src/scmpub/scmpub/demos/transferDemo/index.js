/*
 * @Author: hufei 
 * @PageInfo: 穿梭框组件测试样例
 * @Date: 2018-04-13 15:40:07 
 * @Last Modified by: hufei
 * @Last Modified time: 2018-06-15 13:55:01
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import data from './data.json';
import { base, high } from 'nc-lightapp-front';
import './index.less';
const { Transfer } = high;
const { NCButton: Button } = base;
class TreeTransferTest extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: data,
			targetKeys: []
		};
	}
	onTargetKeysChange = (targetKeys) => {
		this.setState({
			targetKeys
		});
	};

	render() {
		const { dataSource, targetKeys, asyncSource, asyncTarget, asyncLoading } = this.state;
		const transferProps = {
			dataSource, // 原数据集合
			targetKeys, //目标框中数据的 key 集合
			// treeType: true, // treeType 为 true 时渲染树型穿梭，否则为列表穿梭，默认false
			onTargetKeysChange: this.onTargetKeysChange,
			showSearch: false, // 是否显示搜索框
			// checkable: false, // 只在 type=='tree' 时生效，checkable 为 true，只穿能梭叶子节点，默认为 true
			className: 'my-transfer-demo', // 自定义穿梭框的类名，用于写自己的样式
			showMoveBtn: true //是否显示排序按钮，默认为 false
			// listRender: ({ key, title }) => key + ' ' + title
		};
		return (
			<div className="demo-page">
				<Transfer {...transferProps} />
				<div className="footer">
					<Button
						className="btn-color btn-confirm"
						onClick={() => {
							console.log('能拿到目标框中的元素key集合，用于保存', this.state.targetKeys);
						}}
					>
						确定
					</Button>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<TreeTransferTest />, document.querySelector('#app'));
