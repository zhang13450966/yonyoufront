/*
 * @Author: zhaochyu 
 * @PageInfo: 物资需求申请汇总表常量类 
 * @Date: 2019-02-18 21:33:57 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-06-18 10:08:19
 */
const FIELD = {
	searchArea: 'light_report', //查询区
	pk_org: 'pk_org', //库存组织
	dbilldate: 'dbilldate', //申请日期
	summarytype: 'summarytype', //汇总方式
	freqtypeflag: 'freqtypeflag', //需求类型
	ctrantypeid: 'ctrantypeid', //物资需求申请类型
	fbillstatus: 'fbillstatus', //单据状态
	vbillcode: 'vbillcode', //申请单号
	pk_srcmaterial: 'pk_storereq_b.pk_srcmaterial', //物料
	pk_srcmaterialcode: 'pk_storereq_b.pk_srcmaterial.code', //物料编码
	pk_srcmaterialname: 'pk_storereq_b.pk_srcmaterial.name', //物料名称
	pk_reqstordoc: 'pk_storereq_b.pk_reqstordoc', //需求仓库
	pk_apppsn: 'pk_storereq_b.pk_apppsn', //申请人
	cprojectid: 'pk_storereq_b.cprojectid', //项目
	cdevareaid: 'pk_storereq_b.cdevareaid', //收货地区
	cdevaddrid: 'pk_storereq_b.cdevaddrid', //收货地点
	pk_marbasclasscode: 'pk_storereq_b.pk_srcmaterial.pk_marbasclass.code', //物料基本分类编码
	pk_appdept: 'pk_storereq_b.pk_appdept', //申请部门
	pu: 'pu'
};
export { FIELD };
