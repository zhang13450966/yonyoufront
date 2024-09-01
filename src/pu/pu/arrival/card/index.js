/*
 * @Author: ligangt
 * @PageInfo: 到货单卡片态
 * @Date: 2018-04-17 15:47:23
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-06-02 17:02:11
 */
import React, { Component } from 'react';
import { createPage, ajax, base, high, toast } from 'nc-lightapp-front';
import { beforeEvent, afterEvent } from './events';
import { batchEvents } from './batchEvents';
import { pageInfoClick, saveAndCommit } from './btnClicks';
import btnClickController from './viewControl/btnClickController';
import { initTemplate } from './init';
const { NCDiv, NCModal, NCButton, NCSelect, NCFormControl, NCAffix, NCTooltip, NCHotKeys } = base;
const { BillTrack } = high;
import NCUploader from 'uap/common/components/NCUploader';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import { showWarningDialog } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import MergePrinting from 'scmpub/scmpub/components/MergePrinting';
import SplitPrintDlg from 'scmpub/scmpub/components/SplitPrinting';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { rewriteTransferSrcBids, getDefData, updateCacheData } from '../../../../scmpub/scmpub/pub/cache';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { showSagaErrorToasts } from '../../pub/utils/sagaMsgUtils';
import { URL, AREA, COMMON, PAGECODE, TRANSFER, BUTTONAREA, ALLBUTTONS, FREEBUTTONS, FIELD } from '../constance';
import StockQuery from '../../pub/stockQuery';
import { addCacheData } from '../../../../scmpub/scmpub/pub/cache';
import { changeUrlParam } from '../../../../scmpub/scmpub/pub/cache';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import commit from './btnClicks/commit';
import buttonController from './viewControl/buttonController';
import { showErrorInfo } from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import SetPiece from '../../pub/setPiece';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
class ArrivalCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.head);
		props.use.cardTable(AREA.body);
		this.state = {
			msgContent: '',
			vbillcode: '',
			billstatus: 0,
			index: 0,
			showTrack: false,
			pk: '',
			target: null,
			showUploader: false,
			showApproveInfo: false,
			curdata: null,
			billtype: '23',
			compositedisplay: false, //指派参数
			compositedata: null, //指派
			isCopyLine: null,
			showModal: false,
			vordercode: null,
			isbrowsebeforesave: 'Y',
			// isShowBack: null,
			jsonData: null,
			showConditionModal: false,
			showSpilt: false,
			splitData: {},
			showSetPiece: false, //是否显示成套件
			setPieceData: null, //成套件数据
			showStockQuery: false, //存量查询是否显示
			stockquerydata: null, //存量查询参数
			saveAndCommit: false //是否保存提交
		};
		this.commitInfo = {
			index: null,
			record: null
		};
		(this.orderbids = null), (this.formId = AREA.head);
		this.moduleId = COMMON.moudleid;
		this.tableId = AREA.body;
		this.isrece;
		this.isapprove;
		this.meta;
		this.srcappcode;
		this.indexstatus = {};
		this.templateid;
		this.skipCodes = []; //交互式异常码
		this.manyTrans = true; // 是不是多单转单的标志，多单的时候删除需要控制一下按钮状态
		initLang(this, [ '4004arrival' ], 'pu', initTemplate.bind(this, this.getData));
	}

	close = () => {
		this.setState({ showModal: false });
	};

	open = () => {
		this.setState({ showModal: true });
	};
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(AREA.body);
			if (status == 'edit') {
				return getLangByResId(this, '4004ARRIVAL-000024'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	componentDidMount() {
		// initTemplate.call(this, this.getData);
	}

	getData = () => {
		let type = this.props.getUrlParam('type');

		if (type) {
			let transferIds = this.props.transferTable.getTransferTableSelectedId(AREA.head);
			if (type == 'quickArr') {
				let code = this.props.getUrlParam('vordercode');
				// this.setState({ vordercode: code });
				this.getTransferValueByordercode(code);
			} else {
				this.getTransferValue(transferIds);
			}
			this.props.cardTable.setStatus(AREA.body, 'edit');
			this.props.form.setFormStatus(AREA.head, 'edit');
		} else {
			//查询单据详情
			if (this.props.getUrlParam('status') != 'add') {
				let data = { id: this.props.getUrlParam('id'), pageid: PAGECODE.card, templateid: this.templateid };
				let url = URL.queryCard;
				//基于原到货单退货
				if (
					this.props.getUrlParam('status') == 'return23' ||
					'returnArrival' == this.props.getUrlParam('status')
				) {
					url = URL.return23;
				}
				ajax({
					url: url,
					data: data,
					success: (res) => {
						this.props.beforeUpdatePage();
						if (res && res.data && res.data.head) {
							let vbillcode = res.data.head[this.formId].rows[0].values.vbillcode.value;

							this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
							// let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
							// this.setState({ billstatus: billstatus }, () => {
							// 	this.toggleShow(billstatus);
							// });

							this.setState({ vbillcode: vbillcode });
							this.props.BillHeadInfo.setBillHeadInfoVisible({
								billCode: vbillcode
							});

							updateCacheData(
								this.props,
								'pk_arriveorder',
								res.data.head[this.formId].rows[0].values.pk_arriveorder.value,
								res.data,
								this.formId,
								COMMON.arrivalCacheKey
							);
						}
						if (res && res.data && res.data.body) {
							this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
							// let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
							// this.toggleShow(billstatus);
						}
						buttonController.call(this);
						this.select();
						this.props.updatePage(AREA.form, AREA.body);
						//跳转卡片弹出提示框
						showSagaErrorToasts(this.props, AREA.form, FIELD.pk_arriveorder);
						// if (
						// 	this.props.getUrlParam('status') == 'return23' ||
						// 	this.props.getUrlParam('status') == 'returnArrival'
						// ) {
						// 	this.props.form.setFormStatus(AREA.head, 'edit');
						// 	this.props.cardTable.setStatus(AREA.body, 'edit');
						// 	// setTimeout(() => {
						// 	// }, 10);
						// 	this.props.button.setButtonVisible(ALLBUTTONS, false);
						// 	this.props.button.setButtonVisible(EDITBUTTONS, true);
						// 	this.props.button.setButtonVisible(
						// 		[
						// 			'PaseToThis', //粘贴至此
						// 			'PastToLast', //粘贴至末行
						// 			'CancelPast' //取消(复制)
						// 		],
						// 		false
						// 	);
						// 	this.props.button.setButtonDisabled([ 'ResetRowno' ], false);
						// 	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
						// 	this.props.button.setButtonVisible('Return', false);
						// this.setState({ isShowBack: false });
						// let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
						// this.toggleShow(billstatus);
						//设置退货理由的编辑性
						// this.props.form.setFormItemsDisabled(AREA.form,{''})
						// }
					},
					error: (res) => {
						buttonController.call(this);
						this.select();
						showErrorInfo(null, res.message);
					}
				});
			}
		}
	};

	getTransferValueByordercode = (code) => {
		if (!code) {
			return;
		}
		let data = {
			vordercode: code
		};
		ajax({
			method: 'POST',
			url: URL.quickArrQuery,
			data: data,
			success: (res) => {
				if (res && res.data) {
					this.props.transferTable.setTransferListValue(AREA.leftarea, res.data);
					this.props.form.setFormStatus(AREA.head, 'edit');
					this.props.cardTable.setStatus(AREA.body, 'edit');

					this.setState({ curdata: res.data, vbillcode: '' });
				}
			}
		});
	};

	getTransferValue = (ids) => {
		if (!ids) {
			return;
		}
		this.isrece = this.props.getUrlParam('isreceive');
		let type = this.props.getUrlParam('type');
		let transferoid = this.props.getUrlParam('transferoid');
		const oid = {
			arrivaltransfer21: TRANSFER.oid,
			arrivaltransfer61: TRANSFER.subcontoid,
			arrivalreturn21: TRANSFER.oid,
			arrivalreturn61: TRANSFER.subcontoid
		};
		const url = {
			arrivaltransfer21: URL.transferOrder,
			arrivaltransfer61: URL.transferSubcont,
			arrivalreturn21: URL.transferReturnOrder,
			arrivalreturn61: URL.transferReturnSubcont
		};
		let data = {
			data: ids,
			pagecode: PAGECODE.card,
			queryAreaCode: AREA.searchArea,
			oid: transferoid
		};
		let _this = this;
		ajax({
			method: 'POST',
			url: url[type],
			data: data,
			success: (res) => {
				if (res && res.data) {
					this.props.transferTable.setTransferListValue(AREA.leftarea, res.data);
					this.props.form.setFormStatus(AREA.head, 'edit');
					this.props.cardTable.setStatus(AREA.body, 'edit');
					this.setState({ curdata: res.data });
					// transtypeUtils.setValue.call(this, this.props, AREA.searchArea, 'ctrantypeid', 'vtrantypecode');
					let typecode = getDefData(COMMON.arrivalRefBillCachekey, 'cbilltypecode');
					let typdid = getDefData(COMMON.arrivalRefBillCachekey, 'cbilltypeid');
					let typename = getDefData(COMMON.arrivalRefBillCachekey, 'cbilltypename');
					if (typecode && typdid && typename) {
						this.props.form.setFormItemsValue(AREA.form, {
							ctrantypeid: { value: typdid, display: typename },
							vtrantypecode: { value: typecode, display: typecode }
						});
					}
					this.forceUpdate();
				}
			}
		});
	};

	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	// 提交指派
	getAssginUsedr = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.state.saveAndCommit == true) {
			saveAndCommit.call(this, value, this.skipCodes);
		} else if (this.commitInfo.record) {
			commit.call(this, this.props, this.commitInfo.record, this.commitInfo.index, value);
		} else {
			commit.call(this, this.props, null, null, value);
		}
		this.setState({ compositedisplay: false, saveAndCommit: false });
	};

	//删除单据
	delConfirm = () => {
		ajax({
			url: URL.delete,
			data: {
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			},
			success: () => {
				this.props.linkTo('../list');
			}
		});
	};
	closeApprove = () => {
		this.setState({
			showApproveInfo: false
		});
	};

	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: BUTTONAREA.cardbody,
					ignoreHotkeyCode: getCardDisableHotKeyBtn(),
					onButtonClick: btnClickController.bind(this)
				})}
			</div>
		);
	};

	handleClick() {
		this.props.pushTo('/list', { pagecode: PAGECODE.head });
	}

	back() {
		let type = this.props.getUrlParam('type');
		let url = '/ref21';
		let pagecode = PAGECODE.transferOrder;
		if (type == 'arrivaltransfer61') {
			url = '/ref61';
			pagecode = PAGECODE.transferSubcont;
		} else if (type == 'arrivalreturn21') {
			url = '/return21';
			pagecode = PAGECODE.returnOrder;
		} else if (type == 'arrivalreturn61') {
			url = '/return61';
			pagecode = PAGECODE.returnSubcont;
		} else if (type == 'quickArr') {
			url = '/list';
			pagecode = PAGECODE.head;
		}

		let allprocess = this.props.transferTable.getTransformFormStatus(AREA.leftarea);
		if (allprocess === false) {
			showWarningDialog(getLangByResId(this, '4004ARRIVAL-000022'), getLangByResId(this, '4004ARRIVAL-000023'), {
				/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
				beSureBtnClick: () => {
					this.props.cardTable.setStatus(AREA.body, 'browse');
					if (this.srcappcode) {
						this.props.pushTo(url, { appcode: this.srcappcode, pagecode: pagecode });
					} else {
						this.props.pushTo(url, { pagecode: pagecode });
					}
				}
			});
		} else {
			this.props.pushTo(url, { pagecode: pagecode });
		}
	}

	sure = () => {
		let data = {
			vordercode: this.state.vordercode,
			isbrowsebeforesave: this.state.isbrowsebeforesave
		};

		if (!this.state.vordercode) {
			toast({
				content: getLangByResId(this, '4004ARRIVAL-000025'),
				color: 'warning'
			}); /* 国际化处理： 订单号未录入!*/
			return;
		}

		if (this.state.isbrowsebeforesave == 'Y') {
			// this.props.pushTo(URL.card, { type: 'quickArr' });
			this.setState({ showModal: false });
			let _this = this;
			ajax({
				method: 'post',
				url: URL.quickArr,
				data: data,
				success: function(res) {
					_this.props.setUrlParam({ type: 'quickArr' });
					initTemplate.call(_this);
					_this.getTransferValueByordercode(_this.state.vordercode);
				}
			});
		} else {
			this.setState({ showModal: false });
			let __this = this;
			ajax({
				method: 'post',
				url: URL.quickArr,
				data: data,
				success: function(res) {
					if (res && res.data && res.data[0].head) {
						let vbillcode = res.data[0].head[AREA.form].rows[0].values.vbillcode.value;

						__this.props.form.setAllFormValue({ [AREA.form]: res.data[0].head[AREA.form] });
						let billstatus = __this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
						// __this.setState({ billstatus: billstatus }, () => {
						// 	__this.toggleShow(billstatus);
						// });

						__this.setState({ vbillcode: vbillcode });
						__this.props.BillHeadInfo.setBillHeadInfoVisible({
							billCode: vbillcode
						});
						for (let i = 0; i < res.data.length; i++) {
							let arriveid = res.data[i].head[AREA.head].rows[0].values.pk_arriveorder.value;
							addCacheData(
								__this.props,
								'pk_arriveorder',
								arriveid,
								res.data[i],
								AREA.head,
								COMMON.arrivalCacheKey
							);
							changeUrlParam(__this.props, { id: arriveid, status: 'browse' });
						}
					}
					if (res && res.data && res.data[0].body) {
						__this.props.cardTable.setTableData(AREA.body, res.data[0].body[AREA.body]);

						// let billstatus = __this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
						// __this.toggleShow(billstatus);
					}
					buttonController.call(this);
					toast({
						content: getLangByResId(__this, '4004ARRIVAL-000026'),
						color: 'success'
					}); /* 国际化处理： 快速收货成功*/
				}
			});
		}
	};

	onChange = (e) => {
		this.setState({ vordercode: e });
	};

	handleChange = (e) => {
		this.setState({ isbrowsebeforesave: e });
	};

	select = () => {
		let selectedRow = this.props.cardTable.getCheckedRows(AREA.body);
		if (selectedRow && selectedRow.length > 0) {
			this.props.button.setButtonDisabled([ 'CopyLines', 'DeleteLine' ], false);
			this.props.button.setButtonDisabled(
				[
					'Check',
					'GenAssertCard',
					'DelAssertCard',
					'MaterialAssign',
					'GenTransAssert',
					'DelTransAssert',
					'StockQuery',
					'UrgentLetGo'
				],
				false
			);
		} else {
			this.props.button.setButtonDisabled([ 'CopyLines', 'DeleteLine' ], true);
			this.props.button.setButtonDisabled(
				[
					'Check',
					'GenAssertCard',
					'DelAssertCard',
					'MaterialAssign',
					'GenTransAssert',
					'DelTransAssert',
					'StockQuery',
					'UrgentLetGo'
				],
				true
			);
		}
	};

	hideModal = () => {
		this.setState({ showSetPiece: false });
	};

	render() {
		let { form, cardTable, button, transferTable, modal, cardPagination } = this.props;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createModal } = modal;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let type = this.props.getUrlParam('type');
		const { createCardPagination } = cardPagination;
		const NCOption = NCSelect.NCOption;
		let refdatasource = this.props.getUrlParam('type') + 'DataSource';
		const { createTransferList } = transferTable;
		const { socket } = this.props;
		const MergePrintingProps = {
			jsonData: this.state.jsonData,
			toggleConditionModal: () => {
				this.setState({ showConditionModal: !this.state.showConditionModal });
			},
			showConditionModal: this.state.showConditionModal
		};

		this.props.controlAutoFocus(true);
		if (type) {
			return (
				<div id="transferCard" className="nc-bill-transferList">
					{this.createConnectMesg(socket)}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							{/* <NCBackBtn onClick={this.back.bind(this)} /> */}
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: '', //单据号
									backBtnClick: this.back.bind(this)
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: BUTTONAREA.cardhead
								})}
								{this.props.button.createButtonApp({
									area: BUTTONAREA.cardhead,
									onButtonClick: btnClickController.bind(this)
								})}
								<BillTrack
									show={this.state.showTrack}
									close={() => {
										this.setState({
											showTrack: false
										});
									}}
									pk={this.state.pk}
									type="23"
								/>
								{this.state.showUploader && (
									<NCUploader
										billId={this.state.pk}
										target={this.state.target}
										onHide={this.onHideUploader}
									/>
								)}

								<ApproveDetail
									show={this.state.showApproveInfo}
									close={this.closeApprove}
									billtype={this.state.billtype}
									billid={this.state.pk}
								/>
								{this.state.compositedisplay && (
									<ApprovalTrans
										title={getLangByResId(this, '4004ARRIVAL-000027')} /* 国际化处理： 指派*/
										data={this.state.compositedata}
										display={this.state.compositedisplay}
										getResult={this.getAssginUsedr.bind(this)}
										cancel={() => {
											this.setState({ compositedisplay: false });
										}}
									/>
								)}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{createTransferList({
							headcode: AREA.head,
							bodycode: AREA.body,
							transferListId: AREA.leftarea, //转单列表id
							dataSource: refdatasource,
							onTransferItemSelected: (record, status, index) => {
								//点击转单缩略图的钩子函数
								this.setState({
									index: index
								});
								let isEdit = status ? 'browse' : 'edit';
								if (this.indexstatus[index]) {
									if (this.indexstatus[index] == 'browse') {
										isEdit = 'browse';
									} else if (this.indexstatus[index] == 'edit') {
										isEdit = 'edit';
									}
								}
								this.indexstatus[index] = isEdit;
								this.props.form.setAllFormValue({ [this.formId]: record.head[this.formId] });
								let billstatus = this.props.form.getFormItemsValue(this.formId, 'fbillstatus').value;
								let vbillcode = this.props.form.getFormItemsValue(this.formId, 'vbillcode').value;
								this.setState({ billstatus: billstatus, vbillcode: vbillcode });
								this.props.cardTable.setTableData(
									this.tableId,
									record.body[this.tableId],
									null,
									true,
									true
								);
								this.props.form.setFormStatus(this.formId, isEdit);
								this.props.cardTable.setStatus(this.tableId, isEdit);
								buttonController.call(this, isEdit);
								this.manyTrans = false;
							}
						})}
						<div className="transferList-content-right nc-bill-card" id="puarrival-card">
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									expandArr: [ PAGECODE.head ],
									onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this)
								})}
							</div>
							<div className="nc-bill-table-area">
								{/* {this.getTableHead()} */}
								{createCardTable(this.tableId, {
									tableHead: this.getTableHead,
									showCheck: true,
									onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this),
									onBatchChange: batchEvents.bind(this),
									hideAdd: true,
									hideDel: false,
									hideModelSave: true,
									adaptionHeight: true,
									onSelected: this.select,
									selectedChange: this.select
								})}
							</div>
							{createModal('delete', {
								title: getLangByResId(this, '4004ARRIVAL-000002') /* 国际化处理： 删除*/,
								content: getLangByResId(this, '4004ARRIVAL-000028') /* 国际化处理： 是否确认删除？*/,
								beSureBtnClick: this.delConfirm
							})}
							{createModal('code-config')}
							{createModal('MessageDlg', {
								size: 'xlg',
								content: this.state.msgContent
							})}
							{/* 合并打印 */}
							{this.state.jsonData && <MergePrinting {...MergePrintingProps} />}
							{/* 分单打印 */}

							{this.state.showSpilt && (
								<SplitPrintDlg
									show={this.state.showSpilt}
									data={this.state.splitData}
									closeDlg={() => {
										this.setState({ showSpilt: false });
									}}
								/>
							)}
							{/* 成套件 2019-04-12*/}
							<SetPiece
								showModal={this.state.showSetPiece}
								setPieceData={this.state.setPieceData}
								onClose={() => {
									this.setState({ showSetPiece: false });
								}}
							/>
							{/* 存量查询 2019-04-22*/}
							<StockQuery
								stockquerydata={this.state.stockquerydata}
								showModal={this.state.showStockQuery}
								onClose={() => {
									this.setState({ showStockQuery: false });
								}}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="nc-bill-card" id="puarrival-card">
					{this.createConnectMesg(socket)}
					<div className="nc-bill-top-area">
						<NCAffix>
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									{createCardTitle(this, {
										billCode: '', //单据号
										backBtnClick: this.handleClick.bind(this)
									})}
								</div>

								<div className="header-button-area">
									{this.props.button.createErrorFlag({
										headBtnAreaCode: BUTTONAREA.cardhead
									})}
									{this.props.button.createButtonApp({
										area: BUTTONAREA.cardhead,
										onButtonClick: btnClickController.bind(this)
									})}
									<BillTrack
										show={this.state.showTrack}
										close={() => {
											this.setState({
												showTrack: false
											});
										}}
										pk={this.state.pk}
										type="23"
									/>
									{this.state.showUploader && (
										<NCUploader
											billId={this.state.pk}
											target={this.state.target}
											onHide={this.onHideUploader}
											billcode={this.state.pk}
											pk_billtypecode="23"
										/>
									)}
									<ApproveDetail
										show={this.state.showApproveInfo}
										close={this.closeApprove}
										billtype={this.state.billtype}
										billid={this.state.pk}
									/>
									{/* 上一页/下一页 */}
									<div className="header-cardPagination-area">
										{createCardPagination({
											handlePageInfoChange: pageInfoClick.bind(this),
											dataSource: COMMON.arrivalCacheKey
										})}
									</div>
									{this.state.jsonData && <MergePrinting {...MergePrintingProps} />}
									{/* 分单打印 */}
									{this.state.showSpilt && (
										<SplitPrintDlg
											show={this.state.showSpilt}
											data={this.state.splitData}
											closeDlg={() => {
												this.setState({ showSpilt: false });
											}}
										/>
									)}
								</div>
							</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								expandArr: [ PAGECODE.head ],
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this)
							})}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						{/* 表体 */}
						<div className="nc-bill-table-area">
							{/* {this.getTableHead()} */}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead,
								showCheck: true,
								onBeforeEvent: beforeEvent.bind(this),
								onAfterEvent: afterEvent.bind(this),
								onBatchChange: batchEvents.bind(this),
								hideAdd: true,
								adaptionHeight: true,
								hideModelSave: true,
								onSelected: this.select,
								selectedChange: this.select
							})}
						</div>
					</div>
					{createModal('delete')}
					{createModal('code-config')}
					{createModal('MessageDlg', {
						size: 'xlg',
						content: this.state.msgContent
					})}

					{/* 快速收货弹窗 */}
					{/* 快速收货弹窗 */}
					<NCModal
						show={this.state.showModal}
						onHide={this.close}
						size="sm"
						fieldid="arrivelistmodal"
						className="quick-receive-modal"
					>
						<NCHotKeys
							keyMap={{
								confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
								cancelBtnHandler: 'ALT+N'
							}}
							handlers={{
								confirmBtnHandler: this.sure,
								cancelBtnHandler: this.close
							}}
							className="simpleModal-hotkeys-wrapper"
							focused={true}
							attach={document.body}
						/>
						<NCModal.Header>
							<NCModal.Title>{getLangByResId(this, '4004ARRIVAL-000030')}</NCModal.Title>
						</NCModal.Header>
						<NCModal.Body>
							<div className="field-item">
								<label className="nc-theme-common-font-c field-label">
									{getLangByResId(this, '4004ARRIVAL-000031')}
								</label>
								<div className="field-content">
									<NCFormControl onChange={this.onChange} value={this.state.vordercode} />
								</div>
							</div>
							<div className="field-item">
								<label className="nc-theme-common-font-c field-label">
									{getLangByResId(this, '4004ARRIVAL-000032')}
								</label>
								<div className="field-content">
									<NCSelect fieldid="arrivalh_select" defaultValue="Y" onChange={this.handleChange}>
										<NCOption value="Y">{getLangByResId(this, '4004ARRIVAL-000033')}</NCOption>
										<NCOption value="N">{getLangByResId(this, '4004ARRIVAL-000034')}</NCOption>
									</NCSelect>
								</div>
							</div>
						</NCModal.Body>
						<NCModal.Footer>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${getLangByResId(this, '4004ARRIVAL-000035')} (Alt+Y)`}
								trigger={[ 'focus', 'hover' ]}
								className="model-helper-overlay"
							>
								<NCButton className="button-primary" onClick={this.sure} fieldid="confirm_btn">
									{getLangByResId(this, '4004ARRIVAL-000035') /* 国际化处理： 确定*/}(<u>Y</u>)
								</NCButton>
							</NCTooltip>
							<NCTooltip
								placement="top"
								inverse
								overlay={`${getLangByResId(this, '4004ARRIVAL-000036')} (Alt+N)`}
								trigger={[ 'focus', 'hover' ]}
								className="model-helper-overlay"
							>
								<NCButton onClick={this.close} fieldid="cancel_btn">
									{getLangByResId(this, '4004ARRIVAL-000036') /* 国际化处理： 取消*/}(<u>N</u>)
								</NCButton>
							</NCTooltip>
						</NCModal.Footer>
					</NCModal>
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004ARRIVAL-000027')} /* 国际化处理： 指派*/
							data={this.state.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getAssginUsedr.bind(this)}
							cancel={() => {
								let arriveid = this.props.form.getFormItemsValue(AREA.form, 'pk_arriveorder').value;
								changeUrlParam(this.props, { id: arriveid, status: 'browse' });
								this.props.form.setFormStatus(AREA.head, 'browse');

								this.props.cardTable.setStatus(AREA.body, 'browse');
								this.props.button.setButtonVisible(ALLBUTTONS, false);
								this.props.button.setButtonVisible(FREEBUTTONS, true);
								this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
								// this.setState({ isShowBack: true });
								let type = this.props.getUrlParam('type');
								if (type) {
									rewriteTransferSrcBids(
										this.props,
										'csourcebid',
										this.props.cardTable.getAllRows(AREA.body).rows
									);
								}
								this.setState({ compositedisplay: false });
							}}
						/>
					)}
					{/* 成套件 2019-04-12*/}
					<SetPiece
						showModal={this.state.showSetPiece}
						setPieceData={this.state.setPieceData}
						onClose={() => {
							this.setState({ showSetPiece: false });
						}}
					/>
					{/* 存量查询 2019-04-22*/}
					<StockQuery
						stockquerydata={this.state.stockquerydata}
						showModal={this.state.showStockQuery}
						onClose={() => {
							this.setState({ showStockQuery: false });
						}}
					/>
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
					headBtnAreaCode: BUTTONAREA.cardhead, // 表头按钮区域ID
					formAreaCode: AREA.head, // 表头Form区域ID
					billtype: '23',
					billpkname: FIELD.pk_arriveorder,
					dataSource: COMMON.arrivalCacheKey
				})}
			</div>
		);
	};
}

ArrivalCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.card,
		headcode: AREA.head,
		bodycode: { [AREA.body]: 'cardTable' }
	},
	orderOfHotKey: [ AREA.head, AREA.body ]
	//mutiLangCode: COMMON.moudleid
})(ArrivalCard);

// ReactDOM.render(<ArrivalCard />, document.querySelector('#app'));
export default ArrivalCard;
