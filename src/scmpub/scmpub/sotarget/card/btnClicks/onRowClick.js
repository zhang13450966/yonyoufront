/* * @Author: lichaoah  
* @PageInfo:销售指标点击行事件  
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-12-04 14:21:10
*/

import { TARGET_CARD } from '../../siconst';
import { getCacheData } from '../dataManange/cacheManange';
import { setRatioData } from '../dataManange/cardPageDataManange';
import { processTableField } from '../afterEvents/itemTypeBodyAfterEvent';
export default function(props, moduleId, record, index, e) {
	let fitemtypeflag = record.values[TARGET_CARD.fitemtypeflag].value;
	this.setState({ showTargetRatio: fitemtypeflag && fitemtypeflag != 3 });

	let rowid = this.target_item_rowid ? this.target_item_rowid : record.rowid;
	if (
		props.form.getFormStatus(TARGET_CARD.formId) != TARGET_CARD.browse &&
		props.cardTable.getValByKeyAndRowId(moduleId, rowid, TARGET_CARD.fitemtypeflag) &&
		props.cardTable.getValByKeyAndRowId(moduleId, rowid, TARGET_CARD.fitemtypeflag).value &&
		props.cardTable.getValByKeyAndRowId(moduleId, rowid, TARGET_CARD.fitemtypeflag).value != 3
	) {
		//缓存上一行销售指标比例
		this.target_item_cache[rowid] = props.cardTable.getAllData(TARGET_CARD.target_ratio);
	}
	//缓存下当前操作行
	this.target_item_rowid = record.rowid;
	if (fitemtypeflag && fitemtypeflag != 3) {
		//指标项类别
		processTableField.call(this, props, fitemtypeflag);
		//这个地方设置表体的主键
		setTargetRatioData.call(this, props, record.values[TARGET_CARD.clinkyearitemid].value, record);
	}
}
export function setTargetRatioData(props, clinkyearitemid, row) {
	let data = getCache.call(this, props, clinkyearitemid, row);
	if (data) {
		setRatioData(props, data);
	}
}
function getCache(props, clinkyearitemid, row) {
	let pk_target = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_target).value;
	let cache = getCacheData(props, pk_target);
	let data = undefined;
	if (cache && cache.bodys[TARGET_CARD.target_ratio]) {
		data = filterRow(cache.bodys[TARGET_CARD.target_ratio], clinkyearitemid, row);
	}
	let status = props.form.getFormStatus(TARGET_CARD.formId);
	if (status == TARGET_CARD.browse) {
		return data;
	} else {
		let editData = this.target_item_cache[this.target_item_rowid];
		return editData ? editData : data;
	}
}
function filterRow(data, clinkyearitemid, currentrow) {
	let rowData;
	data.rows.map((row) => {
		if (
			row.values[TARGET_CARD.clinkyearitemid].value &&
			clinkyearitemid == row.values[TARGET_CARD.clinkyearitemid].value &&
			row.values[TARGET_CARD.pk_target_item] &&
			row.values[TARGET_CARD.pk_target_item].value &&
			currentrow &&
			currentrow.values[TARGET_CARD.pk_target_item] &&
			currentrow.values[TARGET_CARD.pk_target_item].value &&
			row.values[TARGET_CARD.pk_target_item].value == currentrow.values[TARGET_CARD.pk_target_item].value
		) {
			rowData = row;
		}
	});
	data.rows = [ rowData ];
	return data;
}
