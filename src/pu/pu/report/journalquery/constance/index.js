/*
 * @Author: zhaochyu 
 * @PageInfo:综合日报查询常量
 * @Date: 2019-02-18 15:37:24 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-02-18 15:44:20
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'pk_org', //采购组织
	dbilldate: 'dbilldate', //单据日期
	ordertype: 'ordertype', //统计内容
	grouptype: 'grouptype', //汇总依据
	bShowBySupplier: 'bShowBySupplier', //按供应商展开
	bShowByMar: 'bShowByMar', //按物料展开
	bd_suppliercode: 'bd_supplier.code', //供应商编码
	bd_suppliername: 'bd_supplier.name', //供应商名称
	bd_supplierpk_areacl: 'bd_supplier.pk_areacl', //供应商地区分类
	cemployeeid: 'cemployeeid', //采购员
	pk_dept: 'pk_dept', //采购部门
	pk_arrvstoorg: 'pk_arrvstoorg', //收货库存组织
	cproductorid: 'cproductorid', //生产厂商
	cprojectid: 'cprojectid', //项目
	casscustid: 'casscustid', //客户
	pu: 'pu'
};
export { FIELD };
