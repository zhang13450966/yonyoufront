/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑态新增行  
 * @Date: 2018-05-05 15:13:42 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-23 20:37:17
 */

import { STOREREQ_CARD, ATTRCODES } from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
export default function clickAddRowBtn(props) {
	
	this.props.beforeUpdatePage();
	RownoUtils.resetRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
	this.forceUpdate();
	this.props.updatePage(STOREREQ_CARD.formId, STOREREQ_CARD.tableId);
}
