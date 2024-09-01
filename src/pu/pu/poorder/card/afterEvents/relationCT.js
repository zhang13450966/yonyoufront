import { ajax, promptBox } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS, BUTTON, TRANSFER, OrderCache } from '../../constance';
import { changeUrlParam, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import RelateCTDLG from '../../relateCT/list';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createExtBillHeadAfterEventData,
	processExtBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';
let bodyids = [ PAGECODE.cardbody, PAGECODE.head_payment ];
let moduleId = PAGECODE.cardbody;
let key = 'dbilldate';

function relationCT(props, record, existRefData) {
	let value = props.form.getFormItemsValue(PAGECODE.cardhead, key);
	let aggvo = createExtBillHeadAfterEventData(
		props,
		PAGECODE.cardcode,
		PAGECODE.cardhead,
		bodyids,
		moduleId,
		key,
		value
	);
	let status = this.props.form.getFormStatus(PAGECODE.cardhead);
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	if (status == STATUS.edit && transfer != 'MULTI' && transfer != 'Z2') {
		let cachaggvo;
		if (existRefData) {
			cachaggvo = deepClone(aggvo);
			// 参照增行时排除已经存在的行数据
			if (aggvo.card) {
				let rows = aggvo.card.bodys[PAGECODE.cardbody].rows;
				let bodypks = [];
				let newrows = [];
				existRefData.data.forEach((e) => {
					e.bodys &&
						e.bodys.forEach((body) => {
							bodypks.push(body.pk.substring(0, 20));
						});
				});
				rows.forEach((row) => {
					if (bodypks.indexOf(row.values.csourcebid.value) < 0) {
						newrows.push(row);
					}
				});
				aggvo.card.bodys[PAGECODE.cardbody].rows = newrows;
			}
		}
		getAfterData(this, props, aggvo, false, cachaggvo);
	}
}

/**
 * 是否关联合同确定处理
 * @param {*} props
 * @param {*} userObject
 */
function relateCTOKBtnClick(props, userObject, aggvo) {
	let ctsalevos = userObject.relateCTVO;
	if (ctsalevos.pk_ct_pu.rows.length > 1) {
		let getSelectRows = (data) => {
			this.selCTViews = data;
		};
		props.modal.show('MessageDlg', {
			zIndex: 250,
			title: getLangByResId(this, '4004POORDER-000017'), // 弹框表头信息/* 国际化处理： 采购订单关联合同*/
			content: <RelateCTDLG billQueryPara={userObject} props={props} getSelectRows={getSelectRows} />, //弹框内容，可以是字符串或dom
			leftBtnName: getLangByResId(this, '4004POORDER-000018') /* 国际化处理： 确定*/,
			rightBtnName: getLangByResId(this, '4004POORDER-000019') /* 国际化处理： 取消*/,
			beSureBtnClick: selectCTOKBtnClick.bind(this, props, userObject, aggvo), //点击确定按钮事件
			cancelBtnClick: relateCTCancelBtnClick.bind(this, props, userObject)
		});
	} else if ((ctsalevos.pk_ct_pu.rows.length = 1)) {
		aggvo['userObject'] = {
			relateCTVO: JSON.stringify(ctsalevos),
			relateCTROWS: [ 0 + '' ] //[ userObject.relateCTVO.pk_ct_pu.rows[0].values.crowno.value ]
		};
		getAfterData(this, props, aggvo, true);
	}
}

function selectCTOKBtnClick(props, userObject, aggvo) {
	let indexrows = new Array();
	let rows = new Array();
	this.selCTViews.forEach((row, index) => {
		rows.push(row.data);
		indexrows.push(index + '');
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
	aggvo.userObject = aggvo['userobject'] || {};
	aggvo.userObject.relateCTVO = JSON.stringify(ctrows);
	aggvo.userObject.relateCTROWS = indexrows;
	getAfterData(this, props, aggvo, true);
}

function relateCTCancelBtnClick(props, userObject) {}

function getAfterData(_this, props, aggvo, isshowpage, cachaggvo) {
	ajax({
		url: URL.cardHeadAfterEvent,
		data: aggvo,
		method: 'POST',
		success: (res) => {
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
			if (res.data.userObject.relateCTVO) {
				if (res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 关联合同*/
						content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要关联合同吗？*/
						beSureBtnName: getLangByResId(_this, '4004POORDER-000018') /* 国际化处理： 确定*/,
						cancelBtnName: getLangByResId(_this, '4004POORDER-000019') /* 国际化处理： 取消*/,
						beSureBtnClick: relateCTOKBtnClick.bind(
							_this,
							_this.props,
							res.data.userObject,
							cachaggvo ? cachaggvo : aggvo
						), //点击确定按钮事件
						cancelBtnClick: relateCTCancelBtnClick.bind(_this, _this.props, res.data.userObject) //点击确定按钮事件
					});
				}
			}
			if (isshowpage == true) {
				if (res.data.extbillcard) {
					processExtBillCardHeadEditResult(_this.props, PAGECODE.cardhead, bodyids, res.data);
					// let data = res.data.extbillcard;
					// let head = data.head && data.head[PAGECODE.cardhead].rows;
					// let material = data.bodys && data.bodys[PAGECODE.cardbody].rows;
					// let pay = data.bodys && data.bodys[PAGECODE.head_payment] && data.bodys[PAGECODE.head_payment].rows;
					// if (data.head) {
					// 	_this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
					// }
					// if (data.bodys) {
					// 	let cards = data.bodys;
					// 	if (cards.card_payment) {
					// 		_this.props.cardTable.setTableData(PAGECODE.head_payment, cards[PAGECODE.head_payment]);
					// 	}
					// 	if (cards[PAGECODE.cardbody]) {
					// 		_this.props.cardTable.updateDataByRowId(PAGECODE.cardbody, cards[PAGECODE.cardbody], true);
					// 		// 19/01/15平台已支持拉单推单缓存页面数据
					// 		// cachedata.call(_this, head, pay, material);
					// 	}
					// }
				}
				changeUrlParam(_this.props, { id: null });
			}
		}
	});
}

function cachedata(headval, pay, material) {
	return;
	if (this.props.getUrlParam(TRANSFER.transfer) || this.props.getUrlParam(TRANSFER.channelType)) {
		let curindex = parseInt(this.curindex);
		let transferData = {};
		let head = { card_head: { rows: headval } };
		let body = { card_material: { rows: material } };
		if (pay && pay.length > 0) {
			body.card_payment = { rows: pay };
		}
		transferData.head = head;
		transferData.body = body;
		this.props.transferTable.setTransferListValueByIndex(PAGECODE.leftarea, transferData, curindex);
	}
}

export default {
	cachedata,
	relationCT,
	relateCTOKBtnClick,
	relateCTCancelBtnClick
};
