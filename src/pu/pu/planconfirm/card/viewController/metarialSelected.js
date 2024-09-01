/*
 * @Author: fangmj7 
 * @PageInfo: 进度确认单物料行选择
 * @Date: 2021-11-20 10:40:57 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-21 20:30:46
 */
import { AREA } from '../../constance';
import { BTNID } from '../../constance';

/**
 * 物料表格勾选事件
 * @param {*} props
 */
export default function metarialSelected(props) {
	let rowsdata = props.cardTable.getCheckedRows(AREA.body);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BTNID.DeleteLine]: rowsflag
	};
	props.button.setDisabled(disableArr);
}
