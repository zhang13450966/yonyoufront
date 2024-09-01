/*物料报检类型定义--编辑后
 * @Author: sunxxf 
 * @Date: 2019-03-07 18:06:55 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2019-07-06 13:31:28
 */
import { getBusinessInfo } from 'nc-lightapp-front';

export default function(props, moduleId, key, value, rows, index, record) {
	//编辑最后一行，自动增行
	let allRows = props.editTable.getAllRows(moduleId, true);
	let visiableRows = [];
	for (let i = 0; i < allRows.length; i++) {
		if (allRows[i].status == '3') {
			continue;
		}
		visiableRows.push(allRows[i]);
	}
	let len = visiableRows.length;
	if (index == len - 1) {
		props.editTable.addRow(moduleId, len, false, {
			pk_org: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId },
			pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
		});
	}
}
