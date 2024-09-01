/*
 * @Author: zhaochyu
 * @PageInfo: 期初暂估单表头编辑前事件
 * @Date: 2018-07-23 14:12:52
 * @Last Modified by: zhr
 * @Last Modified time: 2021-08-24 10:16:11
 */
import { HEAD_FIELD, FIELD, PAGECODE } from '../../constance';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import {
	canRateDateModify,
	canRateModify,
	rateTypeSellFilter,
	isRowSelfMake,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default async function(props, moduleId, key, value, record) {
	let field = [
		HEAD_FIELD.ccurrencyid,
		HEAD_FIELD.vtrantypecode,
		HEAD_FIELD.pk_busitype,
		HEAD_FIELD.fbillstatus,
		HEAD_FIELD.ntotalastnum,
		HEAD_FIELD.ntotalorigmny,
		HEAD_FIELD.pk_stockorg
	];
	if (key == HEAD_FIELD.vbillcode) {
		let constance = {
			key: HEAD_FIELD.vbillcode,
			formareaid: FIELD.formArea,
			pk_org_key: HEAD_FIELD.pk_org,
			billtype: PAGECODE.billType
		};
		return await vbillcodeBeforeEvent.call(this, props, constance);
		//return flag;
	}
	if (field.includes(key)) {
		return false;
	} else if (key == HEAD_FIELD.pk_dept || key == HEAD_FIELD.pk_dept_v || key == HEAD_FIELD.pk_bizpsn) {
		let pk_puchase = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_purchaseorg_v);
		if (pk_puchase && (pk_puchase.value == '' || pk_puchase.value == null)) {
			return false;
		}
	} else if (key == HEAD_FIELD.ctrantypeid || key == HEAD_FIELD.vtrantypecode) {
		return transtypeUtils.beforeEdit.call(this, key, HEAD_FIELD.ctrantypeid, HEAD_FIELD.vtrantypecode);
	} else if (key == HEAD_FIELD.pk_managepsn || key == HEAD_FIELD.pk_stordoc) {
		let pk_storckorg = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_stockorg_v);
		if (pk_storckorg && (pk_storckorg.value == '' || pk_storckorg.value == null)) {
			return false;
		}
	} else if (key == HEAD_FIELD.nexchangerate) {
		let corigcurrencyid = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.corigcurrencyid);
		let ccurrencyid = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.ccurrencyid);
		let fratecategory = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.fratecategory).value; // 获取汇率类型

		if (corigcurrencyid && ccurrencyid && ccurrencyid.value == corigcurrencyid.value) {
			return false;
		} else {
			return canRateModify.call(
				this,
				fratecategory,
				isBillSelfMake.call(this, fratecategory, PAGECODE.cardbody, 'csourcetypecode', [ '21' ])
			);
		}
	} else if (key == HEAD_FIELD.cratetype) {
		//组织汇率类型
		//补充参照过滤----------------------------
		let corigcurrencyid = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.corigcurrencyid);
		let ccurrencyid = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.ccurrencyid);
		if (corigcurrencyid && ccurrencyid && ccurrencyid.value == corigcurrencyid.value) {
			return false;
		}
	} else if (key == HEAD_FIELD.dratedate) {
		//组织汇率来源日期
		let fratecategory = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.fratecategory).value; // 获取汇率类型
		return canRateDateModify.call(
			this,
			fratecategory,
			isBillSelfMake.call(this, fratecategory, PAGECODE.cardbody, 'csourcetypecode', [ '21' ])
		);
	}
	return true;
}
