/*
 * @Author: qishy
 * @PageInfo: 查询区编辑后 
 * @Date: 2018-07-21 18:46:07 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-06-24 11:00:01
 */
import { AREA, FIELDS, MAIN_ORG_FIELD } from '../../constance';
import { orgMultiSelectHandler } from '../../utils/referUtil';

export default function(key) {
	if (key == MAIN_ORG_FIELD.search21Org) {
		//根据财务结算组织过滤
		orgMultiSelectHandler(
			this.props,
			AREA.searchId,
			key,
			[
				'pk_supplier', //供应商
				'pk_invcsupllier', //开票供应商
				'pk_recvcustomer', //收货客户
				'pk_order_b.pk_srcmaterial', //物料
				'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
				'pk_order_b.cprojectid' //项目
			],
			[ 'vdef', 'pk_order_b.vbdef' ],
			[ 'pk_order_b.vfree' ]
		);
	} else if (key == FIELDS.pk_org) {
		// 委外订单 采购组织组织联动业务员采购部门
		orgMultiSelectHandler(this.props, AREA.searchId, key, [
			'pk_payterm', //付款协议
			'pk_dept', //采购部门
			'pk_order_b.pk_reqdept', //需求部门
			'cemployeeid', //采购员
			'pk_recvcustomer' //客户
		]);
	}
}
