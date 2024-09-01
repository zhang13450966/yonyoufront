/*
 * @Author: hufei
 * @PageInfo: 参数面板 采购管理 PO86 自动结算规则默认值
 * @Date: 2018-07-24 16:07:45
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-25 13:45:58
 */

import React, { Component } from 'react';

import { base, ajax, createPage } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let { NCTabs: Tabs, NCCheckbox: Checkbox } = base;
let { NCTabPane: TabPane } = Tabs;
import { rbstock, rbinvoice, invoicestock } from './data';
import './index.less';
class ParamPanel extends Component {
	constructor(props) {
		super(props);
		this.data = props.data || {};
		this.state = {
			activeTabKey: 'rbstock',

			// 红蓝入库单
			rbstock: {
				bsuppliersame: true,
				bdeptsame: true,
				bbatchcodesame: false,
				btrantypesame: false,
				bproductorsame: false,
				bfreeitemsame: false,
				bbuyersame: false,
				bordersame: false,
				borigpricesame: false,
				bprojectsame: false,
				bnumabssame: false,
				bfinanceorgsame: true,
				bmaterialsame: true
			},

			// 红蓝发票
			rbinvoice: {
				bdeptsame: true,
				bbatchcodesame: false,
				bproductorsame: false,
				bfreeitemsame: false,
				bbuyersame: false,
				bordersame: false,
				bprojectsame: false,
				bnumabssame: false,
				bfinanceorgsame: true,
				bmaterialsame: true,
				bnorigpricesame: true,
				bsuppliersame: true,
				binvoicetypesame: true
			},

			// 入库单发票
			invoicestock: {
				bdeptsame: true,
				bbatchcodesame: false,
				bnumsame: false,
				bprojectsame: false,
				bproductorsame: false,
				bbuyersame: false,
				bfreeitemsame: false,
				borigpricesame: false,
				bfinanceorgsame: true,
				bsuppliersame: true,
				bmaterialsame: true
			}
		};
	}

	componentDidMount() {
		initLang(this, [ '4004sysinit' ], 'pu', () => {
			this.setState(this.state);
		});
		this.props.modal.show('param-panel');
		!this.props.batch && this.getData();
	}

	// 批量修改和修改态下点击确定，保存，然后将保存返回结果传给父组件，关闭模态框需要调用 props.valueChange
	closeModal = (flag) => {
		let param;
		if (flag) {
			this.saveData().then((resVal) => {
				if (this.props.batch) {
					// 批量修改
					param = this.props.pkorgs.map((org) => {
						return { pk_org: org, value: resVal };
					});
				} else {
					// 单独修改
					this.data.sysinitvo.value = resVal;
					param = this.data;
				}
				this.props.valueChange(param);
			});
		} else {
			this.props.valueChange();
		}
	};

	// 页签切换
	tabChange = (key) => {
		this.setState({ activeTabKey: key });
	};

	// 复选框
	checkChange = (tab, code) => {
		this.setState({
			[tab]: {
				...this.state[tab],
				[code]: !this.state[tab][code]
			}
		});
	};

	// 单个修改时才需要获取数据，批量修改时走页面state中的默认值即可
	getData = () => {
		if (this.data.sysinitvo) {
			if (!this.data.sysinitvo.value) return; // value 为 null 时走页面state中的默认值
			ajax({
				url: '/nccloud/pu/po86/query.do',
				data: {
					value: this.data.sysinitvo.value
				},
				success: (res) => {
					let { data } = res;
					if (data) {
						let rbstock = {
							bsuppliersame: !!data.rbstock.bsuppliersame,
							bdeptsame: !!data.rbstock.bdeptsame,
							bbatchcodesame: !!data.rbstock.bbatchcodesame,
							btrantypesame: !!data.rbstock.btrantypesame,
							bproductorsame: !!data.rbstock.bproductorsame,
							bfreeitemsame: !!data.rbstock.bfreeitemsame,
							bbuyersame: !!data.rbstock.bbuyersame,
							bordersame: !!data.rbstock.bordersame,
							borigpricesame: !!data.rbstock.borigpricesame,
							bprojectsame: !!data.rbstock.bprojectsame,
							bnumabssame: !!data.rbstock.bnumabssame
						};
						let rbinvoice = {
							bdeptsame: !!data.rbinvoice.bdeptsame,
							bbatchcodesame: !!data.rbinvoice.bbatchcodesame,
							bproductorsame: !!data.rbinvoice.bproductorsame,
							bfreeitemsame: !!data.rbinvoice.bfreeitemsame,
							bbuyersame: !!data.rbinvoice.bbuyersame,
							bordersame: !!data.rbinvoice.bordersame,
							bprojectsame: !!data.rbinvoice.bprojectsame,
							bnumabssame: !!data.rbinvoice.bnumabssame
						};
						let invoicestock = {
							bdeptsame: !!data.invoicestock.bdeptsame,
							bbatchcodesame: !!data.invoicestock.bbatchcodesame,
							bnumsame: !!data.invoicestock.bnumsame,
							bprojectsame: !!data.invoicestock.bprojectsame,
							bproductorsame: !!data.invoicestock.bproductorsame,
							bbuyersame: !!data.invoicestock.bbuyersame,
							bfreeitemsame: !!data.invoicestock.bfreeitemsame,
							borigpricesame: !!data.invoicestock.borigpricesame
						};
						this.setState({
							rbstock,
							rbinvoice,
							invoicestock
						});
					}
				}
			});
		}
	};

