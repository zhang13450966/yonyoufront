/*
 * @Author: jiangfw 
 * @PageInfo: 采购发票收票
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-02 11:28:30
 */
import { URL, COMMON, PAGECODE } from '../../constance/index';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function MilestoninvoiceBtnClick() {
	// clearTransferCache(this.props, COMMON.TransferCacheKey);
	this.props.pushTo(URL.transfer21Pto25, { transType: this.transType, pagecode: PAGECODE.ref25_list });
}
