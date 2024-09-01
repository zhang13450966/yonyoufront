/*
 * @Author: 刘奇 
 * @PageInfo: 客户费用单卡片态  
 * @Date: 2019-03-05 14:37:09 
 * @Last Modified by: liulux
 * @Last Modified time: 2022-04-07 10:36:20
 */

import React, { Component } from 'react';
import { base, createPage, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import {
	commonSearch_BtnClick,
	buttonClick,
	pageInfo_BtnClick,
	commit_BtnClick,
	spreadAddRow_BtnClick,
	spreadDelRow_BtnClick,
	searchForCopy_BtnClick,
	transferBill,
	saveCommit_BtnClick,
	addLine_BtnClick
} from './btnClicks';
import { ARSUB_CONST, BUTTON_AREA, BUTTON, ArsubHeadItem, ArsubBodyItem } from '../const';
import buttonController from './viewController/buttonController';
import { head_afterEvent, body_afterEvent, body_beforeEvent, head_beforeEvent, batchEvent } from './events';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showBackWarningDialog } from '../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { changeUrlParam } from '../../../../scmpub/scmpub/pub/cache';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool/index';
import NCUploader from 'uap/common/components/NCUploader';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import Inspection from 'epmp/exports/components/Inspection';
import { isAutoAdd } from './events/body_afterEvent';

const { BillTrack } = high;
const { NCAffix, NCDiv } = base;

class ArsubCard extends Component {
	constructor(props) {
		super(props);
		this.headId = ARSUB_CONST.formId;
		this.tableId = ARSUB_CONST.tableId;
		props.use.form(this.headId);
		props.use.cardTable(this.tableId);
		this.org = {
			display: '',
			value: ''
		};
		this.org_v = {
			display: '',
			value: ''
		};
		this.contexts = null;
		this.skipCodes = [];
		this.copyRowDatas = null; // 复制行信息
		this.state = {
			currentLocale: 'en-US',
			// 单据联查使用
			showBillTrack: false,
			// 附件管理
			showUploader: false,
			billid: null,
			vbillcode: null,
			// 审批详情
			showApproveDetail: false,
			transTypeCode: null,
			// 分单打印
			showSpilt: false,
			splitData: {},
			// 提交指派
			compositedisplay: false,
			compositedata: null,

			billcode: '',
			// copyRowDatas: null, // 复制行信息
			// 多语
			json: {},
			inlt: null,
			showInspection: false, //联查预算
			inspectionSourceData: null,
			//判断侧拉的增行按钮是否隐藏
			isHideAdd: false,
			saveAndCommit: false
		};
		this.listData = null;
		this.curindex = 0;
		this.cardLastId = null;
	}

	getAssginUsedr = (value) => {
		if (this.state.saveAndCommit == true) {
			saveCommit_BtnClick.call(this, this.props, this.skipCodes, value);
		} else {
			// 重新执行提交操作
			commit_BtnClick.call(this, this.props, value);
		}
		this.setState({ compositedisplay: false, saveAndCommit: false });
	};

