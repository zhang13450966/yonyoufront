/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单列表态
 * @Date: 2018-04-25 10:03:09
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:04:11
 */
import React, { Component } from 'react';
import { createPage, ajax, base, high, createPageIcon } from 'nc-lightapp-front';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCTabsControl, NCDiv } = base;
import ExcelOutput from 'uap/common/components/ExcelOutput';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
import { searchBtnClick, pageInfoClick, doubleClick, commonSearch } from './btnClicks';
import { afterEvent } from './afterEvents';
import { initTemplate } from './init';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { clearTransferCache } from '../../../../scmpub/scmpub/pub/cache';
import { URL, PAGECODE, FIELD, AREA, DATASOURCE, HEAD_FIELD, TABS } from '../constance';
import { btnClickController, buttonController } from '../list/viewControl';
class InitialList extends Component {
	constructor(props) {
		super(props);
		props.use.search(PAGECODE.searchId);
		props.use.table(PAGECODE.tableId);
		this.state = {
			vbillcode: null, //期初暂估单号
			searchVal: null, //查询条件缓冲
			currentTab: 0, //默认显示处理中
			freeNum: '0', //处理中数量
			showTrack: false, //单据追溯
			pk: '', //主键
			target: null, //弹出的上传空间以target位置为重，不传则默认页面正中央
			showUploader: false, //附件管理控制弹框
			fbillstatus: '', //单据状态
			searchFlag: false, //打开节点默认加载数据控制
			numFlag: 0 //搜索次数
		};
		//多语初始化以及回调
		initLang(this, [ '4004initialest' ], 'pu', initTemplate.bind(this, this.props));
	}
	// 渲染页面前，执行的方法
	componentWillMount() {
		//初始化时清除拉单的缓冲
		clearTransferCache(this.props, DATASOURCE.transferdataSource);
		//初始化时，自制和采购订单都不可见
		let tabcode = getDefData(DATASOURCE.dataSource, FIELD.tabCode);
		if (tabcode != null) {
			this.setState({ currentTab: tabcode });
		}
		let selmake = getDefData(DATASOURCE.dataSource, FIELD.isSelfMake);
		let ref = getDefData(DATASOURCE.dataSource, FIELD.isref21);
		if (selmake === undefined || ref === undefined) {
			buttonController.setAddButtonVisible.call(this, this.props, false);
			buttonController.setOrderButtonVisible.call(this, this.props, false);
			this.toggleshow();
		}
	}
	//查询业务流
	queryAddTab = (billdata) => {
		ajax({
			url: URL.queryAddTab,
			data: billdata,
			method: 'post',
			success: (res) => {
				if (res.data) {
					if (res.data.length > 0) {
						for (let row of res.data) {
							//判断是否可以自制
							if (row.makeflag) {
								setDefData(DATASOURCE.dataSource, FIELD.isSelfMake, true);
								buttonController.setAddButtonVisible.call(this, this.props, true);
							}
							if (row.src_billtype == '21') {
								//可以参照采购订单
								setDefData(DATASOURCE.dataSource, FIELD.isref21, true);
								buttonController.setOrderButtonVisible.call(this, this.props, true);
							}
						}
					}
				}
			}
		});
	};
	//根据业务流显示新增或拉单按钮
	toggleshow = () => {
		buttonController.setAddAndOrderButtonVisible.call(this, this.props);
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	// 渲染页面后，执行的方法
	componentDidMount() {
		setDefData(DATASOURCE.dataSource, FIELD.tabCode, 0);
	}
	//主组织编辑后回调
	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, AREA.listSearchArea, HEAD_FIELD.ctrantypeid);
		let pk_org = this.props.search.getSearchValByField(AREA.listSearchArea, HEAD_FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			afterEvent.call(this, HEAD_FIELD.pk_org, arr);
		}
	};
	// 处理中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		this.setState({ currentTab: tabCode, searchFlag: false }); //更新当前页签编码
		setDefData(DATASOURCE.dataSource, FIELD.tabCode, tabCode);
		setDefData(DATASOURCE.dataSource, FIELD.currentTab, tabCode);
		// if (FIELD.all == TABS[tabCode]) {
		// 	if (this.state.searchVal == null) {
		// 		// 点击全部页签时，若未输入查询条件，就不查
		// 		let rowsData = { rows: [] };
		// 		this.props.table.setAllTableData(AREA.listTableArea, rowsData);
		// 		buttonController.lineSelected.call(this, this.props, tabCode);
		// 		return;
		// 	}
		// }
		commonSearch.call(this, tabCode, this.state.searchVal, this.state.searchFlag, true); // 调用查询方法
		buttonController.lineSelected.call(this, this.props, tabCode);
	};

	render() {
		let { table, search, modal } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		const { createModal } = modal;
		const { socket } = this.props;
		let { freeNum, target, showUploader } = this.state;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: AREA.listTableArea,
					billpkname: FIELD.pk_initialest,
					billtype: '4T'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理： 期初暂估单列表*/}
					</div>
					<div className="header-button-area">
						{/* 按钮区 */}
						{this.props.button.createButtonApp({
							area: PAGECODE.tableId,
							onButtonClick: btnClickController.bind(this)
						})}
						{/* 单据追溯 */}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({ showTrack: false });
							}}
							pk={this.state.pk}
							type="4T"
						/>
					</div>
					<ExcelOutput
						{...Object.assign(this.props)}
						moduleName="pu"
						billType="4T"
						pagecode="400402800_card"
						appcode="400402800"
						exportTreeUrl={URL.exportset}
						//referVO={{ ignoreTemplate: true }}
					/>
					<div>
						{/* 附件上传组件使用，需要传入三个参数 */}
						{showUploader && (
							<NCUploader
								billId={this.state.vbillcode}
								target={target}
								placement={''}
								onHide={this.onHideUploader}
							/>
						)}
					</div>
				</NCDiv>
				{/* 搜索区 */}
				{
					<div className="nc-bill-search-area ">
						{NCCreateSearch(PAGECODE.searchId, {
							clickSearchBtn: searchBtnClick.bind(this, this.state.currentTab),
							onAfterEvent: afterEvent.bind(this),
							defaultConditionsNum: 4, //默认显示几个查询条件
							renderCompleteEvent: this.renderCompleteEvent,
							statusChangeEvent: this.renderCompleteEvent,
							dataSource: DATASOURCE.dataSource,
							pkname: FIELD.pk_initialest
						})}
					</div>
				}
				{/* 列表区 */}
				<div className="tab-definInfo-area">
					{/* 页签区 */}
					<NCTabsControl defaultKey={this.state.currentTab}>
						<div key={0} clickFun={() => this.tabChange(0)}>
							{`${getLangByResId(this, '4004INITIALEST-000031')}(${freeNum})`}
							{/* 国际化处理： 处理中*/}
						</div>
						<div key={1} clickFun={() => this.tabChange(1)}>
							{getLangByResId(this, '4004INITIALEST-000032')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
				</div>
				<div className="nc-bill-table-area">
					{/* 表格区 */}
					{createSimpleTable(PAGECODE.tableId, {
						dataSource: DATASOURCE.dataSource,
						pkname: FIELD.pk_initialest,
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: doubleClick.bind(this),
						onSelected: buttonController.lineSelected.bind(this, this.props, this.state.currentTab),
						onSelectedAll: buttonController.lineSelected.bind(this, this.props, this.state.currentTab),
						componentInitFinished: buttonController.lineSelected.bind(
							this,
							this.props,
							this.state.currentTab
						)
						// componentInitFinished: () => {
						//   //缓存数据赋值成功的钩子函数
						//   //若初始化数据后需要对数据做修改，可以在这里处理
						// }
					})}
				</div>
			</div>
		);
	}
}
let InitialEstList = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardpagecode,
		headcode: PAGECODE.cardhead,
		bodycode: {
			[PAGECODE.cardbody]: 'cardTable' //此处发生变化了，需要传一个对象
		}
	}
})(InitialList);
//ReactDOM.render(<List />, document.querySelector("#app"));
export default InitialEstList;
