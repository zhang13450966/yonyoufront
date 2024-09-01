/*
 * @Author: 刘奇 
 * @PageInfo: 代垫运费发票卡片态  
 * @Date: 2019-03-05 14:37:09 
 * @Last Modified by: wangpju
 * @Last Modified time: 2022-04-01 13:37:14
 */

import React, { Component } from 'react';
import { base, createPage, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import {
	commonSearch_BtnClick,
	buttonClick,
	pageInfo_BtnClick,
	commit_BtnClick,
	saveCommit_BtnClick,
	spreadAddRow_BtnClick,
	spreadDelRow_BtnClick,
	searchForCopy_BtnClick,
	transferBill,
	transfer4804Bill
} from './btnClicks';
import {
	PREPAIDINVOICE_CONST,
	BUTTON_AREA,
	BUTTON,
	PrepaidinvoiceHeadItem,
	BILLTYPE,
	PrepaidinvoiceBodyItem
} from '../const';
import buttonController from './viewController/buttonController';
import { head_afterEvent, body_afterEvent, body_beforeEvent, head_beforeEvent } from './events';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showBackWarningDialog } from '../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { changeUrlParam } from '../../../../scmpub/scmpub/pub/cache';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCAffix, NCDiv } = base;

class PrepaidinvoiceCard extends Component {
	constructor(props) {
		super(props);
		this.headId = PREPAIDINVOICE_CONST.formId;
		this.tableId = PREPAIDINVOICE_CONST.tableId;
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
		this.skipCodes = [];
		this.state = {
			currentLocale: 'en-US',
			// 单据联查使用
			showBillTrack: false,
			// 附件管理
			showUploader: false,
			billid: null,
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
			copyRowDatas: null, // 复制行信息
			// 多语
			json: {},
			inlt: null,
			saveAndCommit: false
		};
		this.listData = null;
		this.curindex = 0;
		this.cardLastId = null;
	}

	getAssginUsedr = (value) => {
		// add by huoyzh 云原生保存提交适配
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
		initLang(this, [ '4001prepaidinvoice' ], 'scmpub', initTemplate.bind(this, this.props));
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(this.tableId);
			if (status == PREPAIDINVOICE_CONST.edit) {
				return getLangByResId(this, '4006PREPAIDINVOICE-000010'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	initData = () => {
		let buttonType = this.props.getUrlParam('buttonType');
		let srcid = this.props.getUrlParam('srcid');
		if (buttonType != undefined && buttonType.indexOf('ref') != -1) {
			if (buttonType == 'ref4804') {
				transfer4804Bill.call(this, this.props);
			} else {
				transferBill.call(this, this.props, buttonType);
			}
		} else if (srcid) {
			this.cardLastId = this.props.getUrlParam('id') ? this.props.getUrlParam('id') : null;
			// 复制单据
			changeUrlParam(this.props, {
				status: PREPAIDINVOICE_CONST.edit,
				buttonType: BUTTON.copy,
				id: ''
			});
			searchForCopy_BtnClick.call(this, this.props, srcid);
		} else {
			let hid = this.props.getUrlParam('id');
			commonSearch_BtnClick.call(this, this.props, hid);
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
			let isleft = this.props.transferTable.getTransformFormStatus(PREPAIDINVOICE_CONST.left);
			if (isleft === false) {
				showBackWarningDialog({
					beSureBtnClick: () => {
						// 返回逻辑
						this.beSureBtnClick.call(this, this.props, path);
					}
				});
			} else {
				if (transfer == 'ref4804') {
					//清空已选数据
					this.props.transferTable.clearAllSelectedData();
				}
				//返回转单页面时刷新
				this.beSureBtnClick.call(this, this.props, path, true);
			}
		} else {
			this.beSureBtnClick(this.props, PREPAIDINVOICE_CONST.List_URL);
		}
	};
	beSureBtnClick = (props, path, isRefresh) => {
		if (isRefresh) {
			props.pushTo(path, { refresh: 'true', pagecode: PREPAIDINVOICE_CONST.listPageId });
		} else {
			props.pushTo(path, { pagecode: PREPAIDINVOICE_CONST.listPageId });
		}
	};
	// 转单左侧列表点击切换事件
	transferListClick = (record, index, status, formStatus) => {
		this.curindex = index;
		//点击转单缩略图的钩子函数
		this.props.beforeUpdatePage();

		let hid = record.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.hid].value;
		let billcode = record.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.vbillcode].value;

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			billCode: billcode == null ? '' : billcode //修改单据号---非必传
		});

