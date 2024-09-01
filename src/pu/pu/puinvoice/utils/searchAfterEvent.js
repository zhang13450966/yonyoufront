/*
 * @Author: jiangfw 
 * @PageInfo: 拉单查询界面主组织编辑后事件
 * @Date: 2018-07-31 20:30:17 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-09-28 17:49:01
 */
import MultiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { MAIN_ORG_FIELD, AREA, FILTER_FIELD, HEAD_VDEF, BODY_VBDEF, VFREE, FIELD } from '../constance';
import getDefArray from '../utils/getDefArray';

/**
 * @param {*} areaCode 查询区编码
 * @param {*} key 操作的字段
 * @param {*} val 编辑后，操作字段的值，主键
 */
export default function(areaCode, key, val) {
	// 待过滤字段
	let toFilterFields = [];

	if (areaCode == AREA.searchAll && key == MAIN_ORG_FIELD.searchAllOrg) {
		toFilterFields = FILTER_FIELD.searchAllFields;
	} else if (areaCode == AREA.search21 && key == MAIN_ORG_FIELD.search21Org) {
		toFilterFields = FILTER_FIELD.search21Fields;
		// 表头自定义项
		toFilterFields = toFilterFields.concat(HEAD_VDEF);
		// 表体自定义项
		let body_vdef = getDefArray('pk_order_b', BODY_VBDEF);
		toFilterFields = toFilterFields.concat(body_vdef);
		// 自由辅助属性
		let body_vfree = getDefArray('pk_order_b', VFREE);
		toFilterFields = toFilterFields.concat(body_vfree);
	} else if (areaCode == AREA.search45 && key == MAIN_ORG_FIELD.search45Org) {
		toFilterFields = FILTER_FIELD.search45Fields;
		// 表头自定义项
		toFilterFields = toFilterFields.concat(HEAD_VDEF);
		// 表体自定义项
		let body_vdef = getDefArray('cgeneralbid', BODY_VBDEF);
		toFilterFields = toFilterFields.concat(body_vdef);
		// 自由辅助属性
		let body_vfree = getDefArray('cgeneralbid', VFREE);
		toFilterFields = toFilterFields.concat(body_vfree);
	} else if (areaCode == AREA.search4T && key == MAIN_ORG_FIELD.search4TOrg) {
		toFilterFields = FILTER_FIELD.search4TFields;
		// 表头自定义项
		toFilterFields = toFilterFields.concat(HEAD_VDEF);
		// 表体自定义项
		let body_vdef = getDefArray('po_initialest_b', BODY_VBDEF);
		toFilterFields = toFilterFields.concat(body_vdef);
		// 自由辅助属性
		let body_vfree = getDefArray('po_initialest_b', VFREE);
		toFilterFields = toFilterFields.concat(body_vfree);
	} else if (areaCode == AREA.ref50_query && key == MAIN_ORG_FIELD.search50Org) {
		toFilterFields = FILTER_FIELD.search50Fields;
	} else if (areaCode == AREA.search47 && key == MAIN_ORG_FIELD.search47Org) {
		toFilterFields = FILTER_FIELD.search47Fields;
		// 表头自定义项
		toFilterFields = toFilterFields.concat(HEAD_VDEF);
		// 表体自定义项
		let body_vdef = getDefArray('cgeneralbid', BODY_VBDEF);
		toFilterFields = toFilterFields.concat(body_vdef);
		// 自由辅助属性
		let body_vfree = getDefArray('cgeneralbid', VFREE);
		toFilterFields = toFilterFields.concat(body_vfree);
	} else if (areaCode == AREA.search61 && key == MAIN_ORG_FIELD.search61Org) {
		toFilterFields = FILTER_FIELD.search61Fields;
		// 表头自定义项
		toFilterFields = toFilterFields.concat(HEAD_VDEF);
		// 表体自定义项
		let body_vdef = getDefArray('pk_order_b', BODY_VBDEF);
		toFilterFields = toFilterFields.concat(body_vdef);
		// 自由辅助属性
		let body_vfree = getDefArray('pk_order_b', VFREE);
		toFilterFields = toFilterFields.concat(body_vfree);
	} else if (areaCode == AREA.searchScAll && key == MAIN_ORG_FIELD.searchScAllOrg) {
		toFilterFields = FILTER_FIELD.searchScAllFields;
	}
	MultiCorpRefHandler(this.props, val, areaCode, toFilterFields);

	if (areaCode == AREA.ref50_query && key == 'ccalbodyid') {
		// 消耗汇总 结算库存组织联动结算仓库
		MultiCorpRefHandler(this.props, val, areaCode, [ 'cwarehouseid' ]);
	}
	if (areaCode == AREA.search47 && key == FIELD.pk_org) {
		// 委托加工入库单 库存组织联动仓库
		MultiCorpRefHandler(this.props, val, areaCode, [ 'cwarehouseid' ]);
	}
	if (areaCode == AREA.search61 && key == 'pk_org') {
		// 委外订单 采购组织组织联动业务员采购部门
		MultiCorpRefHandler(this.props, val, areaCode, [ 'cemployeeid', 'pk_dept' ]);
	}
}
