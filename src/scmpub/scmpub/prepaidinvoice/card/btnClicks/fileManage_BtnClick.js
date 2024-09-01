/*
 * @Author: 刘奇 
 * @PageInfo: 附件管理按钮事件
 * @Date: 2019-03-15 11:30:28 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-18 09:26:27
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';

export default function buttonClick(props) {
	let pk = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value;
	this.setState({ showUploader: true, billid: pk });
}
