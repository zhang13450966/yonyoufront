/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片表体编辑前事件
 * @Date: 2018-08-06 15:53:53
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-05-31 17:49:16
 */
import { FIELD, PAGECODE, URL, FREEFIELD } from '../../constance';
import remoteRequest from './remoteRequest';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { marAsstUtils, crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
import {
	canRateDateModify,
	canRateModify,
	rateTypeSellFilter,
	isRowSelfMake
} from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';
export default async function(props, moduleId, key, value, index, record) {
	let _this = this;
	let flag = true;
	let constance = {};
	//激活标志，未激活的数据行不可编辑 '0'为激活
	let fisactive = record.values.fisactive.value;
	let barriveclose = record.values.barriveclose.value; //到货关闭
	let binvoiceclose = record.values.binvoiceclose.value; //开票关闭
	let bpayclose = record.values.bpayclose.value; //付款关闭
	let bstockclose = record.values.bstockclose.value; //入库关闭
	let btransclosed = record.values.btransclosed.value; //是否运输关闭
	let lineClose = barriveclose && binvoiceclose && bpayclose && bstockclose && btransclosed; //行关闭
	if (fisactive != '0' || lineClose) {
		return false;
	}
	let meta = this.props.meta.getMeta();
	meta[PAGECODE.cardbody].items.map((item) => {
		if (item.attrcode == FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
		}
		// if (item.attrcode != FIELD.pk_org_v && item.attrcode != FIELD.pk_org) {
		// 	item.queryCondition = () => {
		// 		let org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
		// 		return { pk_org: org };
		// 	};
		// }
		if (item.attrcode == 'pk_reqdept_v') {
			item.queryCondition = () => {
				let pk_reqstoorg = record.values.pk_reqstoorg.value;
				return {
					pk_org: pk_reqstoorg,
					busifuncode: FIELD.STOCKORG
				};
			};
		}
	});
	// first=false存在下游单据，反之不存在
	let first = true;
	if (first) {
		let naccumarrvnum = record.values.naccumarrvnum.value;
		let naccumstorenum = record.values.naccumstorenum.value;
		let naccuminvoicenum = record.values.naccuminvoicenum.value;
		naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
		naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
		naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
		if (naccumarrvnum > 0 || naccumstorenum > 0 || naccuminvoicenum > 0) {
			first = false;
		}
	}
	// 回写字段不可编辑
	let writeBackCloumn = [
		'naccumarrvnum',
		'naccumstorenum',
		'naccuminvoicenum',
		'nbackarrvnum',
		'nbackstorenum',
		'bstockclose',
		'binvoiceclose',
		'barriveclose',
		'bpayclose'
	];
	let cantCloumn = [ 'pk_material.name' ];
	if (key == FIELD.castunitid) {
		flag = first != false ? false : true;
		// 计量单位
		let pk_material = record.values.pk_material.value;
		if (flag || pk_material == null) {
			flag = false;
		} else {
			// 根据本行物料做参照过滤
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == FIELD.castunitid) {
					_this.props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_material: pk_material,
								GridRefActionExt: 'nccloud.web.pu.order.ref.AssistUnitBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
			flag = true;
		}
	} else if (key == 'ccontractid') {
		/** 合同信息 */
		flag = true;
		let csourcetypecode = record.values.csourcetypecode.value;
		if ('Z2' == csourcetypecode) {
			flag = false;
		}
		if (flag) {
			let pk_org = record.values.pk_org.value;
			let pk_supplier = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
			let cmaterial = record.values.pk_material.value;
			let corigcurrencyid = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'corigcurrencyid').value;
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
	} else if (key == 'pk_material') {
		//物料
		let pk_org = record.values.pk_org.value;
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

		// 物料编码
		// 有下游单据：原单据物料行不允许删除，且不允许修改物料；
		// 无下游单据：原物料行可删除，可以修改物料；

		flag = first;
	} else if (
		key == 'nastnum' ||
		key == 'nqtorigprice' ||
		key == 'nqtorigtaxprice' ||
		key == 'norigmny' ||
		key == 'ntax' ||
		key == 'ntaxrate' ||
		key == 'norigtaxmny' ||
		key == 'nnosubtaxrate' ||
		key == 'cdevareaid' ||
		key == 'cdevaddrid' ||
		key == 'dplanarrvdate' ||
		key == 'nnum' ||
		key == 'nqtunitnum' ||
		key == 'nqtorignetprice' ||
		key == 'nqtorigtaxnetprc' ||
		key == 'norigprice' ||
		key == 'norigtaxprice' ||
		key == 'norignetprice' ||
		key == 'norigtaxnetprice' ||
		key == 'nnetprice' ||
		key == 'ntaxnetprice' ||
		key == 'cvenddevareaid' ||
		key == 'cvenddevaddrid' ||
		key == 'vbmemo'
	) {
		//数量、无税单价、含税单价、无税金额,税额,税率,价税合计,不可抵扣税率,收货地区,收货地点
		//收货地址,计划到货日期,主数量,报价数量,无税净价，含税净价,主无税单价,主含税单价
		//,主无税净价,主含税净价,主本币无税净价,主本币含税净价,供应商发货地区,供应商发货地点,备注
		flag = true;
	} else if (key == FIELD.pk_arrvstoorg_v) {
		// 收货库存组织
		flag = true;
		let csourcetypecode = record.values.csourcetypecode.value;
		if (FIELD.SoOrder == csourcetypecode) {
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
							_this.props.cardTable.setQueryCondition(moduleId, {
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
				}
			} else {
				flag = true;
			}
		}
	} else if (key == 'cqpbaseschemeid') {
		//优质优价方案
		flag = true;
		let pk_srcmaterial = record.values.pk_srcmaterial.value;
		let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
		let pk_group = _this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_group').value;
		if (pk_srcmaterial == null || pk_org == null) {
			flag = false;
		} else {
			let pk_order = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
			let pk_order_b = record.values.pk_order_b.value;
			if (null == pk_order || null == pk_order_b) {
				flag = false;
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
							_this.props.cardTable.setQueryCondition(moduleId, {
								[item.attrcode]: () => {
									return {
										pk_srcmaterial: pk_srcmaterial,
										pk_org: pk_org,
										pk_group: pk_group,
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
	} else if (key == 'cqtunitid') {
		// 报价单位
		flag = first != false ? false : true;
		// 物料
		let pk_material = record.values.pk_material.value;
		if (flag || pk_material == null) {
			flag = false;
		} else {
			// 根据本行物料做参照过滤
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'cqtunitid') {
					_this.props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_material: pk_material,
								GridRefActionExt: 'nccloud.web.pu.order.ref.AssistUnitBodyRefFilter'
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
			flag = true;
		}
	} else if (key == 'nitemdiscountrate') {
		// 折扣
		flag = true;
		let pk_discount = record.values.pk_discount.value;
		// 询过折扣（折扣规则编码不为空），折扣字段不允许编辑
		if (pk_discount != null) {
			flag = false;
			let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
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
			let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
			meta[PAGECODE.cardbody].items.map((item) => {
				if (item.attrcode == 'vvenddevaddr') {
					_this.props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								pk_org: pk_org,
								pk_supplier: pk_supplier
								// GridRefActionExt: 'nccloud.web.pu.order.ref.VenddevaddrBodyRefFilter',
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
	} else if (key.startsWith('vfree')) {
		//辅助属性
		flag = true;
		let pk_org = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
		let materialvid = record.values.pk_material.value;
		constance.key = key;
		constance.params = {
			key: key,
			pk_org: pk_org,
			materialvid: materialvid
		};
		flag = await vfreeBeforeEvent(_this.props, constance);
		if (flag) {
			marAsstUtils.resetItem.call(_this, props, '400400802', PAGECODE.cardcode, moduleId, key, record, FREEFIELD);
		}
	} else if (key.startsWith('vbdef')) {
		// 自定义项1——20
		flag = true;
	} else if (
		key == 'pk_batchcode' ||
		key == 'vbatchcode' ||
		key == 'pk_reqdept' ||
		key == 'cprojectid' ||
		key == 'cprojecttaskid' ||
		key == 'blargess' ||
		key == 'pk_arrvstoorg' ||
		key == 'casscustvid'
	) {
		flag = false;
	} else if (writeBackCloumn.includes(key)) {
		flag = false;
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
	} else if (cantCloumn.includes(key)) {
		// 不可编辑字段
		flag = false;
	} else if (key == 'nexchangerate') {
		// 折本汇率
		flag = true;
		let corigcurrencyid = record.values.corigcurrencyid.value; //原币
		let curr = record.values.ccurrencyid.value;
		if (corigcurrencyid == curr) {
			flag = false;
		} else {
			// 根据汇率类别判断编辑性
			return canRateModify.call(
				this,
				(record.values.fratecategory || {}).value,
				isRowSelfMake.call(this, record, 'csourcetypecode', [ '23', 'Z2', '30', '45' ])
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
		let corigcurrencyid = record.values.corigcurrencyid.value; //原币
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
			isRowSelfMake.call(this, record, 'csourcetypecode', [ '23', 'Z2', '30', '45' ])
		);
	} else {
		flag = true;
	}
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
	return flag;
}
function isNull(value) {
	if (value == undefined || value === '') {
		return true;
	}
	return false;
}
