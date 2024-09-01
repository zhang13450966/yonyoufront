/*
 * @Author: CongKe
 * @PageInfo: 复制（列表态-行、浏览态-顶）
 * @Date: 2018-06-27 19:22:42
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-06-29 12:12:04
 */
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import RelateCTDLG from '../../relateCT/list';
import { URL, STATUS, FIELD, PAGECODE, BUTTON, TRANSFER, OrderCache } from '../../constance';
import { dateFormat } from '../../../../../scmpub/scmpub/pub/tool';
import { changeUrlParam, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { buttonController } from '../viewController/index';
import {
	createExtBillHeadAfterEventData,
	processExtBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import doCancel from './cancelButton';
let bodyids = [ PAGECODE.cardbody, PAGECODE.head_payment ];

export default function copyAddBtn() {
	changeUrlParam(this.props, { status: STATUS.edit, copyType: 'Y', tempstatus: STATUS.add });
	this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
	this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { [FIELD.pk_org_v]: false });
	let pk_org_v = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org_v);
	let aggvo = createExtBillHeadAfterEventData(
		this.props,
		PAGECODE.cardcode,
		PAGECODE.cardhead,
		bodyids,
		'card_head',
		'pk_org_v',
		pk_org_v
	);
	//补充主键数据避免加载时机问题导致数据丢失
	let pk_order = this.props.getUrlParam(FIELD.id);
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	if (pk_order) {
		setDefData(OrderCache.OrderCardCache, 'copypk', pk_order);
		changeUrlParam(this.props, { id: null });
		aggvo.card.head.card_head.rows[0].values.pk_order = { value: pk_order };
		aggvo.card.bodys[PAGECODE.cardbody].rows = new Array();
		aggvo.card.bodys[PAGECODE.head_payment].rows = new Array();
		buttonController.togglePageShow.call(this, this.props, BUTTON.Copy);
		getAfterData(this, aggvo);
	}
}

function getAfterData(_this, aggvo) {
	ajax({
		url: URL.interceptor,
		data: aggvo,
		method: 'POST',
		success: (res) => {
			let transtypeflag = true;
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				_this.props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						//参数二：界面使用的表格类型
						[PAGECODE.head_payment]: 'cardTable',
						[PAGECODE.cardbody]: 'cardTable'
					}
				);
			}
			if (res.data.extbillcard) {
				let data = res.data.extbillcard;
				if (data.head) {
					_this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
				}
				if (data.bodys) {
					let cards = data.bodys;
					if (cards.card_payment) {
						_this.props.cardTable.setTableData(PAGECODE.head_payment, cards[PAGECODE.head_payment]);
					}
					if (cards.card_material) {
						//应该加到setTableData的回调函数中
						_this.props.cardTable.setTableData(PAGECODE.cardbody, cards[PAGECODE.cardbody]);
					}
				}
			}
			if (res.data.userObject.relateCTVO && res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 提示*/
					content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否关联合同？*/
					beSureBtnName: getLangByResId(_this, '4004POORDER-000015') /* 国际化处理： 是*/,
					cancelBtnName: getLangByResId(_this, '4004POORDER-000016') /* 国际化处理： 否*/,
					beSureBtnClick: relateCTOKBtnClick.bind(_this, _this.props, event, res.data.userObject, aggvo), //点击确定按钮事件
					cancelBtnClick: transtypeAfterEvent.bind(_this, _this, event, res.data.userObject) //点击确定按钮事件
				});
				transtypeflag = false;
			}
			if (transtypeflag && _this.transtypeData && _this.transtypeData.transtype != undefined) {
				transtypeAfterEvent.call(_this, _this);
			} else {
				buttonController.togglePageShow.call(_this, _this.props, BUTTON.Copy);
				_this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: true });
			}
		},
		error: (error) => {
			setDefData(OrderCache.OrderCardCache, 'copypk', null);
			buttonController.doCancel.call(_this, _this.props, 'error');
			buttonController.showEmptyBrowsePage.call(_this);
			showErrorInfo(getLangByResId(_this, '4004POORDER-000039'), error.message); /* 国际化处理： 注意*/
		}
	});
}

function transtypeAfterEvent(_this) {
	// 复制时调用交易类型默认值设置方法
	transtypeUtils.setValue.call(_this, PAGECODE.cardhead, FIELD.ctrantypeid, FIELD.vtrantypecode);
	let moduleId = PAGECODE.cardbody;
	let key = 'ctrantypeid';
	let value = _this.props.form.getFormItemsValue(PAGECODE.cardhead, key);
	let aggvo = createExtBillHeadAfterEventData(
		_this.props,
		PAGECODE.cardcode,
		PAGECODE.cardhead,
		bodyids,
		PAGECODE.cardhead,
		key,
		value
	);
	gettransferAfterData(_this, aggvo);
}

