/*
 * @Author: chaiwx 
 * @PageInfo: 修改 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:19:25
 */
import { REQUESTURL, FIELDS, PAGECODE } from '../../constance';
import { ajax } from 'nc-lightapp-front';

export default function(props, record, index) {
	ajax({
		url: REQUESTURL.edit,
		data: record[FIELDS.pk_taxinvoice].value,
		success: (res) => {
			if (res.success) {
				props.pushTo(REQUESTURL.toCard, {
					status: 'edit',
					id: record[FIELDS.pk_taxinvoice].value,
					pagecode: PAGECODE.cardPagecode
				});
			}
		}
	});
}
