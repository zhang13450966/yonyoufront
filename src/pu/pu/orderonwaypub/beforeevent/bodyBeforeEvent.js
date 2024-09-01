/*
 * @Author: CongKe 
 * @PageInfo: 订单运输状态卡片公共表体编辑前事件 
 * @Date: 2018-08-06 15:53:53 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-08-16 17:17:31
 */
import { URL } from '../../orderload/constance';
import remoteRequest from '../../pub/beforeevent/remoteRequest';

let canEditColumn = [
	'dplanarrvdate', //计划收货日期
	'cloadport', //装船港口
	'clandport', //到货港口
	'cshipname', //船名
	'cshipline', //船次号
	'dplanfreightdate', //计划到港日期
	'ccasecode', //货柜号
	'ccarrierv', //承运商
	'nsendoutnum' //本次发货数量
];

export default async function(props, moduleId, key, value, index, record, param) {
	let flag = false;
	let constance = {};
	let meta = this.props.meta.getMeta();
	let pk_org = record && record.values.pk_org.value;
	let vtrantypecode = this.props.form.getFormItemsValue(param.FROMID, 'vtrantypecode').value;
	filterPUORG.call(this, props, meta, moduleId, key, pk_org, 'pu');
	if (key == 'vbillcode') {
		// 装运单据号
		constance.key = key;
		constance.params = {
			field: param.CODE,
			vtrantypecode: vtrantypecode
		};
		flag = await remoteRequest(URL.bodyBeforeEvent, constance);
		return flag;
	} else if (key == 'dbilldate') {
		// 装运日期
		constance.key = key;
		constance.params = {
			field: param.DATE,
			vtrantypecode: vtrantypecode
		};
		flag = await remoteRequest(URL.bodyBeforeEvent, constance);
	} else if (canEditColumn.includes(key)) {
		return true;
	} else if (key.startsWith('vbdef')) {
		// 自定义项1——40
		return true;
	} else {
		return false;
	}
	return flag;
}

/**
 * 主组织参照过滤
 * @param {*} meta 
 * @param {*} moduleId 
 * @param {*} key 
 */
function filterPUORG(props, meta, moduleId, key, pk_org, busifuncode) {
	meta[moduleId].items.map((item) => {
		if (item.attrcode == key) {
			props.cardTable.setQueryCondition(moduleId, {
				[item.attrcode]: () => {
					return {
						pk_org: pk_org,
						busifuncode: busifuncode
					};
				}
			});
		}
	});
}
