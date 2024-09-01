/*
 * @Author: yechd5 
 * @PageInfo: 协同设置列表页面
 * @Date: 2018-04-11 16:47:19 
 * @Last Modified by: heyfn
 * @Last Modified time: 2022-05-11 16:49:53
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, cacheTools, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { COOPSETUP_CONST } from '../const';
import { searchBtnClick, buttonClick, selectedClick, selectedAllClick, doubleBtnClick } from './btnClicks';
import { initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from './viewController/buttonController';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { getDefData } from '../../pub/cache';

const { NCAffix, NCDiv } = base;
class CoopSetList extends Component {
	constructor(props) {
		super(props);
		props.use.search(COOPSETUP_CONST.SEARCHID);
		props.use.table(COOPSETUP_CONST.LIST_DATAAREAID);
		this.props = props;
		this.state = {
			json: {},
			inlt: null
		};
	}

	componentDidMount() {
		buttonController.call(this, this.props);
		if (!getDefData(COOPSETUP_CONST.dataSource, COOPSETUP_CONST.queryFlag)) {
			// 默认加载所有数据
			this.getData();
		}
	}
	componentWillMount() {
		initLang(this, [ '4001coopsetup' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	getData = () => {
		let req = {
			pageId: COOPSETUP_CONST.PAGEID_LIST
		};
		ajax({
			url: COOPSETUP_CONST.QUERYALLURL,
			data: req,
			success: (res) => {
				if (res.data === undefined || res.data == null) {
					this.props.table.setAllTableData(COOPSETUP_CONST.LIST_DATAAREAID, { rows: [] });
				} else {
					this.props.table.setAllTableData(COOPSETUP_CONST.LIST_DATAAREAID, res.data.head);
					// 获取所有主键
					let allpks = new Array();
					let rows = res.data.head.rows;
					for (let i = 0; i < rows.length; i++) {
						let row = rows[i];
						allpks.push(row.values.pk_coopsetup.value);
					}
					// 缓存主键pks
					cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, allpks);
				}
			}
		});
	};

	// 主渲染方法
	render() {
		let { table, search } = this.props;
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
		let buttons = this.props.button.getButtons();
		buttons.sort((a, b) => {
			return a.btnorder - b.btnorder;
		});

		return (
			<div className="nc-single-table">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-singleTable-header-area">
						<div className="header-title-search-area">{createListTitle(this)}</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: COOPSETUP_CONST.LIST_HEAD,
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this),
								popContainer: document.querySelector('.header-button-area')
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 查询展示区域 */}
				<div className="nc-singleTable-search-area">
					{NCCreateSearch(COOPSETUP_CONST.SEARCHID, {
						dataSource: '111',
						pkname: 'pk_coopsetup',
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 3 // 默认显示几个查询条件
					})}
				</div>
				<div className="nc-singleTable-table-area">
					{createSimpleTable(COOPSETUP_CONST.LIST_DATAAREAID, {
						dataSource: COOPSETUP_CONST.dataSource,
						pkname: 'pk_coopsetup',
						showCheck: true,
						showIndex: true,
						onRowDoubleClick: doubleBtnClick.bind(this),
						onSelected: selectedClick.bind(this),
						onSelectedAll: selectedAllClick.bind(this)
					})}
				</div>
			</div>
		);
	}
}

/**
 * 删除所有行
 * @param {} moduleId 
 * @param {*} len
 */
function delRows(props, moduleId, len) {
	if (len > 0) {
		let rows = [];
		for (let i = 0; i < len; i++) {
			rows.push(i);
		}
		props.table.deleteTableRowsByIndex(moduleId, rows);
	}
}

// CoopSetList = createPage({})(CoopSetList);
// ReactDOM.render(<CoopSetList />, document.querySelector('#app'));
CoopSetList = createPage({})(CoopSetList);
export default CoopSetList;
