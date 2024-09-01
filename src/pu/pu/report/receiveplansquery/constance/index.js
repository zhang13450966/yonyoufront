/*
 * @Author: zhaochyu 
 * @PageInfo: 到货计划查询常量类
 * @Date: 2019-03-25 10:32:59 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-03-25 10:47:44
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'po_order.pk_org', //采购组织
	pk_arrvstoorg: 'po_order_bb1.pk_arrvstoorg', //收货库存组织
	pk_recvstordoc: 'po_order_bb1.pk_recvstordoc', //收货仓库
	ctrantypeid: 'po_order.ctrantypeid', //订单类型
	cemployeeid: 'po_order.cemployeeid', //采购员
	billmaker: 'po_order.billmaker', //制单人
	pk_dept: 'po_order.pk_dept', //采购部门
	pk_supplierCode: 'po_order_b.pk_supplier.code', //供应商编码
	pk_supplierName: 'po_order_b.pk_supplier.name', //供应商名称
	pk_supplierAreac: 'po_order_b.pk_supplier.pk_areacl', //供应商地区分类
	pk_srcmaterialCode: 'po_order_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_order_b.pk_srcmaterial.name', //物料名称
	pk_marbasclass: 'po_order_b.pk_material.pk_marbasclass', //物料基本分类编码
	cproductorid: 'po_order_b.cproductorid', //生产厂商
	cprojectid: 'po_order_b.cprojectid', //项目
	casscustid: 'po_order_b.casscustid', //客户
	pu: 'pu' //采购模块
};
export { FIELD };
