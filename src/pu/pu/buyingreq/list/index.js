/*
 * @Author: mikey.zhangchqf  请购单
 * @Date: 2018-06-26 15:34:46 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-02-21 11:26:39
 */

import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
const { NCDiv } = base;
import { initTemplate } from './init';
import { searchBtnClick, pageInfoClick } from './btnClicks';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import batchCommitBtnClick from '../list/btnClicks/commitBatchBtnClick';
import rowCommitBtnClick from '../list/btnClicks/commitBtnClick';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { buttonController, btnClickController } from './viewControl';
import { BUYINGREQ_LIST, ATTRCODE } from '../siconst';
import commonSerach from './btnClicks/commonSearch';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import ExcelOutput from 'uap/common/components/ExcelOutput';
const { NCTabsControl } = base;
const { BillTrack } = high;
class BuyingreqList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = BUYINGREQ_LIST.moduleId;
		this.head = BUYINGREQ_LIST.formId; //
		this.bodyCode = BUYINGREQ_LIST.tableId;
		this.searchId = BUYINGREQ_LIST.searchId;
		this.pageId = BUYINGREQ_LIST.listpageid;
		this.queryAreaCode = BUYINGREQ_LIST.searchId;
		props.use.search(this.searchId);
		props.use.table(this.head);
		this.commitInfo = {
			isBatch: true,
			record: null,
			index: null
		};
		//this.state = { currentLocale: 'en-US', test: null };
		this.state = {
			searchFlag: false, //查询校验是否必输
			searchVal: null, //查询条件缓存
			currentTab: BUYINGREQ_LIST.toCommit, //默认显示待提交
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
			billtype: '', //单据交易类型
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			show: false //审批详情展示控制
		};
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004praybill', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//commonSerach.bind(this, BUYINGREQ_LIST.toCommit)(); // 调用查询方法
	}
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	//切换页面状态
	toggleShow = () => {
		//this.props.button.setButtonVisible(['Group1','Add', 'Commit', 'Delete', 'print', 'others'], true);
	};
	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [
				'pk_praybill_b.pk_srcmaterial',
				'pk_praybill_b.pk_srcmaterial.pk_marbasclass',
				'pk_praybill_b.pk_suggestsupplier',
				'pk_praybill_b.casscustid',
				'pk_praybill_b.pk_reqstor',
				'pk_praybill_b.pk_reqdept',
				'pk_praybill_b.pk_product',
				//'approver',
				//'billmaker',
				'pk_plandept',
				'pk_planpsn'
			]);
		} else if (field == 'pk_praybill_b.pk_purchaseorg') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [ 'pk_praybill_b.pk_employee' ]);
		}
	}
	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		//更新当前页签编码
		setDefData(BUYINGREQ_LIST.dataSource, 'currentTab', tabCode);
		let searchVal = getDefData(BUYINGREQ_LIST.dataSource, 'searchVal');
		if (BUYINGREQ_LIST.all == tabCode) {
			if (searchVal == null) {
				// 点击全部页签时，若未输入查询条件，就不查
				let rowsData = { rows: [] };
				this.props.table.setAllTableData(BUYINGREQ_LIST.formId, rowsData);
				buttonController.setListButtonVisiable(this.props, null);
				return;
			}
		}
		commonSerach.bind(this, tabCode, searchVal)(); // 调用查询方法
		buttonController.setListButtonVisiable(this.props, null);
	};
	//主组织编辑后回调
	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, BUYINGREQ_LIST.searchId, ATTRCODE.ctrantypeid);
		let pk_org = this.props.search.getSearchValByField(BUYINGREQ_LIST.searchId, ATTRCODE.pk_org);
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
		let tabcode = BUYINGREQ_LIST.toCommit;
		let currentTab = getDefData.call(this, BUYINGREQ_LIST.dataSource, 'currentTab');
		if (currentTab) {
			tabcode = currentTab;
		} else {
			setDefData(BUYINGREQ_LIST.dataSource, 'currentTab', tabcode);
		}
		if (tabcode == BUYINGREQ_LIST.toCommit) {
			return 0;
		} else if (tabcode == BUYINGREQ_LIST.approving) {
			return 1;
		} else if (tabcode == BUYINGREQ_LIST.executing) {
			return 2;
		} else {
			return 3;
		}
	};
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	doubleClick = (record, index) => {
		let pk_praybill = record.pk_praybill.value;
		this.props.pushTo(BUYINGREQ_LIST.cardUrl, {
			status: BUYINGREQ_LIST.browse,
			id: pk_praybill,
			pagecode: BUYINGREQ_LIST.cardpageid
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
		let { table, button, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let { showUploader, target } = this.state;
		const { createModal } = modal;
		const { socket } = this.props;

		let { createButton, getButtons } = button;
		let toCommitNum = '0';
		let approvingNum = '0';
		let executingNum = '0';
		let tubNum = getDefData(BUYINGREQ_LIST.dataSource, 'tubNum');
		if (tubNum) {
			toCommitNum = tubNum.toCommitNum;
			approvingNum = tubNum.approvingNum;
			executingNum = tubNum.executingNum;
		}
		let defaultTabCode = BUYINGREQ_LIST.toCommit;
		let tabCode = getDefData(BUYINGREQ_LIST.dataSource, 'currentTab');
		if (tabCode) {
			defaultTabCode = tabCode;
		}
		//获取小应用里注册的按钮
		let buttons = this.props.button.getButtons();
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: BUYINGREQ_LIST.formId,
					billpkname: ATTRCODE.pk_praybill,
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
							type={BUYINGREQ_LIST.billType}
						/>
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						dataSource: BUYINGREQ_LIST.dataSource,
						pkname: ATTRCODE.pk_praybill,
						clickSearchBtn: searchBtnClick.bind(
							this,
							getDefData.call(this, BUYINGREQ_LIST.dataSource, 'currentTab')
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
						<div key={0} clickFun={() => this.tabChange(BUYINGREQ_LIST.toCommit)}>
							{`${getLangByResId(this, '4004PRAYBILL-000038')} (${toCommitNum})`}
							{/* 国际化处理： 待提交*/}
						</div>
						<div key={1} clickFun={() => this.tabChange(BUYINGREQ_LIST.approving)}>
							{`${getLangByResId(this, '4004PRAYBILL-000039')} (${approvingNum})`}
							{/* 国际化处理： 审批中*/}
						</div>
						<div key={2} clickFun={() => this.tabChange(BUYINGREQ_LIST.executing)}>
							{`${getLangByResId(this, '4004PRAYBILL-000040')} (${executingNum})`}
							{/* 国际化处理： 执行中*/}
						</div>
						<div key={3} clickFun={() => this.tabChange(BUYINGREQ_LIST.all)}>
							{getLangByResId(this, '4004PRAYBILL-000041')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(BUYINGREQ_LIST.formId, {
						dataSource: BUYINGREQ_LIST.dataSource,
						pkname: ATTRCODE.pk_praybill,
						//显示序号
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, BUYINGREQ_LIST.dataSource, 'currentTab')
						),
						onSelectedAll: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, BUYINGREQ_LIST.dataSource, 'currentTab')
						),
						componentInitFinished: buttonController.setListButtonVisiable.bind(
							this,
							this.props,
							getDefData.call(this, BUYINGREQ_LIST.dataSource, 'currentTab')
						)
					})}
				</div>
				<ExcelOutput
					{...Object.assign(this.props)}
					moduleName={BUYINGREQ_LIST.purchaseorg} //模块名称，
					billType={BUYINGREQ_LIST.billType} //单据类型
					pagecode={BUYINGREQ_LIST.cardpageid} //页面编码
					appcode={BUYINGREQ_LIST.appcode20} //请购单的应用编码
					exportTreeUrl={BUYINGREQ_LIST.exportset}
					// referVO={{ ignoreTemplate: true }} //表示是否走配置文件的配置
				/>
				<div>
					{showUploader && (
						<NCUploader
							billId={this.state.billId}
							onHide={this.onHideUploader}
							billNo={this.state.vbillcode}
							billcode={this.state.billId}
							pk_billtypecode={BUYINGREQ_LIST.billType}
						/>
					)}
				</div>
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
						title={getLangByResId(this, '4004PRAYBILL-000025')} /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
				{createModal('modelList', {
					title: getLangByResId(this, '4004PRAYBILL-000036') /* 国际化处理： 注意*/,
					content: getLangByResId(this, '4004PRAYBILL-000037') /* 国际化处理： 确定要删除吗?*/
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
BuyingreqList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: BUYINGREQ_LIST.listpageid,
		bodycode: BUYINGREQ_LIST.formId
	}
})(BuyingreqList);
export default BuyingreqList;
//ReactDOM.render(<BuyingreqList />, document.querySelector('#app'));
