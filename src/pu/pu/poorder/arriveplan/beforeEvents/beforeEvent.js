/*
 * @Author: CongKe
 * @PageInfo: 订单到货计划编辑前事件
 * @Date: 2018-09-12 13:36:23
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-13 11:19:50
 */
import { URL, FIELD, ARRIVEPLAN } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == ARRIVEPLAN.TABLEID) {
		let meta = this.props.meta.getMeta();
		let flag = true;
		let pk_order = record && record.values.pk_order.value;
		if (
			key.attrcode != 'crownobb1' &&
			(record.values.crownobb1.value == null ||
				record.values.crownobb1.value == 'null' ||
				record.values.crownobb1.value == '')
		) {
			return;
		}
		let rpreceiveOrg = [
			'pk_arrvstoorg_v',
			'nastnum',
			'dplanarrvdate',
			'cdevareaid',
			'cdevaddrid',
			'cvenddevaddrid',
			'cvenddevareaid',
			'nnum',
			'nqtunitnum',
			'vmemo',
			'nweight',
			'cvendorid',
			'btransclosed',
			'nvolumn',
			'npacknum',
			'vfree1',
			'vfree2',
			'vfree3',
			'vfree4',
			'vfree5',
			'vfree6',
			'vfree7',
			'vfree8',
			'vfree9',
			'vfree10',
			'vbdef1',
			'vbdef2',
			'vbdef3',
			'vbdef4',
			'vbdef5',
			'vbdef6',
			'vbdef7',
			'vbdef8',
			'vbdef9',
			'vbdef10',
			'vbdef11',
			'vbdef12',
			'vbdef13',
			'vbdef14',
			'vbdef15',
			'vbdef16',
			'vbdef17',
			'vbdef18',
			'vbdef19',
			'vbdef20',
			'vecbillcode',
			'dsenddate',
			'vehicletype',
			'vehiclelicense',
			'vlinkpsn',
			'vlinktype'
		];
		if (rpreceiveOrg.includes(key.attrcode)) {
			//收货库存组织版本信息、数量、计划到货日期、收货地区、收货地点、供应商发货地点、供应商发货地区、主数量、报价数量、备注
			//重量、生产厂商、是否运输关闭、体积、件数、自由辅助属性1-10、自定义项1-20、自定义项1-20、EC发货单号、发货日期、运输工具
			//车票号、联系人、联系方式、
			if (key.attrcode == 'pk_arrvstoorg_v') {
				// 收货仓库支持多选
				meta[ARRIVEPLAN.TABLEID].items.map((item) => {
					if (item.attrcode == key.attrcode) {
						item.isMultiSelectedEnabled = true;
					}
				});
			}
			flag = true;
			if (pk_order == null) {
				flag = false;
			}
		} else if (key.attrcode == 'crownobb1') {
			// 订单行号
			flag = true;
			// let pk_order_b = record && record.values.pk_order_b && record.values.pk_order_b.value;
			// pk_order_b = pk_order_b == undefined ? '' : pk_order_b;
			// let nastnum = record && record.values.nastnum && record.values.nastnum.value;
			let userObject = '';
			let allRows = props.editTable.getAllRows(ARRIVEPLAN.TABLEID, false);
			if (allRows && allRows.length > 0) {
				allRows.map((item) => {
					let pk_order_b = item.values && item.values.pk_order_b && item.values.pk_order_b.value;
					let status = item.status;
					let nastnum = item.values && item.values.nastnum && item.values.nastnum.value;
					pk_order_b = pk_order_b == undefined ? '' : pk_order_b;
					nastnum = nastnum == undefined ? '' : nastnum;
					if (pk_order_b && status != 3) {
						userObject += pk_order_b + ',' + nastnum + ';';
					}
				});
			}
			let pk_org = record && record.values.pk_arrvstoorg.value;
			meta[ARRIVEPLAN.TABLEID].items.map((item) => {
				if (item.attrcode == 'crownobb1') {
					item.isMultiSelectedEnabled = true;
					item.refName = getLangByResId(this, '4004POORDER-000001'); /* 国际化处理： 订单行号参照（可多选）*/
				}
				item.queryCondition = () => {
					return {
						pk_order: props.pk_order,
						userObject: userObject
					};
				};
			});
			props.meta.setMeta(meta);
		} else if (key.attrcode == 'pk_recvstordoc') {
			//收货仓库
			flag = true;
			let pk_arrvstoorg = record && record.values.pk_arrvstoorg.value;
			if (pk_arrvstoorg == null) {
				flag = false;
			} else {
				pk_arrvstoorg = record && record.values.pk_arrvstoorg.value;
				let crownobb1 = record && record.values.crownobb1.value;
				meta[ARRIVEPLAN.TABLEID].items.map((item) => {
					if (item.attrcode == key.attrcode) {
						// props.cardTable.setQueryCondition(moduleId, {
						// 	[item.attrcode]: () => {
						// 		return {
						// 			pk_order: pk_order,
						// 			pk_org: pk_arrvstoorg,
						// 			busifuncode: FIELD.STOCKORG,
						// 			// pk_arrvstoorg: pk_arrvstoorg,
						// 			crownobb1: crownobb1,
						// 			GridRefActionExt: 'nccloud.web.pu.order.ref.RPReceiveWarehouseRefFilter'
						// 		};
						// 	}
						// });
						item.queryCondition = () => {
							return {
								pk_order: pk_order,
								pk_org: pk_arrvstoorg,
								busifuncode: FIELD.STOCKORG,
								// pk_arrvstoorg: pk_arrvstoorg,
								crownobb1: crownobb1,
								GridRefActionExt: 'nccloud.web.pu.order.ref.RPReceiveWarehouseRefFilter'
							};
						};
					}
				});
				props.meta.setMeta(meta);
				flag = true;
			}
		} else if (key.attrcode == 'pk_receiveaddress') {
			//收货地址
			flag = true;
			if (pk_order == null) {
				flag = false;
			} else {
				let pk_customer = this.model.pk_customer;
				meta[ARRIVEPLAN.TABLEID].items.map((item) => {
					if (item.attrcode === 'pk_receiveaddress') {
						if (pk_customer == null) {
							item.refName = getLangByResId(this, '4004POORDER-000002'); /* 国际化处理： 地址簿*/
							item.itemtype = 'refer';
							item.refcode = 'uapbd/refer/pubinfo/AddressRef/index.js';
						} else {
							item.refName = getLangByResId(this, '4004POORDER-000003'); /* 国际化处理： 客户收货地址*/
							item.itemtype = 'refer';
							item.refcode = 'uapbd/refer/customer/CustAddressGridRef/index.js';
							item.queryCondition = () => {
								return {
									pk_recvcustomer: pk_customer,
									GridRefActionExt: 'nccloud.web.pu.order.ref.RPReceiveAddressRefFilter'
								};
							};
						}
					}
				});
				props.meta.setMeta(meta);
			}
		} else if (key.attrcode == 'vvenddevaddr') {
			//供应商发货地址
			flag = true;
			let pk_org = this.model.pk_org;
			let pk_supplier = this.model.pk_supplier;
			if (pk_order == null) {
				flag = false;
			} else {
				if (pk_supplier == null) {
					flag = false;
				} else {
					flag = true;
					meta[ARRIVEPLAN.TABLEID].items.map((item) => {
						if (item.attrcode == key.attrcode) {
							item.queryCondition = () => {
								return {
									pk_org: pk_org,
									pk_supplier: pk_supplier,
									GridRefActionExt: 'nccloud.web.pu.order.ref.RPVenddevaddr'
								};
							};
						}
					});
					props.meta.setMeta(meta);
				}
			}
		} else {
			flag = false;
		}
		return flag;
	}
}
