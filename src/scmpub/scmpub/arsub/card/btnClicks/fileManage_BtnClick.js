/*
 * @Author: 刘奇 
 * @PageInfo: 附件管理按钮事件
 * @Date: 2019-03-15 11:30:28 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-03-18 10:25:09
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';

export default function buttonClick(props) {
	let pk = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;

	this.setState({ showUploader: true, billid: pk });
}
