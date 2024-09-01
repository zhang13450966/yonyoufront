/*
 * @Author: jiangfw 
 * @PageInfo: 新增行事件 
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-07 17:31:30
 */
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, AREA } from '../../constance';
import { cacheData } from '../utils/cacheData';

export default function clickAddLineBtn() {
	let rowCount = this.props.cardTable.getNumberOfRows(this.tableId);
	this.props.cardTable.addRow(
		this.tableId,
		rowCount,
		{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
		true
	);
	RownoUtils.setRowNo(this.props, this.tableId, FIELD.crowno);

	//this.props.cardTable.addRow(this.tableId);
	//RownoUtils.setRowNo(this.props, this.tableId, FIELD.crowno);
	this.props.cardTable.setColEditableByKey(this.tableId, FIELD.crowno, false);
	// 缓存数据
	cacheData.call(this, AREA.card_body);
}
