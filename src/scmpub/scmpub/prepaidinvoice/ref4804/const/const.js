const REF4804_CONST = {
	dataSource: 'ref4804DataSource',
	formId: 'head', //表头区域
	tableId: 'body', //表体区域
	transPageId: '401400404_4804to4816', //卡片pagecode
	singleTableId: 'view',
	appcode: '401400404',
	searchId: 'search',
	destPageUrl: '/card',
	serachUrl: '/nccloud/scmpub/prepaidinvoice/queryby4804.do',
	pk_head: 'cdelivbill_hid',
	pk_body: 'cdelivbill_bid',
	refresh: 'Refresh',
	refreshShowinfo: 'refreshShowinfo',
	refreshNOinfo: 'refreshNOinfo',
	vbillcode: 'vdelivbillcode'
};
const FIELD = {
	cfinanceorgid: 'cfinanceorgid', //财务组织
	csaleorgid: 'csaleorgid', //销售组织
	pk_org: 'pk_org', //返利计算组织
	cordercustid: 'cordercustid', //订单客户
	cordercustid_pk_custclass: 'cordercustid.pk_custclass', //订单客户基本分类
	cinvoicecustid: 'cinvoicecustid', //开票客户
	cinvoicecustid_pk_custclass: 'cinvoicecustid.pk_custclass', //开票客户基本分类
	crouteid: 'crouteid', //运输路线
	ccarrierid: 'ccarrierid', // 承运商
	capcustid: 'capcustid', //开票方
	ccosignid: 'ccosignid', //委托单位
	ctakefeeid: 'ctakefeeid', //客户
	cprojectid: 'delivbill.cprojectid' //项目
};
export { REF4804_CONST, FIELD };
