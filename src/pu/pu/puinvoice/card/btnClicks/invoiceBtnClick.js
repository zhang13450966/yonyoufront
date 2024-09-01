/*
 * @Author: jiangfw 
 * @PageInfo: 采购发票收票
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:48:43
 */
import { URL, PAGECODE } from '../../constance';
// import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function clickInvoiceBtn() {
	// clearTransferCache(this.props, COMMON.TransferCacheKey);
	// this.props.pushTo(URL.multitransfer, { transType: this.transType });
	this.props.pushTo(URL.invoice, { transType: this.transType, pagecode: PAGECODE.refAll_list });
}
