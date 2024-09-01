/*
 * @Author: 刘奇 
 * @PageInfo: 联查预算  
 * @Date: 2019-03-15 14:15:02 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-19 17:09:57
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function buttonClick(props) {
	// 点击表头钮
	let seldatas = props.table.getCheckedRows(ARSUB_CONST.formId);
	if (seldatas == null || seldatas.length == 0) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000018')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	}
	let pks = [ seldatas[0].data.values[ArsubHeadItem.carsubid].value ];
	ajax({
		url: ARSUB_CONST.queryBudgetUrl,
		data: { pks: pks },
		success: (res) => {
			if (res.success) {
				this.setState({
					inspectionSourceData: res.data,
					showInspection: true
				});
			}
		}
	});
}
