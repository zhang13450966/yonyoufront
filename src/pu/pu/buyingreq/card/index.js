/*
 * @Author: zhangchangqing
 * @PageInfo: 形态转换，卡片态
 * @Date: 2018-05-04 15:50:44
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-16 14:54:56
 */
import ExcelOutput from 'uap/common/components/ExcelOutput';
import React, { Component } from 'react';
import { createPage, ajax, base, high } from 'nc-lightapp-front';
const { BillTrack } = high;
let { NCAffix, NCDiv } = base;
import Inspection from 'epmp/exports/components/Inspection';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import { initTemplate } from './init';
import './index.less';
import { pageInfoClick, getParentURlParme, onHandBtnSelected, saveAndCommit } from './btnClicks';
import { BUYINGREQ_CARD, BUYINGREQ_CARD_BUTTON, BUYINGREQ_LIST, ATTRCODE, ATTRCODES } from '../siconst';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import ExtendRefer from 'ic/ic/components/onhandRefer'; //引入存量查拣组件
import Price from '../price';
import { showWarningDialog } from '../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import MergePrinting from 'scmpub/scmpub/components/MergePrinting';
import commitBtn from './btnClicks/commitBtnClick';
import { afterEvent } from './afterEvents';
import { batchEvents } from './batchEvents';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { beforeEvent, bodyBeforeEvents } from './beforeEvents';
import { setBtnShow } from './btnClicks/pageInfoClick';
import { buttonController, btnClickController } from './viewControl';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import { TempDataList } from '../../../../scmpub/scmpub/components/TempSave';
import temporaryClick from './btnClicks/temporaryClick';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId; //'body';
let parentURL = getParentURlParme(BUYINGREQ_CARD.pageMsgType);
class BuyingreqCard extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.curindex = 0; //记录拉单推单的当前操作位置
		this.tableId = tableId;
		props.use.form(this.formId);
		props.use.cardTable(this.tableId);
		this.combineData; //合并显示
		this.pageId = BUYINGREQ_CARD.cardpageid; //BUYINGREQ_CARD
		this.skipCodes = []; //交互式异常码
		this.meta;
		this.state = {
			showPrice: false, //控制价格论证表显示
			copy_billId: '', //卡片页点击新增单据或者复制单据时用来缓存单据号 编辑态取消时使用
			vbillcode: '', //订单编号
			billId: '', //单据id
			appcode: '', //返回推单交易时参数
			returnURL: BUYINGREQ_LIST.transferUrl, //转单界面返回路径，默认是返回拉单界面
			returnType: BUYINGREQ_LIST.transfer, //转单界面返回路径，默认是transfer
			billtype: '', //单据交易类型
			listdata: '', //转单后编辑数据缓存
			currentindex: 0, //转单后编辑数据缓存
			lineShowType: [], //通过数组的方式控制 列按钮显示   1-收起   0-展开
			headRows: { rows: [] }, //存量查拣 表头数据
			onhandShow: false, // 存量查拣的显示隐藏
			// onhandrefreshFlag: Math.random(), // 存量查拣 随机数，更新标志
			showConditionModal: false, // 合并显示
			status: this.props.getUrlParam(BUYINGREQ_CARD.status),
			pageId: this.props.getUrlParam(BUYINGREQ_CARD.pageid),
			showTrack: false,
			templetid: '', //模板ID
			pk: '',
			compositedisplay: false,
			compositedata: null,
			index: 0, //不知道干嘛的 记录拉单推单的当前操作位置
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false, //审批详情展示控制
			saveAndCommit: false, //是否保存提交
			tempDataList: [], // 暂存数据
			showTemp: false
		};
		this.ts = '';
		this.indexstatus = {};
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004praybill', '4004pub', '4004praybillr' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//设置状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode //修改单据号---非必传
		});
		//pageInfoClick.bind(this)();
		//this.getData();
		//this.toggleShow();
	}
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(tableId);
			if (status == BUYINGREQ_CARD.edit || status == BUYINGREQ_CARD.add) {
				return getLangByResId(this, '4004PRAYBILL-000023'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	getTransferValue = (ids) => {
		let data = {
			data: ids,
			//pagecode: BUYINGREQ_CARD.cardpageid,
			pagecode: BUYINGREQ_LIST.transferList,
			queryAreaCode: BUYINGREQ_CARD.searchId,
			templetId: '0001Z81000000006U9JH',
			oid: '0001Z81000000006VBMS'
		};
		ajax({
			method: 'POST',
			url: BUYINGREQ_CARD.transferURL,
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
						//listdata: array,
						returnURL: BUYINGREQ_LIST.transferUrl,
						returnType: BUYINGREQ_LIST.transfer
					});
					this.props.transferTable.setTransferListValue(BUYINGREQ_CARD.leftarea, res.data);
					//buttonController.setUIState.call(this, this.props, BUYINGREQ_CARD.edit);
					this.props.resMetaAfterPkorgEdit(); //选择主组织以后，恢复其他字段的编辑性
					this.props.form.setFormItemsDisabled(BUYINGREQ_CARD.formId, { [BUYINGREQ_CARD.pk_org_v]: true });
					//RownoUtils.setRowNo(this.props, tableId, ATTRCODES.crowno);
					//this.toggleShow();
				}
				this.props.updatePage(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.tableId);
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
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam(BUYINGREQ_CARD.status);

		//推单标识
		let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
		let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
		//如果是拉单页面进入 ，则显示退出转单按钮；推单不显示
		if (type || channelType) {
			status = this.indexstatus[this.curindex];
			if (channelType) {
				this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.CancelTransfer ], false);
			} else {
				this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.CancelTransfer ], true);
			}
		} else {
			this.props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.CancelTransfer ], false);
		}
		//页面刷新 status当作浏览太处理
		let isymfresh = false;
		if (!status) {
			status = BUYINGREQ_CARD.browse;
			isymfresh = true;
		}
		buttonController.setUIState.call(this, this.props, status);
		buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
		buttonController.setCardButtonVisiable.call(this, this.props, status, parentURL);

		if (isymfresh && isymfresh == true) {
			buttonController.setBlankPageButtons.call(this, this.props);
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		}
	};
	setParameterForURL = (status, billId) => {
		let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
		let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
		let pagecode = BUYINGREQ_LIST.cardpageid;
		if (channelType) {
			this.props.pushTo(BUYINGREQ_CARD.cardUrl, {
				status: status,
				id: billId,
				channelType: channelType,
				pagecode: pagecode
			});
		}
		if (type) {
			this.props.pushTo(BUYINGREQ_CARD.cardUrl, {
				status: status,
				id: billId,
				type: type,
				pagecode: pagecode
			});
		}
	};
	//删除单据
	delConfirm = () => {
		ajax({
			url: BUYINGREQ_CARD.deleteURL,
			data: {
				id: this.props.getUrlParam(BUYINGREQ_CARD.id),
				ts: this.props.form.getFormItemsValue(this.formId, BUYINGREQ_CARD.ts).value
			},
			success: () => {
				this.props.pushTo('../list', { pagecode: BUYINGREQ_LIST.listpageid });
			}
		});
	};
	//获取列表肩部信息  {this.getOnHandButton()}
	getTableHead = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: tableId,
					onButtonClick: btnClickController.bind(this),
					ignoreHotkeyCode: getCardDisableHotKeyBtn()
				})}
			</div>
		);
	};
	// 点击返回
	clickReturn = () => {
		// 是否有未处理的单据
		let isleft = this.props.transferTable.getTransformFormStatus('leftarea');
		if (isleft === false) {
			showWarningDialog(
				getLangByResId(this, '4004PRAYBILL-000003'),
				getLangByResId(this, '4004PRAYBILL-000004'),
				{
					/* 国际化处理： 提示,有未处理完的单据，是否退出转单*/
					beSureBtnClick: () => {
						this.props.pushTo(this.state.returnURL, {
							type: this.state.returnType,
							appcode: this.state.appcode,
							pagecode: BUYINGREQ_LIST.transferList
						});
					}
				}
			);
		} else {
			this.props.pushTo(this.state.returnURL, {
				type: this.state.returnType,
				appcode: this.state.appcode,
				pagecode: BUYINGREQ_LIST.transferList
			});
		}
	};
	// 控制存量查拣的显示隐藏
	toggleOnhandShow = () => {
		this.setState({ onhandShow: !this.state.onhandShow });
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
	getDatasource = (transfer, channelType) => {
		if (transfer) {
			return BUYINGREQ_LIST.transferDataSource;
		} else if (channelType) {
			if (channelType == BUYINGREQ_CARD.replenishmentarrange) {
				return BUYINGREQ_CARD.channelTypeDataSource1;
			} else if (channelType == BUYINGREQ_CARD.directarrange) {
				return BUYINGREQ_CARD.channelTypeDataSource2;
				// } else if (channelType == BUYINGREQ_CARD.srcbilltype4B32) {
			}
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
					pagecode: BUYINGREQ_CARD.cardpageid,
					type: 'card',
					processorstr: 'nccloud.web.pu.buyingreq.action.BuyingreqTempSaveProcessor'
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
		let { cardTable, form, modal, transferTable, cardPagination } = this.props;
		const { createForm } = form;
		let { createCardTable } = cardTable;
		const { createCardPagination } = cardPagination;
		let status = this.props.getUrlParam(BUYINGREQ_CARD.status) || BUYINGREQ_CARD.browse;
		let { headRows = { rows: [] } } = this.state;
		let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
		let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
		//channelType = 'replenishmentarrange';
		let transferDatasource = this.getDatasource(transfer, channelType);
		const { createTransferList } = transferTable;
		let { showUploader } = this.state;
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
		if (transfer || channelType) {
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
									type={BUYINGREQ_CARD.billType}
								/>
								<ExcelOutput
									{...Object.assign(this.props)}
									moduleName={BUYINGREQ_LIST.purchaseorg} //模块名称，常量。。。。。
									billType={BUYINGREQ_LIST.billType}
									pagecode={BUYINGREQ_LIST.cardpageid}
									appcode={BUYINGREQ_LIST.appcode20}
									exportTreeUrl={BUYINGREQ_LIST.exportset}
									// referVO={{ ignoreTemplate: true }} //表示是否走配置文件的配置
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
							transferListId: BUYINGREQ_CARD.leftarea, //转单列表id
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
								let billId = record.head.card_head.rows[0].values.pk_praybill.value;
								this.setState({ billstatus: billstatus, billId: billId, status: isEdit });
								buttonController.setUIState.call(this, this.props, isEdit);
								if (isEdit == 'browse') {
									setBtnShow(this, billstatus);
									buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
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
									expandArr: [ BUYINGREQ_CARD.cardpageid ],
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this)
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
										RownoUtils.setRowNo(this.props, this.tableId, ATTRCODES.crowno);
									},
									adaptionHeight: true
								})}
							</div>
							<ExtendRefer
								headRows={headRows}
								onChange={(data) => {
									onHandBtnSelected.call(this, {
										AREA: { body: BUYINGREQ_CARD.tableId, formArea: BUYINGREQ_CARD.formId },
										FIELD: { cwarehouseid: 'pk_reqstor' },
										PAGECODE: { card: BUYINGREQ_CARD.cardpageid }
									});
								}}
								showBatch={false}
								appcode={'400403202'}
								headTemplateCode={'400403202_onheadqueryH'}
								bodyTemplateCode={'400403202_onheadqueryB'}
								undealNumCode={'onhandshouldnum'}
								thisNumCode={'onhandcurrentnum'}
								isSatisfyCode={'fulfiltype'}
								editable={status == BUYINGREQ_CARD.edit || status == BUYINGREQ_CARD.add}
								show={this.state.onhandShow}
								toggleShow={this.toggleOnhandShow}
							/>
							<div>
								{showUploader && <NCUploader billId={this.state.billId} onHide={this.onHideUploader} />}
							</div>
							{this.state.compositedisplay && (
								<ApprovalTrans
									title={getLangByResId(this, '4004PRAYBILL-000025')} /* 国际化处理： 指派*/
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
							{/*  价格论证表 */}
							{this.state.showPrice && (
								<Price
									showModal={this.state.showPrice}
									onClose={() => {
										this.setState({ showPrice: false });
									}}
								/>
							)}

							{/* 合并显示 */}
							{this.combineData && <MergePrinting {...MergePrintingProps} />}
							{createModal('delete', {
								title: getLangByResId(this, '4004PRAYBILL-000026') /* 国际化处理： 删除*/,
								content: getLangByResId(this, '4004PRAYBILL-000027') /* 国际化处理： 是否确认删除？*/,
								beSureBtnClick: this.delConfirm
							})}
							{createModal('delModal')}
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
											this.props.pushTo(BUYINGREQ_CARD.listUrl, {
												pagecode: BUYINGREQ_LIST.listpageid
											});
										}
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
										type={BUYINGREQ_CARD.billType}
									/>
								</div>
								{/* 上一页/下一页 */}
								<div className="header-cardPagination-area">
									{createCardPagination({
										handlePageInfoChange: pageInfoClick.bind(this),
										dataSource: BUYINGREQ_LIST.dataSource
									})}
								</div>
								<ExcelOutput
									{...Object.assign(this.props)}
									moduleName={BUYINGREQ_LIST.purchaseorg} //模块名称，常量。。。。。
									billType={BUYINGREQ_LIST.billType}
									pagecode={BUYINGREQ_LIST.cardpageid}
									appcode={BUYINGREQ_LIST.appcode20}
									exportTreeUrl={BUYINGREQ_LIST.exportset}
									// referVO={{ ignoreTemplate: true }} //表示是否走配置文件的配置
								/>
							</NCDiv>
						</NCAffix>
						{/* 表头 */}
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								//expandArr 放开的话 操作信息列会默认展开状态
								//expandArr: [ BUYINGREQ_CARD.tailinfo ],
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: beforeEvent.bind(this)
							})}
							{this.creatTempDataList()}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						{/* 表体 */}
						<div className="nc-bill-table-area scm-ic-extent-btn">
							{createCardTable(this.tableId, {
								//modelSave: buttonClick.bind(this, this.props, 'save'),
								showCheck: true,
								onAfterEvent: afterEvent.bind(this),
								onBeforeEvent: bodyBeforeEvents.bind(this),
								onSelected: buttonController.lineSelected.bind(this),
								hideModelSave: true,
								inputChange: inputChange.bind(this, ATTRCODES.crowno),
								onSelectedAll: buttonController.lineSelected.bind(this),
								onBatchChange: batchEvents.bind(this),
								tableHead: this.getTableHead.bind(this, buttons),
								modelAddRow: () => {
									RownoUtils.setRowNo(this.props, this.tableId, ATTRCODES.crowno);
								},
								adaptionHeight: true
							})}
						</div>
					</div>
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004PRAYBILL-000025')} /* 国际化处理： 指派*/
							data={this.state.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getAssginUsedr}
							cancel={() => {
								this.setState({ compositedisplay: false });
							}}
						/>
					)}
					{/*  价格论证表 */}
					{this.state.showPrice && (
						<Price
							showModal={this.state.showPrice}
							onClose={() => {
								this.setState({ showPrice: false });
							}}
						/>
					)}
					{/* 合并显示 */}
					{this.combineData && <MergePrinting {...MergePrintingProps} />}
					<ExtendRefer
						headRows={headRows}
						onChange={(data) => {
							onHandBtnSelected.call(this, {
								AREA: { body: BUYINGREQ_CARD.tableId, formArea: BUYINGREQ_CARD.formId },
								FIELD: { cwarehouseid: 'pk_reqstor' },
								PAGECODE: { card: BUYINGREQ_CARD.cardpageid }
							});
						}}
						showBatch={false}
						appcode={'400403202'}
						headTemplateCode={'400403202_onheadqueryH'}
						bodyTemplateCode={'400403202_onheadqueryB'}
						undealNumCode={'onhandshouldnum'}
						thisNumCode={'onhandcurrentnum'}
						isSatisfyCode={'fulfiltype'}
						editable={status == BUYINGREQ_CARD.edit || status == BUYINGREQ_CARD.add}
						show={this.state.onhandShow}
						toggleShow={this.toggleOnhandShow}
					/>
					<div>
						{showUploader && (
							<NCUploader
								billId={this.state.billId}
								onHide={this.onHideUploader}
								billcode={this.state.billId}
								pk_billtypecode={BUYINGREQ_LIST.billType}
							/>
						)}
					</div>
					{createModal(BUYINGREQ_CARD.orgChange)}
					<div>
						<ApproveDetail
							show={this.state.show}
							close={this.closeApprove}
							billtype={this.state.billtype}
							billid={this.state.billId}
						/>
					</div>
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
					{createModal('ResumeMessageDlg', {
						className: 'iframe-modal',
						size: 'xlg'
					})}
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
					headBtnAreaCode: formId, // 表头按钮区域ID
					formAreaCode: formId, // 表头Form区域ID
					billtype: '20',
					billpkname: ATTRCODE.pk_praybill,
					dataSource: BUYINGREQ_LIST.dataSource
				})}
			</div>
		);
	};
}
BuyingreqCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: BUYINGREQ_CARD.cardpageid,
		headcode: BUYINGREQ_CARD.formId,
		bodycode: {
			[BUYINGREQ_CARD.tableId]: 'cardTable'
		}
	},
	orderOfHotKey: [ BUYINGREQ_CARD.formId, BUYINGREQ_CARD.tableId ]
})(BuyingreqCard);
export default BuyingreqCard;
//ReactDOM.render(<BuyingreqCard />, document.querySelector('#app'));
