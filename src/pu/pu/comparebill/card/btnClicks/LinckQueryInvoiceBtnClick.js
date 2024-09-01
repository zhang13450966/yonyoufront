/*
 * @Author: chaiwx 
 * @PageInfo: 联查发票 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-05-14 19:53:42
 */
import { FIELDS, AREA } from '../../constance';

export default function(props) {
	let pk_comparebill = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_comparebill).value;
	props.openTo(null, {
		appcode: '400401600',
		pagecode: '400401600_list',
		id: pk_comparebill,
		channelType: 'from2507'
	});
}
