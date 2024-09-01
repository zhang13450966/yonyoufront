/*
 * @Author: huangkwf
 * @Date: 2018-05-28 15:23:04
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-07-23 16:29:40
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
const { NCCheckbox: Checkbox } = base;

export default class Item extends Component {
	constructor(props) {
		super(props);
	}
	itemClick = () => {
		let { item } = this.props;
		this.props.itemClick(item);
	};
	render() {
		let { item, checked, isDisabled } = this.props;
		let disabled = isDisabled ? ' disabled' : '';
		return (
			<li
				className={`m-transfer-list-content-item${disabled} nc-theme-disabled-font-c nc-theme-common-font-c nc-theme-xrow-bgc`}
				fieldid={`m-transfer_${this.props.item.key}`}
				onClick={isDisabled ? () => { } : this.itemClick}
			>
				<Checkbox
					onClick={isDisabled ? () => { } : this.itemClick}
					checked={checked}
					disabled={isDisabled}
				/>
				<span>{item.title}</span>
			</li>
		);
	}
}
