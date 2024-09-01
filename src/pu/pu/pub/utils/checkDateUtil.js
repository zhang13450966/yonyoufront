/*
 * @Author: mikey.zhangchqf   请购单处理时间使用
 * @Date: 2018-09-13 18:13:56 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2018-12-24 11:08:59
 */

import moment from 'moment';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE, ATTRCODES } from '../../buyingreq/siconst';
function checkDateUtil(props) {
	//获取表体行数量
	//申请日期
	let tableId = BUYINGREQ_CARD.tableId;
	let dbilldate = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.dbilldate).value;
	dbilldate = moment(dbilldate).format('YYYY-MM-DD');
	let rownums = '';
	let rownumss = '';
	let rows = props.cardTable.getNumberOfRows(tableId);
	let returnmsg = null;
	for (let i = 0; i < rows; i++) {
		let dreqdate = props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.dreqdate).value;
		dreqdate = moment(dreqdate).format('YYYY-MM-DD');
		let dsuggestdate = props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.dsuggestdate).value;
		dsuggestdate = moment(dsuggestdate).format('YYYY-MM-DD');
		if (dbilldate > dreqdate || dbilldate > dsuggestdate) {
			if (i == 0) {
				rownums = rownums + props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.crowno).value;
			} else {
				rownums = rownums + ',' + props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.crowno).value;
			}
		}
		if (dsuggestdate > dreqdate) {
			if (i == 0) {
				rownumss = rownumss + props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.crowno).value;
			} else {
				rownumss = rownumss + ',' + props.cardTable.getValByKeyAndIndex(tableId, i, ATTRCODES.crowno).value;
			}
		}
	}
	if (rownums.length > 0) {
		returnmsg =
			getLangByResId(this, '4004pub-000000') +
			rownums +
			getLangByResId(this, '4004pub-000001'); /* 国际化处理： 第,行：请购日期大于建议订货日期或需求日期。\n*/
		//return returnmsg;
	}
	if (rownumss.length > 0) {
		if (returnmsg) {
			returnmsg =
				returnmsg +
				getLangByResId(this, '4004pub-000000') +
				rownumss +
				getLangByResId(this, '4004pub-000002'); /* 国际化处理： 第,行：建议订货日期大于需求日期。\n*/
		} else {
			returnmsg =
				getLangByResId(this, '4004pub-000000') +
				rownumss +
				getLangByResId(this, '4004pub-000002'); /* 国际化处理： 第,行：建议订货日期大于需求日期。\n*/
		}
	}
	return returnmsg;
}
/**
 * @param {*} props
 * @param {*} moduleId  
 * @param {*} key  操作字段
 * @param {*} value  字段值
 * @param {*} changedrows 
 * @param {*} index 索引
 * @param {*} record 行数据
 * @param {*} clearItems 需要清空值的字段 数组
 *
 */
function checkFieldsUtil(props, moduleId, key, value, changedrows, index, record, clearItems) {
	//物料控制判断
	if (key === ATTRCODES.pk_material) {
		//如果物料值为空，清空相应字段值
		if (value.length == 0 || !value.values) {
			for (let item = 0; item < clearItems.length; item++) {
				props.cardTable.setValByKeyAndIndex(moduleId, index, clearItems[item], {
					value: null,
					display: null,
					scale: '-1'
				});
			}
			return;
		}
		return true;
	}
}
export { checkDateUtil, checkFieldsUtil };
