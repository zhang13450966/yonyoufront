/*
 * @Author: chaiwx 
 * @PageInfo: 编辑前 
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-08 16:59:02
 */

import { AREA, FIELDS, REQUESTURL } from '../../constance';
import remoteRequest from '../../../pub/beforeevent/remoteRequest';

export default async function(props, moduleId, key, value, oldvalue, refinfo) {
	// 编辑性控制
	let editFlag = true;

	if (key == FIELDS.vbillcode) {
		//单据号
		let pk_org = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org);
		let constance = {
			key: key,
			params: {
				pk_org: pk_org.value,
				billtype: '2507'
			}
		};
		editFlag = await remoteRequest(REQUESTURL.headBeforeEdit, constance);
		if (!editFlag) {
			return false;
		}
	}
	let unEditFiles = [
		'pk_supplier',
		'pk_supplier_v',
		'corigcurrencyid',
		'ccurrencyid',
		'nchangestdrate',
		'cratetype',
		'fratecategory',
		'dratedate'
	]; //供应商，本币，币种，汇率，汇率类型，汇率类别，汇率日期
	if (unEditFiles.includes(key)) {
		return false;
	}
	return editFlag;
}
