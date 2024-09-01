/*
 * @Author: wangceb 
 * @PageInfo: 销售订单列表获取选中数据
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-14 13:54:31
 */
import { ARSUB_CONST, ArsubHeadItem } from '../../const';

function getSelectedOperaDatas(props, record, index, key) {
	if (key == undefined) {
		key = ArsubHeadItem.carsubid;
	}
	// index : 选中的行数组
	// bills : 选中行的数据数组，包含主键和ts
	let res = {};
	let pks = [];
	let selIndex = [];
	if (index == undefined) {
		// 点击表头钮
		let selrows = props.table.getCheckedRows(ARSUB_CONST.formId);
		if (selrows.length == 0) {
			return null;
		}
		selrows.forEach((row) => {
			let id = row.data.values[key].value + ',' + row.data.values.ts.value;
			pks.push(id);
			selIndex.push(row.index);
		});
	} else {
		// 操作列上按钮
		let id = record[key].value + ',' + record.ts.value;
		pks.push(id);
		selIndex.push(index);
	}
	res.index = selIndex;
	res.pks = pks;
	return res;
}

export default getSelectedOperaDatas;
