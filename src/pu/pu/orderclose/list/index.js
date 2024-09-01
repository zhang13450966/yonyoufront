/*
 * @Author: CongKe
 * @PageInfo: 采购订单列表态页面
 * @Date: 2018-04-19 10:21:07
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-22 21:35:25
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, high, createPageIcon, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import searchBtnClick from './btnClicks/searchBtnClick';
import { URL, PAGECODE, FIELD, BUTTON, STATUS } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController } from './viewController/index';
const { BillTrack } = high;
const { NCDiv } = base;
class OrderCloseList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.editTable(PAGECODE.tableId);
		this.state = {
			searchVal: null, //查询条件缓存
			pk_order: '', //pk
			showTrack: false //单据追溯
		};
		initLang(this, [ '4004orderclose' ], 'pu', initTemplate.bind(this, this.props));
	}
	//页面数据初始化 采购订单关闭默认不查询
	componentDidMount() {}

	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [
				'pk_supplier',
				'cemployeeid',
				'pk_dept',
				'billmaker',
				'pk_order_b.pk_srcmaterial',
				'pk_order_b.pk_srcmaterial.code',
				'pk_order_b.pk_srcmaterial.name',
				'pk_order_b.pk_srcmaterial.pk_marbasclass'
			]);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, FIELD.pk_org, arr);
		}
	};

	render() {
		const { editTable, button, search } = this.props;
		const { createEditTable } = editTable; //引入表格
		const { createButton } = button; //引入按钮
		const { NCCreateSearch } = search; //引入创建查询方法
		return (
			<div className="nc-bill-list">
				{this.props.socket.connectMesg({
					tableAreaCode: PAGECODE.tableId,
					tableType: 'editTable', // 增加表格类型 editTable / insertTable
					billtype: '21', // 由于EditTable 节点可能不涉及追溯或者流程，可不传
					billpkname: 'pk_order'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 采购订单关闭*/}
					</div>
					{/* 按钮区 */}
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: PAGECODE.tableId,
							onButtonClick: buttonClickController.bind(this)
						})}
					</div>
					{/* 单据追溯 */}
					<BillTrack
						show={this.state.showTrack}
						close={() => {
							this.setState({ showTrack: false });
						}}
						pk={this.state.pk_order}
						type="21"
					/>
				</NCDiv>
				{/* 查询展示区域 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(PAGECODE.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				{/* 列表区域 */}
				<div className="nc-bill-table-area">
					{createEditTable(PAGECODE.tableId, {
						showIndex: true,
						showCheck: true,
						onSelected: buttonController.selectedChange.bind(this),
						onSelectedAll: buttonController.selectedChange.bind(this),
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}

OrderCloseList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listcode,
		bodycode: PAGECODE.tableId
	}
	// initTemplate: initTemplate
})(OrderCloseList);

ReactDOM.render(<OrderCloseList />, document.querySelector('#app'));
