/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-物流组织-卡片主界面 
 * @Date: 2020-01-17 09:44:11 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-17 11:19:58
 */
import React, { Component } from 'react';
import { initTemplate } from './init';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { onButtonClicks } from './btnClicks/index';
import copyBtnClick from './btnClicks/copyBtnClick';
import editBtnClick from './btnClicks/editBtnClick';
import addBtnClick from './btnClicks/addBtnClick';
import { setBlankPageButtons } from './viewController/buttonController';
import { createPage, base, ajax } from 'nc-lightapp-front';
import { buttonController, groupButtonController, errorBtnController } from './viewController/index';
import { TEMPLATEINFO, VIEWINFO, CARDBUTTONINFO, REQUESTURL, CARDTEMPLATEINFO, ROUTEVOINFO } from '../const/index';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { bodyAfterEvent, headAfterEvent, headBeforeEvent, bodyBeforeEvent } from './events/index';
import { changeUrlParam } from '../../../../scmpub/scmpub/pub/cache';
import pageInfo_BtnClick from '../card/btnClicks/pageInfo_BtnClick';
import { rowSelectController } from './viewController';
const { NCDiv } = base;
class Card extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		props.use.form(CARDTEMPLATEINFO.headAreaCode);
		props.use.cardTable(CARDTEMPLATEINFO.bodyAreaCode);
		let routeId = props.getUrlParam('id');
		let pk_org = props.getUrlParam('pk_org');
		let pk_group = props.getUrlParam('pk_group');
		let status = props.getUrlParam('status');
		let firstId = props.getUrlParam('firstID');
		let copyFlag = props.getUrlParam('copyFlag');
		let checked = props.getUrlParam('checked');
		let refpk = props.getUrlParam('refpk');
		let refvalue = props.getUrlParam('refvalue');
		let queryFlag = props.getUrlParam('queryFlag');
		this.pkorg = props.getUrlParam('pkorg');
		this.pkorg_name = props.getUrlParam('pkorg_name');
		this.pkorg_v = props.getUrlParam('pkorg_v');
		this.pkorg_v_name = props.getUrlParam('pkorg_v_name');
		//记录当前pkorg,主组织修改取消时使用
		this.current_org = {};
		if (firstId !== null && firstId !== undefined) {
			changeUrlParam(props, {
				id: firstId
			});
		}
		this.state = {
			viewStatus: status,
			groupLists: [],
			billid: routeId,
			backStatus: true,
			afterinit: false,
			checked: checked,
			refpk: refpk,
			refvalue: refvalue,
			queryFlag: queryFlag
		};

		initLang(
			this,
			[ '4001route' ],
			'scmpub',
			initTemplate.bind(this, this.props, status, () => {
				if (this.state.afterinit) {
					if (routeId != '' && routeId != undefined) {
						if (pk_org != '' && pk_org !== undefined && pk_org !== pk_group) {
							this.getInitValue(props, routeId, status, true, copyFlag);
						} else {
							this.getInitValue(props, routeId, VIEWINFO.BROWSER_STATUS, false);
						}
					} else if (this.props.getUrlParam('status') == VIEWINFO.ADD_STATUS) {
						this.addNewStatusSet(props);
					} else {
						setBlankPageButtons.call(this, props, VIEWINFO.BROWSER_STATUS);
					}
				}
			})
		);
	}

	// 关闭浏览器提示
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.getFormStatus.getStatus(CARDTEMPLATEINFO.headAreaCode);
			if (status == VIEWINFO.EDIT_STATUS) {
				return getLangByResId(this, '4001ROUTE-000001'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	componentDidMount() {
		if (this.state.viewStatus === VIEWINFO.ADD_STATUS) {
			this.setState({
				backStatus: false
			});
		}
	}

	componentDidUpdate() {
		let formStatus = this.props.form.getFormStatus(CARDTEMPLATEINFO.headAreaCode);
		if (formStatus === 'browse') {
			window.onbeforeunload = null;
		} else {
			window.onbeforeunload = () => {
				//编辑态关闭页签或浏览器的提示
				return '';
			};
		}
	}

	getInitValue = (props, routeId, status, flag, copyFlag) => {
		let info = {
			pk_route: routeId,
			pagecode: CARDTEMPLATEINFO.templateCode
		};
		ajax({
			url: REQUESTURL.loadRouteUrl,
			data: info,
			success: (res) => {
				if (res.data.carddata === undefined || res.data.carddata == null) {
					this.dataLostController(props, this.errorTip);
				} else if (res.data.carddata.head && res.data.carddata.body) {
					let tempData = res.data.carddata;
					props.form.setAllFormValue({
						[CARDTEMPLATEINFO.headAreaCode]: tempData.head[CARDTEMPLATEINFO.headAreaCode]
					});
					props.cardTable.setTableData(
						CARDTEMPLATEINFO.bodyAreaCode,
						tempData.body[CARDTEMPLATEINFO.bodyAreaCode],
						true
					);
					if (flag) {
						buttonController.call(this, props, status);
					} else {
						groupButtonController.call(this, props);
					}
					props.form.setFormItemsDisabled(CARDTEMPLATEINFO.headAreaCode, {
						[ROUTEVOINFO.pk_org]: true
					});
					if (copyFlag) {
						copyBtnClick.call(this, props);
						return;
					} else if (status == VIEWINFO.EDIT_STATUS) {
						editBtnClick.call(this, props);
						return;
					}
				}
			}
		});
	};

	dataLostController = (props, callback = () => {}) => {
		buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
		errorBtnController.call(this, props);
		callback && callback();
	};

	errorTip = () => {
		showErrorInfo(null, getLangByResId(this, '4001ROUTE-000032')); /* 国际化处理： 数据已经被删除，请返回列表界面！*/
	};

	addNewStatusSet = (props) => {
		addBtnClick.call(this, props);
	};

	addBtnController = () => {
		this.props.button.setButtonVisible(CARDBUTTONINFO.innerAddLineBtnCode, false);
		this.props.button.setButtonVisible(CARDBUTTONINFO.delLineBtnCode, false);
		this.props.cardTable.setAllCheckboxAble(CARDTEMPLATEINFO.bodyAreaCode, true);

		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	};
	//创建按钮区
	createBtnArea(btnArea) {
		let { button } = this.props;
		let { createButtonApp } = button;
		return (
			<div className="header-button-area">
				{createButtonApp({
					area: btnArea,
					onButtonClick: onButtonClicks.bind(this)
				})}
			</div>
		);
	}

	//创建表体
	createBodyArea() {
		let { cardTable } = this.props;
		let { createCardTable } = cardTable;
		return (
			<div className="nc-bill-table-area tabs-add">
				{//表格ID;
				createCardTable(CARDTEMPLATEINFO.bodyAreaCode, {
					tableHead: this.getTableHead,
					showCheck: true,
					adaptionHeight: true,
					hideSwitch: this.hideSwitch,
					onAfterEvent: bodyAfterEvent.bind(this),
					onBeforeEvent: bodyBeforeEvent.bind(this),
					onSelected: rowSelectController.bind(this),
					onSelectedAll: rowSelectController.bind(this)
					// isAddRow: true
				})}
			</div>
		);
	}

	//创建表单界面
	createCardView() {
		let { BillHeadInfo, cardPagination } = this.props;
		let { createBillHeadInfo } = BillHeadInfo;
		let { createCardPagination } = cardPagination;
		let { form } = this.props;
		let { createForm } = form;
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createBillHeadInfo({
								title: getLangByResId(this, '4001ROUTE-000013') /**运输路线-物流组织 */,
								backBtnClick: onButtonClicks.bind(this, this.props, CARDBUTTONINFO.backBtnCode),
								initShowBackBtn: this.state.backStatus
							})}
						</div>
						{this.createBtnArea(CARDBUTTONINFO.headAreaCode)}
						<div className="header-cardPagination-area" style={{ float: 'right' }}>
							{createCardPagination({
								handlePageInfoChange: pageInfo_BtnClick.bind(this),
								dataSource: TEMPLATEINFO.cacheKey
							})}
						</div>
					</NCDiv>
					<div className="nc-bill-form-area edit-input-list">
						{createForm(CARDTEMPLATEINFO.headAreaCode, {
							onAfterEvent: headAfterEvent.bind(this),
							onBeforeEvent: headBeforeEvent.bind(this)
						})}
					</div>
				</div>
				<div className="nc-bill-bottom-area">{this.createBodyArea()}</div>
			</div>
		);
	}

	hideSwitch = () => {
		return false;
	};
	//渲染表体操作按钮-增行
	getTableHead = () => {
		let { createButtonApp } = this.props.button;
		return (
			<div className="table-head-btns">
				{createButtonApp({
					area: CARDBUTTONINFO.innerAreaCode,
					buttonLimit: 3,
					onButtonClick: onButtonClicks.bind(this),
					ignoreHotkeyCode: [ CARDBUTTONINFO.delLineBtnCode ]
				})}
			</div>
		);
	};

	render() {
		let { afterinit } = this.state;
		if (!afterinit) {
			return '';
		}
		return <div>{this.createCardView()}</div>;
	}
}

Card = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: CARDTEMPLATEINFO.templateCode,
		headcode: CARDTEMPLATEINFO.headAreaCode,
		bodycode: CARDTEMPLATEINFO.bodyAreaCode
	}
})(Card);
export default Card;
// ReactDOM.render(<Card />, document.querySelector('#app'));
