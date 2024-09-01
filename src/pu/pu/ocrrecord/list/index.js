/*
 * @Author: zhangbfk 
 * @PageInfo: OCR扫描记录展示  
 * @Date: 2018-04-24 15:31:30 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:09:24
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import { initTemplate, onSelectedEnable } from './init';
import { btnClick, searchBtnClick } from './btnClicks';
import tableAfterEvent from './afterEvents/tableAfterEvent';
import orgChangeEvent from './afterEvents/orgChangeEvent';
import { BUTTONID, AREA, UISTATE, PAGECODE } from '../constance';
import FinanceOrgTreeRef from 'src/uapbd/refer/org/FinanceOrgTreeRef';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createPageIcon } from 'nc-lightapp-front';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
class OCRRecord extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.searchArea);
		props.use.editTable(AREA.tableArea);
		this.state = {
			disabled: false, //主组织参照是否可用编辑
			CostRegionRef: {}
		};
		this.pk_org = null;

		initTemplate.call(this, this.props);
		// initLang(this, [ '2014beginvariance' ], 'ia', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(AREA.tableArea);

			if (status == UISTATE.edit) {
				return getLangByResId(this, '2014BEGINVARIANCE-000008'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	//删除提醒
	popContentShow = (props, status) => {
		if (status === UISTATE.edit) {
			props.button.setPopContent(BUTTONID.Delete, null);
		} else {
			props.button.setPopContent(
				BUTTONID.Delete,
				getLangByResId(this, '2014BEGINVARIANCE-000009')
			); /* 国际化处理： 确定删除？*/
		}
	};

	//主组织触发时调用
	onChange = (refValue) => {
		orgChangeEvent.call(this, this.props, refValue);
	};

	render() {
		let { editTable, button, modal, search } = this.props;
		let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.editTable.getStatus(AREA.tableArea);
		return (
			<div className="nc-single-table">
				<div className="nc-singleTable-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						<div className="cost-region required">
							<FinanceOrgTreeRef
								placeholder="收票组织"
								disabled={this.state.disabled}
								value={this.state.CostRegionRef}
								onChange={this.onChange}
								// queryCondition={() => ({
								// 	TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
								// })}
							/>
						</div>
					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head',
							onButtonClick: btnClick.bind(this)
						})}
					</div>
				</div>
				<div
					className="nc-singleTable-search-area"
					style={{ display: UISTATE.browse === status ? 'block' : 'none' }}
				>
					{NCCreateSearch(AREA.searchArea, {
						clickSearchBtn: searchBtnClick.bind(this),
						defaultConditionsNum: 4 //默认显示几个查询条件
					})}
				</div>
				<div className="nc-singleTable-table-area">
					{createEditTable(AREA.tableArea, {
						onAfterEvent: tableAfterEvent.bind(this),
						showCheck: true,
						showIndex: true,
						onSelected: onSelectedEnable.bind(this), //单行选中
						onSelectedAll: onSelectedEnable.bind(this),
						isAddRow: true //新增增行
					})}
				</div>
				{createModal('orgChange')}
				{createModal(AREA.modalArea)}
			</div>
		);
	}
}

OCRRecord = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: {
			[AREA.tableArea]: 'editTable'
		}
	}
})(OCRRecord);

ReactDOM.render(<OCRRecord />, document.querySelector('#app'));
