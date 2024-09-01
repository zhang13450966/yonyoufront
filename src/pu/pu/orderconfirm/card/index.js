/*
 * @PageInfo:  对方确认卡片界面
 * @Author: nieqianc
 * @Date: 2019-04-6 10:00:49
 */
import React, { Component } from 'react';
import { onSelect } from './viewControl/buttonControl';
import { createPage, base } from 'nc-lightapp-front';
const { NCBackBtn, NCAffix, NCDiv } = base;
import initTemplate from './init/initTemplate';
import backBtnClick from './btnClicks/backBtnClick';
import { PAGECODE, AREA, FIELD, URL, UISTATE, BUTTON_ID, BUTTON_AREA, DATASOURCE } from '../constance';
import { buttonClick, pageInfoClick } from './btnClicks';
import beforeEvent from './beforeEvents/beforeEvent';
import { bodyAfterEvent } from './afterEvents';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
class OrderConfirmCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.CARD_FORM);
		props.use.cardTable(AREA.CARD_TABLE);
		initLang(this, [ '4004orderconfirm' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// initTemplate.call(this, this.props);
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(AREA.CARD_TABLE);
			if (status == 'edit') {
				return '国际化处理： 当前单据未保存，您确认离开此页面？';
			}
		};
	}

	render() {
		let { cardTable, form, cardPagination, BillHeadInfo } = this.props;
		const { createCardPagination } = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createBillHeadInfo } = BillHeadInfo;

		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: null, //单据号
									backBtnClick: backBtnClick.bind(this, this.props, BUTTON_ID.Back)
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: BUTTON_AREA.CARD_HEAD,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
							<div className="header-cardPagination-area">
								{createCardPagination({
									dataSource: DATASOURCE.LIST,
									pkname: FIELD.PK_ORDER,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">
						{createForm(AREA.CARD_FORM, { onBeforeEvent: beforeEvent.bind(this) })}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(AREA.CARD_TABLE, {
							tableHead: () => {
								return (
									<div className="definition-icons">
										{this.props.button.createButtonApp({
											area: BUTTON_AREA.CARD_BODY,
											// ignoreHotkeyCode: getCardDisableHotKeyBtn(),
											onButtonClick: buttonClick.bind(this)
										})}
									</div>
								);
							},
							showCheck: true,
							selectedChange: onSelect.bind(this),
							onSelectedAll: onSelect.bind(this),
							adaptionHeight: true,
							onAfterEvent: bodyAfterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this)
							// modelAddRow: () => {
							// 	RownoUtils.setRowNo(this.props, AREA.cardTableId, 'crowno');
							// }
						})}
					</div>
				</div>
			</div>
		);
	}
}
OrderConfirmCard = createPage({ orderOfHotKey: [ AREA.CARD_FORM, AREA.CARD_TABLE ] })(OrderConfirmCard);
export default OrderConfirmCard;
