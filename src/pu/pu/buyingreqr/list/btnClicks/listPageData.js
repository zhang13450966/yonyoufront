/*
 * @Author: wangceb 
 * @PageInfo: 销售订单列表获取选中数据
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-05-26 14:18:23
 */
import { SALEORDERREVISE_CONST } from '../../const';

function getSelectedOperaDatas(props, record, index) {
	// index : 选中的行数组
	// bills : 选中行的数据数组，包含主键和ts
	let res = {};
	let bills = [];
	let selIndex = [];
	if (index == undefined) {
		// 点击表头删除按钮
		let selrows = props.table.getCheckedRows(SALEORDERREVISE_CONST.formId);
		if (selrows.length == 0) {
			return null;
		}
		selrows.forEach((row) => {
			let bill = {
				pk: row.data.values.csaleorderid.value,
				ts: row.data.values.ts.value
			};
			bills.push(bill);
			selIndex.push(row.index);
		});
	} else {
		// 操作列上的删除按钮
		let bill = {
			pk: record.csaleorderid.value,
			ts: record.ts.value
		};
		bills.push(bill);
		selIndex.push(index);
	}
	res.index = selIndex;
	res.bills = bills;
	return res;
}

export default getSelectedOperaDatas;
