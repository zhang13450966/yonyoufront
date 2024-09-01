/*
 * @Author: jiangfw 
 * @PageInfo: 审批详情
 * @Date: 2018-04-25 20:44:53 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-09-08 14:07:45
 */
export default function clickApproveInfoBtn(record) {
	this.setState({
		showApproveInfo: true,
		billtype: record.vtrantypecode.value,
		pk_invoice: record.pk_invoice.value
	});
}
