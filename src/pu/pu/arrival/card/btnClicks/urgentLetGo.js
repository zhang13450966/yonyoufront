/*
 * @Author: jiangfw 
 * @PageInfo: 紧急放行
 * @Date: 2018-06-27 13:13:14 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-30 11:30:13
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FIELD } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function urgentLetGo(props) {
	let head = {
		pk: props.form.getFormItemsValue(AREA.form, FIELD.pk_arriveorder).value,
		ts: props.form.getFormItemsValue(AREA.form, FIELD.ts).value
	};

	let data;
	let checkedRows = props.cardTable.getCheckedRows(AREA.table);
	if (checkedRows.length == 0) {
		// showWarningInfo(null, '请选择表体行');
		data = {
			head: head
		};
	} else {
		let bodys = [];
		checkedRows.forEach((checkedRow) => {
			let values = checkedRow.data.values;
			bodys.push({
				pk: values[FIELD.pk_arriveorder_b].value,
				ts: values[FIELD.ts].value
			});
		});
		data = {
			head: head,
			bodys: bodys
		};
	}

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
