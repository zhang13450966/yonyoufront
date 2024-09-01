/*
 * @Author: 刘奇 
 * @PageInfo: 单据追溯  
 * @Date: 2019-03-15 11:16:05 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-15 11:19:04
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function queryAboutBusiness_BtnClick(props) {
	let pks = [];
	// 点击表头钮
	let selrows = props.table.getCheckedRows(PREPAIDINVOICE_CONST.formId);
	if (selrows == null || selrows.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	selrows.forEach((row) => {
		pks.push(row.data.values[PrepaidinvoiceHeadItem.hid].value);
	});
	this.setState({ showBillTrack: true, billid: pks[0] });
}
