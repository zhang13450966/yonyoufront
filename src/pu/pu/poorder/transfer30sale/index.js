/*
 * @Author: CongKe
 * @PageInfo: 直运销售订单生成采购订单
 * @Date: 2018-06-13 14:14:03
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 23:08:57
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax, createPageIcon } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, buttonClick } from './btnClick';
import { TRANSFER30TO21, URL, OrderCache, PAGECODE } from '../constance';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import Transfer20Table from '../transfer20';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class Transfer30SaleTable extends Component {
	constructor(props) {
		super(props);
		props.use.search(TRANSFER30TO21.SEARCHID);
		this.state = {
			templetid: null, //模板ID
			toggleViewStatus: false
		};
		this.srcappcode = null;
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			TRANSFER30TO21.LIST_TABLE,
			TRANSFER30TO21.LIST_TABLE_CHILD,
			[],
			'csaleorderid',
			'csaleorderbid'
		);
	}

	getorg = () => {
		let org = getDefData.call(this, OrderCache.OrderCacheKey, 'sale');
		if (org == null || org.org == null) {
			return null;
		} else {
			return org.org;
		}
	};

	onAfterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TRANSFER30TO21.SEARCHID, [
				'ccustomerid',
				'cemployeeid',
				'billmaker',
				'approver',
				'so_saleorder_b.cmaterialid',
				'so_saleorder_b.cmaterialid.code',
				'so_saleorder_b.cmaterialid.name',
				'so_saleorder_b.cmaterialid.pk_marbasclass',
				'so_saleorder_b.creceivecustid'
			]);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TRANSFER30TO21.SEARCHID, 'pk_org');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, 'pk_org', arr);
		}
	};

	render() {
		const { transferTable, button, search } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { createTransferTable } = transferTable;
		let scene = this.props.getUrlParam('scene');
		let selectedShow = transferTable.getSelectedListDisplay(TRANSFER30TO21.LIST_TABLE);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
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
								<h2 className="title-search-detail">{getLangByResId(this, '4004POORDER-000093')}</h2>
								{/* 国际化处理： 选择直运销售订单*/}
							</div>
							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TRANSFER30TO21.PAGEID,
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
									if (!this.props.meta.getMeta()[TRANSFER30TO21.VIEW]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType();
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(TRANSFER30TO21.SEARCHID, {
								clickSearchBtn: searchBtnClick.bind(this),
								onAfterEvent: this.onAfterEvent.bind(this, this.props),
								dataSource: OrderCache.OrderTransferCache,
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
						headTableId: TRANSFER30TO21.LIST_TABLE, //表格组件id
						bodyTableId: TRANSFER30TO21.LIST_TABLE_CHILD, //子表模板id
						fullTableId: TRANSFER30TO21.VIEW, //点击加号展开，设置表格数据
						searchAreaCode: TRANSFER30TO21.SEARCHID, // 用于缓存查询条件
						transferBtnText: getLangByResId(this, '4004POORDER-000086'), //转单按钮显示文字/* 国际化处理： 生成采购订单*/
						containerSelector: '#transferList',
						dataSource: OrderCache.OrderTransferCache,
						onTransferBtnClick: (ids) => {
							if (scene == 'Y') {
								this.props.pushTo(URL.gotoCard, {
									appcode: '400400800',
									srcappcode: this.srcappcode,
									scene: scene,
									transfer: TRANSFER30TO21.CSOURCETYPECODE,
									org: this.getorg(),
									pagecode: PAGECODE.cardcode
								});
							} else {
								this.props.pushTo(URL.gotoCard, {
									scene: scene,
									transfer: TRANSFER30TO21.CSOURCETYPECODE,
									org: this.getorg(),
									pagecode: PAGECODE.cardcode
								});
							}
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFER30TO21.VIEW]) {
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
Transfer30SaleTable = createPage({})(Transfer30SaleTable);
// ReactDOM.render(<Transfer30SaleTable />, document.querySelector('#app'));

export default Transfer30SaleTable;
