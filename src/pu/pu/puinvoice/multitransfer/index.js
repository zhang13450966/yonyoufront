/*
 * @Author: jiangfw
 * @PageInfo: 收票多来源拉单
 * @Date: 2018-06-15 13:49:34
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-30 11:03:54
 */
import React, { Component } from 'react';
import { ajax, createPage, base, sum, createPageIcon } from 'nc-lightapp-front';
import getNumber from './utils/getNumber';
import { init4TTemplate, init21Template, init45Template, initAllTemplate } from './init';
import {
	search21BtnClick,
	search45BtnClick,
	search4TBtnClick,
	searchAllBtnClick,
	selected_BtnClick,
	btnClick,
	scanBtnClick
} from './btnClicks';
//import ScanCode from '../../../../uap/msgcenter/message/scanCodeView';
import ScanCodeView from 'uap/common/components/scanCodeView';
import {
	UISTATE,
	TRANSFER_TYPE,
	URL,
	BILLTYPE,
	AREA,
	PK,
	COMMON,
	MAIN_ORG_FIELD,
	APPCODE,
	BUTTONID,
	PAGECODE
} from '../constance';
import searchAfterEvent from '../utils/searchAfterEvent';
import clickBackBtn from './btnClicks/backBtnClick';
import renderCompleteEvent from '../utils/renderCompleteEvent';
const { NCBackBtn, NCToggleViewBtn, NCSetColBtn, NCDiv, NCFormControl } = base;
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
let dataSource = COMMON.TransferCacheKey;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

class MultiTransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchAll);
		props.use.search(AREA.search21);
		props.use.search(AREA.search45);
		props.use.search(AREA.search4T);
		this.state = {
			// ntotalnum: 0,
			// ntotalmny: 0,
			fullTableId: AREA.viewAll,
			scanValue: '',
			toggleViewStatus: false,
			canScan: true
		};

		this.templetid_21; //拉采购订单模板id
		this.qTempletid_21; //拉采购订单查询模板id
		this.templetid_45; //拉采购入库单模板id
		this.qTempletid_45; //拉采购入库单查询模板id
		this.templetid_4T; //拉期初暂估单模板id
		this.qTempletid_4T; //拉期初暂估单查询模板id

		this.transType;
		//当前页签的主表id
		this.curheadTableId = AREA.headAll;
		// 汇总标志
		this.combineflag = props.combineflag;
		// 是否参照增行
		this.isRefAddLine = props.isRefAddLine;
		this.combineCache = props.combineCache;
		// 发票vo
		this.billvo = props.billvo;
		this.refAddLineComfirm_Btn_Click = props.refAddLineComfirm_Btn_Click;

		initLang(this, [ '4004puinvoice' ], 'pu', initAllTemplate.bind(this, this.props));
	}

	// 计算合计
	calTotal = (flag, record, bodys, numkey, mnykey) => {
		let ntotalnum = this.state.ntotalnum;
		let ntotalmny = this.state.ntotalmny;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, getNumber(line[numkey]));
					ntotalmny = sum(ntotalmny, getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, getNumber(record[numkey]));
				ntotalmny = sum(ntotalmny, getNumber(record[mnykey]));
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, -getNumber(line[numkey]));
					ntotalmny = sum(ntotalmny, -getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, -getNumber(record[numkey]));
				ntotalmny = sum(ntotalmny, -getNumber(record[mnykey]));
			}
		}
		this.setState({
			ntotalnum: ntotalnum,
			ntotalmny: ntotalmny
		});
	};

	// 视图切换
	changeViewClick = () => {
		//点击切换视图钩子函数
		if (this.state.fullTableId == AREA.viewAll && !this.props.meta.getMeta()[AREA.viewAll]) {
			initAllTemplate.call(this, this.props);
		}
		if (this.state.fullTableId == AREA.view21 && !this.props.meta.getMeta()[AREA.view21]) {
			init21Template.call(this, this.props);
		}
		if (this.state.fullTableId == AREA.view45 && !this.props.meta.getMeta()[AREA.view45]) {
			init45Template.call(this);
		}
		if (this.state.fullTableId == AREA.view4T && !this.props.meta.getMeta()[AREA.view4T]) {
			init4TTemplate.call(this);
		}
		this.props.transferTable.changeViewType(this.state.fullTableId);
		this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
	};
	scanTransfer() {
		this.props.modal.show('general', {
			title: getLangByResId(this, '4004PUINVOICE-000086') /* 国际化处理： 扫码结果*/,
			size: 'lg',
			noFooter: true,
			content: <ScanCodeView props={this.props} scanCodeSearchMessage={this.scanCodeSearchMessage.bind(this)} />
		});
	}

	onScanTransferChange = (e) => {
		this.setState({ scanValue: e });
	};

	onScanTransfer = (e) => {
		let scanValue = this.state.scanValue;
		this.setState({ scanValue: '' });
		scanBtnClick.call(this, null, scanValue);
	};

	scanCodeSearchMessage = (value) => {
		if (value == null || value == '') {
			return;
		}
		//检查
		scanBtnClick.call(this, null, value);
	};
	//控制多页签的点击加载模板
	tabClick = (key) => {
		// let orderShow = this.state.orderShow; // 采购订单
		// let purchaseInShow = this.state.purchaseInShow; //采购入库单
		// let initEstimateShow = this.state.initEstimateShow; //期初暂估单
		// if (orderShow && purchaseInShow && initEstimateShow) {
		let srcBillType = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData).srcBillType;
		if (srcBillType.length == 3) {
			//点击页签的钩子函数
			//拿到当前页签的headTableId给转单页面使用
			switch (key) {
				case '1': //采购订单
					this.setState({
						fullTableId: AREA.view21,
						canScan: false
					});
					this.curheadTableId = AREA.head21; //记录主表id，供下游转单使用
					if (!this.props.meta.getMeta()[AREA.head21]) {
						init21Template.call(this, this.props);
					}
					break;
				case '2': //采购入库单
					this.setState({
						fullTableId: AREA.view45,
						canScan: false
					});
					this.curheadTableId = AREA.head45; //记录主表id，供下游转单使用
					if (!this.props.meta.getMeta()[AREA.head45]) {
						init45Template.call(this, this.props);
					}
					break;
				case '3': //期初暂估单
					this.setState({
						fullTableId: AREA.view4T,
						canScan: false
					});
					this.curheadTableId = AREA.head4T; //记录主表id，供下游转单使用
					if (!this.props.meta.getMeta()[AREA.head4T]) {
						init4TTemplate.call(this, this.props);
					}
					break;
				default:
					this.setState({
						fullTableId: AREA.viewAll,
						canScan: true
					});
					this.curheadTableId = AREA.headAll;
					break;
			}
			// } else if (orderShow && purchaseInShow) {
		} else if (srcBillType.length == 2) {
			if (!(srcBillType.indexOf(BILLTYPE.po_order) != -1)) {
				//无采购订单
				switch (key) {
					case '1': //采购入库单
						this.setState({
							fullTableId: AREA.view45,
							canScan: false
						});
						this.curheadTableId = AREA.head45; //记录主表id，供下游转单使用
						if (!this.props.meta.getMeta()[AREA.head45]) {
							init45Template.call(this, this.props);
						}
						break;
					case '2': //期初暂估单
						this.setState({
							fullTableId: AREA.view4T,
							canScan: false
						});
						this.curheadTableId = AREA.head4T; //记录主表id，供下游转单使用
						if (!this.props.meta.getMeta()[AREA.head4T]) {
							init4TTemplate.call(this, this.props);
						}
						break;
					default:
						this.setState({
							fullTableId: AREA.viewAll,
							canScan: true
						});
						this.curheadTableId = AREA.headAll;
						break;
				}
			} else if (!(srcBillType.indexOf(BILLTYPE.purchaseIn) != -1)) {
				//无采购入库单
				switch (key) {
					case '1': //采购订单
						this.setState({
							fullTableId: AREA.view21,
							canScan: false
						});
						this.curheadTableId = AREA.head21; //记录主表id，供下游转单使用
						if (!this.props.meta.getMeta()[AREA.head21]) {
							init21Template.call(this, this.props);
						}
						break;
					case '2': //期初暂估单
						this.setState({
							fullTableId: AREA.view4T,
							canScan: false
						});
						this.curheadTableId = AREA.head4T; //记录主表id，供下游转单使用
						if (!this.props.meta.getMeta()[AREA.head4T]) {
							init4TTemplate.call(this, this.props);
						}
						break;
					default:
						this.setState({
							fullTableId: AREA.viewAll,
							canScan: true
						});
						this.curheadTableId = AREA.headAll;
						break;
				}
			} else if (!(srcBillType.indexOf(BILLTYPE.initEstimate) != -1)) {
				// 无期初暂估单
				switch (key) {
					case '1': //采购订单
						this.setState({
							fullTableId: AREA.view21,
							canScan: false
						});
						this.curheadTableId = AREA.head21; //记录主表id，供下游转单使用
						if (!this.props.meta.getMeta()[AREA.head21]) {
							init21Template.call(this, this.props);
						}
						this.props.button.setButtonVisible([ BUTTONID.ScanTransfer ], false);
						break;
					case '2': //采购入库单
						this.setState({
							fullTableId: AREA.view45,
							canScan: false
						});
						this.curheadTableId = AREA.head45; //记录主表id，供下游转单使用
						if (!this.props.meta.getMeta()[AREA.head45]) {
							init45Template.call(this, this.props);
						}
						this.props.button.setButtonVisible([ BUTTONID.ScanTransfer ], false);
						break;
					default:
						this.setState({
							fullTableId: AREA.viewAll,
							canScan: true
						});
						this.curheadTableId = AREA.headAll;
						this.props.button.setButtonVisible([ BUTTONID.ScanTransfer ], true);
						break;
				}
			}
		}
	};

	handleClick() {}

	// react：界面渲染函数
	render() {
		const { transferTable, search, modal } = this.props;
		const { NCCreateSearch } = search;
		const { createModal } = modal;
		const { createMultiTransferTable } = transferTable;
		//合计字段显示名称
		// let totalstr = `${getLangByResId(this, '4004PUINVOICE-000060')}：${this.state.ntotalnum} ${getLangByResId(
		// 	this,
		// 	'4004PUINVOICE-000061'
		// )}：${this.state.ntotalmny}`; /* 国际化处理： 本次收票数量,本次收票金额*/
		let totalTitle = [
			getLangByResId(this, '4004PUINVOICE-000060'),
			getLangByResId(this, '4004PUINVOICE-000061')
		]; /* 国际化处理： 本次收票数量,本次收票金额*/

		let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
		let srcBillType = busiInfoData.srcBillType;
		this.transType = busiInfoData.transType;
		// 全部页签
		let allTab = {
			tabName: getLangByResId(this, '4004PUINVOICE-000055'), //tab页签显示文字/* 国际化处理： 全部*/
			headTableId: AREA.headAll, //表头区域
			bodyTableId: AREA.bodyAll, //表体区域
			fullTableId: AREA.viewAll, //主子拉平区域
			searchArea: () => {
				//查询区域render
				return NCCreateSearch(AREA.searchAll, {
					clickSearchBtn: searchAllBtnClick.bind(this, null),
					// clickSearchBtn: searchAllBtnClick.bind(this),
					onAfterEvent: searchAfterEvent.bind(this, AREA.searchAll),
					renderCompleteEvent: renderCompleteEvent.bind(this, AREA.searchAll, MAIN_ORG_FIELD.searchAllOrg),
					statusChangeEvent: renderCompleteEvent.bind(this, AREA.searchAll, MAIN_ORG_FIELD.searchAllOrg),
					fieldid: AREA.searchAll
					// context: this.state.context_q
				});
			},

			onCheckedChange: (flag, record, index, bodys) => {
				// 计算下方合计
				// this.calTotal(flag, record, bodys, 'ncaninvoicenum', 'ncaninvoicemny');
			}
		};
		// 采购订单页签
		let orderTab = {
			tabName: getLangByResId(this, '4004PUINVOICE-000033'), //tab页签显示文字/* 国际化处理： 采购订单*/
			headTableId: AREA.head21, //表头区域
			bodyTableId: AREA.body21, //表体区域
			fullTableId: AREA.view21, //主子拉平区域
			searchArea: () => {
				//查询区域render
				return NCCreateSearch(AREA.search21, {
					clickSearchBtn: search21BtnClick.bind(this, null),
					onAfterEvent: searchAfterEvent.bind(this, AREA.search21),
					renderCompleteEvent: renderCompleteEvent.bind(this, AREA.search21, MAIN_ORG_FIELD.search21Org),
					statusChangeEvent: renderCompleteEvent.bind(this, AREA.search21, MAIN_ORG_FIELD.search21Org),
					fieldid: AREA.search21
					// context: this.context_q
				});
			},

			onCheckedChange: (flag, record, index, bodys) => {
				// 计算下方合计
				// this.calTotal(flag, record, bodys, 'ncaninvoicenum', 'ncaninvoicemny');
			}
		};
		// 采购入库单页签
		let purchaseInTab = {
			tabName: getLangByResId(this, '4004PUINVOICE-000034'), //tab页签显示文字/* 国际化处理： 采购入库单*/
			headTableId: AREA.head45, //表头区域
			bodyTableId: AREA.body45, //表体区域
			fullTableId: AREA.view45, //主子拉平区域
			searchArea: () => {
				//查询区域
				return NCCreateSearch(AREA.search45, {
					clickSearchBtn: search45BtnClick.bind(this, null),
					onAfterEvent: searchAfterEvent.bind(this, AREA.search45),
					renderCompleteEvent: renderCompleteEvent.bind(this, AREA.search45, MAIN_ORG_FIELD.search45Org),
					statusChangeEvent: renderCompleteEvent.bind(this, AREA.search45, MAIN_ORG_FIELD.search45Org),
					fieldid: AREA.search45
					// context: this.context_q
				});
			},

			onCheckedChange: (flag, record, index, bodys) => {
				// 计算下方合计
				// this.calTotal(flag, record, bodys, 'ninvoicenum', 'ninvoicemny');
			}
		};
		// 期初暂估单页签
		let initEstimateTab = {
			tabName: getLangByResId(this, '4004PUINVOICE-000035'), //tab页签显示文字/* 国际化处理： 期初暂估单*/
			headTableId: AREA.head4T, //表头区域
			bodyTableId: AREA.body4T, //表体区域
			fullTableId: AREA.view4T, //主子拉平区域
			searchArea: () => {
				//查询区域render
				return NCCreateSearch(AREA.search4T, {
					clickSearchBtn: search4TBtnClick.bind(this, null),
					onAfterEvent: searchAfterEvent.bind(this, AREA.search4T),
					renderCompleteEvent: renderCompleteEvent.bind(this, AREA.search4T, MAIN_ORG_FIELD.search4TOrg),
					statusChangeEvent: renderCompleteEvent.bind(this, AREA.search4T, MAIN_ORG_FIELD.search4TOrg),
					fieldid: AREA.search4T
					// context: this.context_q
				});
			},

			onCheckedChange: (flag, record, index, bodys) => {
				// 计算下方合计
				// this.calTotal(flag, record, bodys, 'ncaninvoicenum', 'ncaninvoicemny');
			}
		};

		//组装页签信息
		let tabdata = [];
		//全部页签
		tabdata.push(allTab);
		if (srcBillType.indexOf(BILLTYPE.po_order) != -1) {
			// 采购订单
			tabdata.push(orderTab);
		}
		if (srcBillType.indexOf(BILLTYPE.purchaseIn) != -1) {
			//采购入库单
			tabdata.push(purchaseInTab);
		}
		if (srcBillType.indexOf(BILLTYPE.initEstimate) != -1) {
			//期初暂估单
			tabdata.push(initEstimateTab);
		}

		let selectedShow = transferTable.getSelectedListDisplay('all');
		let appid = busiInfoData.appid;
		let scanStyle = { display: this.state.canScan ? 'block' : 'none' };
		return (
			<div id="MultiTransfer" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{/* {appid ? null : (
								<NCBackBtn //返回
									onClick={clickBackBtn.bind(this)}
								/>
							)} */}
							{appid ? (
								<div className="header-title-search-area">
									{createPageIcon()}
									<h2 className="title-search-detail">
										{getLangByResId(this, '4004PUINVOICE-000062')}/
										{getLangByResId(this, '4004PUINVOICE-000063')}
									</h2>
									{/* 国际化处理： 选择订单,入库单*/}
								</div>
							) : (
								<div className="header-title-search-area">
									{createCardTitle(this, {
										title:
											getLangByResId(this, '4004PUINVOICE-000062') +
											'/' +
											getLangByResId(this, '4004PUINVOICE-000063') /* 国际化处理： 选择订单,入库单*/,
										backBtnClick: () => {
											clickBackBtn.call(this);
										}
									})}
								</div>
							)}
							<div className="header-button-area">
								{
									<div style={scanStyle}>
										<NCFormControl
											className="search"
											value={this.state.scanValue}
											placeholder={getLangByResId(this, '4004PUINVOICE-000087') /* 国际化处理： 扫码拉单*/}
											onChange={this.onScanTransferChange}
											onSearch={this.onScanTransfer}
										/>
									</div>
								}
								{this.props.button.createButtonApp({
									area: AREA.list_head,
									onButtonClick: btnClick.bind(this)
								})}
							</div>
							{/* <NCSetColBtn
								onClick={() => {
									this.handleClick;
								}}
							/> */}
							<NCToggleViewBtn //视图切换
								style={{ float: 'right' }}
								expand={this.state.toggleViewStatus}
								onClick={() => {
									this.changeViewClick.call(this);
								}}
							/>
						</NCDiv>
					</div>
				) : (
					''
				)}
				<div className="nc-bill-transferTable-area">
					{/* 创建多来源转单 */}
					{createMultiTransferTable(
						{
							onTabClick: (key) => {
								//点击页签的钩子函数
								//拿到当前页签的headTableId给转单页面使用
								this.tabClick.call(this, key);
							},

							totalKey: [ [ 'ncaninvoicenum', 'ninvoicenum' ], [ 'ncaninvoicemny', 'ninvoicemny' ] ],
							totalTitle: totalTitle,
							dataSource: dataSource,
							showAll: true, //是否显示全部页签，不显示全部页签时不需要设置 默认为false
							//==========以下参数必须设置showAll为true时才生效==========
							allHeadId: AREA.headAll, //全部页签区域
							allBodyId: AREA.bodyAll, //全部页签区域
							allFullTableId: AREA.viewAll, //主子拉平模板区域
							headPkIds: [ PK.head21pk, PK.head45pk, PK.head4Tpk ],
							bodyPkIds: [ PK.body21pk, PK.body45pk, PK.body4Tpk ],
							transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成发票*/
							containerSelector: '#MultiTransfer', //容器的选择器 必须唯一,用于设置底部已选区域宽度
							selectedHeaderRender: () => {
								return '';
							},
							onTransferBtnClick: () => {
								//点击转单按钮钩子函数
								let _this = this;
								if (_this.isRefAddLine == true) {
								} else {
									if (appid) {
										_this.props.pushTo(URL.card, {
											type: TRANSFER_TYPE.invoice,
											status: UISTATE.edit,
											appid: appid,
											appcode: APPCODE.puinvoice,
											pagecode: PAGECODE.invoiceCard
										});
									} else {
										_this.props.pushTo(URL.card, {
											type: TRANSFER_TYPE.invoice,
											status: UISTATE.edit,
											appid: appid,
											pagecode: PAGECODE.invoiceCard
											// appcode: APPCODE.puinvoice
										});
									}
								}
							},
							onChangeViewClick: () => {
								this.changeViewClick.call(this);
							},
							// 查询按钮
							onSelectedBtnClick: selected_BtnClick.bind(this),
							// 查询区
							selectArea: () => {
								//已选列表个性化区域
								// return <span>{totalstr}</span>;
							},
							onClearAll: () => {
								// this.setState({
								// 	ntotalnum: 0,
								// 	ntotalmny: 0
								// });
							},
							onSelectedItemRemove: (record, bodys) => {
								// 计算下方合计
								// this.calTotal(false, record, bodys, 'ncaninvoicenum', 'ncaninvoicemny');
							}
						},
						// 页签信息
						tabdata
						//合计字段信息
						// totalFields
					)}
				</div>
				{createModal('general')}
			</div>
		);
	}
}
MultiTransferTable = createPage({})(MultiTransferTable);
// ReactDOM.render(<MultiTransferTable />, document.querySelector('#app'));
export default MultiTransferTable;
