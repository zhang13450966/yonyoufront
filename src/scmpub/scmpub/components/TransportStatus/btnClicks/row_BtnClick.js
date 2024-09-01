/*
 * @Author: wangceb 
 * @PageInfo: 行操作  
 * @Date: 2018-08-25 16:59:24 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-25 21:15:04
 */

import statusOperator from './statusOperator';
import { TRANSPORTSTATUS_CONST } from '../const';

export default function buttonClick(props, isClose) {
	let tableRows = props.table.getCheckedRows(TRANSPORTSTATUS_CONST.TABLEID);
	let rows = [];
	tableRows.forEach((element) => {
		rows.push(element.data);
	});
	let table = {
		areaType: 'table',
		areacode: TRANSPORTSTATUS_CONST.TABLEID,
		pageinfo: {
			pageIndex: -1
		},
		rows: rows
	};
	let data = {
		pageid: TRANSPORTSTATUS_CONST.PAGECODE,
		table: table
	};

	statusOperator.call(this, props, data, isClose);
}
