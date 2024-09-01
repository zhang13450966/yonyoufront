/*
 * @Author: CongKe
 * @PageInfo: 采购订单多来源拉单
 * @Date: 2018-06-29 14:09:08
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 23:11:38
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, createPageIcon } from 'nc-lightapp-front';
const { NCButton, NCDiv } = base;
import { PAGEAREA, PK } from './const';
import { URL, OrderCache, PAGECODE } from '../constance';
import getNumber from './utils/getNumber';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn } = base;
import { init23Template, init45Template, initAllTemplate } from './init';
import { serach23_btnClick, serach45_btnClick, serachAll_btnClick, selected_BtnClick } from './btnClicks';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class MultiTransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGEAREA.searchall);
		props.use.search(PAGEAREA.search23);
		props.use.search(PAGEAREA.search45);
		this.curheadTableId = PK.head23; //当前页签的主表id
		this.state = {
			ntotalnum: 0,
			scene: '', //应用场景
			showHeader: true,
			toggleViewStatus: false
		};
		this.srcappcode = null;
		this.tableId = PAGEAREA.headall;
		this.fullTableId = PAGEAREA.VIEWALL;
		this.templet23id = '';
		this.templet45id = '';
		this.templetallid = '';
		this.oid23 = '';
		this.oid45 = '';
		// initAllTemplate.call(this, this.props);
		initLang(this, [ '4004poorder' ], 'pu', initAllTemplate.bind(this, this.props));
	}

	componentDidMount() {
		// initAllTemplate(this.props); //进页面后必须加载全部页签模板，不然点已选列表没有反应
	}

	onAllAfterEvent(props, field, val) {
		if (field == 'pk_purchaseorg') {
			multiCorpRefHandler(props, val, PAGEAREA.searchall, [
				'pk_supplier',
				'pk_pupsndoc',
				'pk_dept',
				'pk_arriveorder_b.pk_srcmaterial',
				'pk_arriveorder_b.pk_srcmaterial.code',
				'pk_arriveorder_b.pk_srcmaterial.name',
				'pk_arriveorder_b.pk_srcmaterial.pk_marbasclass',
				'billmaker',
				'approver'
			]);
		}
	}

	on23AfterEvent(props, field, val) {
		if (field == 'pk_purchaseorg') {
			multiCorpRefHandler(props, val, PAGEAREA.search23, [
				'pk_supplier',
				'pk_pupsndoc',
				'pk_dept',
				'billmaker',
				'approver',
				'pk_arriveorder_b.pk_srcmaterial',
				'pk_arriveorder_b.pk_srcmaterial.code',
				'pk_arriveorder_b.pk_srcmaterial.name',
				'pk_arriveorder_b.pk_srcmaterial.pk_marbasclass'
			]);
		}
	}

	on45AfterEvent(props, field, val) {
		if (field == 'cpurorgoid') {
			multiCorpRefHandler(props, val, PAGEAREA.search45, [
				'cbizid',
				'cdptid',
				'billmaker',
				'approver',
				'cgeneralbid.cmaterialoid',
				'cgeneralbid.cmaterialoid.code',
				'cgeneralbid.cmaterialoid.name',
				'cgeneralbid.cmaterialoid.pk_marbasclass',
				'cgeneralbid.cvendorid'
			]);
		}
	}

	renderAllCompleteEvent = () => {
		let pk_purchaseorg = this.props.search.getSearchValByField(PAGEAREA.searchall, 'pk_purchaseorg');
		if (pk_purchaseorg && pk_purchaseorg.value && pk_purchaseorg.value.firstvalue) {
			let value = pk_purchaseorg.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAllAfterEvent(this.props, 'pk_purchaseorg', arr);
		}
	};

	render23CompleteEvent = () => {
		let pk_purchaseorg = this.props.search.getSearchValByField(PAGEAREA.search23, 'pk_purchaseorg');
		if (pk_purchaseorg && pk_purchaseorg.value && pk_purchaseorg.value.firstvalue) {
			let value = pk_purchaseorg.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.on23AfterEvent(this.props, 'pk_purchaseorg', arr);
		}
	};

	render45CompleteEvent = () => {
		let cpurorgoid = this.props.search.getSearchValByField(PAGEAREA.search45, 'cpurorgoid');
		if (cpurorgoid && cpurorgoid.value && cpurorgoid.value.firstvalue) {
			let value = cpurorgoid.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.on45AfterEvent(this.props, 'cpurorgoid', arr);
		}
	};

	// 计算合计 num
	calTotal = (flag, record, bodys, numkey) => {
		let ntotalnum = this.state.ntotalnum;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum += getNumber(line[numkey]);
				}
			} else {
				ntotalnum += getNumber(record[numkey]);
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum -= getNumber(line[numkey]);
				}
			} else {
				ntotalnum -= getNumber(record[numkey]);
			}
		}
		this.setState({
			ntotalnum: ntotalnum
		});
	};

	// 刷新查询
	searchBtnClick = () => {
		let tableId = this.tableId;
		if (tableId == PAGEAREA.headall) {
			serachAll_btnClick.call(this, this.props, true);
		} else if (tableId == PAGEAREA.head23) {
			serach23_btnClick.call(this, this.props, true);
		} else {
			serach45_btnClick.call(this, this.props, true);
		}
	};

	handleClick() {}

	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createMultiTransferTable } = transferTable;
		const { NCButton } = base;
		// let totalstr = `${getLangByResId(this, '4004POORDER-000087')}：${this.state.ntotalnum}`; /* 国际化处理： 本次订货主数量*/
		let totalTitle = `${getLangByResId(this, '4004POORDER-000087')}`; /* 国际化处理： 本次订货主数量*/
		let selectedShow = transferTable.getSelectedListDisplay('all');
		let scene = this.props.getUrlParam('scene');
		let _this = this;
		return (
			<div id="MultiTransfer" className="nc-bill-list">
				{/* // TODO 样式调整 */}
				{!selectedShow && (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{scene != 'Y' ? (
								<NCBackBtn
									onClick={() => {
										this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
									}}
								/>
							) : (
								''
							)}
							<div className="header-title-search-area">
								{createPageIcon()}
								<h2 className="title-search-detail">
									{getLangByResId(this, '4004POORDER-000091')}/
									{getLangByResId(this, '4004POORDER-000090')}
								</h2>
								{/* 国际化处理： 选择退货单,退库单*/}
							</div>

							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: PAGEAREA.headall,
									onButtonClick: this.searchBtnClick
								})}
							</div>
							{/* <NCSetColBtn onClick={this.handleClick} /> */}
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (
										_this.fullTableId == PAGEAREA.VIEWALL &&
										!_this.props.meta.getMeta()[PAGEAREA.VIEWALL]
									) {
										initAllTemplate.call(_this); //加载主子拉平模板
									}
									if (
										_this.fullTableId == PAGEAREA.VIEW23 &&
										!_this.props.meta.getMeta()[PAGEAREA.VIEW23]
									) {
										init23Template.call(_this); //加载主子拉平模板
									}
									if (
										_this.fullTableId == PAGEAREA.VIEW45 &&
										!_this.props.meta.getMeta()[PAGEAREA.VIEW45]
									) {
										init45Template.call(_this); //加载主子拉平模板
									}
									_this.props.transferTable.changeViewType(this.fullTableId);
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
					</div>
				)}
				<div>
					{/* 创建多来源转单 */}
					{createMultiTransferTable(
						{
							totalKey: [ [ 'ncanreplnum' ] ],
							totalTitle: [ totalTitle ],
							onTabClick: (key) => {
								//点击页签的钩子函数
								//拿到当前页签的headTableId给转单页面使用
								switch (key) {
									case '1':
										this.tableId = PAGEAREA.head23;
										this.fullTableId = PAGEAREA.VIEW23;
										this.curheadTableId = PAGEAREA.head23; //记录主表id，供下游转单使用
										if (!this.props.meta.getMeta()[PAGEAREA.head23]) {
											init23Template.call(this, this.props);
										}
										break;
									case '2':
										this.tableId = PAGEAREA.head45;
										this.fullTableId = PAGEAREA.VIEW45;
										this.curheadTableId = PAGEAREA.head45; //记录主表id，供下游转单使用
										if (!this.props.meta.getMeta()[PAGEAREA.head45]) {
											init45Template.call(this, this.props);
										}
										break;
									default:
										this.tableId = PAGEAREA.headall;
										this.fullTableId = PAGEAREA.VIEWALL;
										this.curheadTableId = PAGEAREA.headall;
										if (!this.props.meta.getMeta()[PAGEAREA.headall]) {
											initAllTemplate.call(this, this.props);
										}
										break;
								}
							},
							dataSource: OrderCache.OrderTransferCache,
							showAll: true, //是否显示全部页签，不显示全部页签时不需要设置 默认为false
							//==========以下参数必须设置showAll为true时才生效==========
							allHeadId: PAGEAREA.headall, //全部页签的主表id
							allBodyId: PAGEAREA.bodyall, //全部页签的子表id
							allFullTableId: this.fullTableId, //主子拉平模板id
							transferBtnText: getLangByResId(this, '4004POORDER-000086'), //转单按钮显示文字/* 国际化处理： 生成采购订单*/
							containerSelector: '#MultiTransfer', //容器的选择器 必须唯一,用于设置底部已选区域宽度
							headPkIds: [ PK.head23, PK.head45 ],
							bodyPkIds: [ PK.body23, PK.body45 ],
							onTransferBtnClick: () => {
								//点击转单按钮钩子函数
								if (scene) {
									this.props.pushTo(URL.gotoCard, {
										appcode: '400400800',
										srcappcode: this.srcappcode,
										status: 'edit',
										scene: scene,
										transfer: 'MULTI',
										pagecode: PAGECODE.cardcode
									});
								} else {
									this.props.pushTo(URL.gotoCard, {
										status: 'edit',
										scene: scene,
										transfer: 'MULTI',
										pagecode: PAGECODE.cardcode
									});
								}
							},
							onChangeViewClick: () => {
								//点击切换视图钩子函数
								if (
									_this.fullTableId == PAGEAREA.VIEWALL &&
									!_this.props.meta.getMeta()[PAGEAREA.VIEWALL]
								) {
									initAllTemplate.call(_this); //加载主子拉平模板
								}
								if (
									_this.fullTableId == PAGEAREA.VIEW23 &&
									!_this.props.meta.getMeta()[PAGEAREA.VIEW23]
								) {
									init23Template.call(_this); //加载主子拉平模板
								}
								if (
									_this.fullTableId == PAGEAREA.VIEW45 &&
									!_this.props.meta.getMeta()[PAGEAREA.VIEW45]
								) {
									init45Template.call(_this); //加载主子拉平模板
								}
								_this.props.transferTable.changeViewType(_this.fullTableId);
								this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
							}
							// onSelectedBtnClick: selected_BtnClick.bind(this),
							// selectArea: () => {
							// 	//已选列表个性化区域
							// 	return <span>{totalstr}</span>;
							// },
							// onClearAll: () => {
							// 	this.setState({
							// 		ntotalnum: 0
							// 	});
							// },
							// onCheckedChange: (flag, record, index, bodys) => {
							// 	// 计算下方合计
							// 	this.calTotal(flag, record, bodys);
							// },
							// onSelectedItemRemove: (record, bodys) => {
							// 	// 计算下方合计
							// 	this.calTotal(false, record, bodys, 'ncanreplnum');
							// }
						},
						[
							{
								tabName: getLangByResId(this, '4004POORDER-000076'), //tab页签显示文字/* 国际化处理： 全部*/
								headTableId: PAGEAREA.headall, //表格组件id
								bodyTableId: PAGEAREA.bodyall, //子表模板id
								fullTableId: PAGEAREA.VIEWALL, //主子拉平模板id
								searchArea: () => {
									//查询区域render
									return NCCreateSearch(PAGEAREA.searchall, {
										clickSearchBtn: serachAll_btnClick.bind(this),
										onAfterEvent: this.onAllAfterEvent.bind(this, this.props),
										renderCompleteEvent: this.renderAllCompleteEvent,
										statusChangeEvent: this.renderAllCompleteEvent,
										currentSearch: this.tableId == PAGEAREA.headall,
										fieldid: PAGEAREA.searchall
									});
								}
								// onCheckedChange: (flag, record, index, bodys) => {
								// 	// 计算下方合计
								// 	this.calTotal(flag, record, bodys, 'ncanreplnum');
								// },
								// onClearAll: () => {
								// 	this.setState({
								// 		ntotalnum: 0
								// 	});
								// }
							},
							{
								tabName: getLangByResId(this, '4004POORDER-000089'), //tab页签显示文字/* 国际化处理： 退货单*/
								headTableId: PAGEAREA.head23, //表格组件id
								bodyTableId: PAGEAREA.body23, //子表模板id
								fullTableId: PAGEAREA.VIEW23, //主子拉平模板id
								searchArea: () => {
									//查询区域render
									return NCCreateSearch(PAGEAREA.search23, {
										clickSearchBtn: serach23_btnClick.bind(this),
										onAfterEvent: this.on23AfterEvent.bind(this, this.props),
										renderCompleteEvent: this.render23CompleteEvent,
										statusChangeEvent: this.render23CompleteEvent,
										currentSearch: this.tableId == PAGEAREA.head23,
										fieldid: PAGEAREA.search23
									});
								}
								// onCheckedChange: (flag, record, index, bodys) => {
								// 	// 计算下方合计
								// 	this.calTotal(flag, record, bodys, 'ncanreplnum');
								// },
								// onClearAll: () => {
								// 	this.setState({
								// 		ntotalnum: 0
								// 	});
								// }
							},
							{
								tabName: getLangByResId(this, '4004POORDER-000090'), //tab页签显示文字/* 国际化处理： 退库单*/
								headTableId: PAGEAREA.head45, //表格组件id
								bodyTableId: PAGEAREA.body45, //子表模板id
								fullTableId: PAGEAREA.VIEW45, //主子拉平模板id
								searchArea: () => {
									//查询区域render
									return NCCreateSearch(PAGEAREA.search45, {
										clickSearchBtn: serach45_btnClick.bind(this),
										onAfterEvent: this.on45AfterEvent.bind(this, this.props),
										renderCompleteEvent: this.render45CompleteEvent,
										statusChangeEvent: this.render45CompleteEvent,
										currentSearch: this.tableId == PAGEAREA.head45,
										fieldid: PAGEAREA.search45
									});
								}
								// onCheckedChange: (flag, record, index, bodys) => {
								// 	// 计算下方合计
								// 	this.calTotal(flag, record, bodys, 'ncanreplnum');
								// },
								// onClearAll: () => {
								// 	this.setState({
								// 		ntotalnum: 0
								// 	});
								// }
							}
						]
					)}
				</div>
			</div>
		);
	}
}
MultiTransferTable = createPage({})(MultiTransferTable);
export default MultiTransferTable;
// ReactDOM.render(<MultiTransferTable />, document.querySelector('#app'));
