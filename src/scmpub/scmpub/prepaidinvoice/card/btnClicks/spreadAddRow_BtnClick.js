/*
 * @Author: 刘奇 
 * @PageInfo: 侧拉编辑增行处理(赋默认值)
 * @Date: 2019-05-28 21:02:45 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-05-28 21:04:12
 */

import { PREPAIDINVOICE_CONST } from '../../const';
import { ajax } from 'nc-lightapp-front';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

// index 指当前侧拉编辑的行index,从0开始
export default function buttonClick(props, tableId, index) {
	let data = props.createBodyAfterEventData(
		PREPAIDINVOICE_CONST.cardPageId,
		PREPAIDINVOICE_CONST.formId,
		PREPAIDINVOICE_CONST.tableId,
		PREPAIDINVOICE_CONST.formId,
		null,
		null
	);
	ajax({
		url: PREPAIDINVOICE_CONST.bodyrowafter,
		pageid: PREPAIDINVOICE_CONST.cardPageId,
		data: data,
		success: (res) => {
			if (res.data) {
				props.cardTable.updateDataByRowId(
					PREPAIDINVOICE_CONST.tableId,
					res.data.body[PREPAIDINVOICE_CONST.tableId]
				);
				RownoUtils.setRowNo(props, PREPAIDINVOICE_CONST.tableId);
			}
		}
	});
}
