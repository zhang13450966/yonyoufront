/*
 * @Author: CongKe
 * @PageInfo: 采购订单付款计划列表态页面
 * @Date: 2018-04-19 10:21:07
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-01 16:35:03
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, high, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick } from './btnClicks';
import { afterEvent } from './afterEvents';
import { beforEdit } from './beforeEdit';
import { PAGECODE, FIELD, STATUS } from '../constance';
const { BillTrack } = high;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController } from './viewController/index';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import ViewModal from '../viewModal/viewModal';
const { NCDiv } = base;
class OrderPayPlanList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.editTable(PAGECODE.tableId);
		this.state = {
			searchVal: null, //查询条件缓存
			showTrack: false, //单据追溯
			status: STATUS.browse, //是否是编辑态
			currentLocale: 'en-US',
			showModal: false, //默认不显示弹框
			pk_order: null //初始化主键信息
		};
		this.frozen = {};
		// initTemplate.call(this, this.props);
		initLang(this, [ '4004payplan' ], 'pu', initTemplate.bind(this, this.props));
	}
	//页面数据初始化 采购订单关闭默认不查询
	componentDidMount() {
		buttonController.initButton.call(this, true);
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PAGECODE.tableId);
			if (status == STATUS.edit) {
				return getLangByResId(this, '4004OPAYPLAN-000014'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [
				'pk_supplier',
				'cemployeeid',
				'pk_dept',
				'billmaker'
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

	changeShowModal = () => {
		this.setState({ showModal: !this.state.showModal });
	};

	render() {
		const { editTable, search } = this.props;
		const { createEditTable } = editTable; //引入表格
		const { NCCreateSearch } = search; //引入创建查询方法
		const { socket } = this.props;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: PAGECODE.tableId,
					billpkname: FIELD.hid,
					billtype: PAGECODE.billType
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 采购订单付款计划*/}
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
					{/* 增加样式  add by huoyzh*/}
					<div style={{ display: this.state.status === 'browse' ? 'block' : 'none' }}>
						{NCCreateSearch(PAGECODE.searchId, {
							clickSearchBtn: searchBtnClick.bind(this),
							onAfterEvent: this.onAfterEvent.bind(this, this.props),
							renderCompleteEvent: this.renderCompleteEvent,
							statusChangeEvent: this.renderCompleteEvent
						})}
					</div>
				</div>
				{/* 列表区域 */}
				<div className="nc-bill-table-area">
					{createEditTable(PAGECODE.tableId, {
						showIndex: true,
						showCheck: true,
						onBeforeEvent: beforEdit.bind(this),
						onAfterEvent: afterEvent.bind(this),
						onSelected: buttonController.onSelectButton.bind(this),
						onSelectedAll: buttonController.onSelectButton.bind(this),
						adaptionHeight: true
					})}
				</div>
				<ViewModal changeShowModal={this.changeShowModal} {...this.props} pk_order={this.state.pk_order} />
			</div>
		);
	}
}

OrderPayPlanList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listcode,
		bodycode: PAGECODE.tableId
	}
})(OrderPayPlanList);

ReactDOM.render(<OrderPayPlanList />, document.querySelector('#app'));
