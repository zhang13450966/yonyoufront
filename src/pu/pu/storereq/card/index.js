/*
 * @Author: zhangchangqing
 * @PageInfo: 形态转换，卡片态
 * @Date: 2018-05-04 15:50:44
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-22 13:22:09
 */
import React, { Component } from 'react';
import { createPage, ajax, base, high } from 'nc-lightapp-front';
const { BillTrack } = high;
let { NCAffix } = base;
const { NCDiv } = base;
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import { initTemplate } from './init';
import './index.less';
import { pageInfoClick, getParentURlParme, onHandBtnSelected, saveAndCommit } from './btnClicks';
import { STOREREQ_CARD, STOREREQ_CARD_BUTTON, ATTRCODE, STOREREQ_LIST, ATTRCODES } from '../siconst';
import { afterEvent } from './afterEvents';
import { headBeforeEvents, bodyBeforeEvents } from './beforeEvents';
import ExtendRefer from 'ic/ic/components/onhandRefer'; //引入存量查拣组件
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import MergePrinting from 'scmpub/scmpub/components/MergePrinting';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import commitBtn from './btnClicks/commitBtnClick';
import { setBtnShow } from './btnClicks/pageInfoClick';
import { batchEvents } from './batchEvents';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController, btnClickController } from './viewControl';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import { TempDataList } from '../../../../scmpub/scmpub/components/TempSave';
import temporaryClick from './btnClicks/temporaryClick';
let formId = STOREREQ_CARD.formId; //'head';
let tableId = STOREREQ_CARD.tableId; //'body';
let param = getParentURlParme(STOREREQ_CARD.pageMsgType);

