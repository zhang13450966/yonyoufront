/*
 * @Author: xiahui
 * @PageInfo: 三单匹配-列表
 * @Date: 2019-05-14 15:33:26
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-07-05 11:10:45
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, createPageIcon, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { PAGECODE, AREA, FIELDS } from '../constance';
import './index.less';
import { buttonClick, searchBtnClick, invoiceSearch, matchedSearch } from './btnClicks';
import { buttonControl } from './viewControl/buttonControl';
import { bodyAfterEvent, searchAfterEvent } from './afterEvents';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCDiv } = base;
class Match extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchId);
		props.use.editTable(AREA.invoiceId);
		props.use.editTable(AREA.stockinId);
		props.use.editTable(AREA.matchedId);
		this.state = {
			tab: 1 // 当前页签
		};
		this.matchRule = null; // 匹配规则
		this.invoicePks = null; // 进项发票Pks
		this.pk_org = { value: '', display: '' }; // 若未匹配无值，则通过已匹配的值得组织设置查询区组织值
		initLang(this, [ '4004match' ], 'pu', initTemplate.bind(this, this.props));
	}

	/**
	 * 页签切换时触发
	 */
	onTabChange = (tab) => {
		if (tab == 1) {
			// 未匹配页签，重新查询结果
			invoiceSearch.call(this, this.props);
		} else {
			// 已匹配页签，查询匹配结果
			matchedSearch.call(this, this.props);
		}
		this.setState({ tab: tab }, () => {
			if (tab == 2) {
				this.props.editTable.updateTableHeight();
			}
		});
	};

	/**
	 * 匹配规则结果
	 */
	setMatchRule = (matchRule) => {
		this.matchRule = matchRule;
	};

	render() {
		const { editTable, button, search, modal } = this.props;
		const { createEditTable } = editTable;
		const { NCCreateSearch } = search;
		const { createButtonApp } = button;
		const { createModal } = modal;

		return (
			<div className="nc-bill-list">
				{this.props.socket.connectMesg({
					tableAreaCode: AREA.matchedId,
					tableType: 'editTable', // 增加表格类型 editTable / insertTable
					// billtype : '', // 由于EditTable 节点可能不涉及追溯或者流程，可不传
					billpkname: FIELDS.pk_taxmatch
				})}

				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-title-tabs">
						<div
							className={this.state.tab === 1 ? 'header-title-tab actived' : 'header-title-tab'}
							onClick={this.onTabChange.bind(this, 1)}
						>
							{getLangByResId(this, '4004MATCH-000008')}
							{/* 国际化处理： 未匹配*/}
						</div>
						<div
							className={this.state.tab === 2 ? 'header-title-tab actived' : 'header-title-tab'}
							onClick={this.onTabChange.bind(this, 2)}
						>
							{getLangByResId(this, '4004MATCH-000009')}
							{/* 国际化处理： 已匹配*/}
						</div>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: this.state.tab === 1 ? AREA.unmatch_head : AREA.matched_head,
							onButtonClick: buttonClick.bind(this)
						})}
					</div>
				</NCDiv>

				<div className="nc-bill-search-area" style={{ display: this.state.tab === 1 ? '' : 'none' }}>
					{NCCreateSearch(AREA.searchId, {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: searchAfterEvent.bind(this),
						clickPlanEve: clickPlanEvent.bind(this)
						// renderCompleteEvent: this.querySchemeAfterEvent,
						// statusChangeEvent: this.querySchemeAfterEvent
					})}
				</div>
				<div className="nc-bill-table-area" style={{ display: this.state.tab === 1 ? '' : 'none' }}>
					{createEditTable(AREA.invoiceId, {
						showCheck: false,
						showIndex: true,
						lazyload: false,
						onAfterEvent: bodyAfterEvent.bind(this)
					})}
				</div>
				<div className="nc-bill-table-area" style={{ display: this.state.tab === 1 ? '' : 'none' }}>
					{createEditTable(AREA.stockinId, {
						showCheck: true,
						showIndex: true,
						adaptionHeight: true,
						onAfterEvent: bodyAfterEvent.bind(this)
					})}
				</div>

				<div className="nc-bill-table-area" style={{ display: this.state.tab === 2 ? '' : 'none' }}>
					{createEditTable(AREA.matchedId, {
						showCheck: true,
						showIndex: true,
						lazyload: false,
						adaptionHeight: true,
						onSelected: onSelect.bind(this),
						onSelectedAll: onSelect.bind(this),
						allowTotalRows: onCheckRows.bind(this)
					})}
				</div>

				{createModal('MatchRuleSetDlg')}
			</div>
		);
	}
}

function onSelect(props, moduleId, record, index, status) {
	buttonControl.call(this, props, props.editTable.getCheckedRows(moduleId));
}

function clickPlanEvent() {
	// 若值为空，且已匹配有值，则覆盖
	if (this.pk_org.value != '') {
		let defaultData = this.pk_org;
		// 主组织赋值
		this.props.search.setSearchValByField(AREA.searchId, FIELDS.pk_financeorg, defaultData);
	}
}

/**
 * 合计选择行数据
 */
function onCheckRows() {
	let checkedRows = this.props.editTable.getCheckedRows(AREA.matchedId, false);
	let checkedIndex = [];
	checkedRows.map((checkedRow) => {
		checkedIndex.push(checkedRow.index);
	});
	return checkedIndex;
}

Match = createPage({
	// 适配编辑公式、编辑关联项、验证公式
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.listPagecode,
		bodycode: {
			[AREA.invoiceId]: 'editTable',
			[AREA.stockinId]: 'editTable',
			[AREA.matchedId]: 'editTable'
		}
	}
})(Match);

ReactDOM.render(<Match />, document.querySelector('#app'));
