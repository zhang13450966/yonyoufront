/*
 * @Author: chaiwx 
 * @PageInfo: 审批详情 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-08-20 19:13:58
 */
import { FIELDS, AREA } from '../../constance';

export default function(props, record, index) {
	let pk_taxinvoice = null;
	let billtype = null;
	if (index >= 0 && record) {
		// 操作列
		pk_taxinvoice = record[FIELDS.pk_taxinvoice].value;
		billtype = record[FIELDS.vtrantypecode].value;
	} else {
		pk_taxinvoice = props.table.getCheckedRows(AREA.listTableId)[0].data.values[FIELDS.pk_taxinvoice].value;
		billtype = props.table.getCheckedRows(AREA.listTableId)[0].data.values[FIELDS.vtrantypecode].value;
	}
	this.setState({ showApprove: true, pk_taxinvoice: pk_taxinvoice, billtype: billtype });
}
