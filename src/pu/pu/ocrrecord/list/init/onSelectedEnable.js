/*
 * @Author: zhangbfk 
 * @PageInfo: 行选中事件
 * @Date: 2018-05-25 17:04:00 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-16 10:48:30
 */

import { AREA, BUTTONSTATE } from '../../constance';
import { buttonCntrol } from './btnEnable';
export default function(props) {
	let length = props.editTable.getCheckedRows(AREA.tableArea).length;
	//选中时对按钮可用性进行控制
	if (length > 0) {
		buttonCntrol(BUTTONSTATE.HASSELECTEDATA, false);
	} else {
		buttonCntrol(BUTTONSTATE.HASSELECTEDATA, true);
	}
}
