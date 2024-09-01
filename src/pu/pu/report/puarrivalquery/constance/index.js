/*
 * @Author: zhaochyu 
 * @PageInfo: 到货单执行情况查询(报表)常量类 
 * @Date: 2018-07-24 16:08:39 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:07:21
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'po_arriveorder.pk_org', //库存组织
	pk_supplierCode: 'po_arriveorder.pk_supplier.code', //供应商编码
	pk_supplierName: 'po_arriveorder.pk_supplier.name', //供应商名称
	pk_supplierAreacl: 'po_arriveorder.pk_supplier.pk_areacl', //供应商地区分类
	pk_srcmaterialCode: 'po_arriveorder_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_arriveorder_b.pk_srcmaterial.name', //物料名称
	pk_marbasclass: 'po_arriveorder_b.pk_material.pk_marbasclass', //物料基本分类编码
	cproductorid: 'po_arriveorder_b.cproductorid', //生产厂商
	cprojectid: 'po_arriveorder_b.cprojectid', //项目
	casscustid: 'po_arriveorder_b.casscustid', //客户
	dbilldate: 'po_arriveorder.dbilldate' //到货日期
};
export { FIELD };
