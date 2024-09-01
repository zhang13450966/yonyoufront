/*
 * @Author: jiangfw
 * @PageInfo: 委外收票
 * @Date: 2018-06-15 13:49:34
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-09 14:58:13
 */
import React, { Component } from 'react';
import { createPage, base, sum, createPageIcon } from 'nc-lightapp-front';
import { init47Template, init61Template, initScAllTemplate } from './init';
import { search61BtnClick, search47BtnClick, searchAllBtnClick, selected_BtnClick, btnClick } from './btnClicks';
import { UISTATE, AREA, PK, TRANSFER_TYPE, URL, COMMON, MAIN_ORG_FIELD, APPCODE, PAGECODE } from '../constance';
import getNumber from '../utils/getNumber';
import searchAfterEvent from '../utils/searchAfterEvent';
import clickBackBtn from '../utils/backBtnClick';
import renderCompleteEvent from '../utils/renderCompleteEvent';
const { NCBackBtn, NCToggleViewBtn, NCSetColBtn, NCDiv } = base;
let refDataSource = COMMON.TransferCacheKey;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

class MultiTransferTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchAll);
		props.use.search(AREA.search61);
		props.use.search(AREA.search47);
		this.state = {
			// ntotalnum: 0,
			// ntotalmny: 0,
			fullTableId: AREA.viewScAll,
			toggleViewStatus: false
		};

		this.templetid_61; //委外订单模板id
		this.qTempletid_61; //委外订单查询模板id
		this.templetid_47; //委托加工入库单模板id
		this.qTempletid_47; //委托加工入库单模板id

		this.transType;
		//当前页签的主表id
		this.curheadTableId = AREA.headAll;
		// 发票vo
		this.billvo = props.billvo;
		this.refAddLineComfirm_Btn_Click = props.refAddLineComfirm_Btn_Click;

		initLang(this, [ '4004puinvoice' ], 'pu', initScAllTemplate.bind(this, this.props));
	}

	componentDidMount() {}

	// 计算合计
	calTotal = (flag, record, bodys, numkey, mnykey) => {
		let ntotalnum = this.state.ntotalnum;
		// let ntotalmny = this.state.ntotalmny;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, getNumber(line[numkey]));
					// ntotalmny = sum(ntotalmny, getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, getNumber(record[numkey]));
				// ntotalmny = sum(ntotalmny, getNumber(record[mnykey]));
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum = sum(ntotalnum, -getNumber(line[numkey]));
					// ntotalmny = sum(ntotalmny, -getNumber(line[mnykey]));
				}
			} else {
				ntotalnum = sum(ntotalnum, -getNumber(record[numkey]));
				// ntotalmny = sum(ntotalmny, -getNumber(record[mnykey]));
			}
		}
		this.setState({
			ntotalnum: ntotalnum
			// ntotalmny: ntotalmny
		});
	};

	// 视图切换
	changeViewClick = () => {
		//点击切换视图钩子函数
		if (this.state.fullTableId == AREA.viewScAll && !this.props.meta.getMeta()[AREA.viewScAll]) {
			initScAllTemplate.call(this, this.props);
		}
		if (this.state.fullTableId == AREA.view61 && !this.props.meta.getMeta()[AREA.view61]) {
			init61Template.call(this, this.props);
		}
		if (this.state.fullTableId == AREA.view47 && !this.props.meta.getMeta()[AREA.view47]) {
			init47Template.call(this);
		}
		this.props.transferTable.changeViewType(this.state.fullTableId);
		this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
	};

	handleClick() {}

	// react：界面渲染函数
	render() {
		const { transferTable, search } = this.props;
		const { NCCreateSearch } = search;
		const { createMultiTransferTable } = transferTable;
		// let totalstr = `${getLangByResId(this, '4004PUINVOICE-000060')}：${this.state.ntotalnum}`; /* 国际化处理： 本次收票数量*/
		let totalTitle = getLangByResId(this, '4004PUINVOICE-000060'); /* 国际化处理： 本次收票数量*/
		let selectedShow = transferTable.getSelectedListDisplay('all');

		let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
		let appid = busiInfoData.appid;
		this.transType = busiInfoData.transType;
		return (
			<div id="MultiTransfer" style={{ backgroundColor: '#fff' }}>
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
								expand={this.state.toggleViewStatus}
								style={{ float: 'right' }}
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
								switch (key) {
									case '1': //委外订单
										this.setState({
											fullTableId: AREA.view61
										});
										this.curheadTableId = AREA.head61; //记录主表id，供下游转单使用
										if (!this.props.meta.getMeta()[AREA.head61]) {
											init61Template.call(this, this.props);
										}
										break;
									case '2': //委外加工入库单
										this.setState({
											fullTableId: AREA.view47
										});
										this.curheadTableId = AREA.head47; //记录主表id，供下游转单使用
										if (!this.props.meta.getMeta()[AREA.head47]) {
											init47Template.call(this, this.props);
										}
										break;
									default:
										this.setState({
											fullTableId: AREA.viewScAll
										});
										this.curheadTableId = AREA.headAll;
										break;
								}
							},

							totalKey: [ [ 'ncaninvoicenum', 'ninvoicenum' ] ],
							totalTitle: totalTitle,
							dataSource: refDataSource,
							showAll: true, //是否显示全部页签，不显示全部页签时不需要设置 默认为false
							//==========以下参数必须设置showAll为true时才生效==========
							allHeadId: AREA.headAll, //全部页签的主表id
							allBodyId: AREA.bodyAll, //全部页签的子表id
							// allFullTableId: this.state.fullTableId, //主子拉平模板区域
							allFullTableId: AREA.viewScAll, //主子拉平模板区域
							headPkIds: [ PK.head61pk, PK.head47pk ],
							bodyPkIds: [ PK.body61pk, PK.body47pk ],
							transferBtnText: getLangByResId(this, '4004PUINVOICE-000058'), //转单按钮显示文字/* 国际化处理： 生成发票*/
							containerSelector: '#MultiTransfer', //容器的选择器 必须唯一,用于设置底部已选区域宽度
							selectedHeaderRender: () => {
								return '';
							},

							onTransferBtnClick: () => {
								//点击转单按钮钩子函数
								let _this = this;
								if (_this.isRefAddLine == true) {
									// _this.refAddLineComfirm_Btn_Click('transfer', this.combineflag, this.isRefAddLine);
								} else {
									if (appid) {
										_this.props.pushTo(URL.card, {
											type: TRANSFER_TYPE.transferSc,
											status: UISTATE.edit,
											appid: appid,
											appcode: APPCODE.puinvoice,
											pagecode: PAGECODE.invoiceCard
										});
									} else {
										_this.props.pushTo(URL.card, {
											type: TRANSFER_TYPE.transferSc,
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
								// this.calTotal(false, record, bodys, 'ncaninvoicenum');
							}
						},
						[
							{
								tabName: getLangByResId(this, '4004PUINVOICE-000055'), //tab页签显示文字/* 国际化处理： 全部*/
								headTableId: AREA.headAll, //表头区域
								bodyTableId: AREA.bodyAll, //表体区域
								fullTableId: AREA.viewScAll, //主子拉平区域
								searchArea: () => {
									//查询区域render
									return NCCreateSearch(AREA.searchAll, {
										clickSearchBtn: searchAllBtnClick.bind(this, null, null),
										onAfterEvent: searchAfterEvent.bind(this, AREA.searchScAll),
										renderCompleteEvent: renderCompleteEvent.bind(
											this,
											AREA.searchAll,
											MAIN_ORG_FIELD.searchScAllOrg
										),
										fieldid: AREA.searchAll,
										statusChangeEvent: renderCompleteEvent.bind(
											this,
											AREA.searchAll,
											MAIN_ORG_FIELD.searchScAllOrg
										)
										// context: this.state.context_q
									});
								},

								onCheckedChange: (flag, record, index, bodys) => {
									// 计算下方合计
									// this.calTotal(flag, record, bodys, 'ncaninvoicenum');
								}
							},
							{
								tabName: getLangByResId(this, '4004PUINVOICE-000036'), //tab页签显示文字/* 国际化处理： 委外订单*/
								headTableId: AREA.head61, //表头区域
								bodyTableId: AREA.body61, //表体区域
								fullTableId: AREA.view61, //主子拉平区域
								searchArea: () => {
									//查询区域render
									return NCCreateSearch(AREA.search61, {
										clickSearchBtn: search61BtnClick.bind(this, this.isRefAddLine, this.billvo),
										onAfterEvent: searchAfterEvent.bind(this, AREA.search61),
										renderCompleteEvent: renderCompleteEvent.bind(
											this,
											AREA.search61,
											MAIN_ORG_FIELD.search61Org
										),
										statusChangeEvent: renderCompleteEvent.bind(
											this,
											AREA.search61,
											MAIN_ORG_FIELD.search61Org
										),
										fieldid: AREA.search61
										// context: this.context_q
									});
								},

								onCheckedChange: (flag, record, index, bodys) => {
									// 计算下方合计
									// this.calTotal(flag, record, bodys, 'ncaninvoicenum');
								}
							},
							{
								tabName: getLangByResId(this, '4004PUINVOICE-000037'), //tab页签显示文字/* 国际化处理： 委外加工入库单*/
								headTableId: AREA.head47, //表头区域
								bodyTableId: AREA.body47, //表体区域
								fullTableId: AREA.view47, //主子拉平区域
								searchArea: () => {
									//查询区域render
									return NCCreateSearch(AREA.search47, {
										clickSearchBtn: search47BtnClick.bind(this, this.isRefAddLine, this.billvo),
										onAfterEvent: searchAfterEvent.bind(this, AREA.search47),
										renderCompleteEvent: renderCompleteEvent.bind(
											this,
											AREA.search47,
											MAIN_ORG_FIELD.search47Org
										),
										statusChangeEvent: renderCompleteEvent.bind(
											this,
											AREA.search47,
											MAIN_ORG_FIELD.search47Org
										),
										fieldid: AREA.search47
										// context: this.context_q
									});
								},
								onCheckedChange: (flag, record, index, bodys) => {
									// 计算下方合计
									// this.calTotal(flag, record, bodys, 'ninvoicenum');
								}
							}
						]
					)}
				</div>
			</div>
		);
	}
}
MultiTransferTable = createPage({})(MultiTransferTable);
// ReactDOM.render(<MultiTransferTable />, document.querySelector('#app'));
export default MultiTransferTable;
