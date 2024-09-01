/* 
* @Author: lichaoah  
* @PageInfo:增行   
* @Date: 2020-02-25 13:10:46  
 * @Last Modified by: qishy
 * @Last Modified time: 2020-06-01 17:04:38
*/

import { getBusinessInfo } from 'nc-lightapp-front';
import { RownoUtils } from '../../../pub/tool/cardTableTools';
import { TARGET_CARD } from '../../siconst';
export default function addLineBtnClick(props, tableid, index) {
	let businessInfo = getBusinessInfo();
	let crowno;
	let defaultRowData = {
		pk_group: { display: businessInfo.groupName, value: businessInfo.groupId }
	};
	if (!index) {
		index = props.cardTable.getNumberOfRows(tableid);
	}

	props.cardTable.addRow(tableid, index, defaultRowData, false);
	//处理行号
	if (tableid == TARGET_CARD.target_org) {
		return;
	} else if (tableid == TARGET_CARD.target_item) {
		crowno = 'citemrowno';
	} else if (tableid == TARGET_CARD.target_mar) {
		crowno = 'cmarrowno';
	}
	RownoUtils.setRowNo(props, tableid, crowno);
}
