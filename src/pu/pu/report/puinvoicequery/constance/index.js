/*
 * @Author: zhaochyu 
 * @PageInfo:采购发票明细查询(报表)常量类
 * @Date: 2018-07-24 16:10:34 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:16:34
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'po_invoice.pk_org', //财务组织
	dbilldate: 'po_invoice.dbilldate', //发票日期
	vtrantypecode: 'po_invoice.vtrantypecode', //发票类型
	pk_supplierCode: 'po_invoice.pk_supplier.code', //供应商编码
	pk_supplierName: 'po_invoice.pk_supplier.name', //供应商名称
	pk_supplierAreacl: 'po_invoice.pk_supplier.pk_areacl.name', //供应商地区分类
	pk_purchaseorg: 'po_invoice.pk_purchaseorg', //采购组织
	pk_bizpsn: 'po_invoice.pk_bizpsn', //采购员
	pk_dept: 'po_invoice.pk_dept', //采购部门
	pk_stockorg: 'po_invoice.pk_stockorg', //库存组织
	pk_stordoc: 'po_invoice_b.pk_stordoc', //仓库
	pk_paytosupplier: 'po_invoice.pk_paytosupplier', //付款单位
	pk_payterm: 'po_invoice.pk_payterm', //付款协议
	pk_srcmaterialCode: 'po_invoice_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_invoice_b.pk_srcmaterial.name', //物料名称
	pk_marbasclassCode: 'po_invoice_b.pk_material.pk_marbasclass.code', //物料基本分类编码
	cproductorid: 'po_invoice_b.cproductorid', //生产厂商
	cprojectid: 'po_invoice_b.cprojectid', //项目
	casscustid: 'po_invoice_b.casscustid', //客户
	pu: 'pu'
};
export { FIELD };
