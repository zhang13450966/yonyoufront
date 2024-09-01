/*
 * @Author: jiangfw 
 * @PageInfo: 采购发票收票
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2022-05-16 11:24:22
 */
import { URL, COMMON, PAGECODE, TRANSFER_TYPE } from '../../constance/index';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function ref55E6invoiceBtnClick() {
	clearTransferCache(this.props, COMMON.TransferCacheKey);
	this.props.pushTo(URL.transfer55E6to25, {
		transType: TRANSFER_TYPE.transfer55E6to25,
		pagecode: PAGECODE.ref55E6_list
	});
}
