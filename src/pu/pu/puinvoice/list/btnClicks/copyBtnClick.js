/*
 * @Author: maopch 
 * @PageInfo:  复制
 * @Date: 2018-08-03 09:50:44 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:43:24
 */

import { URL, UISTATE, COMMON, PAGECODE } from '../../constance/index';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function clickCopyBtn(props, record, index) {
	// 清除缓存
	setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, null);
	let id = record.pk_invoice.value;
	props.pushTo(URL.card, { status: UISTATE.edit, id, copy: true, option: 'copy', pagecode: PAGECODE.invoiceCard });
}
