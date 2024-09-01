/*
 * @Author: zhaochyu
 * @PageInfo: 表体编辑前事件
 * @Date: 2018-08-02 15:15:37
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-07 19:38:09
 */
import { ajax } from 'nc-lightapp-front';
import { BODY_FIELD, URL, PAGECODE, HEAD_FIELD, FREEFIELD } from '../../constance';
import { marAsstUtils, crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import vbatchcodeBeforeEvent from './vbatchcodeBeforeEvent';
import { processBatchCodeItem } from '../../../pub/utils/batchCodeUtil';
export default async function(props, moduleId, key, value, index, record, status) {
	let flag = true;
	let constance = {};
	let meta = this.props.meta.getMeta();
	let field = [
		BODY_FIELD.csourceid,
		BODY_FIELD.csourcebid,
		BODY_FIELD.vsourcerowno,
		BODY_FIELD.sourcets,
		BODY_FIELD.sourcebts,
		BODY_FIELD.vordertrantype,
		BODY_FIELD.pk_order_b,
		BODY_FIELD.pk_order,
		BODY_FIELD.vordercode,
		BODY_FIELD.corderrowno,
		BODY_FIELD.bsettlefinish,
		BODY_FIELD.naccsettlenum,
		BODY_FIELD.naccwashmny,
		BODY_FIELD.bestimateap,
		BODY_FIELD.naccinvoicenum,
		BODY_FIELD.ncaninvoicenum,
		BODY_FIELD.ncalcostmny,
		BODY_FIELD.ts,
		BODY_FIELD.pk_srcmaterial,
		BODY_FIELD.materialspec,
		BODY_FIELD.materialtype,
		BODY_FIELD.pk_batchcode,
		BODY_FIELD.cunitid,
		BODY_FIELD.fbuysellflag,
		BODY_FIELD.btriatradeflag,
		BODY_FIELD.csourcetypecode,
		BODY_FIELD.vsourcetrantype,
		BODY_FIELD.vsourcecode,
		BODY_FIELD.pk_materialname,
		BODY_FIELD.nasttaxprice,
		BODY_FIELD.nastprice,
		BODY_FIELD.nmny,
		BODY_FIELD.ntaxmny,
		BODY_FIELD.nprice,
		BODY_FIELD.ntaxprice,
		BODY_FIELD.pk_apliabcenter,
		BODY_FIELD.ts,
		BODY_FIELD.csourcetypecode,
		BODY_FIELD.vsourcetrantype,
		BODY_FIELD.vsourcecode,
		BODY_FIELD.csourceid,
		BODY_FIELD.csourcebid,
		BODY_FIELD.vsourcerowno,
		BODY_FIELD.sourcets,
		BODY_FIELD.sourcebts,
		BODY_FIELD.vordertrantype,
		BODY_FIELD.pk_order_b,
		BODY_FIELD.pk_order,
		BODY_FIELD.vordercode,
		BODY_FIELD.corderrowno,
		BODY_FIELD.bsettlefinish,
		BODY_FIELD.naccsettlenum,
		BODY_FIELD.naccwashmny,
		BODY_FIELD.bestimateap,
		BODY_FIELD.naccinvoicenum,
		BODY_FIELD.ncaninvoicenum,
		BODY_FIELD.vctcode,
		BODY_FIELD.naccgoodssettlemny,
		BODY_FIELD.naccsettlemny,
		BODY_FIELD.naccfeesettlemny,
		BODY_FIELD.nsourcenum,
		BODY_FIELD.baffectcost,
		BODY_FIELD.nestcalcostprice,
		BODY_FIELD.baffectpccost,
		BODY_FIELD.pk_initialest_b
	]; //来源单据类型 //来源交易类型 //主本币无税价 //主本币含税价 //本币含税单价 //本币无税单价 //本币无税金额
	let fixAssts = [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier_v', 'pk_supplier' ];
	if (field.includes(key)) {
		flag = false;
		//return false;
	} else if (key == BODY_FIELD.vchangerate) {
		flag = true;
		let cunitid = (record.values.cunitid || {}).value;
		let castunitid = (record.values.castunitid || {}).value;
		if (cunitid && castunitid) {
			let fn = new Promise((resolve, reject) =>
				ajax({
					method: 'post',
					url: URL.fixRate,
					data: {
						pk_material: record.values.pk_material.value,
						castunitid: castunitid
					},
					success: (res) => resolve(res.data)
				})
			);
			flag = await fn.then((result) => result);
		}
		if (!(record.values.pk_material || {}).value || cunitid == castunitid) {
			flag = false;
		}
	} else if (key == BODY_FIELD.pk_apfinanceorg_v) {
		flag = true;
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(PAGECODE.cardbody, index, BODY_FIELD.csourcetypecode);
		if (csourcetypecode == '21') {
			flag = false;
		} else {
			flag = true;
		}
	} else if (key == BODY_FIELD.pk_apliabcenter_v) {
		flag = true;
		let csourcebid = props.cardTable.getValByKeyAndIndex(PAGECODE.cardbody, index, BODY_FIELD.csourcebid).value;
		if (csourcebid != null) {
			flag = false;
			// return false;
		} else {
			let pk_org = record.values.pk_org && record.values.pk_org.value;
			props.cardTable.setQueryCondition(PAGECODE.cardbody, {
				[BODY_FIELD.pk_apliabcenter_v]: () => {
					return {
						pk_manageorg: pk_org
					};
				}
			});
			flag = true;
			//return true;
		}
	} else if (key == BODY_FIELD.castunitid) {
		flag = true;
		let pk_material = (record.values.pk_material || {}).value;
		if (pk_material == null || pk_material == '') {
			flag = false;
		} else {
			// 根据本行物料做参照过滤
			props.cardTable.setQueryCondition(PAGECODE.cardbody, {
				[BODY_FIELD.castunitid]: () => {
					return {
						pk_material: pk_material,
						GridRefActionExt: URL.castunitidSqlBuilder
					};
				}
			});
			flag = true;
		}
		//return flag;
	} else if (key == BODY_FIELD.ctaxcodeid) {
		// 税码
		flag = true;
		let ctaxcountryid = record.values.ctaxcountryid.value;
		let fbuysellflag = record.values.fbuysellflag.value;
		if (ctaxcountryid == null || null == fbuysellflag) {
			flag = false;
		} else {
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == BODY_FIELD.ctaxcodeid) {
					item.queryCondition = () => {
						return {
							ctaxcountryid: ctaxcountryid,
							fbuysellflag: fbuysellflag,
							GridRefActionExt: URL.ctaxcodeidSqlBuilder
						};
					};
				}
			});
		}
		//return flag;
	} else if (key == BODY_FIELD.ncaltaxmny) {
		flag = true;
		let fbuysellflag = record.values.fbuysellflag.value;
		//购销类型为国内采购(2)时不可编辑
		if (fbuysellflag == 2) {
			flag = false;
			//return false;
		} else {
			flag = true;
			//return true;
		}
	} else if (key == BODY_FIELD.vbatchcode) {
		flag = true;
		let constance = {
			key: BODY_FIELD.vbatchcode,
			headareaid: PAGECODE.cardhead,
			bodyareaid: PAGECODE.cardbody,
			pk_org_field: HEAD_FIELD.pk_org,
			cmaterialid_field: BODY_FIELD.pk_material,
			ccorrespondhid_field: HEAD_FIELD.pk_stockorg_v,
			index: index
		};
		let pk_material = record.values.pk_material.value;
		flag = await vbatchcodeBeforeEvent.call(this, props, constance);
		if (flag) {
			processBatchCodeItem.call(
				this,
				props,
				[ PAGECODE.cardbody, PAGECODE.childform1 ],
				key,
				record,
				PAGECODE.billType
			);
		}
		// meta[PAGECODE.cardbody].items.map(item => {
		//   if (item.attrcode == BODY_FIELD.vbatchcode) {
		//     item.queryCondition = () => {
		//       return { pk_material: pk_material };
		//     };
		//   }
		// });
		//return flag;
	} else if (key.startsWith('vfree') || fixAssts.includes(key)) {
		flag = true;
		let constance = {};
		//辅助属性
		let pk_org = record.values.pk_org.value;
		let materialvid = record.values.pk_material.value;
		if (fixAssts.includes(key)) {
			if (!materialvid) {
				flag = false;
				//return false;
			}
		} else {
			constance.key = key;
			constance.params = { key: key, pk_org: pk_org, materialvid: materialvid };
			flag = await vfreeBeforeEvent(this.props, constance);
		}
		if (flag) {
			marAsstUtils.resetItem.call(
				this,
				props,
				'400402800',
				PAGECODE.cardpagecode,
				moduleId,
				key,
				record,
				FREEFIELD
			);
		}
		//return flag;
		// let flag = true;
		// let pk_org = this.props.form.getFormItemsValue(
		//   PAGECODE.cardhead,
		//   HEAD_FIELD.pk_org
		// ).value;
		// let materialvid = record.values.pk_material.value;
		// constance.key = key;
		// constance.params = { key: key, pk_org: pk_org, materialvid: materialvid };
		// return await vfreeBeforeEvent(this.props, constance).then(result => result);
	}
	let crossRuleParams = {
		props,
		key, //当前字段
		appcode: null, //小应用编码，如果是本应用，可为空
		pagecode: PAGECODE.cardpagecode, //页面编码
		headarea: PAGECODE.cardhead, //表头区域编码
		bodyarea: PAGECODE.cardbody, //表体区域编码
		isHead: false, //是否为表头区字段
		record, //当前表体行数据，如果是表头触发，可以为空
		pk_org_field: HEAD_FIELD.pk_org, //组织字段，注意为oid
		billtype: '4T', //单据类型
		transtypeid_field: HEAD_FIELD.ctrantypeid //交易类型id字段
	};
	crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	return flag;
}