		// RownoUtils.setRowNo(this.props, PREPAIDINVOICE_CONST.tableId);
		// status === true 说明该单保存过
		if (formStatus === PREPAIDINVOICE_CONST.browse) {
			this.props.form.setAllFormValue({
				[PREPAIDINVOICE_CONST.formId]: record.head[PREPAIDINVOICE_CONST.formId]
			});
			this.props.cardTable.setTableData(PREPAIDINVOICE_CONST.tableId, record.body[PREPAIDINVOICE_CONST.tableId]);
		} else {
			this.props.form.setAllFormValue(
				{ [PREPAIDINVOICE_CONST.formId]: record.head[PREPAIDINVOICE_CONST.formId] },
				false
			);
			this.props.cardTable.setTableData(
				PREPAIDINVOICE_CONST.tableId,
				record.body[PREPAIDINVOICE_CONST.tableId],
				null,
				false
			);
		}
		changeUrlParam(this.props, { id: hid == null ? '' : hid, status: formStatus });

		buttonController.call(this, this.props);
		this.props.updatePage(PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId);
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
			<div id="scm-scm-prepaidinvoice-transfercard" className="nc-bill-transferList">
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
						headcode: PREPAIDINVOICE_CONST.formId,
						bodycode: PREPAIDINVOICE_CONST.tableId,
						transferListId: PREPAIDINVOICE_CONST.left, //转单列表id
						searchAreaCode: PREPAIDINVOICE_CONST.searchId,
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
								showCheck: true,
								hideModelSave: true, // 隐藏整单保存按钮
								modelAddRow: spreadAddRow_BtnClick.bind(this), // 侧拉编辑增行
								modelDelRow: spreadDelRow_BtnClick.bind(this), // 侧拉编辑删行
								inputChange: inputChange.bind(this, PrepaidinvoiceBodyItem.crowno),
								adaptionHeight: true
							})}
						</div>
						{/* 单据联查 */}
						<BillTrack
							show={this.state.showBillTrack}
							close={() => {
								this.setState({ showBillTrack: false });
							}}
							pk={this.state.billid} //单据id
							type={BILLTYPE.prepaidinvoice} //单据类型
						/>
						{/* 附件管理 */}
						{this.state.showUploader && (
							<NCUploader
								billId={this.state.billid}
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
									title={getLangByResId(this, '4006PREPAIDINVOICE-000019')} /* 国际化处理： 指派*/
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
						</div>
					</div>
				</div>
				<div>
					{socket.connectMesg({
						headBtnAreaCode: BUTTON_AREA.Card_Head, // 表头按钮区域ID
						formAreaCode: PREPAIDINVOICE_CONST.formId, // 表头Form区域ID
						billtype: '4816',
						billpkname: PrepaidinvoiceHeadItem.hid,
						dataSource: PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
					})}
				</div>
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
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
									dataSource: PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
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
							inputChange: inputChange.bind(this, PrepaidinvoiceBodyItem.crowno),
							modelAddRow: spreadAddRow_BtnClick.bind(this), // 侧拉编辑增行
							modelDelRow: spreadDelRow_BtnClick.bind(this), // 侧拉编辑删行
							adaptionHeight: true
						})}
					</div>
					{/* 单据联查 */}
					<BillTrack
						show={this.state.showBillTrack}
						close={() => {
							this.setState({ showBillTrack: false });
						}}
						pk={this.state.billid} //单据id
						type={BILLTYPE.prepaidinvoice} //单据类型
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
								title={getLangByResId(this, '4006PREPAIDINVOICE-000019')} /* 国际化处理： 指派*/
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
					</div>
					{socket.connectMesg({
						headBtnAreaCode: BUTTON_AREA.Card_Head, // 表头按钮区域ID
						formAreaCode: PREPAIDINVOICE_CONST.formId, // 表头Form区域ID
						billtype: '4816',
						billpkname: PrepaidinvoiceHeadItem.hid,
						dataSource: PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey
					})}
				</div>
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
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

PrepaidinvoiceCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PREPAIDINVOICE_CONST.cardPageId,
		headcode: PREPAIDINVOICE_CONST.formId,
		bodycode: { [PREPAIDINVOICE_CONST.tableId]: 'cardTable' }
	},
	// Tab快捷键适配
	orderOfHotKey: [ PREPAIDINVOICE_CONST.formId, PREPAIDINVOICE_CONST.tableId ]
})(PrepaidinvoiceCard);

export default PrepaidinvoiceCard;
