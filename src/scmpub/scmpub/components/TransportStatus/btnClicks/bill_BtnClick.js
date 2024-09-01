/*
 * @Author: wangceb 
 * @PageInfo: 整单操作  
 * @Date: 2018-08-25 16:59:24 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-25 21:34:04
 */

import statusOperator from './statusOperator';
import { TRANSPORTSTATUS_CONST } from '../const';

export default function buttonClick(props, isClose) {
	let tableRows = props.table.getAllTableData(TRANSPORTSTATUS_CONST.TABLEID);
	let table = {
		areaType: 'table',
		areacode: TRANSPORTSTATUS_CONST.TABLEID,
		pageinfo: {
			pageIndex: -1
		},
		rows: tableRows.rows
	};
	let data = {
		pageid: TRANSPORTSTATUS_CONST.PAGECODE,
		table: table
	};

	statusOperator.call(this, props, data, isClose);
}
