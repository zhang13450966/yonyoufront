/*
 * @Author: yinliangc 
 * @PageInfo: 采购暂估表头编辑后
 * @Date: 2021-07-09 13:27:37 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-08-30 16:48:13
 */
import { FIELD } from '../../constance';
import {
	canRateModify,
	canRateDateModify,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default async function(props, moduleId, item, value, index, record) {
	let key = item.attrcode;
	if (
		[
			'onebillselect',
			'csendtypeid',
			'nesttaxrate',
			'pk_estcurrency',
			'nesttaxmny',
			'nestprice',
			'nestmny',
			'festtaxtype',
			'nesttaxprice',
			'nestoprice',
			'nestotaxprice',
			'nesttotalmny',
			'nestomny',
			'nestototalmny',
			'cesttaxcodeid',
			'nestnosubtaxrate',
			'nestcaltaxmny',
			'nestnosubtax'
		].includes(key)
	) {
		return true;
	} else if (FIELD.cratetype == key) {
		// 组织汇率类型
		let pk_estcurrency = record.values.pk_estcurrency && record.values.pk_estcurrency.value; // 币种 本币
		let corigcurrencyid = record.values.ccurrencyid && record.values.ccurrencyid.value; //原币币种
		let flag = true;
		if (pk_estcurrency == corigcurrencyid) {
			flag = false;
		}
		return flag;
	} else if (FIELD.nestexhgrate == key) {
		// 折本汇率
		let pk_estcurrency = record.values.pk_estcurrency && record.values.pk_estcurrency.value; // 币种 本币
		let corigcurrencyid = record.values.ccurrencyid && record.values.ccurrencyid.value; //原币币种
		let flag = true;
		if (pk_estcurrency == corigcurrencyid) {
			flag = false;
		} else {
			/**
		 * 汇率编辑性控制
		 * 1.原有汇率编辑性逻辑不变；
		 * 2.三个日汇率根据平台参数判断编辑性；
		 * 3.固定汇率在自制场景下可编辑（自制场景为：自制；有来源单据，但是来源单据无汇率类型字段，如采购订单拉请购单）；
		 * 4.自定义汇率，始终可编辑。
		 */
			let fratecategory = record.values[FIELD.fratecategory] && record.values[FIELD.fratecategory].value; // 组织汇率类型
			flag = canRateModify.call(this, fratecategory, false); // 这里永远没有自制场景
			return flag;
		}
	} else if (FIELD.dratedate == key) {
		// 组织汇率日期
		let fratecategory = record.values[FIELD.fratecategory] && record.values[FIELD.fratecategory].value; // 组织汇率类型
		return canRateDateModify.call(this, fratecategory, false); // 这里永远没有自制场景
	} else {
		return false;
	}
}
