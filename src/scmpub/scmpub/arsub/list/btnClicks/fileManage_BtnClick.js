/*
 * @Author: 刘奇 
 * @PageInfo: 附件管理按钮事件
 * @Date: 2019-03-15 11:30:28 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-15 13:23:47
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
	let pks = [];
	let vbillcodes = [];
	// 点击表头钮
	let selrows = props.table.getCheckedRows(ARSUB_CONST.formId);
	if (selrows == null || selrows.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	selrows.forEach((row) => {
		pks.push(row.data.values[ArsubHeadItem.carsubid].value);
		vbillcodes.push(row.data.values[ArsubHeadItem.vbillcode].value);
	});

	this.setState({ showUploader: true, billid: pks[0], vbillcode: vbillcodes[0] });
}
