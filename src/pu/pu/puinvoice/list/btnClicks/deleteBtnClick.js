/*
 * @Author: jiangfw 
 * @PageInfo: 删行
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-22 16:41:18
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance/index';

export default function clickDeleteBtn(props, record) {
	// 执行删除操作
	let delRows = [];
	let row = {
		id: record.pk_invoice.value,
		ts: record.ts.value
	};
	delRows.push(row);
	// 拼装json
	let deleteInfos = {
		deleteInfos: delRows
	};
	// 行号
	let numberindex = record.numberindex.value;
	// 发送请求
	ajax({
		url: URL.delete,
		data: deleteInfos,
		success: (res) => {
			props.table.deleteTableRowsByIndex(AREA.list_head, numberindex);
		}
	});
}
