/*
 * @Author: qishy 
 * @PageInfo:卡片态打印
 * @Date: 2019-05-06 17:08:56 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-06 17:09:16
 */

import { output } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';

export default function(props) {
	let oids = [];
	let pk = props.form.getFormItemsValue(AREA.cardFormId, [ FIELDS.pk_comparebill ])[0].value;
	oids.push(pk);

	output({
		url: REQUESTURL.print,
		data: { oids: oids, outputType: 'output' }
	});
}