function gettransferAfterData(_this, aggvo) {
	ajax({
		url: URL.cardHeadAfterEvent,
		data: aggvo,
		method: 'POST',
		success: (res) => {
			let transtypeflag = true;
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				_this.props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						//参数二：界面使用的表格类型
						[PAGECODE.head_payment]: 'cardTable',
						[PAGECODE.cardbody]: 'cardTable'
					}
				);
			}
			if (res.data.userObject.relateCTVO && res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
				promptBox({
					color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 关联合同*/
					content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要关联合同吗？*/
					beSureBtnName: getLangByResId(_this, '4004POORDER-000018') /* 国际化处理： 确定*/,
					cancelBtnName: getLangByResId(_this, '4004POORDER-000019') /* 国际化处理： 取消*/,
					beSureBtnClick: relateCTOKBtnClick.bind(_this, _this.props, event, res.data.userObject, aggvo), //点击确定按钮事件
					cancelBtnClick: relateCTCancelBtnClick.bind(_this, _this.props, event, res.data.userObject) //点击确定按钮事件
				});
				transtypeflag = false;
			}
			if (res.data.extbillcard) {
				processExtBillCardHeadEditResult(_this.props, PAGECODE.cardhead, bodyids, res.data);
			}
			setTimeout(() => {
				buttonController.togglePageShow.call(_this, _this.props, BUTTON.Copy);
				_this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: true });
			}, 0);
		}
	});
}

/**
 * 是否关联合同确定处理
 * @param {*} props
 * @param {*} userObject
 */
function relateCTOKBtnClick(props, event, userObject, aggvo) {
	let ctsalevos = userObject.relateCTVO;
	if (ctsalevos.pk_ct_pu.rows.length > 1) {
		let getSelectRows = (data) => {
			this.selCTViews = data;
		};
		this.props.modal.show('MessageDlg', {
			zIndex: 250,
			title: getLangByResId(this, '4004POORDER-000017'), // 弹框表头信息/* 国际化处理： 采购订单关联合同*/
			content: <RelateCTDLG billQueryPara={userObject} props={this.props} getSelectRows={getSelectRows} />, //弹框内容，可以是字符串或dom
			leftBtnName: getLangByResId(this, '4004POORDER-000018') /* 国际化处理： 确定*/,
			rightBtnName: getLangByResId(this, '4004POORDER-000019') /* 国际化处理： 取消*/,
			beSureBtnClick: selectCTOKBtnClick.bind(this, this.props, event, userObject, aggvo), //点击确定按钮事件
			cancelBtnClick: relateCTCancelBtnClick.bind(this, this.props, event, userObject)
		});
	} else if ((ctsalevos.pk_ct_pu.rows.length = 1)) {
		let head = props.form.getAllFormValue(PAGECODE.cardhead);
		let material = props.cardTable.getVisibleRows(PAGECODE.cardbody);
		let pay = props.cardTable.getVisibleRows(PAGECODE.head_payment);
		aggvo.card.head.card_head.rows = head.rows;
		aggvo.card.bodys.card_material.rows = material;
		aggvo.card.bodys.card_payment.rows = pay;
		aggvo['userObject'] = {
			relateCTVO: JSON.stringify(ctsalevos),
			relateCTROWS: [ 0 + '' ] //[ userObject.relateCTVO.pk_ct_pu.rows[0].values.crowno.value ]
		};
		getAfterData(this, aggvo);
	}
}

function selectCTOKBtnClick(props, event, userObject, aggvo) {
	let selCTViews = this.selCTViews;
	let indexrows = new Array();
	let rows = [];
	this.selCTViews.forEach((row) => {
		rows.push(row.data);
		indexrows.push(row.index + '');
	});
	let table = {
		areaType: 'table',
		pageinfo: null,
		rows: rows
	};
	let ctrows = {
		pageid: '400400800_ct', //pk_ct_pu
		table: table
	};
	let head = props.form.getAllFormValue(PAGECODE.cardhead);
	let material = props.cardTable.getVisibleRows(PAGECODE.cardbody);
	let pay = props.cardTable.getVisibleRows(PAGECODE.head_payment);
	aggvo.card.head.card_head.rows = head.rows;
	aggvo.card.bodys.card_material.rows = material;
	aggvo.card.bodys.card_payment.rows = pay;
	aggvo.userObject = aggvo['userobject'] || {};
	aggvo.userObject.relateCTVO = JSON.stringify(ctrows);
	aggvo.userObject.relateCTROWS = indexrows;
	getAfterData(this, aggvo);
}

function relateCTCancelBtnClick(props, event, userObject) {}
