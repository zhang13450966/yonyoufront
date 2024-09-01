/*
 * @Author: zhangshqb 
 * @PageInfo: 行点击事件
 * @Data 2018-12-25
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:20:52
 */
import { PAGECODE } from '../../constance';

export default function rowClick(props, moduleId, record, index) {
	if (this.feeItems[record.values.pk_stockps_b.value]) {
		let data = this.props.editTable.getAllRows(PAGECODE.childTableId);
		if (data) {
			this.feeItems[data[0].values.pk_stockps_b.value].po_vmi_fee.rows = data;
		}
		this.props.editTable.setTableData(
			PAGECODE.childTableId,
			this.feeItems[record.values.pk_stockps_b.value].po_vmi_fee
		);
	}
}
