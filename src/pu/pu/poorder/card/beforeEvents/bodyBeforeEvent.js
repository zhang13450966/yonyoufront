/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片表体编辑前事件
 * @Date: 2018-08-06 15:53:53
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-24 17:08:14
 */
import { toast } from 'nc-lightapp-front';
import { FIELD, PAGECODE, URL, FREEFIELD } from '../../constance';
import vbillcodeBeforeEvent from './vbillcodeBeforeEvent';
import vtrantypecode from './vtrantypecode';
import remoteRequest from './remoteRequest';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { processBatchCodeItem } from '../../../pub/utils/batchCodeUtil';
import { marAsstUtils, crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	canRateDateModify,
	canRateModify,
	rateTypeSellFilter,
	isRowSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default async function(props, moduleId, key, value, index, record) {
	let _this = this;
	let checkmaterial = record.values.pk_material.value;
	checkmaterial = checkmaterial == '' ? null : checkmaterial;
	if (key != 'pk_material' && checkmaterial == null) {
		return false;
	}
	let flag = true;
	let constance = {};
	let meta = this.props.meta.getMeta();
	let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
	meta[PAGECODE.cardbody].items.map((item) => {
		// if (item.attrcode == FIELD.pk_material) {
		// 	item.isMultiSelectedEnabled = true;
		// }
		if (item.attrcode == 'pk_reqdept_v') {
			props.cardTable.setQueryCondition(moduleId, {
				[item.attrcode]: () => {
					let pk_reqstoorg = record.values.pk_reqstoorg.value;
					return {
						pk_org: pk_reqstoorg,
						busifuncode: FIELD.STOCKORG
					};
				}
			});
		}
	});
	// props.meta.setMeta(meta);
	if (key == FIELD.castunitid) {
		// 计量单位
		let material = record.values.pk_material.value;
		if (material == null) {
			flag = false;
		} else {
			// 根据本行物料做参照过滤
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == FIELD.castunitid) {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_material: material,
								GridRefActionExt: 'nccloud.web.pu.order.ref.AssistUnitBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
			flag = true;
		}
	} else if (key == FIELD.cqtunitid) {
		// 报价单位
		flag = true;
		// 物料
		let materialmaterial = record.values.pk_material.value;
		if (materialmaterial == null) {
			flag = false;
		} else {
			// 根据本行物料做参照过滤
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == FIELD.cqtunitid) {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_material: materialmaterial,
								GridRefActionExt: 'nccloud.web.pu.order.ref.AssistUnitBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
			flag = true;
		}
	} else if (key == FIELD.pk_reqstordoc) {
		flag = true;
		let pk_reqstoorg = record.values.pk_reqstoorg.value;
		if (pk_reqstoorg == null) {
			flag = false;
		}
		// 过滤需求仓库参照
		meta[PAGECODE.cardbody].items.map((item) => {
			if (item.attrcode == FIELD.pk_reqstordoc) {
				props.cardTable.setQueryCondition(moduleId, {
					[item.attrcode]: () => {
						return {
							pk_org: pk_reqstoorg,
							busifuncode: FIELD.STOCKORG,
							GridRefActionExt: 'nccloud.web.pu.order.ref.RequestWarehouseBodyRefFilter'
						};
					}
				});
			}
		});
		// props.meta.setMeta(meta);
		// } else if (key == 'pk_apliabcenter_v') {
		// 	flag = true;
		// 	let pk_psfinanceorg = record.values.pk_psfinanceorg && record.values.pk_psfinanceorg.value;
		// 	meta[PAGECODE.cardbody].items.map((item) => {
		// 		if (item.attrcode == 'pk_apliabcenter_v') {
		// 			props.cardTable.setQueryCondition(moduleId, {
		// 				[item.attrcode]: () => {
		// 					return {
		// 						pk_manageorg: pk_psfinanceorg
		// 					};
		// 				}
		// 			});
		// 		}
		// 	});
		// } else if (key == 'pk_arrliabcenter_v') {
		// 	flag = true;
		// 	let pk_arrvstoorg = record.values.pk_arrvstoorg && record.values.pk_arrvstoorg.value;
		// 	meta[PAGECODE.cardbody].items.map((item) => {
		// 		if (item.attrcode == 'pk_arrliabcenter_v') {
		// 			props.cardTable.setQueryCondition(moduleId, {
		// 				[item.attrcode]: () => {
		// 					return {
		// 						pk_manageorg: pk_arrvstoorg
		// 					};
		// 				}
		// 			});
		// 		}
		// 	});
	} else if (key == FIELD.pk_recvstordoc) {
		// 收货仓库的编辑前事件
		flag = true;
		let pk_arrvstoorg = record.values.pk_arrvstoorg.value;
		if (pk_arrvstoorg == null) {
			flag = false;
		}
		let pk_arrliabcenter = record.values.pk_arrliabcenter.value; // 利润中心
		meta[PAGECODE.cardbody].items.map((item) => {
			if (item.attrcode == FIELD.pk_recvstordoc) {
				props.cardTable.setQueryCondition(moduleId, {
					[item.attrcode]: () => {
						return {
							pk_org: pk_arrvstoorg,
							busifuncode: FIELD.STOCKORG,
							pk_arrliabcenter: pk_arrliabcenter,
							GridRefActionExt: 'nccloud.web.pu.order.ref.RequestWarehouseBodyRefFilter'
						};
					}
				});
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == FIELD.pk_reqdept_v) {
		// 需求部门
		flag = true;
		let pk_reqstoorg = record.values.pk_reqstoorg.value;
		if (pk_reqstoorg == null) {
			flag = false;
		}
		let csourcetypecode = record.values.csourcetypecode.value;
		if (FIELD.PrayBill == csourcetypecode) {
			flag = false;
		}
		meta[PAGECODE.cardbody].items.map((item) => {
			if (item.attrcode == FIELD.pk_reqdept_v) {
				props.cardTable.setQueryCondition(moduleId, {
					[item.attrcode]: () => {
						return {
							pk_org: pk_reqstoorg,
							busifuncode: FIELD.STOCKORG
						};
					}
				});
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == FIELD.ccontractid) {
		//合同
		flag = true;
		let csourcetypecode = record.values.csourcetypecode.value;
		if (FIELD.PurDaily == csourcetypecode) {
			flag = false;
		}
		if (flag) {
			let pk_org = record.values.pk_org.value;
			let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
			let cmaterial = record.values.pk_material.value;
			let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.corigcurrencyid).value;
			let dbilldate = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.dbilldate).value;
			if (
				null == pk_org ||
				null == pk_supplier ||
				null == cmaterial ||
				null == corigcurrencyid ||
				null == dbilldate
			) {
				flag = false;
			}
			if (flag) {
				meta[PAGECODE.cardbody].items.map((item) => {
					if (item.attrcode == key) {
						props.cardTable.setQueryCondition(moduleId, {
							[key]: () => {
								return {
									pk_org: pk_org,
									pk_supplier: pk_supplier,
									pk_material: cmaterial,
									corigcurrencyid: corigcurrencyid,
									dbilldate: dbilldate,
									GridRefActionExt: 'nccloud.web.pu.order.ref.CcontractidBodyRefFilter'
								};
							}
						});
					}
				});
				// props.meta.setMeta(meta);
			}
		}
	} else if (key == FIELD.pk_material) {
		//物料
		flag = true;
		//let pk_org = record.values.pk_org.value;
		let csourcetypecode = record.values.csourcetypecode.value;
		if (FIELD.PurDaily == csourcetypecode) {
			let ccontractrowid = record.values.ccontractrowid.value;
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == FIELD.pk_material) {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							pk_org = record.values.pk_org.value;
							ccontractrowid = record.values.ccontractrowid.value;
							return {
								pk_org: pk_org,
								ccontractrowid: ccontractrowid,
								GridRefActionExt: 'nccloud.web.pu.order.ref.MaterialBodyRefFilter',
								TreeRefActionExt: 'nccloud.web.pu.order.ref.MaterialBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		} else if (!csourcetypecode) {
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == FIELD.pk_material) {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_org: pk_org
							};
						}
					});
				}
			});
		}
	} else if (key == FIELD.pk_reqstoorg_v) {
		//需求库存组织
		flag = true;
		let csourcetypecode = record.values.csourcetypecode.value;
		if (FIELD.PrayBill == csourcetypecode) {
			flag = false;
		} else if (FIELD.SoOrder == csourcetypecode) {
			flag = true;
			let vsourcetrantype = record.values.vsourcetrantype.value;
			constance.key = key;
			constance.params = {
				vsourcetrantype: vsourcetrantype
			};
			let direct = await remoteRequest(URL.bodybeforeedit, constance);
			if (direct) {
				//是直运的情况要做参照过滤 如果是直运，参照范围为结算财务组织下属的库存组织档案.
				let pk_psfinanceorg = record.values.pk_psfinanceorg.value;
				if (pk_psfinanceorg != null) {
					let pk_group = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_group).value;
					meta[PAGECODE.cardbody].items.map((item) => {
						if (item.attrcode == FIELD.pk_reqstoorg_v) {
							props.cardTable.setQueryCondition(moduleId, {
								[item.attrcode]: () => {
									return {
										pk_group: pk_group,
										pk_psfinanceorg: pk_psfinanceorg,
										GridRefActionExt: 'nccloud.web.pu.order.ref.ReqstoorgBodyRefFilter'
									};
								}
							});
						}
					});
					// props.meta.setMeta(meta);
				}
			} else {
				flag = true;
			}
		}
	} else if (key == FIELD.pk_arrvstoorg_v) {
		// 收货库存组织
		flag = true;
		let csourcetypecode = record.values.csourcetypecode.value;
		if (FIELD.SoOrder != csourcetypecode) {
			flag = true;
		} else {
			let vsourcetrantype = record.values.vsourcetrantype.value;
			constance.key = key;
			constance.params = {
				vsourcetrantype: vsourcetrantype
			};
			let direct = await remoteRequest(URL.bodybeforeedit, constance);
			if (direct) {
				//是直运的情况要做参照过滤 如果是直运，参照范围为结算财务组织下属的库存组织档案.
				let pk_psfinanceorg = record.values.pk_psfinanceorg.value;
				if (pk_psfinanceorg != null) {
					let pk_group = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_group).value;
					meta[PAGECODE.cardbody].items.map((item) => {
						if (item.attrcode == FIELD.pk_arrvstoorg_v) {
							props.cardTable.setQueryCondition(moduleId, {
								[item.attrcode]: () => {
									return {
										pk_group: pk_group,
										pk_psfinanceorg: pk_psfinanceorg,
										GridRefActionExt: 'nccloud.web.pu.order.ref.ReqstoorgBodyRefFilter'
									};
								}
							});
						}
					});
					// props.meta.setMeta(meta);
				}
			} else {
				flag = true;
			}
		}
	} else if (key == FIELD.pk_psfinanceorg_v) {
		//结算财务组织 直运、协同销售订单时结算财务组织不可编辑
		flag = true;
		let vcoopordercode = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vcoopordercode).value;
		let csourcetypecode = record.values.csourcetypecode.value;
		let vsourcetrantype = record.values.vsourcetrantype.value;
		if (vcoopordercode != null) {
			flag = false;
		} else if (FIELD.SoOrder != csourcetypecode) {
			flag = true;
		} else {
			constance.key = key;
			constance.params = {
				vsourcetrantype: vsourcetrantype
			};
			let direct = await remoteRequest(URL.bodybeforeedit, constance);
			if (direct) {
				flag = false;
			}
		}
	} else if (key == 'vchangerate') {
		// 换算率
		flag = true;
		let material = record.values.pk_material.value;
		let castunitid = record.values.castunitid.value;
		let cqtunitid = record.values.cqtunitid.value;
		let cunitid = record.values.cunitid.value;
		if (material == null) {
			flag = false;
		} else {
			constance.key = key;
			constance.params = {
				pk_material: material,
				castunitid: castunitid,
				cqtunitid: cqtunitid,
				cunitid: cunitid
			};
			flag = await remoteRequest(URL.bodybeforeedit, constance);
		}
	} else if (key == 'vqtunitrate') {
		// 报价单位换算率
		flag = true;
		let material = record.values.pk_material.value;
		let castunitid = record.values.castunitid.value;
		let cqtunitid = record.values.cqtunitid.value;
		let cunitid = record.values.cunitid.value;
		if (material == null) {
			flag = false;
		} else {
			constance.key = key;
			constance.params = {
				pk_material: material,
				castunitid: castunitid,
				cqtunitid: cqtunitid,
				cunitid: cunitid
			};
			flag = await remoteRequest(URL.bodybeforeedit, constance);
		}
	} else if (key == FIELD.vbatchcode) {
		// 批次号
		flag = true;
		let pk_material = record.values.pk_material.value;
		let pk_arrvstoorg = record.values.pk_arrvstoorg.value;
		constance.key = key;
		constance.params = {
			cmaterialvid: pk_material,
			materialvid: pk_material,
			pk_org: pk_arrvstoorg
		};
		// flag = await remoteRequest(URL.bodybeforeedit, constance);
		flag = await vfreeBeforeEvent(_this.props, constance);
		if (flag) {
			//当批次号可编辑时，处理批次号参照弹出框里的数据
			processBatchCodeItem.call(_this, props, [ PAGECODE.childform2, PAGECODE.cardbody ], key, record, '21');
		}
	} else if (key == 'cqpbaseschemeid') {
		//优质优价方案
		flag = true;
		let pk_srcmaterial = record.values.pk_srcmaterial.value;
		let pk_org = record.values.pk_org.value;
		let pk_group = record.values.pk_group.value;
		let dbilldate = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.dbilldate).value;
		if (pk_srcmaterial == null || pk_org == null) {
			flag = false;
		} else {
			let pk_order = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
			let pk_order_b = record.values.pk_order_b.value;
			if (null == pk_order || null == pk_order_b) {
				meta[PAGECODE.cardbody].items.map((item) => {
					if (item.attrcode == 'cqpbaseschemeid') {
						props.cardTable.setQueryCondition(moduleId, {
							[item.attrcode]: () => {
								return {
									pk_srcmaterial: pk_srcmaterial,
									pk_org: pk_org,
									pk_group: pk_group,
									dbilldate: dbilldate,
									GridRefActionExt: 'nccloud.web.pu.order.ref.CqpbaseschemeidBodyRefFilter'
								};
							}
						});
					}
				});
			} else {
				constance.key = key;
				constance.params = {
					pk_order: pk_order,
					pk_order_b: pk_order_b
				};
				let havePs = await remoteRequest(URL.bodybeforeedit, constance);
				if (havePs) {
					flag = false;
				} else {
					meta[PAGECODE.cardbody].items.map((item) => {
						if (item.attrcode == 'cqpbaseschemeid') {
							props.cardTable.setQueryCondition(moduleId, {
								[item.attrcode]: () => {
									return {
										pk_srcmaterial: pk_srcmaterial,
										pk_org: pk_org,
										pk_group: pk_group,
										dbilldate: dbilldate,
										GridRefActionExt: 'nccloud.web.pu.order.ref.CqpbaseschemeidBodyRefFilter'
									};
								}
							});
						}
					});
					// props.meta.setMeta(meta);
				}
			}
		}
	} else if (key == 'pk_flowstockorg_v') {
		// 物流组织
		flag = true;
		let pk_recvstordoc = record.values.pk_recvstordoc.value;
		let pk_arrvstoorg = record.values.pk_arrvstoorg.value;
		if (pk_recvstordoc != null || pk_arrvstoorg != null) {
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'pk_flowstockorg_v') {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_recvstordoc: pk_recvstordoc,
								pk_arrvstoorg: pk_arrvstoorg,
								GridRefActionExt: 'nccloud.web.pu.order.ref.FlowstockorgBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		} else {
			flag = false;
		}
	} else if (key == 'nglobalexchgrate') {
		// 全局本位币汇率
		flag = true;
		let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'corigcurrencyid').value;
		let ccurrencyid = record.values.ccurrencyid.value;
		constance.key = key;
		constance.params = {
			corigcurrencyid: corigcurrencyid,
			ccurrencyid: ccurrencyid
		};
		flag = await remoteRequest(URL.bodybeforeedit, constance);
	} else if (key == 'ngroupexchgrate') {
		// 集团本位币汇率
		flag = true;
		let pk_group = record.values.pk_group.value;
		let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'corigcurrencyid').value;
		let ccurrencyid = record.values.ccurrencyid.value;
		constance.key = key;
		constance.params = {
			pk_group: pk_group,
			corigcurrencyid: corigcurrencyid,
			ccurrencyid: ccurrencyid
		};
		flag = await remoteRequest(URL.bodybeforeedit, constance);
	} else if (key == 'blargess') {
		// 赠品
		flag = true;
		let breceiveplan = record.values.breceiveplan.value;
		if (breceiveplan) {
			flag = false;
		}
	} else if (key == 'casscustvid' || key == 'casscustid') {
		// 客户 参照的范围为主组织可见的客户 已经在方法入口统一处理
		flag = true;
		meta[PAGECODE.cardbody].items.map((item) => {
			if (item.attrcode == key) {
				props.cardTable.setQueryCondition(moduleId, {
					[item.attrcode]: () => {
						let pk_org = record.values.pk_org.value;
						return {
							pk_org: pk_org
						};
					}
				});
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == 'ncaltaxmny') {
		// 计税金额
		flag = true;
		let buysellflag = record.values.fbuysellflag.value;
		// 当购销类型=国内采购时不可编辑；购销类型=进口采购时跨国业务支持编辑。
		flag = FIELD.EXPORTATION == buySellFlag || FIELD.IMPORTATION == buySellFlag;
	} else if (key == 'ctaxcodeid') {
		// 税码
		flag = true;
		let ctaxcountryid = record.values.ctaxcountryid.value;
		let fbuysellflag = record.values.fbuysellflag.value;
		if (ctaxcountryid == null || null == fbuysellflag) {
			flag = false;
		} else {
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'ctaxcodeid') {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								ctaxcountryid: ctaxcountryid,
								fbuysellflag: fbuysellflag,
								GridRefActionExt: 'nccloud.web.pu.order.ref.CtaxcodeidBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == 'cdestiareaid') {
		// 目的地区
		flag = true;
		let country = record.values.cdesticountryid.value;
		if (country == null) {
			flag = false;
		} else {
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'cdestiareaid') {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_org: country
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == 'corigareaid') {
		// 原产地区
		flag = true;
		let country = record.values.corigcountryid.value;
		if (country == null) {
			flag = false;
		} else {
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'corigareaid') {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_org: country
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == 'nitemdiscountrate') {
		// 折扣
		flag = true;
		let pk_discount = record.values.pk_discount.value;
		// 询过折扣（折扣规则编码不为空），折扣字段不允许编辑
		if (pk_discount != null) {
			flag = false;
			let pk_org = record.values.pk_org.value;
			// 取参数：调整无税金额、价税合计、含税净价、无税净价时调整折扣还是单价。
			constance.key = key;
			constance.params = {
				pk_org: pk_org
			};
			let po84 = await remoteRequest(URL.bodybeforeedit, constance);
			// 如果参数“PO84调整无税金额、价税合计、含税净价、无税净价时调整折扣还是单价”为调折扣，则无税金额、价税合计、含税净价、无税净价也不允许手工编辑
			if (!po84) {
				//false 代表以下字段不可编辑
				_this.props.cardTable.setEditableByRowId(moduleId, record.rowid, 'norigmny', false);
				_this.props.cardTable.setEditableByRowId(moduleId, record.rowid, 'norigtaxmny', false);
				_this.props.cardTable.setEditableByRowId(moduleId, record.rowid, 'nqtorigtaxnetprc', false);
				_this.props.cardTable.setEditableByRowId(moduleId, record.rowid, 'nqtorignetprice', false);
			}
		} else {
			flag = true;
		}
	} else if (key == 'vvenddevaddr') {
		// 供应商发货地址
		flag = true;
		let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
		if (pk_supplier != null) {
			let pk_org = record.values.pk_org.value;
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'vvenddevaddr') {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_org: pk_org,
								pk_supplier: pk_supplier
								// GridRefActionExt: 'nccloud.web.pu.order.ref.VenddevaddrBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
			flag = true;
		} else {
			flag = false;
		}
	} else if (key == 'pk_receiveaddress') {
		// 收货地址
		flag = true;
		let pk_customer = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_recvcustomer').value;
		meta[PAGECODE.cardbody].items.map((item) => {
			if (item.attrcode === 'pk_receiveaddress') {
				if (pk_customer == null) {
					item.label = getLangByResId(this, '4004POORDER-000002'); /* 国际化处理： 地址簿*/
					item.itemtype = 'refer';
					item.refcode = 'uapbd/refer/pubinfo/AddressRef/index.js';
				} else {
					// refPanel.setRefModel(RefPubUtil.getRefModel(getLangByResId(this, '4004POORDER-000003'))); /* 国际化处理： 客户收货地址*//* -=notranslate=- */
					item.label = getLangByResId(this, '4004POORDER-000003'); /* 国际化处理： 客户收货地址*/
					item.itemtype = 'refer';
					item.refcode = 'uapbd/refer/customer/CustAddressGridRef/index.js';
					setTimeout(() => {
						props.cardTable.setQueryCondition(moduleId, {
							[item.attrcode]: () => {
								return {
									pk_recvcustomer: pk_customer,
									GridRefActionExt: 'nccloud.web.pu.order.ref.ReceiveAddressBodyRefFilter'
								};
							}
						});
					}, 0);
				}
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == 'nexchangerate') {
		// 折本汇率
		flag = true;
		let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.corigcurrencyid).value; //原币
		let curr = record.values.ccurrencyid.value;
		if (corigcurrencyid == curr) {
			flag = false;
		} else {
			// 根据汇率类别判断编辑性
			return canRateModify.call(
				this,
				(record.values.fratecategory || {}).value,
				isRowSelfMake.call(this, record, 'csourcetypecode', [ '23', 'Z2', '45' ])
			);
		}
	} else if (key == FIELD.cratetype) {
		// 汇率类型
		_this.props.cardTable.setQueryCondition(PAGECODE.cardbody, {
			[key]: () => {
				return rateTypeSellFilter();
			}
		});
		//原币
		let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.corigcurrencyid).value;
		//组织本位币
		let curr = record.values.ccurrencyid.value;
		if (isNull(corigcurrencyid) || isNull(curr) || corigcurrencyid == curr) {
			flag = false;
		}
	} else if (key == FIELD.dratedate) {
		// 汇率日期
		return canRateDateModify.call(
			this,
			(record.values.fratecategory || {}).value,
			isRowSelfMake.call(this, record, 'csourcetypecode', [ '23', 'Z2', '45' ])
		);
	} else if (key == 'vvendorordercode' || key == 'vvendororderrow' || key == 'nconfirmnum' || key == 'dconfirmdate') {
		// 对方订单号、对方订单行号、确认数量、确认日期
		flag = true;
		let vtrantypecode = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vtrantypecode).value;
		constance.key = key;
		constance.params = {
			vtrantypecode: vtrantypecode
		};
		flag = await remoteRequest(URL.bodybeforeedit, constance);
	} else if (
		key == 'pk_arrvstoorg' ||
		key == 'pk_reqstoorg' ||
		key == 'pk_psfinanceorg' ||
		key == 'pk_apfinanceorg' ||
		key == 'ccurrencyid'
	) {
		flag = false;
	}
	let fixAssts = [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier_v', 'pk_supplier' ];
	if (key.startsWith('vfree') || fixAssts.includes(key)) {
		//辅助属性
		if (fixAssts.includes(key)) {
			flag = true;
		} else {
			let pk_org = record.values.pk_org.value;
			let materialvid = record.values.pk_material.value;
			constance.key = key;
			constance.params = {
				key: key,
				pk_org: pk_org,
				materialvid: materialvid
			};
			flag = await vfreeBeforeEvent(_this.props, constance);
		}
		if (flag) {
			marAsstUtils.resetItem.call(
				this,
				props,
				'400400800',
				PAGECODE.cardcode,
				moduleId,
				key,
				record, // marAsstUtils.filterRecord.call(this, 'vfree', fixAssts, record)
				FREEFIELD
			);
		}
	}
	// if (flag && moduleId == PAGECODE.cardbody) {
	let crossRuleParams = {
		props,
		key, //当前字段
		appcode: null, //小应用编码，如果是本应用，可为空
		pagecode: PAGECODE.cardcode, //页面编码
		headarea: PAGECODE.cardhead, //表头区域编码
		bodyarea: PAGECODE.cardbody, //表体区域编码
		isHead: false, //是否为表头区字段
		record, //当前表体行数据，如果是表头触发，可以为空
		pk_org_field: FIELD.pk_org, //组织字段，注意为oid
		billtype: '21', //单据类型
		transtypeid_field: FIELD.ctrantypeid //交易类型id字段
	};
	crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	// }
	return flag;
}
function isNull(value) {
	if (value == undefined || value === '') {
		return true;
	}
	return false;
}
