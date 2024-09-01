/*
 * @Author: 王龙华 
 * @PageInfo: 勾选框改变按钮控制
 * @Date: 2018-12-28 10:41:16 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-12-28 10:42:23
 */
import {INVSOURCE_CONST,INVSOURCE_BUTTONS} from '../../const';

export default function(props) {
    let selectLength = props.editTable.getCheckedRows(INVSOURCE_CONST.TABLEID).length;
	let flag = selectLength > 0 ? false : true;
	props.button.setDisabled({
		[INVSOURCE_BUTTONS.Delete]: flag
	});
}