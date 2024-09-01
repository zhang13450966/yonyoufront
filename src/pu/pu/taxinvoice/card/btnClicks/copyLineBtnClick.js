/*
 * @Author: chaiwx 
 * @PageInfo: 表体复制行  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-07-06 13:17:17
 */
import { AREA, COPYPASTEBTNS } from '../../constance';
import { rowCopyPasteUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';

export default function(props, record, index) {
	if (index >= 0 && record) {
		// 操作列
		rowCopyPasteUtils.copyRow.call(
			this,
			props,
			AREA.cardTableId,
			record,
			COPYPASTEBTNS.initBtns,
			COPYPASTEBTNS.pasteBtns
		);
	} else {
		// 右肩
		rowCopyPasteUtils.copyRows.call(this, props, AREA.cardTableId, COPYPASTEBTNS.initBtns, COPYPASTEBTNS.pasteBtns);
	}
}
