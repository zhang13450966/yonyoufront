/*
 * @Author: wangceb 
 * @PageInfo: 打印  
 * @Date: 2018-08-25 16:59:24 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-08-27 10:05:05
 */
import { print, base, ajax } from 'nc-lightapp-front';
import statusOperator from './statusOperator';
import { TRANSPORTSTATUS_CONST } from '../const';
export default function buttonClick(props) {
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
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		'/nccloud/dm/transport/print.do',
		{
			appcode: TRANSPORTSTATUS_CONST.APPCODE,
			userjson: JSON.stringify(data)
		}
	);
}
