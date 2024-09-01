/*
 * @Author: qishy 
 * 业务对账单列表修改按钮
 * @Date: 2019-04-29 11:11:30 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:10:13
 */
import { REQUESTURL, FIELDS, PAGECODE } from '../../constance';
import { ajax } from 'nc-lightapp-front';

export default function(props, record, index) {
	ajax({
		url: REQUESTURL.edit,
		data: record[FIELDS.pk_comparebill].value,
		success: (res) => {
			if (res.success) {
				props.pushTo(REQUESTURL.toCard, {
					status: 'edit',
					id: record[FIELDS.pk_comparebill].value,
					pagecode: PAGECODE.cardPagecode
				});
			}
		}
	});
}
