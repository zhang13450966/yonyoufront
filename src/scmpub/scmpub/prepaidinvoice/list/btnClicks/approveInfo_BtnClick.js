/*
 * @Author: 刘奇 
 * @PageInfo: 查看审批详情操作
 * @Date: 2019-03-13 14:38:28 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-04-12 14:17:23
 */

import { PrepaidinvoiceHeadItem, BILLTYPE } from '../../const';

export default function buttonClick(props, record, index) {
	let hid = record[PrepaidinvoiceHeadItem.hid].value;
	// let transTypeCode = record[PrepaidinvoiceHeadItem.vtrantypecode].value;
	this.setState({ showApproveDetail: true, billid: hid, transTypeCode: BILLTYPE.prepaidinvoice });
}
