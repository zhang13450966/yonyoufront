/*
 * @Author: gaoxiaoqiang 
 * @PageInfo: 卡片页面  
 * @Date: 2019-04-14 13:06:33 
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-18 16:18:05
 */

import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { TARGETBILL_CONST, BUTTON_AREA } from '../const';
import { initTemplate } from './init';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import { getCardDisableHotKeyBtn } from '../../pub/tool/hotKeysUtil';
import { createCardTitle } from '../../pub/tool/titleUtil';
import selectBox_BtnClick from './btnClicks/selectBox_BtnClick';
import { headBeforeEvent, afterEvent, body_beforeEvent, body_afterEvent } from './events';
import { buttonClick, operateBtnClick } from './btnClicks';
import '../utils/target.less';
const { NCAffix, NCDiv } = base;
import NCUploader from 'uap/common/components/NCUploader';
class TargetBillCard extends Component {
	constructor(props) {
		super(props);

		props.use.form(TARGETBILL_CONST.formId);
		props.use.cardTable(TARGETBILL_CONST.tableId);

		this.meta = {};
		this.lastId = '';
		this.ctargetvalue;

		this.oldformdata = {};
		this.oldtabledata = {};
		this.oldbilldata = {};
		this.clinkyearitemidFlag = {};
		this.state = {
			billcode: '', //单据号
			billid: '', //单据id
			mainRefDisabled: false, // 主组织是否禁用
			showUploader: false,
			orgData: {} // 主组织信息
		};
		this.ts = '';
		initLang(this, [ '4001targetbill', '4001targetadj', 'refer' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		//设置状态
		this.props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			showBillCode: true, //控制显示单据号：true为显示,false为隐藏 ---非必传
			billCode: '' //修改单据号---非必传
		});
	}
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.cardTable.getStatus(TARGETBILL_CONST.tableId);
			if (status == TARGETBILL_CONST.edit) {
				return getLangByResId(this, '4030ADJUSTPROMOTE-000020'); /* 国际化处理：  当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	//获取列表肩部信息
	getTableHead = () => {
		return this.props.getUrlParam(TARGETBILL_CONST.status) === TARGETBILL_CONST.edit ? (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{/* 新增行按钮 */}
					{this.props.button.createButtonApp({
						area: BUTTON_AREA.Card_Body,
						buttonLimit: 3,
						onButtonClick: operateBtnClick.bind(this),
						ignoreHotkeyCode: getCardDisableHotKeyBtn()
					})}
				</div>
			</div>
		) : (
			''
		);
	};
	// 点击返回
	clickReturn = () => {
		this.props.pushTo(TARGETBILL_CONST.Card_URL, { pagecode: TARGETBILL_CONST.cardPageId });
	};

	// 主方法
	render() {
		let { cardTable, form, button } = this.props;
		const { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;

		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								<span>
									{createCardTitle(this, {
										billCode: this.state.billcode, //单据号
										backBtnClick: () => {
											//返回按钮的点击事件
											this.clickReturn();
										}
									})}
								</span>
							</div>

							<div className="header-button-area">
								{createButtonApp({
									area: BUTTON_AREA.Card_Head,
									buttonLimit: 10,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表头 */}
					<div className="nc-bill-form-area">
						{createForm(TARGETBILL_CONST.formId, {
							onBeforeEvent: headBeforeEvent.bind(this),
							onAfterEvent: afterEvent.bind(this)
						})}
					</div>
				</div>
				{/* 表体 */}
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{createCardTable(TARGETBILL_CONST.tableId, {
							tableHead: this.getTableHead.bind(this),
							showCheck: true,
							showIndex: true,
							onBeforeEvent: body_beforeEvent.bind(this),
							onAfterEvent: body_afterEvent.bind(this),
							onSelected: selectBox_BtnClick.bind(this),
							onSelectedAll: selectBox_BtnClick.bind(this),
							hideModelSave: true, // 隐藏整单保存按钮
							adaptionHeight: true,
							//隐藏全表展开按钮
							hideSwitch: () => {
								return false;
							}
						})}
						{/* 附件上传 */}
						{this.state.showUploader && (
							<NCUploader
								billId={this.state.billid}
								billNo={this.state.billcode}
								onHide={() => {
									this.setState({
										showUploader: false
									});
								}}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}
TargetBillCard = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: TARGETBILL_CONST.cardPageId,
		headcode: TARGETBILL_CONST.formId,
		bodycode: {
			[TARGETBILL_CONST.tableId]: 'cardTable'
		}
	},
	orderOfHotKey: [ TARGETBILL_CONST.formId, TARGETBILL_CONST.tableId ]
})(TargetBillCard);

export default TargetBillCard;
