/*
 * @Author: CongKe 
 * @PageInfo: 采购订单修订卡片表头编辑后事件
 * 所有字段的主组织过滤均在init中统一加入一次
 * @Date: 2018-07-25 10:02:28 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-11-06 10:51:34
 */
import { PAGECODE, FIELD } from '../../constance';
import { crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';

export default async function(props, moduleId, key, value) {
	let _this = this;
	let meta = this.props.meta.getMeta();
	let flag = true;
	if (key == 'brefwhenreturn') {
		// 退货/库基于原订单补货
		// 有下游单据，单据则不可以修改；
		// 无下游单据，可修订；
		let breturn = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'breturn').value;
		if (breturn == true) {
			flag = false;
		} else {
			let table = _this.props.cardTable.getAllData(PAGECODE.cardbody);
			//取到表体所有行 判断每行合同是否为空，只要有不为空的 就不可编辑 enable =fale;
			let first = true;
			// for (const o of table.rows) {
			// 	if (first) {
			// 		let naccumarrvnum = o.values.naccumarrvnum.value;
			// 		let naccumstorenum = o.values.naccumstorenum.value;
			// 		let naccuminvoicenum = o.values.naccuminvoicenum.value;
			// 		naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
			// 		naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
			// 		naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
			// 		if (naccumarrvnum > 0 || naccumstorenum > 0 || naccuminvoicenum > 0) {
			// 			flag = false;
			// 			first = false;
			// 		}
			// 	}
			// }
			table.rows.map((o) => {
				if (first) {
					let naccumarrvnum = o.values.naccumarrvnum.value;
					let naccumstorenum = o.values.naccumstorenum.value;
					let naccuminvoicenum = o.values.naccuminvoicenum.value;
					naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
					naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
					naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
					if (naccumarrvnum > 0 || naccumstorenum > 0 || naccuminvoicenum > 0) {
						flag = false;
						first = false;
					}
				}
			});
		}
		flag != false;
	} else if (key == 'vmemo' || key == 'cemployeeid' || key == 'pk_dept_v') {
		// 备注
		flag = true;
	} else if (key.startsWith('vdef')) {
		// 自定义项1——20
		flag = true;
	} else if (key == 'breturn') {
		flag = false;
	} else {
		// 其他均不可编辑
		flag = false;
	}
	let record = null;
	let crossRuleParams = {
		props,
		key, //当前字段
		appcode: null, //小应用编码，如果是本应用，可为空
		pagecode: PAGECODE.cardcode, //页面编码
		headarea: PAGECODE.cardhead, //表头区域编码
		bodyarea: PAGECODE.cardbody, //表体区域编码
		isHead: true, //是否为表头区字段
		record, //当前表体行数据，如果是表头触发，可以为空
		pk_org_field: FIELD.pk_org, //组织字段，注意为oid
		billtype: '21', //单据类型
		transtypeid_field: 'ctrantypeid' //交易类型id字段
	};
	crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	return flag;
}
