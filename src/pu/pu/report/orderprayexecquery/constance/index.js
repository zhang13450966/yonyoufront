/*
 * @Author: zhaochyu 
 * @PageInfo: 采购订单付款计划执行查询（报表）常量类
 * @Date: 2018-07-24 15:55:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-10-30 14:57:35
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'po_order.pk_org', //采购组织
	ctrantypeid: 'po_order.ctrantypeid', //订单类型
	pk_supplierCode: 'po_order_b.pk_supplier.code', //供应商编码
	pk_supplierName: 'po_order_b.pk_supplier.name', //供应商名称
	pk_supplierAreacl: 'po_order_b.pk_supplier.pk_areacl', //供应商地区分类
	cemployeeid: 'po_order.cemployeeid', //采购员
	pk_dept: 'po_order.pk_dept', //采购部门
	pk_srcmaterialCode: 'po_order_b.pk_srcmaterial.code', //物料编码
	pk_materialName: 'po_order_b.pk_srcmaterial.name', //物料名称
	pk_marbasclass: 'po_order_b.pk_material.pk_marbasclass', //物料基本分类编码
	pk_marpuclass: 'po_order_b.pk_material.materialstock.pk_marpuclass', //物料采购分类编码
	cprojectid: 'po_order_b.cprojectid', //项目
	cproductorid: 'po_order_b.cproductorid', //生产厂商
	casscustid: 'po_order_b.casscustid', //客户
	dbilldate: 'po_order.dbilldate', //订单日期
	pu: 'pu',
	vbillcode: 'po_order.vbillcode'
};
export { FIELD };
