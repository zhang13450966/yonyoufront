/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义卡片
 * @Date: 2020-02-17 20:47:57
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-02-21 14:08:25
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { FILED, URL, AREA, STATUS, PAGEID, CARRIERDATASOURCE, HEADFILED } from '../constance';
import { pageInfoClick } from './btnClick';
import { afterEvent } from './afterEvent';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { setEditStatusButton, setBrowseStatusButton, setUIState } from './viewController/buttonController';
import btnClickController from './viewController/btnClickController';
import { getLangByResId, initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCDiv } = base;
class CarrierCard extends Component {
	constructor(props) {
		super(props);
		props.use.cardTable(AREA.driver);
		props.use.form(AREA.card_head);
		this.state = {
			status: STATUS.edit
			//	hideSwitchShow: true
		};
		this.tabkey = AREA.driver;
		initLang(this, [ '4001carrier' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	// 渲染页面前，执行的方法
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.form.getFormStatus(AREA.card_head);
			if (status == STATUS.edit || status == STATUS.add) {
				return getLangByResId(this, '4001CARRIER-000020'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	// 渲染页面后，执行的方法
	componentDidMount() {}
	//切换页面状态所有按钮的可见性
	toggleShow = (status) => {
		status = status || this.props.getUrlParam(FILED.cardStatus);
		if (status == STATUS.browse) {
			setBrowseStatusButton.call(this);
			this.setState({
				hideSwitchShow: true
			});
		} else {
			setEditStatusButton.call(this);
			this.setState({
				hideSwitchShow: false
			});
			if (status == STATUS.add) {
				this.props.executeAutoFocus();
				this.props.form.setFormItemsDisabled(AREA.card_head, {
					[HEADFILED.pk_org_v]: false,
					[HEADFILED.csupplierid]: false
				});
			} else if (status == STATUS.edit) {
				this.props.form.setFormItemsDisabled(AREA.card_head, {
					[HEADFILED.pk_org_v]: true,
					[HEADFILED.csupplierid]: true
				});
			}
		}
		setUIState.call(this, status);
	};

	render() {
		let { cardTable, form, cardPagination } = this.props;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createCardPagination } = cardPagination;
		return (
			<div className="nc-bill-card" id="preliminary-pu-initialest-card">
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createCardTitle(this, {
								billCode: '', //单据号
								backBtnClick: () => {
									//返回按钮的点击事件
									this.props.pushTo(URL.gotoList, {
										pagecode: PAGEID.listpagecodeorg,
										refresh: true
									});
								}
							})}
						</div>
						<div className="header-button-area">
							{/* 按钮区 */}
							{this.props.button.createButtonApp({
								area: AREA.card_head,
								onButtonClick: btnClickController.bind(this)
							})}
						</div>
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{/* 上一页/下一页 */}
							{createCardPagination({
								handlePageInfoChange: pageInfoClick.bind(this),
								dataSource: CARRIERDATASOURCE.carrierdatasource
							})}
						</div>
					</NCDiv>

					<div className="nc-bill-form-area">
						{createForm(AREA.card_head, {
							onAfterEvent: afterEvent.bind(this)
							//onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(AREA.driver, {
							multiConfig: {
								[AREA.driver]: {
									showCheck: true,
									hideModelSave: true,
									adaptionHeight: true,
									hideSwitch: () => {
										return false;
									}
								},
								[AREA.vehicle]: {
									showCheck: true,
									hideModelSave: true,
									adaptionHeight: true,
									hideSwitch: () => {
										return false;
									}
								},
								[AREA.vehicletype]: {
									showCheck: true,
									hideModelSave: true,
									adaptionHeight: true,
									hideSwitch: () => {
										return false;
									}
								}
							}
						})}
					</div>
				</div>
			</div>
		);
	}
}
CarrierCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGEID.cardpagecodeorg,
		headcode: AREA.card_head,
		bodycode: {
			//[AREA.card_body]: 'cardTable' 此处发生变化了，需要传一个对象
		}
	},
	orderOfHotKey: [ AREA.card_head, AREA.card_body ]
})(CarrierCard);
export default CarrierCard;
