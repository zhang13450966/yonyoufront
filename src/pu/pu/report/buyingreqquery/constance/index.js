/*
 * @Author: zhaochyu 
 * @PageInfo: 请购单执行常量
 * @Date: 2018-07-24 11:15:03 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:43:43
 */
const FIELD = {
	searchArea: 'light_report', //查询区域
	pk_org: 'po_praybill.pk_org', //库存组织
	dbilldate: 'po_praybill.dbilldate', //请购日期
	ctrantypeid: 'po_praybill.ctrantypeid', //请购类型
	pk_planpsn: 'po_praybill.pk_planpsn', //请购人
	pk_plandept: 'po_praybill.pk_plandept', //请购部门
	billmaker: 'po_praybill.billmaker', //制单人
	pk_srcmaterialCode: 'po_praybill_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_praybill_b.pk_srcmaterial.name', //物料名称
	pk_marbasclassCode: 'po_praybill_b.pk_material.pk_marbasclass', //物料基本分类编码
	pk_reqstor: 'po_praybill_b.pk_reqstor', //需求仓库
	cprojectid: 'po_praybill_b.cprojectid', //项目
	pk_purchaseorg: 'po_praybill_b.pk_purchaseorg', //采购组织
	casscustid: 'po_praybill_b.casscustid', //客户
	pu: 'pu'
};
export { FIELD };
