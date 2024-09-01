/*
 * @Author: lichao 
 * @PageInfo: 集采控制规则  
 * @Date: 2019-03-12 16:05:50 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-29 15:43:46
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
const { NCAffix, NCDiv } = base;
import { onRowClick, buttonClick } from './btnClicks';
import clickSearchBtn from './btnClicks/clickSearchBtn';
import { FIELD, STATUS, ORGTYPE, AREACODE, BUTTONAREACODE, BUTTONS, PAGECODE } from '../constance';
import { initTemplate } from './init';
import { afterEvent, beforeEvent } from './events';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createVerticalEditTable } from 'scmpub/scmpub/components/VerticalEditTable';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
class CenPuRuleList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREACODE.search);
		props.use.cardTable(AREACODE.listHead);
		props.use.cardTable(AREACODE.listBody);
		this.selectIndex = 0;
		initLang(this, [ '4001cenpurule' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		//关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(AREACODE.listHead);
			status = status == STATUS.browse ? STATUS.browse : STATUS.edit;
			if (status === STATUS.edit) {
				return getLangByResId(this, '4001CENPURULE-000004'); /* 国际化处理： 当前单据未保存，您确认离开此页面?*/
			}
		};
	}

	selectedChange(area, props, moduleId, newVal, oldVal) {
		let buttons = area == 'head' ? [ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ] : BUTTONS.BodyDelLine;
		if (newVal == 0) {
			props.button.setButtonDisabled(buttons, true);
		} else {
			props.button.setButtonDisabled(buttons, false);
		}
	}

	renderCompleteEvent() {
		let filedValue = this.props.search.getSearchValByField(AREACODE.search, FIELD.pk_org);
		if (filedValue && filedValue.value && filedValue.value.firstvalue) {
			let value = filedValue.value.firstvalue;
			let values = value.split(',');
			let val = values.map((item) => {
				return { refpk: item };
			});
			multiCorpRefHandler(this.props, val, AREACODE.search, [ FIELD.pk_marbasclass, FIELD.pk_material ]);
		} else {
			multiCorpRefHandler(this.props, { refpk: undefined }, AREACODE.search, [
				FIELD.pk_marbasclass,
				FIELD.pk_material
			]);
		}
	}
	advSearchClearEve() {
		if (this.props.getUrlParam(FIELD.type) === ORGTYPE.orgNode) {
			multiCorpRefHandler(this.props, { refpk: undefined }, AREACODE.search, [
				FIELD.pk_marbasclass,
				FIELD.pk_material
			]);
		}
	}

	render() {
		const { button, search } = this.props;
		const { createButtonApp } = button;
		const { NCCreateSearch } = search;
		let pageConfig = {
			downTableName: getLangByResId(this, '4001CENPURULE-000005') /* 国际化处理： 适用组织*/,
			pk_head_field: FIELD.pk_cenpurule,
			pk_body_field: FIELD.pk_cenpurule_b
		};
		// 上部表格配置
		let upAreaConfig = {
			tableId: AREACODE.listHead,
			onRowClick: onRowClick.bind(this),
			selectedChange: this.selectedChange.bind(this, 'head'),
			showCheck: true,
			onBeforeEvent: beforeEvent.bind(this),
			onAfterEvent: afterEvent.bind(this)
		};
		// 下部表格配置
		let downAreaConfig = {
			tableId: AREACODE.listBody,
			btnArea: BUTTONAREACODE.body,
			adaptionHeight: true,
			selectedChange: this.selectedChange.bind(this, 'body'),
			showCheck: this.props.cardTable.getStatus(AREACODE.listBody) == STATUS.browse ? false : true,
			onBeforeEvent: beforeEvent.bind(this),
			onAfterEvent: afterEvent.bind(this),
			onBtnClick: buttonClick.bind(this)
		};
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							{/* 国际化处理： 集采控制规则*/}
						</div>
						{/* 按钮区 */}
						<div className="header-button-area">
							{createButtonApp({
								area: BUTTONAREACODE.head,
								onButtonClick: buttonClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 查询区 */}
				<div
					className="nc-bill-search-area"
					style={{
						display: this.props.cardTable.getStatus(AREACODE.listHead) === 'browse' ? 'block' : 'none'
					}}
				>
					{NCCreateSearch(AREACODE.search, {
						clickSearchBtn: clickSearchBtn.bind(this),
						onAfterEvent: afterEvent.bind(this, this.props)
					})}
				</div>

				{/* 表头区 */}
				{createVerticalEditTable.call(this, pageConfig, upAreaConfig, downAreaConfig)}
			</div>
		);
	}
}

CenPuRuleList = createPage({
	billinfo: [
		{
			billtype: 'grid',
			tabletype: 'cardTable',
			pagecode: PAGECODE,
			bodycode: AREACODE.listHead
		},
		{
			billtype: 'grid',
			tabletype: 'cardTable',
			pagecode: PAGECODE,
			bodycode: AREACODE.listBody
		}
	]
})(CenPuRuleList);

export default CenPuRuleList;
