/*
 * @Author: yechd5 
 * @PageInfo: 协调设置卡片态删除
 * @Date: 2018-05-25 22:45:09 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:00:04
 */
import { ajax, cacheTools } from 'nc-lightapp-front';
import { COOPSETUP_CONST } from '../../const';
import { showSingleDeleteDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updatePksCache } from '../../pub/updatePksCache';
import buttonController from '../viewController/buttonController';

export default function delBtnClick(props) {
	showSingleDeleteDialog({
		beSureBtnClick: beSureBtnClick.bind(this, props)
	}); /* 国际化处理： 确认删除,确定要删除所选数据吗？*/
}
async function beSureBtnClick(props, selectedData) {
	let delData = {
		pageid: COOPSETUP_CONST.PAGEID_CARD,
		head: {},
		body: {}
	};

	let headData = props.form.getAllFormValue(COOPSETUP_CONST.FORMID);
	let pk_coopsetup = headData.rows[0].values.pk_coopsetup.value;
	let delpks = new Array();
	delpks.push(pk_coopsetup);
	let srcType = headData.rows[0].values.vbilltype_src.value;
	if (srcType == '21') {
		headData.rows[0].values.vbilltype_dest.value = '30';
	} else if (srcType == '30') {
		headData.rows[0].values.vbilltype_dest.value = '21';
	}
	delData.head[COOPSETUP_CONST.FORMID] = headData;
	delData.head[COOPSETUP_CONST.FORMID].areacode = COOPSETUP_CONST.FORMID;

	let body1 = props.editTable.getAllData(COOPSETUP_CONST.CARD_TABLEID1);
	let body2 = props.editTable.getAllData(COOPSETUP_CONST.CARD_TABLEID2);
	let body3 = props.editTable.getAllData(COOPSETUP_CONST.CARD_TABLEID3);
	let rows_1 = body1.rows;
	let rows_2 = body2.rows;
	let rows_3 = body3.rows;
	rows_1.push(...rows_2); // 合并两个页签的数据
	rows_1.push(...rows_3); // 合并两个页签的数据

	// 过滤“vvalueref”值为空的数据  rows_1[0].values.vvalueref.value
	for (let i = 0; i < rows_1.length; i++) {
		let vvalueref = rows_1[i].values.vvalueref;
		if (vvalueref == undefined) {
			rows_1.splice(i, 1);
			i--;
		}
	}
	// 取出表体数据，将vvalueref字段的value赋给字段 vvalue
	for (let j = 0; j < rows_1.length; j++) {
		let vvalueref_value = rows_1[j].values.vvalueref.value;

		rows_1[j].values.vvalue = {
			value: vvalueref_value,
			display: vvalueref_value
		};
	}

	body1.areacode = 'body';
	delData.body['coopsetbody'] = body1;
	delData.body['coopsetbody'].areacode = 'body';

	ajax({
		url: COOPSETUP_CONST.DELCARDURL,
		data: delData,
		pageid: COOPSETUP_CONST.PAGEID_CARD,
		success: (res) => {
			// 删除成功后，清空页面数据（清空表头，删除表体行）
			props.form.EmptyAllFormValue(COOPSETUP_CONST.FORMID);

			let tabLen_1 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID1);
			let tabLen_2 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID2);
			let tabLen_3 = props.editTable.getNumberOfRows(COOPSETUP_CONST.CARD_TABLEID3);
			delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID1, tabLen_1);
			delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID2, tabLen_2);
			delBodyRows(props, COOPSETUP_CONST.CARD_TABLEID3, tabLen_3);

			showSuccessInfo(getLangByResId(this, '4001COOPSETUP-000000')); /* 国际化处理： 删除成功！*/
			let allpks = cacheTools.get(COOPSETUP_CONST.CACHEPKS_KEY);
			let nextId = getNextJumpPk(allpks, pk_coopsetup);
			// 更新缓存
			let remains = updatePksCache(allpks, null, delpks);
			cacheTools.set(COOPSETUP_CONST.CACHEPKS_KEY, remains);
			props.pushTo(COOPSETUP_CONST.TOCARDURL, {
				status: COOPSETUP_CONST.BROWSE,
				id: nextId
			});

			buttonController.call(this, props, COOPSETUP_CONST.BROWSE);
			this.getData();
		}
	});
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

/**
 * 通过缓存找到下一个要跳转数据的主键
 * @description 若缓存只有1条，则返回空；若当前数据有下一条则返回下一个主键；若当前数据没有下一个主键，但是有上一个主键，则返回上一条
 * @param {} allpks 删除前的所有pks
 * @param {*} currDelPk 当前删除的pk
 */
function getNextJumpPk(allpks, currDelPk) {
	let delIndex = allpks.indexOf(currDelPk);
	let allLength = allpks.length;
	if (allLength == 1) {
		// 说明当前删除的是最后一个且缓存只有一条数据时，则返回空
		return '';
	} else if (delIndex == allLength - 1) {
		// 返回上一条数据主键
		return allpks[delIndex - 1];
	} else {
		// 返回下一个
		return allpks[delIndex + 1];
	}
}
