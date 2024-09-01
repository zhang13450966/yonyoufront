/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-06-26 18:20:48 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:44:02
 */

import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { searchBtnClick, pageInfoClick } from './btnClicks';
import { TARGET_LIST, ATTRCODE, TARGET_CARD } from '../siconst';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { buttonController, btnClickController } from './viewControl';
import NCUploader from 'uap/common/components/NCUploader';
const { NCDiv } = base;
const { BillTrack } = high;

class BuyingreqList extends Component {
	constructor(props) {
		super(props);
		this.moduleId = TARGET_LIST.moduleId;
		this.head = TARGET_LIST.formId; //
		this.bodyCode = TARGET_LIST.tableId;
		this.searchId = TARGET_LIST.searchId;
		this.pageId = TARGET_LIST.listpageid;
		this.queryAreaCode = TARGET_LIST.searchId;

		this.state = {
			searchFlag: false, //查询校验是否必输
			searchVal: null, //查询条件缓存
			currentTab: TARGET_LIST.all, //默认显示待提交
			toCommitNum: '0', //待提交数量
			approvingNum: '0', //审批中数量
			executingNum: '0', //执行中
			currentLocale: 'en-US',
			test: null,
			showTrack: false,
			pk: '',
			billId: '', //单据id
			vbillcode: '', //单据号
			vcode: '', //销售指标表编号
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false //控制弹框
		};

		props.use.search(TARGET_LIST.searchId);
		props.use.table(TARGET_LIST.formId);

		initLang(this, [ '4001target' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	componentDidMount() {}

	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, TARGET_LIST.searchId, [
				'pk_praybill_b.pk_srcmaterial',
				'pk_praybill_b.pk_srcmaterial.pk_marbasclass',
				'pk_praybill_b.pk_suggestsupplier',
				'pk_praybill_b.pk_reqdept',
				'pk_praybill_b.casscustid',
				'approver',
				'billmaker',
				'pk_plandept',
				'pk_planpsn'
			]);
		} else if (field == 'pk_praybill_b.pk_purchaseorg') {
			multiCorpRefHandler(props, val, TARGET_LIST.searchId, [ 'pk_praybill_b.pk_employee' ]);
		}
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(TARGET_LIST.searchId, ATTRCODE.pk_org);
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
		let pk_target = record.pk_target.value;
		this.props.pushTo(TARGET_LIST.cardUrl, {
			status: TARGET_LIST.browse,
			id: pk_target,
			pagecode: TARGET_LIST.cardpageid
		});
	};

	render() {
		let { table, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createModal } = modal;
		let { showUploader } = this.state;
		//获取小应用里注册的按钮
		return (
			<div className="nc-bill-list">
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
							type={TARGET_LIST.billType}
						/>
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
						dataSource: TARGET_LIST.dataSource,
						pkname: TARGET_CARD.pk_target,
						clickSearchBtn: searchBtnClick.bind(this, this.state.currentTab),
						onAfterEvent: this.afterEvent.bind(this, this.props),
						defaultConditionsNum: 9,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(TARGET_LIST.formId, {
						//显示序号
						dataSource: TARGET_LIST.dataSource,
						pkname: TARGET_CARD.pk_target,
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
							onHide={() => {
								this.setState({
									showUploader: false
								});
							}}
							billNo={this.state.vcode}
						/>
					)}
				</div>
				{createModal('MessageDlg', {
					size: 'xlg'
				})}
				{createModal('modelList', {
					title: getLangByResId(this, '4001TARGET-000001') /* 国际化处理： 注意*/,
					content: getLangByResId(this, '4001TARGET-000002') /* 国际化处理： 确定要删除吗?*/
				})}
			</div>
		);
	}
}
BuyingreqList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: TARGET_LIST.listpageid,
		bodycode: TARGET_LIST.formId
	}
})(BuyingreqList);
export default BuyingreqList;
