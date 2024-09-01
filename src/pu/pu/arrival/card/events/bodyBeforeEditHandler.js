import { URL, PAGECODE, AREA, FIELD, BILLTYPE, FREEFIELD } from '../../constance';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { ajax } from 'nc-lightapp-front';
// import vbatchcodeBeforeEvent from '../../../../../ic/ic/pub/beforeEvents/vbatchcodeBeforeEvent';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { processBatchCodeItem } from '../../../pub/utils/batchCodeUtil';
import { dproducedateBeforeEvent } from '../../../../../ic/ic/pub/beforeEvents';
// import { vfreeBeforeEvent } from '../../../pub/beforeevent'
export default async function(moduleId, key, record, value) {
	let meta = this.props.meta.getMeta();
	if (key == 'vchangerate') {
		if (!(record.values.pk_material || {}).value) {
			return false;
		}
		let cunitid = (record.values.cunitid || {}).value;
		let castunitid = (record.values.castunitid || {}).value;
		if (cunitid && castunitid) {
			return await requestFixRate(record.values.pk_material.value, castunitid);
			// return async  () => {
			// 	await new Promise(function(resolve, reject) {
			// 		ajax({
			// 			method: 'post',
			// 			url: URL.fixRate,
			// 			data: { pk_material: record.values.pk_material.value, castunitid: castunitid },
			// 			success: (res) => {
			// 				let fixRate = res.data;
			// 				if (!fixRate) {
			// 					resolve(true);
			// 				} else {
			// 					resolve(false);
			// 				}
			// 			}
			// 		});
			// 	});
			// };
		}
	} else if ([ 'bfixedrate', 'bbackreforder' ].includes(key)) {
		return false;
	} else if (key == 'pk_material') {
		// if ((record.values.pk_order_b || {}).value) {
		// 	// TODO 参照过滤 参考上游单据
		// } else {
		// 	return false;
		// }
		if (record.values.csourcetypecode && record.values.csourcetypecode.value == '61') {
			return false;
		}
		return true;
	} else if ([ 'nnum', 'nastnum' ].includes(key)) {
		let nnum = (record.values.nnum || {}).value;
		if (!nnum || nnum < 0) {
			return true;
		}
		let naccumchecknum = (record.values.naccumchecknum || {}).value;
		if (naccumchecknum && naccumchecknum > 0) {
			return false;
		}
		return true;
	} else if (key == 'bpresent') {
		let bpresentsource = (record.values.bpresentsource || {}).value;
		if (bpresentsource) {
			return false;
		} else {
			return true;
		}
	} else if (key == 'dproducedate' || key == 'ivalidday') {
		// 生效日期，失效日期
		if (!(record.values.pk_material || {}).value) {
			return false;
		}
		let pk_org = this.props.form.getFormItemsValue(AREA.head, 'pk_org');
		let cmaterialvid = record.values.pk_material.value;
		let flag = await dproducedateBeforeEvent.call(this, this.props, key, pk_org, cmaterialvid);
		return flag;
	} else if (key.startsWith('vbdef') || key === 'vmemob') {
		let flag = true;

		return flag;
	} else if (key.startsWith('vfree') || [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid' ].includes(key)) {
		//辅助属性
		// let flag = true;
		// console.log(flag);
		let pk_org = this.props.form.getFormItemsValue(AREA.head, 'pk_org').value;
		let materialvid = record.values.pk_material.value;
		let constance = {};
		constance.key = key;
		constance.params = {
			key: key,
			pk_org: pk_org,
			materialvid: materialvid
		};
		let flag = await vfreeBeforeEvent(this.props, constance);
		// let flag = vfreeBeforeEvent(this.props, constance).then((result) => result);
		if (flag) {
			marAsstUtils.resetItem.call(this, this.props, '400401200', PAGECODE.card, moduleId, key, record, FREEFIELD);
		}
		return flag;
	} else if (key == 'vbatchcode') {
		//辅助属性
		let pk_org = this.props.form.getFormItemsValue(AREA.head, FIELD.pk_org).value;
		let materialvid = record.values.pk_material.value;
		let constance = {};
		constance.key = key;
		constance.params = {
			key: key,
			pk_org: pk_org,
			materialvid: materialvid,
			cmaterialvid: materialvid
		};
		let flag = await vfreeBeforeEvent(this.props, constance);
		if (flag) {
			//当批次号可编辑时，处理批次号参照弹出框里的数据
			processBatchCodeItem.call(this, this.props, [ AREA.body, AREA.childform1 ], key, record, BILLTYPE.arrival);
		}
		return flag;
	} else if (key == 'pk_receivestore') {
		// TODO 根据组织， 利润中心， 交易类型是否直运仓过滤
		meta[AREA.body].items.map((item) => {
			if (item.attrcode == 'pk_receivestore') {
				let pk_org = (record.values.pk_org || {}).value;
				let condition = {};
				let csourcetypecode = (record.values.csourcetypecode || {}).value;
				let vsourcetrantype = (record.values.vsourcetrantype || {}).value;
				let pk_arrliabcenter = (record.values.pk_arrliabcenter || {}).value;
				condition.pk_org = pk_org;
				condition.csourcetypecode = csourcetypecode;
				condition.vsourcetrantype = vsourcetrantype;
				condition.pk_arrliabcenter = pk_arrliabcenter;
				condition.GridRefActionExt = 'nccloud.web.pu.arrival.ref.ReceiveStoreRefSqlBuilder';
				this.props.cardTable.setQueryCondition(AREA.body, {
					[item.attrcode]: () => {
						return {
							csourcetypecode: csourcetypecode,
							vsourcetrantype: vsourcetrantype,
							pk_arrliabcenter: pk_arrliabcenter,
							pk_org: pk_org,
							busifuncode: 'st',
							GridRefActionExt: 'nccloud.web.pu.arrival.ref.ReceiveStoreRefSqlBuilder'
						};
					}
				});
			}
		});

		return true;
	} else if (
		[
			'bfixedrate',
			'bbackreforder',
			'fproductclass',
			'bpresentsource',
			'npresentastnum',
			'npresentnum',
			'ntaxrate',
			'pk_reqstoorg',
			'pk_reqstore',
			'pk_apfinanceorg',
			'pk_apfinanceorg_v',
			'pk_psfinanceorg',
			'pk_psfinanceorg_v',
			'dinvaliddate',
			'nexchangerate',
			'cffileid'
		].includes(key)
	) {
		return false;
	} else if (key == 'cprojecttaskid') {
		let cprojectid = (record.values.cprojectid || {}).value;
		if (!cprojectid) {
			return false;
		}
	} else if (key == 'pk_rack') {
		let pk_receivestore = (record.values.pk_receivestore || {}).value;
		if (!pk_receivestore) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function requestFixRate(pk_material, castunitid) {
	return new Promise((resolve, reject) => {
		ajax({
			method: 'post',
			url: URL.fixRate,
			data: { pk_material, castunitid },
			success: (res) => {
				let fixRate = res.data;
				if (!fixRate) {
					resolve(true);
				} else {
					resolve(false);
				}
			}
		});
	});
}
