/*
 * @Author: 刘奇 
 * @PageInfo: 代垫运费发票列表 
 * @Date: 2019-03-01 14:08:30 
 * @Last Modified by: wangpju
 * @Last Modified time: 2022-04-01 13:24:46
 */
import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { search_BtnClick, pageTurn_BtClick, buttonClick, double_BtnClick, commit_BtnClick } from './btnClicks';
import { buttonControl } from './viewController/buttonController';
import { PREPAIDINVOICE_CONST, BUTTON_AREA, PrepaidinvoiceHeadItem, BILLTYPE } from '../const';
import { search_afterEvent } from './events';
import { renderCompleteEvent } from '../../pub/queryarea/queryAreaInit';
import SplitPrintDlg from 'scmpub/scmpub/components/SplitPrinting';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCAffix, NCDiv } = base;
class PrepaidinvoiceList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PREPAIDINVOICE_CONST.searchId);
		props.use.table(PREPAIDINVOICE_CONST.formId);
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
			compositedata: null
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
		initLang(this, [ '4001prepaidinvoice' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	render() {
		let { table, button, search, modal, socket } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		const { createModal } = modal;
		return (
			<div className="nc-bill-list">
				<NCAffix>
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
				</NCAffix>
				<div className="nc-bill-search-area">
					{NCCreateSearch(PREPAIDINVOICE_CONST.searchId, {
						dataSource: PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey,
						clickSearchBtn: search_BtnClick.bind(this),
						onAfterEvent: search_afterEvent.bind(this),
						renderCompleteEvent: renderCompleteEvent.bind(
							this,
							PREPAIDINVOICE_CONST.searchId,
							PrepaidinvoiceHeadItem.pk_org,
							search_afterEvent
						),
						statusChangeEvent: renderCompleteEvent.bind(
							this,
							PREPAIDINVOICE_CONST.searchId,
							PrepaidinvoiceHeadItem.pk_org,
							search_afterEvent
						)
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(PREPAIDINVOICE_CONST.formId, {
						dataSource: PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey,
						handlePageInfoChange: pageTurn_BtClick.bind(this),
						showCheck: true,
						showIndex: true,
						onRowDoubleClick: double_BtnClick.bind(this),
						onSelected: buttonControl.bind(this),
						onSelectedAll: buttonControl.bind(this),
						pkname: PrepaidinvoiceHeadItem.hid,
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
				</div>
				{/* 云原生适配 add by huoyzh*/}
					{socket.connectMesg({
						tableAreaCode: PREPAIDINVOICE_CONST.formId,
						billpkname: PrepaidinvoiceHeadItem.hid,
						billtype: '4816'
					})}
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}
PrepaidinvoiceList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PREPAIDINVOICE_CONST.listPageId,
		bodycode: PREPAIDINVOICE_CONST.formId
	}
})(PrepaidinvoiceList);
export default PrepaidinvoiceList;
