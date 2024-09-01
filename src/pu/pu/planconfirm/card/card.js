/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单卡片页面
 * @Date: 2021-11-19 10:02:07 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-13 11:17:40
 */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
import NCUploader from 'uap/common/components/NCUploader';
import { PAGECODE, AREA, UISTATE, OHTER, CONSTFIELD, BTNID, FIELD } from '../constance';
import { initTemplate } from './init';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import afterEvents from './afterEvents/afterEvents';
import { beforeEvent } from './beforeEvents';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { btnClickController, metarialSelected, buttonController } from './viewController';
import { queryCardBtnClick } from './btnClicks';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import { changeUrlParam } from '../../../../scmpub/scmpub/pub/cache';
import { batchEvents } from './batchEvents';

const { BillTrack } = high;
const { NCAffix, NCDiv } = base;

export default class PlanConfirmCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.head);
		props.use.cardTable(AREA.body);
		this.indexstatus = {};
		this.billcode = '';
		this.status = UISTATE.browse; // 页面整体状态标志，新增态、修改态、浏览态
		this.state = {
			pk_planconfirm: '', //进度确认单主键
			cardPaginationShow: true, // 翻页按钮显示隐藏标志
			// 提交指派添加参数 begin
			compositedisplay: false,
			compositedata: null,
			// 提交指派添加参数 end
			// 审批详情  begin
			vtrantypecode: '',
			show: false, //审批详情显示控制
			pk: '', //审批详情主键
			// 审批详情  end
			showTrack: false, //单据追溯
			showUploader: false //附件
		};
		this.manyTrans = true;
		initLang(this, [ '4004planconfirm' ], 'pu', initTemplate.bind(this, this.props));
	}
	// 渲染页面前，执行
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(AREA.body);
			if (!status) status == UISTATE.browse;
			status = status == UISTATE.browse ? UISTATE.browse : UISTATE.edit;
			if (status == UISTATE.edit) {
				return getLangByResId(this, 'C010CHECKBILL-000018'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: AREA.cardBodyBtnArea,
					onButtonClick: btnClickController.bind(this)
				})}{' '}
			</div>
		);
	};
	//审批详情关闭
	closeApprove = () => {
		this.setState({
			show: false
		});
	};

	// 附件管理关闭
	onHideUploader = () => {
		this.setState({ showUploader: false });
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
				c
				pk={this.state.pk_planconfirm}
				type="2C"
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
						billId={this.state.pk_planconfirm}
						billcode={newpk}
						pk_billtypecode={'2C'}
						onHide={this.onHideUploader}
					/>
				</div>
			)
		);
	};

	// 转单左侧列表点击切换事件
	transferListClick = (record, index, status) => {
		//点击转单缩略图的钩子函数
		this.curindex = index;
		let uistatus = status ? 'browse' : 'edit';
		if (this.indexstatus[index]) {
			if (this.indexstatus[index] == 'browse') {
				uistatus = 'browse';
			} else if (this.indexstatus[index] == 'edit') {
				uistatus = 'edit';
			}
		}
		this.indexstatus[index] = uistatus;

		if (status) {
			let pk_planconfirm = record.head.head.rows[0].values.pk_planconfirm.value;
			changeUrlParam(this.props, { id: pk_planconfirm, status: UISTATE.browse });
		} else {
			changeUrlParam(this.props, { status: UISTATE.edit });
		}
		this.props.form.setAllFormValue({ [AREA.head]: record.head[AREA.body] });
		setTimeout(() => {
			this.props.cardTable.setTableData(AREA.body, record.body[AREA.body]);
		}, 0);
		this.props.form.setFormStatus(AREA.body, uistatus);
		this.props.cardTable.setStatus(AREA.body, uistatus);

		//	let billcode = record.head.card_head.rows[0].values.vbillcode.value;
		//	this.setBillHeadInfo(billcode);

		buttonController.call(this, this.props);
	};

	render() {
		let { cardTable, form, modal, cardPagination, transferTable } = this.props;
		let buttons = this.props.button.getButtons();
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createModal } = modal;
		let { createCardPagination } = cardPagination;
		let { showUploader } = this.state;
		const { socket } = this.props;
		const { createTransferList } = transferTable;
		let type = this.props.getUrlParam('type');
		let channelType = this.props.getUrlParam('channelType');
		if (type || channelType) {
			return (
				<div className="nc-bill-transferList" id="scm-pu-planconfirm-card" style={{ position: 'relative' }}>
					{socket.connectMesg({
						headBtnAreaCode: AREA.head, // 表头按钮区域ID
						formAreaCode: AREA.head, // 表头Form区域ID
						billtype: '2C',
						billpkname: FIELD.hid,
						dataSource: CONSTFIELD.dataSource
					})}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								<span>
									{createCardTitle(this, {
										billCode: this.billcode, //单据号
										backBtnClick: btnClickController.bind(this, this.props, BTNID.Back) // 返回按钮事件
									})}
								</span>
							</div>
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: AREA.head
								})}

								{this.props.button.createButtonApp({
									//表头按钮区
									area: AREA.cardHeadBtnArea,
									onButtonClick: btnClickController.bind(this)
								})}
								<BillTrack
									show={this.state.showTrack}
									close={() => {
										this.setState({ showTrack: false });
									}}
									pk={this.state.pk_planconfirm}
									type="2C"
								/>
							</div>
							{this.props.getUrlParam(OHTER.status) == UISTATE.browse &&
							this.state.cardPaginationShow &&
							this.props.getUrlParam(OHTER.scene) != OHTER.approve ? (
								<div className="header-cardPagination-area" style={{ float: 'right' }}>
									{createCardPagination({
										handlePageInfoChange: queryCardBtnClick.bind(this),
										dataSource: CONSTFIELD.dataSource
									})}
								</div>
							) : (
								''
							)}
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{createTransferList({
							dataSource: CONSTFIELD.PlanconfirmTransferCache,
							headcode: AREA.head, //表格组件id
							bodycode: AREA.body, // 表体的区域编码
							transferListId: AREA.leftarea, //转单列表id
							onTransferItemSelected: (record, status, index) => {
								/**begain 多单编辑保存提交，下一条按钮控制有问题，20181129未提交 */
								this.curindex = index;
								/**end 多单编辑保存提交，下一条按钮控制有问题，20181129未提交 */
								let uistatus = status ? 'browse' : 'edit';
								if (this.indexstatus[index]) {
									if (this.indexstatus[index] == 'browse') {
										uistatus = 'browse';
									} else if (this.indexstatus[index] == 'edit') {
										uistatus = 'edit';
									}
								}
								this.indexstatus[index] = uistatus;

								this.props.form.setAllFormValue({
									[AREA.head]: record.head[AREA.head]
								});
								// setTimeout(() => {
								this.props.cardTable.setTableData(AREA.body, record.body[AREA.body]);
								// }, 10);
								// this.props.form.setFormStatus(AREA.card_head, uistatus);
								// this.props.cardTable.setStatus(AREA.card_body, uistatus);
								// 设置主组织不可编辑
								this.props.form.setFormItemsDisabled(AREA.head, { [FIELD.pk_org_v]: true });

								//let billcode = record.head.head.rows[0].values.vbillcode.value;
								//	this.setBillHeadInfo(billcode);
								let pk_planconfirm = record.head.head.rows[0].values.pk_planconfirm.value;
								changeUrlParam(this.props, { id: pk_planconfirm, status: uistatus });

								buttonController.call(this, this.props, uistatus);
								this.manyTrans = false;
							}
							// onTransferItemClick: (record, index, status) => {
							// 	//点击转单缩略图的钩子函数
							// 	this.transferListClick(record, index, status);
							// 	if (!status) {
							// 		// setTimeout(() => {
							// 		doTransferDataCache.call(this, this.props);
							// 		// }, 10);
							// 	}
							// }
						})}

						<div className="transferList-content-right nc-bill-card">
							<div className="nc-bill-top-area">
								{/* 表单 */}
								<div className="nc-bill-form-area">
									{createForm(AREA.head, {
										onAfterEvent: afterEvents.bind(this),
										onBeforeEvent: beforeEvent.bind(this)
									})}
								</div>
							</div>
							{/* 表格 */}
							<div className="nc-bill-bottom-area">
								<div className="nc-bill-table-area	scm-pu-extent-btn">
									{createCardTable(AREA.body, {
										onBeforeEvent: beforeEvent.bind(this),
										hideModelSave: true,
										showCheck: true,
										onSelected: metarialSelected.bind(this.props),
										onSelectedAll: metarialSelected.bind(this.props),
										adaptionHeight: true, //卡片高度自适应适配
										tableHead: this.getTableHead.bind(this, buttons),
										onAfterEvent: afterEvents.bind(this),
										onBatchChange: batchEvents.bind(this),
										hideAdd: false
									})}
								</div>
							</div>
						</div>
					</div>
					{/* 审批详情 */}
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.vtrantypecode}
						billid={this.state.pk}
					/>
					{/* 附件管理 */}
					<div>
						{showUploader && (
							<NCUploader
								// billId={this.state.pk_invoice}
								billId={this.state.pk_planconfirm}
								billcode={this.state.pk_planconfirm}
								pk_billtypecode={'2C'}
								// billNo={this.state.billcode}
								// target={target}
								placement={''}
								onHide={this.onHideUploader}
							/>
						)}
					</div>
					{/* 打印次数查询添加的模态框 */}
					{createModal('code-config')}
					{/* 打印次数控制引入的组件 */}
					{createModal('printService', {
						className: 'print-service'
					})}
					{/* <iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} /> */}
				</div>
			);
		} else {
			return (
				<div className="nc-bill-card" id="scm-pu-planconfirm-card" style={{ position: 'relative' }}>
					{socket.connectMesg({
						headBtnAreaCode: AREA.head, // 表头按钮区域ID
						formAreaCode: AREA.head, // 表头Form区域ID
						billtype: '2C',
						billpkname: FIELD.hid,
						dataSource: CONSTFIELD.dataSource
					})}
					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									<span>
										{createCardTitle(this, {
											billCode: this.billcode, //单据号
											backBtnClick: btnClickController.bind(this, this.props, BTNID.Back) // 返回按钮事件
										})}
									</span>
								</div>
								<div className="header-button-area">
									{this.props.button.createErrorFlag({
										headBtnAreaCode: AREA.head
									})}

									{this.props.button.createButtonApp({
										//表头按钮区
										area: AREA.cardHeadBtnArea,
										onButtonClick: btnClickController.bind(this)
									})}
									<BillTrack
										show={this.state.showTrack}
										close={() => {
											this.setState({ showTrack: false });
										}}
										pk={this.state.pk_planconfirm}
										type="2C"
									/>
								</div>
								{this.props.getUrlParam(OHTER.status) == UISTATE.browse &&
								this.state.cardPaginationShow &&
								this.props.getUrlParam(OHTER.scene) != OHTER.approve ? (
									<div className="header-cardPagination-area" style={{ float: 'right' }}>
										{createCardPagination({
											handlePageInfoChange: queryCardBtnClick.bind(this),
											dataSource: CONSTFIELD.dataSource
										})}
									</div>
								) : (
									''
								)}
							</NCDiv>
						</NCAffix>

						{/* 表单 */}
						<div className="nc-bill-form-area">
							{createForm(AREA.head, {
								onAfterEvent: afterEvents.bind(this),
								onBeforeEvent: beforeEvent.bind(this)
							})}
						</div>
					</div>
					{/* 表格 */}
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area	scm-pu-extent-btn">
							{createCardTable(AREA.body, {
								onBeforeEvent: beforeEvent.bind(this),
								hideModelSave: true,
								showCheck: true,
								onSelected: metarialSelected.bind(this.props),
								onSelectedAll: metarialSelected.bind(this.props),
								adaptionHeight: true, //卡片高度自适应适配
								tableHead: this.getTableHead.bind(this, buttons),
								onAfterEvent: afterEvents.bind(this),
								onBatchChange: batchEvents.bind(this),
								hideAdd: false
							})}
						</div>
					</div>
					{/* 审批详情 */}
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.vtrantypecode}
						billid={this.state.pk}
					/>
					{/* 附件管理 */}
					<div>
						{showUploader && (
							<NCUploader
								// billId={this.state.pk_invoice}
								billId={this.state.pk_planconfirm}
								billcode={this.state.pk_planconfirm}
								pk_billtypecode={'2C'}
								// billNo={this.state.billcode}
								// target={target}
								placement={''}
								onHide={this.onHideUploader}
							/>
						)}
					</div>
					{/* 打印次数查询添加的模态框 */}
					{createModal('code-config')}
					{/* 打印次数控制引入的组件 */}
					{createModal('printService', {
						className: 'print-service'
					})}
					{/* <iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} /> */}
				</div>
			);
		}
	}
}

PlanConfirmCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.card,
		headcode: AREA.head,
		bodycode: {
			[AREA.body]: 'cardTable'
		}
	},
	orderOfHotKey: [ AREA.head, AREA.body ]
})(PlanConfirmCard);
