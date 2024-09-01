/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-06-26 18:20:48 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-02-21 13:57:44
 */

import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, pageInfoClick } from './btnClicks';
import { BUYINGREQ_LIST, ATTRCODE } from '../siconst';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import commonSerach from './btnClicks/commonSearch';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { buttonController, btnClickController } from './viewControl';
import NCUploader from 'uap/common/components/NCUploader';
import ApproveDetail from 'uap/common/components/ApproveDetail';
const { BillTrack } = high;
let { NCDiv } = base;
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
		props.use.table(BUYINGREQ_LIST.formId);
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
			pk: '',
			billId: '', //单据id
			vbillcode: '', //单据号
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false, //控制弹框
			billtype: '', //单据交易类型
			show: false //审批详情展示控制
		};
		//initTemplate.call(this, this.props);
		initLang(this, [ '4004praybillr' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//commonSerach.bind(this, BUYINGREQ_LIST.executing)(); // 调用查询方法
	}
	//切换页面状态
	toggleShow = () => {
		//this.props.button.setButtonVisible(['Group1','Add', 'Commit', 'Delete', 'print', 'others'], true);
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		this.setState({ currentTab: tabCode }); //更新当前页签编码
		if (BUYINGREQ_LIST.all == tabCode) {
			if (this.state.searchVal == null) {
				// 点击全部页签时，若未输入查询条件，就不查
				let rowsData = { rows: [] };
				this.props.table.setAllTableData(BUYINGREQ_LIST.formId, rowsData);
				return;
			}
		}
		commonSerach.bind(this, tabCode, this.state.searchVal)(); // 调用查询方法
	};
	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [
				'pk_praybill_b.pk_srcmaterial',
				'pk_praybill_b.pk_srcmaterial.pk_marbasclass',
				'pk_praybill_b.pk_suggestsupplier_v',
				'pk_praybill_b.pk_reqdept',
				'pk_praybill_b.casscustvid',
				'approver',
				'billmaker',
				'pk_plandept',
				'pk_planpsn'
			]);
		} else if (field == 'pk_praybill_b.pk_purchaseorg') {
			multiCorpRefHandler(props, val, BUYINGREQ_LIST.searchId, [ 'pk_praybill_b.pk_employee' ]);
		}
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
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
	doubleClick = (record, index) => {
		let pk_praybill = record.pk_praybill.value;
		this.props.pushTo(BUYINGREQ_LIST.cardUrl, {
			status: BUYINGREQ_LIST.browse,
			id: pk_praybill,
			pagecode: BUYINGREQ_LIST.cardpageid
		});
	};

	render() {
		let { table, button, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createModal } = modal;
		const { socket } = this.props;
		let { showUploader, target } = this.state;
		let { createButton, getButtons } = button;
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
						{/*国际化处理： 请购单修订*/}
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
						clickSearchBtn: searchBtnClick.bind(this, this.state.currentTab),
						onAfterEvent: this.afterEvent.bind(this, this.props),
						defaultConditionsNum: 9,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(BUYINGREQ_LIST.formId, {
						//显示序号
						dataSource: BUYINGREQ_LIST.dataSource,
						pkname: ATTRCODE.pk_praybill,
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: buttonController.setListButtonVisiable.bind(this, this.props),
						onSelectedAll: buttonController.setListButtonVisiable.bind(this, this.props),
						componentInitFinished: buttonController.setListButtonVisiable.bind(this, this.props)
					})}
				</div>
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
				{createModal('MessageDlg', {
					size: 'xlg'
				})}
				{createModal('modelList', {
					title: getLangByResId(this, '4004PRAYBILLR-000023') /* 国际化处理： 注意*/,
					content: getLangByResId(this, '4004PRAYBILLR-000024') /* 国际化处理： 确定要删除吗?*/
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
