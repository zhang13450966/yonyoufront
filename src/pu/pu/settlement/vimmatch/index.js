/*
 * @Author: ligangt
 * @PageInfo: 消耗汇总结算列表
 * @Date: 2018-04-17 15:48:43
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-25 14:51:09
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, pageTo, cacheTools } from 'nc-lightapp-front';
import { afterBodyEdit, afterHeadEdit } from './events';
import { searchBtnClick, buttonClick } from './btnClicks';
const { NCCheckbox, NCCRow, NCCCol } = base;
import { initTemplate } from './init';
import { URL, AREA, COMMON, PAGECODE, BUTTONAREA, SETTLTTYPE } from '../constance';
const { NCTabsControl } = base;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCModal, NCButton, NCAffix, NCDiv } = base;
const { Header, Body, Footer, Title } = NCModal;
import FeeDistributeAction from './viewController/feeDistributeAction';
import AutoSettleAction from './viewController/autoSettleAction';
import SettleAction from './viewController/settleAction';
import CloseAction from './viewController/closeAction';
import { createPageIcon } from 'nc-lightapp-front';
import './index.less';
import { formatNumber } from 'nc-lightapp-front';

export default class VimMatch extends Component {
	constructor(props) {
		super(props);
		props.use.editTable('sameMaterial');
		props.use.editTable(AREA.feeView);
		props.use.search(AREA.invoiceSearchArea);
		props.use.search(AREA.stockInSearchArea);
		props.use.editTable(AREA.invoiceView, AREA.stockInVIew, 'feeMaterial');
		this.state = {
			stockinnum: 0,
			invoicemny: 0,
			invoicenum: 0,
			invoiceFull: false,
			stockFull: false,
			invoiceFields: [],
			stockFields: [],
			current: 'invoice',
			btnName: '',
			isSettle: false,
			isSuccess: false,
			isBack: false,
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
			matchcode: 'sameMaterial',
			leftWidth: '50%'
		};
	}
	componentDidMount() {
		//initTemplate.call(this, this.props);
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
						this.props.editTable.showColByKey(AREA.stockInVIew, [
							'stockcust1',
							'stockcust2',
							'stockcust3'
						]);
						this.props.editTable.hideColByKey(AREA.stockInVIew, this.state.stockFields);
						this.props.editTable.setCheckboxFix(AREA.stockInVIew, true);
					}
				}
			);
		}
	};

	onSelected = (props, moduleId, record, index, status) => {
		if (status) {
			let stockinRows = props.editTable.getCheckedRows(AREA.stockInVIew);
			let invoiceRows = props.editTable.getCheckedRows(AREA.invoiceView);
			let total = stockinRows.length + invoiceRows.length;
			if (moduleId == AREA.invoiceView) {
				if (total > 300) {
					props.editTable.selectTableRows(AREA.invoiceView, index, false);
					toast({ content: getLangByResId(this, '4004SETTLEMENT-000073'), color: 'warning' });
				}
			} else {
				if (total > 300) {
					props.editTable.selectTableRows(AREA.stockInVIew, index, false);
					toast({ content: getLangByResId(this, '4004SETTLEMENT-000073'), color: 'warning' });
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
				toast({ content: getLangByResId(this, '4004SETTLEMENT-000073'), color: 'warning' });
				let range = [];
				for (let i = 300 - stockinRows.length; i < length; i++) {
					range.push(i);
				}
				console.log('range', range);
				props.editTable.selectTableRows(AREA.invoiceView, range, false);

				this.selectedChange.call(this, props, moduleId);
			}
		} else {
			if (total > 300 && status) {
				toast({ content: getLangByResId(this, '4004SETTLEMENT-000073'), color: 'warning' });
				let range = [];
				for (let i = 300 - invoiceRows.length; i < length; i++) {
					range.push(i);
				}
				console.log('range', range);
				props.editTable.selectTableRows(AREA.stockInVIew, range, false);
				this.selectedChange.call(this, props, moduleId);
			}
		}
	};
	selectedChange = (props, moduleId, newVal, oldVal) => {
		//console.log('selectedChange:');
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
	handleChange = (current) => {
		this.setState({
			current: current
		});
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
	getTableHead = (tableid) => {
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.cardTable.createBrowseIcons(tableid, {
						iconArr: [ 'max' ],
						maxDestAreaId: 'maxArea'
					})}
				</div>
			</div>
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
							pk_financeorg: '',
							currentModal: 0,
							stockInSearchData: {},
							invoiceSearchData: {},
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
							//this.props.search.setDisabled(AREA.invoiceSearchArea, false);
							//this.props.search.setDisabled(AREA.stockInSearchArea, false);
							//this.props.search.setDisabledByField(AREA.stockInSearchArea, 'pk_financeorg', false);

							this.props.search.setSearchValByField(AREA.stockInSearchArea, 'pk_financeorg', data);
							let meta = this.props.meta.getMeta();
							const INVOICE_FILTER_FIELD = [
								'invoicebody.pk_material.pk_marbasclass',
								'invoicebody.pk_srcmaterial.pk_marbasclass',
								'invoicebody.pk_srcmaterial',
								'pk_supplier'
							];
							const STOCK_FILTER_FIELD = [
								'pk_srcmaterial.pk_marbasclass',
								'pk_srcmaterial',
								'pk_supplier'
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
										RBInvoiceOptionableVO: res.data.rbInvoiceOption || {},
										RBStockOptionableVO: res.data.rbStockOption || {},
										InvoiceStockOptionableVO: res.data.invoiceStockOption || {}
									});
									let factor = res.data.factor;
									let meta = this.props.meta.getMeta();
									const matchViews = [ 'feeMaterial', 'sameMaterial' ];
									matchViews.forEach((view) => {
										if (meta[view] && Array.isArray(meta[view].items)) {
											meta[view].items.map((item) => {
												if (item.attrcode.startsWith('ncostfactor')) {
													if (factor.hasOwnProperty(item.attrcode)) {
														item.label = factor[item.attrcode];

														item.visible = true;
													} else {
														item.visible = false;
													}
												}
											});
										}
									});
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
				const STOCK_FILTER_FIELD = [ 'pk_srcmaterial.pk_marbasclass', 'pk_srcmaterial', 'pk_supplier' ];
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
			}
		} else {
			this.props.search.setSearchValue(AREA.stockInSearchArea, this.state.stockInSearchData);
			this.props.search.setSearchValue(AREA.invoiceSearchArea, this.state.invoiceSearchData);
		}
	};
	render() {
		const { button, search, table, cardTable, editTable, modal } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		const { createModal } = modal;
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
						})}
					</div>
					{createModal('matchValidation', {
						title: getLangByResId(this, '4004SETTLEMENT-000026') /* 国际化处理： 提示信息*/,
						content: getLangByResId(
							this,
							'4004SETTLEMENT-000027'
						) /* 国际化处理： 入库单本次结算数量大于发票的本次结算数量，继续本物料的手工结算吗？*/,
						beSureBtnClick: () => {
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
						content: getLangByResId(this, '4004SETTLEMENT-000065') /* 国际化处理： 单价超容差异常, 是否继续*/,
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
						content: createEditTable(AREA.feeView, {
							onAfterEvent: afterBodyEdit.bind(this),
							customRowHeight: true
						}),
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
						className="calc-result-modal"
						fieldid="vimmatchissuccessmodal"
					>
						<Header closeButton={true}>
							<Title>{getLangByResId(this, '4004SETTLEMENT-000066')}</Title>
							{/* 国际化处理： 消耗汇总结算*/}
						</Header>
						<Body>
							<i className="iconfont icon-wancheng " />
							<div className="pu-settlement-vimmatch-modal">
								<div className="title">{getLangByResId(this, '4004SETTLEMENT-000041')}</div>
								{/* 国际化处理： 操作完成*/}
								<div>{getLangByResId(this, '4004SETTLEMENT-000042')}：</div>
								{/* 国际化处理： 操作汇总*/}
								<div>
									{getLangByResId(this, '4004SETTLEMENT-000043')}{' '}
									{(this.state.settleBillVOs.settlevos || []).length}{' '}
									{getLangByResId(this, '4004SETTLEMENT-000044')}
									{/* 国际化处理： 已生成结算单,张*/}
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
												cacheTools.set('linkQueryByPuSettlement', { pks: pks, ts: ts });
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
									{getLangByResId(this, '4004SETTLEMENT-000048')}{' '}
									{(this.state.settleBillVOs.pk_invoice_b || []).length}{' '}
									{getLangByResId(this, '4004SETTLEMENT-000047')}
								</div>
								{/* 国际化处理： 已结算发票,条*/}
							</div>
						</Body>
						<Footer>
							<NCButton
								fieldid="settlementvimmatchclose_btn"
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
							<div className="header-title-tabs">
								<div
									fieldid="puvimmatchheader-area"
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
									fieldid="puv67immatchheader-area"
									className={
										this.state.activedTab === 1 ? 'actived header-title-tab' : 'header-title-tab'
									}
									onClick={() => {
										this.setState({ activedTab: 1 });
										this.handleChange('vim');
									}}
								>
									{getLangByResId(this, '4004SETTLEMENT-000067') /* 国际化处理： 消耗汇总查询*/}
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
								fieldid: AREA.invoiceSearchArea + '_vim',
								defaultConditionsNum: 4
							})}
						</div>
						<div style={{ display: this.state.current === 'vim' ? 'block' : 'none' }}>
							{NCCreateSearch(AREA.stockInSearchArea, {
								clickSearchBtn: searchBtnClick.bind(this),
								defaultConditionsNum: 4,
								fieldid: AREA.stockInSearchArea + '_vim',
								onAfterEvent: (field, value) => {
									if (field == 'pk_storeorg') {
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
									} else if (field == 'pk_financeorg') {
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
														current: 'vim',
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
															'pk_srcmaterial.pk_marbasclass',
															'pk_srcmaterial',
															'pk_supplier'
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
																const matchViews = [ 'feeMaterial', 'sameMaterial' ];
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
																					item.visible = true;
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
												'pk_srcmaterial.pk_marbasclass',
												'pk_srcmaterial',
												'pk_supplier'
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
					<div className="nc-bill-table-area wrapper">
						<div ref="left" className="left" id="pusettlement_invoice" style={{ width: leftWidth }}>
							<NCDiv
								fieldid={getLangByResId(this, '4004SETTLEMENT-000052') + 'vim'}
								areaCode={NCDiv.config.Area}
							>
								<div className="header">
									<div className="title">{getLangByResId(this, '4004SETTLEMENT-000052')}</div>
									{/* 国际化处理： 采购发票*/}
									<span>
										<span>{getLangByResId(this, '4004SETTLEMENT-000053')}：</span>
										<span className="count">{formatNumber(this.state.invoicenum)}</span>
										{/* 国际化处理： 本次结算数量*/}
									</span>
									<span>
										<span>{getLangByResId(this, '4004SETTLEMENT-000054')}：</span>
										<span className="count">{formatNumber(this.state.invoicemny)}</span>
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
						<div className="right" id="pusettlement_stock" style={{ width: `calc(100% - ${leftWidth})` }}>
							<NCDiv
								fieldid={getLangByResId(this, '4004SETTLEMENT-000055') + 'vim'}
								areaCode={NCDiv.config.Area}
							>
								<div className="header">
									<div className="title">{getLangByResId(this, '4004SETTLEMENT-000068')}</div>
									{/* 国际化处理： 消耗汇总*/}
									<span>
										<span>{getLangByResId(this, '4004SETTLEMENT-000056')}：</span>
										<span className="count">{formatNumber(this.state.stockinnum)}</span>
										{/* 国际化处理： 本次结算总数量*/}
									</span>

									<i
										className={
											this.state.full ? (
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
						content: getLangByResId(
							this,
							'4004SETTLEMENT-000027'
						) /* 国际化处理： 入库单本次结算数量大于发票的本次结算数量，继续本物料的手工结算吗？*/,
						beSureBtnClick: () => {
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
						content: getLangByResId(this, '4004SETTLEMENT-000065') /* 国际化处理： 单价超容差异常, 是否继续*/,
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
						content: createEditTable(AREA.feeView, {
							onAfterEvent: afterBodyEdit.bind(this),
							customRowHeight: true
						}),
						beSureBtnClick: () => {
							FeeDistributeAction.feeDistribute(this, true);
							//feeDistribute.call(this, true);
						},
						rightBtnName: getLangByResId(this, '4004SETTLEMENT-000028') /* 国际化处理： 取消*/
					})}
				</div>
			);
		}
	}
}

VimMatch = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.vim,
		bodycode: {
			[AREA.stockInVIew]: 'editTable',
			[AREA.invoiceView]: 'editTable',
			[AREA.feeView]: 'editTable',
			['sameMaterial']: 'editTable',
			['feeMaterial']: 'editTable' //此处发生变化了，需要传一个对象
		}
	}
})(VimMatch);
ReactDOM.render(<VimMatch />, document.querySelector('#app'));
