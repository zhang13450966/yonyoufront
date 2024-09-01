/*
 * @Author: zhangchqf 
 * @PageInfo: 物资需求申请单列表页 
 * @Date: 2018-12-28 13:23:02 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-02-21 14:14:00
 */

import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
const { NCDiv } = base;
const { BillTrack } = high;
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import { initTemplate } from './init';
import { searchBtnClick, pageInfoClick } from './btnClicks';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import batchCommitBtnClick from '../list/btnClicks/commitBatchBtnClick';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import rowCommitBtnClick from '../list/btnClicks/commitBtnClick';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { STOREREQ_LIST, ATTRCODE } from '../siconst';
import commonSerach from './btnClicks/commonSearch';
import { buttonController, btnClickController } from './viewControl';
const { NCTabsControl } = base;
class StorereqList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = STOREREQ_LIST.moduleId;
		this.head = STOREREQ_LIST.formId; //
		this.bodyCode = STOREREQ_LIST.tableId;
		this.searchId = STOREREQ_LIST.searchId;
		this.pageId = STOREREQ_LIST.listpageid;
		this.queryAreaCode = STOREREQ_LIST.searchId;
		props.use.search(this.searchId);
		props.use.table(STOREREQ_LIST.formId);
		this.commitInfo = {
			isBatch: true,
			record: null,
			index: null
		};
		this.state = {
			morepk_org: true, //编辑前事件控制 多组织
			searchFlag: false, //查询校验是否必输
			searchVal: null, //查询条件缓存
			currentTab: STOREREQ_LIST.toCommit, //默认显示待提交
			showConditionModal: false, //合并打印使用
			jsonData: false, //合并打印使用，
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
			billtype: '', //单据交易类型
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false //审批详情展示控制
		};
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004storereq' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//commonSerach.bind(this, STOREREQ_LIST.toCommit)(); // 调用查询方法
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, STOREREQ_LIST.searchId, ATTRCODE.ctrantypeid);
		let pk_org = this.props.search.getSearchValByField(STOREREQ_LIST.searchId, ATTRCODE.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.afterEvent.call(this, this.props, ATTRCODE.pk_org, arr);
		}
	};
	//切换页面状态
	toggleShow = () => {};
	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		//更新当前页签编码
		setDefData(STOREREQ_LIST.dataSource, 'currentTab', tabCode);
		let searchVal = getDefData(STOREREQ_LIST.dataSource, 'searchVal');
		if (STOREREQ_LIST.all == tabCode) {
			if (searchVal == null) {
				// 点击全部页签时，若未输入查询条件，就不查
				let rowsData = { rows: [] };
				this.props.table.setAllTableData(STOREREQ_LIST.formId, rowsData);
				buttonController.setListButtonVisiable(this.props, null);
				//initButtons(this.props, null);
				return;
			}
		}
		commonSerach.bind(this, tabCode, searchVal)(); // 调用查询方法
		//initButtons(this.props, null);
		buttonController.setListButtonVisiable(this.props, null);
	};
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	doubleClick = (record, index) => {
		let pk_storereq = record.pk_storereq.value;
		this.props.pushTo(STOREREQ_LIST.cardUrl, {
			status: STOREREQ_LIST.browse,
			id: pk_storereq,
			pagecode: STOREREQ_LIST.cardpageid
		});
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, STOREREQ_LIST.searchId, [
				'pk_storereq_b.pk_srcmaterial',
				'pk_storereq_b.pk_srcmaterial.pk_marbasclass',
				'pk_storereq_b.pk_appdept',
				'pk_storereq_b.pk_reqstordoc',
				'pk_storereq_b.cprojectid',
				'pk_storereq_b.pk_apppsn',
				'pk_storereq_b.pk_reqstordoc'
				//'billmaker',
				//'approver'
			]);
		}
	}
	getDefaultKey = () => {
		let tabcode = STOREREQ_LIST.toCommit;
		let currentTab = getDefData.call(this, STOREREQ_LIST.dataSource, 'currentTab');
		if (currentTab) {
			tabcode = currentTab;
		} else {
			setDefData(STOREREQ_LIST.dataSource, 'currentTab', tabcode);
		}
		if (tabcode == STOREREQ_LIST.toCommit) {
			return 0;
		} else if (tabcode == STOREREQ_LIST.approving) {
			return 1;
		} else if (tabcode == STOREREQ_LIST.executing) {
			return 2;
		} else {
			return 3;
		}
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
		let { table, button, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createModal } = modal;
		const { socket } = this.props;
		let { showUploader, target } = this.state;
		let { createButton, getButtons } = button;
		let toCommitNum = '0';
		let approvingNum = '0';
		let executingNum = '0';
		let tubNum = getDefData(STOREREQ_LIST.dataSource, 'tubNum');
		if (tubNum) {
			toCommitNum = tubNum.toCommitNum;
			approvingNum = tubNum.approvingNum;
			executingNum = tubNum.executingNum;
		}
		let defaultTabCode = STOREREQ_LIST.toCommit;
		let tabCode = getDefData(STOREREQ_LIST.dataSource, 'currentTab');
		if (tabCode) {
			defaultTabCode = tabCode;
		}
		//获取小应用里注册的按钮
		let buttons = this.props.button.getButtons();
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: STOREREQ_LIST.formId,
					billpkname: ATTRCODE.pk_storereq,
					billtype: STOREREQ_LIST.billType
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 物资需求申请单*/}
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
							type={STOREREQ_LIST.billType}
						/>
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						dataSource: STOREREQ_LIST.dataSource,
						pkname: ATTRCODE.pk_storereq,
						clickSearchBtn: searchBtnClick.bind(
							this,
							getDefData.call(this, STOREREQ_LIST.dataSource, 'currentTab')
						),
						onAfterEvent: this.afterEvent.bind(this, this.props),
						//onBeforeEvent: this.beforeEvent.bind(this, this.props),
						defaultConditionsNum: 9,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="tab-definInfo-area">
					{/* 页签区 */}
					<NCTabsControl defaultKey={this.getDefaultKey()}>
						<div key={0} clickFun={() => this.tabChange(STOREREQ_LIST.toCommit)}>
							{`${getLangByResId(this, '4004STOREREQ-000029')} (${toCommitNum})`}
							{/* 国际化处理： 待提交*/}
						</div>
						<div key={1} clickFun={() => this.tabChange(STOREREQ_LIST.approving)}>
							{`${getLangByResId(this, '4004STOREREQ-000030')} (${approvingNum})`}
							{/* 国际化处理： 审批中*/}
						</div>
						<div key={2} clickFun={() => this.tabChange(STOREREQ_LIST.executing)}>
							{`${getLangByResId(this, '4004STOREREQ-000031')} (${executingNum})`}
							{/* 国际化处理： 执行中*/}
						</div>
						<div key={3} clickFun={() => this.tabChange(STOREREQ_LIST.all)}>
							{getLangByResId(this, '4004STOREREQ-000032')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(STOREREQ_LIST.formId, {
						dataSource: STOREREQ_LIST.dataSource,
						pkname: ATTRCODE.pk_storereq,
						//显示序号
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, STOREREQ_LIST.dataSource, 'currentTab')
						),
						onSelectedAll: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, STOREREQ_LIST.dataSource, 'currentTab')
						),
						componentInitFinished: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, STOREREQ_LIST.dataSource, 'currentTab')
						)
					})}
				</div>
				<div>
					{showUploader && (
						<NCUploader
							billId={this.state.billId}
							onHide={this.onHideUploader}
							billNo={this.state.vbillcode}
							billcode={this.state.billId}
							pk_billtypecode={STOREREQ_LIST.billType}
						/>
					)}
				</div>
				{/* {this.combineData && <MergePrinting {...MergePrintingProps} />} */}
				<div>
					<ApproveDetail
						show={this.state.show}
						close={this.closeApprove}
						billtype={this.state.billtype}
						billid={this.state.billId}
					/>
				</div>
				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4004STOREREQ-000016')} /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
				{createModal('modelList', {
					title: getLangByResId(this, '4004STOREREQ-000027') /* 国际化处理： 注意*/,
					content: getLangByResId(this, '4004STOREREQ-000028') /* 国际化处理： 确定要删除吗?*/
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
StorereqList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: STOREREQ_LIST.listpageid,
		bodycode: STOREREQ_LIST.formId
	}
})(StorereqList);
export default StorereqList;
//eactDOM.render(<StorereqList />, document.querySelector('#app'));
