/*
 * @Author: zhaochyu 
 * @PageInfo: 日到货情况查询常量类
 * @Date: 2019-03-25 15:01:05 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-03-25 15:06:02
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_stockorg: 'pk_stockorg', //库存组织
	pk_org: 'po_order_b.pk_org', //采购组织
	pk_srcmaterialCode: 'po_order_b.pk_material.code', //物料
	pk_srcmaterialName: 'po_order_b.pk_material.name', //物料名称
	pk_marbasclass: 'po_order_b.pk_material.pk_marbasclass', //物料基本分类编码
	cproductorid: 'po_order_b.cproductorid', //生产厂商
	cprojectid: 'po_order_b.cprojectid', //项目
	casscustid: 'po_order_b.casscustid', //客户
	pu: 'pu' //采购模块
};
export { FIELD };