	// 保存数据
	saveData = () => {
		let { rbstock, rbinvoice, invoicestock } = this.state;
		return new Promise((resolve) => {
			ajax({
				url: '/nccloud/pu/po86/save.do',
				data: { rbstock, rbinvoice, invoicestock },
				success: (res) => resolve(res.data)
			});
		});
	};

	render() {
		const { activeTabKey } = this.state;
		let { createModal } = this.props.modal;
		return createModal('param-panel', {
			title: getLangByResId(this, '4004sysinit-000020') /* 国际化处理： 动态参数设置*/,
			content: (
				<Tabs defaultActiveKey={activeTabKey} onChange={this.tabChange}>
					<TabPane tab={getLangByResId(this, '4004sysinit-000017')} key="rbstock" className="my-tab">
						{/* 国际化处理： 红蓝入库单结算*/}
						<div className="group">
							{rbstock.selectable.map((item, index) => (
								<Checkbox
									key={index}
									checked={this.state.rbstock[item.code]}
									onChange={() => this.checkChange('rbstock', item.code)}
								>
									{getLangByResId(this, item.name)}
								</Checkbox>
							))}
						</div>
						<div className="group">
							<div className="title">{getLangByResId(this, '4004sysinit-000021')}</div>
							{/* 国际化处理： 系统内置必须匹配条件*/}
							{rbstock.unselectable.map((item, index) => (
								<Checkbox key={index} disabled={true} checked={true}>
									{getLangByResId(this, item.name)}
								</Checkbox>
							))}
						</div>
					</TabPane>

					<TabPane tab={getLangByResId(this, '4004sysinit-000018')} key="rbinvoice" className="my-tab">
						{/* 国际化处理： 红蓝发票结算*/}
						<div className="group">
							{rbinvoice.selectable.map((item, index) => (
								<Checkbox
									key={index}
									checked={this.state.rbinvoice[item.code]}
									onChange={() => this.checkChange('rbinvoice', item.code)}
								>
									{getLangByResId(this, item.name)}
								</Checkbox>
							))}
						</div>
						<div className="group">
							<div className="title">{getLangByResId(this, '4004sysinit-000021')}</div>
							{/* 国际化处理： 系统内置必须匹配条件*/}
							{rbinvoice.unselectable.map((item, index) => (
								<Checkbox key={index} disabled={true} checked={true}>
									{getLangByResId(this, item.name)}
								</Checkbox>
							))}
						</div>
					</TabPane>

					<TabPane tab={getLangByResId(this, '4004sysinit-000019')} key="invoicestock" className="my-tab">
						{/* 国际化处理： 发票与入库单结算*/}
						<div className="group">
							{invoicestock.selectable.map((item, index) => (
								<Checkbox
									key={index}
									checked={this.state.invoicestock[item.code]}
									onChange={() => this.checkChange('invoicestock', item.code)}
								>
									{getLangByResId(this, item.name)}
								</Checkbox>
							))}
						</div>
						<div className="group">
							<div className="title">{getLangByResId(this, '4004sysinit-000021')}</div>
							{/* 国际化处理： 系统内置必须匹配条件*/}
							{invoicestock.unselectable.map((item, index) => (
								<Checkbox key={index} disabled={true} checked={true}>
									{getLangByResId(this, item.name)}
								</Checkbox>
							))}
						</div>
						<div className="group">
							<div className="title">{getLangByResId(this, '4004sysinit-000022')}</div>
							{/* 国际化处理： 系统内置结算顺序*/}
							<ol className="order-list">
								<li>1. {getLangByResId(this, '4004sysinit-000023')}</li>
								{/* 国际化处理： 发票与来源入库单结算*/}
								<li>2. {getLangByResId(this, '4004sysinit-000024')}</li>
								{/* 国际化处理： 发票与来源于同一订单下的入库单结算*/}
								<li>3. {getLangByResId(this, '4004sysinit-000025')}</li>
								{/* 国际化处理： 满足自动结算条件的其它发票与入库单结算*/}
							</ol>
						</div>
					</TabPane>
				</Tabs>
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
