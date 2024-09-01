const REF4641_CONST = {
	dataSource: 'ref4641DataSource',
	formId: 'head', //表头区域
	tableId: 'body', //表体区域
	transPageId: '403800402_to35', //卡片pagecode
	singleTableId: 'view',
	appcode: '403800402',
	searchId: 'feeapplySearch',
	destPageUrl: '/card',
	serachUrl: '/nccloud/scmpub/arsub/queryby4641.do',
	pk_head: 'cbillid',
	pk_body: 'cbill_bid',
	refresh: 'Refresh'
};
const FIELD = {
	cfinanceorgid: 'cfinanceorgid', //财务组织
	pk_org: 'pk_org', //销售组织
	cfeecustomerid: 'cbill_bid.cfeecustomerid', //费用归集客户
	ctrantypeid: 'ctrantypeid', //交易类型
	cpsnid: 'cpsnid', //销售业务员
	vbillcode: 'vbillcode', //单据号
	cdeptid: 'cdeptid' //销售部门
};
export { REF4641_CONST, FIELD };
