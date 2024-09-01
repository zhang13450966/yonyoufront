/*
 * @Author: chaiwx 
 * @PageInfo: 常量输出  
 * @Date: 2018-04-12 15:24:33 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-04-15 16:11:18
 */

// 区域ID
const AREA = {
	searchId: 'search',
	listTableId: 'head',
	cardFormId: 'head',
	cardTableId: 'body',
	childform1: 'childform1',
	childform2: 'childform2'
};

//页面模板编码
const PAGECODE = {
	listPagecode: '400401404_list',
	cardPagecode: '400401404_card'
};

// 缓存命名空间
const CACHDATASOURCE = {
	dataSourceList: 'scm.pu.taxinvoice.dataSourceList'
};
//界面状态
const UISTATE = {
	edit: 'edit',
	browse: 'browse'
};

//url
const REQUESTURL = {
	print: '/nccloud/pu/taxinvoice/print.do',
	save: '/nccloud/pu/taxinvoice/save.do',
	headBeforeEdit: '/nccloud/pu/taxinvoice/headBeforeEdit.do',
	headAfterEdit: '/nccloud/pu/taxinvoice/headAfterEdit.do',
	bodyAfterEdit: '/nccloud/pu/taxinvoice/bodyAfterEdit.do',
	bodyBeforeEdit: '/nccloud/pu/taxinvoice/bodyBeforeEdit.do',
	query: '/nccloud/pu/taxinvoice/query.do',
	pageQuery: '/nccloud/pu/taxinvoice/pageQuery.do',
	queryCard: '/nccloud/pu/taxinvoice/cardQuery.do',
	commit: '/nccloud/pu/taxinvoice/commit.do',
	unCommit: '/nccloud/pu/taxinvoice/unCommit.do',
	delete: '/nccloud/pu/taxinvoice/delete.do',
	billClose: '/nccloud/pu/taxinvoice/billClose.do',
	billOpen: '/nccloud/pu/taxinvoice/billOpen.do',
	lineClose: '/nccloud/pu/taxinvoice/lineClose.do',
	lineOpen: '/nccloud/pu/taxinvoice/lineOpen.do',
	copy: '/nccloud/pu/taxinvoice/copy.do',
	edit: '/nccloud/pu/taxinvoice/edit.do',
	printdatapermission: '/nccloud/pu/taxinvoice/printdatapermission.do',
	addFeeLine: '/nccloud/pu/taxinvoice/addFeeLine.do',
	addMatLine: '/nccloud/pu/taxinvoice/addMatLine.do',
	linkQueryVoucher: '/nccloud/pu/taxinvoice/linkQueryVoucher.do',
	linkQueryBudget: '/nccloud/pu/taxinvoice/linkQueryBudget.do',
	linkQuery: '/nccloud/pu/taxinvoice/linkQuery.do',
	toCard: '/card',
	toList: '/list'
};

// 按钮ID
const BUTTONID = {
	LineClose: 'LineClose', //行关闭
	LineOpen: 'LineOpen', //	行打开
	LinkQueryVoucher: 'LinkQueryVoucher', //	联查凭证
	LinkQueryBudget: 'LinkQueryBudget', //	联查预算
	BillLinkQuery: 'BillLinkQuery', //单据追溯
	LinkQuery: 'LinkQuery', //联查
	Refresh: 'Refresh',
	Delete: 'Delete', //删除
	Commit: 'Commit', //提交
	UnCommit: 'UnCommit', //收回
	Assitfunc: 'Assitfunc', //辅助功能
	Add: 'Add', //新增
	Cancel: 'Cancel', //取消
	Print: 'Print', //打印
	Output: 'Output', //打印
	CopyLine: 'CopyLine', //复制行
	PasteLineToTail: 'PasteLineToTail', //粘贴至末行
	CancelB: 'CancelB', //取消
	InsertLine: 'InsertLine', //插入行
	ApproveInfo: 'ApproveInfo', //审批意见
	AddFeeLine: 'AddFeeLine', //增费用行
	AddMatLine: 'AddMatLine', //增物料行
	Open: 'Open', //展开
	PasteLine: 'PasteLine', //粘贴行
	SaveCommit: 'SaveCommit', //保存提交
	Copy: 'Copy', //复制
	Edit: 'Edit', //修改
	DeleteFeeLine: 'DeleteFeeLine', //删费用行
	DeleteMatLine: 'DeleteMatLine', //删物料行
	SaveGroup: 'SaveGroup',
	Save: 'Save', //保存
	Delete: 'Delete', //删除
	UnCommit: 'UnCommit', //收回
	AddLineGroup: 'AddLineGroup',
	ReArrangeRowNo: 'ReArrangeRowNo', //重排行号
	BillOpen: 'BillOpen', //	整单打开
	BillClose: 'BillClose', //整单关闭
	File: 'File' //附件管理
};

