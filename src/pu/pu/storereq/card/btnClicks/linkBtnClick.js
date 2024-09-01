/*
 * @Author: zhangchangqing 
 * @PageInfo: 单据追溯
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-18 11:12:34
 */
import { STOREREQ_CARD, ATTRCODE } from '../../siconst';
export default function linkBtnClick(props) {
	// 获取选中行
	
	let pk = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq).value;
	this.setState({ pk: pk, showTrack: true });
}
