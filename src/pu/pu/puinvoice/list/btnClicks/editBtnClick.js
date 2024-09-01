/*
 * @Author: jiangfw 
 * @PageInfo: 列表修改
 * @Date: 2018-06-02 09:49:26 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:43:10
 */
import { UISTATE, URL, AREA, COMMON, PAGECODE } from '../../constance/index';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function clickEditBtn(props, text, record) {
	// let id = cacheTools.get(tabCodeKey);
	// props.cardTable.setStatus(AREA.card_body, UISTATE.edit);
	// props.form.setFormStatus(AREA.card_head, UISTATE.edit);
	//props.pushTo(cardURL + '#status=edit&id=' + id);
	// 清除缓存
	setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, null);
	props.pushTo(URL.card, {
		status: UISTATE.edit,
		id: record.pk_invoice.value,
		pagecode: PAGECODE.invoiceCard
	});
}
