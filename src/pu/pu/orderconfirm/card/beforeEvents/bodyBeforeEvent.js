/*
 * @Author: jiangfw
 * @PageInfo: 反确认表体编辑前事件 
 * @Date: 2018-08-06 15:53:53 
 * @Last Modified by:jiangfw
 * @Last Modified time: 2019-04-22 16:49:58
 */
import remoteRequest from '../../../pub/beforeevent/remoteRequest';
import { URL } from '../../constance';

let canEditColumn = [
	'dplanarrvdate' //计划到货日期
];

export default async function(props, moduleId, key, value, index, record, param) {
	let flag = false;

	let constance = {};
	let pk_org = record && record.values.pk_org.value;
	let vtrantypecode = this.props.form.getFormItemsValue(param.FROMID, 'vtrantypecode').value;
	if (key == 'vvendorordercode' || key == 'vvendororderrow') {
		//对方订单号、对方订单行号 与 单据号编辑性一样
		// 单据号
		constance.key = 'vbillcode';
		constance.params = {
			field: param.CODE,
			vtrantypecode: vtrantypecode
		};
		flag = await remoteRequest(URL.bodyBeforeEvent, constance);
		return flag;
	} else if (key == 'dconfirmdate') {
		// 确认日期
		constance.key = 'dbilldate';
		constance.params = {
			field: param.DATE,
			vtrantypecode: vtrantypecode
		};
		flag = await remoteRequest(URL.bodyBeforeEvent, constance);
	} else if (key == 'nconfirmnum') {
		//确认主数量
		constance.key = key;
		constance.params = {
			field: param.NUM,
			vtrantypecode: vtrantypecode
		};
		flag = await remoteRequest(URL.bodyBeforeEvent, constance);
	} else if (canEditColumn.includes(key)) {
		flag = true;
	}

	return flag;
}
