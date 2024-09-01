/*
 * @Author: wangceb 
 * @PageInfo: 列表下修改按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:11:31
 */
import { ARSUB_CONST, BUTTON } from '../../const';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, record, index) {
	// let isEdit = isCanRevise(record);
	if (isEdit === false) {
		showErrorInfo(null, getLangByResId(this, '4006ARSUB-000013')); /* 国际化处理： 费用冲抵或者赠品兑付的订单不能修订！*/
		return;
	}
	props.pushTo(ARSUB_CONST.Card_URL, {
		status: ARSUB_CONST.edit,
		id: record.csaleorderid.value,
		buttonType: BUTTON.edit,
		pagecode: ARSUB_CONST.cardPageId
	});
}
