/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义
 * @Date: 2020-02-17 09:42:14
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 16:03:51
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { lineSelected } from './viewController/buttonController';
import { initTemplate } from './init';
import { URL, AREA, FILED, CARRIERDATASOURCE, PAGEID, STATUS } from '../constance';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { queryBtnClick } from './btnClicks/queryBtnClick';
import btnClickController from './viewController/btnClickController';
import { setDefData, getDefData } from '../../pub/cache';
import { getLangByResId, initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCDiv, NCCheckbox } = base;
class CarrierGroupList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchArea);
		props.use.table(AREA.listTable);
		this.state = {
			status: 'browse',
			searchVal: '',
			checked: false
		};
		initLang(this, [ '4001carriergroup' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		let type = getDefData(CARRIERDATASOURCE.carrierdatasource, FILED.type);
		if (!type) {
			type = this.props.getUrlParam(FILED.type);
			setDefData(CARRIERDATASOURCE.carrierdatasource, FILED.type, type);
		}
	}

	toggleShow = () => {};
	orgAfterEvent = (field, value) => {
		if (field == 'pk_org' && Array.isArray(value) && value.length > 0) {
			this.refs.mainorg.onChange(value[0]);
		}
	};
	renderCompleteEvent = () => {};
	//双击事件
	doubleClick = (record, index) => {
		let ccarrierid = record.ccarrierid.value;
		let type = this.props.getUrlParam(FILED.type);
		this.props.pushTo(URL.gotoCard, {
			cardStatus: STATUS.browse,
			id: ccarrierid,
			type: type
		});
	};
	render() {
		const { table, search } = this.props;
		const { createSimpleTable } = table;
		const { NCCreateSearch } = search;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="title-search-detail">
						<span className="showOff">
							<NCCheckbox
								checked={this.state.checked}
								onChange={btnClickController.bind(this, this.props, FILED.showOff)}
							>
								{getLangByResId(this, '4001CARRIERGROUP-000022')}
								{/* 国际化处理： 显示停用*/}
							</NCCheckbox>
						</span>
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							onButtonClick: btnClickController.bind(this),
							ignoreHotkeyCode: [ 'Delete' ]
						})}
					</div>
				</NCDiv>
				{/* 查询展示区域 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.searchArea, {
						clickSearchBtn: queryBtnClick.bind(this),
						// onAfterEvent: this.onAfterEvent.bind(this, this.props),
						// renderCompleteEvent: this.renderCompleteEvent,
						// statusChangeEvent: this.renderCompleteEvent,
						dataSource: CARRIERDATASOURCE.carrierdatasource,
						pkname: FILED.ccarrierid
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(AREA.listTable, {
						showIndex: true, //显示序号
						showCheck: true,
						// handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: lineSelected.bind(this, this.props),
						onSelectedAll: lineSelected.bind(this, this.props),
						dataSource: CARRIERDATASOURCE.carrierdatasource,
						pkname: FILED.ccarrierid
						//  componentInitFinished: buttonController.initButtons.bind(this, this.props, null),
					})}
				</div>
			</div>
		);
	}
}
CarrierGroupList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGEID.listpagecodegroup,
		bodycode: AREA.listTable
	}
})(CarrierGroupList);
export default CarrierGroupList;
