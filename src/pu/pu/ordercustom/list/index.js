/*
 * @Author: liujia9 
 * @PageInfo: 采购订单状态维护-报关 
 * @Date: 2019-04-10 17:01:10 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:30:48
 */
import React, { Component } from 'react';
import { createPage, createPageIcon, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { AREA, URL, PAGECODE, DATASOURCECACHE, FIELDS } from '../constance';
import { buttonClick, searchBtnClick, pageInfoBtnClick } from './btnClicks';
import { buttonControl } from './viewControl/buttonControl';
import { onAfterEvent, renderCompleteEvent } from '../../orderonwaypub/searchafterevent/index';
import { initLang, getLangByResId } from 'src/scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCDiv } = base;
class CustomList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		props.use.table(AREA.listTableId);
		this.state = {};
		this.isCustom = false; //缓存查询条件-已报关
		initLang(this, [ '4004ordercustom' ], 'pu', initTemplate.bind(this, this.props));
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
						{/* 国际化处理： 报关*/}
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
						onAfterEvent: onAfterEvent.bind(this, this.props),
						renderCompleteEvent: renderCompleteEvent.bind(this, this.props, AREA.searchId),
						statusChangeEvent: renderCompleteEvent.bind(this, this.props, AREA.searchId)
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
								custom: this.isCustom.toString(),
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
}

function onSelect(props, moduleId, record, index, status) {
	buttonControl(props, props.table.getCheckedRows(moduleId));
}

CustomList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listPagecode,
		bodycode: {
			[AREA.listTableId]: 'table'
		}
	}
})(CustomList);

export default CustomList;
