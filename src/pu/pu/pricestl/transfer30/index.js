import React, { Component } from 'react';
import { initTemplate } from './init';
import { base, createPage, createPageIcon } from 'nc-lightapp-front';
import { searchBtnClick, buttonClick, transferBtnClick } from './btnClick';
const { NCToggleViewBtn, NCBackBtn, NCAffix, NCDiv } = base;
import { TRANSFER30, URL, OrderCache, PAGECODE, TRANSFER30QUERYFIELDS } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class Transfer30Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(TRANSFER30.SEARCHID);
		this.state = {
			templetid: null, //模板ID
			toggleViewStatus: false
		};
		initLang(this, [ '4004pricestl' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			TRANSFER30.LIST_TABLE,
			TRANSFER30.LIST_TABLE_CHILD,
			[],
			TRANSFER30.Cgeneralhid,
			TRANSFER30.Cgeneralbid
		);
	}
	onAfterEvent(props, field, val) {
		//处理组织切换框是否显示
		if (field == TRANSFER30QUERYFIELDS.cpurorgoid) {
			multiCorpRefHandler(props, val, TRANSFER30.SEARCHID, [
				TRANSFER30QUERYFIELDS.cbizid,
				TRANSFER30QUERYFIELDS.cdptid,
				TRANSFER30QUERYFIELDS.cmaterialoid,
				TRANSFER30QUERYFIELDS.cvendorid
			]);
		} else if (field == TRANSFER30QUERYFIELDS.pk_org) {
			multiCorpRefHandler(props, val, TRANSFER30.SEARCHID, [
				TRANSFER30QUERYFIELDS.cwarehouseid,
				TRANSFER30QUERYFIELDS.cwhsmanagerid
			]);
		}
	}
	getorg = () => {
		let org = getDefData.call(this, OrderCache.OrderCacheKey, TRANSFER30.org);
		if (org == null || org.org == null) {
			return null;
		} else {
			return org.org;
		}
	};
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30.Cgeneralbid_pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, TRANSFER30.Cgeneralbid_pk_org, arr);
		}

		let cpurorgoid = this.props.search.getSearchValByField(TRANSFER30.SEARCHID, TRANSFER30QUERYFIELDS.cpurorgoid);
		if (cpurorgoid && cpurorgoid.value && cpurorgoid.value.firstvalue) {
			let value = cpurorgoid.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, TRANSFER30QUERYFIELDS.cpurorgoid, arr);
		}
	};
	render() {
		const { transferTable, search, BillHeadInfo } = this.props;
		const { NCCreateSearch } = search;
		const { createTransferTable } = transferTable;
		const { createBillHeadInfo } = BillHeadInfo;
		//获取已选列表显示状态,false:不进行遮罩。true:进行遮罩
		let selectedShow = transferTable.getSelectedListDisplay(TRANSFER30.LIST_TABLE);
		return (
			<div id="transferList" className="nc-bill-list">
				{!selectedShow ? (
					<div>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{/* 定义返回按钮组件 */}
							<NCBackBtn
								onClick={() => {
									this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
								}}
							/>
							{/*设置标题*/}
							<div className="header-title-search-area">
								{createPageIcon()}
								<h2 className="title-search-detail">{getLangByResId(this, '4004PRICESTL-000035')}</h2>
								{/* {createBillHeadInfo({
										title: getLangByResId(this, '4004PRICESTL-000035'),
										initShowBackBtn: false
									})} */}
								{/* 国际化处理： 选择采购入库单*/}
							</div>
							{/*创建按钮*/}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TRANSFER30.PAGEID, //
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
							{/*切换视图按钮*/}
							<NCToggleViewBtn
								expand={this.state.toggleViewStatus}
								onClick={() => {
									if (!this.props.meta.getMeta()[TRANSFER30.VIEW]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType(TRANSFER30.LIST_TABLE); //切换视图
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(TRANSFER30.SEARCHID, {
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
						//创建单来源转单
						searchAreaCode: TRANSFER30.SEARCHID, // 用于缓存查询条件
						headTableId: TRANSFER30.LIST_TABLE, //表格组件id/表格组件id
						bodyTableId: TRANSFER30.LIST_TABLE_CHILD, //子表模板id
						fullTableId: TRANSFER30.VIEW, //视图VO，设置表格数据
						transferBtnText: getLangByResId(this, '4004PRICESTL-000018') /* 国际化处理： 生成价格结算单*/,
						containerSelector: TRANSFER30.transferList,
						dataSource: OrderCache.OrderTransferCache,
						onTransferBtnClick: (ids) => {
							transferBtnClick.call(this);
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFER30.VIEW]) {
								initTemplate.call(this); //加载主子拉平模板
							}
							this.props.transferTable.changeViewType(TRANSFER30.LIST_TABLE);
							this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
						}
					})}
				</div>
			</div>
		);
	}
}
Transfer30Table = createPage({})(Transfer30Table);
export default Transfer30Table;
