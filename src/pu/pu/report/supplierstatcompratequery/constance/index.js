/*
 * @Author: zhaochyu 
 * @PageInfo: 按供应商统计订单完成率(报表)常量类
 * @Date: 2018-07-24 16:20:36 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:09:30
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'po_order_b.pk_org', //采购组织
	dbilldate: 'dbilldate', //订单日期
	pk_supplierCode: 'bd_supplier.code', //供应商编码
	pk_supplierName: 'bd_supplier.name', //供应商名称
	pk_marbasclass: 'bd_marbasclass.code' //物料基本分类
};
export { FIELD };
