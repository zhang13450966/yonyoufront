/*
 * @Author: zhaochyu 
 * @PageInfo: 行内删行操作 
 * @Date: 2018-07-11 15:19:51 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-02 15:57:47
 */
import { FIELD, PAGECODE, CARD_BUTTON } from '../../constance';
export default function(props, index) {
	props.cardTable.delRowsByIndex(FIELD.cardTable, index);
	let rowsdata = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[CARD_BUTTON.DeleteLine]: rowsflag,
		[CARD_BUTTON.CopyLine]: rowsflag
	};
	props.button.setDisabled(disableArr);
}
