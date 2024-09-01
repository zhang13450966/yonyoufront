/*
 * @Author: zhangbfk
 * @PageInfo: 适用于TMS0003 生成TMS发货订单的业务类型
 * @Date: 2018-07-24 16:07:45 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-03-31 09:48:50
 */

import React, { Component } from 'react';
import { ajax, createPage } from 'nc-lightapp-front';
import TransTypeGridRef from '../../../../uap/refer/riart/transtype/index.js';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';

class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data;
		this.state = {
			saleOrderType: [], //签收途损单
			transferOrderType: [] //应付单
		};
	}

	componentDidMount() {
		this.props.modal.show('param-panel');
		initLang(this, [ '4001busiparam' ], 'scmpub', () => {
			this.setState(this.state);
		});
		this.getData();
	}

	// 确定按钮保存数据,然后关闭模态框
	closeModal = (flag) => {
		let targetSaleKeys = [];
		let targetTransKeys = [];
		let param, valueStr;
		if (flag) {
			let saleOrderVal = this.state.saleOrderType;
			for (let val of saleOrderVal) {
				targetSaleKeys.push(val.refpk);
			}
			let transferOrderVal = this.state.transferOrderType;
			for (let val of transferOrderVal) {
				targetTransKeys.push(val.refpk);
			}
			let saleStr = targetSaleKeys.join(',');
			let transStr = targetTransKeys.join('#');
			valueStr = saleStr + '&' + transStr;
			// 单独修改
			this.data.sysinitvo.value = valueStr;
			param = this.data;
		}
		this.props.valueChange(param);
	};

	onChange = (key, val) => {
		if (key == 'saleOrderType') {
			this.setState({
				saleOrderType: val
			});
		} else if (key == 'transferOrderType') {
			this.setState({
				transferOrderType: val
			});
		}
	};

	// 查询数据
	getData = () => {
		let str = this.data.sysinitvo.value;
		if (!str || str == '&') {
			return;
		} else {
			let billTytpId = str.split('&');
			let saleIds = billTytpId[0].split(',');
			let transIds = billTytpId[1].split('#');
			let ids = saleIds.concat(transIds);
			ajax({
				url: '/nccloud/scmpub/param/tms0003Query.do',
				data: ids,
				success: (res) => {
					if (res.data) {
						let salVals = [];
						let transVals = [];
						if (res.data['30']) {
							for (let saleVal of res.data['30']) {
								let salTempVal = {
									refname: saleVal.display,
									refpk: saleVal.value
								};
								salVals.push(salTempVal);
							}
						}
						if (res.data['5X']) {
							for (let transVal of res.data['5X']) {
								let transTempVal = {
									refname: transVal.display,
									refpk: transVal.value
								};
								transVals.push(transTempVal);
							}
						}
						this.setState({
							saleOrderType: salVals,
							transferOrderType: transVals
						});
					}
				}
			});
		}
	};

	render() {
		let { createModal } = this.props.modal;
		return createModal('param-panel', {
			width: '600px',
			height: '245px',
			title: getLangByResId(this, '4001BUSIPARAM-000000') /* 国际化处理： 动态参数设置*/,
			content: (
				<div className="scm-param-tms0003">
					<div className="title">
						{getLangByResId(this, '4001BUSIPARAM-000024') /* 国际化处理： 生成TMS发货订单的业务类型*/}
					</div>
					<div className="ref-item">
						<span className="ref-label  nc-theme-common-font-c">
							{getLangByResId(this, '4001BUSIPARAM-000025') /* 国际化处理： 销售发货单审批时：*/}
						</span>
						<span>
							<TransTypeGridRef
								onChange={this.onChange.bind(this, 'saleOrderType')}
								value={this.state.saleOrderType}
								isMultiSelectedEnabled={true}
								required={true}
								queryCondition={() => ({
									parentbilltype: '30'
								})}
							/>
						</span>
					</div>
					<div className="ref-item">
						<span className="ref-label  nc-theme-common-font-c">
							{getLangByResId(this, '4001BUSIPARAM-000026') /* 国际化处理： 调拨发货单审批时：*/}
						</span>
						<span>
							<TransTypeGridRef
								onChange={this.onChange.bind(this, 'transferOrderType')}
								value={this.state.transferOrderType}
								isMultiSelectedEnabled={true}
								required={true}
								queryCondition={() => ({
									parentbilltype: '5X'
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
