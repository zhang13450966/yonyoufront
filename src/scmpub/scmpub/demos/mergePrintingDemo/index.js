/*
 * @Author: hufei 
 * @PageInfo: 合并打印组件使用示例
 * @Date: 2018-04-24 14:27:00 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:53:20
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base } from 'nc-lightapp-front';
import propsData from './propsData.json';
import MergePrinting from '../../components/MergePrinting/index';
const { NCButton: Button } = base;

class MergePrintingDemo extends Component {
	constructor() {
		super();
		this.state = {
			showConditionModal: false
		};
	}

	toggleConditionModal = () => {
		this.setState({ showConditionModal: !this.state.showConditionModal });
	};

	render() {
		const MergePrintingProps = {
			jsonData: propsData,
			// 确定按钮获取数据
			onConfirm: this.onConfirm,
			// 取消按钮控制隐藏
			onCancel: this.onCancel,
			toggleConditionModal: this.toggleConditionModal,
			showConditionModal: this.state.showConditionModal
		};
		return (
			<div className="demo-page">
				<Button onClick={this.toggleConditionModal}>点击显示</Button>
				<MergePrinting {...MergePrintingProps} />
			</div>
		);
	}
}
ReactDOM.render(<MergePrintingDemo />, document.getElementById('app'));
