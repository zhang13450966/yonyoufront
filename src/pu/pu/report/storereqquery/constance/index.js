/*
 * @Author: zhangchangqing
 * @PageInfo: 页面功能描述 
 * @Date: 2018-07-26 19:38:46 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-24 16:46:26
 */
const FIELD = {
	searchArea: 'light_report', //查询区域
	pk_org: 'pk_org', //库存组织
	dbilldate: 'dbilldate', //申请日期
	ctrantypeid: 'ctrantypeid', //申请类型
	pk_appdept: 'po_storereq_b.pk_appdept', //申请部门
	pk_apppsn: 'po_storereq_b.pk_apppsn', //申请人
	pk_srcmaterialCode: 'po_storereq_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialName: 'po_storereq_b.pk_srcmaterial.name', //物料名称
	pk_marbasclassCode: 'po_storereq_b.pk_srcmaterial.pk_marbasclass.code', //物料基本分类编码
	pk_reqstordoc: 'po_storereq_b.pk_reqstordoc', //需求仓库
	pk_project: 'po_storereq.pk_project', //项目
	pu: 'pu'
};
export { FIELD };
