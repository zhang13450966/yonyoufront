/*
 * @Author: CongKe 
 * @PageInfo: 采购合同生成订单
 * @Date: 2018-06-13 14:14:03 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-12 13:55:03
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, buttonClick } from './btnClick';
import { TRANSFER49, URL, OrderCache, PAGECODE } from '../constance';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';

class Transfer49Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(TRANSFER49.SEARCHID);
		this.headTableId = TRANSFER49.LIST_TABLE;
		this.state = {
			templetid: null, //模板ID
			toggleViewStatus: false
		};
		// initTemplate.call(this);
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			TRANSFER49.LIST_TABLE,
			TRANSFER49.LIST_TABLE_CHILD,
			[],
			'cgeneralhid',
			'cgeneralbid'
		);
	}

	onAfterEvent(props, field, val) {
		if (field == 'cgeneralbid.cpurorgoid') {
			multiCorpRefHandler(props, val, TRANSFER49.SEARCHID, [
				'cbizid',
				'cdptid',
				'depid',
				'billmaker',
				'approver',
				'cgeneralbid.cmaterialoid',
				'cgeneralbid.cmaterialoid.code',
				'cgeneralbid.cmaterialoid.name',
				'cgeneralbid.cmaterialoid.pk_marbasclass',
				'cgeneralbid.cvendorid'
			]);
		} else if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TRANSFER49.SEARCHID, [ 'cwarehouseid' ]);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TRANSFER49.SEARCHID, 'cgeneralbid.cpurorgoid');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, 'cgeneralbid.cpurorgoid', arr);
		}
	};

	handleClick() {}

	render() {
		const { transferTable, button, search, BillHeadInfo } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { createTransferTable } = transferTable;
		const { createBillHeadInfo } = BillHeadInfo;
		let selectedShow = transferTable.getSelectedListDisplay(TRANSFER49.LIST_TABLE);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<NCBackBtn
								onClick={() => {
									this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
								}}
							/>
							<div className="header-title-search-area">
							{createBillHeadInfo({
									title: getLangByResId(this, '4004POORDER-000108'),
									initShowBackBtn: false
								})}

								{/* 国际化处理： 选择借入单*/}
							</div>
							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TRANSFER49.PAGEID,
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
									if (!this.props.meta.getMeta()[TRANSFER49.VIEW]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType(this.headTableId);
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(TRANSFER49.SEARCHID, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: this.onAfterEvent.bind(this, this.props),
								// dataSource: OrderCache.OrderTransferCache,
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
						headTableId: TRANSFER49.LIST_TABLE, //表格组件id
						bodyTableId: TRANSFER49.LIST_TABLE_CHILD, //子表模板id
						fullTableId: TRANSFER49.VIEW, //视图VO，设置表格数据
						searchAreaCode: TRANSFER49.SEARCHID, // 用于缓存查询条件
						transferBtnText: getLangByResId(this, '4004POORDER-000086'), //转单按钮显示文字/* 国际化处理： 生成采购订单*/
						containerSelector: '#transferList',
						dataSource: OrderCache.OrderTransferCache,
						onTransferBtnClick: (ids) => {
							this.props.pushTo(URL.gotoCard, {
								// appcode: '400400800',
								transfer: TRANSFER49.CSOURCETYPECODE,
								pagecode: PAGECODE.cardcode
							});
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFER49.VIEW]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(this.headTableId);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
			</div>
		);
	}
}
Transfer49Table = createPage({})(Transfer49Table);
export default Transfer49Table;
