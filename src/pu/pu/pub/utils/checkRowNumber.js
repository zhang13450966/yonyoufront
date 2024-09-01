/*
 * @Author: mikey.zhangchqf   处理行号不能重复问题
 * @Date: 2018-09-13 18:13:56 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-10-31 14:24:13
 */

import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';

import { showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
function checkRowNumber(props, moduleId, key, value, changedrows, index, crowno) {
	//行号不能重复
	//获取表体行数量
	let rows = props.cardTable.getNumberOfRows(moduleId);
	for (let i = 0; i < rows; i++) {
		let number = props.cardTable.getValByKeyAndIndex(moduleId, i, key).value;
		if (i != index && number == value) {
			showWarningInfo(null, getLangByResId(this, '4004pub-000003')); /* 国际化处理： 行号不能重复！*/
			//将旧值设置为显示值
			let oldvalue = changedrows[0].oldvalue.value;
			if (oldvalue) {
				props.cardTable.setValByKeyAndIndex(moduleId, index, key, {
					value: oldvalue,
					display: null,
					scale: '-1'
				});
				//给旧值赋值
				props.cardTable.saveChangedRowsOldValue(moduleId, index, key, changedrows[0].oldvalue.value);
			} else {
				props.cardTable.setValByKeyAndIndex(moduleId, index, key, {
					value: null,
					display: null,
					scale: '-1'
				});
				//给旧值赋值
				props.cardTable.saveChangedRowsOldValue(moduleId, index, key, changedrows[0].oldvalue.value);
			}
			RownoUtils.setRowNo(props, moduleId, crowno);
			return;
		}
	}
}
export { checkRowNumber };
