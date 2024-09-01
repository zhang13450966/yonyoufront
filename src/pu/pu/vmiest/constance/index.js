/*
 * @Author: zhangshqb 
 * @PageInfo: 常量处理  
 * @Date: 2018-06-26 11:38:36 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2021-07-10 14:11:21
 */
const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	querylist: '/nccloud/pu/vmiest/query.do', //列表态数据查询
	estgoods: '/nccloud/pu/vmiest/estgoods.do', //货物暂估
	estfee: '/nccloud/pu/vmiest/estfee.do', //费用暂估
	afteredit: '/nccloud/pu/vmiest/afteredit.do', //货物编辑后事件
	feeAfterEdit: '/nccloud/pu/vmiest/feeAfterEdit.do', //费用编辑后事件
	feedis: '/nccloud/pu/vmiest/estfeedistribute.do', //费用分摊
	print: '/nccloud/pu/vmiest/print.do' //打印
};

//页面编码
const PAGECODE = {
	dbilldateVal: '',
	searchId: 'est_query',
	tableId: 'po_vmi',
	childTableId: 'po_vmi_fee',
	pagecode: '400402806_list',
	modaltablecode: 'po_vmi_fee_modal',
	//通用常量
	queryType: 'simple'
};

const LIST_BUTTON = {
	est: 'Est', //暂估
	feeDistribute: 'FeeDistribute', //费用分摊
	print: 'Print', //打印
	linkQuery: 'LinkQuery', //单据追溯
	addrow: 'AddRow', //增行
	delRow: 'DeleteRow', //删行
	refreash: 'Refresh' //刷新
};

const FIELD = {
	pk_financeorg: 'pk_financeorg', //财务组织
	pk_material: 'pk_material',
	pk_srcmaterial: 'pk_srcmaterial',
	pk_marbasclass: 'pk_srcmaterial.pk_marbasclass',
	pk_marpuclass: 'pk_material.materialstock.pk_marpuclass',
	cprojectid: 'cprojectid',
	pk_supplier: 'pk_supplier',
	pk_supplier_v: 'pk_supplier_v',
	pk_storeorg: 'pk_storeorg',
	pk_stordoc: 'pk_stordoc',
	transtype: 'ctrantypeid',
	cratetype: 'cratetype', // 组织汇率类型
	fratecategory: 'fratecategory', // 组织汇率类别
	nestexchgrate: 'nestexchgrate', // 折本汇率
	dratedate: 'dratedate' // 组织汇率日期
};

export { URL, PAGECODE, LIST_BUTTON, FIELD };
