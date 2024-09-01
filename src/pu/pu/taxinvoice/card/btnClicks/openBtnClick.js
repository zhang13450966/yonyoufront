/*
 * @Author: chaiwx 
 * @PageInfo: 展开  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-09-08 09:22:30
 */
import { AREA } from '../../constance';

export default function(props, record, index) {
	let status = props.form.getFormStatus(AREA.cardFormId);
	if (status === 'browse') {
		props.cardTable.toggleRowView(AREA.cardTableId, record);
	} else {
		props.cardTable.openModel(AREA.cardTableId, 'edit', record, index);
	}
}
