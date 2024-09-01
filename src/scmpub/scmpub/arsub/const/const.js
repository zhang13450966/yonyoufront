/*
 * @Author: 刘奇 
 * @PageInfo: 客户费用单常量类  
 * @Date: 2019-03-30 10:42:52 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-15 14:25:35
 */

const ARSUB_CONST = {
	// 退回
	return: 'return',
	// 转单
	transfer: 'transfer',
	ArsubCacheKey: 'scm.scmpub.arsub.cachekey',
	formId: 'head', //表头区域
	tableId: 'arsub_b', //表体区域
	detailId: 'arsub_detail', //费用冲抵明细
	left: 'left',
	detailPageId: '400601400_casharsub', //费用冲抵明细
	side: 'childform1', // 侧拉
	cardPageId: '400601400_card', //卡片pagecode
	listPageId: '400601400_list', //列表pagecode
	budgetPageId: '400601400_budget', //联查预算
	budgetTableId: 'head', //联查预算
	searchId: '400601400_search',
	moduleId: '4006', //模块id
	billtype: '35', // 单据类型
	scene: 'scene',
	approvesce: 'approvesce',

	browse: 'browse', //状态
	edit: 'edit',
	add: 'add',
	copy: 'copy',
	output: 'output',
	Card_URL: '/card',
	List_URL: '/list',
	Ref4621_URL: '/ref4621',
	Ref4641_URL: '/ref4641',
	saveUrl: '/nccloud/scmpub/arsub/save.do',
	savecommitUrl: '/nccloud/scmpub/arsub/savecommit.do', //云原生修改
	arsubEditUrl: '/nccloud/scmpub/arsub/edit.do', //add by huoyzh 修改走后台，走权限校验
	queryListUrl: '/nccloud/scmpub/arsub/query.do',
	queryForPage: '/nccloud/scmpub/arsub/queryForPage.do',
	queryCardUrl: '/nccloud/scmpub/arsub/querycard.do',
	queryDetailUrl: '/nccloud/scmpub/arsub/querydetail.do', //查看费用冲抵
	queryBudgetUrl: '/nccloud/scmpub/arsub/querybudget.do', //联查预算
	transferUrl: '/nccloud/scmpub/arsub/transfer.do',
	// 打印
	printUrl: '/nccloud/scmpub/arsub/print.do',
	printdatapermission: '/nccloud/scmpub/arsub/printpermission.do', //打印权限校验
	headafter: '/nccloud/scmpub/arsub/headafter.do', //表头编辑后
	bodyrowafter: '/nccloud/scmpub/arsub/bodyrowafter.do', //增行事件
	bodyafter: '/nccloud/scmpub/arsub/bodyafter.do', //表体行编辑后
	deleteUrl: '/nccloud/scmpub/arsub/delete.do', //删除
	//列表
	listbillopenUrl: '/nccloud/scmpub/arsub/listbillopen.do', //整单打开
	listbillcloseUrl: '/nccloud/scmpub/arsub/listbillclose.do', //整单关闭
	listcommitUrl: '/nccloud/scmpub/arsub/batchcommit.do', // 提交
	listuncommitUrl: '/nccloud/scmpub/arsub/batchuncommit.do', // 收回
	//卡片
	cardbillopenUrl: '/nccloud/scmpub/arsub/cardbillopen.do', //整单打开
	cardbillcloseUrl: '/nccloud/scmpub/arsub/cardbillclose.do', //整单关闭
	cardcommitUrl: '/nccloud/scmpub/arsub/commit.do', // 提交
	pushcheck: '/nccloud/scmpub/arsub/pushcheck.do', // 收回

	carduncommitUrl: '/nccloud/scmpub/arsub/uncommit.do', // 收回

	copybillUrl: '/nccloud/scmpub/arsub/copybill.do', //复制
	budgetQueryUrl: '/nccloud/scmpub/arsub/budgetquery.do', //联查预算
	linkQuery: '/nccloud/scmpub/arsub/linkQuery.do' //提供给会计平台联查凭证
};

const REVISEHISTORY_CONST = {
	listTableId: 'head',
	cardTableId: 'so_saleorder_b',
	queryTemplet: '/nccloud/platform/templet/querypage.do',
	queryHistory: '/nccloud/scmpub/arsub/queryhistoryhead.do',
	queryHistoryBody: '/nccloud/scmpub/arsub/queryhistorybody.do',
	templetCode: '400600410_history',
	pk_field: 'corderhistoryid',
	pk_field_b: 'corderhistorybid'
};

const ArsubHeadItem = {
	carsubid: 'carsubid', //主表主键
	pk_org: 'pk_org', // 财务组织最新版本
	pk_org_v: 'pk_org_v', // 财务组织
	ctrantypeid: 'ctrantypeid', //客户费用单类型
	vtrantypecode: 'vtrantypecode', //冲应收单据类型编码
	cordercustid: 'cordercustid', //客户
	cinvoicecustid: 'cinvoicecustid', //开票客户
	ccustbankaccid: 'ccustbankaccid', //客户银行账号
	csaleorgid: 'csaleorgid', //销售组织
	csaleorgvid: 'csaleorgvid', //销售组织
	cemployeeid: 'cemployeeid', //销售业务员
	cdeptvid: 'cdeptvid', //销售部门
	cdeptid: 'cdeptid', //销售部门
	vbillcode: 'vbillcode', //单据号
	fstatusflag: 'fstatusflag', //单据状态
	dbilldate: 'dbilldate', //单据日期
	nexchangerate: 'nexchangerate', //折本汇率
	corigcurrencyid: 'corigcurrencyid', //币种
	ccurrencyid: 'ccurrencyid', //本位币
	saga_status: 'saga_status', //saga状态 add by huoyzh 云原生适配
	saga_frozen: 'saga_frozen', //saga 冻结状态 add by huoyzh 前端适配 2019-12-9
	saga_gtxid: 'saga_gtxid', //saga事务id add by huoyzh 前端适配 2019-12-9
	ts: 'ts', //时间戳
	cratetype: 'cratetype', //组织汇率类型
	fratecategory: 'fratecategory', //组织汇率类别
	dratedate: 'dratedate' //组织汇率来源日期
};

