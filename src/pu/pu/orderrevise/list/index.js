/*
 * @Author: CongKe
 * @PageInfo: 采购订单列表态页面
 * @Date: 2018-04-19 10:21:07
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:45:04
 */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
const { NCDiv } = base;
import { initTemplate } from './init';
import { pageInfoClick } from './btnClicks';
import searchBtnClick from './btnClicks/searchBtnClick';
import { URL, PAGECODE, FIELD, STATUS, OrderReviseCache } from '../constance';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import NCUploader from 'uap/common/components/NCUploader';
import ApproveDetail from 'uap/common/components/ApproveDetail';

const { BillTrack } = high;
import { initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController } from './viewController/index';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import Businessinfo from 'to/to/businessinfo/list';
class OrderReviseList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.table(PAGECODE.list_head);
		this.state = {
			searchVal: null, //查询条件缓存
			billId: '', //单据id
			billtype: '', //单据交易类型
			pk_order: '', //pk
			vbillcode: '',
			showTrack: false, //单据追溯
			target: null, //弹出上传控件位置
			show: false, //审批详情展示控制

			showUploader: false, //附件
			showBusinessModal: false // 内部交易信息用
		};
		// initTemplate.call(this);
		initLang(this, [ '4004orderrevise' ], 'pu', initTemplate.bind(this, this.props));
	}

	//页面数据初始化
	componentDidMount() {}

	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [
				'pk_supplier',
				'cemployeeid',
				'pk_dept',
				'pk_invcsupllier',
				'approver',
				'billmaker',
				'pk_order_b.pk_srcmaterial',
				'pk_order_b.pk_srcmaterial.code',
				'pk_order_b.pk_srcmaterial.name',
				'pk_order_b.vvendinventorycode',
				'pk_order_b.vvendinventoryname',
				'pk_order_b.pk_srcmaterial'
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
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	//双击事件
	doubleClick = (record, index) => {
		let pk_order = record.pk_order.value;
		this.props.pushTo(URL.gotoCard, { status: STATUS.browse, id: pk_order, pagecode: PAGECODE.cardcode });
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({ showUploader: false });
	};
	render() {
		const { table, button, search, modal } = this.props;
		const { createSimpleTable } = table; //引入表格
		const { createModal } = modal;
		const { NCCreateSearch } = search; //引入创建查询方法
		const { socket } = this.props;
		let rows = this.props.table.getCheckedRows(PAGECODE.list_head);
		let newpk = '';
		if (rows && rows[0] && rows[0].data) {
			newpk = rows[0].data.values.pk_order.value; // 主键
		}
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: PAGECODE.list_head,
					billpkname: FIELD.pk_order,
					billtype: '21'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 采购订单修订*/}
					</div>
					{/* 按钮区 */}
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: PAGECODE.list_head,
							onButtonClick: buttonClickController.bind(this)
						})}
					</div>
				</NCDiv>
				{/* 查询展示区域 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(PAGECODE.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent,
						dataSource: OrderReviseCache.OrderReviseCacheKey,
						pkname: FIELD.pk_order
					})}
				</div>
				<div className="nc-bill-table-area">
					{/* 列表区域 */}
					{createSimpleTable(PAGECODE.list_head, {
						//显示序号
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						dataSource: OrderReviseCache.OrderReviseCacheKey,
						onSelected: buttonController.onSelectedButtons.bind(this),
						onSelectedAll: buttonController.onSelectedButtons.bind(this),
						pkname: FIELD.pk_order,
						componentInitFinished: buttonController.onSelectedButtons.bind(this)
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
				{/* 展示审批详情 */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.billtype}
						billid={this.state.billId}
					/>
				</div>
				{/* 附件管理 */}
				{this.state.showUploader && (
					<NCUploader
						billId={this.state.pk_order}
						onHide={this.onHideUploader}
						billNo={this.state.vbillcode}
						billcode={newpk}
						pk_billtypecode={'21'}
					/>
				)}
				{/* 内部交易信息 */}
				<div id="dialog">
					<Businessinfo
						pk={this.state.pk_order}
						billType="104"
						showModal={this.state.showBusinessModal}
						onClose={() => {
							this.setState({ showBusinessModal: false });
						}}
					/>
				</div>
				{createModal('MessageDlg', { size: 'xlg' })}
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}

OrderReviseList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listcode,
		bodycode: PAGECODE.list_head
	}
})(OrderReviseList);

// ReactDOM.render(<OrderReviseList />, document.querySelector('#app'));

export default OrderReviseList;
