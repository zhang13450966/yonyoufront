/*
 * @Author: xiahui
 * @PageInfo: 三单匹配-组织级参数（参数名称：生成采购发票默认发票类型）
 * @Date: 2019-06-24 14:08:23
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-23 10:41:30
 */
import React, { Component } from 'react';
import { ajax, createPage } from 'nc-lightapp-front';
import { showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import TransTypeGridRef from '../../../../uap/refer/riart/transtype/index.js';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';

// 交易类型编码
const TYPE = {
	defaultCode: '25-05', // 默认值：费用发票
	invoiceCode: '25' // 采购发票
};

// URL
const URL = {
	invoiceQuery: '/nccloud/scmpub/param/tms0002Query.do' // 采购发票交易类型
};

class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data || {};
		this.state = {
			invoiceValue: null // 采购发票
		};

		initLang(this, [ '4004sysinit' ], 'pu', () => {
			this.forceUpdate();
		});
	}

	componentDidMount() {
		this.getData();
		this.props.modal.show('param-panel');
	}

	// 查询数据
	getData = () => {
		if (this.props.data.sysinitvo && this.props.data.sysinitvo.value) {
			ajax({
				url: URL.invoiceQuery,
				data: [ this.props.data.sysinitvo.value ],
				success: (res) => {
					if (res.data) {
						let invoiceValue = {
							refname: res.data[TYPE.invoiceCode][0].display,
							refpk: res.data[TYPE.invoiceCode][0].value.refpk,
							refcode: res.data[TYPE.invoiceCode][0].value.refcode
						};
						this.setState({
							invoiceValue: invoiceValue
						});
					}
				}
			});
		}
	};

	// 确定按钮保存数据,然后关闭模态框
	closeModal = (flag) => {
		let param;
		if (flag) {
			if (!this.state.invoiceValue.refcode) {
				/* 国际化处理：生成采购发票默认发票类型不允许为空*/
				showWarningInfo(null, getLangByResId(this, '4004sysinit-000054'));
				return;
			}
			if (this.props.batch) {
				// 批量修改
				param = this.props.pkorgs.map((org) => {
					return { pk_org: org, value: this.state.invoiceValue.refcode };
				});
			} else {
				// 单独修改
				this.data.sysinitvo.value = this.state.invoiceValue.refcode;
				param = this.data;
			}
		}
		this.props.valueChange(param);
	};

	render() {
		let { createModal } = this.props.modal;
		return createModal('param-panel', {
			title: getLangByResId(this, '4004sysinit-000020') /* 国际化处理： 动态参数设置*/,
			content: (
				<div className="param-panel-form">
					<div className="title">
						{/* 国际化处理：生成采购发票默认发票类型*/}
						{getLangByResId(this, '4004sysinit-000055')}
					</div>
					<div className="ref-item">
						<span className="ref-label">
							{/* 国际化处理：采购发票*/}
							{getLangByResId(this, '4004sysinit-000056')}：
						</span>
						<span className="ref-select">
							<TransTypeGridRef
								onChange={(value) => {
									this.setState({ invoiceValue: value });
								}}
								value={this.state.invoiceValue}
								required={true}
								queryCondition={() => ({
									parentbilltype: TYPE.invoiceCode
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
			userControl: true, // 点 确定/取消 按钮后，是否自动关闭弹框.true:手动关。false:自动关,默认false
			className: 'combine'
		});
	}
}
export default createPage({})(ParamPanel);
