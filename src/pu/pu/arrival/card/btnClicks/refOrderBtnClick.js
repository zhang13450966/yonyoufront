/*
 * @Author: zhangshqb 
 * @PageInfo: 参照采购订单拉单  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 16:44:12
 */

import { URL, COMMON, PAGECODE } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
export default function() {
	clearTransferCache(this.props, COMMON.arrivalRef21CacheKey);
	this.props.pushTo(URL.transfer21, { type: 'transfer21', pagecode: PAGECODE.transferOrder });
}
