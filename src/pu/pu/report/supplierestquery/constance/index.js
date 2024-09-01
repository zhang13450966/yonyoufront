/*
 * @Author: zhaochyu 
 * @PageInfo: 供应商暂估余额查询(报表)常量类
 * @Date: 2018-07-24 16:18:56 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:28:58
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_financeorg: 'eb.pk_financeorg', //财务组织
	dbilldate: 'fperiod', //查询日期
	pk_supplierCode: 'eb.pk_supplier', //供应商编码
	pk_supplierAreacl: 'bd_supplier.pk_areacl', //供应商地区分类
	pk_purchaseorg: 'eb.pk_purchaseorg', //采购组织
	pk_psndoc: 'eh.pk_psndoc', //采购员
	pk_dept: 'eh.pk_dept', //采购部门
	pk_org: 'eb.pk_org', //库存组织
	pk_srcmaterialCode: 'eb.pk_srcmaterial', //物料编码
	pk_marbasclassCode: 'bd_material.pk_marbasclass', //物料基本分类编码
	pu: 'pu'
};
export { FIELD };
