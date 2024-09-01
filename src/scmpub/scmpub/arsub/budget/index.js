/*
 * @Author: chaiwx 
 * @PageInfo: index  
 * @Date: 2018-04-24 16:02:29 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-13 13:47:10
 */

//********************************独立编译包引用******************************************************** */
import React, { Component } from 'react';
import { createPage, createPageIcon } from 'nc-lightapp-front';
//********************************依赖编译包引用******************************************************** */
import { initTemplate } from './init';
import { ARSUB_CONST } from '../const';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class ArsubBudget extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(ARSUB_CONST.budgetTableId);
		this.state = {};

		initLang(this, [ '4001arsub' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	render() {
		const { editTable, search } = this.props;
		let { createEditTable } = editTable;

		return (
			<div className="nc-bill-list">
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createPageIcon()}
						<h2 className="title-search-detail">{getLangByResId(this, '4006ARSUB-000038')}</h2>
						{/* 国际化处理：预算执行情况*/}
					</div>
				</div>
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createEditTable(ARSUB_CONST.budgetTableId, {
						showIndex: true,
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}

ArsubBudget = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: ARSUB_CONST.budgetPageId,
		bodycode: {
			[ARSUB_CONST.budgetTableId]: 'table'
		}
	}
})(ArsubBudget);
ReactDOM.render(<ArsubBudget />, document.querySelector('#app'));
