/*
 * @Author: chaiwx 
 * @PageInfo: 审批详情 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-08-20 19:42:13
 */
import { AREA, FIELDS } from '../../constance';

export default function(props) {
	let pk_taxinvoice = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_taxinvoice).value;
	let billtype = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.vtrantypecode).value;
	this.setState({ pk_taxinvoice: pk_taxinvoice, showApprove: true, billtype: billtype });
}
