/*
 * @Author: chaiwx
 * @PageInfo: index
 * @Date: 2018-10-24 11:23:49
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 15:59:50
 */

//********************************独立编译包引用******************************************************** */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
//********************************依赖编译包引用******************************************************** */
import { initTemplate } from './init';
import { AREA, PAGECODE, BILLSTATUS, BUTTONAREA, BUTTONID, CACHDATASOURCE, FIELDS, OPTIONS } from '../constance';
import { buttonClick } from './btnClicks';
import pageInfoClick from './btnClicks/pageInfoClick';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCAffix } = base;
import { buttonControl, onRowsSelected } from '../card/viewControl/buttonControl';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { bodyAfterEvents, headAfterEvents } from './afterEvents';
import { bodyBeforeEvents } from './beforeEvents';
import { headBeforeEvents } from './beforeEvents';
import inputChange from '../../../../scmpub/scmpub/pub/tool/rownoInputUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
class ComparebillCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.cardFormId);
		props.use.cardTable(AREA.cardTableId);
		this.state = {
			pk_comparebill: null,
			showTrack: false,
			vbillcode: null,
			pk: null,
			showModal: null,
			showConditionModal: false,
			target: null,
			showUploader: false,
			ids: null,
			showApprove: false,
			billType: null
		};

		this.transferSaveStatus = false;
		this.isEdit = false;
		this.transferCurrentIndex = 0;
		this.contexts;
		initLang(this, [ '4004comarebill' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(AREA.cardTableId);
			if (status == 'edit') {
				return getLangByResId(this, '4004comarebill-000024'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: BUTTONAREA.card_body,
					onButtonClick: buttonClick.bind(this)
				})}
			</div>
		);
	};

	render() {
		let { cardTable, form, modal, cardPagination, transferTable } = this.props;
		const { createCardPagination } = cardPagination;
		let { createForm } = form;
		let { createModal } = modal;
		let { createCardTable } = cardTable;
		const { createTransferList } = transferTable;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const { NCDiv } = base;
		let transfer = this.props.getUrlParam('option') == OPTIONS.transfer;

		// 光标默认聚焦关闭，由业务开发控制，配合props.executeAutoFocus()使用
		this.props.controlAutoFocus(true);

		// 公用组件
		let importActions = () => {
			return (
				<div>
					{createModal('ResumeMessageDlg', {
						className: 'iframe-modal',
						size: 'xlg'
					})}
					{this.state.showUploader && (
						<NCUploader
							billId={this.state.pk_comparebill}
							onHide={() => {
								this.setState({ showUploader: false });
							}}
						/>
					)}
					<BillTrack
						show={this.state.showTrack}
						close={() => {
							this.setState({ showTrack: false });
						}}
						pk={this.state.pk_comparebill}
						type="2507"
					/>
				</div>
			);
		};

		if (transfer) {
			return (
				<div id="transferCard" className="nc-bill-transferList">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: '', //单据号
									backBtnClick: buttonClick.bind(this, this.props, BUTTONID.Back)
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: BUTTONAREA.card_head,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-transferList-content">
						{createTransferList({
							//表格组件id
							headcode: AREA.cardFormId,
							bodycode: AREA.cardTableId,
							transferListId: AREA.leftarea,
							dataSource: CACHDATASOURCE.dataSourceTransfer,
							pkname: FIELDS.pk_comparebill,
							onTransferItemSelected: (record, status, index) => {
								this.transferSelected.call(this, status, index, record);
							},
							onTransferItemClick: (record, index, status) => {
								this.transferSelected.call(this, status, index, record);
							}
						})}
						<div className="transferList-content-right nc-bill-card" id="puarrival-card">
							<div className="nc-bill-form-area">
								{createForm(AREA.cardFormId, {
									expandArr: [ AREA.cardFormId ],
									onBeforeEvent: headBeforeEvents.bind(this),
									onAfterEvent: headAfterEvents.bind(this)
								})}
							</div>
							<div className="nc-bill-table-area">
								{createCardTable(AREA.cardTableId, {
									tableHead: this.getTableHead,
									showCheck: true,
									hideAdd: true,
									hideModelSave: true,
									adaptionHeight: true,
									selectedChange: onRowsSelected.bind(this),
									onAfterEvent: bodyAfterEvents.bind(this),
									onBeforeEvent: bodyBeforeEvents.bind(this),
									inputChange: inputChange.bind(this, FIELDS.crowno),
									adaptionHeight: true
								})}
							</div>
						</div>
					</div>
					{importActions()}
				</div>
			);
		} else {
			return (
				<div className="nc-bill-card" id="scm-to-transin-card">
					<div className="nc-bill-top-area">
						{/* NCAffix是title固定组件 */}
						<NCAffix>
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-title-search-area">
									{createCardTitle(this, {
										billCode: '', //单据号
										backBtnClick: buttonClick.bind(this, this.props, BUTTONID.Back)
									})}
								</div>
								<div className="header-button-area">
									{this.props.button.createButtonApp({
										area: BUTTONAREA.card_head,
										onButtonClick: buttonClick.bind(this)
									})}
								</div>
								<div className="header-cardPagination-area">
									{createCardPagination({
										dataSource: CACHDATASOURCE.dataSourceList,
										pkname: FIELDS.pk_comparebill,
										handlePageInfoChange: pageInfoClick.bind(this)
									})}
								</div>
							</NCDiv>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(AREA.cardFormId, {
								onBeforeEvent: headBeforeEvents.bind(this),
								onAfterEvent: headAfterEvents.bind(this)
							})}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{createCardTable(AREA.cardTableId, {
								tableHead: this.getTableHead,
								showCheck: true,
								hideAdd: true,
								hideModelSave: true,
								selectedChange: onRowsSelected.bind(this),
								onAfterEvent: bodyAfterEvents.bind(this),
								onBeforeEvent: bodyBeforeEvents.bind(this),
								inputChange: inputChange.bind(this, FIELDS.crowno),
								adaptionHeight: true
							})}
						</div>
					</div>
					{importActions()}
				</div>
			);
		}
	}

	transferSelected(status, index, record) {
		this.isEdit = false;
		this.props.beforeUpdatePage();
		let isEdit = status ? 'browse' : 'edit';
		this.transferSaveStatus = status;
		this.transferCurrentIndex = index;
		this.props.form.setAllFormValue({
			[AREA.cardFormId]: record.head[AREA.cardFormId]
		});
		this.props.cardTable.setTableData(AREA.cardTableId, record.body[AREA.cardTableId], null, true, true);
		RownoUtils.setRowNo(this.props, AREA.cardTableId, FIELDS.crowno);
		let billStatus = record.head.head.rows[0].values.forderstatus.value;
		billStatus = billStatus ? billStatus : BILLSTATUS.free;
		buttonControl.call(this, this.props, billStatus, isEdit);
		this.props.updatePage(AREA.cardFormId, AREA.cardTableId);
	}
}

ComparebillCard = createPage({
	//焦点按顺序定位到第一个可编辑字段
	orderOfHotKey: [ AREA.cardFormId, AREA.cardTableId ],
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardPagecode,
		headcode: AREA.cardFormId,
		bodycode: {
			[AREA.cardTableId]: 'cardTable'
		}
	}
})(ComparebillCard);
export default ComparebillCard;
