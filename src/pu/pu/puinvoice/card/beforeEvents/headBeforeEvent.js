/*
 * @Author: jiangfw 
 * @PageInfo: 表头编辑前事件 
 * @Date: 2018-04-25 20:36:56 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-08-30 15:18:31
 */
import { FIELD, BILLTYPE, AREA, BILLSTATUS, SCENE } from '../../constance';
import vbillcodeBeforeEdit from './vbillcodeBeforeEdit';
import freeCustBeforeEdit from './freeCustBeforeEdit';
import nglobalexchgrateBeforeEdit from './nglobalexchgrateBeforeEdit';
import ngroupexchgrateBeforeEdit from './ngroupexchgrateBeforeEdit';
import isSelfAdd from '../utils/isSelfAdd';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import {
	canRateDateModify,
	canRateModify,
	rateTypeSellFilter,
	isRowSelfMake,
	isBillSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default async function headBeforeEvent(props, areaIds, key, value, record) {
	const { meta } = props;
	const { getMeta, setMeta } = meta;
	let headArea = areaIds.headArea;
	let cmeta = getMeta();
	let items = cmeta[headArea].items;

	if (key == FIELD.vbillcode) {
		// 发票号
		return vbillcodeBeforeEdit.call(this, props);
	} else if (key == FIELD.nexchangerate) {
		// 折本汇率
		// 1.原币为空不让编辑
		// 2.原币、本币相同不允许编辑
		let ccurrencyid = props.form.getFormItemsValue(headArea, FIELD.ccurrencyid).value; //本币
		let corigcurrencyid = props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid).value; //原币
		let fratecategory = props.form.getFormItemsValue(headArea, FIELD.fratecategory).value; //// 获取汇率类型

		if (!corigcurrencyid || ccurrencyid == corigcurrencyid) {
			return false;
		} else {
			return canRateModify.call(
				this,
				fratecategory,
				isBillSelfMake.call(this, fratecategory, AREA.card_body, 'csourcetypecode', [ '21', '45', '4T', '61' ])
			);
		}
	} else if (key == FIELD.nglobalexchgrate) {
		let corigcurrencyid = props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid).value; //原币
		let ccurrencyid = props.form.getFormItemsValue(headArea, FIELD.ccurrencyid).value; //本币
		//全局本位币汇率
		return await nglobalexchgrateBeforeEdit.call(this, corigcurrencyid, ccurrencyid);
	} else if (key == FIELD.ngroupexchgrate) {
		let pk_group = props.form.getFormItemsValue(headArea, FIELD.pk_group).value; //集团
		let corigcurrencyid = props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid).value; //原币
		let ccurrencyid = props.form.getFormItemsValue(headArea, FIELD.ccurrencyid).value; //本币
		//集团本位币汇率
		return await ngroupexchgrateBeforeEdit.call(this, pk_group, corigcurrencyid, ccurrencyid);
	} else if (key == FIELD.ctrantypeid) {
		let fbillstatus = props.form.getFormItemsValue(headArea, FIELD.fbillstatus).value; //单据状态
		let editAble = true;
		if (fbillstatus == BILLSTATUS.approving || fbillstatus == BILLSTATUS.commit) {
			editAble = false;
		}
		// 交易类型发布的节点，不可编辑
		let flag = await transtypeUtils.beforeEdit.call(this, key, FIELD.ctrantypeid, FIELD.vtrantypecode);
		flag = flag && !(this.scene == SCENE.approvesce) && editAble;

		if (flag) {
			// 自制时不按流程找交易类型
			// 因为自制时交易类型编辑后，前台会先确定一个流程，再编辑时不能只参照此流程中的交易类型
			// 而有来源于时流程不能变，必须只找流程中的交易类型
			//交易类型
			let rows = props.cardTable.getAllRows(AREA.card_body, true);
			let pk_busitype = props.form.getFormItemsValue(headArea, FIELD.pk_busitype).value;
			let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
			let isSelf = isSelfAdd(rows);
			if (isSelf) {
				// 自制
				items.map((item) => {
					if (item.attrcode == FIELD.ctrantypeid) {
						item.queryCondition = () => {
							return {
								SCM_BUSIORG: pk_org,
								SCM_CONSIDERBUSITYPE: 'Y',
								parentbilltype: BILLTYPE.invoice,
								GridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
							};
						};
					}
				});
			} else {
				items.map((item) => {
					if (item.attrcode == FIELD.ctrantypeid) {
						item.queryCondition = () => {
							return {
								SCM_BUSIORG: pk_org,
								SCM_CONSIDERBUSITYPE: 'Y',
								parentbilltype: BILLTYPE.invoice,
								SCM_BUSITYPE: pk_busitype,
								GridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
							};
						};
					}
				});
			}
		} else {
			return false;
		}
	} else if (key == FIELD.csendcountryid || key == FIELD.crececountryid || key == FIELD.ctaxcountryid) {
		//发货国/地区、收货国/地区、报税国/地区
		let rows = props.cardTable.getAllRows(AREA.card_body, true);
		let isSelf = isSelfAdd.call(rows);
		if (!isSelf) {
			return false;
		}
		return true;
	} else if (key == FIELD.pk_bizpsn) {
		// 采购员
	} else if (key == FIELD.pk_dept_v) {
		// 采购部门
		let pk_purchaseorg = props.form.getFormItemsValue(headArea, FIELD.pk_purchaseorg);
		if (!pk_purchaseorg || !pk_purchaseorg.value) {
			return false;
		}
	} else if (key == FIELD.pk_bankaccbas) {
		// 银行账户
		let pk_supplier = props.form.getFormItemsValue(headArea, FIELD.pk_supplier);
		if (!pk_supplier || !pk_supplier.value) {
			return false;
		}
	} else if (key == FIELD.pk_freecust) {
		// 散户
		let pk_supplier = props.form.getFormItemsValue(headArea, FIELD.pk_supplier);
		if (!pk_supplier || !pk_supplier.value) {
			return false;
		} else {
			// 单据供应商不为空时判断散户，若不为散户，不可编辑（返回false）；若为散户，可编辑（不处理）。
			let flag = await freeCustBeforeEdit(pk_supplier.value);
			if (!flag) {
				return false;
			} else {
				items.map((item) => {
					if (item.attrcode == FIELD.pk_freecust) {
						item.queryCondition = () => {
							let pk_supplier = props.form.getFormItemsValue(headArea, FIELD.pk_supplier);
							return {
								pk_supplier: pk_supplier.value,
								customSupplier: pk_supplier.value
							};
						};
					}
				});
			}
		}
	} else if (key == FIELD.cratetype) {
		//组织汇率类型
		//补充参照过滤----------------------------
		// 1.原币为空不让编辑
		// 2.原币、本币相同不允许编辑
		let ccurrencyid = props.form.getFormItemsValue(headArea, FIELD.ccurrencyid).value; //本币
		let corigcurrencyid = props.form.getFormItemsValue(headArea, FIELD.corigcurrencyid).value; //原币
		if (!corigcurrencyid || ccurrencyid == corigcurrencyid) {
			return false;
		}
	} else if (key == FIELD.dratedate) {
		let fratecategory = props.form.getFormItemsValue(headArea, FIELD.fratecategory).value; //// 获取汇率类型

		//组织汇率来源日期
		return canRateDateModify.call(
			this,
			fratecategory,
			isBillSelfMake.call(this, fratecategory, AREA.card_body, 'csourcetypecode', [ '21', '45', '4T', '61' ])
		);
	}

	cmeta[headArea].items = items;
	setMeta(cmeta);

	// 交叉检验规则 在flag返回之前必须执行
	// let crossRuleParams = {
	// 	        props,
	// 	        key, //当前字段
	// 	        appcode: null, //小应用编码，如果是本应用，可为空
	// 	        pagecode: PAGECODE.cardcode, //页面编码
	// 	        headarea: PAGECODE.cardhead, //表头区域编码
	// 	        bodyarea: PAGECODE.cardbody, //表体区域编码
	// 	        isHead: false, //是否为表头区字段
	// 	        record, //当前表体行数据，如果是表头触发，可以为空
	// 	        pk_org_field: FIELD.pk_org, //组织字段，注意为oid
	// 	        billtype: '21', //单据类型
	// 	        transtypeid_field: FIELD.ctrantypeid //交易类型id字段
	//     };
	// crossRuleUtils.beforeEdit.call(this, crossRuleParams);

	return true;
}
