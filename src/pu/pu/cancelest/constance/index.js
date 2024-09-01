/*
 * @Author: zhangshqb 
 * @PageInfo: 取消暂估使用的常量  
 * @Date: 2018-06-07 10:15:56 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-22 14:18:45
 */
const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	querylist: '/nccloud/pu/cancelest/query.do', //列表态数据查询
	cancelest: '/nccloud/pu/cancelest/cancelest.do', //取消暂估
	print: '/nccloud/pu/est/print.do' //打印
};

//页面编码
const PAGECODE = {
	dbilldateVal: '',
	searchId: 'cancelest_query', //查询区id
	tableId: 'po_stockps', //表格区域id
	childTableId: 'po_stockps_fee', //嵌套表格区域id
	pagecode: '400402804_list', //页面编码
	//通用常量
	queryType: 'simple', //查询类型
	modalid: 'onlyCancelFee' //询问的模态框id
};

const FIELD = {
	pk_supplier: 'pk_stockps_b.pk_supplier',
	pk_srcmaterial: 'pk_stockps_b.pk_srcmaterial',
	pk_material: 'pk_stockps_b.pk_material',
	pk_org: 'pk_stockps_b.pk_financeorg', //财务组织
	pk_feematerial: 'pk_feematerial',
	pk_childsupplier: 'pk_supplier',
	pk_marclass: 'pk_stockps_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
	pk_pumarclass: 'pk_stockps_b.pk_material.materialstock.pk_marpuclass', //物料采购分类
	cproject: 'cprojectid', //项目
	pk_stockorg: 'pk_org', //库存组织
	dept: 'pk_dept', //部门
	psndoc: 'pk_psndoc', //人员
	stordoc: 'pk_stordoc', //仓库
	transtype: 'ctrantypeid' //出入库类型
};

const LIST_BUTTON = {
	cancelest: 'CancelEst', //暂估
	print: 'Print', //打印
	linkQuery: 'LinkQuery', //单据追溯
	refreash: 'Refresh' //刷新
};

export { URL, PAGECODE, LIST_BUTTON, FIELD };
