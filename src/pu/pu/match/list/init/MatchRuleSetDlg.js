/*
 * @Author: xiahui 
 * @PageInfo: 匹配规则设置面板
 * @Date: 2019-05-24 17:14:18 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-06-18 19:07:15
 */
import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import '../index.less';

const { NCCheckbox } = base;

/** 匹配规则字段 */
const FIELDS = [
	'pk_org', // 财务组织
	'cvendorid', // 供应商
	'cmaterialvid', // 物料编码
	'castunitid', // 单位
	'cunitid', // 主单位
	'norigprice', // 无税单价
	'ntaxrate' // 税率
];

class MatchRuleSetDlg extends Component {
	constructor(props) {
		super(props);

		// 勾选状态
		this.state = {
			rule: props.matchRule
		};
	}

	// 变化时回调函数
	onChange = (field) => {
		this.state.rule[field].enable = !this.state.rule[field].enable;
		this.setState({
			rule: this.state.rule
		});
		this.props.setMatchRule(this.state.rule);
	};

	render() {
		return (
			<div className="match-rule-set-dlg">
				<div className="match-im">
					{FIELDS.map((field) => {
						let matchRule = this.state.rule[field];
						return (
							<div>
								<NCCheckbox
									checked={matchRule.enable}
									disabled={matchRule.required}
									onChange={this.onChange.bind(this, field)}
								/>
								{matchRule.display}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export { MatchRuleSetDlg };
