/*
 * @Author: yechd5 
 * @PageInfo: 协同设置卡片新增
 * @Date: 2018-06-06 22:02:34 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 14:59:41
 */
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController';

export default function addBtnClick(props) {
	let pk = props.getUrlParam('id');
	props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.ADD,
		id: pk,
		srcoperator: COOPSETUP_CONST.CARD_ADD
	});
	// 清空表头和表体页签的行
	props.form.EmptyAllFormValue(COOPSETUP_CONST.FORMID);
	// 原先卡片浏览态有数据，则新增时删行
	// 原先卡片浏览态无数据，则新增时对表体页签不处理
	let tabLen_1 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID1);
	let tabLen_2 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID2);
	let tabLen_3 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID3);
	delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID1, tabLen_1);
	delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID2, tabLen_2);
	delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID3, tabLen_3);

	// 按钮控制
	buttonController.call(this, props, COOPSETUP_CONST.ADD);
}

/**
 * 删除editTable的所有行
 * @param {} moduleId 
 * @param {*} bodyRowsLen 
 */
function delBodyRows(props, moduleId, bodyRowsLen) {
	if (bodyRowsLen > 0) {
		let rows = [];
		for (let i = 0; i < bodyRowsLen; i++) {
			rows.push(i);
		}
		props.editTable.deleteTableRowsByIndex(moduleId, rows);
	}
}
