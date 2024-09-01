/*
 * @Author: 刘奇 
 * @PageInfo: 查看审批详情操作
 * @Date: 2019-03-13 14:38:28 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-08-16 10:21:02
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';

export default function buttonClick(props) {
	let carsubid = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
	let transTypeCode = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.vtrantypecode).value;
	this.setState({ showApproveDetail: true, billid: carsubid, transTypeCode: transTypeCode });
}
