/*
 * @Author: zhangchangqing
 * @PageInfo: 形态转换，卡片态
 * @Date: 2018-05-04 15:50:44
 * @Last Modified by: chaiwx
 * @Last Modified time: 2022-03-11 09:24:34
 */
import React, { Component } from 'react';
import { createPage, ajax, base, high } from 'nc-lightapp-front';
let { NCAffix, NCDiv } = base;
const { BillTrack } = high;
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import ApprovalTrans from 'uap/common/components/approvalTrans';

import { initTemplate } from './init';
import { pageInfoClick, getParentURlParme, saveAndCommit } from './btnClicks';
import { TARGETADJ_CARD, TARGETADJ_CARD_BUTTON, TARGETADJ_LIST, ATTRCODE, ATTRCODES } from '../siconst';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import MergePrinting from 'scmpub/scmpub/components/mergePrinting';
import commitBtn from './btnClicks/commitBtnClick';
import { afterEvent } from './afterEvents';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { beforeEvent, bodyBeforeEvents } from './beforeEvents';
import { buttonController, btnClickController } from './viewControl';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
let formId = TARGETADJ_CARD.formId;
let tableId = TARGETADJ_CARD.tableId;
let parentURL = getParentURlParme(TARGETADJ_CARD.pageMsgType);
class TargetadjCard extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.curindex = 0; //记录拉单推单的当前操作位置
		this.tableId = tableId;
		this.combineData; //合并显示
		this.pageId = TARGETADJ_CARD.cardpageid; //TARGETADJ_CARD
		this.skipCodes = []; //交互式异常码
		this.meta;
		this.ctargetvalue;
		this.fcyclesetflag;
		this.oldtabledata = {}; //用来保存card_body_old区域的数据
		props.use.form(TARGETADJ_CARD.formId, TARGETADJ_CARD.headf);
		props.use.cardTable(TARGETADJ_CARD.tableId, TARGETADJ_CARD.tableOldId);

		this.state = {
			showPrice: false, //控制价格论证表显示
			copy_billId: '', //卡片页点击新增单据或者复制单据时用来缓存单据号 编辑态取消时使用
			vbillcode: '', //订单编号
			billId: '', //单据id
			appcode: '', //返回推单交易时参数
			returnURL: TARGETADJ_LIST.transferUrl, //转单界面返回路径，默认是返回拉单界面
			returnType: TARGETADJ_LIST.transfer, //转单界面返回路径，默认是transfer
			billtype: '4622', //单据交易类型(交易类型)
			listdata: '', //转单后编辑数据缓存
			currentindex: 0, //转单后编辑数据缓存
			lineShowType: [], //通过数组的方式控制 列按钮显示   1-收起   0-展开
			headRows: { rows: [] }, //存量查拣 表头数据
			onhandShow: false, // 存量查拣的显示隐藏
			showConditionModal: false, // 合并显示
			targetvalue: false, //指标比例标识
			status: this.props.getUrlParam(TARGETADJ_CARD.status),
			pageId: this.props.getUrlParam(TARGETADJ_CARD.pageid),
			showTrack: false,
			templetid: '', //模板ID
			pk: '',
			compositedisplay: false,
			compositedata: null,
			index: 0, //不知道干嘛的 记录拉单推单的当前操作位置
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false, //审批详情展示控制
			saveAndCommit: false //是否保存提交
		};
		this.ts = '';
		this.indexstatus = {};

		initLang(this, [ '4001targetadj', 'refer' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(tableId);
			if (status == TARGETADJ_CARD.edit || status == TARGETADJ_CARD.add) {
				return getLangByResId(this, '4001TARGETADJ-000023'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	componentDidMount() {
		//设置状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: this.state.vbillcode //修改单据号---非必传
		});
	}

	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	isActionEnable = () => {
		let fstatusflag = this.props.form.getFormItemsValue(formId, 'fstatusflag').value;

		if (fstatusflag != 1 && fstatusflag != 8) {
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
		let status = this.props.getUrlParam(TARGETADJ_CARD.status);
		//推单标识
		let channelType = this.props.getUrlParam(TARGETADJ_CARD.channelType);
		let type = this.props.getUrlParam(TARGETADJ_CARD.type);
		//如果是拉单页面进入 ，则显示退出转单按钮；推单不显示
		if (type || channelType) {
			status = this.indexstatus[this.curindex];
			if (channelType) {
				this.props.button.setButtonVisible([ TARGETADJ_CARD_BUTTON.CancelTransfer ], false);
			} else {
				this.props.button.setButtonVisible([ TARGETADJ_CARD_BUTTON.CancelTransfer ], true);
			}
		} else {
			this.props.button.setButtonVisible([ TARGETADJ_CARD_BUTTON.CancelTransfer ], false);
		}
		buttonController.setUIState.call(this, this.props, status);
		buttonController.setBackButtonVisiable.call(this, this.props, parentURL);
		buttonController.setCardButtonVisiable.call(this, this.props, status, parentURL);
	};
	setParameterForURL = (status, billId) => {
		let channelType = this.props.getUrlParam(TARGETADJ_CARD.channelType);
		let type = this.props.getUrlParam(TARGETADJ_CARD.type);
		if (channelType) {
			this.props.pushTo(TARGETADJ_CARD.cardUrl, {
				status: status,
				id: billId,
				channelType: channelType,
				pagecode: TARGETADJ_CARD.cardpageid
			});
		}
		if (type) {
			this.props.pushTo(TARGETADJ_CARD.cardUrl, {
				status: status,
				id: billId,
				type: type,
				pagecode: TARGETADJ_CARD.cardpageid
			});
		}
	};
	//删除单据
	delConfirm = () => {
		ajax({
			url: TARGETADJ_CARD.deleteURL,
			data: {
				id: this.props.getUrlParam(TARGETADJ_CARD.id),
				ts: this.props.form.getFormItemsValue(this.formId, TARGETADJ_CARD.ts).value
			},
			success: () => {
				this.props.pushTo('../list', { pagecode: TARGETADJ_LIST.listpageid });
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
			return TARGETADJ_LIST.transferDataSource;
		} else if (channelType) {
			if (channelType == TARGETADJ_CARD.replenishmentarrange) {
				return TARGETADJ_CARD.channelTypeDataSource1;
			} else if (channelType == TARGETADJ_CARD.directarrange) {
				return TARGETADJ_CARD.channelTypeDataSource2;
			}
		}
	};
	// 主方法
	render() {
		let { cardTable, form, modal, cardPagination } = this.props;
		const { createForm } = form;
		let { createCardTable } = cardTable;
		const { createCardPagination } = cardPagination;
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
										this.props.pushTo(TARGETADJ_CARD.listUrl, {
											pagecode: TARGETADJ_CARD.listpageid
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
									type={TARGETADJ_CARD.billType}
								/>
							</div>
							{/* 上一页/下一页 */}
							<div className="header-cardPagination-area">
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: TARGETADJ_LIST.dataSource
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表头 */}
					<div className="nc-bill-form-area">
						{createForm(TARGETADJ_CARD.headf, {
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
					{/* 表头 */}
					<div className="nc-bill-form-area">
						{createForm(this.formId, {
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					{/* 表体 */}
					<div className="nc-bill-table-area scm-ic-extent-btn">
						{createCardTable(this.tableId, {
							showCheck: true,
							showIndex: true,
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: bodyBeforeEvents.bind(this),
							onSelected: buttonController.lineSelected.bind(this),
							hideModelSave: true,
							//隐藏视图切换按钮
							hideSwitch: () => {
								return false;
							},
							inputChange: inputChange.bind(this, ATTRCODES.crowno),
							onSelectedAll: buttonController.lineSelected.bind(this),
							tableHead: this.getTableHead.bind(this, buttons),
							modelAddRow: () => {},
							adaptionHeight: true
						})}
					</div>
				</div>
				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4001TARGETADJ-000025')} /* 国际化处理： 指派*/
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
				<div>{showUploader && <NCUploader billId={this.state.billId} onHide={this.onHideUploader} />}</div>
				{createModal(TARGETADJ_CARD.orgChange)}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.billtype}
						billid={this.state.billId}
					/>
				</div>
				{createModal('delModal')}
				{createModal('ScriptActionDlg', {
					title: getLangByResId(this, '4001TARGETADJ-000003') /* 国际化处理： 提示*/
				})}
			</div>
		);
	}
	createConnectMesg = (socket) => {
		return (
			<div>
				{socket.connectMesg({
					headBtnAreaCode: formId, // 表头按钮区域ID
					formAreaCode: formId, // 表头Form区域ID
					billtype: TARGETADJ_CARD.billType,
					billpkname: ATTRCODE.pk_targetadj
				})}
			</div>
		);
	};
}
TargetadjCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: TARGETADJ_CARD.cardpageid,
		headcode: TARGETADJ_CARD.formId,
		bodycode: {
			[TARGETADJ_CARD.tableId]: 'cardTable'
		}
	},
	orderOfHotKey: [ TARGETADJ_CARD.formId, TARGETADJ_CARD.tableId ]
})(TargetadjCard);
export default TargetadjCard;
