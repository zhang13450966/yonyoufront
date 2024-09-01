/*
 * @Author: zhangshqb 
 * @PageInfo: 常量  
 * @Date: 2018-04-26 11:28:30 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-08-24 20:59:40
 */
const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	querylist: '/nccloud/pu/est/query.do', //列表态数据查询
	estgoods: '/nccloud/pu/est/estgoods.do', //货物暂估
	estfee: '/nccloud/pu/est/estfee.do', //费用暂估
	afteredit: '/nccloud/pu/est/afteredit.do', //货物编辑后事件
	feeAfterEdit: '/nccloud/pu/est/feeAfterEdit.do', //费用编辑后事件
	feedis: '/nccloud/pu/est/estfeedistribute.do', //费用分摊
	hqhp: '/nccloud/pu/est/esthqhp.do', //优质优价取价
	print: '/nccloud/pu/est/print.do' //打印
};

//页面编码
const PAGECODE = {
	dbilldateVal: '',
	searchId: 'est_query',
	tableId: 'po_stockps',
	childTableId: 'po_stockps_fee',
	pagecode: '400402802_list',
	modaltablecode: 'po_stocks_fee_modal',
	//通用常量
	queryType: 'simple'
};

const FIELD = {
	pk_supplier: 'pk_stockps_b.pk_supplier',
	pk_supplier_v: 'pk_stockps_b.pk_supplier_v',
	pk_srcmaterial: 'pk_stockps_b.pk_srcmaterial',
	pk_material: 'pk_stockps_b.pk_material',
	pk_org: 'pk_stockps_b.pk_financeorg', //财务组织
	pk_feematerial: 'pk_feematerial',
	pk_childsupplier: 'pk_supplier',
	pk_childsupplier_v: 'pk_supplier_v',
	pk_marclass: 'pk_stockps_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
	pk_pumarclass: 'pk_stockps_b.pk_material.materialstock.pk_marpuclass', //物料采购分类
	cproject: 'cprojectid', //项目
	pk_stockorg: 'pk_org', //库存组织
	dept: 'pk_dept', //部门
	psndoc: 'pk_psndoc', //人员
	stordoc: 'pk_stordoc', //仓库
	transtype: 'ctrantypeid', //出入库类型
	queryandest: 'queryandest', //查询同时暂估
	festtype: 'festtype', //暂估类型
	cratetype: 'cratetype', // 组织汇率类型
	fratecategory: 'fratecategory', // 组织汇率类别
	nestexchgrate: 'nestexchgrate', // 折本汇率
	dratedate: 'dratedate', // 组织汇率日期
	nestexhgrate: 'nestexhgrate'
};

const LIST_BUTTON = {
	est: 'Est', //暂估
	feeDistribute: 'FeeDistribute', //费用分摊
	hqhp: 'Hqhp', //优质优价取价
	print: 'Print', //打印
	linkquery: 'LinkQuery', //单据追溯
	addrow: 'AddRow', //增行
	delRow: 'DeleteRow', //删行
	refreash: 'Refresh' //刷新
};

export { URL, PAGECODE, LIST_BUTTON, FIELD };
