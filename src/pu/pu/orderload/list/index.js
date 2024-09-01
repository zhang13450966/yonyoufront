/*
 * @Author: CongKe
 * @PageInfo: 采购订单状态维护-装运
 * @Date: 2019-04-17 09:08:33
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:32:17
 */

import React, { Component } from 'react';
import { createPage, createPageIcon, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { AREA, URL, PAGECODE, DATASOURCECACHE, FIELDS, STATUS, BUTTONID } from '../constance';
import { buttonClick, searchBtnClick, pageInfoBtnClick } from './btnClicks';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { onAfterEvent, renderCompleteEvent } from '../../orderonwaypub/searchafterevent/index';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCDiv } = base;
class LoadList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		props.use.table(AREA.listTableId);
		this.state = {};
		initLang(this, [ '4004load' ], 'pu', initTemplate.bind(this, this.props));
	}

	//双击事件
	doubleClick = (record, index) => {
		let pk_order = record.pk_order.value;
		this.props.pushTo(URL.card, {
			id: pk_order,
			status: STATUS.edit,
			pagecode: PAGECODE.CARDPAGECODE
		});
	};

	onSelectedButtons = () => {
		let rows = this.props.table.getCheckedRows(AREA.listTableId);
		let noEdit = true;
		noEdit = rows.length > 0 ? false : noEdit;
		let disableArr = {
			[BUTTONID.Print]: noEdit
		};
		this.props.button.setDisabled(disableArr);
	};

	render() {
		const { button, search, table } = this.props;
		const { createButtonApp } = button;
		const { NCCreateSearch } = search;
		const { createSimpleTable } = table;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
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
						statusChangeEvent: renderCompleteEvent.bind(this, this.props, AREA.searchId),
						pkname: FIELDS.pk_order
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(AREA.listTableId, {
						showIndex: true, //显示序号
						showCheck: true,
						pkname: FIELDS.pk_order,
						dataSource: DATASOURCECACHE.dataSourceListCacheKey,
						handlePageInfoChange: pageInfoBtnClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelectedButtons.bind(this),
						onSelectedAll: this.onSelectedButtons.bind(this)
					})}
				</div>
			</div>
		);
	}
}

LoadList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listPagecode,
		bodycode: AREA.listTableId
	}
})(LoadList);

export default LoadList;
