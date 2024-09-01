/*
 * @Author: zhangshqb 
 * @PageInfo: 粘贴至末行 
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */

import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { AREA } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
export default function() {
	rowCopyPasteUtils.pasteRowsToTail.call(
		this,
		this.props,
		AREA.body,
		[ 'CopyLines', 'DeleteLine', 'ResetRowno' ],
		[ 'PastToThis', 'PastToLast', 'CancelPast' ],
		[ 'crowno', 'pk_arriveorder_b' ]
	);
	RownoUtils.setRowNo(this.props, AREA.body, 'crowno');
	// props.button.setButtonVisible([ 'CopyLines', 'DeleteLine', 'ResetRowno' ], true);
	// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
	this.setState({ isCopyLine: false });
	let selectedRow = this.props.cardTable.getCheckedRows(AREA.body);
	if (selectedRow == null || selectedRow.length == 0) {
		this.props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
	}
}
