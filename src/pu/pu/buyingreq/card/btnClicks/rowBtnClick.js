/*
 * @Author: zhangchangqing 
 * @PageInfo: 重排行号  
 * @Date: 2018-05-05 15:13:42 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-08-01 20:38:13
 */

import { BUYINGREQ_CARD, ATTRCODES } from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
export default function clickAddRowBtn(props) {
	
	//RownoUtils.resetRowNo(props, BUYINGREQ_CARD.tableId, ATTRCODES.crowno);
	RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
}
