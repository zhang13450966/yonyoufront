/*
 * @Author: wangceb
 * @PageInfo: 供应链列表单据号超链接样式
 * @Date: 2019-07-17 15:38:56
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 09:16:40
 */
import React, { Component } from 'react';

export default class BillCodeHyperLink extends Component {
	render() {
		return (
			<span className="code-detail-link" onClick={this.props.onClick}>
				{this.props.value}
			</span>
		);
	}
}
