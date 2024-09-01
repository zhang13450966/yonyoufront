/*
 * @Author: CongKe 
 * @PageInfo: 打印
 * @Date: 2018-07-04 14:50:40 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-13 16:14:45
 */
import { print, toast } from 'nc-lightapp-front';
import { ARRIVEPLAN, URL } from '../../constance';

export default function print_BtnClick(props) {
	let pks = [];
	let selrows = props.editTable.getAllData('po_order_bb1');

	selrows.rows.forEach((row) => {
		let pk = row.values.pk_order_bb1.value;
		if (pk) {
			pks.push(pk);
		}
	});
	if (pks && pks.length > 0) {
		print(
			'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			URL.receiveplanprint,
			{
				funcode: '400400800',
				nodekey: '400400416', //模板节点标识
				oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			}
		);
	}
}
