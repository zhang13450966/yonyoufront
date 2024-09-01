/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮批量行复制
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { toast } from 'nc-lightapp-front';
import { AREA } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	let _this = this;
	let selectedRow = _this.props.cardTable.getCheckedRows(AREA.body);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(_this, '4004ARRIVAL-000007') /* 国际化处理： 请选择数据！*/
		});
		return;
	}
	// props.button.setButtonVisible([ 'CopyLines', 'DeleteLine', 'ResetRowno' ], false);
	// props.button.setButtonVisible([ 'PastToThis', 'PastToLast', 'CancelPast' ], true);
	rowCopyPasteUtils.copyRows.call(
		_this,
		_this.props,
		AREA.body,
		[ 'CopyLines', 'DeleteLine', 'ResetRowno' ],
		[ 'PastToThis', 'PastToLast', 'CancelPast' ]
	);
	_this.setState({ isCopyLine: true });
	_this.props.button.setButtonDisabled([ 'PastToThis', 'PastToLast', 'CancelPast' ], false);
}
