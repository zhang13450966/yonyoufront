/*
 * @Author: wangceb 
 * @PageInfo: 获取采购发票列表选中数据
 * @Date: 2018-04-19 10:34:04 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-22 16:41:38
 */
import { AREA } from '../../constance/index';

function getSelectedDatas(props, record, index) {
	// index : 选中的行索引数组
	// bills : 选中行的数据数组，包含主键和ts
	let res = {};
	let bills = [];
	let selIndex = [];
	if (index == undefined || index == null) {
		// 点击表头删除按钮
		let selrows = props.table.getCheckedRows(AREA.list_head);
		if (selrows.length == 0) {
			return null;
		}
		selrows.forEach((row) => {
			let bill = {
				id: row.data.values.pk_invoice.value,
				ts: row.data.values.ts.value
			};
			bills.push(bill);
			selIndex.push(row.index);
		});
	} else {
		// 操作列上的删除按钮
		let bill = {
			id: record.pk_invoice.value,
			ts: record.ts.value
		};
		bills.push(bill);
		selIndex.push(index);
	}
	res.index = selIndex;
	res.bills = bills;
	return res;
}

export default getSelectedDatas;
