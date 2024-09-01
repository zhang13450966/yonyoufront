/*
 * @Author: CongKe
 * @PageInfo: 输出
 * @Date: 2018-07-05 10:25:42
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-27 09:40:01
 */
import { output } from 'nc-lightapp-front';
import { PAGECODE, FIELD, URL, OrderCache } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import remoteCheck from '../../../pub/remoteCall/remoteCheck';

export default function printOut(props) {
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	let funcode = null;
	let nodekey = '400400800';
	if (scene == 'approvesce') {
		// 审批的打印模板
		nodekey = '4004008006';
	} else if (scene == 'freeze' || scene == 'ADD') {
		funcode = '400400800';
	}
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	pk_order = pk_order == null || pk_order == '' || pk_order == 'undefined' ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	let pks = [];
	pks.push(pk_order);
	let queryInfo = {
		pks: pks,
	};
	remoteCheck.call(this, URL.printvalidate, queryInfo, () => {
		output({
			url: URL.print,
			data: { oids: pks, funcode: funcode, nodekey: nodekey, outputType: 'output' },
		});
	});
}