// 复制粘贴按钮组
const COPYPASTEBTNS = {
	initBtns: [ BUTTONID.AddLine, BUTTONID.DeleteLine, BUTTONID.CopyLine ],
	pasteBtns: [ BUTTONID.PasteLineToTail, BUTTONID.CancelB ]
};

// 按钮区域
const BUTTONAREA = {
	list_head: 'list_head',
	list_inner: 'list_inner',
	card_head: 'card_head',
	card_body: 'card_body',
	card_body_inner: 'card_body_inner'
};

// 字段
const FIELDS = {
	pk_taxinvoice: 'pk_taxinvoice',
	approver: 'approver',
	bignoreatpcheck: 'bignoreatpcheck',
	billmaker: 'billmaker',
	pk_taxinvoice: 'pk_taxinvoice',
	ccurrencyid: 'ccurrencyid',
	cdeptid: 'cdeptid',
	cdeptvid: 'cdeptvid',
	cfinanceorgid: 'cfinanceorgid',
	cfinanceorgvid: 'cfinanceorgvid',
	corigcurrencyid: 'corigcurrencyid',
	cpsnid: 'cpsnid',
	creationtime: 'creationtime',
	creator: 'creator',
	ctrantypeid: 'ctrantypeid',
	dbilldate: 'dbilldate',
	dcanceldate: 'dcanceldate',
	dmakedate: 'dmakedate',
	fpfstatusflag: 'fpfstatusflag',
	fstatusflag: 'fstatusflag',
	modifiedtime: 'modifiedtime',
	modifier: 'modifier',
	nexchangerate: 'nexchangerate',
	nglobalexchgrate: 'nglobalexchgrate',
	ngroupexchgrate: 'ngroupexchgrate',
	ntotalmny: 'ntotalmny',
	pk_group: 'pk_group',
	pk_org: 'pk_org',
	pk_org_v: 'pk_org_v',
	taudittime: 'taudittime',
	vbillcode: 'vbillcode',
	vnote: 'vnote',
	vtrantypecode: 'vtrantypecode',

	bfeecloseflag: 'bfeecloseflag',
	boutendflag: 'boutendflag',
	cassumedeptid: 'cassumedeptid',
	cassumedeptvid: 'cassumedeptvid',
	cassumeorgid: 'cassumeorgid',
	cassumeorgvid: 'cassumeorgvid',
	castunitid: 'castunitid',
	cbill_bid: 'cbill_bid',
	cbrandid: 'cbrandid',
	ccloserid: 'ccloserid',
	ccostcenterid: 'ccostcenterid',
	ccostsubjid: 'ccostsubjid',
	cbillbid_ccostsubjid: 'cbillbid.ccostsubjid',
	cdelivorgid: 'cdelivorgid',
	cdelivorgvid: 'cdelivorgvid',
	cemployeeid: 'cemployeeid',
	cfactorid: 'cfactorid',
	cfeecustomerid: 'cfeecustomerid',
	cfeeprojectid: 'cfeeprojectid',
	cmaterialid: 'cmaterialid',
	cmaterialrowno: 'cmaterialrowno',
	cprodlineid: 'cprodlineid',
	cmaterialvid: 'cmaterialvid',
	cprofitcenterid: 'cprofitcenterid',
	cprofitcentervid: 'cprofitcentervid',
	creceiveaddrid: 'creceiveaddrid',
	creceiveareaid: 'creceiveareaid',
	creceivecustid: 'creceivecustid',
	creceivedeptid: 'creceivedeptid',
	creceivedeptvid: 'creceivedeptvid',
	creceiveorgid: 'creceiveorgid',
	creceiveorgvid: 'creceiveorgvid',
	creceivesiteid: 'creceivesiteid',
	crowno: 'crowno',
	csendstockorgid: 'csendstockorgid',
	csendstockorgvid: 'csendstockorgvid',
	csendstordocid: 'csendstordocid',
	cunitid: 'cunitid',
	dclosedate: 'dclosedate',
	dsenddate: 'dsenddate',
	nastnum: 'nastnum',
	nglobalmny: 'nglobalmny',
	ngroupmny: 'ngroupmny',
	nmaterialorigmny: 'nmaterialorigmny',
	nmny: 'nmny',
	nnum: 'nnum',
	norigmny: 'norigmny',
	norigprice: 'norigprice',
	ntotalexemny: 'ntotalexemny',
	ntotaloutmny: 'ntotaloutmny',
	ntotaloutnum: 'ntotaloutnum',
	vchangerate: 'vchangerate',
	ts: 'ts'
};

