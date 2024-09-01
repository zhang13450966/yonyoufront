/*
 * @Author: CongKe 
 * @PageInfo: 采购订单运输状态
 * @Date: 2018-10-09 15:29:05 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-22 16:50:18
 */

import { URL, PAGECODE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function transportstatusquery() {
	let _this = this;
	let selectedRow = this.props.table.getCheckedRows(PAGECODE.tableId);
	if (selectedRow.length != 1) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000051') /* 国际化处理： 请选择行！*/
		});
		return;
	}
	let pk_order = selectedRow[0].data.values.pk_order.value;
	let conditionData = {
		pks: [ pk_order ],
		pageid: PAGECODE.cardcode
	};
	ajax({
		url: URL.transportstatusquery,
		data: conditionData,
		success: (res) => {
			if (res.success) {
				_this.setState({ transStateData: res.data, transStateShowFlag: true });
			}
		}
	});
}
