/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义
 * @Date: 2020-02-17 09:42:14
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 16:03:35
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { lineSelected } from './viewController/buttonController';
import { initTemplate } from './init';
import { URL, AREA, FILED, CARRIERDATASOURCE, PAGEID, STATUS, HEADFILED } from '../constance';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { queryBtnClick } from './btnClicks/queryBtnClick';
import btnClickController from './viewController/btnClickController';
import { setDefData, getDefData } from '../../pub/cache';
import { getLangByResId, initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
const { NCDiv, NCCheckbox } = base;
class CarrierList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchArea);
		props.use.table(AREA.listTable);
		this.pk_org_filter_Fields = [ HEADFILED.csupplierid ];
		this.state = {
			status: 'browse',
			searchVal: '',
			checked: false
		};
		initLang(this, [ '4001carrier' ], 'scmpub', initTemplate.bind(this, this.props));
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
			console.log(value);
			this.refs.mainorg.onChange(value[0]);
		}
	};

	//主组织编辑后回调
	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, HEADFILED.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.afterEvent.call(this, this.props, HEADFILED.pk_org, arr);
		} else {
			this.afterEvent.call(this, this.props, HEADFILED.pk_org, []);
		}
	};

	afterEvent(props, field, val) {
		if (field == 'pk_org') {
			multiCorpRefHandler(props, val, AREA.searchArea, this.pk_org_filter_Fields);
		}
	}

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
								{getLangByResId(this, '4001CARRIER-000031')}
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
						onAfterEvent: this.afterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
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
CarrierList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGEID.listpagecodeorg,
		bodycode: AREA.listTable
	}
})(CarrierList);
export default CarrierList;
