/*
 * @Author: jiangfw 
 * @PageInfo: 插入行 
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-22 10:54:54
 */
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, AREA } from '../../constance';
import { cacheData } from '../utils/cacheData';
let tableId = AREA.card_body;
export default function clickInsertLineBtn(props, index) {
	props.cardTable.addRow(this.tableId, index);
	RownoUtils.setRowNo(props, this.tableId, FIELD.crowno);
	cacheData.call(this, tableId);
}
