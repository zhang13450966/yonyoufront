import React, { Component } from 'react';
import { STATUS, PAGECODE, OrderCache, FIELD, URL } from '../constance';
import initTemplate from './init/initTemplate';
import { buttonController } from './viewController';
import { searchBtnClick } from './btnClicks';
import { createPage, base } from 'nc-lightapp-front';
import { getDefData, setDefData } from '../../../../scmpub/scmpub/pub/cache';
import { pageInfoClick, btnClick, commitBtnClick } from './btnClicks';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import commonSerach from './btnClicks/commonSearch';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import ApproveDetail from 'uap/common/components/ApproveDetail';
const { NCTabsControl, NCAffix, NCDiv } = base;
class PricestlList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.table(PAGECODE.tableId);
		this.state = {
			uncommitNum: '0', //待提交
			approvingNum: '0', //审批中
			searchVal: null, //查询条件缓存
			currentTab: 0, //默认显示待提交
			pk_order: '', //pk
			show: false, //审批详情
			status: STATUS.browse, //是否是编辑态
			ctrantypeid: '',
			compositedisplay: false, //指派参数
			compositedata: null //指派
		};
		this.searchflag = false;
		this.commitInfo = {
			index: null,
			record: null
		};
		this.pk_org = null;
		this.pk_supplier = null;
		initLang(this, [ '4004pricestl' ], 'pu', initTemplate.bind(this, this.props));
	}
	//页面数据初始化
	componentDidMount() {}

	getdefaultTab = () => {
		let tabCode = getDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode);
		let currentTab = tabCode && tabCode.tabCode != null ? tabCode.tabCode : 0;
		setDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode, {
			tabCode: currentTab
		});
		return currentTab;
	};
	// 提交指派
	getAssginUsedr = (value) => {
		//重新执行提交操作
		if (this.commitInfo.record) {
			commitBtnClick.call(this, this.props, this.commitInfo.record, this.commitInfo.index, value);
		} else {
			commitBtnClick.call(this, this.props, null, null, value);
		}
		this.setState({ compositedisplay: false });
	};
	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		this.setState({ currentTab: tabCode });
		setDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode, {
			tabCode: tabCode
		});
		// if (3 == tabCode) {
		// 	if (this.state.searchVal == null) {
		// 		// 点击全部页签时，若未输入查询条件，就不查
		// 		let rowsData = { rows: [] };
		// 		this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
		// 		return;
		// 	}
		// }
		this.setState({ currentTab: tabCode }, () => {
			let tab = FIELD.tocommit;
			if (0 == tabCode) {
				tab = FIELD.tocommit;
			} else if (1 == tabCode) {
				tab = FIELD.approving;
			} else if (2 == tabCode) {
				tab = FIELD.all;
			}
			// if (this.state.searchVal == null) {
			// 	return;
			// }
			//commonSerach.bind(this, tab, this.state.searchVal)(); // 调用查询方法
			if ('2' == tabCode) {
				// 点击全部页签时，若未输入查询条件，就不查
				if (this.state.searchVal) {
					commonSerach.bind(this, tab, this.state.searchVal)(); // 调用查询方法
				} else {
					let rowsData = { rows: [] };
					this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
					return;
				}
			} else {
				commonSerach.bind(this, tab, this.state.searchVal)(); // 调用查询方法
			}
		});

		// 页签切换时重置按钮
		// initButtons.call(this, this.props, tabCode);
		buttonController.initButtons.call(this, this.props, tabCode);
	};
	// 查询区编辑后
	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, PAGECODE.searchId, [
				'pk_supplier',
				'pk_dept',
				'pk_employee',
				'pk_pricesettle_b.pk_material.pk_marbasclass'
			]);
		}
	}
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, FIELD.pk_org, arr);
		}
	};
	//双击事件
	doubleClick = (record, index) => {
		let pk_pricesettle = record.pk_pricesettle;
		let billStatus = record.fbillstatus.value;
		this.props.pushTo(URL.gotoCard, {
			status: STATUS.browse,
			id: pk_pricesettle.value,
			billStatus: billStatus,
			pagecode: PAGECODE.cardcode
		});
	};
	// 审批详情关闭
	closeApprove = () => {
		this.setState({
			show: false
		});
	};
	render() {
		const { table, button, search, modal, BillHeadInfo } = this.props;
		const { createSimpleTable } = table; //引入表格
		const { NCCreateSearch } = search; //引入创建查询方法
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/* {createPageIcon()}
						<h2 className="title-search-detail">{getLangByResId(this, '4004PRICESTL-000015')}</h2> */}
							{createBillHeadInfo({
								title: getLangByResId(this, '4004PRICESTL-000015'),
								initShowBackBtn: false
							})}
							{/* 国际化处理： 价格结算单*/}
						</div>
						{/* 按钮区 */}
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: PAGECODE.tableId,
								onButtonClick: btnClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 查询展示区域 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(PAGECODE.searchId, {
						clickSearchBtn: searchBtnClick.bind(this, this.props, 'query'),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent,
						dataSource: OrderCache.OrderCacheKey
					})}
				</div>
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={this.getdefaultTab()}>
						<div key={0} clickFun={this.tabChange.bind(this, 0)}>
							{getLangByResId(this, '4004PRICESTL-000028') + ' (' + this.state.uncommitNum + ')'}
							{/* 国际化处理： 待提交*/}
						</div>
						<div key={1} clickFun={this.tabChange.bind(this, 1)}>
							{getLangByResId(this, '4004PRICESTL-000029') + ' (' + this.state.approvingNum + ')'}
							{/* 国际化处理： 审批中*/}
						</div>
						<div key={2} clickFun={this.tabChange.bind(this, 2)}>
							{getLangByResId(this, '4004PRICESTL-000030')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				{/* 列表区域 */}
				<div className="nc-bill-table-area">
					{/* 列表区域 */}
					{createSimpleTable(PAGECODE.tableId, {
						showIndex: true, //显示序号
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: buttonController.initButtons.bind(this, this.props, null),
						onSelectedAll: buttonController.initButtons.bind(this, this.props, null),
						dataSource: OrderCache.OrderCacheKey,
						pkname: FIELD.pk_pricesettle,
						componentInitFinished: buttonController.initButtons.bind(this, this.props, null)
					})}
				</div>
				{/* 审批详情 */}
				<ApproveDetail
					show={this.state.show}
					close={this.closeApprove}
					billtype={this.state.ctrantypeid} //"21"
					billid={this.state.pk_order}
				/>
				{/* 指派 */}
				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4004PRICESTL-000016')} /* 国际化处理： 指派*/ /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr.bind(this)}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
			</div>
		);
	}
}
PricestlList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listcode,
		bodycode: PAGECODE.tableId
	}
})(PricestlList);
export default PricestlList;
