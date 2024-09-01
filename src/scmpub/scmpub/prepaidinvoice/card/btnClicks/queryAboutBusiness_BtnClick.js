/*
 * @Author: 刘奇 
 * @PageInfo: 单据追溯  
 * @Date: 2019-03-15 11:16:05 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-19 15:44:09
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem } from '../../const';

export default function queryAboutBusiness_BtnClick(props) {
	let pk = props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, PrepaidinvoiceHeadItem.hid).value;
	this.setState({ showBillTrack: true, billid: pk });
}
