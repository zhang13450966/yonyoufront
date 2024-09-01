/* 
* @Author: lichaoah  
* @PageInfo:销售指标设置   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: hufei
 * @Last Modified time: 2022-06-01 11:24:12
*/
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { TARGET_CARD, TARGET_LIST } from '../siconst';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import { btnClickController } from './viewControl';
import LeftRightCom from 'scmpub/scmpub/components/LeftRightTable';
import { headAfterEvent } from './afterEvents';
import { bodyAfterEvent } from './afterEvents';
import pageInfoClick from './btnClicks/pageInfoClick';
import onRowClick from './btnClicks/onRowClick';
import { setCardButtonDisable } from './viewControl/buttonController';
import bodyBeforeEvents from './beforeEvents/bodyBeforeEvents';
import headBeforeEvent from './beforeEvents/headBeforeEvent';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';
const { NCAffix, NCDiv, NCTabs } = base;
import NCUploader from 'uap/common/components/NCUploader';
const NCTabPane = NCTabs.NCTabPane;

class SoTargetCard extends Component {
	constructor(props) {
		super(props);
		this.pk_org = {};
		this.billId = undefined;
		this.state = { showTargetRatio: false, showUploader: false };
		this.target_item_rowid; //指标项当前选中的行
		this.target_item_cache = {};

		props.use.form(TARGET_CARD.formId);
		props.use.cardTable(
			TARGET_CARD.target_org,
			TARGET_CARD.target_item,
			TARGET_CARD.target_mar,
			TARGET_CARD.target_period,
			TARGET_CARD.target_ratio
		);

		initLang(this, [ '4001target' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.getUrlParam('status');
			if (status == TARGET_CARD.edit || status == TARGET_CARD.add) {
				return getLangByResId(this, '4001TARGET-000007'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	componentDidMount() {
		//设置状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true //控制显示单据号：true为显示,false为隐藏 ---非必传
		});
	}
	//获取列表肩部信息
	getTableHead = (areaCode) => {
		let { createButtonApp } = this.props.button;
		return (
			<div className="definition-icons">
				{createButtonApp({
					area: areaCode,
					onButtonClick: btnClickController.bind(this)
					// ignoreHotkeyCode: [ BUTTONS.AddLine1 ]
				})}
			</div>
		);
	};
	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};
	// 主方法
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const { createForm } = form;
		let { createCardTable, updateTableHeight } = cardTable;
		const { createCardPagination } = cardPagination;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		//光标默认聚焦关闭，由业务开发控制
		this.props.controlAutoFocus(true);
		let buttons = this.props.button.getButtons();
		return (
			<div className={this.state.showTargetRatio ? 'nc-bill-extCard-2' : 'nc-bill-card'}>
				<div className="nc-bill-top-area">
					<NCAffix>
						{/* 按钮区 */}
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									backBtnClick: () => {
										//返回按钮的点击事件
										this.props.pushTo(TARGET_CARD.listUrl, { pagecode: TARGET_CARD.listpageid });
									}
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: TARGET_CARD.formId,
									onButtonClick: btnClickController.bind(this)
								})}
							</div>
							{/* 上一页/下一页 */}
							<div className="header-cardPagination-area">
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: TARGET_LIST.dataSource,
									pkname: TARGET_CARD.pk_target
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表头 */}
					<div className="nc-bill-form-area">
						{createForm(TARGET_CARD.formId, {
							onAfterEvent: headAfterEvent.bind(this),
							onBeforeEvent: headBeforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area outer-table-area-wrapper">
						<NCTabs
							navtype="turn"
							contenttype="moveleft"
							defaultActiveKey="1"
							onChange={updateTableHeight}
							flex="true"
							onTabClick={(tabKey) => {
								if (tabKey !== '4') {
									this.setState({ showTargetRatio: false });
								}
							}}
						>
							<NCTabPane
								tab={getLangByResId(this, '4001TARGET-000030')}
								key="1"
								forceRender={true}
								className="my-tab"
							>
								{/* 国际化处理： 基本信息*/}
								<LeftRightCom
									parentProps={this.props}
									LeftButtonConfig={{
										area: TARGET_CARD.buttonArea.target_org,
										onButtonClick: btnClickController.bind(this)
									}}
									LeftTableConfig={{
										area: TARGET_CARD.target_org,
										showIndex: true,
										showCheck: true,
										selectedChange: () => {
											setCardButtonDisable.call(this, this.props);
										},
										onBeforeEvent: bodyBeforeEvents.bind(this)
									}}
									// RightButtonArea ={}
									RightTableConfig={{
										area: TARGET_CARD.target_period,
										showIndex: true,
										// showCheck: true,
										selectedChange: () => {
											setCardButtonDisable.call(this, this.props);
										},
										onBeforeEvent: bodyBeforeEvents.bind(this)
									}}
								/>
							</NCTabPane>

							<NCTabPane
								tab={getLangByResId(this, '4001TARGET-000031')}
								key="3"
								forceRender={true}
								className="my-tab"
							>
								{/* 国际化处理： 物料维度*/}
								{createCardTable(TARGET_CARD.target_mar, {
									showIndex: true,
									showCheck: true,
									// adaptionHeight: true,
									tableHead: this.getTableHead.bind(this, TARGET_CARD.buttonArea.target_mar),
									hideSwitch: () => {
										return false;
									},
									adaptionHeight: true,
									selectedChange: () => {
										setCardButtonDisable.call(this, this.props);
									},
									onBeforeEvent: bodyBeforeEvents.bind(this),
									onAfterEvent: bodyAfterEvent.bind(this)
								})}
							</NCTabPane>
							<NCTabPane
								tab={getLangByResId(this, '4001TARGET-000032')}
								key="4"
								forceRender={true}
								className="my-tab"
							>
								<div className="nc-bill-table-area inner-table-area">
									{/* 国际化处理： 指标项*/}
									{createCardTable(TARGET_CARD.target_item, {
										showIndex: true,
										showCheck: true,
										tableHead: this.getTableHead.bind(this, TARGET_CARD.buttonArea.target_item),
										hideSwitch: () => {
											return false;
										},
										adaptionHeight: !this.state.showTargetRatio,
										selectedChange: () => {
											setCardButtonDisable.call(this, this.props);
										},
										onRowClick: onRowClick.bind(this),
										onBeforeEvent: bodyBeforeEvents.bind(this),
										onAfterEvent: bodyAfterEvent.bind(this)
									})}
								</div>

								{this.state.showTargetRatio && (
									<div className="nc-bill-tableTab-area inner-tableTab-area">
										{createCardTable(TARGET_CARD.target_ratio, {
											showIndex: true,
											onBeforeEvent: bodyBeforeEvents.bind(this),
											onAfterEvent: bodyAfterEvent.bind(this),
											hideSwitch: () => {
												return false;
											},
											adaptionHeight: true
										})}
									</div>
								)}
							</NCTabPane>
						</NCTabs>
					</div>
				</div>
				<div>{this.state.showUploader && <NCUploader billId={this.billId} onHide={this.onHideUploader} />}</div>
			</div>
		);
	}
}
SoTargetCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: TARGET_CARD.cardpageid,
		headcode: TARGET_CARD.formId,
		bodycode: {
			[TARGET_CARD.target_org]: 'cardTable',
			[TARGET_CARD.target_period]: 'cardTable',
			[TARGET_CARD.target_item]: 'cardTable',
			[TARGET_CARD.target_mar]: 'cardTable',
			[TARGET_CARD.target_ratio]: 'cardTable'
		}
	},
	orderOfHotKey: [
		TARGET_CARD.formId,
		TARGET_CARD.target_org,
		TARGET_CARD.target_period,
		TARGET_CARD.target_mar,
		TARGET_CARD.target_item,
		TARGET_CARD.target_ratio
	]
})(SoTargetCard);
export default SoTargetCard;
