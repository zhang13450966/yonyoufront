const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	querylist: '/nccloud/pu/cancelvmiest/query.do', //列表态数据查询
	cancelest: '/nccloud/pu/cancelvmiest/cancelest.do', //取消暂估
	print: '/nccloud/pu/vmiest/print.do' //打印
};

//页面编码
const PAGECODE = {
	dbilldateVal: '',
	searchId: 'est_query',
	tableId: 'po_vmi',
	childTableId: 'po_vmi_fee',
	pagecode: '400402808_list',
	//通用常量
	queryType: 'simple',
	modalid: 'onlyCancelFee' //询问的模态框id
};

const LIST_BUTTON = {
	cancelest: 'CancelEst', //暂估
	print: 'Print', //打印
	linkQuery: 'LinkQuery', //单据追溯
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
	pk_storeorg: 'pk_storeorg',
	pk_stordoc: 'pk_stordoc',
	transtype: 'ctrantypeid'
};
export { URL, PAGECODE, LIST_BUTTON, FIELD };