const ArsubQueryBodyItem = {
	vsrctype: 'vsrctype', //来源单据类型
	cpayorgid: 'carsubbid.cpayorgid', //费用承担组织
	cpaydeptid: 'carsubbid.cpaydeptid', //费用承担部门
	cincomeprejectid: 'carsubbid.cincomeprejectid', //收支项目
	cprojectid: 'carsubbid.cprojectid', //项目
	cprofitcenterid: 'carsubbid.cprofitcenterid', //利润中心
	ccostcenterid: 'carsubbid.ccostcenterid', //成本中心
	cfactorid: 'carsubbid.cfactorid', //核算要素
	cordertrantypeid: 'carsubbid.cordertrantypeid', //订单类型
	dbilldate: 'dbilldate' //单据日期
};
const ArsubBodyItem = {
	crowno: 'crowno', //行号
	carsubbid: 'carsubbid', //子表主键
	pk_org: 'pk_org', // 财务组织最新版本
	pk_group: 'pk_group', // 集团
	cpayorgid: 'cpayorgid', //费用承担组织
	cpaydeptid: 'cpaydeptid', //费用承担部门
	ndeclaremny: 'ndeclaremny', //费用申报金额
	norigarsubmny: 'norigarsubmny', //费用支持金额
	nsustainrate: 'nsustainrate', //费用支持比例
	nremainmny: 'nremainmny', //余额
	cincomeprejectid: 'cincomeprejectid', //收支项目
	cprojectid: 'cprojectid', //项目
	cprofitcenterid: 'cprofitcenterid', //利润中心
	ccostcenterid: 'ccostcenterid', //成本中心
	cfactorid: 'cfactorid', //核算要素
	cordertrantypeid: 'cordertrantypeid', //订单类型
	vsrctype: 'vsrctype', //来源单据类型
	dbilldate: 'dbilldate', //单据日期
	nsustainmny: 'nsustainmny', //本币费用支持金额
	csrcbid: 'csrcbid', //来源单据表体id
	ts: 'ts' //时间戳
};
// 按钮区域常亮
const BUTTON_AREA = {
	List_Head: 'list_head',
	List_Inner: 'list_inner',
	Card_Head: 'card_head',
	Card_Body: 'card_body',
	Card_Body_Inner: 'card_body_inner'
};

//按钮名称以及区域
const BUTTON = {
	addGroup: 'AddGroup', //新增按钮组
	add: 'Add', //新增
	add4641: 'Add4641', //新增客户费用申请单
	add4621: 'Add4621', //新增返利结算单
	edit: 'Edit', //修改
	delete: 'Delete', //删除
	save: 'Save', //保存
	saveCommit: 'SaveCommit', //保存提交
	cancel: 'Cancel', //取消
	copy: 'Copy', //复制
	commit: 'Commit', //提交
	unCommit: 'UnCommit', //收回
	pushReceivable: 'PushReceivable', //生成红字应收单
	pushArsubToGathering: 'PushArsubToGathering', //生成收款
	closeBill: 'CloseBill', //整单关闭
	openBill: 'OpenBill', //整单打开
	file: 'File', //附件
	fileManage: 'FileManage', //附件管理
	offsetInfo: 'OffsetInfo', //费用冲抵情况
	queryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	querySettle: 'QuerySettle', //联查返利结算单
	queryBudget: 'QueryBudget', //联查预算
	print: 'Print', //打印
	Print_list: 'Print_list', //打印清单
	output: 'Output', //输出
	refresh: 'Refresh', //刷新
	deleteLine: 'DeleteLine', //删行
	addLine: 'AddLine', //增行
	copyLine: 'CopyLine', //复制行
	resetRowNo: 'ResetRowNo', //重排行号
	approveInfo: 'ApproveInfo', //审批详情
	pasteLineToTail: 'PasteLineToTail', //粘贴至末行
	canelCopy: 'CanelCopy', //取消粘贴
	spread: 'Spread', //展开
	pasteLine: 'PasteLine', //粘贴行
	insertLine: 'InsertLine', //插行
	quitTransfer: 'QuitTransfer', //退出转单
	printCountQuery: 'PrintCountQuery' //打印查询
};

const BILL_STATUS = { I_AUDIT: '2', I_AUDITING: '7', I_CLOSED: '4', I_FREE: '1', I_NOPASS: '8' };

const PASTE_CLEAR_FIELDS = [];
const SUCCESSKEY = 'bills';

export {
	ArsubHeadItem,
	ArsubBodyItem,
	ArsubQueryBodyItem,
	ARSUB_CONST,
	BUTTON_AREA,
	BILL_STATUS,
	REVISEHISTORY_CONST,
	PASTE_CLEAR_FIELDS,
	BUTTON,
	SUCCESSKEY
};