	// 编辑态关闭浏览器提示
	componentWillMount() {
		initLang(this, [ '4001arsub' ], 'scmpub', initTemplate.bind(this, this.props));
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(this.tableId);
			if (status == ARSUB_CONST.edit) {
				return getLangByResId(this, '4006ARSUB-000010'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	componentDidMount() {
		// let buttonType = this.props.getUrlParam('buttonType');
		// let srcid = this.props.getUrlParam('srcid');
		// let carsubid = this.props.getUrlParam('id');
		// if (buttonType != undefined && buttonType.indexOf('ref') != -1) {
		// 	transferBill.call(this, this.props, buttonType);
		// } else if (srcid != undefined && srcid != null) {
		// 	// 复制单据
		// 	changeUrlParam(this.props, {
		// 		status: ARSUB_CONST.edit,
		// 		buttonType: BUTTON.copy,
		// 		id: ''
		// 	});
		// 	searchForCopy_BtnClick.call(this, this.props, srcid);
		// } else {
		// 	//  else if ((carsubid == undefined || carsubid == '') && buttonType == BUTTON.add) {
		// 	// 	add_BtnClick.call(this, this.props);
		// 	// }
		// 	let carsubid = this.props.getUrlParam('id');
		// 	commonSearch_BtnClick.call(this, this.props, carsubid);
		// }
	}
	setShowUnit = () => {
		let pk_org = (this.props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.csaleorgvid) || {}).value;
		if (this.props.meta.getMeta()[ARSUB_CONST.formId] != undefined) {
			this.props.meta.getMeta()[ARSUB_CONST.formId].items.forEach((element) => {
				if (element.attrcode == ArsubHeadItem.cemployeeid || element.attrcode == ArsubHeadItem.cdeptvid) {
					if (pk_org) {
						element.isShowUnit = false;
					} else {
						element.isShowUnit = true;
					}
				}
			});
		}
	};
	// 获取列表肩部信息
	getTableHead = (buttons) => {
		let { createButtonApp } = this.props.button;
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
						area: BUTTON_AREA.Card_Body,
						buttonLimit: 5,
						onButtonClick: buttonClick.bind(this, this.curindex)
						//popContainer: document.querySelector('.header-button-area')
					})}
				</div>
			</div>
		);
	};

	// 点击返回
	clickReturn = () => {
		let transfer = this.props.getUrlParam('buttonType');
		if (transfer != undefined && transfer.indexOf('ref') != -1) {
			// 是否有未处理的单据
			let path = '/' + transfer;
			let isleft = this.props.transferTable.getTransformFormStatus(ARSUB_CONST.left);
			if (isleft === false) {
				showBackWarningDialog({
					beSureBtnClick: () => {
						// 返回逻辑
						this.beSureBtnClick.call(this, this.props, path);
					}
				});
			} else {
				this.beSureBtnClick.call(this, this.props, path);
			}
		} else {
			this.beSureBtnClick(this.props, ARSUB_CONST.List_URL);
		}
	};
	beSureBtnClick = (props, path) => {
		props.pushTo(path, { pagecode: ARSUB_CONST.cardPageId });
	};

	// 转单左侧列表点击切换事件
	transferListClick = (record, index, status, formStatus) => {
		this.curindex = index;
		//点击转单缩略图的钩子函数
		this.props.beforeUpdatePage();

		let carsubid = record.head[ARSUB_CONST.formId].rows[0].values[ArsubHeadItem.carsubid].value;
		let ts = record.head[ARSUB_CONST.formId].rows[0].values[ArsubHeadItem.ts].value;
		let billcode = record.head[ARSUB_CONST.formId].rows[0].values[ArsubHeadItem.vbillcode].value;

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			billCode: billcode == null ? '' : billcode //修改单据号---非必传
		});
		// status === true 说明该单保存过
		if (formStatus === ARSUB_CONST.browse) {
			this.props.form.setAllFormValue({ [ARSUB_CONST.formId]: record.head[ARSUB_CONST.formId] });
			this.props.cardTable.setTableData(ARSUB_CONST.tableId, record.body[ARSUB_CONST.tableId]);
		} else {
			this.props.form.setAllFormValue({ [ARSUB_CONST.formId]: record.head[ARSUB_CONST.formId] }, false);
			this.props.cardTable.setTableData(ARSUB_CONST.tableId, record.body[ARSUB_CONST.tableId], null, false);
		}
		changeUrlParam(this.props, { id: carsubid == null ? '' : carsubid, ts, status: formStatus });

		// 交易类型
		transtypeUtils.setValue.call(this, ARSUB_CONST.formId, ArsubHeadItem.ctrantypeid, ArsubHeadItem.vtrantypecode);
		buttonController.call(this, this.props);
		this.props.updatePage(ARSUB_CONST.formId, ARSUB_CONST.tableId);
	};
	// 获取转单界面
	initForTransfer = () => {
		let { cardTable, form, button, transferTable, modal, socket } = this.props;
		const { createTransferList } = transferTable;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createModal } = modal;
		let { createButtonApp } = button;
		let refdatasource = this.props.getUrlParam('buttonType') + 'DataSource';
		return (
			<div id="scm-scm-arsub-transfercard" className="nc-bill-transferList">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							<span>
								{createCardTitle(this, {
									backBtnClick: this.clickReturn.bind(this)
								})}
							</span>
						</div>
						<div className="header-button-area">
							{this.props.button.createErrorFlag({
								headBtnAreaCode: BUTTON_AREA.Card_Head
							})}
							{createButtonApp({
								area: BUTTON_AREA.Card_Head,
								buttonLimit: 8,
								onButtonClick: buttonClick.bind(this, this.curindex),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-transferList-content">
					{createTransferList({
						dataSource: refdatasource,
						//表格组件id
						headcode: ARSUB_CONST.formId,
						bodycode: ARSUB_CONST.tableId,
						transferListId: ARSUB_CONST.left, //转单列表id
						searchAreaCode: ARSUB_CONST.searchId,
						// 自动跳转选择左侧卡片
						onTransferItemSelected: (record, status, index, formStatus) => {
							this.transferListClick(record, index, status, formStatus);
						},
						// 手工选择左侧卡片
						onTransferItemClick: (record, index, status, formStatus) => {
							// 如果编辑过，则弹框提示，让用户选择是否继续
							this.transferListClick(record, index, status, formStatus);
						}
					})}
					<div className="transferList-content-right nc-bill-card" id="sa">
						{socket.connectMesg({
							headBtnAreaCode: BUTTON_AREA.Card_Head, // 表头按钮区域ID
							formAreaCode: ARSUB_CONST.formId, // 表头Form区域ID
							billtype: '35',
							billpkname: ArsubHeadItem.carsubid,
							dataSource: ARSUB_CONST.ArsubCacheKey
							// serverLocation: '172.20.53.89:8883'
						})}
						<div className="nc-bill-form-area">
							{createForm(this.headId, {
								onAfterEvent: head_afterEvent.bind(this),
								onBeforeEvent: head_beforeEvent.bind(this)
							})}
						</div>
						<div className="nc-bill-table-area scm-credit-extent-btn">
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead,
								onAfterEvent: body_afterEvent.bind(this),
								onBeforeEvent: body_beforeEvent.bind(this),
								onSelected: buttonController.bind(this, this.props),
								onSelectedAll: buttonController.bind(this, this.props),
								onBatchChange: batchEvent.bind(this), //复制粘贴表体多行
								showCheck: true,
								hideModelSave: true, // 隐藏整单保存按钮
								modelAddRow: spreadAddRow_BtnClick.bind(this), // 侧拉编辑增行
								modelDelRow: spreadDelRow_BtnClick.bind(this), // 侧拉编辑删行
								pageSize: 20000,
								inputChange: inputChange.bind(this, 'crowno'),
								adaptionHeight: true,
								hideAdd: this.state.isHideAdd
							})}
						</div>
						{/* 单据联查 */}
						<BillTrack
							show={this.state.showBillTrack}
							close={() => {
								this.setState({ showBillTrack: false });
							}}
							pk={this.state.billid} //单据id
							type="35" //单据类型
						/>
						{/* 附件管理 */}
						{this.state.showUploader && (
							<NCUploader
								billId={this.state.billid}
								billNo={this.state.vbillcode}
								onHide={() => {
									this.setState({
										showUploader: false
									});
								}}
							/>
						)}
						{/* 审批详情 */}
						<div>
							<ApproveDetail
								show={this.state.showApproveDetail}
								close={() => {
									this.setState({
										showApproveDetail: false
									});
								}}
								billtype={this.state.transTypeCode}
								billid={this.state.billid}
							/>
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
							{/* 提交指派适配 */}
							{this.state.compositedisplay && (
								<ApprovalTrans
									title={getLangByResId(this, '4006ARSUB-000019')} /* 国际化处理： 指派*/
									data={this.state.compositedata}
									display={this.state.compositedisplay}
									getResult={this.getAssginUsedr}
									cancel={() => {
										this.setState({ compositedisplay: false });
									}}
								/>
							)}
						</div>
						<div>
							{createModal('modal', {
								content: '',
								rightBtnName: ''
							})}
							{createModal('MessageDlg', {
								size: 'xlg'
							})}
							{createModal('code-config')}
							{/* 打印次数 */}
							{createModal('printService', {
								className: 'print-service'
							})}
							<iframe
								id="printServiceframe"
								name="printServiceframe"
								style={{ display: 'none' }}
								sandbox
							/>
						</div>
						<Inspection
							show={this.state.showInspection}
							sourceData={this.state.inspectionSourceData}
							cancel={() => {
								this.setState({ showInspection: false });
							}}
							affirm={() => {
								this.setState({ showInspection: false });
							}}
						/>
					</div>
				</div>
			</div>
		);
	};

	// 获取卡片界面
	initForSelf = () => {
		let { cardTable, form, button, cardPagination, modal, socket } = this.props;
		const { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		const { createCardPagination } = cardPagination;
		const { createModal } = modal;

		return (
			<div className="nc-bill-card" id="scm-credit-audit-card">
				{socket.connectMesg({
					headBtnAreaCode: BUTTON_AREA.Card_Head, // 表头按钮区域ID
					formAreaCode: ARSUB_CONST.formId, // 表头Form区域ID
					billtype: '35',
					billpkname: ArsubHeadItem.carsubid,
					dataSource: ARSUB_CONST.ArsubCacheKey
				})}
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								<span>
									{createCardTitle(this, {
										billCode: this.state.billcode, //单据号
										backBtnClick: this.clickReturn.bind(this)
									})}
								</span>
							</div>
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: BUTTON_AREA.Card_Head
								})}
								{createButtonApp({
									area: BUTTON_AREA.Card_Head,
									buttonLimit: 8,
									onButtonClick: buttonClick.bind(this, this.curindex),
									popContainer: document.querySelector('.header-button-area')
								})}
							</div>
							<div className="header-cardPagination-area" style={{ float: 'right' }}>
								{createCardPagination({
									handlePageInfoChange: pageInfo_BtnClick.bind(this),
									dataSource: ARSUB_CONST.ArsubCacheKey
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(this.headId, {
							onAfterEvent: head_afterEvent.bind(this),
							onBeforeEvent: head_beforeEvent.bind(this)
						})}
					</div>
				</div>

				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area scm-credit-extent-btn">
						{createCardTable(this.tableId, {
							tableHead: this.getTableHead,
							onAfterEvent: body_afterEvent.bind(this),
							onBeforeEvent: body_beforeEvent.bind(this),
							onSelected: buttonController.bind(this, this.props),
							onSelectedAll: buttonController.bind(this, this.props),
							showCheck: true,
							hideModelSave: true, // 隐藏整单保存按钮
							inputChange: inputChange.bind(this, ArsubBodyItem.crowno),
							onBatchChange: batchEvent.bind(this), //复制粘贴表体多行
							modelAddRow: spreadAddRow_BtnClick.bind(this), // 侧拉编辑增行
							modelDelRow: spreadDelRow_BtnClick.bind(this), // 侧拉编辑删行
							adaptionHeight: true,
							isAddRow: false,
							hideAdd: this.state.isHideAdd
						})}
					</div>
					{/* 单据联查 */}
					<BillTrack
						show={this.state.showBillTrack}
						close={() => {
							this.setState({ showBillTrack: false });
						}}
						pk={this.state.billid} //单据id
						type="35" //单据类型
					/>
					{/* 附件管理 */}
					{this.state.showUploader && (
						<NCUploader
							billId={this.state.billid}
							billNo={this.state.vbillcode}
							onHide={() => {
								this.setState({
									showUploader: false
								});
							}}
						/>
					)}
					{/* 审批详情 */}
					<div>
						<ApproveDetail
							show={this.state.showApproveDetail}
							close={() => {
								this.setState({
									showApproveDetail: false
								});
							}}
							billtype={this.state.transTypeCode}
							billid={this.state.billid}
						/>
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
						{/* 提交指派适配 */}
						{this.state.compositedisplay && (
							<ApprovalTrans
								title={getLangByResId(this, '4006ARSUB-000019')} /* 国际化处理： 指派*/
								data={this.state.compositedata}
								display={this.state.compositedisplay}
								getResult={this.getAssginUsedr}
								cancel={() => {
									this.setState({ compositedisplay: false });
								}}
							/>
						)}
					</div>
					<div>
						{createModal('modal', {
							content: '',
							rightBtnName: ''
						})}
						{createModal('MessageDlg', {
							size: 'xlg'
						})}
						{createModal('code-config')}
						{/* 打印次数 */}
						{createModal('printService', {
							className: 'print-service'
						})}
						<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} sandbox />
					</div>

					<Inspection
						show={this.state.showInspection}
						sourceData={this.state.inspectionSourceData}
						cancel={() => {
							this.setState({ showInspection: false });
						}}
						affirm={() => {
							this.setState({ showInspection: false });
						}}
					/>
				</div>
			</div>
		);
	};
	// 界面组装
	render() {
		let transfer = this.props.getUrlParam('buttonType');
		if (transfer != undefined && transfer.indexOf('ref') != -1) {
			return this.initForTransfer();
		} else {
			return this.initForSelf();
		}
	}
}

function getUrlParam(fun, key) {
	if (fun) {
		try {
			return fun(key);
		} catch (error) {
			// 当抛出异常时，不返回数据
		}
	}
}

ArsubCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: ARSUB_CONST.cardPageId,
		headcode: ARSUB_CONST.formId,
		bodycode: { [ARSUB_CONST.tableId]: 'cardTable' }
	},
	// Tab快捷键适配
	orderOfHotKey: [ ARSUB_CONST.formId, ARSUB_CONST.tableId ]
})(ArsubCard);

export default ArsubCard;
