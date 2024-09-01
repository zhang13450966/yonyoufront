/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片态页面
 * @Date: 2018-04-19 10:44:54
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-12-10 11:09:16
 */
import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
import { pageInfoClick } from './btnClicks';
import { afterEvents } from './afterEvents';
import initTemplate from './init/initTemplate';
import { PAGECODE, STATUS, URL, FIELD, OrderReviseCache } from '../constance';
import Inspection from 'epmp/exports/components/Inspection';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCAffix, NCDiv } = base;
import { beforeEvent } from './beforeEvents';
import StockQuerys from '../atpquery';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import SupplierApQuery from '../supplierapquery';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import { buttonClickController, buttonController } from './viewController/index';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil.js';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import Businessinfo from 'to/to/businessinfo/list';
import './index.less';
class OrderReviseCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(PAGECODE.cardhead);
		props.use.cardTable(PAGECODE.cardbody);
		this.copyRowDatas = null;
		this.tabKey = PAGECODE.cardbody;
		this.delindex = [];
		this.state = {
			status: this.getPageParam(STATUS.status),
			vbillcode: '', //订单编号
			billId: '', //单据id
			billtype: '', //单据交易类型
			pk_order: '', //主键
			showTrack: false, //单据追溯
			target: null, //弹出上传控件位置
			showUploader: false, //附件
			showStockQuery: false, //存量查询
			showSupplierApQuery: false, //供应商应付
			stockquerydata: null, //存量查询参数
			supplierapdata: null, //供应商应付参数
			showNtbDetail: false, //；联查采购计划
			show: false, //审批详情展示控制
			ntbdata: null, //联查采购计划数据
			showBusinessModal: false // 内部交易信息用
		};
		// initTemplate.call(this);
		initLang(this, [ '4004orderrevise' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		pageInfoClick.bind(this)();
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			// let status = this.props.cardTable.getStatus(PAGECODE.cardbody);
			let status = this.props.getUrlParam(STATUS.status);
			if (status == 'edit') {
				return getLangByResId(this, '4004ORDERREVISE-000011'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	//页签切换回调函数
	tabChange = (props, moduleId, key) => {
		this.tabKey = key;
		buttonController.tabChange(props, moduleId, key);
	};

	closeApprove = () => {
		this.setState({
			show: false
		});
	};

	//获取url的参数
	getPageParam = (key) => {
		return this.props.getUrlParam(key);
	};
	//表格列求和
	addTableCol = (key) => {
		let data = this.props.cardTable.getColValue(PAGECODE.cardbody, key);
		if (data) {
			data = data.value;
			if (data && data.length > 0) {
				let sum = 0;
				data.forEach(function(val, idx, arr) {
					if (val) {
						if (val.trim() !== '-') {
							sum += +val;
						}
					}
				}, 0);
				return sum;
			}
		}
		return 0;
	};

	//获取物料列表肩部信息
	getMaterialBtn = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: PAGECODE.cardbody,
					ignoreHotkeyCode: getCardDisableHotKeyBtn(),
					onButtonClick: buttonClickController.bind(this)
				})}
			</div>
		);
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	backToList = () => {
		this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
	};

	/**
	 * 创建云原生错误异常界面
	 */
	creatSocketErrorShow = (socket) => {
		return (
			<div>
				{socket.connectMesg({
					headBtnAreaCode: PAGECODE.cardhead, // 表头按钮区域ID
					formAreaCode: PAGECODE.cardhead, // 表头Form区域ID
					billpkname: FIELD.pk_order,
					billtype: '21',
					dataSource: OrderReviseCache.OrderReviseCacheKey
				})}
			</div>
		);
	};

	/**
 * 供应商应付
 */
	createSupplierApQuery = () => {
		return this.state.showSupplierApQuery ? (
			<SupplierApQuery
				supplierapdata={this.state.supplierapdata}
				showModal={this.state.showSupplierApQuery}
				onClose={() => {
					this.setState({ showSupplierApQuery: false });
				}}
			/>
		) : (
			''
		);
	};

	//侧拉编辑展开按钮
	editOpenButton = (props, moduleId, modelIndex, record) => {
		return (
			<div className="card_edit_open_btn" style={{ display: 'inline-block' }}>
				<span>
					{this.props.button.createButtonApp({
						area: 'card_edit',
						onButtonClick: buttonClickController.bind(
							this,
							this.props,
							'Pu_Inquirys',
							null,
							record,
							modelIndex
						)
					})}
				</span>
				<span>
					{this.props.button.createButtonApp({
						area: 'card_edits',
						onButtonClick: buttonClickController.bind(
							this,
							this.props,
							'CheckPuInquirys',
							null,
							record,
							modelIndex
						)
					})}
				</span>
			</div>
		);
	};

	/**
	 * 内部交易信息
	 *  
	 */
	createTransInfo = () => {
		return (
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
		);
	};

	render() {
		const { cardTable, form, cardPagination, modal, socket } = this.props;
		const { createForm } = form;
		const { createCardPagination } = cardPagination;
		const { createCardTable } = cardTable;
		const { createModal } = modal;
		let newpk = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value; // 主键
		return (
			<div className="nc-bill-card" id="pu_PoOrderCard_Page">
				{/* 创建云原生错误异常界面 */}
				{this.creatSocketErrorShow(socket)}
				<div className="nc-bill-top-area">
					<NCAffix>
						{/* 标题+按钮 */}
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: '', //单据号
									backBtnClick: this.backToList
								})}
								{/* 返回 */}
								{/* {this.props.getUrlParam(STATUS.status) == STATUS.browse ? (
									<NCBackBtn style={{ lineHeight: '32px' }} onClick={this.backToList} />
								) : (
									''
								)}
								<h2 className="title-search-detail">
									{getLangByResId(this, '4004ORDERREVISE-000012')}：{this.state.vbillcode}
								</h2> */}
								{/* 国际化处理： */}
							</div>
							{/* 表头按钮区 */}
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: PAGECODE.cardhead
								})}
								{this.props.button.createButtonApp({
									area: PAGECODE.cardhead,
									onButtonClick: buttonClickController.bind(this)
								})}
							</div>
							{/* 上一页/下一页 */}
							<div className="header-cardPagination-area">
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: OrderReviseCache.OrderReviseCacheKey
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表头区 采购订单+操作信息*/}
					<div className="bc-bill-form-area">
						{createForm(PAGECODE.cardhead, {
							expandArr: [ PAGECODE.cardhead ],
							onBeforeEvent: beforeEvent.bind(this),
							onAfterEvent: afterEvents.bind(this)
						})}
					</div>
				</div>
				{/* 订单详情 */}
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(PAGECODE.cardbody, {
							tableHead: this.getMaterialBtn, //订单详情按钮
							showindex: true,
							showCheck: true,
							hideModelSave: true,
							onBeforeEvent: beforeEvent.bind(this),
							onAfterEvent: afterEvents.bind(this),
							onSelected: buttonController.metarialSelected.bind(this),
							onSelectedAll: buttonController.metarialSelected.bind(this),
							onTabChange: this.tabChange.bind(this),
							inputChange: inputChange.bind(this, FIELD.crowno),
							modelAddRow: () => {
								RownoUtils.setRowNo(this.props, PAGECODE.cardbody, FIELD.crowno);
							},
							modelFooter: this.editOpenButton,
							adaptionHeight: true
						})}
					</div>
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
						billcode={newpk}
						pk_billtypecode={'21'}
					/>
				)}
				{/** 联查采购计划 **/}
				{/* 内部交易信息*/}
				{this.createTransInfo()}
				<div>
					<Inspection
						show={this.state.showNtbDetail}
						sourceData={this.state.ntbdata}
						cancel={() => {
							this.setState({ showNtbDetail: false });
						}}
						affirm={() => {
							this.setState({ showNtbDetail: false });
						}}
					/>
				</div>
				{createModal('MessageDlg', { size: 'xlg' })}
				{createModal('cancelDlg', { size: 'xlg' })}
				{/* 供应商应付 */}
				{this.createSupplierApQuery()}
				{/* 存量查询 */}
				<StockQuerys
					stockquerydata={this.state.stockquerydata}
					showModal={this.state.showStockQuery}
					onClose={() => {
						this.setState({ showStockQuery: false });
					}}
				/>

				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}

OrderReviseCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardcode,
		headcode: PAGECODE.cardhead,
		bodycode: PAGECODE.cardbody
	},
	//tab
	orderOfHotKey: [ PAGECODE.cardhead, PAGECODE.cardbody ]
})(OrderReviseCard);

// ReactDOM.render(<OrderReviseCard />, document.querySelector('#app'));

export default OrderReviseCard;
