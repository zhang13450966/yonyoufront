/*
 * @Author: 王龙华 
 * @PageInfo: 内部货源定义界面  
 * @Date: 2018-04-11 15:58:16 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-05-17 17:29:29
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base } from 'nc-lightapp-front';
import { onButtonClicks, searchBtnClick } from './btnClicks/index.js';
import { initTemplate } from './init';
import { INVSOURCE_CONST, INVSOURCE_BUTTONS } from '../const';
import { afterEvent } from './events';
import selectBtnController from '../list/viewController/selectBtnController';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCAffix, NCDiv } = base;
class List extends Component {
	constructor(props) {
		super(props);
		props.use.search(INVSOURCE_CONST.SEARCHID);
		props.use.editTable(INVSOURCE_CONST.TABLEID);
		this.state = { searchShow: true };
		this.props = props;
		this.isSearched = false;
		this.oldSearchVal = null;
	}

	// 关闭浏览器提示
	componentWillMount() {
		initLang(this, [ '4001invsource' ], 'scmpub', initTemplate.bind(this, this.props));
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(INVSOURCE_CONST.TABLEID);
			if (status == INVSOURCE_CONST.EDIT) {
				return getLangByResId(this, '4001INVSOURCE-000015'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	render() {
		let { editTable, search, button } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">{createListTitle(this)}</div>
						<div className="header-button-area">
							{createButtonApp({
								area: INVSOURCE_CONST.HEADAREA,
								buttonLimit: 10,
								onButtonClick: onButtonClicks.bind(this),
								ignoreHotkeyCode: [ INVSOURCE_BUTTONS.Delete ]
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-search-area">
					{this.state.searchShow &&
						NCCreateSearch(INVSOURCE_CONST.SEARCHID, {
							saveSearchPlan: true, // 是否需要查询方案功能
							showAdvBtn: false,
							clickSearchBtn: searchBtnClick.bind(this, 1, this.props)
						})}
				</div>

				<div className="nc-bill-table-area">
					{createEditTable(INVSOURCE_CONST.TABLEID, {
						showCheck: true,
						onAfterEvent: afterEvent.bind(this),
						selectedChange: selectBtnController.bind(this, this.props),
						showIndex: true,
						isAddRow: true,
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}
List = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: INVSOURCE_CONST.PAGECODE,
		bodycode: INVSOURCE_CONST.TABLEID
	},
	// Tab快捷键适配
	orderOfHotKey: [ INVSOURCE_CONST.TABLEID ]
})(List);
ReactDOM.render(<List />, document.querySelector('#app'));
