/*
 * @Author: 刘奇 
 * @PageInfo: 列表下修改按钮事件
 * @Date: 2019-03-29 14:04:08 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:19:39
 */

import { PREPAIDINVOICE_CONST, BUTTON } from '../../const';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, record, index) {
	if (isEdit === false) {
		showErrorInfo(null, getLangByResId(this, '4006PREPAIDINVOICE-000013')); /* 国际化处理： 费用冲抵或者赠品兑付的订单不能修订！*/
		return;
	}
	props.pushTo(PREPAIDINVOICE_CONST.Card_URL, {
		status: PREPAIDINVOICE_CONST.edit,
		id: record.csaleorderid.value,
		buttonType: BUTTON.edit,
		pagecode: PREPAIDINVOICE_CONST.cardPageId
	});
}
