/*
 * @Author: zhangbfk
 * @PageInfo: 适用于TMS0002 TMS生成系统单据的默认交易类型
 * @Date: 2018-07-24 16:07:45 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-03-28 11:24:31
 */

import React, { Component } from 'react';
import { ajax, createPage } from 'nc-lightapp-front';
import { showWarningInfo } from '../../pub/tool/messageUtil.js';
import TransTypeGridRef from '../../../../uap/refer/riart/transtype/index.js';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';

class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data;
		this.state = {
			intransitLossType: null, //签收途损单
			payablebillType: null //应付单
		};
		this.getData();
	}

	componentDidMount() {
		this.props.modal.show('param-panel');
		initLang(this, [ '4001busiparam' ], 'scmpub', () => {
			this.setState(this.state);
		});
	}

	// 确定按钮保存数据,然后关闭模态框
	closeModal = (flag) => {
		let targetKeys = [];
		let param, valueStr;
		if (flag) {
			if (!this.state.intransitLossType.refcode || !this.state.payablebillType.refcode) {
				showWarningInfo(null, getLangByResId(this, '4001BUSIPARAM-000020'));
				return;
			}
			targetKeys.push(this.state.intransitLossType.refcode);
			targetKeys.push(this.state.payablebillType.refcode);
			valueStr = targetKeys.join(',');
			// 单独修改
			this.data.sysinitvo.value = valueStr;
			param = this.data;
		}
		this.props.valueChange(param);
	};

	onChange = (key, val) => {
		if (key == 'intransitLossType') {
			this.setState({
				intransitLossType: val
			});
		} else if (key == 'payablebillType') {
			this.setState({
				payablebillType: val
			});
		}
	};

	// 查询数据
	getData = () => {
		let str = this.data.sysinitvo.value;
		if (!str) {
			return;
		}
		let billTytpCode = str.split(',');
		ajax({
			url: '/nccloud/scmpub/param/tms0002Query.do',
			data: billTytpCode,
			success: (res) => {
				if (res.data) {
					let intransitLossVal = {};
					if (res.data['4453']) {
						intransitLossVal = {
							refname: res.data['4453'][0].display,
							refpk: res.data['4453'][0].value.refpk,
							refcode: res.data['4453'][0].value.refcode
						};
					}
					let payablebillVal = {};
					if (res.data['F1']) {
						payablebillVal = {
							refname: res.data['F1'][0].display,
							refpk: res.data['F1'][0].value.refpk,
							refcode: res.data['F1'][0].value.refcode
						};
					}
					this.setState({
						intransitLossType: intransitLossVal,
						payablebillType: payablebillVal
					});
				}
			}
		});
	};

	render() {
		let { createModal } = this.props.modal;
		return createModal('param-panel', {
			width: '600px',
			height: '245px',
			title: getLangByResId(this, '4001BUSIPARAM-000000') /* 国际化处理： 动态参数设置*/,
			content: (
				<div className="scm-param-tms0002">
					<div className="title">{getLangByResId(this, '4001BUSIPARAM-000021') /* TMS生成系统单据的默认交易类型*/}</div>
					<div className="ref-item">
						<span className="ref-label  nc-theme-common-font-c">
							{getLangByResId(this, '4001BUSIPARAM-000022') /*签收途损单:*/}
						</span>
						<span>
							<TransTypeGridRef
								onChange={this.onChange.bind(this, 'intransitLossType')}
								value={this.state.intransitLossType}
								required={true}
								queryCondition={() => ({
									parentbilltype: '4453'
								})}
							/>
						</span>
					</div>
					<div className="ref-item">
						<span className="ref-label  nc-theme-common-font-c">
							{getLangByResId(this, '4001BUSIPARAM-000023') /*应付单:*/}
						</span>
						<span>
							<TransTypeGridRef
								onChange={this.onChange.bind(this, 'payablebillType')}
								value={this.state.payablebillType}
								required={true}
								queryCondition={() => ({
									parentbilltype: 'F1'
								})}
							/>
						</span>
					</div>
				</div>
			),
			beSureBtnClick: () => this.closeModal(this.props.editMode == 'edit'), //点击确定按钮事件
			cancelBtnClick: () => this.closeModal(false), //取消按钮事件回调
			closeModalEve: () => this.closeModal(false), //关闭按钮事件回调
			disableLeftBtn: this.props.editMode !== 'edit',
			userControl: true
		});
	}
}
export default createPage({})(ParamPanel);
