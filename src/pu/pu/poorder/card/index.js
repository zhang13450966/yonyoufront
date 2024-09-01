/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片态页面
 * @Date: 2018-04-19 10:44:54
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-14 10:34:06
 */
import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
import { pageInfoClick, commit, addBtnClick, saveAndCommit } from './btnClicks';
import { relationCT } from './afterEvents';
import afterEvents from './afterEvents/afterEvents';
import batchEvents from './batchEvents/batchEvents';
import { beforeEvent } from './beforeEvents';
import initTemplate from './init/initTemplate';
import {
	PAGECODE,
	BUTTON,
	STATUS,
	FIELD,
	TRANSFER,
	OrderCache,
	TRANSFER30TO21COOP,
	URL,
	TRANSFERZ2
} from '../constance';
import Inspection from 'epmp/exports/components/Inspection';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCAffix, NCDiv } = base;
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import StockQuery from '../atpquery';
import SetPiece from '../../pub/setPiece';
import SalesQuery from '../salesquery';
import GrossProfitQuery from '../grossprofitquery';
import SupplierApQuery from '../supplierapquery';
import SupplementaryInfo from './supplementaryinfo';
import ArrivePlan from '../arriveplan';
import Transfer20Table from '../transfer20';
import refAddLineComfirmBtnClick from './btnClicks/refAddLineComfirmBtnClick';
import MergePrinting from 'scmpub/scmpub/components/MergePrinting';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import TransportStatusDlg from 'scmpub/scmpub/components/TransportStatus';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { buttonClickController, buttonController } from './viewController/index';
import { showWarningDialog } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil.js';
import { TempDataList } from 'scmpub/scmpub/components/TempSave';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import Businessinfo from 'to/to/businessinfo/list';
import ExcelOutput from 'uap/common/components/ExcelOutput';
import './index.less';

class OrderCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(PAGECODE.cardhead);
		props.use.cardTable(PAGECODE.head_payment);
		props.use.cardTable(PAGECODE.cardbody);
		this.curindex = 0;
		this.combineData; //合并显示
		this.selCTViews;
		this.meta;
		this.skipCodes = [];
		this.tabKey = PAGECODE.cardbody;
		this.refsourcdata = ''; //拉单来源数据暂存
		(this.copyRowDatas = null), // 复制行数据
			(this.state = {
				status: this.getPageParam(STATUS.status),
				forderstatus: '', //单据状态
				vbillcode: '', //订单编号
				pk_order: '', //主键
				showTrack: false, //单据追溯
				target: null, //弹出上传控件位置
				showUploader: false, //附件
				show: false, //审批详情
				vtrantypecode: null,
				listdata: '', //转单后编辑数据缓存
				currentindex: 0, //转单后编辑数据缓存
				showStockQuery: false, //存量查询
				showSalesQuery: false, //销量查询
				showGrossProfitQuery: false, //毛利预估
				showSupplierApQuery: false, //供应商应付
				stockquerydata: null, //存量查询参数
				salesquerydata: null, //销量查询参数
				grossprofitdata: null, //毛利预估参数
				supplierapdata: null, //供应商应付参数
				showConditionModal: false, // 合并显示
				compositedisplay: false, //提交指派
				compositedata: null, //提交指派
				showModal: false, //模态框
				returnURL: null, //推单
				appcode: null, //推单
				returnType: null, //推单
				transStateShowFlag: false, //运输状态
				vfrozenreason: null,
				showSetPiece: false, //是否显示成套件
				setPieceData: null, //成套件数据
				showSupplementinfo: false, //是否显示辅助信息
				supplementinfoData: null, //辅助信息数据
				supplementCunit: null, //辅助信息图标单位记录
				tempDataList: [], // 暂存数据
				showTemp: false,
				saveAndCommit: false, //是否保存提交
				showNtbDetail: false, //；联查采购计划
				ntbdata: null, //联查采购计划数据
				showBusinessModal: false // 内部交易信息用
			});
		this.pk_org = null;
		this.pk_customer = null;
		this.pk_supplier = null;
		this.indexstatus = {}; //多单编辑状态索引
		this.isFirstTransfer = true; //多单编辑是否第一单
		initLang(this, [ '4004poorder', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.addEventListener('beforeunload', this.onMove);
	}

	componentWillUnmount() {
		// 组件卸载时移除事件监听, 防止内存泄漏
		window.removeEventListener('beforeunload', this.onMove);
	}

	onMove = (event) => {
		let status = this.props.cardTable.getStatus(PAGECODE.cardbody);
		if (status == STATUS.edit) {
			/* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			event.returnValue = getLangByResId(this, '4004POORDER-000054');
		}
	};

	//点击转单缩略图的钩子函数
	onTransferSelect = (record, status, index) => {
		let isEdit = status ? STATUS.browse : STATUS.edit;
		if (this.indexstatus[index]) {
			if (this.indexstatus[index] == STATUS.browse) {
				isEdit = STATUS.browse;
			} else if (this.indexstatus[index] == STATUS.edit) {
				isEdit = STATUS.edit;
			}
		}
		if (record.head.card_head.rows[0].values.brefwhenreturn.value == false) {
			this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { ['breturn']: false });
		} else {
			this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { ['breturn']: true });
		}
		if (record.head.card_head.rows[0].values.breturn.value == false) {
			this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { ['brefwhenreturn']: false });
		} else {
			this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { ['brefwhenreturn']: true });
		}
		this.indexstatus[index] = isEdit;
		this.props.beforeUpdatePage();
		this.curindex = parseInt(index);
		let head = record && record.head && record.head[PAGECODE.cardhead];
		this.props.form.setAllFormValue({ [PAGECODE.cardhead]: head });
		//拉单初始化数据时调用交易类型默认值设置方法
		transtypeUtils.setValue.call(this, PAGECODE.cardhead, FIELD.ctrantypeid, FIELD.vtrantypecode);
		let payment = record && record.body && record.body[PAGECODE.head_payment];
		payment = payment != null ? payment : { rows: [] };
		this.props.cardTable.setTableData(PAGECODE.head_payment, payment, null, true, true);
		this.props.cardTable.setTableData(PAGECODE.cardbody, record.body[PAGECODE.cardbody], null, true, true);
		this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { [FIELD.pk_org_v]: true });
		this.props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
		buttonController.togglePageShow.call(this, this.props, isEdit);
		if (!this.isFirstTransfer) {
			// 第一条数据不关联，初始化之前已经关联
			relationCT.relationCT.call(this, this.props, record);
		}
		this.isFirstTransfer = false;
	};
	//获取url的参数
	getPageParam = (key) => {
		return this.props.getUrlParam(key);
	};
	//到货计划关闭事件
	arrivePlanClose = (status) => {
		if (status == STATUS.edit) {
			showWarningDialog(getLangByResId(this, '4004POORDER-000060'), getLangByResId(this, '4004POORDER-000104'), {
				beSureBtnClick: () => {
					this.setState({ showModal: false });
				},
				cancelBtnClick: () => {
					this.setState({ showModal: true });
				}
			});
		} else {
			this.setState({ showModal: false });
		}
	};

	// 付款协议按钮
	getPayMentBtn = () => {
		return (
			<div className="table-head-btns">
				{this.props.button.createButtonApp({
					area: PAGECODE.head_payment,
					onButtonClick: buttonClickController.bind(this)
				})}
			</div>
		);
	};
	//获取物料列表肩部信息
	getMaterialBtn = () => {
		return (
			<div className="table-head-btns">
				{this.props.button.createButtonApp({
					area: PAGECODE.cardbody,
					ignoreHotkeyCode: getCardDisableHotKeyBtn(),
					onButtonClick: buttonClickController.bind(this)
				})}
			</div>
		);
	};

	//页签切换回调函数
	tabChange = (props, moduleId, key) => {
		this.tabKey = key;
		buttonController.tabChange(props, moduleId, key);
	};
	// 审批详情关闭
	closeApprove = () => {
		this.setState({ show: false });
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({ showUploader: false });
	};

	// 提交指派
	getAssginUsedr = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.state.saveAndCommit == true) {
			saveAndCommit.call(this, this.skipCodes, value);
		} else {
			commit.call(this, this.props, null, value);
		}
		this.setState({ compositedisplay: false, saveAndCommit: false });
	};

	showBack = () => {
		let scene = getDefData(OrderCache.OrderCardCache, 'scene');
		scene = scene == '' || scene == 'undefined' ? null : scene;
		scene = scene == null ? this.props.getUrlParam('scene') : scene;
		return scene == null;
	};

	hideTransState = () => {
		this.setState({ transStateShowFlag: false });
	};

	getDatasource = (transfer, channelType) => {
		if (transfer) {
			return OrderCache.OrderTransferCache;
		} else if (channelType) {
			if (channelType == TRANSFER.replenishmentarrange) {
				return 'scm.so.replenishmentarrange.main';
			} else if (channelType == TRANSFER.directarrange) {
				return 'scm.so.directarrange.main';
			}
		}
	};

	//侧拉编辑展开按钮
	editOpenButton = (props, moduleId, modelIndex, record) => {
		return (
			<div className="card_edit_open_btn">
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
	hidePayTable = () => {
		return false;
	};

	/**
     * 到货计划
     */
	createArrivePlan = () => {
		return this.state.showModal ? (
			<div id="dialog">
				<ArrivePlan
					pk_order={this.state.pk_order}
					pk_org={this.pk_org}
					pk_customer={this.pk_customer}
					pk_supplier={this.pk_supplier}
					showModal={this.state.showModal}
					cardProps={this.props}
					onClose={(status) => {
						this.arrivePlanClose(status);
					}}
				/>
			</div>
		) : (
			''
		);
	};

	/**
     * 单据追溯
     */
	createBillTrack = () => {
		return this.state.showTrack ? (
			<BillTrack
				show={this.state.showTrack}
				close={() => {
					this.setState({ showTrack: false });
				}}
				pk={this.state.pk_order}
				type="21"
			/>
		) : (
			''
		);
	};

	/**
     * 附件管理
     */
	createNCUploader = (newpk) => {
		return (
			this.state.showUploader && (
				<div>
					<NCUploader
						billId={this.state.pk_order}
						billcode={newpk}
						pk_billtypecode={'21'}
						onHide={this.onHideUploader}
					/>
				</div>
			)
		);
	};

	/**
     * 审批详情
     */
	createApproveDetail = () => {
		return this.state.show ? (
			<ApproveDetail
				show={this.state.show}
				close={this.closeApprove}
				billtype={this.state.vtrantypecode} //"21"
				billid={this.state.pk_order}
			/>
		) : (
			''
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

	/**
     * 指派
     */
	createApprovalTrans = () => {
		return (
			<div>
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
			</div>
		);
	};

	/**
     * 存量查询
     */
	createStockQuery = () => {
		return this.state.showStockQuery ? (
			<StockQuery
				stockquerydata={this.state.stockquerydata}
				showModal={this.state.showStockQuery}
				onClose={() => {
					this.setState({ showStockQuery: false });
				}}
			/>
		) : (
			''
		);
	};

	/**
     * 销量查询
     */
	createSalesQuery = () => {
		return this.state.salesquerydata ? (
			<SalesQuery
				salesquerydata={this.state.salesquerydata}
				showModal={this.state.showSalesQuery}
				onClose={() => {
					this.setState({ showSalesQuery: false });
				}}
			/>
		) : (
			''
		);
	};

	/**
     * 毛利预估
     */
	createGrossProfitQuery = () => {
		return this.state.showGrossProfitQuery ? (
			<GrossProfitQuery
				grossprofitdata={this.state.grossprofitdata}
				showModal={this.state.showGrossProfitQuery}
				onClose={() => {
					this.setState({ showGrossProfitQuery: false });
				}}
			/>
		) : (
			''
		);
	};

	/**
     * 成套件
     */
	createSetPiece = () => {
		return this.state.showSetPiece ? (
			<SetPiece
				showModal={this.state.showSetPiece}
				setPieceData={this.state.setPieceData}
				onClose={() => {
					this.setState({ showSetPiece: false });
				}}
			/>
		) : (
			''
		);
	};

	/**
     * 辅助信息
     */
	createSupplementaryInfo = () => {
		return (
			<SupplementaryInfo
				showModal={this.state.showSupplementinfo}
				supplementinfoData={this.state.supplementinfoData}
				supplementCunit={this.state.supplementCunit}
				onClose={() => {
					this.setState({ showSupplementinfo: false });
				}}
			/>
		);
	};

	/**
     * 暂存
     */
	creatTempDataList = () => {
		return this.state.showTemp ? (
			<TempDataList
				parentProps={this.props}
				display={this.state.showTemp}
				config={{
					pagecode: PAGECODE.cardcode,
					type: 'card',
					processorstr: 'nccloud.web.pu.poorder.action.PoOrderTempSaveProcessor'
				}}
				addTemporary={this.state.tempDataList}
				close={() => {
					this.setState({ showTemp: false });
				}}
				clickTemporary={addBtnClick.bind(this)}
			/>
		) : (
			''
		);
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
					billtype: PAGECODE.billType,
					dataSource: OrderCache.OrderCacheKey
				})}
			</div>
		);
	};

	/**
     * 联查运输状态
     */
	createtransport = (NCModal) => {
		return this.state.transStateShowFlag ? (
			<NCModal
				show={this.state.transStateShowFlag}
				onHide={this.hideTransState}
				size="xlg"
				fieldid="pu_transstate"
			>
				<NCModal.Header closeButton>
					<NCModal.Title>{getLangByResId(this, '4004POORDER-000059')}</NCModal.Title>
					{/* 国际化处理：
									运输状态*/}
				</NCModal.Header>
				<NCModal.Body>
					<TransportStatusDlg transportData={this.state.transStateData} transpk="cpuorder_bb1id" />
				</NCModal.Body>
			</NCModal>
		) : (
			''
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
		const { cardTable, form, button, modal, cardPagination, transferTable, socket } = this.props;
		const { createCardPagination } = cardPagination;
		const { createTransferList } = transferTable;
		const { createCardTable } = cardTable;
		const { createModal } = modal;
		const { createForm } = form;
		const { NCModal } = base;
		let transfer = this.props.getUrlParam(TRANSFER.transfer);
		let channelType = this.props.getUrlParam(TRANSFER.channelType);
		let transferDatasource = this.getDatasource(transfer, channelType);
		let newpk = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value; // 主键
		const MergePrintingProps = {
			jsonData: this.combineData,
			toggleConditionModal: () => {
				this.setState({ showConditionModal: !this.state.showConditionModal });
			},
			showConditionModal: this.state.showConditionModal
		};
		let ishideAdd = transfer == TRANSFER30TO21COOP.CSOURCETYPECODE ? true : false;
		//光标默认聚焦关闭
		this.props.controlAutoFocus(true);
		if (transfer || channelType) {
			return (
				<div id="transferCard" className="nc-bill-transferList">
					{/* 创建云原生错误异常界面 */}
					{this.creatSocketErrorShow(socket)}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: '', //单据号
									backBtnClick: buttonClickController.bind(this, this.props, BUTTON.Back)
								})}
							</div>
							{/* 表头按钮区 */}
							<div className="header-button-area">
								{button.createErrorFlag({
									headBtnAreaCode: PAGECODE.cardhead
								})}
								{button.createButtonApp({
									area: PAGECODE.cardhead,
									onButtonClick: buttonClickController.bind(this)
								})}
								{/* 到货计划  */}
								{this.createArrivePlan()}
								{/* 单据追溯 */}
								{/* {this.createBillTrack()} */}
								<BillTrack
									show={this.state.showTrack}
									close={() => {
										this.setState({ showTrack: false });
									}}
									pk={this.state.pk_order}
									type="21"
								/>
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{/* 转单 */}
						{createTransferList({
							dataSource: transferDatasource,
							headcode: PAGECODE.cardhead, //表格组件id
							bodycode: PAGECODE.bodyIds,
							transferListId: PAGECODE.leftarea, //转单列表id
							onTransferItemSelected: (record, status, index) => {
								this.onTransferSelect(record, status, index);
							}
						})}
						<div className="transferList-content-right nc-bill-extCard-2">
							<div className="nc-bill-top-area">
								<div className="nc-bill-form-area">
									{createForm(PAGECODE.cardhead, {
										expandArr: [ PAGECODE.cardhead ],
										onAfterEvent: afterEvents.bind(this),
										onBeforeEvent: beforeEvent.bind(this)
									})}
								</div>
							</div>
							<div className="nc-bill-table-area">
								{createCardTable(PAGECODE.head_payment, {
									tableHead: this.getPayMentBtn, //付款协议按钮
									onBeforeEvent: beforeEvent.bind(this),
									showIndex: true,
									hideModelSave: true,
									hideSwitch: this.hidePayTable,
									onAfterEvent: afterEvents.bind(this),
									inputChange: inputChange.bind(this, FIELD.crowno),
									showSelectedNum: false
									// adaptionHeight: true
									// isAddRow: true,
									// addRowCallback: () => {
									// 	RownoUtils.setRowNo(this.props, PAGECODE.head_payment, 'showorder');
									// }
								})}
							</div>
							<div className="nc-bill-tableTab-area">
								{createCardTable(PAGECODE.cardbody, {
									tableHead: this.getMaterialBtn, //订单详情按钮
									showindex: true,
									showCheck: true,
									hideModelSave: true,
									onSelected: buttonController.metarialSelected.bind(this.props),
									onSelectedAll: buttonController.metarialSelected.bind(this.props),
									onTabChange: this.tabChange.bind(this),
									onAfterEvent: afterEvents.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									onBatchChange: batchEvents.bind(this),
									inputChange: inputChange.bind(this, FIELD.crowno),
									// isAddRow: true,
									// addRowCallback: () => {
									// 	RownoUtils.setRowNo(this.props, PAGECODE.cardbody, FIELD.crowno);
									// },
									adaptionHeight: true,
									modelAddRow: () => {
										RownoUtils.setRowNo(this.props, PAGECODE.cardbody, FIELD.crowno);
									},
									modelFooter: this.editOpenButton,
									hideAdd: ishideAdd
								})}
							</div>
							{createModal(BUTTON.Delete, {
								title: getLangByResId(this, '4004POORDER-000039') /* 国际化处理： 注意*/,
								content: getLangByResId(this, '4004POORDER-000056') /* 国际化处理： 确定要删除吗?*/
							})}
							{createModal(BUTTON.orgChange)}
							{createModal('MessageDlg', { zIndex: 250 })}
							{/* 附件管理 */}
							{this.createNCUploader(newpk)}
							{/* 审批详情 */}
							{this.createApproveDetail()}
							{/* 供应商应付 */}
							{this.createSupplierApQuery()}
							{/* 提交指派 */}
							{this.createApprovalTrans()}
							{/* 存量查询 */}
							{this.createStockQuery()}
							{/* 销量查询 */}
							{this.createSalesQuery()}
							{/* 毛利预估 */}
							{this.createGrossProfitQuery()}
							{/** 联查采购计划 **/}
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
							{/* 合并显示 */}
							{this.combineData && <MergePrinting {...MergePrintingProps} />}
							{/* 交互式异常 */}
							{createModal('ResumeMessageDlg', {
								className: 'iframe-modal',
								size: 'xlg'
							})}
							{/* 参照增行 模态框 */}
							{createModal('RefAdd20Modal', {
								size: 'xlg',
								zIndex: 212,
								title: getLangByResId(this, '4004POORDER-000058') /* 国际化处理： 参照增行*/,
								className: 'ref-addline-modal',
								noFooter: true,
								content: (
									<Transfer20Table
										isRefAddLine={true}
										refsourcdata={this.refsourcdata}
										refAddLineComfirmBtnClick={refAddLineComfirmBtnClick.bind(this)}
									/>
								)
							})}
							{/* 联查运输状态 */}
							{this.createtransport(NCModal)}
							{/* 成套件 2019-04-12*/}
							{this.createSetPiece()}
							{/* 辅助信息*/}
							{this.createSupplementaryInfo()}
							{/* 内部交易信息*/}
							{this.createTransInfo()}
						</div>
					</div>
					<ExcelOutput
						{...Object.assign(this.props)}
						moduleName={FIELD.PURCHASEORG} //模块名称，
						billType={PAGECODE.billType} //单据类型
						pagecode={PAGECODE.cardcode} //页面编码
						appcode={TRANSFERZ2.appcode} //请购单的应用编码
						exportTreeUrl={URL.exportUrl} // 导出模板设置接口
						// referVO={{ ignoreTemplate: true }}//设置之后导出模板走xml配置
					/>
					{createModal('code-config')}
					{createModal('printService', {
						className: 'print-service'
					})}
					<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
				</div>
			);
		} else {
			return (
				<div className="nc-bill-extCard-2" id="pu_PoOrderCard_Page">
					{/* 创建云原生错误异常界面 */}
					{this.creatSocketErrorShow(socket)}
					<div className="nc-bill-top-area">
						<NCAffix>
							{/* 标题+按钮 */}
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									{createCardTitle(this, {
										billCode: '', //单据号
										backBtnClick: buttonClickController.bind(this, this.props, BUTTON.Back)
									})}
								</div>
								{/* 表头按钮区 */}
								<div className="header-button-area">
									{button.createErrorFlag({
										headBtnAreaCode: PAGECODE.cardhead
									})}
									{button.createButtonApp({
										area: PAGECODE.cardhead,
										onButtonClick: buttonClickController.bind(this)
									})}
									{/* 到货计划 */}
									{this.createArrivePlan()}
									{/* 单据追溯 */}
									{/* {this.createBillTrack()} */}
									<BillTrack
										show={this.state.showTrack}
										close={() => {
											this.setState({ showTrack: false });
										}}
										pk={this.state.pk_order}
										type="21"
									/>
								</div>
								{/* 上一页/下一页 */}
								<div className="header-cardPagination-area">
									{createCardPagination({
										handlePageInfoChange: pageInfoClick.bind(this),
										dataSource: OrderCache.OrderCacheKey
									})}
								</div>
							</NCDiv>
						</NCAffix>
						{/* 表头区 采购订单+操作信息*/}
						<div className="nc-bill-form-area">
							{createForm(PAGECODE.cardhead, {
								expandArr: [ PAGECODE.cardhead ],
								onAfterEvent: afterEvents.bind(this),
								onBeforeEvent: beforeEvent.bind(this)
							})}
						</div>
					</div>
					<div className="nc-bill-table-area">
						{createCardTable(PAGECODE.head_payment, {
							tableHead: this.getPayMentBtn, //付款协议按钮
							onBeforeEvent: beforeEvent.bind(this),
							showIndex: true,
							hideModelSave: true,
							hideSwitch: this.hidePayTable,
							onAfterEvent: afterEvents.bind(this),
							inputChange: inputChange.bind(this, FIELD.crowno),
							showSelectedNum: false
							// adaptionHeight: true
							// isAddRow: true,
							// addRowCallback: () => {
							// 	RownoUtils.setRowNo(this.props, PAGECODE.head_payment, 'showorder');
							// }
						})}
					</div>
					{/* </div> */}
					<div className="nc-bill-tableTab-area">
						{/* <div className="nc-bill-table-area"> */}
						{createCardTable(PAGECODE.cardbody, {
							tableHead: this.getMaterialBtn, //订单详情按钮
							showindex: true,
							showCheck: true,
							hideModelSave: true,
							onSelected: buttonController.metarialSelected.bind(this.props),
							onSelectedAll: buttonController.metarialSelected.bind(this.props),
							onTabChange: this.tabChange.bind(this),
							onAfterEvent: afterEvents.bind(this),
							onBeforeEvent: beforeEvent.bind(this),
							onBatchChange: batchEvents.bind(this),
							inputChange: inputChange.bind(this, FIELD.crowno),
							// isAddRow: true,
							// addRowCallback: () => {
							// 	RownoUtils.setRowNo(this.props, PAGECODE.cardbody, FIELD.crowno);
							// },
							adaptionHeight: true,
							modelAddRow: () => {
								RownoUtils.setRowNo(this.props, PAGECODE.cardbody, FIELD.crowno);
							},
							modelFooter: this.editOpenButton
						})}
					</div>
					{/* 订单详情 */}
					{createModal(BUTTON.Delete, {
						title: getLangByResId(this, '4004POORDER-000039') /* 国际化处理： 注意*/,
						content: getLangByResId(this, '4004POORDER-000056') /* 国际化处理： 确定要删除吗?*/
					})}
					{createModal('MessageDlg', { zIndex: 250 })}
					{createModal(BUTTON.orgChange)}
					{/* 附件管理 */}
					{this.createNCUploader(newpk)}
					{/* 审批详情 */}
					{this.createApproveDetail()}
					{/* 供应商应付 */}
					{this.createSupplierApQuery()}
					{/* 提交指派 */}
					{this.createApprovalTrans()}
					{/* 存量查询 */}
					{this.createStockQuery()}
					{/* 销量查询 */}
					{this.createSalesQuery()}
					{/* 毛利预估 */}
					{this.createGrossProfitQuery()}
					{/* 暂存数据 */}
					{this.creatTempDataList()}
					{/* 合并显示 */}
					{this.combineData && <MergePrinting {...MergePrintingProps} />}
					{/* 交互式异常 */}
					<div>{createModal('ResumeMessageDlg', { className: 'iframe-modal', size: 'xlg' })}</div>
					{createModal('RefAdd20Modal', {
						size: 'xlg',
						zIndex: 212,
						title: getLangByResId(this, '4004POORDER-000058') /* 国际化处理： 参照增行*/,
						className: 'ref-addline-modal',
						noFooter: true,
						content: (
							<Transfer20Table
								isRefAddLine={true}
								refsourcdata={this.refsourcdata}
								refAddLineComfirmBtnClick={refAddLineComfirmBtnClick.bind(this)}
							/>
						)
					})}
					{/** 联查采购计划 **/}
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
					<ExcelOutput
						{...Object.assign(this.props)}
						moduleName={FIELD.PURCHASEORG} //模块名称，
						billType={PAGECODE.billType} //单据类型
						pagecode={PAGECODE.cardcode} //页面编码
						appcode={TRANSFERZ2.appcode} //请购单的应用编码
						exportTreeUrl={URL.exportUrl} // 导出模板设置接口
						// referVO={{ ignoreTemplate: true }}//设置之后导出模板走xml配置
					/>
					{/* 联查运输状态 */}
					{this.createtransport(NCModal)}
					{/* 成套件 2019-04-12*/}
					{this.createSetPiece()}
					{/* 辅助信息*/}
					{this.createSupplementaryInfo()}
					{createModal('code-config')}
					{createModal('printService', {
						className: 'print-service'
					})}
					{/* 内部交易信息*/}
					{this.createTransInfo()}
					<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
				</div>
			);
		}
	}
}

OrderCard = createPage({
	//编辑公式
	billinfo: {
		billtype: 'extcard', //一主多子
		pagecode: PAGECODE.cardcode,
		headcode: PAGECODE.cardhead,
		bodycode: [ PAGECODE.cardbody, PAGECODE.head_payment ]
	},
	//tab
	orderOfHotKey: [ PAGECODE.cardhead, PAGECODE.head_payment, PAGECODE.cardbody ]
})(OrderCard);

// ReactDOM.render(<OrderCard />, document.querySelector('#app'));

export default OrderCard;
