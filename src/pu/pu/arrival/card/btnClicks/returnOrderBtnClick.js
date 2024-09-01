/*
 * @Author: zhangshqb 
 * @PageInfo: 基于采购订单退货  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 16:45:25
 */

import { URL, COMMON, PAGECODE } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
export default function() {
	clearTransferCache(this.props, COMMON.arrivalReturn21CacheKey);
	this.props.pushTo(URL.return21, { type: 'return21', pagecode: PAGECODE.returnOrder });
}
