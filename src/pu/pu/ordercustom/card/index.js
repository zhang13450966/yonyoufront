/*
 * @Author: liujia9
 * @PageInfo: 报关卡片
 * @Date: 2019-04-15 10:05:13
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:14:03
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { AREA, URL, PAGECODE, BUTTONID, DATASOURCECACHE } from '../constance';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { buttonClick, pageInfoClick } from './btnClicks';
import { onRowsSelected } from './viewControl/buttonControl';
import beforeEvent from './beforeEvents/beforeEvent';
import bodyAfterEvent from './afterEvents/bodyAfterEvent';
import { initLang, getLangByResId } from 'src/scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCAffix, NCDiv } = base;

class CustomCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.cardFormId);
		props.use.cardTable(AREA.cardTableId);
		initLang(this, [ '4004ordercustom' ], 'pu', initTemplate.bind(this, this.props));
	}

	//获取列表肩部信息
	getTableHead = () => {
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.button.createButtonApp({
						area: AREA.card_body,
						ignoreHotkeyCode: getCardDisableHotKeyBtn(),
						onButtonClick: buttonClick.bind(this)
					})}
				</div>
			</div>
		);
	};

	render() {
		const { button, BillHeadInfo, cardTable, form, cardPagination } = this.props;
		const { createCardPagination } = cardPagination;
		const { createForm } = form;
		const { createCardTable } = cardTable;
		const { createBillHeadInfo } = BillHeadInfo;
		const { createButtonApp } = button;

		return (
			<div className="nc-bill-card" id="scm-pu-ordersendout-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									/* 国际化处理： 报关*/
									billCode: '', // 单据号
									backBtnClick: buttonClick.bind(this, this.props, BUTTONID.Back) // 返回按钮的点击事件
								})}
							</div>
							<div className="header-button-area">
								{createButtonApp({
									area: AREA.card_head,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
							<div className="header-cardPagination-area">
								{createCardPagination({
									dataSource: DATASOURCECACHE.dataSourceListCacheKey,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(AREA.cardFormId, {
							onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(AREA.cardTableId, {
							tableHead: this.getTableHead.bind(this, this.props.button.getButtons()),
							hideAdd: true,
							showCheck: true,
							hideModelSave: true,
							selectedChange: onRowsSelected.bind(this),
							onBeforeEvent: beforeEvent.bind(this),
							onAfterEvent: bodyAfterEvent.bind(this),
							adaptionHeight: true
						})}
					</div>
				</div>
			</div>
		);
	}
}

CustomCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardPagecode,
		headcode: AREA.cardFormId,
		bodycode: { [AREA.cardTableId]: 'cardTable' }
	},
	orderOfHotKey: [ AREA.cardFormId, AREA.cardTableId ]
})(CustomCard);

export default CustomCard;
