/*
 * @Author: jiangfw 
 * @PageInfo: 紧急放行
 * @Date: 2018-06-27 13:13:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-19 10:09:40
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL } from '../../constance';

export default function urgentLetGo(props) {
	let selectRow = props.table.getCheckedRows(AREA.head)[0];

	let head = {
		pk: selectRow.data.values.pk_arriveorder.value,
		ts: selectRow.data.values.ts.value
	};

	let data = {
		head: head
	};

	ajax({
		url: URL.pushToC005Check,
		data: data,
		success: (res) => {
			if (res.success) {
				props.openTo(null, {
					appcode: 'C01002800',
					pagecode: 'C01002800_card',
					channelType: 'from23',
					data: JSON.stringify(res.data)
				});
			}
		}
	});
}
