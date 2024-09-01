/*
 * @Author: zhaochyu 
 * @PageInfo: 采购订单明细常量（报表）
 * @Date: 2018-07-24 11:16:02 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:05:58
 */
const FIELD = {
	searchArea: 'light_report', //查询区编码
	pk_org: 'pk_org', //采购组织
	ctrantypeid: 'ctrantypeid', //订单类型
	pk_supplierCode: 'this.pk_supplier.code', //供应商编码
	pk_supplierName: 'this.pk_supplier.name', //供应商名称
	pk_supplierAreac: 'this.pk_supplier.pk_areacl', //供应商地区分类
	cemployeeid: 'cemployeeid', //采购员
	pk_dept: 'pk_dept', //采购部门
	pk_srcmaterialCode: 'this.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'this.pk_srcmaterial.name', //物料名称
	pk_marbasclassCode: 'this.pk_material.pk_marbasclass.code', //物料基本分类编码
	cprojectid: 'cprojectid', //项目
	cproductorid: 'cproductorid', //生产厂商
	casscustid: 'casscustid', //客户
	billmaker: 'billmaker', //制单人
	dbilldate: 'dbilldate', //订单日期
	pu: 'pu' //采购模块
};
export { FIELD };
