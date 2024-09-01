/*
 * @Author: zhaochyu 
 * @PageInfo: 采购统计表查询(报表)常量类 
 * @Date: 2018-07-24 16:05:56 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:37:24
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'pk_org', //采购组织
	dbilldate: 'dbilldate', //订单日期
	ctrantypeid: 'ctrantypeid', //订单类型
	pk_supplierCode: 'pk_supplier.code', //供应商编码
	pk_supplierName: 'pk_supplier.name', //供应商名称
	pk_supplierAreacl: 'pk_supplier.pk_areacl', //供应商地区分类
	cemployeeid: 'cemployeeid', //采购员
	pk_dept: 'pk_dept', //采购部门
	pk_srcmaterialCode: 'pk_order_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'pk_order_b.pk_srcmaterial.name', //物料名称
	pk_marbasclassCode: 'pk_order_b.pk_srcmaterial.pk_marbasclass.code', //物料基本分类编码
	pk_marpuclassCode: 'pk_order_b.pk_material.materialstock.pk_marpuclass.code', //物料采购分类编码
	cprojectid: 'pk_order_b.cprojectid', //项目
	cproductorid: 'pk_order_b.cproductorid', //生产厂商
	casscustid: 'pk_order_b.casscustid', //客户
	pu: 'pu'
};
export { FIELD };
