/*
 * @Author: CongKe 
 * @PageInfo: 冻结原因 
 * @Date: 2018-09-10 10:15:01 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-09-10 10:23:45
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base } from 'nc-lightapp-front';
const { NCFormControl } = base;

export class FreezeReason extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};
	}
	onChange = (val) => {
		this.setState({ value: val });
		this.props.getFreezeReason(val);
	};

	render() {
		return (
			<div className="closeReason">
				<label>getLangByResId(this, '4004POORDER-000046')：</label>/* 国际化处理： 请输入冻结原因*/
				<NCFormControl
					className="demo-input"
					value={this.state.value}
					onChange={(val) => this.onChange(val)}
					size="sm"
				/>
			</div>
		);
	}
}
