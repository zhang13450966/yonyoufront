import { FIELD, AREA } from '../../constance';

/*
 * @Author: jiangfw 
 * @PageInfo: 审批详情
 * @Date: 2018-04-25 20:44:53 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-09-08 14:28:49
 */
export default function clickApproveInfoBtn() {
	let props = this.props;
	let pk_invoice = props.getUrlParam(FIELD.id);
	let vtrantypecode = props.form.getFormItemsValue(AREA.card_head, FIELD.vtrantypecode).value;

	this.setState({
		showApproveInfo: true,
		billtype: vtrantypecode,
		pk_invoice: pk_invoice
	});
}
