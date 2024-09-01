/*
 * @Author: chaiwx 
 * @PageInfo: 复制 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:19:48
 */
import { REQUESTURL, OPTIONS, FIELDS, PAGECODE } from '../../constance';

export default function(props, record, index) {
	props.pushTo(REQUESTURL.toCard, {
		status: 'edit',
		id: record[FIELDS.pk_taxinvoice].value,
		option: OPTIONS.copy,
		pagecode: PAGECODE.cardPagecode
	});
}
