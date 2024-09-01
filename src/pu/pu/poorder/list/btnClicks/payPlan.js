/*
 * @Author: CongKe 
 * @PageInfo: 生成付款计划
 * @Date: 2018-08-30 19:34:11 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-06 15:34:13
 */
import { URL, STATUS, FIELD, PAGECODE, APPCODE } from '../../constance';
import { toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function payPlan(props) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	// 2018-10-23 常伟提bug http://172.16.50.197:8080/browse/NCCLOUD-85550?filter=29818，说明如下：
	//采购订单付款计划按钮可用性-单选单据时：当单据状态为：审批通过时，按钮可用；当单据状态为：自由、审批中、审批不通过时，按钮不可用；多选单据时：按钮是否可用，按所选的第一条单据去判断；

	//单选且审批过的单据可用openTO付款计划
	if (rows.length > 0) {
		let forderstatus = rows[0].data.values.forderstatus.value; // 单据状态
		if (forderstatus == FIELD.approved) {
			let pk = rows[0].data.values.pk_order.value;
			props.openTo(URL.payplan, {
				id: pk,
				appcode: APPCODE.payplanAppCode,
				pk_org: JSON.stringify(rows[0].data.values[FIELD.pk_org]),
				vbillcode: rows[0].data.values[FIELD.vbillcode].value,
				dbilldate: rows[0].data.values[FIELD.dbilldate].value
			});
		} else {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004POORDER-000047') /* 国际化处理： 请选择审批通过的数据！*/
			});
		}
	}
}
