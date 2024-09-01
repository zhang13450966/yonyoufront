/*
 * @Author: hufei 
 * @PageInfo: 扩展公式编辑器右侧的项目和内容页签
 * @Date: 2018-12-20 14:10:16 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-27 16:30:15
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
let { NCRow: Row, NCCol: Col } = base;
import './items.less';

export default class Items extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fieldData: [], //当前选中项下的内容信息
			leftSelectedItem: null, //当前选中项目的displayName
			rightSelectedItem: null // 当前选中内容的displayName
		};
	}

	// 创建列表内容
	createContent(data, position) {
		return data.map((eve) => {
			const { displayName, inputSig, hintMsg } = eve;
			return (
				<li
					data-name={inputSig}
					data-explain={hintMsg}
					data-title={displayName}
					onDoubleClick={position == 'right' ? this.handleDbList : null}
					onClick={() => {
						this.setState({ [position + 'SelectedItem']: displayName });
					}}
					className={displayName == this.state[position + 'SelectedItem'] ? 'selected-item' : ''}
				>
					{displayName}
				</li>
			);
		});
	}

	// 双击列表的回调
	handleDbList = (e) => {
		const { itemsData } = this.props;
		if (itemsData.length) {
			const { name } = e.target.dataset;
			this.props.setName(name);
		}
	};

	//单击第一列字段列表的回调
	handleItemsList = (e) => {
		const { setExplain, itemsData } = this.props;
		const { explain, title } = e.target.dataset;
		if (itemsData.length) {
			setExplain(explain);
			this.getFieldData(title);
		}
	};

	// 单击第二列字段列表的回调
	handleFieldList = (e) => {
		this.props.setExplain(e.target.dataset.explain);
	};

	// 获取字段的数据
	getFieldData = (title) => {
		let current = this.props.itemsData.find((item) => item.displayName === title);
		if (current) {
			this.setState({
				fieldData: current.children
			});
		}
	};

	render() {
		const { fieldData } = this.state;
		const { itemsData } = this.props;
		return (
			<div className="items-area">
				<ul className="items-left" onClick={this.handleItemsList}>
					{this.createContent(itemsData, 'left')}
				</ul>

				<ul className="items-right" onClick={this.handleFieldList}>
					{this.createContent(fieldData, 'right')}
				</ul>
			</div>
		);
	}
}
