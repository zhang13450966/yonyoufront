/*
 * @Author: zhaochyu 
 * @PageInfo: 采购结算单查询(报表)常量类
 * @Date: 2018-07-24 16:14:48 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:32:54
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'pk_org', //财务组织
	dbilldate: 'dbilldate', //结算日期
	pk_supplierCode: 'po_settlebill_b.pk_supplier.code', //供应商编码
	pk_supplierName: 'po_settlebill_b.pk_supplier.name', //供应商名称
	pk_supplierAreacl: 'po_settlebill_b.pk_supplier.pk_areacl.name', //供应商地区分类
	pk_arrstockorg: 'po_settlebill_b.pk_arrstockorg', //收货库存组织
	pk_billtypecode: 'po_settlebill_b.vstocktrantype.pk_billtypecode', //入库类型
	pk_psndoc: 'po_settlebill_b.pk_psndoc', //采购员
	pk_dept: 'po_settlebill_b.pk_dept', //采购部门
	pk_srcmaterialCode: 'po_settlebill_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_settlebill_b.pk_srcmaterial.name', //物料名称
	pk_marbasclass: 'po_settlebill_b.pk_material.pk_marbasclass.code', //物料基本分类编码
	pu: 'pu'
};
export { FIELD };
