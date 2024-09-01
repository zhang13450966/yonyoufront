import { PAGECODE, FIELD } from '../../constance';
import {
	canRateModify,
	canRateDateModify,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default function(props, moduled, item, index, value, record) {
	let key = item.attrcode;
	// let meta = props.meta.getMeta();
	// meta[PAGECODE.childTableId].items.map((item) => {
	// 	if (item.attrcode === 'pk_supplier_v') {
	// 		item.queryCondition = () => {
	// 			let data = record.values.pk_financeorg.value;
	// 			return { pk_org: data };
	// 		};
	// 	}
	// });

	// props.meta.setMeta(meta);
	let flag = true;
	if (key == 'nestexchgrate') {
		// 折本汇率
		let pk_estcurrency = record.values.pk_estcurrency && record.values.pk_estcurrency.value; // 币种 本币
		let corigcurrencyid = record.values.pk_localcurrency && record.values.pk_localcurrency.value; //原币币种
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
			flag = canRateModify.call(this, fratecategory, true); // 这里永远没有自制场景
		}
		return flag;
	} else if (FIELD.cratetype == key) {
		// 组织汇率类型
		let pk_estcurrency = record.values.pk_estcurrency && record.values.pk_estcurrency.value; // 币种 本币
		let corigcurrencyid = record.values.pk_localcurrency && record.values.pk_localcurrency.value; //原币币种
		let flag = true;
		if (pk_estcurrency == corigcurrencyid) {
			flag = false;
		}
		return flag;
	} else if (key == FIELD.dratedate) {
		let fratecategory = record.values[FIELD.fratecategory] && record.values[FIELD.fratecategory].value; // 组织汇率类型
		return canRateDateModify.call(this, fratecategory, true); // 这里永远没有自制场景
	}
}
