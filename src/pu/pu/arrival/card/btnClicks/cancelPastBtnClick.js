/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态取消粘贴
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */

import { AREA } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
export default function() {
	rowCopyPasteUtils.cancel.call(
		this,
		this.props,
		AREA.body,
		[ 'CopyLines', 'DeleteLine', 'ResetRowno' ],
		[ 'PastToThis', 'PastToLast', 'CancelPast' ]
	);
	this.setState({ isCopyLine: false });
	let checks = this.props.cardTable.getCheckedRows(AREA.body);
	if (checks == null || checks.length == 0) {
		this.props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
	}
}
