/*
 * @Author: CongKe
 * @PageInfo: 请购生成采购订单
 * @Date: 2018-06-13 14:14:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-12 14:12:10
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, buttonClick, scanBtnClick } from './btnClick';
import { TRANSFER20, URL, OrderCache, PAGECODE } from '../constance';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
//import ScanCode from '../../../../uap/msgcenter/message/scanCodeView';
import ScanCodeView from 'uap/common/components/scanCodeView';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';
class Transfer20Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(TRANSFER20.SEARCHID);
		this.refAddLineComfirmBtnClick = props.refAddLineComfirmBtnClick;
		this.isRefAddLine = props.isRefAddLine;
		this.refsourcdata = props.refsourcdata; //参照增行要过滤当前页面的数据
		this.state = {
			templetid: null, //模板ID
			ntotalnum: 0,
			toggleViewStatus: false
		};
		// initTemplate.call(this);
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		// 小部件进入的时候需要默认加载数据
		this.props.transferTable.setTransferTableValue(
			TRANSFER20.LIST_TABLE,
			TRANSFER20.LIST_TABLE_CHILD,
			[],
			'pk_praybill',
			'pk_praybill_b'
		);
	}

	onAfterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TRANSFER20.SEARCHID, [
				'pk_planpsn',
				'pk_plandept',
				'billmaker',
				'approver',
				'pk_praybill_b.pk_srcmaterial',
				'pk_praybill_b.pk_srcmaterial.code',
				'pk_praybill_b.pk_srcmaterial.name',
				'pk_praybill_b.pk_srcmaterial.pk_marbasclass',
				'pk_praybill_b.pk_suggestsupplier',
				'pk_praybill_b.cprojectid',
				'pk_praybill_b.pk_reqstor',
				'pk_praybill_b.cproductorid',
				'pk_praybill_b.casscustid'
			]);
		} else if (field == 'pk_praybill_b.pk_purchaseorg') {
			multiCorpRefHandler(props, val, TRANSFER20.SEARCHID, [ 'pk_praybill_b.pk_employee' ]);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TRANSFER20.SEARCHID, 'pk_praybill_b.pk_purchaseorg');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, 'pk_praybill_b.pk_purchaseorg', arr);
		}
	};
	scanTransfer() {
		this.props.modal.show('general', {
			title: getLangByResId(this, '4004POORDER-000132') /* 国际化处理： 扫码结果*/,
			size: 'lg',
			noFooter: true,
			content: <ScanCodeView props={this.props} scanCodeSearchMessage={this.scanCodeSearchMessage.bind(this)} />
		});
	}
	scanCodeSearchMessage = (value) => {
		if (value == null || value == '') {
			return;
		}
		//检查
		scanBtnClick.call(this, value);
	};
	calTotal = (flag, record, bodys) => {
		let ntotalnum = parseInt(this.state.ntotalnum);
		ntotalnum = ntotalnum == NaN ? 0 : ntotalnum;
		if (flag == true) {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum += parseInt(line && line.nnum && line.nnum.value);
				}
			} else {
				ntotalnum += parseInt(record && record.nnum && record.nnum.value);
			}
		} else {
			if (bodys && bodys.length > 0) {
				for (let line of bodys) {
					ntotalnum -= parseInt(line && line.nnum && line.nnum.value);
				}
			} else {
				ntotalnum -= parseInt(record && record.nnum && record.nnum.value);
			}
		}
		this.setState({
			ntotalnum: parseInt(ntotalnum)
		});
	};

	handleClick() {}

	render() {
		const { transferTable, button, search, modal, BillHeadInfo } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { createModal } = modal;
		const { createTransferTable } = transferTable;
		const { createBillHeadInfo } = BillHeadInfo;
		let totaltitle = `${getLangByResId(this, '4004POORDER-000087')}`; /* 国际化处理： 本次订货主数量*/
		let selectedShow = transferTable.getSelectedListDisplay(TRANSFER20.LIST_TABLE);
		let scene = this.props.getUrlParam('scene'); //小部件或消息中心或是
		let dataSources = OrderCache.OrderTransferCache;
		if (this.isRefAddLine == true) {
			dataSources = OrderCache.OrderRefAdd20;
		}
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{scene || this.isRefAddLine == true ? (
								''
							) : (
								<NCBackBtn
									onClick={() => {
										this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
									}}
								/>
							)}
							<div className="header-title-search-area">
							{createBillHeadInfo({
									title: getLangByResId(this, '4004POORDER-000088'),
									initShowBackBtn: false
								})}
					
								{/* 国际化处理： 选择请购单*/}
							</div>
							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TRANSFER20.PAGEID, //
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
							{/* <NCSetColBtn
								onClick={() => {
									this.handleClick;
								}}
							/> */}
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[TRANSFER20.VIEW]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(TRANSFER20.SEARCHID, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: this.onAfterEvent.bind(this, this.props),
								renderCompleteEvent: this.renderCompleteEvent,
								statusChangeEvent: this.renderCompleteEvent
							})}
						</div>
					</div>
				) : (
					''
				)}
				<div className="nc-bill-transferTable-area">
					{createTransferTable({
						headTableId: TRANSFER20.LIST_TABLE, //表格组件id
						bodyTableId: TRANSFER20.LIST_TABLE_CHILD, //子表模板id
						fullTableId: TRANSFER20.VIEW, //视图VO，设置表格数据
						searchAreaCode: TRANSFER20.SEARCHID, // 用于缓存查询条件
						transferBtnText: getLangByResId(this, '4004POORDER-000086'), //转单按钮显示文字/* 国际化处理： 生成采购订单*/
						containerSelector: '#transferList',
						dataSource: dataSources,
						totalKey: [ 'nnum' ],
						totalTitle: [ totaltitle ],
						selectedHeaderRender: () => {
							this.props.button.createButtonApp({
								area: TRANSFER20.PAGEID,
								onButtonClick: buttonClick.bind(this)
							});
						},
						customAreaOfSelectedHead: () => {
							//单转单已选列表右上角自定义区域
							return (
								<div style={{ position: 'relative' }}>
									{this.props.button.createButtonApp({
										area: TRANSFER20.PAGEID + 's',
										onButtonClick: buttonClick.bind(this)
									})}
								</div>
							);
						},
						onTransferBtnClick: (ids) => {
							let nrows = this.props.transferTable.getTransferTableSelectedValue();
							let rows = [];
							let json = [];
							let pk_praybill_bbs = new Array();
							let array = new Array();
							if (nrows) {
								//勾选的所有主子数据
								rows = JSON.parse(JSON.stringify(nrows.po_praybill));
								for (let i = 0; i < rows.length; i++) {
									//一个主子单位
									let checkdata = {};
									let headRows = rows[i].head.po_praybill,
										bodyRows = rows[i].body.pk_praybill_b;
									let head = {};
									headRows.rows.forEach((item) => {
										let ts = item.values.ts.value;
										let pk_praybill = item.values.pk_praybill.value;
										head = {
											ts: ts,
											pk: pk_praybill
										};
									});
									checkdata['head'] = head;
									let bodys = new Array();
									bodyRows.rows.forEach((item, index) => {
										let bts = item.values.ts.value;
										let pk_praybill_b = item.values.pk_praybill_b.value;
										let nnum = item.values.nnum.value;
										let nastnum = item.values.nastnum.value;
										let pk_suggestsupplier = item.values.pk_suggestsupplier.value;
										let body = {
											ts: bts,
											pk: pk_praybill_b,
											userObject: {
												nnum: nnum,
												nastnum: nastnum,
												pk_suggestsupplier: pk_suggestsupplier
											}
										};
										bodys.push(body);
										// TODO 伪列映射
										pk_praybill_bbs.push(pk_praybill_b);
									});
									checkdata['bodys'] = bodys;
									array.push(checkdata);
								}
							}
							setDefData(OrderCache.OrderTransferCache, '20to21', array);
							setDefData(OrderCache.OrderTransferCache, '20to21bids', pk_praybill_bbs);
							let _this = this;
							if (_this.isRefAddLine == true) {
								_this.refAddLineComfirmBtnClick(array);
							} else {
								if (scene) {
									_this.props.pushTo(URL.gotoCard, {
										transfer: TRANSFER20.CSOURCETYPECODE,
										appcode: '400400800',
										pagecode: PAGECODE.cardcode,
										status: 'edit',
										scene: scene
									});
								} else {
									_this.props.pushTo(URL.gotoCard, {
										transfer: TRANSFER20.CSOURCETYPECODE,
										pagecode: PAGECODE.cardcode,
										status: 'edit',
										scene: scene
									});
								}
							}
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFER20.VIEW]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(this.headTableId);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
				{createModal('general')}
			</div>
		);
	}
}
Transfer20Table = createPage({})(Transfer20Table);
// ReactDOM.render(<Transfer20Table />, document.querySelector('#app'));
export default Transfer20Table;
