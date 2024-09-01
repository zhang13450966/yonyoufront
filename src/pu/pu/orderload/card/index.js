/*
 * @Author: CongKe
 * @PageInfo: 装运卡片
 * @Date: 2019-04-17 09:27:27
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:15:26
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { AREA, URL, PAGECODE, BUTTONID, DATASOURCECACHE } from '../constance';
import { getCardDisableHotKeyBtn } from '../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { buttonClick, pageInfoClick } from './btnClicks';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { beforeEvent } from './beforeEvents/index';
import buttonController from './viewControl/buttonController';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
const { NCAffix, NCDiv } = base;

class LoadCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(AREA.cardFormId);
		props.use.cardTable(AREA.cardTableId);
		initLang(this, [ '4004load' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		pageInfoClick.call(this);
	}

	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(PAGECODE.cardbody);
			if (status == 'edit') {
				return getLangByResId(this, '4004LOAD-000001'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	//获取列表肩部信息
	getMaterialBtn = () => {
		return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{this.props.button.createButtonApp({
						area: AREA.card_shoulder,
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
			<div className="nc-bill-card" id="scm-pu-orderload-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
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
							{/* 上一页/下一页 */}
							<div className="header-cardPagination-area">
								{createCardPagination({
									dataSource: DATASOURCECACHE.dataSourceListCacheKey,
									handlePageInfoChange: pageInfoClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					<div className="nc-bill-form-area">{createForm(AREA.cardFormId)}</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(AREA.cardTableId, {
							hideAdd: true,
							showCheck: true,
							hideModelSave: true,
							tableHead: this.getMaterialBtn, //订单详情按钮
							onBeforeEvent: beforeEvent.bind(this),
							selectedChange: buttonController.onSelect.bind(this),
							onSelectedAll: buttonController.onSelect.bind(this),
							adaptionHeight: true
							// onAfterEvent: bodyAfterEvent.bind(this)
						})}
					</div>
				</div>
			</div>
		);
	}
}

LoadCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.cardPagecode,
		headcode: AREA.cardFormId,
		bodycode: { [AREA.cardTableId]: 'cardTable' }
	},
	orderOfHotKey: [ AREA.cardFormId, AREA.cardTableId ]
})(LoadCard);

export default LoadCard;
