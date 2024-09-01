/*
 * @Author: zhaochyu 
 * @PageInfo: 采购待开票数量查询(报表)常量类  
 * @Date: 2018-07-24 16:12:56 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:24:46
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'po_purchaseinfi_b.pk_financeorg', //财务组织
	dbilldate: 'po_purchaseinfi.dbilldate', //入库日期
	po_orderdbilldate: 'po_order.dbilldate', //订单日期
	pk_supplierCode: 'po_purchaseinfi_b.pk_supplier.code', //供应商编码
	pk_supplierName: 'po_purchaseinfi_b.pk_supplier.name', //供应商名称
	ctrantypeid: 'po_purchaseinfi.ctrantypeid', //出入库类型
	pk_purchaseorg: 'po_purchaseinfi_b.pk_purchaseorg', //采购组织
	pk_psndoc: 'po_purchaseinfi.pk_psndoc', //采购员
	pk_dept: 'po_purchaseinfi.pk_dept', //采购部门
	pk_marbasclass: 'po_purchaseinfi_b.pk_material.pk_marbasclass.code', //物料基本分类编码
	pu: 'pu'
};
export { FIELD };
