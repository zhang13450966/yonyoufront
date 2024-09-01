/*
 * @Author: zhaochyu 
 * @PageInfo: 供应商暂估明细查询(报表)常量类
 * @Date: 2018-07-24 16:17:10 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:28:16
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
	pk_srcmaterial: 'eb.pk_srcmaterial', //物料编码
	pk_marbasclass: 'bd_material.pk_marbasclass', //物料基本分类
	pu: 'pu'
};
export { FIELD };
