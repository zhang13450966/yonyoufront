/*
 * @Author: hufei
 * @PageInfo: 主组织参照组件  说明：如果是平台提供的统一参照，需在调用的地方传入 refPath 指明调用的是哪个参照，refPath 格式为：'customer/ChannelTypeGridRef'(注意：customer前面没有/)；如果是自己写的参照，需要传入 refCode ,refType 等信息
 * @Date: 2018-04-23 16:54:34
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 09:33:47
 */

import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
import './index.less';
const { Refer } = high;
let { ReferLoader } = Refer;

export default class MainOrgRef extends Component {
	constructor(props) {
		super(props);
		this.state = {
			refValue: props.value || {}
		};
	}

	onChange = (refValue) => {
		this.setState({ refValue }, () => this.props.onChange(refValue));
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value) {
			this.setState({ refValue: nextProps.value });
		}
	}

	render() {
		let { className, refPath, required, ...others } = this.props;
		if (refPath && !refPath.includes('/index')) {
			refPath += '/index';
		}
		let referconf = {
			multiLang: {
				domainName: 'scmpub',
				currentLocale: 'zh-CN',
				moduleId: 'refer'
			},
			columnConfig: [
				{
					name: [ 'REFER-000001', 'REFER-000002' ] /* 国际化处理:编码,名称*/,
					code: [ 'refcode', 'refname' ]
				}
			]
		};
		return (
			<div className={className ? `main-org ${className}` : 'main-org'}>
				{required && <span className="required">*</span>}
				{refPath ? (
					<ReferLoader
						fieldid="Main_org"
						{...others}
						value={this.state.refValue}
						onChange={this.onChange}
						refcode={`uapbd/refer/${refPath}`}
					/>
				) : (
					<Refer
						fieldid="Main_org"
						{...others}
						{...referconf}
						value={this.state.refValue}
						onChange={this.onChange}
					/>
				)}
			</div>
		);
	}
}
MainOrgRef.defaultProps = {
	placeholder: '参照名称',
	onChange: () => {
		console.log('主组织组件缺少 onChange 回调函数');
	}
};
