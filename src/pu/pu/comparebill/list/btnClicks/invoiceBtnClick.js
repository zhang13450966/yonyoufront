/*
 * @Author: qishy 
 * @PageInfo:联查发票按钮
 * @Date: 2019-04-29 15:38:42 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-15 09:10:21
 */
import { ajax } from 'nc-lightapp-front';
import { FIELDS, REQUESTURL } from '../../constance';

export default function(props, record, index) {
	let headInfo = [];
	headInfo.push({
		pk: record[FIELDS.pk_comparebill].value,
		ts: record[FIELDS.ts].value
	});

	let data = {
		area: 'head',
		bodyInfo: null,
		headInfo: headInfo
	};

	ajax({
		url: REQUESTURL.pushTo25Check,
		data: data,
		success: (res) => {
			if (res.success) {
				props.openTo(null, {
					appcode: '400401600',
					pagecode: '400401600_card',
					idInfo: JSON.stringify(res.data),
					channelType: 'from2507'
				});
			}
		}
	});
}
