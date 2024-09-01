/*
 * @Author: xiahui
 * @PageInfo: 脚本操作对话框
 * @Date: 2019-03-14 16:22:31
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-21 22:12:02
 */
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import './index.less';

const { NCTextArea } = base;

class ScriptActionDlg extends Component {
	constructor() {
		super();
		this.state = {
			reason: null, // 执行原因
		};
	}

	onChangeReason = reason => {
		this.setState({
			reason: reason,
		});
		this.props.changeData(reason);
	};

	render() {
		return (
			<NCTextArea
				onChange={this.onChangeReason}
				value={this.state.reason}
				placeholder={this.props.title}
				rows="4"
			/>
		);
	}
}

export default ScriptActionDlg;
