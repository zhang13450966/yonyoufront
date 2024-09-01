/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑态新增行  
 * @Date: 2018-05-05 15:13:42 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-27 18:17:28
 */

import { BUYINGREQ_CARD, ATTRCODES } from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
export default function clickAddRowBtn(props) {
	let rowCount = props.cardTable.getNumberOfRows(BUYINGREQ_CARD.tableId);
	props.cardTable.addRow(
		BUYINGREQ_CARD.tableId,
		rowCount,
		{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
		true
	);
	RownoUtils.setRowNo(props, BUYINGREQ_CARD.tableId, ATTRCODES.crowno);
}
