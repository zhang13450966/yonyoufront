/*
 * @PageInfo:  对方确认列表界面
 * @Author: nieqianc 
 * @Date: 2019-04-6 10:00:49 
 */
import React, { Component } from 'react';
import { createPage, createPageIcon, base } from 'nc-lightapp-front';
import initTemplate from './init/initTemplate';
import { BUTTON_AREA, AREA, DATASOURCE, FIELD, URL, UISTATE, HEAD_VDEF, BODY_VBDEF, PAGECODE } from '../constance';
import btnClick from './btnClicks/btnClick';
import pageInfoClick from './btnClicks/pageInfoClick';
import searchBtnClick from './btnClicks/searchBtnClick';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import buttonControl from './viewControl/buttonControl';
import getDefArray from '../../pub/utils/getDefArray';
const { NCDiv } = base;
class OrderConfirmList extends Component {
	constructor(props) {
		super(props);
		props.use.search(AREA.LIST_SEARCH);
		props.use.table(AREA.LIST_HEAD);
		this.templetid = null;
		this.queryInfo = null;
		this.confirm = false;
		initLang(this, [ '4004orderconfirm' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// initTemplate.call(this, this.props);
	}

	onAfterEvent(props, field, val) {
		if (field == FIELD.PK_ORG) {
			let fields = new Array();
			fields = fields.concat([
				/**表头字段 */
				FIELD.PK_SUPPLIER_V, //加工商
				FIELD.CEMPLOYEEID, //业务员
				FIELD.PK_DEPT, //采购部门
				/**表体字段 */
				FIELD.PK_SRCMATERIAL, //物料最新版本
				'pk_order_b.pk_srcmaterial.pk_marbasclass.pk_marbasclass' //物料基本分类
			]);
			// 表头自定义项
			fields = fields.concat(HEAD_VDEF);
			// 表体自定义项
			let body_vdef = getDefArray('pk_order_b', BODY_VBDEF);
			fields = fields.concat(body_vdef);

			multiCorpRefHandler(props, val, AREA.LIST_SEARCH, fields);
		}
	}

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.LIST_SEARCH, FIELD.PK_ORG);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, FIELD.PK_ORG, arr);
		}
	};

	render() {
		const { table, search, button } = this.props;
		const { createSimpleTable } = table;
		const { NCCreateSearch } = search;
		const { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">{createListTitle(this)}</div>
					<div className="header-button-area">
						{createButtonApp({
							area: BUTTON_AREA.LIST_HEAD,
							onButtonClick: btnClick.bind(this)
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.LIST_SEARCH, {
						dataSource: DATASOURCE.LIST,
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(AREA.LIST_HEAD, {
						showCheck: true,
						showIndex: true,
						dataSource: DATASOURCE.LIST,
						pkname: FIELD.PK_ORDER,
						handlePageInfoChange: pageInfoClick.bind(this),
						onSelected: onSelect.bind(this),
						onSelectedAll: onSelect.bind(this),
						onRowDoubleClick: (record, index, e) => {
							this.props.pushTo(URL.CARD, {
								status: 'browse',
								confirm: this.confirm,
								id: record[FIELD.PK_ORDER].value,
								pagecode: PAGECODE.CARD
							});
						},
						componentInitFinished: () => {
							setTimeout(() => {
								let checkArr = this.props.table.getCheckedRows(AREA.LIST_HEAD);
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
	buttonControl.call(this, props, props.table.getCheckedRows(moduleId));
}

OrderConfirmList = createPage({})(OrderConfirmList);
export default OrderConfirmList;
