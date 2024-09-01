/*
 * @Author: chaiwx 
 * @PageInfo: 单据追溯 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-05-14 09:39:32
 */
import { FIELDS, AREA } from '../../constance';

export default function(props) {
	let pk_comparebill = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value;
	this.setState({ pk_comparebill: pk_comparebill, showTrack: true });
}
