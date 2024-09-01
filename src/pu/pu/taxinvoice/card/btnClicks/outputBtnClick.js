/*
 * @Author: chaiwx 
 * @PageInfo:输出
 * @Date: 2018-07-06 10:53:31 
 * @Last Modified by: jiangphkhkhkhk
 * @Last Modified time: 2019-04-15 16:13:06
 */
import { output } from 'nc-lightapp-front';
import { AREA, REQUESTURL, FIELDS } from '../../constance';

export default function(props) {
	let oids = [];
	let pk_taxinvoice = props.form.getFormItemsValue(AREA.cardFormId, [ FIELDS.pk_taxinvoice ])[0].value;
	oids.push(pk_taxinvoice);

	output({
		url: REQUESTURL.print,
		data: { oids: oids, outputType: 'output' }
	});
}
