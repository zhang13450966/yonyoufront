/*
 * @Author: zhangchangqing 
 * @PageInfo: 重排行号  
 * @Date: 2018-05-05 15:13:42 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-02-25 13:33:49
 */

import { ATTRCODES } from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
export default function clickAddRowBtn(props) {
	RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
}