class StorereqCard extends Component {
	constructor(props) {
		super(props);
		this.formId = STOREREQ_CARD.formId;
		this.tableId = STOREREQ_CARD.tableId;
		props.use.form(this.formId);
		props.use.cardTable(this.tableId);
		this.pageId = STOREREQ_CARD.cardpageid; //storereq_card
		this.combineData; //合并显示
		this.PU_STOREREQ_TYPE = 'N'; //判断是否是从新增小应用过来的
		this.meta;
		this.ts = '';
		this.state = {
			returnURL: STOREREQ_LIST.transferUrl, //转单界面返回路径，默认是返回拉单界面
			returnType: STOREREQ_LIST.transfer, //转单界面返回路径，默认是transfer
			copy_billId: '', //卡片页点击新增单据或者复制单据时用来缓存单据号 编辑态取消时使用
			vbillcode: '', //订单编号
			billId: '', //单据id
			billtype: '', //单据交易类型
			compositedisplay: false,
			compositedata: null,
			status: this.props.getUrlParam(STOREREQ_CARD.status),
			showTrack: false,
			lineShowType: [], //通过数组的方式控制 列按钮显示   1-收起   0-展开
			innerBtn: false, //控制行上的按钮显示展开或者关闭
			pk: '',
			headRows: { rows: [] }, //存量查拣 表头数据
			// onhandrefreshFlag: Math.random(), // 存量查拣 随机数，更新标志
			onhandShow: false, // 存量查拣的显示隐藏
			showConditionModal: false, // 合并显示
			refreshFlag: 0,
			templetid: '', //模板id
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false, //审批详情展示控制
			saveAndCommit: false, //是否保存提交
			tempDataList: [], // 暂存数据
			showTemp: false
		};
		this.indexstatus = {};
		this.skipCodes = []; //交互式异常码
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004storereq', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//设置状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode //修改单据号---非必传
		});

		//pageInfoClick.bind(this)();
	}
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(tableId);
			if (status == STOREREQ_CARD.edit || status == STOREREQ_CARD.add) {
				return getLangByResId(this, '4004STOREREQ-000014'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
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
	getTransferValue = (ids) => {
		let data = {
			data: ids,
			pagecode: STOREREQ_LIST.transferList,
			queryAreaCode: STOREREQ_CARD.searchId,
			templetId: '0001Z81000000006TF0J', //卡片页模板id
			oid: '1001Z81000000000CPKF' //拉单页查询区模板pub_area 区域id
		};
		ajax({
			method: 'POST',
			url: STOREREQ_CARD.transferURL,
			data: data,
			success: (res) => {
				this.props.beforeUpdatePage();

				if (res && res.data) {
					let array = new Array();
					res.data.forEach((o) => {
						let datass = {};
						datass.head = o.head;
						datass.body = o.body;
						datass.pageid = o.pageid;
						array.push(datass);
					});
					this.setState({
						returnURL: STOREREQ_LIST.transferUrl,
						returnType: STOREREQ_LIST.transfer
					});
					this.props.transferTable.setTransferListValue(STOREREQ_CARD.leftarea, res.data);
					this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
					this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { [STOREREQ_CARD.pk_org_v]: true });
				}
				this.props.updatePage(STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
			}
		});
	};
	isActionEnable = () => {
		let fbillstatus = this.props.form.getFormItemsValue(formId, 'fbillstatus').value;

		if (fbillstatus != 1 && fbillstatus != 8) {
			let isEnable = { delete: true, edit: true };
			this.props.button.setDisabled(isEnable);
		}
	};
	toggleShow = () => {
		let appcode = this.props.getAppCode();
		let status = this.props.getUrlParam(STOREREQ_CARD.status);
		// if (!status) {
		// 	status = STOREREQ_CARD.add;
		// }

		//页面刷新 status当作浏览太处理
		let isymfresh = false;
		if (!status && appcode && appcode != '400400004') {
			status = STOREREQ_CARD.browse;
			isymfresh = true;
		}
		let type = this.props.getUrlParam(STOREREQ_CARD.type);
		this.props.beforeUpdatePage();
		//如果是拉单或者推单页面进入 ，则显示退出转单按钮
		if (type) {
			status = this.indexstatus[this.curindex];
			this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.CancelTransfer ], true);
		} else {
			this.props.button.setButtonVisible([ STOREREQ_CARD_BUTTON.CancelTransfer ], false);
		}
		buttonController.setUIState.call(this, this.props, status);
		buttonController.setBackButtonVisiable.call(this, this.props, param);
		buttonController.setCardButtonVisiable.call(this, this.props, status, param);
		this.props.updatePage(STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
		if (isymfresh && isymfresh == true) {
			buttonController.setBlankPageButtons.call(this, this.props);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

			//物资需求申请单新增不需要出现返回按钮
			if (appcode && appcode != '400400004') {
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true
				});
			}
		}
	};
	//获取列表肩部信息
	getTableHead = () => {
		//{this.getOnHandButton()}
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: STOREREQ_CARD.tableId,
					onButtonClick: btnClickController.bind(this),
					ignoreHotkeyCode: getCardDisableHotKeyBtn()
				})}
			</div>
		);
	};
	getAssginUsedr = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.state.saveAndCommit == true) {
			saveAndCommit.call(this, this.skipCodes, value);
		} else {
			commitBtn.call(this, this.props, value);
		}
		this.setState({ compositedisplay: false, saveAndCommit: false });
	};
	// 控制存量查拣的显示隐藏
	toggleOnhandShow = () => {
		this.setState({ onhandShow: !this.state.onhandShow });
	};
	getDatasource = (transfer) => {
		if (transfer) {
			return STOREREQ_LIST.transferDataSource;
		}
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
					pagecode: STOREREQ_CARD.cardpageid,
					type: 'card',
					processorstr: 'nccloud.web.pu.storereq.action.StorereqTempSaveProcessor'
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

	// 主方法
	render() {
		let { cardTable, form, transferTable, modal, cardPagination } = this.props;
		const { createForm } = form;
		let status = this.props.getUrlParam(STOREREQ_CARD.status) || STOREREQ_CARD.browse;
		let { headRows = { rows: [] } } = this.state;
		let { createCardTable } = cardTable;
		let transfer = this.props.getUrlParam(STOREREQ_CARD.type);
		let transferDatasource = this.getDatasource(transfer);
		const { createTransferList } = transferTable;
		let { showUploader } = this.state;
		const { createCardPagination } = cardPagination;
		const { createModal } = modal;
		const { socket } = this.props;
		const MergePrintingProps = {
			jsonData: this.combineData,
			toggleConditionModal: () => {
				this.setState({ showConditionModal: !this.state.showConditionModal });
			},
			showConditionModal: this.state.showConditionModal
		};
		//光标默认聚焦关闭，由业务开发控制
		this.props.controlAutoFocus(true);
		let buttons = this.props.button.getButtons();
		if (transfer) {
			return (
				<div id="transferCard" className="nc-bill-transferList">
					{this.createConnectMesg(socket)}
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: this.state.vbillcode, //单据号
									backBtnClick: btnClickController.bind(this, this.props, 'Back')
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: formId
								})}
								{this.props.button.createButtonApp({
									area: formId,
									onButtonClick: btnClickController.bind(this)
								})}
								<BillTrack
									show={this.state.showTrack}
									close={() => {
										this.setState({ showTrack: false });
									}}
									pk={this.state.pk}
									type={STOREREQ_CARD.billType}
								/>
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{createTransferList({
							//表格组件id
							headcode: formId,
							bodycode: tableId,
							dataSource: transferDatasource,
							transferListId: STOREREQ_CARD.leftarea, //转单列表id
							onTransferItemSelected: (record, status, index) => {
								this.curindex = index;
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
								this.props.beforeUpdatePage();
								this.indexstatus[index] = isEdit;
								this.props.form.setAllFormValue({
									[formId]: record.head[formId]
								});
								transtypeUtils.setValue.call(
									this,
									formId,
									ATTRCODE.ctrantypeid,
									ATTRCODE.vtrantypecode
								);
								let billstatus = record.head.card_head.rows[0].values.fbillstatus.value;
								this.state.vbillcode = record.head.card_head.rows[0].values.vbillcode.value;
								let billId = record.head.card_head.rows[0].values.pk_storereq.value;
								this.setState({ billstatus: billstatus, billId: billId, status: isEdit });
								buttonController.setUIState.call(this, this.props, isEdit);
								if (isEdit == 'browse') {
									setBtnShow(this, billstatus);
									buttonController.setBackButtonVisiable.call(this, this.props, param);
								} else {
									this.toggleShow();
								}
								//设置行号跳出堆栈，防止页面死循环
								this.props.cardTable.setTableData(tableId, record.body[tableId], null, true, true);
								// setTimeout(() => {
								// 	//RownoUtils.setRowNo(this.props, tableId, ATTRCODES.crowno);
								// }, 0);
								//this.forceUpdate();
								this.props.updatePage(formId, tableId);
							}
						})}
						<div className="transferList-content-right nc-bill-card">
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									expandArr: [ STOREREQ_CARD.cardpageid ],
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: headBeforeEvents.bind(this)
								})}
							</div>
							<div className="nc-bill-table-area scm-ic-extent-btn">
								{createCardTable(this.tableId, {
									showCheck: true,
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: bodyBeforeEvents.bind(this),
									onSelected: buttonController.lineSelected.bind(this),
									hideModelSave: true,
									inputChange: inputChange.bind(this, ATTRCODES.crowno),
									onSelectedAll: buttonController.lineSelected.bind(this),
									tableHead: this.getTableHead.bind(this, buttons),
									onBatchChange: batchEvents.bind(this),
									modelAddRow: () => {
										//RownoUtils.setRowNo(this.props, this.tableId, ATTRCODES.crowno);
									},
									adaptionHeight: true
								})}
							</div>
							<ExtendRefer
								headRows={headRows}
								onChange={(data) => {
									onHandBtnSelected.call(this, {
										AREA: { body: STOREREQ_CARD.tableId, formArea: STOREREQ_CARD.formId },
										FIELD: { cwarehouseid: 'pk_reqstor' },
										PAGECODE: { card: STOREREQ_CARD.cardpageid }
									});
								}}
								showBatch={false}
								appcode={'400403202'}
								headTemplateCode={'400403202_onheadqueryH'}
								bodyTemplateCode={'400403202_onheadqueryB'}
								undealNumCode={'onhandshouldnum'}
								thisNumCode={'onhandcurrentnum'}
								isSatisfyCode={'fulfiltype'}
								editable={status == STOREREQ_CARD.edit}
								show={this.state.onhandShow}
								toggleShow={this.toggleOnhandShow}
							/>
							<div>
								{showUploader && <NCUploader billId={this.state.billId} onHide={this.onHideUploader} />}
							</div>
							{this.state.compositedisplay && (
								<ApprovalTrans
									title={getLangByResId(this, '4004STOREREQ-000016')} /* 国际化处理： 指派*/
									data={this.state.compositedata}
									display={this.state.compositedisplay}
									getResult={this.getAssginUsedr}
									cancel={() => {
										this.setState({ compositedisplay: false });
									}}
								/>
							)}
							<div>
								<ApproveDetail
									show={this.state.show}
									close={this.closeApprove}
									billtype={this.state.billtype}
									billid={this.state.billId}
								/>
							</div>
							{/* 合并显示 */}
							{this.combineData && <MergePrinting {...MergePrintingProps} />}
							{/* 交互式异常模态框 */}
							<div>
								{createModal('ResumeMessageMlg', {
									className: 'iframe-modal',
									size: 'xlg'
								})}
							</div>
						</div>
					</div>
					{createModal('code-config')}
					{createModal('printService', {
						className: 'print-service'
					})}
					<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
				</div>
			);
		} else {
			return (
				<div className="nc-bill-card">
					{this.createConnectMesg(socket)}
					<div className="nc-bill-top-area">
						<NCAffix>
							{/* 按钮区 */}
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									{createCardTitle(this, {
										billCode: this.state.vbillcode, //单据号
										backBtnClick: () => {
											//返回按钮的点击事件
											this.props.pushTo(STOREREQ_CARD.listUrl, {
												pagecode: STOREREQ_CARD.listpageid
											});
										}
									})}
								</div>
								<div className="header-button-area">
									{this.props.button.createErrorFlag({
										headBtnAreaCode: formId
									})}

									{this.props.button.createButtonApp({
										area: STOREREQ_CARD.formId,
										onButtonClick: btnClickController.bind(this)
									})}
									<BillTrack
										show={this.state.showTrack}
										close={() => {
											this.setState({ showTrack: false });
										}}
										pk={this.state.pk}
										type={STOREREQ_CARD.billType}
									/>
								</div>
								{/* 上一页/下一页 */}
								<div className="header-cardPagination-area">
									{createCardPagination({
										handlePageInfoChange: pageInfoClick.bind(this),
										dataSource: STOREREQ_LIST.dataSource
									})}
								</div>
							</NCDiv>
						</NCAffix>
						{/* 表头 */}

						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								//expandArr 放开的话 操作信息列会默认展开状态
								//expandArr: [ STOREREQ_CARD.tailinfo ],
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: headBeforeEvents.bind(this)
							})}
							{this.creatTempDataList()}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						{/* 表体 */}
						<div className="nc-bill-table-area scm-ic-extent-btn">
							{createCardTable(this.tableId, {
								showCheck: true,
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: bodyBeforeEvents.bind(this),
								onSelected: buttonController.lineSelected.bind(this),
								hideModelSave: true,
								inputChange: inputChange.bind(this, ATTRCODES.crowno),
								onSelectedAll: buttonController.lineSelected.bind(this),
								tableHead: this.getTableHead.bind(this, buttons),
								onBatchChange: batchEvents.bind(this),
								modelAddRow: () => {
									RownoUtils.setRowNo(this.props, this.tableId, ATTRCODES.crowno);
								},
								adaptionHeight: true
							})}
						</div>
					</div>
					<ExtendRefer
						headRows={headRows}
						onChange={(data) => {
							onHandBtnSelected.call(this, {
								AREA: { body: STOREREQ_CARD.tableId, formArea: STOREREQ_CARD.formId },
								FIELD: { cwarehouseid: 'pk_reqstordoc' },
								PAGECODE: { card: STOREREQ_CARD.cardpageid }
							});
						}}
						showBatch={false}
						appcode={'400403202'}
						headTemplateCode={'400403202_onheadqueryH'}
						bodyTemplateCode={'400403202_onheadqueryB'}
						undealNumCode={'onhandshouldnum'}
						thisNumCode={'onhandcurrentnum'}
						isSatisfyCode={'fulfiltype'}
						editable={status == STOREREQ_CARD.edit}
						show={this.state.onhandShow}
						toggleShow={this.toggleOnhandShow}
					/>

					<div>
						{showUploader && (
							<NCUploader
								billId={this.state.billId}
								onHide={this.onHideUploader}
								billcode={this.state.billId}
								pk_billtypecode={STOREREQ_LIST.billType}
							/>
						)}
					</div>
					{/* 展示审批详情 */}
					<div>
						<ApproveDetail
							show={this.state.show}
							close={this.closeApprove}
							billtype={this.state.billtype}
							billid={this.state.billId}
						/>
					</div>
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004STOREREQ-000016')} /* 国际化处理： 指派*/
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
					{/* 交互式异常模态框 */}
					<div>
						{createModal('ResumeMessageMlg', {
							className: 'iframe-modal',
							size: 'xlg'
						})}
					</div>
					{createModal('delModal')}
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
					headBtnAreaCode: STOREREQ_CARD.formId, // 表头按钮区域ID
					formAreaCode: STOREREQ_CARD.formId, // 表头Form区域ID
					billtype: STOREREQ_CARD.billType,
					billpkname: ATTRCODE.pk_storereq,
					dataSource: STOREREQ_LIST.dataSource
				})}
			</div>
		);
	};
}
StorereqCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: STOREREQ_CARD.cardpageid,
		headcode: STOREREQ_CARD.formId,
		bodycode: {
			[STOREREQ_CARD.tableId]: 'cardTable'
		}
	},
	orderOfHotKey: [ STOREREQ_CARD.formId, STOREREQ_CARD.tableId ]
})(StorereqCard);
export default StorereqCard;
//ReactDOM.render(<StorereqCard />, document.querySelector('#app'));
