/*
 * @Author: zhaochyu 
 * @PageInfo: 删行操作
 * @Date: 2018-05-03 11:08:50 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-25 14:58:46
 */
import { FIELD, CARD_BUTTON, PAGECODE } from '../../constance';
import { toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import delLineRowBtnClick from './delLineRowBtnClick';
export default function(props, record, index) {
	if (record) {
		delLineRowBtnClick.call(this, props, index);
		return;
	}
	const { getCheckedRows, delRowsByIndex } = props.cardTable;
	let checkArr = getCheckedRows(FIELD.cardTable);
	if (checkArr && checkArr.length > 0) {
		let indexArr = checkArr.map((item) => {
			return item.index;
		});
		delRowsByIndex(FIELD.cardTable, indexArr);
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
	} else {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000011')
		}); /* 国际化处理： 请先选择要删除的行！*/
		return;
	}
}
