/*
 * @Author: CongKe 
 * @PageInfo: 采购订单运输状态
 * @Date: 2018-10-09 15:29:05 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-10 15:31:31
 */

import { URL, PAGECODE, FIELD } from '../../constance';
import { ajax } from 'nc-lightapp-front';

export default function transportstatusquery() {
	let _this = this;
	let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	pk_order =
		pk_order == null || pk_order == '' || pk_order == 'undefined' ? this.props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
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
