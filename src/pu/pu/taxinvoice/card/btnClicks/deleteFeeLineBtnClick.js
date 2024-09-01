/*
 * @Author: jiangphk
 * @PageInfo: 表体删费用行  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-21 13:55:15
 */
import { AREA, BUTTONID, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, record, index) {
	let checkArr = props.cardTable.getCheckedRows(AREA.cardTableId);
	let rowIndexes = [];
	let rowcount = props.cardTable.getNumberOfRows(AREA.cardTableId); //获得所有行数
	let crowno = null;
	if (checkArr && checkArr.length > 0) {
		checkArr.forEach((row) => {
			crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, row.index, FIELDS.crowno);
			if (crowno && crowno.value) {
				for (let i = row.index + 1; i < rowcount; i++) {
					crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, i, FIELDS.crowno);
					if (crowno && crowno.value) {
						break;
					} else {
						rowIndexes.push(i);
					}
				}
				rowIndexes.push(row.index);
			}
		});
		if (rowIndexes.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000028')); //'无符合条件数据！'
		} else {
			props.cardTable.delRowsByIndex(AREA.cardTableId, rowIndexes);
			props.cardTable.selectAllRows(AREA.cardTableId, false);
			// 按钮可用性
			props.button.setDisabled({
				[BUTTONID.DeleteFeeLine]: true,
				[BUTTONID.DeleteMatLine]: true
			});
		}
	}
}
