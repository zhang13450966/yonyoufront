/*
 * @Author: xiahui 
 * @PageInfo: 采购订单状态维护-发货 
 * @Date: 2019-04-10 17:01:10 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:49:53
 */
import React, { Component } from 'react';
import { createPage, createPageIcon, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { AREA, URL, PAGECODE, DATASOURCECACHE, FIELDS } from '../constance';
import { buttonClick, searchBtnClick, pageInfoBtnClick } from './btnClicks';
import { buttonControl } from './viewControl/buttonControl';
import searchAfterEvent from './afterEvents/searchAfterEvent';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCDiv } = base;
class SendoutList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		props.use.table(AREA.listTableId);
		this.state = {};
		this.isSendout = false;
		initLang(this, [ '4004ordersendout' ], 'pu', initTemplate.bind(this, this.props));
	}

	render() {
		const { button, search, table } = this.props;
		const { createButtonApp } = button;
		const { NCCreateSearch } = search;
		const { createSimpleTable } = table;

		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/*国际化处理： 发货*/}
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: AREA.list_head,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.searchId, {
						dataSource: DATASOURCECACHE.dataSourceListCacheKey,
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: searchAfterEvent.bind(this),
						renderCompleteEvent: this.querySchemeAfterEvent,
						statusChangeEvent: this.querySchemeAfterEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(AREA.listTableId, {
						dataSource: DATASOURCECACHE.dataSourceListCacheKey,
						pkname: FIELDS.pk_order,
						showIndex: true, //显示序号
						showCheck: true,
						handlePageInfoChange: pageInfoBtnClick.bind(this),
						onSelected: onSelect.bind(this),
						onSelectedAll: onSelect.bind(this),
						onRowDoubleClick: (record, index, e) => {
							this.props.pushTo(URL.card, {
								sendout: this.isSendout.toString(),
								id: record[FIELDS.pk_order].value,
								pagecode: PAGECODE.cardPagecode
							});
						},
						componentInitFinished: () => {
							setTimeout(() => {
								let checkArr = this.props.table.getCheckedRows(AREA.listTableId);
								buttonControl(this.props, checkArr);
							}, 1);
						}
					})}
				</div>
			</div>
		);
	}

	querySchemeAfterEvent = () => {
		searchAfterEvent.call(this, FIELDS.pk_org);
	};
}

function onSelect(props, moduleId, record, index, status) {
	buttonControl(props, props.table.getCheckedRows(moduleId));
}

SendoutList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listPagecode,
		bodycode: {
			[AREA.listTableId]: 'table'
		}
	}
})(SendoutList);

export default SendoutList;
