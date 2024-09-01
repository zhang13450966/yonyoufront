/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑态新增行  
 * @Date: 2018-05-05 15:13:42 
 * @Last Modified by: zhangchangqing
 * @Last Modified time: 2018-05-28 18:24:49
 */

import { TARGETADJ_CARD } from '../../siconst';
export default function clickAddRowBtn(props) {
	props.cardTable.addRow(TARGETADJ_CARD.tableId);
}
