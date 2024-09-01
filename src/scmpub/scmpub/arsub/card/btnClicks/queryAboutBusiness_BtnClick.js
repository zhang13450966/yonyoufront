/*
 * @Author: 刘奇 
 * @PageInfo: 单据追溯  
 * @Date: 2019-03-15 11:16:05 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-19 15:44:09
 */

import { ARSUB_CONST, ArsubHeadItem } from '../../const';

export default function queryAboutBusiness_BtnClick(props) {
	let pk = props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value;
	this.setState({ showBillTrack: true, billid: pk });
}
