const REF30_CONST = {
	dataSource: '30to4816DataSource',
	formId: 'head', //表头区域
	tableId: 'body', //表体区域
	transPageId: '400600400_30to4816', //pagecode
	singleTableId: 'view',
	appcode: '400600400',
	searchId: 'saleorderSearch',
	destPageUrl: '/card',
	serachUrl: '/nccloud/scmpub/prepaidinvoice/queryby30.do',
	pk_head: 'csaleorderid',
	pk_body: 'csaleorderbid',
	refresh: 'Refresh'
};
const FIELD = {
	csettleorgid: 'so_saleorder_b.csettleorgid', //财务组织
	pk_org: 'pk_org', //销售组织
	ccustomerid: 'ccustomerid', //客户
	cdeptid: 'cdeptid', //部门
	cemployeeid: 'cemployeeid', //业务员
	cmaterialid: 'so_saleorder_b.cmaterialid', //物料
	cmaterialid_code: 'so_saleorder_b.cmaterialid.code', //物料编码
	nastnum: 'nastnum', //数量
	ctrantypeid: 'ctrantypeid', //交易类型
	vbillcode: 'vbillcode', //单据号
	norigtaxmny: 'norigtaxmny' //价税合计
};
export { REF30_CONST, FIELD };
