/*
 * @Author: chaiwx 
 * @PageInfo: 编辑前  
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-18 13:49:59
 */
import { AREA, FIELDS, BILLSTATUS, FREEFIELDS, REQUESTURL } from '../../constance';
import bodyRefFilter from '../events/bodyRefFilter';
import remoteRequest from './remoteRequest';
export default async function(props, moduleId, key, value, index, record) {
	// 编辑性控制
	let editFlag = true;

	if (FREEFIELDS[key] && FREEFIELDS[key] != null) {
		let crowno = (record.values[FIELDS.crowno] || {}).value;
		if (isNull(crowno)) {
			editFlag = false;
		}
	}
	if (key == FIELDS.cmaterialid) {
		editFlag = false;
	} else if (key == FIELDS.cunitid || key == FIELDS.castunitid) {
		//单位、主单位
		let pk_material = (record.values[FIELDS.cmaterialvid] || {}).value;
		if (isNull(pk_material)) {
			editFlag = false;
		}
	} else if (key == FIELDS.vchangerate) {
		//换算率
		let castunitid = (record.values[FIELDS.castunitid] || {}).value;
		if (isNull(castunitid)) {
			editFlag = false;
		} else {
			let cunitid = (record.values[FIELDS.cunitid] || {}).value;
			if (castunitid == cunitid) {
				editFlag = false;
			} else {
				let cmaterialvid = (record.values[FIELDS.cmaterialvid] || {}).value;
				let constance = {
					key: key,
					areaid: AREA.cardTableId,
					index: index,
					params: {
						cmaterialvid: cmaterialvid,
						castunitid: castunitid,
						cunitid: cunitid
					}
				};
				editFlag = await remoteRequest(REQUESTURL.bodyBeforeEdit, constance);
			}
		}
	} else if (key == FIELDS.creceiveaddrid) {
		//收货地址
		let creceivecustid = (record.values[FIELDS.creceivecustid] || {}).value;
		if (isNull(creceivecustid)) {
			editFlag = false;
		}
	} else if (key == FIELDS.cdelivorgvid) {
		//物流组织版本
		let csendstockorgid = (record.values[FIELDS.csendstockorgid] || {}).value;
		if (isNull(csendstockorgid)) {
			editFlag = false;
		}
	}

	bodyRefFilter(props, moduleId, key, value, index, record);

	return editFlag;
}

//判断某属性值是否为空
function isNull(data) {
	if (data == undefined || data == null || data == '') {
		return true;
	} else {
		return false;
	}
}
