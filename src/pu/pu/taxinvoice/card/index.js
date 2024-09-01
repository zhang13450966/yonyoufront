/*
 * @Author: chaiwx
 * @PageInfo: index
 * @Date: 2018-10-24 11:23:49
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-13 15:53:36
 */

//********************************独立编译包引用******************************************************** */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
//********************************依赖编译包引用******************************************************** */
import { initTemplate } from './init';
import { AREA, PAGECODE, BUTTONAREA, BUTTONID, CACHDATASOURCE, FIELDS } from '../constance';
import { buttonClick } from './btnClicks';
import { headAfterEvents, bodyAfterEvents } from './afterEvents';
import { headBeforeEvents, bodyBeforeEvents } from './beforeEvents';
import pageInfoClick from './btnClicks/pageInfoClick';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import commitBtnClick from './btnClicks/commitBtnClick';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import Inspection from 'epmp/exports/components/Inspection';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCAffix, NCDiv } = base;
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { onRowsSelected } from './viewControl/buttonControl';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';

class TaxinvoiceCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.cardFormId);
		props.use.cardTable(AREA.cardTableId);
		(this.copyRowDatas = null), // 复制行数据
			(this.state = {
				pk_taxinvoice: null,
				showTrack: false,
				vbillcode: null,
				pk: null,
				showModal: null,
				showConditionModal: false,
				target: null,
				showUploader: false,
				ids: null,
				showApprove: false,
				showInspection: false,
				inspectionSourceData: null, //联查预算数据
				billType: null,
				compositedisplay: false,
				compositedata: null
			});

		this.contexts;
		initLang(this, [ '4004taxinvoice' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(AREA.cardTableId);
			if (status == 'edit') {
				return getLangByResId(this, '4004Taxinvoice-000015'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div className="definition-icons">
				{this.props.button.createButtonApp({
					area: BUTTONAREA.card_body,
					onButtonClick: buttonClick.bind(this),
					ignoreHotkeyCode: getCardDisableHotKeyBtn()
				})}
			</div>
		);
	};

	render() {
		let { cardTable, form, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		const { createBillHeadInfo } = this.props.BillHeadInfo;

		// 光标默认聚焦关闭，由业务开发控制，配合props.executeAutoFocus()使用
		this.props.controlAutoFocus(true);

		// 公用组件
		let importActions = () => {
			return (
				<div>
					{this.state.showUploader && (
						<NCUploader
							billId={this.state.pk_taxinvoice}
							target={this.state.target}
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
						pk={this.state.pk_taxinvoice}
						type="4642"
					/>
					{this.state.compositedisplay && (
						<ApprovalTrans
							title={getLangByResId(this, '4004Taxinvoice-000015')} /* 国际化处理： 指派*/
							data={this.state.compositedata}
							display={this.state.compositedisplay}
							getResult={this.getResult.bind(this)}
							cancel={() => {
								this.setState({ compositedisplay: false });
							}}
						/>
					)}
					<ApproveDetail
						show={this.state.showApprove}
						close={() => {
							this.setState({ showApprove: false });
						}}
						billtype={this.state.billtype}
						billid={this.state.pk_taxinvoice}
					/>

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
			);
		};

		return (
			<div className="nc-bill-card" id="scm-to-transin-card">
				<div className="nc-bill-top-area">
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
									pkname: FIELDS.pk_taxinvoice,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(AREA.cardFormId, {
							onAfterEvent: headAfterEvents.bind(this),
							onBeforeEvent: headBeforeEvents.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(AREA.cardTableId, {
							tableHead: this.getTableHead,
							showCheck: true,
							hideModelSave: true,
							hideAdd: true,
							hideDel: true,
							selectedChange: onRowsSelected.bind(this),
							onAfterEvent: bodyAfterEvents.bind(this),
							onBeforeEvent: bodyBeforeEvents.bind(this),
							modelAddRow: () => {
								RownoUtils.setRowNo(this.props, AREA.cardTableId, FIELDS.crowno);
							},
							adaptionHeight: true
						})}
					</div>
				</div>
				{importActions()}
			</div>
		);
	}

	// 提交指派获取结果后重新进行提交
	getResult = (value) => {
		//重新执行提交操作重新执行提交操作
		commitBtnClick.call(this, this.props, null, null, value);
		this.setState({ compositedisplay: false });
	};
}

TaxinvoiceCard = createPage({
	orderOfHotKey: [ AREA.cardFormId, AREA.cardTableId ],
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardPagecode,
		headcode: AREA.cardFormId,
		bodycode: {
			[AREA.cardTableId]: 'cardTable'
		}
	}
})(TaxinvoiceCard);
export default TaxinvoiceCard;
