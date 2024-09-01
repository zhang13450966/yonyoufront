/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置表头编辑前   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-12-21 14:06:50
*/
import { TARGET_CARD } from '../../siconst';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import isRef from './isRef';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default async function(props, moduleId, key, value) {
	switch (key) {
		case TARGET_CARD.dbegindate:
		case TARGET_CARD.denddate:
		case TARGET_CARD.fcyclesetflag:
			let itemRows = props.cardTable.getVisibleRows(TARGET_CARD.target_item);
			if (itemRows && itemRows.length > 0) {
				showWarningInfo(undefined, getLangByResId(this, '4001TARGET-000020')); /* 国际化处理： 已经维护期间指标项，不允许修改*/
				return false;
			}
			break;
		case TARGET_CARD.fmarsetflag:
			let marRows = props.cardTable.getVisibleRows(TARGET_CARD.target_mar);
			if (marRows && marRows.length > 0) {
				let values = marRows[0].values;
				if (
					(Object.keys(values.cmarcombineid).length != 0 && values.cmarcombineid.value != '') ||
					(Object.keys(values.cbrandid).length != 0 && values.cbrandid.value != '') ||
					(Object.keys(values.cprodlineid).length != 0 && values.cprodlineid.value != '') ||
					(Object.keys(values.cmarbaseclassid).length != 0 && values.cmarbaseclassid.value != '') ||
					(Object.keys(values.cmarsaleclassid).length != 0 && values.cmarsaleclassid.value != '') ||
					(Object.keys(values.cmaterialid).length != 0 && values.cmaterialid.value != '')
				) {
					showWarningInfo(
						undefined,
						getLangByResId(this, '4001TARGET-000021')
					); /* 国际化处理： 物料维度已经维护了行记录，请删除行记录再修改*/
					return false;
				}
			}
			break;
		case TARGET_CARD.fyearflag:
			let rows = props.cardTable.getVisibleRows(TARGET_CARD.target_item);
			if (rows && rows.length > 0) {
				showWarningInfo(undefined, getLangByResId(this, '4001TARGET-000022')); /* 国际化处理： 销售指标表已维护关联指标项比例，年度不可改*/
				return false;
			}
			let flag = await isRef.call(this, props, moduleId, key, value);
			if (flag) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000023')
				); /* 国际化处理： 销售指标表已被销售指标维护或者已被销售返利政策引用，年度不可改*/
				return false;
			}
			break;
		case TARGET_CARD.fmaintainflag:
			let flag2 = await isRef.call(this, props, moduleId, key, value);
			if (flag2) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000024')
				); /* 国际化处理： 销售指标表已被销售指标维护或者已被销售返利政策引用，指标维护方式不可改*/
				return false;
			}
			break;
		case TARGET_CARD.fheadshowflag:
			let flag1 = await isRef.call(this, props, moduleId, key, value);
			if (flag1) {
				showWarningInfo(
					undefined,
					getLangByResId(this, '4001TARGET-000025')
				); /* 国际化处理： 销售指标表已被销售指标维护或者已被销售指标调整引用，指标维护表头设置不可改*/
				return false;
			}
			break;
	}
	return true;
}
