/*
 * @Author: yechd5 
 * @PageInfo: 侧拉编辑增行处理(赋默认值)
 * @Date: 2018-08-30 10:14:50 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-30 15:36:57
 */
import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

// index 指当前侧拉编辑的行index,从0开始
export default function buttonClick(props, tableId, index) {
	let data = props.createBodyAfterEventData(
		ARSUB_CONST.cardPageId,
		ARSUB_CONST.formId,
		ARSUB_CONST.tableId,
		ARSUB_CONST.formId,
		null,
		null
	);
	data['index'] = index;
	ajax({
		url: ARSUB_CONST.bodyrowafter,
		pageid: ARSUB_CONST.cardPageId,
		data: data,
		success: (res) => {
			if (res.data) {
				props.cardTable.updateDataByRowId(ARSUB_CONST.tableId, res.data.body[ARSUB_CONST.tableId]);
				RownoUtils.setRowNo(props, ARSUB_CONST.tableId);
			}
		}
	});
}
