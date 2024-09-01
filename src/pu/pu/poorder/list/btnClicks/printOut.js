/*
 * @Author: CongKe
 * @PageInfo: 输出
 * @Date: 2018-08-09 13:46:46
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-27 09:50:59
 */
import { output, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import remoteCheck from '../../../pub/remoteCall/remoteCheck';

export default function printOut(props) {
	let pks = [];
	let selrows = props.table.getCheckedRows(PAGECODE.tableId);
	if (selrows.length == 0) {
		toast({
			color: 'danger',
			content: getLangByResId(this, '4004POORDER-000071') /* 国际化处理： 请选择要打印的订单！*/,
		});
		return;
	}
	selrows.forEach(row => {
		let pk = row.data.values.pk_order.value;
		if (pk) {
			pks.push(pk);
		}
	});
	let queryInfo = {
		pks: pks,
	};
	remoteCheck.call(this, URL.printvalidate, queryInfo, () => {
		output({
			url: URL.print,
			data: {
				oids: pks,
				nodekey: '400400800',
				outputType: 'output',
			},
		});
	});
}