//费用行字段
const FREEFIELDS = {
	pk_group: 'pk_group',
	pk_org: 'pk_org',
	crowno: 'crowno',
	cassumeorgid: 'cassumeorgid',
	cassumeorgvid: 'cassumeorgvid',
	cassumedeptid: 'cassumedeptid',
	cassumedeptvid: 'cassumedeptvid',
	ccostsubjid: 'ccostsubjid',
	cprodlineid: 'cprodlineid',
	cbrandid: 'cbrandid',
	cprofitcenterid: 'cprofitcenterid',
	cprofitcentervid: 'cprofitcentervid',
	ccostcenterid: 'ccostcenterid',
	cfactorid: 'cfactorid',
	cfeeprojectid: 'cfeeprojectid',
	cfeecustomerid: 'cfeecustomerid',
	norigmny: 'norigmny',
	nmny: 'nmny',
	nglobalmny: 'nglobalmny',
	ngroupmny: 'ngroupmny',
	ntotalexemny: 'ntotalexemny',
	bfeecloseflag: 'bfeecloseflag',
	ccloserid: 'ccloserid',
	dclosedate: 'dclosedate',
	vbnote: 'vbnote'
};

const BILLSTATUS = {
	// 自由状态（单据录入后）
	free: '0',
	// 审批中（申请提交审批后）
	auditing: '1',
	// 审批通过（单据审批后）
	audit: '2',
	// 审批未通过（申请审批未通过）
	nopass: '3',
	// 关闭
	close: '4'
};

// tab
const TABS = {
	toCommit: 'toCommit',
	approving: 'approving',
	executing: 'executing',
	all: 'all'
};

// tabnum
const TABSNUM = {
	toCommit: 0,
	approving: 1,
	executing: 2,
	all: 3
};

// 缓存key
const CACHKEY = {
	searchCach: 'searchCach',
	tabCach: 'tabCach',
	Dlinksce: 'linksce',
	listDataCach: 'listDataCach',
	cardDataCach: 'cardDataCach'
};

// 批量操作成功单据标识
const SUCCESSKEY = 'bills';

// 操作（复制、退回）
const OPTIONS = {
	// 复制
	copy: 'copy'
};

export {
	AREA,
	PAGECODE,
	REQUESTURL,
	UISTATE,
	FIELDS,
	BUTTONID,
	BUTTONAREA,
	COPYPASTEBTNS,
	CACHDATASOURCE,
	BILLSTATUS,
	TABS,
	TABSNUM,
	CACHKEY,
	SUCCESSKEY,
	OPTIONS,
	FREEFIELDS
};
