const REF4621_CONST = {
	dataSource: 'ref4621DataSource',
	formId: 'head', //表头区域
	tableId: 'body', //表体区域
	transPageId: '400601400_transfer4621', //卡片pagecode
	singleTableId: 'view',
	appcode: '400601400',
	searchId: 'settleSearch',
	destPageUrl: '/card',
	serachUrl: '/nccloud/scmpub/arsub/queryby4621.do',
	pk_head: 'pk_settle',
	pk_body: 'pk_settle_b',
	refresh: 'Refresh'
};
const FIELD = {
	csettleorgid: 'csettleorgid', //财务组织
	csaleorgid: 'csaleorgid', //销售组织
	pk_org: 'pk_org', //返利计算组织
	cordercustid: 'cordercustid', //订单客户
	cordercustid_pk_custclass: 'cordercustid.pk_custclass', //订单客户基本分类
	cinvoicecustid: 'cinvoicecustid', //开票客户
	vbillcode: 'vbillcode', //单据号
	cinvoicecustid_pk_custclass: 'cinvoicecustid.pk_custclass' //开票客户基本分类
};
export { REF4621_CONST, FIELD };
