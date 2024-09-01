/*
 * @Author: jiangfw
 * @PageInfo: 采购发票卡片界面
 * @Date: 2018-04-25 20:36:25
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-06-02 20:32:01
 */
import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
const { BillTrack, DagreChart } = high;
import { initTemplate } from './init';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import { AREA, UISTATE, FIELD, PAGECODE, COMMON, MODAL_ID } from '../constance';
import { afterEvent } from './afterEvents';
import { dateFormat } from '../../../public/dateformat';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';
import pageInfoClick from './btnClicks/pageInfoClick';
import beforeEvent from './beforeEvents';
import clickBackBtn from './btnClicks/backBtnClick';
const { NCAffix, NCDiv } = base;
import './index.less';
import { changeUrlParam } from '../../../../scmpub/scmpub/pub/cache';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import MergePrinting from 'scmpub/scmpub/components/MergePrinting';
import commitBtnClick from './btnClicks/commitBtnClick';
import saveCommitBtnClick from './btnClicks/saveCommitBtnClick';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { btnClickController, btnController } from './viewControl';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
import InvoiceUploader from 'sscivm/ivmpub/components/invoice-uploader';
import { batchEvents } from './batchEvents';
import { TempDataList } from '../../../../scmpub/scmpub/components/TempSave';
import temporaryClick from './btnClicks/temporaryClick';
let dataSource = COMMON.PuinvoiceCacheKey;
let refDataSource = COMMON.TransferCacheKey;

