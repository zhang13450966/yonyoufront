/*
 * @Author: CongKe 
 * @PageInfo: 采购合同生成订单
 * @Date: 2018-06-13 14:14:03 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-04-21 14:07:49
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, buttonClick } from './btnClick';
import { TRANSFERZ2, URL, OrderCache, PAGECODE } from '../constance';
const { NCToggleViewBtn, NCBackBtn, NCSetColBtn, NCDiv } = base;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';

class Transferz2Table extends Component {
	constructor(props) {
		super(props);
		props.use.search(TRANSFERZ2.SEARCHID);
		this.headTableId = TRANSFERZ2.LIST_TABLE;
		this.state = {
			templetid: null, //模板ID
			toggleViewStatus: false
		};
		// initTemplate.call(this);
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		this.props.transferTable.setTransferTableValue(
			TRANSFERZ2.LIST_TABLE,
			TRANSFERZ2.LIST_TABLE_CHILD,
			[],
			'pk_ct_pu',
			'pk_ct_pu_b'
		);
	}

	onAfterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TRANSFERZ2.SEARCHID, [
				'cvendorid',
				'personnelid',
				'depid',
				'billmaker',
				'approver',
				'pk_ct_pu_b.cbprojectid',
				'pk_ct_pu_b.casscustid',
				'pk_ct_pu_b.pk_srcmaterial',
				'pk_ct_pu_b.pk_srcmaterial.code',
				'pk_ct_pu_b.pk_srcmaterial.name',
				'pk_ct_pu_b.pk_srcmaterial.pk_marbasclass'
			]);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TRANSFERZ2.SEARCHID, 'pk_org');
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, 'pk_org', arr);
		}
	};

	handleClick() {}

	getorg = () => {
		let org = getDefData.call(this, OrderCache.OrderCacheKey, 'z2org');
		if (org == null || org.org == null) {
			return null;
		} else {
			return org.org;
		}
	};

	render() {
		const { transferTable, button, search, BillHeadInfo } = this.props;
		const { NCCreateSearch } = search;
		const { createButton } = button;
		const { createTransferTable } = transferTable;
		const { createBillHeadInfo } = BillHeadInfo;
		let selectedShow = transferTable.getSelectedListDisplay(TRANSFERZ2.LIST_TABLE);
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
									title: getLangByResId(this, '4004POORDER-000094'),
									initShowBackBtn: false
								})}
								{/* 国际化处理： 选择采购合同*/}
							</div>
							{/* 按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TRANSFERZ2.PAGEID,
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
									if (!this.props.meta.getMeta()[TRANSFERZ2.VIEW]) {
										initTemplate.call(this); //加载主子拉平模板
									}
									this.props.transferTable.changeViewType(this.headTableId);
									this.setState({ toggleViewStatus: !this.state.toggleViewStatus });
								}}
							/>
						</NCDiv>
						<div className="nc-bill-search-area">
							{NCCreateSearch(TRANSFERZ2.SEARCHID, {
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
						headTableId: TRANSFERZ2.LIST_TABLE, //表格组件id
						bodyTableId: TRANSFERZ2.LIST_TABLE_CHILD, //子表模板id
						fullTableId: TRANSFERZ2.VIEW, //视图VO，设置表格数据
						searchAreaCode: TRANSFERZ2.SEARCHID, // 用于缓存查询条件
						transferBtnText: getLangByResId(this, '4004POORDER-000086'), //转单按钮显示文字/* 国际化处理： 生成采购订单*/
						containerSelector: '#transferList',
						dataSource: OrderCache.OrderTransferCache,
						onTransferBtnClick: (ids) => {
							this.props.pushTo(URL.gotoCard, {
								// appcode: '400400800',
								transfer: TRANSFERZ2.CSOURCETYPECODE,
								org: this.getorg(),
								pagecode: PAGECODE.cardcode
							});
						},
						onChangeViewClick: () => {
							//点击切换视图钩子函数
							if (!this.props.meta.getMeta()[TRANSFERZ2.VIEW]) {
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
Transferz2Table = createPage({})(Transferz2Table);
// ReactDOM.render(<Transferz2Table />, document.querySelector('#app'));
export default Transferz2Table;
