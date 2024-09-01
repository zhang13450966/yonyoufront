/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单列表页面
 * @Date: 2021-11-19 10:01:54 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-04-22 16:28:11
 */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
import { PAGECODE, AREA, CONSTFIELD, FIELD, BTNID, URL, UISTATE } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { initTemplate } from './init';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import NCUploader from 'uap/common/components/NCUploader';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import { btnClickController, buttonController } from './viewController';
import { pageInfoClick } from './btnClicks';
const { BillTrack } = high;
const { NCAffix, NCDiv } = base;

export default class PlanConfirmList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.search);
		props.use.table(AREA.head);
		this.state = {
			pk_planconfirm: '',
			showUploader: false,
			billNo: '',
			showApproveInfo: false,
			searchVal: null,
			toCommitNum: '0',
			approvingNum: '0',
			exeNum: '0',
			showTrack: false,
			billtype: ''
		};
		initLang(this, [ '4004planconfirm' ], 'pu', initTemplate.bind(this, props));
	}

	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	closeApprove = () => {
		this.setState({
			showApproveInfo: false
		});
	};

	//双击事件
	doubleClick = (record, index) => {
		let pk_planconfirm = record.pk_planconfirm.value;
		let scene = this.props.getUrlParam('scene');
		this.props.pushTo(URL.card, {
			status: UISTATE.browse,
			id: pk_planconfirm,
			scene: scene,
			pagecode: PAGECODE.card
		});
	};
	// hanelChange = (tab) => {
	// 	this.setState({ currentTab: tab }); //更新当前页签编码
	// 	setDefData.call(this, COMMON.arrivalCacheKey, COMMON.arrivalCacheTabKey, {
	// 		tabCode: tab
	// 	});
	// 	if ('all' == tab) {
	// 		// 点击全部页签时，若未输入查询条件，就不查
	// 		if (this.state.searchVal) {
	// 			commonSearch.bind(this, tab, this.state.searchVal)(); // 调用查询方法
	// 		} else {
	// 			let rowsData = { rows: [] };
	// 			this.props.table.setAllTableData(AREA.head, rowsData);
	// 			return;
	// 		}
	// 	} else {
	// 		commonSearch.bind(this, tab, this.state.searchVal)(); // 调用查询方法
	// 	}
	// };

	// getdefaultTab = () => {
	// 	let tabCode = getDefData.call(this, CONSTFIELD.planConfirmCacheKey, CONSTFIELD.planConfirmCacheTabKey);

	// 	if (tabCode == null || tabCode.tabCode == null) {
	// 		return 0;
	// 	} else {
	// 		// return tabCode.tabCode;
	// 		if (tabCode.tabCode == 'toCommit') {
	// 			return 0;
	// 		} else if (tabCode.tabCode == 'approving') {
	// 			return 1;
	// 		} else if (tabCode.tabCode == 'exe') {
	// 			return 2;
	// 		} else if (tabCode.tabCode == 'all') {
	// 			return 3;
	// 		}
	// 	}
	// };

	render() {
		const { search, table, modal } = this.props;
		const { NCCreateSearch } = search; // 引入创建搜索区方法
		const { createSimpleTable } = table; // 引入table区
		const { createModal } = modal; // 引入模态框
		const { socket } = this.props;
		// let { toCommitNum, approvingNum, exeNum } = this.state;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: AREA.head,
					billpkname: FIELD.hid,
					billtype: '2C'
				})}

				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* 标题 */}
							{createListTitle(this)}
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: AREA.listHeadBtnArea,
								onButtonClick: btnClickController.bind(this)
							})}
							{this.state.showUploader && (
								<NCUploader
									billId={this.state.pk_planconfirm}
									billNo={this.state.billNo}
									placement={''}
									onHide={this.onHideUploader}
									billcode={this.state.pk_planconfirm}
									pk_billtypecode={'2C'}
								/>
							)}
							<ApproveDetail
								show={this.state.showApproveInfo}
								close={this.closeApprove}
								billtype={this.state.billtype}
								billid={this.state.pk_planconfirm}
							/>
							<BillTrack
								show={this.state.showTrack}
								close={() => {
									this.setState({ showTrack: false });
								}}
								pk={this.state.pk_planconfirm}
								type={'2C'}
							/>
						</div>
					</NCDiv>
				</NCAffix>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.search, {
						clickSearchBtn: btnClickController.bind(this, this.props, BTNID.Query)
					})}
				</div>
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{/* <NCTabsControl defaultKey={this.getdefaultTab()}>
						<div key={0} clickFun={() => this.hanelChange('toCommit')}>
							{`${getLangByResId(this, '4004planconfirm-000017')}(${toCommitNum})`}
						</div>
						<div key={1} clickFun={() => this.hanelChange('approving')}>
							{`${getLangByResId(this, '4004planconfirm-000018')}(${approvingNum})`}
						</div>
						<div key={2} clickFun={() => this.hanelChange('exe')}>
							{`${getLangByResId(this, '4004planconfirm-000019')}(${exeNum})`}
						</div>
						<div key={3} clickFun={() => this.hanelChange('all')}>
							{getLangByResId(this, '4004planconfirm-000020')}
						</div>
					</NCTabsControl> */}
					{createSimpleTable(AREA.head, {
						dataSource: CONSTFIELD.dataSource,
						pkname: FIELD.hid,
						showCheck: true,
						showIndex: true,
						onSelected: buttonController.bind(this, this.props),
						onSelectedAll: buttonController.bind(this, this.props),
						onRowDoubleClick: this.doubleClick.bind(this),
						handlePageInfoChange: pageInfoClick.bind(this)
					})}
				</div>
				{/* 交互式异常 */}
				{createModal('ResumeMessageDlg', {
					className: 'iframe-modal',
					size: 'xlg'
				})}
			</div>
		);
	}
}

PlanConfirmList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.list,
		bodycode: {
			[AREA.head]: 'simpleTable' //此处发生变化了，需要传一个对象
		}
	}
})(PlanConfirmList);
