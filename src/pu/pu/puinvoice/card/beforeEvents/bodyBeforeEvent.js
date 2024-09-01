/*
 * @Author: jiangfw 
 * @PageInfo: 表体编辑前事件 
 * @Date: 2018-04-25 20:36:56 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-07 19:44:52
 */
import { FIELD, PAGECODE, BILLTYPE, APPCODE, AREA, FREEFIELD } from '../../constance';
import changeRate from './changeRate';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { processBatchCodeItem } from '../../../pub/utils/batchCodeUtil';
// import { promises } from 'fs';

export default async function beforeBodyEvent(props, areaIds, key, value, index, record) {
	const { meta } = props;
	const { getMeta, setMeta } = meta;
	let headArea = areaIds.headArea;
	let bodyArea = areaIds.bodyArea;

	let cmeta = getMeta();
	// setMeta(cmeta);
	let items = cmeta[bodyArea].items;

	let pk_org = props.form.getFormItemsValue(headArea, FIELD.pk_org).value; // 财务组织
	let bfee = props.form.getFormItemsValue(headArea, FIELD.bfee).value; //费用发票
	let pk_stockorg = props.form.getFormItemsValue(headArea, FIELD.pk_stockorg).value; //库存组织
	let fbuysellflag = props.form.getFormItemsValue(headArea, FIELD.fbuysellflag).value; //购销类型
	let ctaxcountryid = props.form.getFormItemsValue(headArea, FIELD.ctaxcountryid).value; //报税国/地区
	let csaleinvoiceid =
		props.form.getFormItemsValue(headArea, FIELD.csaleinvoiceid) &&
		props.form.getFormItemsValue(headArea, FIELD.csaleinvoiceid).value; //协同销售发票id

	let castunitid = record.values.castunitid.value; // 单位
	let cunitid = record.values.cunitid.value; // 主单位
	let pk_material = record.values.pk_material.value; // 物料VID
	let sourceBillType = record.values.csourcetypecode.value; // 来源单据类型

	let coopFields = [
		FIELD.pk_material, //物料
		FIELD.nqtorigtaxnetprc, //无税净价
		FIELD.nqtorigtaxnetprc, //含税净价
		FIELD.norigtaxnetprice, //主含税净价
		FIELD.norignetprice, //主无税净价
		FIELD.norigmny //无税金额
	];
	if (csaleinvoiceid && coopFields.indexOf(key) != -1) {
		// 来自销售发票协同的数据不可以修改
		return false;
	}
	// 物料自由辅助属性和固定辅助属性
	let fixAssts = [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier_v', 'pk_supplier' ];
	if (key.startsWith('vfree') || fixAssts.includes(key)) {
		//辅助属性
		let flag;
		if (fixAssts.includes(key)) {
			flag = true;
		} else {
			let constance = {};
			constance.key = key;
			constance.params = {
				key: key,
				pk_org: pk_org,
				materialvid: pk_material
			};

			flag = await vfreeBeforeEvent(props, constance);
		}
		if (flag) {
			marAsstUtils.resetItem.call(
				this,
				props,
				APPCODE.puinvoice,
				PAGECODE.invoiceCard,
				bodyArea,
				key,
				record,
				FREEFIELD
			);
		}
		return flag;
	} else {
		for (const item of items) {
			if (key == item.attrcode) {
				// switch 整体是一个作用域, 不要再 case 中直接定义变量, 容易出现重复定义导致编辑不通过
				switch (key) {
					case FIELD.pk_material:
						// case FIELD.pk_srcmaterial:
						item.isMultiSelectedEnabled = true;
						// 依据采购组织过滤的字段
						if (
							BILLTYPE.purchaseIn == sourceBillType ||
							BILLTYPE.subcontIn == sourceBillType ||
							BILLTYPE.vmiSum == sourceBillType ||
							BILLTYPE.initEstimate == sourceBillType ||
							BILLTYPE.pscSettle == sourceBillType ||
							csaleinvoiceid
						) {
							return false;
						} else {
							props.cardTable.setQueryCondition(bodyArea, {
								[item.attrcode]: () => {
									return {
										pk_org: pk_org,
										bfee: bfee,
										GridRefActionExt: 'nccloud.web.pu.puinvoice.ref.MaterialRefFilter'
									};
								}
							});
						}
						break;
					case FIELD.pk_stordoc:
						// 没有库存组织或物料，仓库不可编辑
						if (!pk_stockorg || !pk_material) {
							// 设置仓库不可编辑 TODO
							// props.form.setFormItemsDisabled(headArea, { [FIELD.nexchangerate]: false });
							return false;
						} else {
							item.queryCondition = () => {
								return { pk_org: pk_stockorg };
							};
						}
						break;
					case FIELD.castunitid: //单位
						let flag = true;
						// let pk_material = record.values.pk_material.value; // 物料
						if (!pk_material) {
							flag = false;
						} else {
							// 根据本行物料做参照过滤
							props.cardTable.setQueryCondition(bodyArea, {
								[item.attrcode]: () => {
									return {
										pk_material: pk_material,
										GridRefActionExt: 'nccloud.web.pu.puinvoice.ref.AssistUnitBodyRefFilter'
									};
								}
							});
							flag = true;
						}
						return flag;
						break;
					case FIELD.nastnum: //数量
						// let castunitid = record.values.castunitid.value; // 单位
						// 没有单位，不让编辑数量
						if (!castunitid) {
							return false;
						}
						break;
					case FIELD.nnum: //主数量
						// let cunitid = record.values.cunitid.value; // 单位
						// 没有主单位，不让编辑主数量
						if (!cunitid) {
							return false;
						}
						break;
					case FIELD.nmny: //金额
						// 没有物料不让编辑金额
						if (!pk_material) {
							return false;
						}
						break;
					case FIELD.vchangerate: //换算率
						// 如果单位不存在或者主单位与单位相同,不允许编辑
						if (!castunitid || !cunitid || castunitid == cunitid) {
							return false;
						}
						return await changeRate.call(this, record);
						break;
					case FIELD.pk_apfinanceorg_v: //应付财务组织
						// 非空。参照采购订单或者采购入库单生成采购发票时，以采购订单或者采购入库单表体的应付组织作为采购发票的表体应付组织，
						// 并且不可编辑(有来源时就不可编辑) ； 自制采购发票时，应付组织根据表头财务组织带入默认值，可编辑。
						// 参照集团范围的组织类型为财务组织的组织单元录入。
						if (sourceBillType) {
							return false;
						}
						break;
					case FIELD.ncaltaxmny: //计税金额
						// 当购销类型 = 国内采购时不可编辑；购销类型 = 进口采购时跨国业务支持编辑
						if (2 == fbuysellflag) {
							return false;
						}
						break;
					case FIELD.ctaxcodeid: //税码
						props.cardTable.setQueryCondition(bodyArea, {
							[item.attrcode]: () => {
								return {
									fbuysellflag: fbuysellflag,
									ctaxcountryid: ctaxcountryid,
									GridRefActionExt: 'nccloud.web.pu.puinvoice.ref.TaxCodeBodyRefFilter'
								};
							}
						});
						break;
					case FIELD.pk_apliabcenter_v: //利润中心
						// 如果有来源，不允许编辑
						if (sourceBillType) {
							return false;
						} else {
							props.cardTable.setQueryCondition(bodyArea, {
								[item.attrcode]: () => {
									return {
										pk_manageorg: pk_org
									};
								}
							});
						}
						break;
					case FIELD.vbatchcode: //批次号
						let constance = {};
						constance.key = key;
						constance.params = {
							key: key,
							pk_org: pk_org,
							materialvid: pk_material,
							cmaterialvid: pk_material
						};
						flag = await vfreeBeforeEvent(this.props, constance);
						if (flag) {
							//当批次号可编辑时，处理批次号参照弹出框里的数据
							processBatchCodeItem.call(
								this,
								props,
								[ AREA.childform1, AREA.card_body ],
								key,
								record,
								BILLTYPE.invoice
							);
						}
						return flag;
					default:
						props.cardTable.setQueryCondition(bodyArea, {
							[item.attrcode]: () => {
								return {
									pk_org: pk_org
								};
							}
						});
				}
			}
		}
	}

	// 物料自由辅助属性和固定辅助属性
	// let fixAssts = [ 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier' ];
	// if (key.startsWith('vfree') || fixAssts.includes(key)) {
	// 	//辅助属性
	// 	let flag;
	// 	if (fixAssts.includes(key)) {
	// 		flag = true;
	// 	} else {
	// 		let constance = {};
	// 		constance.key = key;
	// 		constance.params = {
	// 			key: key,
	// 			pk_org: pk_org,
	// 			materialvid: pk_material
	// 		};

	// 		flag = await vfreeBeforeEvent(props, constance);
	// 	}
	// 	if (flag) {
	// 		// new Promise((resolve) => {
	// 		marAsstUtils.resetItem.call(
	// 			this,
	// 			props,
	// 			APPCODE.puinvoice,
	// 			PAGECODE.invoiceCard,
	// 			bodyArea,
	// 			key,
	// 			record
	// 			// marAsstUtils.filterRecord.call(this, 'vfree', fixAssts, record)
	// 		);
	// 		// 	resolve(true);
	// 		// });
	// 	}
	// 	return flag;
	// }

	// 交叉检验规则 在flag返回之前必须执行
	// let crossRuleParams = {
	// 	props,
	// 	key, //当前字段
	// 	appcode: null, //小应用编码，如果是本应用，可为空
	// 	pagecode: PAGECODE.cardcode, //页面编码
	// 	headarea: PAGECODE.cardhead, //表头区域编码
	// 	bodyarea: PAGECODE.cardbody, //表体区域编码
	// 	isHead: false, //是否为表头区字段
	// 	record, //当前表体行数据，如果是表头触发，可以为空
	// 	pk_org_field: FIELD.pk_org, //组织字段，注意为oid
	// 	billtype: '21', //单据类型
	// 	transtypeid_field: FIELD.ctrantypeid //交易类型id字段
	// };
	// crossRuleUtils.beforeEdit.call(this, crossRuleParams);

	return true;
}
