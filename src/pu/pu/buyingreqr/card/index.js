/*
 * @Author: zhangchangqing
 * @PageInfo: 形态转换，卡片态
 * @Date: 2018-05-04 15:50:44
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-02-21 14:00:15
 */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
const { BillTrack } = high;
let { NCAffix, NCDiv } = base;
import Inspection from 'epmp/exports/components/Inspection';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import { initTemplate } from './init';
import './index.less';
import { pageInfoClick, onHandBtnSelected } from './btnClicks';
import { BUYINGREQ_CARD, ATTRCODE, BUYINGREQ_LIST, ATTRCODES } from '../siconst';
import ExtendRefer from 'ic/ic/components/onhandRefer'; //引入存量查拣组件
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { afterEvent } from './afterEvents';
import { beforeEvent, bodyBeforeEvents } from './beforeEvents';
import { buttonController, btnClickController } from './viewControl';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
let formId = BUYINGREQ_CARD.formId; //'head';
let tableId = BUYINGREQ_CARD.tableId; //'body';

class BuyingreqCard extends Component {
	constructor(props) {
		super(props);
		this.formId = BUYINGREQ_CARD.formId;
		this.tableId = BUYINGREQ_CARD.tableId;
		this.pageId = BUYINGREQ_CARD.cardpageid; //BUYINGREQ_CARD
		props.use.form(this.formId);
		props.use.cardTable(this.tableId);
		this.state = {
			vbillcode: '', //订单编号
			billId: '', //单据id
			templetid: '', //模板ID
			onhandShow: false, // 存量查拣的显示隐藏
			headRows: { rows: [] }, //存量查拣 表头数据
			lineShowType: [], //通过数组的方式控制 列按钮显示   1-收起   0-展开
			status: this.props.getUrlParam(BUYINGREQ_CARD.status),
			showTrack: false,
			pk: '',
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false, //审批详情展示控制
			billtype: '' //单据交易类型
		};
		this.ts = '';
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004praybillr', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
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
				return getLangByResId(this, '4004PRAYBILLR-000015'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
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
	isActionEnable = () => {
		let fbillstatus = this.props.form.getFormItemsValue(formId, 'fbillstatus').value;

		if (fbillstatus != 1 && fbillstatus != 8) {
			let isEnable = { delete: true, edit: true };
			this.props.button.setDisabled(isEnable);
		}
	};
	//切换页面状态
	toggleShow = () => {
		let status = this.props.getUrlParam(BUYINGREQ_CARD.status);
		buttonController.setUIState.call(this, this.props, status);
		buttonController.setCardButtonVisiable.call(this, this.props, status);
	};

	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: BUYINGREQ_CARD.tableId,
					onButtonClick: btnClickController.bind(this),
					ignoreHotkeyCode: getCardDisableHotKeyBtn()
				})}
			</div>
		);
	};
	// 控制存量查拣的显示隐藏
	toggleOnhandShow = () => {
		this.setState({ onhandShow: !this.state.onhandShow });
	};
	// 主方法
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createForm } = form;
		let status = this.props.getUrlParam(BUYINGREQ_CARD.status) || BUYINGREQ_CARD.browse;
		let { headRows = { rows: [] } } = this.state;
		let { createCardTable } = cardTable;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const { socket } = this.props;
		const { createModal } = modal;
		let { showUploader, target } = this.state;
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
										this.props.pushTo(BUYINGREQ_CARD.listUrl, {
											pagecode: BUYINGREQ_CARD.listpageid
										});
									}
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createErrorFlag({
									headBtnAreaCode: formId
								})}
								{this.props.button.createButtonApp({
									area: BUYINGREQ_CARD.formId,
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
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					{/* 表体 */}
					<div className="nc-bill-table-area scm-ic-extent-btn">
						{/* {this.getTableHead(buttons)} */}

						{createCardTable(this.tableId, {
							//modelSave: buttonClick.bind(this, this.props, 'save'),
							showCheck: true,
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: bodyBeforeEvents.bind(this),
							onSelected: buttonController.lineSelected.bind(this),
							hideModelSave: true,
							// inModal: true, // 模态框表格自适应
							inputChange: inputChange.bind(this, ATTRCODES.crowno),
							onSelectedAll: buttonController.lineSelected.bind(this),
							tableHead: this.getTableHead.bind(this, buttons),
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
					editable={status == BUYINGREQ_CARD.edit}
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
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.billtype}
						billid={this.state.billId}
					/>
				</div>
				{/* 交互式异常模态框 */}
				<div>
					{createModal('ResumeMessageMlg', {
						className: 'iframe-modal',
						size: 'xlg'
					})}
					{createModal('MessageDlg', {
						size: 'xlg'
					})}
				</div>
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
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
