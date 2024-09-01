/*
 * @Author: 刘奇 
 * @PageInfo: 客户费用单列表 
 * @Date: 2019-03-01 14:08:30 
 * @Last Modified by: wangpju
 * @Last Modified time: 2022-04-01 13:30:29
 */
import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
import { initTemplate, initDataFromLinkQuery } from './init';
import { search_BtnClick, pageTurn_BtClick, buttonClick, double_BtnClick, commit_BtnClick } from './btnClicks';
import { buttonControl } from './viewController/buttonController';
import { ARSUB_CONST, BUTTON_AREA, ArsubHeadItem, ArsubQueryBodyItem } from '../const';
import { search_afterEvent } from './events';
import { renderCompleteEvent } from '../../pub/queryarea/queryAreaInit';
import SplitPrintDlg from 'scmpub/scmpub/components/SplitPrinting';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import Inspection from 'epmp/exports/components/Inspection';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { NCDiv } = base;
const { BillTrack } = high;

class ArsubList extends Component {
	constructor(props) {
		super(props);
		props.use.search(ARSUB_CONST.searchId);
		props.use.table(ARSUB_CONST.formId);
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
			showInspection: false, //联查预算
			inspectionSourceData: null
		};
		this.commitInfo = {};
	}

	getAssginUsedr = (value) => {
		let { record, index } = this.commitInfo;
		//重新执行提交操作重新执行提交操作
		commit_BtnClick.call(this, this.props, record, index, value);
		this.setState({ compositedisplay: false });
	};

	componentWillMount() {
		initLang(this, [ '4001arsub' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	CompleteEvent() {
		renderCompleteEvent.call(
			this,
			ARSUB_CONST.searchId,
			ArsubHeadItem.pk_org,
			search_afterEvent,
			ArsubHeadItem.ctrantypeid
		);
		renderCompleteEvent.call(this, ARSUB_CONST.searchId, ArsubHeadItem.csaleorgid, search_afterEvent);
		renderCompleteEvent.call(
			this,
			ARSUB_CONST.searchId,
			ArsubQueryBodyItem.cpayorgid,
			search_afterEvent,
			ArsubQueryBodyItem.cpaydeptid
		);
		renderCompleteEvent.call(this, ARSUB_CONST.searchId, ArsubQueryBodyItem.cprofitcenterid, search_afterEvent);
	}
	componentDidMount() {
		//联查加载数据
		initDataFromLinkQuery.call(this, this.props);
	}
	render() {
		let { table, button, search, modal, socket } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		const { createModal } = modal;

		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-button-area">
						{createButtonApp({
							area: BUTTON_AREA.List_Head,
							buttonLimit: 8,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</NCDiv>

				<div className="nc-bill-search-area">
					{NCCreateSearch(ARSUB_CONST.searchId, {
						dataSource: ARSUB_CONST.ArsubCacheKey,
						clickSearchBtn: search_BtnClick.bind(this),
						onAfterEvent: search_afterEvent.bind(this),
						renderCompleteEvent: this.CompleteEvent.bind(this),
						statusChangeEvent: this.CompleteEvent.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(ARSUB_CONST.formId, {
						dataSource: ARSUB_CONST.ArsubCacheKey,
						handlePageInfoChange: pageTurn_BtClick.bind(this),
						showCheck: true,
						showIndex: true,
						onRowDoubleClick: double_BtnClick.bind(this),
						onSelected: buttonControl.bind(this),
						onSelectedAll: buttonControl.bind(this),
						pkname: ArsubHeadItem.carsubid,
						//缓存数据赋值成功的钩子函数
						//若初始化数据后需要对数据做修改，可以在这里处理
						componentInitFinished: buttonControl.bind(this, this.props)
					})}
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
				{socket.connectMesg({
					tableAreaCode: ARSUB_CONST.formId,
					billpkname: ArsubHeadItem.carsubid,
					billtype: '35'
				})}
				{createModal('code-config')}
				{/* 打印次数 */}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}
ArsubList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: ARSUB_CONST.listPageId,
		bodycode: ARSUB_CONST.formId
	}
})(ArsubList);
export default ArsubList;
