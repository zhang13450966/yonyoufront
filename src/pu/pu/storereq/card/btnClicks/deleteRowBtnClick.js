/*
 * @Author: zhangchangqing 
 * @PageInfo: 批量删除行  
 * @Date: 2018-05-05 16:20:51 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-10-31 14:53:44
 */

import { STOREREQ_CARD } from '../../siconst';
export default function clickdeleteRowBtn(props) {
	let rows = this.props.cardTable.getCheckedRows(STOREREQ_CARD.tableId);
	let rowIds = [];
	rows.map((item) => {
		rowIds.push(item.index);
	});
	
	this.props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, rowIds);
}
