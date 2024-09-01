/*
 * @Author: CongKe
 * @PageInfo: 构造轻量级数据
 * @Date: 2019-12-04 09:11:59
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-04 09:53:55
 */
import { FIELD, AREA, PAGECODE } from '../../constance';

export default function construcateLightData(props, skipCodes) {
	let ts = props.form.getFormItemsValue(AREA.card_head, FIELD.ts).value;
	let id = props.form.getFormItemsValue(AREA.card_head, FIELD.pk_invoice).value;

	let data = [];
	//组装主键ts
	let commitObj = {
		ts: ts,
		id: id,
	};
	data.push(commitObj);

	skipCodes = skipCodes ? skipCodes : new Array();
	// 拼装json
	let dataInfo = {
		dataInfo: data,
		pagecode: PAGECODE.invoiceCard,
		skipCodes: skipCodes,
	};
	return dataInfo;
}
