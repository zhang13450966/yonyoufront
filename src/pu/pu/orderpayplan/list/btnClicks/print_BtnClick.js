/*
 * @Author: CongKe
 * @PageInfo: 打印
 * @Date: 2018-07-04 14:50:40
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-28 16:27:09
 */
import { print, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import remoteCheck from '../../../pub/remoteCall/remoteCheck';

export default function print_BtnClick(props) {
	let pks = [];
	let selrows = props.editTable.getCheckedRows(PAGECODE.tableId);
	if (selrows.length == 0) {
		toast({
			color: 'danger',
			content: getLangByResId(this, '4004OPAYPLAN-000011') /* 国际化处理： 请选择要打印的订单！*/
		});
		return;
	}
	selrows.forEach((row) => {
		let pk = row.data.values.pk_order_payplan.value;
		if (pk) {
			pks.push(pk);
		}
	});
	let queryInfo = {
		pks: pks
	};
	remoteCheck.call(this, URL.printvalidate, queryInfo, () => {
		print(
			'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			URL.print,
			{
				//funcode: '400400806',
				//nodekey: '400400806', //模板节点标识
				oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			}
		);
	});
}