class PuInvoiceCard extends Component {
	constructor(props) {
		super(props);
		this.formId = AREA.card_head;
		this.tableId = AREA.card_body;
		this.pageId = PAGECODE.invoiceCard;
		props.use.form(this.formId);
		props.use.cardTable(this.tableId);
		this.ts = '';
		this.curindex = 0;
		this.combineData; //合并显示数据
		this.PU_INVOICE_TYPE; //采购发票小应用参数
		this.scene; //应用场景
		this.type; //转单类型
		this.transType; //交易类型发布的小应用才有
		this.meta;
		this.templetid_25;
		this.pk_invoice;
		this.indexstatus = {};
		this.skipCodes = [];
		this.billTypeIndex; //转单编辑界面发票来源单据类型数据字典
		this.dagreData = ''; //联查费用发票数据
		this.showLinkFee = false; //显示联查费用发票标志
		this.refsourcdata = ''; //拉单来源数据暂存

		this.state = {
			// billTypeIndex: null, //转单编辑界面发票来源单据类型数据字典
			// listdata: '', //转单后编辑数据缓存
			pk_org: '',
			invoiceUIstate: '', //发票界面类型枚举
			showTrack: false, //单据追溯展示标志
			showApproveInfo: false, //审批详情展示标志
			showUploader: false, //附件管理展示标志
			pk_invoice: '',
			freezeReason: '', //冻结原因
			msgContent: '', //消息
			//提交即指派参数
			compositedisplay: false,
			saveAndCommit: false,
			compositedata: null,
			showConditionModal: false, // 合并显示
			dagreData: '', //联查费用发票数据
			showLinkFee: false, //显示联查费用发票标志
			qTempletid_50: '', //消耗汇总拉单查询模板
			billtype: '', //交易类型
			sscivmInvoiceData: {},
			tempDataList: [], // 暂存数据
			showTemp: false
		};

		initLang(this, [ '4004puinvoice', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		//定义日期格式化工具
		dateFormat();
		// 组件卸载时移除事件监听, 防止内存泄漏
		window.addEventListener('beforeunload', this.onMove);
	}

	componentWillUnmount() {
		// 组件卸载时移除事件监听, 防止内存泄漏
		window.removeEventListener('beforeunload', this.onMove);
	}

	onMove = (event) => {
		let status = this.props.cardTable.getStatus(this.tableId);
		if (status != 'browse' && status != undefined) {
			event.returnValue = getLangByResId(this, '4004PUINVOICE-000025'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
		}
	};

	componentDidMount() {}

	// 获取卡片表体肩部按钮
	getBodyBtns = () => {
		return (
			<div className="table-head-btns">
				{this.props.button.createButtonApp({
					area: AREA.card_body,
					ignoreHotkeyCode: getCardDisableHotKeyBtn(),
					onButtonClick: btnClickController.bind(this)
				})}
			</div>
		);
	};

	//关闭审批详情
	closeApprove = () => {
		this.setState({
			showApproveInfo: false
		});
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
			let pk_invoice = record.head.card_head.rows[0].values.pk_invoice.value;
			changeUrlParam(this.props, { id: pk_invoice, status: UISTATE.browse });
		} else {
			changeUrlParam(this.props, { status: UISTATE.edit });
		}
		this.props.form.setAllFormValue({ [AREA.card_head]: record.head[AREA.card_head] });
		setTimeout(() => {
			this.props.cardTable.setTableData(AREA.card_body, record.body[AREA.card_body]);
		}, 0);
		this.props.form.setFormStatus(AREA.card_head, uistatus);
		this.props.cardTable.setStatus(AREA.card_body, uistatus);

		let billcode = record.head.card_head.rows[0].values.vbillcode.value;
		this.setBillHeadInfo(billcode);

		btnController.call(this, uistatus);
	};

	getAssginUsedr = (assign) => {
		if (this.state.saveAndCommit == true) {
			saveCommitBtnClick.call(this, this.skipCodes, assign);
		} else {
			commitBtnClick.call(this, this.skipCodes, assign);
		}

		this.setState({ compositedisplay: false, saveAndCommit: false });
	};

	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	setBtnVisible = () => {
		btnController.call(this);
	};

	dagreSelected = (pk, billtype) => {
		this.props.openTo(null, { billtype: billtype, id: pk, sence: 4, status: 'browse' });
	};

	setBillHeadInfo = (billCode) => {
		let status = this.props.getUrlParam('status');
		//转单标识
		let type = this.props.getUrlParam('type');
		//转单页面进入
		if (status == UISTATE.browse) {
			if (type) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billCode //单据号
				});
			} else {
				if (this.PU_INVOICE_TYPE) {
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
						billCode: billCode //单据号
					});
				} else {
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
						billCode: billCode //单据号
					});
				}
			}
		} else {
			if (type) {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billCode //单据号
				});
			} else {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
					billCode: billCode //单据号
				});
			}
		}
	};

	/**
    * 格式化单据追溯渲染的数据
    */
	dataFormat = (data) => {
		return data.map((item) => {
			let {
				billID,
				billCode = '',
				type,
				billTypeName = '',
				transTypeName,
				isShowTranstypeName = false,
				isForward,
				label,
				transtype
			} = item;
			let sourceList = item.source;
			let forwardList = item.target;
			let data = this.suitableLableText(billTypeName, billCode, transTypeName, isShowTranstypeName);
			if (typeof isShowTranstypeName === 'string') {
				isShowTranstypeName = isShowTranstypeName === 'Y';
			}
			return {
				title: data.title,
				label: getLangByResId(this, '4004PUINVOICE-000088'), //单据编号
				billno: data.billno,
				tooltipLabel: getLangByResId(this, '4004PUINVOICE-000094'), //单据名称
				id: billID,
				type: type,
				isOrigin: this.pk_invoice === billID,
				transtype,
				source: sourceList || [],
				target: forwardList || [],
				isForward,
				billCode: billCode, // NCC-194515，和单据追溯做成一样的，单据号太长显示...，悬浮显示全部单据号
				billTypeName: data.title,
				isShowTranstypeName,
				transTypeName
			};
		});
	};

	/**
     * 单据追溯图的节点显示的单据名称和单据编号超的长度过长处理：
     * 	a单据标题极值10个字符，超出...。
            b单据编号极值16个字符，超出折行，超过两行...
            c存在...隐藏更多信息，鼠标移入展示全部内容，移出气泡范围隐藏。
            d长 宽 高固定，宽136px，高50px。标题字号13，编码字号12。元素样式美化
     */
	suitableLableText = (billTypeName, billCode, transTypeName, isShowTranstypeName) => {
		// let halfCode1, halfCode2, newHalfCode2, billCodeText, billTypeNameText, transTypeNameText;
		let billCodeText, billTypeNameText, transTypeNameText;
		// if (billCode.length > 19) {
		// 	//单据编号超过一行
		// 	halfCode1 = billCode.slice(0, 20);
		// 	halfCode2 = billCode.slice(20, billCode.length);
		// 	newHalfCode2;
		// 	let halfCode2Len = halfCode2.length;
		// 	if (halfCode2Len > 20) {
		// 		//据编号超过两行
		// 		newHalfCode2 = halfCode2.slice(0, 19) + '...';
		// 	}
		// } else {
		// 	//单据编号没有超过一行
		// 	halfCode1 = billCode;
		// }
		// NCC-194515，和单据追溯做成一样的，单据号太长显示...，悬浮显示全部单据号
		billCodeText = billCode;
		if (billCode.length > 20) {
			billCodeText = billCode.slice(0, 19) + '...';
		}
		// billCodeText = `${halfCode1}\n${newHalfCode2 || halfCode2 || ''}`;
		if (isShowTranstypeName === 'Y' && transTypeName) {
			if (transTypeName.length > 10) {
				//单据标题极值10个字符，超出..
				transTypeNameText = transTypeName.slice(0, 10) + '...';
			}
			return {
				title: transTypeNameText || transTypeName,
				billno: billCodeText
			};
		} else {
			if (billTypeName.length > 10) {
				//单据标题极值10个字符，超出..
				billTypeNameText = billTypeName.slice(0, 10) + '...';
			}
			return {
				title: billTypeNameText || billTypeName,
				billno: billCodeText
			};
		}
	};

	/**
	 * 发票冻结弹出框
	 */
	createFreeModal = (createModal) => {
		return createModal(MODAL_ID.freezeModal);
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
					pagecode: PAGECODE.invoiceCard,
					type: 'card',
					processorstr: 'nccloud.web.pu.puinvoice.action.PuinvoiceTempSaveProcessor'
				}}
				addTemporary={this.state.tempDataList}
				close={() => {
					this.setState({ showTemp: false });
				}}
				clickTemporary={temporaryClick.bind(this)}
			/>
		) : (
			''
		);
	};

	render() {
		let { cardTable, form, transferTable, modal, cardPagination } = this.props;
		let { createCardTable } = cardTable;
		const { createForm } = form;
		const { createCardPagination } = cardPagination;
		const { createModal } = modal;
		const { socket } = this.props;
		let type = this.props.getUrlParam('type');
		let channelType = this.props.getUrlParam('channelType');
		this.type = type;
		const { createTransferList } = transferTable;
		let { showUploader, showLinkFee } = this.state;
		const MergePrintingProps = {
			jsonData: this.combineData,
			toggleConditionModal: () => {
				this.setState({ showConditionModal: !this.state.showConditionModal });
			},
			showConditionModal: this.state.showConditionModal
		};

		this.props.controlAutoFocus(true);

		if (type || channelType) {
			return (
				<div id="transferCard" className="nc-bill-transferList">
					{this.createConnectMesg(socket)}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: this.billCode, //单据号
									backBtnClick: clickBackBtn.bind(this)
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: AREA.card_head
								})}
								{this.props.button.createButtonApp({
									area: AREA.card_head,
									onButtonClick: btnClickController.bind(this)
								})}
								{/* 单据追溯 */}
								<BillTrack
									show={this.state.showTrack}
									close={() => {
										this.setState({ showTrack: false });
									}}
									pk={this.state.pk_invoice}
									type="25"
								/>
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{createTransferList({
							dataSource: refDataSource,
							headcode: AREA.card_head, //表格组件id
							bodycode: AREA.card_body, // 表体的区域编码
							transferListId: AREA.card_left, //转单列表id
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
									[AREA.card_head]: record.head[AREA.card_head]
								});
								// setTimeout(() => {
								this.props.cardTable.setTableData(AREA.card_body, record.body[AREA.card_body]);
								// }, 10);
								// this.props.form.setFormStatus(AREA.card_head, uistatus);
								// this.props.cardTable.setStatus(AREA.card_body, uistatus);
								// 设置主组织不可编辑
								this.props.form.setFormItemsDisabled(this.formId, { [FIELD.pk_org_v]: true });

								let billcode = record.head.card_head.rows[0].values.vbillcode.value;
								this.setBillHeadInfo(billcode);
								let pk_invoice = record.head.card_head.rows[0].values.pk_invoice.value;
								changeUrlParam(this.props, { id: pk_invoice, status: uistatus });

								btnController.call(this, uistatus);
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
						<div className="nc-bill-card transferList-content-right" id="scm-pu-puinvoice-card">
							{/* 表头 */}
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this)
								})}
							</div>
							{/* 表体 */}
							<div className="nc-bill-table-area">
								{/* 表体肩部按钮 */}
								{/* {this.getBodyBtns()} */}
								{createCardTable(this.tableId, {
									//显示序号
									// showIndex: true,
									showCheck: true,
									tableHead: this.getBodyBtns.bind(),
									onSelected: () => this.setBtnVisible(),
									onSelectedAll: () => this.setBtnVisible(),
									onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this),
									onBatchChange: batchEvents.bind(this),
									hideModelSave: true,
									modelAddRow: () => {
										RownoUtils.setRowNo(this.props, this.tableId, FIELD.crowno);
									},
									adaptionHeight: true
								})}
							</div>
							{/* 合并显示 */}
							{/* {this.combineData && <MergePrinting {...MergePrintingProps} />} */}
							{createModal(MODAL_ID.MessageDlg, {
								size: 'xlg',
								content: this.state.msgContent
							})}
							{/* 参照增行 模态框 */}
							{/* <div> */}
							{createModal(MODAL_ID.RefAddRowModal, {
								size: 'xlg',
								zIndex: 212,
								title: getLangByResId(this, '4004PUINVOICE-000027') /* 国际化处理： 参照增行*/,
								className: 'ref-addline-modal'
							})}
							{/* </div> */}
						</div>
					</div>
					{/* 提交即指派 */}
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004PUINVOICE-000028')} /* 国际化处理： 指派*/
							data={this.state.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getAssginUsedr}
							cancel={() => {
								this.setState({ compositedisplay: false });
							}}
						/>
					)}
					{/* 合并显示 */}
					{this.combineData && <MergePrinting {...MergePrintingProps} />}
					{/* 审批详情 */}
					<div>
						<ApproveDetail
							show={this.state.showApproveInfo}
							close={this.closeApprove}
							billtype={this.state.billtype}
							// billid={this.state.pk_invoice}
							billid={this.pk_invoice}
						/>
					</div>

					{/* 附件管理 */}
					<div>
						{showUploader && (
							<NCUploader
								// billId={this.state.pk_invoice}
								billId={this.pk_invoice}
								billcode={this.pk_invoice}
								pk_billtypecode={'25'}
								// billNo={this.state.billcode}
								// target={target}
								placement={''}
								onHide={this.onHideUploader}
							/>
						)}
					</div>
					{/* 冻结 */}
					{this.createFreeModal(createModal)}
					{/* 联查费用发票 */}
					{showLinkFee && (
						<div
							className={`bill-track-max bill-track-invoice ${showLinkFee
								? 'show-bill-track'
								: 'hide-bill-track'}`}
							style={{ height: showLinkFee ? '450px' : '0' }}
						>
							<div className="title">
								<span className="name">{getLangByResId(this, '4004PUINVOICE-000031')}</span>
								{/* 国际化处理：联查费用发票*/}
								<span
									className="close-icon iconfont icon icon-guanbi"
									onClick={() => {
										this.props.close && this.props.close();
										this.setState({
											showLinkFee: false
										});
										// this.showLinkFee = false;
									}}
								/>
							</div>
							{this.state.dagreData ? (
								<DagreChart
									selectedId={this.pk_invoice}
									onSelect={this.dagreSelected}
									list={this.dataFormat(this.state.dagreData || [])}
									showMax={true}
								/>
							) : (
								''
							)}
						</div>
					)}
					{this.state.sscivmInvoiceData &&
					Object.keys(this.state.sscivmInvoiceData) && (
						<div>
							<InvoiceLink {...this.state.sscivmInvoiceData} table={this.props.table} />
						</div>
					)}
					{/* 电子发票 */}
					<InvoiceUploader {...this.state.sscivmInvoiceData} />
					{createModal('code-config')}
					{createModal('printService', {
						className: 'print-service'
					})}
					<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
				</div>
			);
		} else {
			return (
				<div className="nc-bill-card" id="scm-pu-puinvoice-card">
					{this.createConnectMesg(socket)}
					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									{createCardTitle(this, {
										billCode: this.billCode, //单据号
										backBtnClick: clickBackBtn.bind(this)
									})}
								</div>
								<div className="header-button-area">
									{this.props.button.createErrorFlag({
										headBtnAreaCode: AREA.card_head
									})}

									{this.props.button.createButtonApp({
										area: AREA.card_head,
										onButtonClick: btnClickController.bind(this)
									})}
									{/* 单据追溯 */}
									<BillTrack
										show={this.state.showTrack}
										close={() => {
											this.setState({ showTrack: false });
										}}
										pk={this.state.pk_invoice}
										type="25"
									/>
								</div>
								{/* 上一页/下一页 */}
								<div className="header-cardPagination-area" style={{ float: 'right' }}>
									{createCardPagination({
										handlePageInfoChange: pageInfoClick.bind(this),
										dataSource: dataSource
									})}
								</div>
							</NCDiv>
						</NCAffix>
						{/* 表头 */}
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this)
							})}
							{this.creatTempDataList()}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						{/* 表体 */}
						<div className="nc-bill-table-area">
							{/* 表体肩部按钮 */}
							{/* {this.getBodyBtns()} */}
							{createCardTable(this.tableId, {
								//显示序号
								//showIndex: true,
								showCheck: true,
								tableHead: this.getBodyBtns.bind(),
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this),
								onBatchChange: batchEvents.bind(this),
								onSelected: () => this.setBtnVisible(),
								onSelectedAll: () => this.setBtnVisible(),
								hideModelSave: true,
								modelAddRow: () => {
									RownoUtils.setRowNo(this.props, this.tableId, FIELD.crowno);
								},
								adaptionHeight: true
							})}
						</div>
					</div>
					{/* 审批详情 */}
					<div>
						<ApproveDetail
							show={this.state.showApproveInfo}
							close={this.closeApprove}
							billtype={this.state.billtype}
							billid={this.pk_invoice}
						/>
					</div>

					{/* 附件管理 */}
					<div>
						{showUploader && (
							<NCUploader
								// billId={this.state.pk_invoice}
								billId={this.pk_invoice}
								billcode={this.pk_invoice}
								pk_billtypecode={'25'}
								// target={target}
								placement={''}
								onHide={this.onHideUploader}
							/>
						)}
					</div>
					{/* 参照增行 模态框 */}
					{/* <div> */}
					{createModal(MODAL_ID.RefAddRowModal, {
						size: 'xlg',
						zIndex: 212,
						title: getLangByResId(this, '4004PUINVOICE-000027') /* 国际化处理： 参照增行*/,
						className: 'ref-addline-modal'
					})}
					{/* </div> */}
					{createModal(MODAL_ID.MessageDlg, {
						size: 'xlg',
						content: this.state.msgContent
					})}
					{/* 冻结 */}
					{this.createFreeModal(createModal)}
					{/* 合并显示 */}
					{this.combineData && <MergePrinting {...MergePrintingProps} />}
					{/* 组织切换模态框 */}
					{/* {createModal(MODAL_ID.orgChange)} */}
					{this.state.sscivmInvoiceData &&
					Object.keys(this.state.sscivmInvoiceData) && (
						<div>
							<InvoiceLink {...this.state.sscivmInvoiceData} table={this.props.table} />
						</div>
					)}
					{/* 提交即指派 */}
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004PUINVOICE-000028')} /* 国际化处理： 指派*/
							data={this.state.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getAssginUsedr}
							cancel={() => {
								this.setState({ compositedisplay: false });
							}}
						/>
					)}
					{/* 联查费用发票 */}
					{showLinkFee && (
						<div
							className={`bill-track-max bill-track-invoice ${showLinkFee
								? 'show-bill-track'
								: 'hide-bill-track'}`}
							// style={{ height: showLinkFee ? '628px' : '0' }}
							style={{ height: showLinkFee ? '450px' : '0' }}
						>
							<div className="title nc-theme-common-font-c">
								<span className="name">{getLangByResId(this, '4004PUINVOICE-000031')}</span>
								{/* 国际化处理：联查费用发票*/}
								<span
									className="close-icon iconfont icon icon-guanbi"
									onClick={() => {
										this.props.close && this.props.close();
										this.setState({
											showLinkFee: false
										});
										// this.showLinkFee = false;
									}}
								/>
							</div>
							{this.state.dagreData ? (
								<DagreChart
									selectedId={this.pk_invoice}
									onSelect={this.dagreSelected}
									list={this.dataFormat(this.state.dagreData || [])}
									showMax={true}
								/>
							) : (
								''
							)}
						</div>
					)}
					{/* 电子发票 */}
					<InvoiceUploader {...this.state.sscivmInvoiceData} />

					{createModal('code-config')}
					{createModal('printService', {
						className: 'print-service'
					})}
					<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
				</div>
			);
		}
	}
	createConnectMesg = (socket) => {
		return (
			<div>
				{socket.connectMesg({
					headBtnAreaCode: AREA.card_head, // 表头按钮区域ID
					formAreaCode: AREA.card_head, // 表头Form区域ID
					billtype: '25',
					billpkname: FIELD.pk_invoice,
					dataSource: COMMON.PuinvoiceCacheKey
				})}
			</div>
		);
	};
}
PuInvoiceCard = createPage({
	//编辑公式
	billinfo: {
		billtype: 'card', //一主多子
		pagecode: PAGECODE.invoiceCard,
		headcode: AREA.card_head,
		bodycode: { [AREA.card_body]: 'cardTable' }
	},
	orderOfHotKey: [ AREA.card_head, AREA.card_body ]
})(PuInvoiceCard);
export default PuInvoiceCard;
