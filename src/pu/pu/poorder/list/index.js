/*
 * @Author: CongKe
 * @PageInfo: 采购订单列表态页面
 * @Date: 2018-04-19 10:21:07
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-02-19 16:45:13
 */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
const { NCTabsControl, NCDiv } = base;
import initTemplate from './init/initTemplate';
import searchBtnClick from './btnClicks/searchBtnClick';
import { pageInfoClick, commit } from './btnClicks';
import { URL, PAGECODE, FIELD, LIST_BUTTON, STATUS, OrderCache, TRANSFERZ2 } from '../constance';
import commonSerach from './btnClicks/commonSearch';
import ArrivePlan from '../arriveplan';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefData, setDefData } from '../../../../scmpub/scmpub/pub/cache';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import TransportStatusDlg from 'scmpub/scmpub/components/TransportStatus';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController, buttonClickController } from './viewController/index';
import { showWarningDialog } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import Businessinfo from 'to/to/businessinfo/list';
import ExcelOutput from 'uap/common/components/ExcelOutput';
class OrderList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.table(PAGECODE.tableId);
		this.state = {
			uncommitNum: '0', //待提交
			approvingNum: '0', //审批中
			executNum: '0', //执行中
			searchVal: null, //查询条件缓存
			currentTab: 0, //默认显示待提交
			showModal: false, //模态框
			pk_order: '', //pk
			showTrack: false, //单据追溯
			target: null, //弹出上传控件位置
			showUploader: false, //
			vbillcode: '',
			show: false, //审批详情
			vtrantypecode: null,
			compositedisplay: false, //指派参数
			compositedata: null, //指派
			transStateShowFlag: false, //运输状态
			showBusinessModal: false, // 内部交易信息用
			exportPK: []
			// currentLocale: 'en-US'
		};
		this.searchflag = false;
		this.commitInfo = {
			index: null,
			record: null
		};
		this.pk_org = null;
		this.pk_customer = null;
		this.pk_supplier = null;
		initLang(this, [ '4004poorder', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}
	//页面数据初始化
	componentDidMount() {}

	// 待提交、审批中、执行中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		setDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode, {
			tabCode: tabCode
		});
		let queryInfo = getDefData(OrderCache.OrderCacheKey, 'queryInfo');
		if (queryInfo != false) {
			this.searchflag = true;
		}
		// if (3 == tabCode) {
		// 	if (this.state.searchVal == null) {
		// 		// 点击全部页签时，若未输入查询条件，就不查
		// 		let rowsData = { rows: [] };
		// 		this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
		// 		return;
		// 	}
		// }
		this.setState({ currentTab: tabCode }, () => {
			let tab = FIELD.tocommit;
			if (0 == tabCode) {
				tab = FIELD.tocommit;
			} else if (1 == tabCode) {
				tab = FIELD.approving;
			} else if (2 == tabCode) {
				tab = FIELD.executing;
			} else if (3 == tabCode) {
				tab = FIELD.all;
			}
			commonSerach.call(this, tab, queryInfo, true); // 调用查询方法
		});
		// 页签切换时重置按钮
		buttonController.initButtons.call(this, this.props, tabCode);
	};
	// 查询区编辑后
	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [
				'pk_payterm',
				'pk_supplier',
				'cemployeeid',
				'pk_dept',
				'pk_invcsupllier',
				'approver',
				'billmaker',
				'pk_recvcustomer',
				'pk_order_b.pk_srcmaterial',
				'pk_order_b.pk_srcmaterial.code',
				'pk_order_b.pk_srcmaterial.name',
				'pk_order_b.vvendinventorycode',
				'pk_order_b.vvendinventoryname',
				'pk_order_b.pk_srcmaterial',
				'pk_order_b.pk_srcmaterial.pk_marbasclass',
				'vdef1',
				'vdef2',
				'vdef3',
				'vdef4',
				'vdef5',
				'vdef6',
				'vdef7',
				'vdef8',
				'vdef9',
				'vdef10',
				'vdef11',
				'vdef12',
				'vdef13',
				'vdef14',
				'vdef15',
				'vdef16',
				'vdef17',
				'vdef18',
				'vdef19',
				'vdef20',
				'pk_order_b.vfree1',
				'pk_order_b.vfree2',
				'pk_order_b.vfree3',
				'pk_order_b.vfree4',
				'pk_order_b.vfree5',
				'pk_order_b.vfree6',
				'pk_order_b.vfree7',
				'pk_order_b.vfree8',
				'pk_order_b.vfree9',
				'pk_order_b.vfree10',
				'pk_order_b.vbdef1',
				'pk_order_b.vbdef2',
				'pk_order_b.vbdef3',
				'pk_order_b.vbdef4',
				'pk_order_b.vbdef5',
				'pk_order_b.vbdef6',
				'pk_order_b.vbdef7',
				'pk_order_b.vbdef8',
				'pk_order_b.vbdef9',
				'pk_order_b.vbdef10',
				'pk_order_b.vbdef11',
				'pk_order_b.vbdef12',
				'pk_order_b.vbdef13',
				'pk_order_b.vbdef14',
				'pk_order_b.vbdef15',
				'pk_order_b.vbdef16',
				'pk_order_b.vbdef17',
				'pk_order_b.vbdef18',
				'pk_order_b.vbdef19',
				'pk_order_b.vbdef20'
			]);
		} else if (field == 'pk_order_b.pk_reqstoorg') {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [ 'pk_order_b.pk_reqstordoc' ]);
		} else if (field == 'pk_order_b.pk_arrvstoorg') {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [ 'pk_order_b.pk_recvstordoc' ]);
		}
	}

	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, PAGECODE.searchId, FIELD.ctrantypeid);
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

	//双击事件
	doubleClick = (record, index) => {
		let pk_order = record.pk_order.value;
		let scene = this.props.getUrlParam('scene');
		this.props.pushTo(URL.gotoCard, {
			status: STATUS.browse,
			id: pk_order,
			scene: scene,
			pagecode: PAGECODE.cardcode
		});
	};
	// 审批详情关闭
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	// 提交指派
	getAssginUsedr = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.commitInfo.record) {
			commit.call(this, this.props, this.commitInfo.record, this.commitInfo.index, value);
		} else {
			commit.call(this, this.props, null, null, value);
		}
		this.setState({ compositedisplay: false });
	};

	getdefaultTab = () => {
		let tabCode = getDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode);
		// 里程碑看板跳转过来，直接跳转全部页签
		let srcpk = this.props.getUrlParam(FIELD.pk);
		if (srcpk) {
			tabCode = { tabCode: 3 };
		}
		let currentTab = tabCode && tabCode.tabCode != null ? tabCode.tabCode : 0;
		setDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode, {
			tabCode: currentTab
		});
		return currentTab;
	};
	//到货计划关闭事件
	arrivePlanClose = (status) => {
		if (status == STATUS.edit) {
			showWarningDialog(getLangByResId(this, '4004POORDER-000060'), getLangByResId(this, '4004POORDER-000104'), {
				beSureBtnClick: () => {
					this.setState({ showModal: false });
				},
				cancelBtnClick: () => {}
			});
		} else {
			this.setState({ showModal: false });
		}
	};

	hideTransState = () => {
		this.setState({ transStateShowFlag: false });
	};

	render() {
		const { table, button, search, modal } = this.props;
		const { createSimpleTable } = table; //引入表格
		const { NCCreateSearch } = search; //引入创建查询方法
		const { createModal } = modal;
		const { NCModal, NCTabs, NCButton, NCBackBtn } = base;
		const { socket } = this.props;
		let rows = this.props.table.getCheckedRows(PAGECODE.tableId);
		let newpk = '';
		if (rows && rows[0] && rows[0].data) {
			newpk = rows[0].data.values.pk_order.value; // 主键
		}
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: PAGECODE.tableId,
					billpkname: FIELD.pk_order,
					billtype: PAGECODE.billType
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 采购订单/采购订单冻结*/}
					</div>
					{/* 按钮区 */}
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: PAGECODE.tableId,
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
						dataSource: OrderCache.OrderCacheKey,
						pkname: FIELD.pk_order
					})}
				</div>
				{/* 页签区 */}
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={this.getdefaultTab()}>
						<div key={0} clickFun={this.tabChange.bind(this, 0)}>
							{getLangByResId(this, '4004POORDER-000073') + ' (' + this.state.uncommitNum + ')'}
							{/* 国际化处理： 待提交*/}
						</div>
						<div key={1} clickFun={this.tabChange.bind(this, 1)}>
							{getLangByResId(this, '4004POORDER-000074') + ' (' + this.state.approvingNum + ')'}
							{/* 国际化处理： 审批中*/}
						</div>
						<div key={2} clickFun={this.tabChange.bind(this, 2)}>
							{getLangByResId(this, '4004POORDER-000075') + ' (' + this.state.executNum + ')'}
							{/* 国际化处理： 执行中*/}
						</div>
						<div key={3} clickFun={this.tabChange.bind(this, 3)}>
							{getLangByResId(this, '4004POORDER-000076')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{/* 列表区域 */}
					{createSimpleTable(PAGECODE.tableId, {
						showIndex: true, //显示序号
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: buttonController.initButtons.bind(this, this.props, null),
						onSelectedAll: buttonController.initButtons.bind(this, this.props, null),
						dataSource: OrderCache.OrderCacheKey,
						pkname: FIELD.pk_order,
						componentInitFinished: buttonController.initButtons.bind(this, this.props, null)
					})}
				</div>
				{/* 到货计划 {createModal(LIST_BUTTON.Arrival_Plan)} */}
				<div id="dialog">
					{this.state.showModal && (
						<ArrivePlan
							pk_order={this.state.pk_order}
							pk_org={this.pk_org}
							pk_customer={this.pk_customer}
							pk_supplier={this.pk_supplier}
							showModal={this.state.showModal}
							onClose={(status) => {
								this.arrivePlanClose(status);
							}}
						/>
					)}
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
				{/* 审批详情 */}
				<ApproveDetail
					show={this.state.show}
					close={this.closeApprove}
					billtype={this.state.vtrantypecode} //"21"
					billid={this.state.pk_order}
				/>
				{/* 指派 */}
				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4004POORDER-000057')} /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr.bind(this)}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
				<NCModal
					show={this.state.transStateShowFlag}
					onHide={this.hideTransState}
					size="xlg"
					fieldid="polisttransportquery"
				>
					<NCModal.Header closeButton>
						<NCModal.Title>{getLangByResId(this, '4004POORDER-000059')}</NCModal.Title>
						{/* 国际化处理： 运输状态*/}
					</NCModal.Header>
					<NCModal.Body>
						<TransportStatusDlg transportData={this.state.transStateData} transpk="cpuorder_bb1id" />
					</NCModal.Body>
					{/* <NCModal.Footer>
						<NCButton onClick={this.hideTransState}>{getLangByResId(this, '4004POORDER-000060')}</NCButton>
						国际化处理： 关闭
					</NCModal.Footer> */}
				</NCModal>
				<ExcelOutput
					{...Object.assign(this.props)}
					moduleName={FIELD.PURCHASEORG} //模块名称，
					billType={PAGECODE.billType} //单据类型
					pagecode={PAGECODE.cardcode} //页面编码
					appcode={TRANSFERZ2.appcode} //请购单的应用编码
					exportTreeUrl={URL.exportUrl} // 导出模板设置接口
					// referVO={{ ignoreTemplate: true }}//设置之后导出模板走xml配置
				/>
				{createModal(LIST_BUTTON.Delete)}
				{createModal('MessageDlg')}
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}

OrderList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listcode,
		bodycode: PAGECODE.tableId
	}
})(OrderList);

// ReactDOM.render(<OrderList />, document.querySelector('#app'));

export default OrderList;
