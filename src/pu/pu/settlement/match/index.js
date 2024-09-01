/*
 * @Author: ligangt
 * @PageInfo: 到货单列表
 * @Date: 2018-04-17 15:48:43
 * @Last Modified by: hufei
 * @Last Modified time: 2022-06-02 14:14:13
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, pageTo, cacheTools, toast } from 'nc-lightapp-front';
import { searchBtnClick, buttonClick } from './btnClicks';
import { high, formatNumber } from 'nc-lightapp-front';
const { NCCheckbox, NCAffix } = base;
import { afterBodyEdit, afterHeadEdit } from './events';
import { initTemplate } from './init';
import { URL, AREA, PAGECODE, BUTTONAREA, SETTLTTYPE } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCTabs: Tabs, NCCollapse: Collapse } = base;
const { Refer } = high;
const TabPane = Tabs.NCTabPane;
const { NCModal, NCButton, NCRangePickerTranslate, NCDiv } = base;

const { Header, Body, Footer, Title } = NCModal;
import './index.less';
import CloseAction from './viewController/closeAction';
import AutoSettleAction from './viewController/autoSettleAction';
import SettleAction from './viewController/settleAction';
import FeeDistributeAction from './viewController/feeDistributeAction';
import BackSettleAction from './viewController/backSettleAction';
import { createPageIcon } from 'nc-lightapp-front';

export default class SettlementMatch extends Component {
	constructor(props) {
		super(props);
		props.use.editTable('sameMaterial');
		props.use.editTable(AREA.feeView);
		props.use.search(AREA.invoiceSearchArea);
		props.use.search(AREA.stockInSearchArea);
		props.use.editTable(AREA.invoiceView, AREA.stockInVIew, 'differentMaterial', 'feeMaterial', 'withoutInvoice');
		this.state = {
			matchcode: 'sameMaterial',
			invoiceFull: false,
			isBack: false,
			stockInSearchData: {},
			invoiceSearchData: {},
			stockFull: false,
			invoiceFields: [],
			stockFields: [],
			stockinnum: 0,
			invoicemny: 0,
			invoicenum: 0,
			current: 'invoice',
			btnName: '',
			isSettle: false,
			isSuccess: false,
			invoicePriceOverOder: false,
			settleType: '',
			title: '',
			pk_financeorg: '',
			currentModal: 0,
			RBInvoiceOptionableVO: {},
			RBStockOptionableVO: {},
			InvoiceStockOptionableVO: {},
			m_bAllowStockBeyondInvoice: false,
			hasFeeDistribute: false,
			hasInoviceDistribute: false,
			settleBillVOs: {},
			tab0Open: true,
			tab1Open: true,
			invoice: null,
			selectedInvoice: null,
			discount: null,
			selectedDiscount: null,
			fee: null,
			uiFee: null,
			selectedFee: null,
			stock: null,
			selectedStock: null,
			matchmaterial: null,
			activedTab: 0,
			isShowUnit: true,
			mainorg: {},
			financeorg: {},
			dbilldate: {},
			material: {},
			supplier: {},
			stockorg: {},
			marbasclass: {},
			leftWidth: '50%'
		};
	}
	componentDidMount() {
		initLang(this, [ '4004settlement' ], 'pu', initTemplate.bind(this, this.props));
		this.dragEvents();
	}

	dragEvents = () => {
		let html = document.documentElement;
		html.onmousedown = (e1) => {
			if (e1.target.className == 'line') {
				let beginWidth = this.refs.left.clientWidth;
				html.onmousemove = (e2) => {
					e2.preventDefault();
					this.setState({
						leftWidth: e2.x - e1.x + beginWidth + 'px'
					});
				};
			}
		};
		html.onmouseup = (e) => {
			html.onmousemove = null;
		};
	};
	getSettleEnvironment = () => {
		let environment = {};
		environment.m_pkFinanceOrg = this.state.pk_financeorg;
		environment.invoicePriceOverOder = this.state.invoicePriceOverOder;
		environment.isReasonWasteIntoCost = false;
		environment.m_autoMatchInvoiceStockOptionableVO = this.state.InvoiceStockOptionableVO;
		environment.m_autoMatchRBInvoiceOptionableVO = this.state.RBInvoiceOptionableVO;
		environment.m_autoMatchRBStockOptionableVO = this.state.RBStockOptionableVO;
		environment.m_bAllowStockBeyondInvoice = this.state.m_bAllowStockBeyondInvoice;
		environment.m_bStockHaveToMatchAll = false;
		environment.m_costFactorVOs = null;
		environment.m_hmapMaterialUnitVolume = null;
		environment.m_hmapMaterialUnitWeight = null;
		environment.m_loginDate = null;
		environment.m_loginOperator = null;
		environment.m_settleType = this.state.settleType;
		environment.m_unitVolumneDigit = 2;
		environment.m_unitWeightDigit = 2;
		environment.execType = 'real';
		return environment;
	};
	handleChange = (current) => {
		if (current == 'stockIn') {
		} else {
		}
		this.setState({
			current: current
		});
	};
	changeSize = (target) => {
		if (target == 'left') {
			this.setState(
				{
					invoiceFull: !this.state.invoiceFull,
					leftWidth: this.state.invoiceFull ? '50%' : '100%'
				},
				() => {
					if (this.state.invoiceFull) {
						this.props.editTable.setCheckboxFix(AREA.invoiceView, false);
						this.props.editTable.showColByKey(AREA.invoiceView, this.state.invoiceFields);
						this.props.editTable.hideColByKey(AREA.invoiceView, [
							'invoicecust1',
							'invoicecust2',
							'invoicecust3'
						]);
					} else {
						this.props.editTable.setCheckboxFix(AREA.invoiceView, true);
						this.props.editTable.showColByKey(AREA.invoiceView, [
							'invoicecust1',
							'invoicecust2',
							'invoicecust3'
						]);
						this.props.editTable.hideColByKey(AREA.invoiceView, this.state.invoiceFields);
					}
				}
			);
		} else {
			this.setState(
				{
					stockFull: !this.state.stockFull,
					leftWidth: this.state.stockFull ? '50%' : '0px'
				},
				() => {
					if (this.state.stockFull) {
						this.props.editTable.setCheckboxFix(AREA.stockInVIew, false);
						this.props.editTable.hideColByKey(AREA.stockInVIew, [
							'stockcust1',
							'stockcust2',
							'stockcust3'
						]);
						this.props.editTable.showColByKey(AREA.stockInVIew, this.state.stockFields);
					} else {
						this.props.editTable.setCheckboxFix(AREA.stockInVIew, true);
						this.props.editTable.showColByKey(AREA.stockInVIew, [
							'stockcust1',
							'stockcust2',
							'stockcust3'
						]);
						this.props.editTable.hideColByKey(AREA.stockInVIew, this.state.stockFields);
					}
				}
			);
		}
		//this.props.editTable.showColByKey(AREA.stockInVIew, [ 'nprice' ]);
		//this.props.editTable.showColByKey(AREA.invoiceView, [ 'nprice' ]);
	};

	onSelected = (props, moduleId, record, index, status) => {
		if (status) {
			let stockinRows = props.editTable.getCheckedRows(AREA.stockInVIew);
			let invoiceRows = props.editTable.getCheckedRows(AREA.invoiceView);
			let total = stockinRows.length + invoiceRows.length;
			if (moduleId == AREA.invoiceView) {
				if (total > 300) {
					props.editTable.selectTableRows(AREA.invoiceView, index, false);
					toast({ content: getLangByResId(this, '4004SETTLEMENT-000072'), color: 'warning' });
				}
			} else {
				if (total > 300) {
					props.editTable.selectTableRows(AREA.stockInVIew, index, false);
					toast({ content: getLangByResId(this, '4004SETTLEMENT-000072'), color: 'warning' });
				}
			}
		}
	};
	onSelectedAll = (props, moduleId, status, length) => {
		let stockinRows = props.editTable.getCheckedRows(AREA.stockInVIew);
		let invoiceRows = props.editTable.getCheckedRows(AREA.invoiceView);
		let total = stockinRows.length + invoiceRows.length;
		if (moduleId == AREA.invoiceView && status) {
			if (total > 300) {
				toast({ content: getLangByResId(this, '4004SETTLEMENT-000072'), color: 'warning' });
				let range = [];
				for (let i = 300 - stockinRows.length; i < length; i++) {
					range.push(i);
				}
				props.editTable.selectTableRows(AREA.invoiceView, range, false);
				this.selectedChange.call(this, props, moduleId);
			}
		} else {
			if (total > 300 && status) {
				toast({ content: getLangByResId(this, '4004SETTLEMENT-000072'), color: 'warning' });
				let range = [];
				for (let i = 300 - invoiceRows.length; i < length; i++) {
					range.push(i);
				}
				props.editTable.selectTableRows(AREA.stockInVIew, range, false);
				this.selectedChange.call(this, props, moduleId);
			}
		}
	};
	selectedChange = (props, moduleId, newVal, oldVal) => {
		if (moduleId == AREA.stockInVIew) {
			let stockinRows = props.editTable.getCheckedRows(AREA.stockInVIew);
			let stockinnum = 0;
			let maxNumScale = -1;
			stockinRows.map((row) => {
				//暂估数量、暂估金额、未暂估已结算数量、未暂估已结算金额
				let ncansettlenum = (row.data.values['ncansettlenum'] || {}).value || 0;
				maxNumScale = Math.max(maxNumScale, parseInt((row.data.values['ncansettlenum'] || {}).scale || -1));
				stockinnum += parseFloat(ncansettlenum);
			});
			if (maxNumScale > 0) {
				stockinnum = stockinnum.toFixed(maxNumScale);
			}
			this.setState({ stockinnum: stockinnum });
		} else if (moduleId == AREA.invoiceView) {
			let invoiceRows = props.editTable.getCheckedRows(AREA.invoiceView);
			let ncansettlemny = 0;
			let ncansettlenum = 0;
			let maxNumScale = -1;
			let maxMnyScale = -1;
			invoiceRows.map((row) => {
				//带结算金额
				let nunsettlemny = (row.data.values['ncansettlemny'] || {}).value || 0;
				maxMnyScale = Math.max(maxMnyScale, parseInt((row.data.values['ncansettlemny'] || {}).scale || -1));
				ncansettlemny += parseFloat(nunsettlemny);
				let nunsettlenum = (row.data.values['ncansettlenum'] || {}).value || 0;
				maxNumScale = Math.max(maxNumScale, parseInt((row.data.values['ncansettlenum'] || {}).scale || -1));
				ncansettlenum += parseFloat(nunsettlenum);
			});
			if (maxNumScale > 0) {
				ncansettlenum = ncansettlenum.toFixed(maxNumScale);
			}
			if (maxMnyScale > 0) {
				ncansettlemny = ncansettlemny.toFixed(maxMnyScale);
			}
			this.setState({ invoicemny: ncansettlemny, invoicenum: ncansettlenum });
		}
	};
	handleModalChange = (tab) => {
		this.setState({
			currentModal: tab
		});
	};
	changeCheck = (tab, key) => {
		if (tab == 0) {
			this.setState({
				RBStockOptionableVO: {
					...this.state.RBStockOptionableVO,
					[key]: !this.state.RBStockOptionableVO[key]
				}
			});
		} else if (tab == 1) {
			this.setState({
				RBInvoiceOptionableVO: {
					...this.state.RBInvoiceOptionableVO,
					[key]: !this.state.RBInvoiceOptionableVO[key]
				}
			});
		} else {
			this.setState({
				InvoiceStockOptionableVO: {
					...this.state.InvoiceStockOptionableVO,
					[key]: !this.state.InvoiceStockOptionableVO[key]
				}
			});
		}
	};

	getModalContent = () => {
		const AutoSettleRule = {
			RBInvoiceOptionableVO: {
				group1: [
					{
						label: getLangByResId(this, '4004SETTLEMENT-000008'),
						key: 'bdeptsame'
					} /* 国际化处理： 部门相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000009'),
						key: 'bbatchcodesame'
					} /* 国际化处理： 批次相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000010'),
						key: 'bproductorsame'
					} /* 国际化处理： 生产厂商相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000011'),
						key: 'bfreeitemsame'
					} /* 国际化处理： 自由辅助属性相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000012'),
						key: 'bnumabssame'
					} /* 国际化处理： 红蓝入库单数量绝对值相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000013'),
						key: 'bbuyersame'
					} /* 国际化处理： 采购员相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000014'),
						key: 'bordersame'
					} /* 国际化处理： 来源同一订单*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000015'),
						key: 'bprojectsame'
					} /* 国际化处理： 项目相同*/
				],
				group2: [
					{
						label: getLangByResId(this, '4004SETTLEMENT-000016'),
						key: 'bfinanceorgsame'
					} /* 国际化处理： 财务组织相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000017'),
						key: 'bmaterialsame'
					} /* 国际化处理： 物料相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000018'),
						key: 'bsuppliersame'
					} /* 国际化处理： 供应商相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000019'),
						key: 'binvoicetypesame'
					} /* 国际化处理： 发票类型相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000020'),
						key: 'borigpricesame'
					} /* 国际化处理： 主无税净价相同*/
				]
			},
			RBStockOptionableVO: {
				group1: [
					{
						label: getLangByResId(this, '4004SETTLEMENT-000018'),
						key: 'bsuppliersame'
					} /* 国际化处理： 供应商相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000008'),
						key: 'bdeptsame'
					} /* 国际化处理： 部门相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000009'),
						key: 'bbatchcodesame'
					} /* 国际化处理： 批次相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000021'),
						key: 'btrantypesame'
					} /* 国际化处理： 入库类型相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000010'),
						key: 'bproductorsame'
					} /* 国际化处理： 生产厂商相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000011'),
						key: 'bfreeitemsame'
					} /* 国际化处理： 自由辅助属性相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000012'),
						key: 'bnumabssame'
					} /* 国际化处理： 红蓝入库单数量绝对值相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000013'),
						key: 'bbuyersame'
					} /* 国际化处理： 采购员相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000014'),
						key: 'bordersame'
					} /* 国际化处理： 来源同一订单*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000020'),
						key: 'borigpricesame'
					} /* 国际化处理： 主无税净价相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000015'),
						key: 'bprojectsame'
					} /* 国际化处理： 项目相同*/
				],
				group2: [
					{ label: getLangByResId(this, '4004SETTLEMENT-000016'), key: 'bfinanceorgsame' },
					{ label: getLangByResId(this, '4004SETTLEMENT-000017'), key: 'bmaterialsame' }
				] /* 国际化处理： 财务组织相同,物料相同*/
			},
			InvoiceStockOptionableVO: {
				group1: [
					{
						label: getLangByResId(this, '4004SETTLEMENT-000008'),
						key: 'bdeptsame'
					} /* 国际化处理： 部门相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000009'),
						key: 'bbatchcodesame'
					} /* 国际化处理： 批次相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000010'),
						key: 'bproductorsame'
					} /* 国际化处理： 生产厂商相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000011'),
						key: 'bfreeitemsame'
					} /* 国际化处理： 自由辅助属性相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000022'),
						key: 'bnumsame'
					} /* 国际化处理： 发票和入库单数量相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000013'),
						key: 'bbuyersame'
					} /* 国际化处理： 采购员相同*/,
					//					{
					//						label: getLangByResId(this, '4004SETTLEMENT-000014'),
					//						key: 'bordersame'
					//					} /* 国际化处理： 来源同一订单*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000020'),
						key: 'borigpricesame'
					} /* 国际化处理： 主无税净价相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000015'),
						key: 'bprojectsame'
					} /* 国际化处理： 项目相同*/
				],
				group2: [
					{
						label: getLangByResId(this, '4004SETTLEMENT-000016'),
						key: 'bfinanceorgsame'
					} /* 国际化处理： 财务组织相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000017'),
						key: 'bmaterialsame'
					} /* 国际化处理： 物料相同*/,
					{
						label: getLangByResId(this, '4004SETTLEMENT-000018'),
						key: 'bsuppliersame'
					} /* 国际化处理： 供应商相同*/
				]
			}
		};
		return (
			<Tabs defaultActiveKey="1">
				<TabPane tab={getLangByResId(this, '4004SETTLEMENT-000023')} key="1" className="my-tab">
					{/* 国际化处理： 红蓝入库单结算*/}
					<div className="list">
						{AutoSettleRule.RBStockOptionableVO.group1.map((item) => {
							return (
								<NCCheckbox
									onChange={this.changeCheck.bind(this, 0, item.key)}
									// checked={(this.state.RBStockOptionableVO || {})[item.key] == 'Y'}
									checked={this.state.RBStockOptionableVO[item.key]}
									disabled={item.disabled}
								>
									{item.label}
								</NCCheckbox>
							);
						})}
					</div>
					<div className="list">
						<div className="title">{getLangByResId(this, '4004SETTLEMENT-000035')}</div>
						{/* 国际化处理： 系统内置必须匹配条件*/}
						{AutoSettleRule.RBStockOptionableVO.group2.map((item) => {
							return (
								<NCCheckbox checked={true} disabled={true}>
									{item.label}
								</NCCheckbox>
							);
						})}
					</div>
				</TabPane>
				<TabPane tab={getLangByResId(this, '4004SETTLEMENT-000024')} key="2" className="my-tab">
					{/* 国际化处理： 红蓝发票结算*/}
					<div className="list">
						{AutoSettleRule.RBInvoiceOptionableVO.group1.map((item) => {
							return (
								<NCCheckbox
									onChange={this.changeCheck.bind(this, 1, item.key)}
									// checked={(this.state.RBStockOptionableVO || {})[item.key] == 'Y'}
									checked={this.state.RBInvoiceOptionableVO[item.key]}
									disabled={item.disabled}
								>
									{item.label}
								</NCCheckbox>
							);
						})}
					</div>
					<div className="list">
						<div className="title">{getLangByResId(this, '4004SETTLEMENT-000035')}</div>
						{/* 国际化处理： 系统内置必须匹配条件*/}
						{AutoSettleRule.RBInvoiceOptionableVO.group2.map((item) => {
							return (
								<NCCheckbox checked={true} disabled={true}>
									{item.label}
								</NCCheckbox>
							);
						})}
					</div>
				</TabPane>
				<TabPane tab={getLangByResId(this, '4004SETTLEMENT-000025')} key="3" className="my-tab">
					{/* 国际化处理： 发票与入库单结算*/}
					<div className="list">
						{AutoSettleRule.InvoiceStockOptionableVO.group1.map((item) => {
							return (
								<NCCheckbox
									onChange={this.changeCheck.bind(this, 2, item.key)}
									// checked={(this.state.RBStockOptionableVO || {})[item.key] == 'Y'}
									checked={this.state.InvoiceStockOptionableVO[item.key]}
									disabled={item.disabled}
								>
									{item.label}
								</NCCheckbox>
							);
						})}
					</div>

					<div className="list">
						<div className="title">{getLangByResId(this, '4004SETTLEMENT-000035')}</div>
						{/* 国际化处理： 系统内置必须匹配条件*/}
						{AutoSettleRule.InvoiceStockOptionableVO.group2.map((item) => {
							return (
								<NCCheckbox checked={true} disabled={true}>
									{item.label}
								</NCCheckbox>
							);
						})}
					</div>

					<div className="list">
						<div className="title">{getLangByResId(this, '4004SETTLEMENT-000036')}</div>
						{/* 国际化处理： 系统内置结算顺序*/}
						<ol className="order-list">
							<li>1. {getLangByResId(this, '4004SETTLEMENT-000037')}</li>
							{/* 国际化处理： 发票与来源入库单结算*/}
							<li>2. {getLangByResId(this, '4004SETTLEMENT-000038')}</li>
							{/* 国际化处理： 发票与来源于同一订单下的入库单结算*/}
							<li>3. {getLangByResId(this, '4004SETTLEMENT-000039')}</li>
							{/* 国际化处理： 满足自动结算条件的其它发票与入库单结算*/}
						</ol>
					</div>
				</TabPane>
			</Tabs>
		);
	};

	orgAfterEvent = (field, value) => {
		if (field == 'pk_stockorg') {
			let meta = this.props.meta.getMeta();
			if (value && Array.isArray(value) && (value.length > 1 || value.length == 0)) {
				meta[AREA.invoiceSearchArea].items.map((item) => {
					if (item.attrcode == 'invoicebody.pk_stordoc') {
						item.isShowUnit = true;
					}
				});
			} else {
				meta[AREA.invoiceSearchArea].items.map((item) => {
					if (item.attrcode == 'invoicebody.pk_stordoc') {
						item.isShowUnit = false;
					}
				});
			}
			this.props.meta.setMeta(meta);
		} else if (field == 'pk_org') {
			if (Array.isArray(value) && value.length > 0) {
				value = value[0];
			}
			if (value && value.refpk) {
				if (value.refpk != this.state.pk_financeorg) {
					this.setState(
						{
							activedTab: 0,
							stockinnum: 0,
							invoicemny: 0,
							invoicenum: 0,
							current: 'invoice',
							btnName: '',
							isSettle: false,
							isSuccess: false,
							invoicePriceOverOder: false,
							settleType: '',
							title: '',
							mainorg: value,
							pk_financeorg: '',
							currentModal: 0,
							RBInvoiceOptionableVO: {},
							RBStockOptionableVO: {},
							InvoiceStockOptionableVO: {},
							m_bAllowStockBeyondInvoice: false,
							hasFeeDistribute: false,
							hasInoviceDistribute: false,
							settleBillVOs: [],
							tab0Open: true,
							tab1Open: true,
							invoice: null,
							selectedInvoice: null,
							discount: null,
							selectedDiscount: null,
							fee: null,
							selectedFee: null,
							stock: null,
							selectedStock: null,
							matchmaterial: null
						},
						() => {
							let data = {
								value: value.refpk,
								display: value.refname
							};
							this.props.search.setSearchValByField(
								AREA.stockInSearchArea,
								'pk_stockps_b.pk_financeorg',
								data
							);
							let meta = this.props.meta.getMeta();
							const INVOICE_FILTER_FIELD = [
								'invoicebody.pk_material.pk_marbasclass',
								'invoicebody.pk_srcmaterial.pk_marbasclass',
								'invoicebody.pk_srcmaterial',
								'pk_supplier'
							];
							const STOCK_FILTER_FIELD = [
								'pk_stockps_b.pk_srcmaterial.pk_marbasclass',
								'pk_stockps_b.pk_srcmaterial',
								'pk_stockps_b.pk_supplier'
							];
							meta[AREA.invoiceSearchArea].items.map((item) => {
								if (INVOICE_FILTER_FIELD.includes(item.attrcode)) {
									item.isShowUnit = false;
								}
							});
							meta[AREA.stockInSearchArea].items.map((item) => {
								if (STOCK_FILTER_FIELD.includes(item.attrcode)) {
									item.isShowUnit = false;
								}
							});
							setTimeout(() => {
								this.props.editTable.setTableData(AREA.stockInVIew, {
									rows: []
								});
								this.props.editTable.setTableData(AREA.invoiceView, {
									rows: []
								});
							}, 0);
							ajax({
								url: URL.querySettleRule,
								method: 'post',
								data: { pk_org: value.refpk },
								success: (res) => {
									this.setState({
										pk_financeorg: value.refpk,
										RBInvoiceOptionableVO: res.data.rbInvoiceOption || {},
										RBStockOptionableVO: res.data.rbStockOption || {},
										InvoiceStockOptionableVO: res.data.invoiceStockOption || {}
									});
									let factor = res.data.factor;
									let meta = this.props.meta.getMeta();
									const matchViews = [
										'feeMaterial',
										'sameMaterial',
										'differentMaterial',
										'withoutInvoice'
									];
									matchViews.forEach((view) => {
										if (meta[view] && Array.isArray(meta[view].items)) {
											meta[view].items.map((item) => {
												if (item.attrcode.startsWith('ncostfactor')) {
													if (factor.hasOwnProperty(item.attrcode)) {
														item.label = factor[item.attrcode];
														if (
															view == 'sameMaterial' ||
															view == 'differentMaterial' ||
															view == 'feeMaterial'
														) {
															item.visible = true;
														}
													} else {
														item.visible = false;
													}
												}
											});
										}
									});

									console.log(res);
								}
							});
						}
					);
				}
			} else {
				let meta = this.props.meta.getMeta();
				const INVOICE_FILTER_FIELD = [
					'invoicebody.pk_material.pk_marbasclass',
					'invoicebody.pk_srcmaterial.pk_marbasclass',
					'invoicebody.pk_srcmaterial',
					'pk_supplier'
				];
				const STOCK_FILTER_FIELD = [
					'pk_stockps_b.pk_srcmaterial.pk_marbasclass',
					'pk_stockps_b.pk_srcmaterial',
					'pk_stockps_b.pk_supplier'
				];
				meta[AREA.invoiceSearchArea].items.map((item) => {
					if (INVOICE_FILTER_FIELD.includes(item.attrcode)) {
						item.isShowUnit = true;
					}
				});
				meta[AREA.stockInSearchArea].items.map((item) => {
					if (STOCK_FILTER_FIELD.includes(item.attrcode)) {
						item.isShowUnit = true;
					}
				});
				this.props.meta.setMeta(meta);
				this.setState({
					pk_financeorg: '',
					RBInvoiceOptionableVO: {},
					RBStockOptionableVO: {},
					InvoiceStockOptionableVO: {}
				});
			}
		}
	};
	renderCompleteEvent = () => {
		if (!this.state.isBack) {
			let pk_org = this.props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_org');
			if (pk_org && pk_org.value && pk_org.value.firstvalue) {
				let value = pk_org.value.firstvalue;
				let refname = pk_org.display;
				let arr = value.split(',');
				arr = arr.map((item) => {
					return { refpk: item, refname: refname };
				});
				this.orgAfterEvent.call(this, 'pk_org', arr);
				//this.backSearchAfterEvent.call(this, 'pk_financeorg', arr);
				//this.props.search.setSearchValByField(AREA.backSettleSearchArea, { refpk: item, refname: refname });
			}
		} else {
			this.props.search.setSearchValue(AREA.stockInSearchArea, this.state.stockInSearchData);
			this.props.search.setSearchValue(AREA.invoiceSearchArea, this.state.invoiceSearchData);
		}
	};
	getBackSettleSearchValue = () => {
		if (!this.state.financeorg.refpk || !this.state.dbilldate.value.length > 0) {
			toast({ content: getLangByResId(this, '4004SETTLEMENT-000081'), color: 'warning' });
			return false;
		} else {
			let conditions = [
				{
					datatype: '204',
					field: 'pk_financeorg',
					value: { firstvalue: this.state.financeorg.refpk, secondvalue: '' },
					oprtype: '=',
					isIncludeSub: false
				},
				{
					datatype: '33',
					field: 'dbilldate',
					value: { firstvalue: this.state.dbilldate.value[0], secondvalue: this.state.dbilldate.value[1] },
					oprtype: 'between',
					isIncludeSub: false
				}
			];
			if (this.state.material.length > 0 || this.state.material.refpk) {
				let firstValue = this.state.material.refpk;
				if (this.state.material instanceof Array) {
					//多选逗号拼接
					let materiala = new Array();
					this.state.material.forEach((item) => {
						item.refpk && materiala.push(item.refpk);
					});
					firstValue = materiala.length > 0 ? materiala.join() : firstValue;
				}
				conditions.push({
					datatype: '204',
					field: 'pk_material',
					value: { firstvalue: firstValue, secondvalue: '' },
					oprtype: '=',
					isIncludeSub: false
				});
			}
			if (this.state.supplier.length > 0 || this.state.supplier.refpk) {
				let firstValue = this.state.supplier.refpk;
				if (this.state.supplier instanceof Array) {
					//多选逗号拼接
					let suppliera = new Array();
					this.state.supplier.forEach((item) => {
						item.refpk && suppliera.push(item.refpk);
					});
					firstValue = suppliera.length > 0 ? suppliera.join() : firstValue;
				}
				conditions.push({
					datatype: '204',
					field: 'pk_supplier',
					value: { firstvalue: firstValue, secondvalue: '' },
					oprtype: '=',
					isIncludeSub: false
				});
			}
			if (this.state.marbasclass.length > 0 || this.state.marbasclass.refpk) {
				let firstValue = this.state.marbasclass.refpk;
				if (this.state.marbasclass instanceof Array) {
					//多选逗号拼接
					let marbasclassa = new Array();
					this.state.marbasclass.forEach((item) => {
						item.refpk && marbasclassa.push(item.refpk);
					});
					firstValue = marbasclassa.length > 0 ? marbasclassa.join() : firstValue;
				}
				conditions.push({
					datatype: '204',
					field: 'pk_material.pk_marbasclass',
					value: { firstvalue: firstValue, secondvalue: '' },
					oprtype: '=',
					isIncludeSub: false
				});
			}
			if (this.state.stockorg.length > 0 || this.state.stockorg.refpk) {
				let firstValue = this.state.stockorg.refpk;
				if (this.state.stockorg instanceof Array) {
					//多选逗号拼接
					let stockorga = new Array();
					this.state.stockorg.forEach((item) => {
						item.refpk && stockorga.push(item.refpk);
					});
					firstValue = stockorga.length > 0 ? stockorga.join() : firstValue;
				}
				conditions.push({
					datatype: '204',
					field: 'pk_stockorg',
					value: { firstvalue: firstValue, secondvalue: '' },
					oprtype: '=',
					isIncludeSub: false
				});
			}

			return {
				queryType: 'tree',
				querycondition: {
					logic: 'and',
					conditions: conditions
				},
				pageCode: '400402400_list'
			};
		}
	};
	getInitBillDate = () => {
		let flag = true;
		let nowdays = new Date();
		let year = nowdays.getFullYear();
		let month = nowdays.getMonth() + 0 + (flag ? 0 : 1);
		if (month < 0) {
			month = 11;
			year = year - 1;
		}
		if (month < 10) {
			month = '0' + month;
		}
		let oneDay = 24 * 60 * 60 * 1000;
		return [
			new Date(
				new Date(new Date(year, month, '01').toLocaleDateString()).getTime() - (flag ? 0 : 1)
			).toLocaleDateString() + ' 00:00:00',
			new Date(
				new Date(new Date().toLocaleDateString()).getTime() + oneDay * 0 + (!flag ? oneDay - 1 : 0)
			).toLocaleDateString() + ' 23:59:59'
		];
	};
	getBackSettleContent = () => {
		return (
			<div className="modal-backsettle-content">
				<div className="search-item">
					<div className="item-name required">{getLangByResId(this, '4004SETTLEMENT-000083')}</div>
					<Refer
						{...this.props}
						refName={getLangByResId(this, '4004SETTLEMENT-000083')} /* 国际化处理： 财务组织*/
						isShowDisabledData={true}
						required={true}
						refType="tree"
						refCode={'financeorg'}
						queryTreeUrl={'/nccloud/uapbd/org/FinanceOrgTreeRef.do'}
						value={this.state.financeorg}
						queryCondition={() => {
							return {
								isDataPowerEnable: true,
								TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
							};
						}}
						onChange={(event) => {
							if (!event.refpk) {
								this.setState({
									isShowUnit: true,
									financeorg: {}
								});
							} else {
								this.setState({
									isShowUnit: false,
									financeorg: event
								});
							}
						}}
					/>
				</div>

				<div className="search-item">
					<div className="item-name required">{getLangByResId(this, '4004SETTLEMENT-000077')}</div>
					{/* 黑暗主题反色适配 */}
					<NCRangePickerTranslate
						{...this.props}
						required={true}
						showTimeFunction={true}
						placeholder={getLangByResId(this, '4004SETTLEMENT-000077')} /* 国际化处理：单据日期*/
						value={this.state.dbilldate.display}
						onChange={(date, value, display) => {
							if (Array.isArray(date) && date.length > 1) {
								this.setState({
									dbilldate: {
										value: value,
										display: date
									}
								});
							} else {
								this.setState({
									dbilldate: {
										value: [],
										display: []
									}
								});
							}
						}}
					/>
				</div>
				<div className="search-item">
					<div className="item-name">{getLangByResId(this, '4004SETTLEMENT-000078')}</div> {/* 黑暗主题反色适配 */}
					<Refer
						{...this.props}
						refName={getLangByResId(this, '4004SETTLEMENT-000078')} /* 国际化处理： 供应商*/
						refType="gridTree"
						refCode="supplier"
						queryGridUrl={'/nccloud/uapbd/ref/SupplierGridRef.do'}
						queryTreeUrl={'/nccloud/uapbd/ref/SupplierClassTreeRef.do'}
						value={this.state.supplier}
						isShowUnit={this.state.isShowUnit}
						isShowDisabledData={true}
						isMultiSelectedEnabled={true}
						queryCondition={() => {
							return { pk_org: this.state.financeorg.refpk };
						}}
						onChange={(event) => {
							if (!event.refpk) {
								this.setState({
									supplier: event
								});
							} else {
								this.setState({
									supplier: {}
								});
							}
						}}
					/>
				</div>
				<div className="search-item">
					<div className="item-name">{getLangByResId(this, '4004SETTLEMENT-000058')}</div> {/* 黑暗主题反色适配 */}
					<Refer
						{...this.props}
						refName={getLangByResId(this, '4004SETTLEMENT-000058')} /* 国际化处理： 物料*/
						refType="gridTree"
						refCode="material"
						queryGridUrl={'/nccloud/uapbd/ref/MaterialGridRef.do'}
						queryTreeUrl={'/nccloud/uapbd/ref/MaterialClassTreeRef.do'}
						value={this.state.material}
						isShowUnit={this.state.isShowUnit}
						isShowDisabledData={true}
						isMultiSelectedEnabled={true}
						queryCondition={() => {
							return { pk_org: this.state.financeorg.refpk };
						}}
						onChange={(event) => {
							if (!event.refpk) {
								this.setState({
									material: event
								});
							} else {
								this.setState({
									material: {}
								});
							}
						}}
					/>
				</div>

				<div className="search-item">
					<div className="item-name">{getLangByResId(this, '4004SETTLEMENT-000079')}</div> {/* 黑暗主题反色适配 */}
					<Refer
						{...this.props}
						refName={getLangByResId(this, '4004SETTLEMENT-000079')} /* 国际化处理： 物料基本分类*/
						refType="tree"
						refCode="marbasclass"
						queryTreeUrl={'/nccloud/uapbd/ref/MaterialBasClassTreeRef.do'}
						value={this.state.marbasclass}
						isShowUnit={this.state.isShowUnit}
						isShowDisabledData={true}
						isMultiSelectedEnabled={true}
						queryCondition={() => {
							return { pk_org: this.state.financeorg.refpk };
						}}
						onChange={(event) => {
							if (!event.refpk) {
								this.setState({
									marbasclass: event
								});
							} else {
								this.setState({
									marbasclass: {}
								});
							}
						}}
					/>
				</div>
				<div className="search-item">
					<div className="item-name">{getLangByResId(this, '4004SETTLEMENT-000080')}</div> {/* 黑暗主题反色适配 */}
					<Refer
						{...this.props}
						multiLang={{
							domainName: 'pu',
							currentLocale: 'zh-CN',
							moduleId: '4004settlement'
						}}
						isShowUnit={this.state.isShowUnit}
						isShowDisabledData={true}
						isMultiSelectedEnabled={true}
						refName={getLangByResId(this, '4004SETTLEMENT-000080')} /* 国际化处理： 库存组织*/
						refType="grid"
						refCode={'stockorg'}
						queryGridUrl={'/nccloud/uapbd/org/StockOrgGridRef.do'}
						value={this.state.stockorg}
						columnConfig={[
							{
								name: [ '4004SETTLEMENT-000084', '4004SETTLEMENT-000085' ],
								code: [ 'refcode', 'refname' ]
							}
						]} /* 国际化处理： 编码,名称*/
						onChange={(event) => {
							if (!event.refpk) {
								this.setState({
									stockorg: event
								});
							} else {
								this.setState({
									stockorg: {}
								});
							}
						}}
					/>
				</div>
			</div>
			// NCCreateSearch(AREA.backSettleSearchArea,{
			// 	showSearchBtn : false, // 是否显示查询按钮 ,默认显示
			// 	showAdvBtn : false,
			// 	showClearBtn : false,
			// 	renderCompleteEvent: this.backSettleRenderCompleteEvent,
			// 	statusChangeEvent: this.backSettleRenderCompleteEvent,
			// 	defaultConditionsNum: 2,
			// 	onAfterEvent : this.backSearchAfterEvent
			// })
		);
	};
	render() {
		const { button, search, editTable, modal } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		const { createModal } = modal;
		let _this = this;
		let { invoiceFull, stockFull, leftWidth } = this.state;
		if (this.state.isSettle) {
			return (
				<div className="nc-bill-list">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								<h2 className="title-search-detail">{this.state.title}</h2>
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: BUTTONAREA.settlehead,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-table-area">
						{createEditTable(this.state.matchcode, {
							onAfterEvent: afterHeadEdit.bind(this),
							showIndex: true,
							adaptionHeight: true,
							cancelCustomRightMenu: true, //动态列禁用保存列宽
							customRowHeight: true
							//onBeforeEvent: beforeHeadEdit.bind(this)
						})}
					</div>

					{createModal('matchValidation', {
						title: getLangByResId(this, '4004SETTLEMENT-000026') /* 国际化处理： 提示信息*/,
						size: 'sm',
						content: getLangByResId(
							this,
							'4004SETTLEMENT-000027'
						) /* 国际化处理： 入库单本次结算数量大于发票的本次结算数量，继续本物料的手工结算吗？*/,
						beSureBtnClick: () => {
							console.log(this);
							this.state.m_bAllowStockBeyondInvoice = true;
							if (this.state.btnName == 'FeeDistribute') {
								FeeDistributeAction.feeDistribute(this, true);
								//feeDistribute.call(this, true);
							} else if (this.state.settleType == SETTLTTYPE.UI_AUTO) {
								AutoSettleAction.autoSettle(this, true);
								//autoSettle.call(this, true);
							} else {
								SettleAction.settle(this, true);
								//settle.call(this, true);
							}
						},
						beCancelBtnClick: () => {
							AutoSettleAction.autoSettle(this, false);
							//autoSettle(false);
						},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
					{createModal('askPrice', {
						title: getLangByResId(this, '4004SETTLEMENT-000026') /* 国际化处理： 提示信息*/,
						content: getLangByResId(this, '4004SETTLEMENT-000029') /* 国际化处理： 单价超容差异常, 是否继续?*/,
						beSureBtnClick: () => {
							this.state.invoicePriceOverOder = true;
							if (this.state.btnName == 'FeeDistribute') {
								FeeDistributeAction.feeDistribute(this, true);
								//feeDistribute.call(this, true);
							} else if (this.state.settleType == SETTLTTYPE.UI_AUTO) {
								AutoSettleAction.autoSettle(this, true);
								//autoSettle.call(this, true);
							} else {
								SettleAction.settle(this, true);
								//settle.call(this, true);
							}
						},
						beCancelBtnClick: () => {
							AutoSettleAction.autoSettle(this, false);
							//autoSettle(false);
						},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
					{createModal('feeDistribute', {
						title: getLangByResId(this, '4004SETTLEMENT-000030') /* 国际化处理： 费用分摊*/,
						content: (
							<div className="flex-container" style={{ height: '100%' }}>
								{createEditTable(AREA.feeView, {
									customRowHeight: true,
									onAfterEvent: afterBodyEdit.bind(this),
									customRowHeight: true,
									adaptionHeight: true
								})}
							</div>
						),
						beSureBtnClick: () => {
							FeeDistributeAction.feeDistribute(this, true);
							//feeDistribute.call(this, true);
						},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
					{createModal('feeInvoice', {
						title: getLangByResId(this, '4004SETTLEMENT-000031') /* 国际化处理： 费用发票*/,
						content: createEditTable(AREA.feeView, {}),
						beSureBtnClick: () => {},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
					<NCModal
						show={this.state.isSuccess}
						onHide={() => {
							CloseAction.close(this);
						}}
						size="sm"
						className="calc-result-modal"
						fieldid="matchsuccessmodal"
					>
						<Header closeButton={true}>
							<Title>{getLangByResId(this, '4004SETTLEMENT-000040')}</Title>
							{/* 国际化处理： 采购结算*/}
						</Header>
						<Body>
							<i className="iconfont icon-wancheng " />
							<div>
								<div className="title">{getLangByResId(this, '4004SETTLEMENT-000041')}</div>
								{/* 黑暗主题反色适配 */}
								{/* 国际化处理： 操作完成*/}
								<div>{getLangByResId(this, '4004SETTLEMENT-000042')}：</div>
								{/* 国际化处理： 操作汇总*/}
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000043')}
									{(this.state.settleBillVOs.settlevos || []).length}
									{getLangByResId(this, '4004SETTLEMENT-000044') /* 国际化处理： 已生成结算单,张*/}
									<a
										href="JavaScript:void(0)"
										style={{ marginLeft: 8 }}
										onClick={() => {
											if (
												Array.isArray(this.state.settleBillVOs.settlevos) &&
												this.state.settleBillVOs.settlevos.length > 0
											) {
												let pks = this.state.settleBillVOs.settlevos.map((item) => {
													return item.pk;
												});
												let ts = new Date().valueOf();
												cacheTools.set('linkQueryByPuSettlement', {
													pks: pks,
													ts: ts
												});
												pageTo.openTo(URL.linkSettleBill, {
													appcode: '400402404',
													pagecode: '400402404_list'
												});
											} else {
												toast({
													content: getLangByResId(this, '4004SETTLEMENT-000032'),
													color: 'warning'
												}); /* 国际化处理： 未生成结算单*/
											}
											console.log(
												getLangByResId(this, '4004SETTLEMENT-000033')
											); /* 国际化处理： 结算单查看*/
										}}
									>
										{getLangByResId(this, '4004SETTLEMENT-000045') /* 国际化处理： 查看*/}
									</a>
								</div>
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000046')}
									{(this.state.settleBillVOs.pk_stock_b || []).length}
									{getLangByResId(this, '4004SETTLEMENT-000047')}
								</div>
								{/* 国际化处理： 已结算入库单,条*/}
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000048')}
									{(this.state.settleBillVOs.pk_invoice_b || []).length}
									{getLangByResId(this, '4004SETTLEMENT-000047')}
								</div>
								{/* 国际化处理： 已结算发票,条*/}
							</div>
						</Body>
						<Footer>
							<NCButton
								fieldid="settlementmatchclose_btn"
								onClick={() => {
									CloseAction.close(this);
								}}
							>
								{getLangByResId(this, '4004SETTLEMENT-000049') /* 国际化处理： 返回*/}
							</NCButton>
						</Footer>
					</NCModal>
				</div>
			);
		} else if (!this.state.isSettle) {
			return (
				<div className="nc-bill-list">
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createPageIcon()}
							<NCDiv
								fieldid={getLangByResId(this, '4004SETTLEMENT-000050')}
								areaCode={NCDiv.config.Title}
							/>
							<div className="header-title-tabs" fieldid="tabs-area">
								<div
									// fieldid="pu50matchheader-area"
									className={
										this.state.activedTab === 0 ? 'actived header-title-tab' : 'header-title-tab'
									}
									onClick={() => {
										this.setState({ activedTab: 0 });
										this.handleChange('invoice');
									}}
								>
									{getLangByResId(this, '4004SETTLEMENT-000050') /* 国际化处理： 发票查询*/}
								</div>
								<div
									// fieldid="pu51matchheader-area"
									className={
										this.state.activedTab === 1 ? 'actived header-title-tab' : 'header-title-tab'
									}
									onClick={() => {
										this.setState({ activedTab: 1 });
										this.handleChange('stockIn');
									}}
								>
									{getLangByResId(this, '4004SETTLEMENT-000051') /* 国际化处理： 入库单查询*/}
								</div>
							</div>
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: BUTTONAREA.listhead,
								onButtonClick: buttonClick.bind(this)
							})}
						</div>
					</NCDiv>
					<div className="nc-bill-search-area">
						<div style={{ display: this.state.current === 'invoice' ? 'block' : 'none' }}>
							{NCCreateSearch(AREA.invoiceSearchArea, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: this.orgAfterEvent.bind(this),
								renderCompleteEvent: this.renderCompleteEvent,
								statusChangeEvent: this.renderCompleteEvent,
								defaultConditionsNum: 4,
								fieldid: AREA.invoiceSearchArea
							})}
						</div>
						<div style={{ display: this.state.current === 'stockIn' ? 'block' : 'none' }}>
							{NCCreateSearch(AREA.stockInSearchArea, {
								clickSearchBtn: searchBtnClick.bind(this),
								defaultConditionsNum: 4,
								fieldid: AREA.stockInSearchArea,
								onAfterEvent: (field, value) => {
									if (field == 'pk_stockps_b.pk_org') {
										let meta = this.props.meta.getMeta();
										if (value && Array.isArray(value) && (value.length > 1 || value.length == 0)) {
											meta[AREA.stockInSearchArea].items.map((item) => {
												if (item.attrcode == 'pk_stordoc') {
													item.isShowUnit = true;
												}
											});
										} else {
											meta[AREA.stockInSearchArea].items.map((item) => {
												if (item.attrcode == 'pk_stordoc') {
													item.isShowUnit = false;
												}
											});
										}
										this.props.meta.setMeta(meta);
									} else if (field == 'pk_stockps_b.pk_financeorg') {
										if (Array.isArray(value) && value.length > 0) {
											value = value[0];
										}
										if (value && value.refpk) {
											if (value.refpk != this.state.pk_financeorg) {
												this.setState(
													{
														activedTab: 1,
														stockinnum: 0,
														invoicemny: 0,
														invoicenum: 0,
														current: 'stockIn',
														btnName: '',
														isSettle: false,
														isSuccess: false,
														invoicePriceOverOder: false,
														settleType: '',
														title: '',
														pk_financeorg: '',
														currentModal: 0,
														RBInvoiceOptionableVO: {},
														RBStockOptionableVO: {},
														InvoiceStockOptionableVO: {},
														hasFeeDistribute: false,
														hasInoviceDistribute: false,
														settleBillVOs: [],
														tab0Open: true,
														tab1Open: true,
														invoice: null,
														selectedInvoice: null,
														discount: null,
														selectedDiscount: null,
														fee: null,
														selectedFee: null,
														stock: null,
														selectedStock: null,
														matchmaterial: null
													},
													() => {
														let data = {
															value: value.refpk,
															display: value.refname
														};
														//this.props.search.setDisabled(AREA.invoiceSearchArea, false);
														//this.props.search.setDisabled(AREA.stockInSearchArea, false);
														this.props.search.setSearchValByField(
															AREA.invoiceSearchArea,
															'pk_org',
															data
														);
														let meta = this.props.meta.getMeta();
														const INVOICE_FILTER_FIELD = [
															'invoicebody.pk_material.pk_marbasclass',
															'invoicebody.pk_srcmaterial.pk_marbasclass',
															'invoicebody.pk_srcmaterial',
															'pk_supplier'
														];
														const STOCK_FILTER_FIELD = [
															'pk_stockps_b.pk_srcmaterial.pk_marbasclass',
															'pk_stockps_b.pk_srcmaterial',
															'pk_stockps_b.pk_supplier'
														];
														meta[AREA.invoiceSearchArea].items.map((item) => {
															if (INVOICE_FILTER_FIELD.includes(item.attrcode)) {
																item.isShowUnit = false;
															}
														});
														meta[AREA.stockInSearchArea].items.map((item) => {
															if (STOCK_FILTER_FIELD.includes(item.attrcode)) {
																item.isShowUnit = false;
															}
														});
														this.props.meta.setMeta(meta);
														setTimeout(() => {
															this.props.editTable.setTableData(AREA.stockInVIew, {
																rows: []
															});
															this.props.editTable.setTableData(AREA.invoiceView, {
																rows: []
															});
														}, 0);
														ajax({
															url: URL.querySettleRule,
															method: 'post',
															data: { pk_org: value.refpk },
															success: (res) => {
																this.setState({
																	pk_financeorg: value.refpk,
																	RBInvoiceOptionableVO:
																		res.data.rbInvoiceOption || {},
																	RBStockOptionableVO: res.data.rbStockOption || {},
																	InvoiceStockOptionableVO:
																		res.data.invoiceStockOption || {}
																});
																let factor = res.data.factor;
																let meta = this.props.meta.getMeta();
																const matchViews = [
																	'feeMaterial',
																	'sameMaterial',
																	'differentMaterial',
																	'withoutInvoice'
																];
																matchViews.forEach((view) => {
																	if (meta[view] && Array.isArray(meta[view].items)) {
																		meta[view].items.map((item) => {
																			if (
																				item.attrcode.startsWith('ncostfactor')
																			) {
																				if (
																					factor.hasOwnProperty(item.attrcode)
																				) {
																					item.label = factor[item.attrcode];
																					if (
																						view == 'sameMaterial' ||
																						view == 'differentMaterial' ||
																						view == 'feeMaterial'
																					) {
																						item.visible = true;
																					}
																				} else {
																					item.visible = false;
																				}
																			}
																		});
																	}
																});
																console.log(res);
															}
														});
													}
												);
											}
										} else {
											let meta = this.props.meta.getMeta();
											const INVOICE_FILTER_FIELD = [
												'invoicebody.pk_material.pk_marbasclass',
												'invoicebody.pk_srcmaterial.pk_marbasclass',
												'invoicebody.pk_srcmaterial',
												'pk_supplier'
											];
											const STOCK_FILTER_FIELD = [
												'pk_stockps_b.pk_srcmaterial.pk_marbasclass',
												'pk_stockps_b.pk_srcmaterial',
												'pk_stockps_b.pk_supplier'
											];
											meta[AREA.invoiceSearchArea].items.map((item) => {
												if (INVOICE_FILTER_FIELD.includes(item.attrcode)) {
													item.isShowUnit = true;
												}
											});
											meta[AREA.stockInSearchArea].items.map((item) => {
												if (STOCK_FILTER_FIELD.includes(item.attrcode)) {
													item.isShowUnit = true;
												}
											});
											this.props.meta.setMeta(meta);
											this.setState({
												pk_financeorg: '',
												RBInvoiceOptionableVO: {},
												RBStockOptionableVO: {},
												InvoiceStockOptionableVO: {}
											});
										}
									}
								}
							})}
						</div>
					</div>

					<div className="nc-bill-table-area wrapper nc-theme-area-split-bc nc-theme-gray-area-bgc">
						<div
							ref="left"
							className="left flex-container"
							id="pusettlement_invoice"
							style={{ width: leftWidth }}
						>
							<NCDiv fieldid={getLangByResId(this, '4004SETTLEMENT-000052')} areaCode={NCDiv.config.Area}>
								<div className="header">
									<div className="title">{getLangByResId(this, '4004SETTLEMENT-000052')}</div>
									{/* 国际化处理： 采购发票*/}
									<span>
										<span>
											{getLangByResId(this, '4004SETTLEMENT-000053')}：
											<span className="count">{formatNumber(this.state.invoicenum)}</span>
										</span>
										{/* 国际化处理： 本次结算数量*/}
									</span>
									<span>
										<span>
											{getLangByResId(this, '4004SETTLEMENT-000054')}：
											<span className="count">{formatNumber(this.state.invoicemny)}</span>
										</span>
										{/* 国际化处理： 本次结算金额*/}
									</span>
									<i
										className={
											this.state.invoiceFull ? (
												'iconfont icon-zuixiaohua nc-theme-btn-secondary'
											) : (
												'iconfont icon-zuidahua nc-theme-btn-secondary'
											)
										}
										onClick={() => this.changeSize('left')}
									/>
								</div>
							</NCDiv>
							{createEditTable(AREA.invoiceView, {
								showCheck: true,
								showIndex: true,
								multipleRowCell: true,
								selectedChange: this.selectedChange.bind(this),
								onSelected: this.onSelected.bind(this),
								onSelectedAll: this.onSelectedAll.bind(this),
								adaptionHeight: true,
								cancelCustomRightMenu: true, //动态列禁用保存列宽
								customRowHeight: true
							})}
						</div>
						{!invoiceFull &&
						!stockFull && (
							<div className="line-box">
								<div className="line" />
							</div>
						)}
						<div
							className="right flex-container"
							id="pusettlement_stock"
							style={{ width: `calc(100% - ${leftWidth})` }}
						>
							<NCDiv fieldid={getLangByResId(this, '4004SETTLEMENT-000055')} areaCode={NCDiv.config.Area}>
								<div className="header">
									<div className="title">{getLangByResId(this, '4004SETTLEMENT-000055')}</div>
									{/* 国际化处理： 入库单*/}
									<span>
										<span>
											{getLangByResId(this, '4004SETTLEMENT-000056')}：
											<span className="count">{formatNumber(this.state.stockinnum)}</span>
										</span>
										{/* 国际化处理： 本次结算总数量*/}
									</span>
									<i
										className={
											this.state.stockFull ? (
												'iconfont icon-zuixiaohua nc-theme-btn-secondary'
											) : (
												'iconfont icon-zuidahua nc-theme-btn-secondary'
											)
										}
										onClick={() => this.changeSize('right')}
									/>
								</div>
							</NCDiv>
							{createEditTable(AREA.stockInVIew, {
								showCheck: true,
								showIndex: true,
								multipleRowCell: true,
								selectedChange: this.selectedChange.bind(this),
								onSelected: this.onSelected.bind(this),
								onSelectedAll: this.onSelectedAll.bind(this),
								adaptionHeight: true,
								cancelCustomRightMenu: true, //动态列禁用保存列宽
								customRowHeight: true
							})}
						</div>
					</div>

					{createModal('matchValidation', {
						title: getLangByResId(this, '4004SETTLEMENT-000026') /* 国际化处理： 提示信息*/,
						size: 'sm',
						content: getLangByResId(
							this,
							'4004SETTLEMENT-000027'
						) /* 国际化处理： 入库单本次结算数量大于发票的本次结算数量，继续本物料的手工结算吗？*/,
						beSureBtnClick: () => {
							console.log(this);

							this.state.m_bAllowStockBeyondInvoice = true;
							if (this.state.btnName == 'FeeDistribute') {
								FeeDistributeAction.feeDistribute(this, true);
								//feeDistribute.call(this, true);
							} else if (this.state.settleType == SETTLTTYPE.UI_AUTO) {
								AutoSettleAction.autoSettle(this, true);
								//autoSettle.call(this, true);
							} else {
								SettleAction.settle(this, true);
								//settle.call(this, true);
							}
						},
						beCancelBtnClick: () => {
							AutoSettleAction.autoSettle(this, false);
							//autoSettle(false);
						},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}

					{createModal('backSettle', {
						className: 'senior',
						title: getLangByResId(this, '4004SETTLEMENT-000075') /* 国际化处理： 后台结算*/,
						content: this.getBackSettleContent(),
						beSureBtnClick: BackSettleAction.settle.bind(BackSettleAction, this),
						leftBtnName: getLangByResId(this, '4004SETTLEMENT-000063') /* 国际化处理：结算*/
					})}
					{createModal('askPrice', {
						title: getLangByResId(this, '4004SETTLEMENT-000026') /* 国际化处理： 提示信息*/,
						content: getLangByResId(this, '4004SETTLEMENT-000029') /* 国际化处理： 单价超容差异常, 是否继续?*/,
						beSureBtnClick: () => {
							this.state.invoicePriceOverOder = true;
							if (this.state.btnName == 'FeeDistribute') {
								FeeDistributeAction.feeDistribute(this, true);
								//feeDistribute.call(this, true);
							} else if (this.state.settleType == SETTLTTYPE.UI_AUTO) {
								AutoSettleAction.autoSettle(this, true);
								//autoSettle.call(this, true);
							} else {
								SettleAction.settle(this, true);
								//settle.call(this, true);
							}
						},
						beCancelBtnClick: () => {
							AutoSettleAction.autoSettle(this, false);
							//autoSettle(false);
						},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
					{createModal('settleRule', {
						title: getLangByResId(this, '4004SETTLEMENT-000034') /* 国际化处理： 自动结算规则*/,
						content: this.getModalContent(),
						beSureBtnClick: this.setSettleRule,
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
					<NCModal
						show={this.state.isSuccess}
						onHide={() => {
							CloseAction.close(this);
						}}
						size="sm"
						className="calc-result-modal"
						fieldid="matchissmodal"
					>
						<Header closeButton={true}>
							<Title>{getLangByResId(this, '4004SETTLEMENT-000040')}</Title>
							{/* 国际化处理： 采购结算*/}
						</Header>
						<Body>
							<i className="iconfont icon-wancheng " />
							<div>
								<div className="title">{getLangByResId(this, '4004SETTLEMENT-000041')}</div>
								{/* 国际化处理： 操作完成*/}
								<div>{getLangByResId(this, '4004SETTLEMENT-000042')}：</div>
								{/* 国际化处理： 操作汇总*/}
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000043')}
									{(this.state.settleBillVOs.settlevos || []).length}
									{getLangByResId(this, '4004SETTLEMENT-000044') /* 国际化处理： 已生成结算单,张*/}
									<a
										href="JavaScript:void(0)"
										style={{ marginLeft: 8 }}
										onClick={() => {
											if (
												Array.isArray(this.state.settleBillVOs.settlevos) &&
												this.state.settleBillVOs.settlevos.length > 0
											) {
												let pks = this.state.settleBillVOs.settlevos.map((item) => {
													return item.pk;
												});
												let ts = new Date().valueOf();
												cacheTools.set('linkQueryByPuSettlement', {
													pks: pks,
													ts: ts
												});
												pageTo.openTo(URL.linkSettleBill, {
													appcode: '400402404',
													pagecode: '400402404_list'
												});
											} else {
												toast({
													content: getLangByResId(this, '4004SETTLEMENT-000032'),
													color: 'warning'
												}); /* 国际化处理： 未生成结算单*/
											}
											console.log(
												getLangByResId(this, '4004SETTLEMENT-000033')
											); /* 国际化处理： 结算单查看*/
										}}
									>
										{getLangByResId(this, '4004SETTLEMENT-000045') /* 国际化处理： 查看*/}
									</a>
								</div>
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000046')}
									{(this.state.settleBillVOs.pk_stock_b || []).length}
									{getLangByResId(this, '4004SETTLEMENT-000047')}
								</div>
								{/* 国际化处理： 已结算入库单,条*/}
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000048')}
									{(this.state.settleBillVOs.pk_invoice_b || []).length}
									{getLangByResId(this, '4004SETTLEMENT-000047')}
								</div>
								{/* 国际化处理： 已结算发票,条*/}
							</div>
						</Body>
					</NCModal>
				</div>
			);
		}
	}
}

SettlementMatch = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.list,
		bodycode: {
			[AREA.stockInVIew]: 'editTable',
			[AREA.invoiceView]: 'editTable',
			[AREA.feeView]: 'editTable',
			['sameMaterial']: 'editTable',
			['differentMaterial']: 'editTable',
			['feeMaterial']: 'editTable',
			['withoutInvoice']: 'editTable' //此处发生变化了，需要传一个对象
		}
	}

	//模板
})(SettlementMatch);
ReactDOM.render(<SettlementMatch />, document.querySelector('#app'));
