/*
 * @Author: mikey.zhangchqf  请购单
 * @Date: 2018-06-26 15:34:46 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:01:08
 */

import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
const { NCDiv } = base;
import { initTemplate } from './init';
import { searchBtnClick, pageInfoClick } from './btnClicks';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import batchCommitBtnClick from '../list/btnClicks/commitBatchBtnClick';
import rowCommitBtnClick from '../list/btnClicks/commitBtnClick';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { buttonController, btnClickController } from './viewControl';
import { TARGETADJ_LIST, ATTRCODE } from '../siconst';
import commonSerach from './btnClicks/commonSearch';
import SaleMarUtils from '../../../refer/SaleMarterial/utls/SaleMarUtls';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCTabsControl } = base;
const { BillTrack } = high;
import ApprovalTrans from 'uap/common/components/approvalTrans';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
class TargetadjList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = TARGETADJ_LIST.moduleId;
		this.head = TARGETADJ_LIST.formId; //
		this.bodyCode = TARGETADJ_LIST.tableId;
		this.searchId = TARGETADJ_LIST.searchId;
		this.pageId = TARGETADJ_LIST.listpageid;
		this.queryAreaCode = TARGETADJ_LIST.searchId;
		this.commitInfo = {
			isBatch: true,
			record: null,
			index: null
		};

		props.use.search(TARGETADJ_LIST.searchId);
		props.use.table(TARGETADJ_LIST.formId);

		this.state = {
			searchFlag: false, //查询校验是否必输
			searchVal: null, //查询条件缓存
			currentTab: TARGETADJ_LIST.toCommit, //默认显示待提交
			toCommitNum: '0', //待提交数量
			approvingNum: '0', //审批中数量
			executingNum: '0', //执行中
			currentLocale: 'en-US',
			test: null,
			showTrack: false,
			compositedisplay: false,
			compositedata: null,
			pk: '',
			billId: '', //单据id
			vbillcode: '', //单据号
			billtype: '4622', //单据交易类型(交易类型)
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false //审批详情展示控制
		};
		initLang(this, [ '4001targetadj', 'refer' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	componentDidMount() {}

	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TARGETADJ_LIST.searchId, []);
		} else if (field == ATTRCODE.ctargetid) {
			multiCorpRefHandler(props, val, TARGETADJ_LIST.searchId, [ 'pk_targetadj_b.cmarsetid' ]);
			SaleMarUtils(props, val, TARGETADJ_LIST.searchId, 'pk_targetadj_b.cmarsetid');
		}
	}
	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		//更新当前页签编码
		setDefData(TARGETADJ_LIST.dataSource, 'currentTab', tabCode);
		let searchVal = getDefData(TARGETADJ_LIST.dataSource, 'searchVal');
		if (TARGETADJ_LIST.all == tabCode) {
			if (searchVal == null) {
				// 点击全部页签时，若未输入查询条件，就不查
				let rowsData = { rows: [] };
				this.props.table.setAllTableData(TARGETADJ_LIST.formId, rowsData);
				buttonController.setListButtonVisiable(this.props, null);
				return;
			}
		}
		commonSerach.bind(this, tabCode, searchVal)(); // 调用查询方法
		buttonController.setListButtonVisiable(this.props, null);
	};
	//主组织编辑后回调
	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, TARGETADJ_LIST.searchId, ATTRCODE.ctrantypeid);
		let pk_org = this.props.search.getSearchValByField(TARGETADJ_LIST.searchId, ATTRCODE.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.afterEvent.call(this, this.props, ATTRCODE.pk_org, arr);
		}
	};
	getDefaultKey = () => {
		let tabcode = TARGETADJ_LIST.toCommit;
		let currentTab = getDefData.call(this, TARGETADJ_LIST.dataSource, 'currentTab');
		if (currentTab) {
			tabcode = currentTab;
		} else {
			setDefData(TARGETADJ_LIST.dataSource, 'currentTab', tabcode);
		}
		if (tabcode == TARGETADJ_LIST.toCommit) {
			return 0;
		} else if (tabcode == TARGETADJ_LIST.approving) {
			return 1;
		} else if (tabcode == TARGETADJ_LIST.executing) {
			return 2;
		} else {
			return 3;
		}
	};

	doubleClick = (record, index) => {
		let pk_targetadj = record.pk_targetadj.value;
		this.props.pushTo(TARGETADJ_LIST.cardUrl, {
			status: TARGETADJ_LIST.browse,
			id: pk_targetadj,
			pagecode: TARGETADJ_LIST.cardpageid
		});
	};
	getAssginUsedr = (value) => {
		//重新执行提交操作重新执行提交操作
		if (this.commitInfo.isBatch) {
			batchCommitBtnClick.call(this, this.props, value);
		} else {
			let { record, index } = this.commitInfo;
			rowCommitBtnClick.call(this, this.props, record, index, value);
		}
		this.setState({ compositedisplay: false });
	};

	render() {
		let { table, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader } = this.state;
		const { createModal } = modal;
		const { socket } = this.props;

		let toCommitNum = '0';
		let approvingNum = '0';
		let executingNum = '0';
		let tubNum = getDefData(TARGETADJ_LIST.dataSource, 'tubNum');
		if (tubNum) {
			toCommitNum = tubNum.toCommitNum;
			approvingNum = tubNum.approvingNum;
			executingNum = tubNum.executingNum;
		}
		let defaultTabCode = TARGETADJ_LIST.toCommit;
		let tabCode = getDefData(TARGETADJ_LIST.dataSource, 'currentTab');
		if (tabCode) {
			defaultTabCode = tabCode;
		}

		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: TARGETADJ_LIST.formId,
					billpkname: ATTRCODE.pk_targetadj,
					billtype: '20'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 请购单*/}
					</div>
					{/* 按钮区 */}
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: this.searchId,
							onButtonClick: btnClickController.bind(this)
						})}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({ showTrack: false });
							}}
							pk={this.state.pk}
							type={TARGETADJ_LIST.billType}
						/>
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						dataSource: TARGETADJ_LIST.dataSource,
						pkname: ATTRCODE.pk_targetadj,
						clickSearchBtn: searchBtnClick.bind(
							this,
							getDefData.call(this, TARGETADJ_LIST.dataSource, 'currentTab')
						),
						onAfterEvent: this.afterEvent.bind(this, this.props),
						defaultConditionsNum: 9,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="tab-definInfo-area">
					{/* 页签区 */}
					<NCTabsControl defaultKey={this.getDefaultKey()}>
						<div key={0} clickFun={() => this.tabChange(TARGETADJ_LIST.toCommit)}>
							{`${getLangByResId(this, '4001TARGETADJ-000038')} (${toCommitNum})`}
							{/* 国际化处理： 待提交*/}
						</div>
						<div key={1} clickFun={() => this.tabChange(TARGETADJ_LIST.approving)}>
							{`${getLangByResId(this, '4001TARGETADJ-000039')} (${approvingNum})`}
							{/* 国际化处理： 审批中*/}
						</div>
						<div key={2} clickFun={() => this.tabChange(TARGETADJ_LIST.executing)}>
							{`${getLangByResId(this, '4001TARGETADJ-000040')} (${executingNum})`}
							{/* 国际化处理： 执行中*/}
						</div>
						<div key={3} clickFun={() => this.tabChange(TARGETADJ_LIST.all)}>
							{getLangByResId(this, '4001TARGETADJ-000041')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(TARGETADJ_LIST.formId, {
						dataSource: TARGETADJ_LIST.dataSource,
						pkname: ATTRCODE.pk_targetadj,
						//显示序号
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, TARGETADJ_LIST.dataSource, 'currentTab')
						),
						onSelectedAll: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, TARGETADJ_LIST.dataSource, 'currentTab')
						),
						componentInitFinished: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, TARGETADJ_LIST.dataSource, 'currentTab')
						)
					})}
				</div>
				<div>
					{showUploader && (
						<NCUploader
							billId={this.state.billId}
							onHide={() => {
								this.setState({
									showUploader: false
								});
							}}
							billNo={this.state.vbillcode}
						/>
					)}
				</div>
				<div>
					<ApproveDetail
						show={this.state.show}
						close={() => {
							this.setState({
								show: false
							});
						}}
						billtype={this.state.billtype}
						billid={this.state.billId}
					/>
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
				{createModal('modelList', {
					title: getLangByResId(this, '4001TARGETADJ-000036') /* 国际化处理： 注意*/,
					content: getLangByResId(this, '4001TARGETADJ-000037') /* 国际化处理： 确定要删除吗?*/
				})}
			</div>
		);
	}
}
TargetadjList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: TARGETADJ_LIST.listpageid,
		bodycode: TARGETADJ_LIST.formId
	}
})(TargetadjList);
export default TargetadjList;
