/*
设置表体数据  
 * @Author: mikey.zhangchqf
 * @Date: 2018-08-27 13:59:18 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-29 11:00:06
 */

import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, LIST_BUTTON, STATUS, OrderReviseCache } from '../../constance';

//点击加号展开内嵌表格时，业务组请求表格数据，并且返回该数据
//record为点击的当前行信息; hasThisChild:是否已经有该子表，如果有，不需要再次请求；
export default function(record, hasThisChild) {
	if (!hasThisChild) {
		//发送ajax请求内嵌表格数据，并return该数据
		let pks = [];
		pks.push(this.props.pk_order);
		//内嵌表格列信息
		ajax({
			url: URL.queryHistoryBody,
			data: {
				pks: pks,
				pageid: PAGECODE.historycode,
				historyid: record.pk_order.value
			},
			success: (res) => {
				let { success, data } = res;
				if (success) {
					this.props.insertTable.setChildTableData(
						PAGECODE.cardhead,
						record,
						data[PAGECODE.cardbody],
						FIELD.pk_order
					);
				} else {
					this.props.insertTable.setChildTableData(PAGECODE.cardbody, record, { rows: [] });
				}
			}
		});
	}
}
