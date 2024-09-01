/*
 * @Author: zhangshqb 
 * @PageInfo: 重排行号  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */

import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { AREA } from '../../constance';
export default function() {
	RownoUtils.resetRowNo(this.props, AREA.body, 'crowno');
}
