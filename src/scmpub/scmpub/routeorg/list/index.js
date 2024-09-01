/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-物流组织-列表主界面  
 * @Date: 2020-01-17 09:54:21 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2022-04-11 14:00:05
 */
import React, { Component } from 'react';
import { initTemplate } from './init';
import beforeUpload from './btnClicks/beforeUpload';
import onHideUploaderClick from './btnClicks/onHideUploaderClick';
import { onButtonClicks, searchBtnClick } from './btnClicks/index';
import commonSearch from './btnClicks/commonSearch';
import { selectBtnController } from './viewController/index';
import { createPage, base } from 'nc-lightapp-front';
import { search_afterEvent } from './events/index';
import { APPINFO, TEMPLATEINFO, QUERYAREAINFO, BUTTONINFO, VIEWINFO, ROUTEVOINFO } from '../const/index';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import NCUploader from 'uap/common/components/NCUploader';
let { NCDiv, NCCheckbox } = base;
class List extends Component {
	constructor(props) {
		super(props);
		props.use.search(QUERYAREAINFO.areaCode);
		props.use.table(TEMPLATEINFO.listAreaCode);
		this.props = props;
		this.isSearched = false;
		this.oldSearchVal = null;
		let backFlag = props.getUrlParam('backFlag');
		let checked = props.getUrlParam('checked');
		let refpk = props.getUrlParam('refpk');
		let refvalue = props.getUrlParam('refvalue');
		this.pkorg = null;
		this.pkorg_name = null;
		this.pkorg_v = null;
		this.pkorg_v_name = null;
		this.state = {
			showUploader: false,
			groupLists: [],
			billid: '',
			viewStatus: 'browse',
			checked: false,
			refpk: [],
			queryFlag: false
		};
		initLang(
			this,
			[ '4001route' ],
			'scmpub',
			initTemplate.bind(this, this.props, () => {
				if (backFlag) {
					this.setState(
						{
							checked: checked,
							refpk: refpk,
							refvalue: refvalue
						},
						() => {
							if (this.state.queryFlag) {
								commonSearch.call(this, props);
							}
						}
					);
				}
			})
		);
		selectBtnController.call(this, props);
	}

	// 关闭浏览器提示
	componentWillMount() {}

	componentDidMount() {}

	// 主组织编辑后事件
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(QUERYAREAINFO.areaCode, ROUTEVOINFO.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			search_afterEvent.call(this, ROUTEVOINFO.pk_org, arr);
		} else {
			search_afterEvent.call(this, ROUTEVOINFO.pk_org, []);
		}
	};

	//创建查询区
	createQueryArea() {
		let { search } = this.props;
		let { NCCreateSearch } = search;
		return (
			<div className="nc-bill-search-area">
				{//查询区ID
				NCCreateSearch(QUERYAREAINFO.areaCode, {
					showSearchBtn: true,
					showClearBtn: true,
					clickSearchBtn: searchBtnClick.bind(this, 1, this.props),
					// onAfterEvent: search_afterEvent.bind(this),
					onAfterEvent: this.renderCompleteEvent,
					renderCompleteEvent: this.renderCompleteEvent,
					statusChangeEvent: this.renderCompleteEvent
				})}
			</div>
		);
	}
	//创建按钮区
	createBtnArea(btnArea) {
		let { button } = this.props;
		let { createButtonApp } = button;
		return (
			<div>
				{createButtonApp({
					area: btnArea,
					onButtonClick: onButtonClicks.bind(this),
					ignoreHotkeyCode: [ 'Delete' ]
				})}
			</div>
		);
	}

	//创建表格区
	createListArea() {
		let { showUploader } = this.state;
		let { table } = this.props;
		let { createSimpleTable } = table;
		return (
			<div className="nc-bill-table-area">
				{//表格ID;
				createSimpleTable(TEMPLATEINFO.listAreaCode, {
					dataSource: TEMPLATEINFO.cacheKey, //缓存数据命名空间
					showCheck: true,
					showIndex: true,
					adaptionHeight: true,
					showPagination: true, //是否分页
					handlePageInfoChange: onButtonClicks.bind(this, this.props, BUTTONINFO.pageinfoBtnCode),
					selectedChange: selectBtnController.bind(this, this.props),
					onRowDoubleClick: onButtonClicks.bind(this, this.props, BUTTONINFO.doubleClickBtnCode)
				})}
				{showUploader && (
					<NCUploader
						billId={this.props.getUrlParam('id')}
						placement={'bottom_right'}
						multiple={true}
						onHide={onHideUploaderClick.bind(this)}
						beforeUpload={beforeUpload.bind(this)}
					/>
				)}
			</div>
		);
	}

	//创建表格界面
	createListView() {
		let { BillHeadInfo } = this.props;
		let { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo({
							title: getLangByResId(this, '4001ROUTE-000013') /**运输路线-物流组织 */,
							showBackBtn: false,
							initShowBackBtn: false
						})}
					</div>
					<div className="title-search-detail">
						<span className="showOff">
							<NCCheckbox
								checked={this.state.checked}
								onChange={onButtonClicks.bind(this, this.props, BUTTONINFO.showOffBtnCode)}
							>
								{getLangByResId(this, '4001ROUTE-000044') /* 国际化处理： 显示停用*/}
							</NCCheckbox>
						</span>
					</div>
					<div className="header-button-area">{this.createBtnArea(BUTTONINFO.headAreaCode)}</div>
				</NCDiv>
				{this.createQueryArea()}
				{this.createListArea()}
			</div>
		);
	}

	render() {
		return <div>{this.createListView()}</div>;
	}
}

List = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: APPINFO.pageCode,
		bodycode: TEMPLATEINFO.listAreaCode
	}
})(List);
export default List;
// ReactDOM.render(<List />, document.querySelector('#app'));
