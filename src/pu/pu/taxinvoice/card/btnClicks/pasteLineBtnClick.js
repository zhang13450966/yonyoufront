/*
 * @Author: chaiwx 
 * @PageInfo: 粘贴  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 16:50:15
 */
import { AREA, COPYPASTEBTNS, FIELDS, CLEARFIELDS } from '../../constance';
import { rowCopyPasteUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { RownoUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools';

export default function(props, record, index) {
	if (index >= 0 && record) {
		// 操作列 粘贴至此
		rowCopyPasteUtils.pasteRowsToIndex.call(
			this,
			props,
			AREA.cardTableId,
			index,
			COPYPASTEBTNS.initBtns,
			COPYPASTEBTNS.pasteBtns,
			CLEARFIELDS
		);
	} else {
		// 粘贴至末行
		rowCopyPasteUtils.pasteRowsToTail.call(
			this,
			props,
			AREA.cardTableId,
			COPYPASTEBTNS.initBtns,
			COPYPASTEBTNS.pasteBtns,
			CLEARFIELDS
		);
	}
	RownoUtils.setRowNo(props, AREA.cardTableId, FIELDS.crowno);
}
