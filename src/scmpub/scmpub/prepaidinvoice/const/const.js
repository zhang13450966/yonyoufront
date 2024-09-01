/*
 * @Author: 刘奇 
 * @PageInfo: 代垫运费发票常量类  
 * @Date: 2019-03-30 10:42:31 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-14 09:22:01
 */

const PREPAIDINVOICE_CONST = {
	PrepaidinvoiceCacheKey: 'scm.scmpub.prepaidinvoice.cachekey',
	formId: 'head', //表头区域
	tableId: 'prepaidinvoice_b', //表体区域
	left: 'left',
	side: 'childform2', // 侧拉
	cardPageId: '400601300_card', //卡片pagecode
	listPageId: '400601300_list', //列表pagecode
	searchId: '400601300_search',
	moduleId: '4006', //模块id
	browse: 'browse', //状态
	edit: 'edit',
	add: 'add',
	copy: 'copy',
	output: 'output',
	Card_URL: '/card',
	List_URL: '/list',
	Ref30_URL: '/ref30',
	Ref4804_URL: '/ref4804',
	editUrl: '/nccloud/scmpub/prepaidinvoice/edit.do',
	saveUrl: '/nccloud/scmpub/prepaidinvoice/save.do',
	saveCommitUrl: '/nccloud/scmpub/prepaidinvoice/savecommit.do',
	queryListUrl: '/nccloud/scmpub/prepaidinvoice/query.do',
	queryForPage: '/nccloud/scmpub/prepaidinvoice/queryForPage.do',
	queryCardUrl: '/nccloud/scmpub/prepaidinvoice/querycard.do',
	queryDetailUrl: '/nccloud/scmpub/prepaidinvoice/querydetail.do',
	transferUrl: '/nccloud/scmpub/prepaidinvoice/transfer.do',
	transfer4804Url: '/nccloud/scmpub/prepaidinvoice/transfer4804.do',
	// 打印
	printUrl: '/nccloud/scmpub/prepaidinvoice/print.do',
	printdatapermission: '/nccloud/scmpub/prepaidinvoice/printpermission.do', //打印权限校验
	headbefore: '/nccloud/scmpub/prepaidinvoice/headbefore.do', //表头编辑前
	headafter: '/nccloud/scmpub/prepaidinvoice/headafter.do', //表头编辑后
	bodyrowafter: '/nccloud/scmpub/prepaidinvoice/bodyrowafter.do', //增行事件
	bodyafter: '/nccloud/scmpub/prepaidinvoice/bodyafter.do', //表体行编辑后
	deleteUrl: '/nccloud/scmpub/prepaidinvoice/delete.do', //删除
	deletebody: '/nccloud/scmpub/prepaidinvoice/deletebody.do', //表体删除
	pastbody: '/nccloud/scmpub/prepaidinvoice/pastbody.do', //粘贴变更 表头的价税合计
	//列表
	listbillopenUrl: '/nccloud/scmpub/prepaidinvoice/listbillopen.do', //整单打开
	listbillcloseUrl: '/nccloud/scmpub/prepaidinvoice/listbillclose.do', //整单关闭
	listcommitUrl: '/nccloud/scmpub/prepaidinvoice/batchcommit.do', // 提交
	listuncommitUrl: '/nccloud/scmpub/prepaidinvoice/batchuncommit.do', // 收回
	//卡片
	cardbillopenUrl: '/nccloud/scmpub/prepaidinvoice/cardbillopen.do', //整单打开
	cardbillcloseUrl: '/nccloud/scmpub/prepaidinvoice/cardbillclose.do', //整单关闭
	cardcommitUrl: '/nccloud/scmpub/prepaidinvoice/commit.do', // 提交
	carduncommitUrl: '/nccloud/scmpub/prepaidinvoice/uncommit.do', // 收回
	copybillUrl: '/nccloud/scmpub/prepaidinvoice/copybill.do' //复制
};
const BILLTYPE = {
	prepaidinvoice: '4816', //代垫运费发票
	delivbill: '4804' //运输单
};
const REVISEHISTORY_CONST = {
	listTableId: 'head',
	cardTableId: 'so_saleorder_b',
	queryTemplet: '/nccloud/platform/templet/querypage.do',
	queryHistory: '/nccloud/scmpub/prepaidinvoice/queryhistoryhead.do',
	queryHistoryBody: '/nccloud/scmpub/prepaidinvoice/queryhistorybody.do',
	templetCode: '400600410_history',
	pk_field: 'corderhistoryid',
	pk_field_b: 'corderhistorybid'
};

const PrepaidinvoiceHeadItem = {
	hid: 'cinvoice_hid', //主表主键
	pk_org: 'pk_org', // 财务组织
	pk_org_v: 'pk_org_v', // 财务组织
	pk_group: 'pk_group', //集团
	cdmsupplierid: 'cdmsupplierid', //承运商
	capcustid: 'capcustid', //开票方
	capcustvid: 'capcustvid', //开票方
	ctakefeeid: 'ctakefeeid', //客户
	ctakefeevid: 'ctakefeevid', //客户
	vbillcode: 'vbillcode', //单据号
	fstatusflag: 'fstatusflag', //单据状态
	dbilldate: 'dbilldate', //单据日期
	corigcurrencyid: 'corigcurrencyid', //币种
	nexchangerate: 'nexchangerate', //折本汇率
	cratetype: 'cratetype', //组织汇率类型
	dratedate: 'dratedate', //组织汇率来源日期
	ccurrencyid: 'ccurrencyid', //本位币
	ngroupexchgrate: 'ngroupexchgrate', //集团本位币汇率
	nglobalexchgrate: 'nglobalexchgrate', //全局本位币汇率
	crececountryid: 'crececountryid', //收货国家/地区
	fbuysellflag: 'fbuysellflag', //购销类型
	saga_status: 'saga_status', //saga状态 add by huoyzh 云原生适配
	saga_gtxid: 'saga_gtxid', //saga 事务id  add by huoyzh 云原生适配
	ts: 'ts' //时间戳
};
const PrepaidinvoiceBodyItem = {
	crowno: 'crowno', //行号
	bid: 'cinvoice_bid', //子表主键
	pk_org: 'pk_org', // 财务组织最新版本
	pk_group: 'pk_group', // 集团
	cfeeinvid: 'cfeeinvid', //费用项
	ctaxcodeid: 'ctaxcodeid', //税码
	ntaxrate: 'ntaxrate', //税率
	ftaxtypeflag: 'ftaxtypeflag', //扣税类别
	ncaltaxmny: 'ncaltaxmny', //计税金额
	vsrctype: 'vsrctype', //来源单据类型
	dbilldate: 'dbilldate', //单据日期
	csettlebill_bid: 'csettlebill_bid', //来源运费结算单子表ID
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
	PrintCountQuery: 'PrintCountQuery', //打印次数查询
	addGroup: 'AddGroup', //新增按钮组
	add: 'Add', //新增
	add30: 'Add30', //新增销售订单
	add4804: 'Add4804', //新增运输单
	edit: 'Edit', //修改
	delete: 'Delete', //删除
	save: 'Save', //保存
	saveCommit: 'SaveCommit', //保存提交
	cancel: 'Cancel', //取消
	copy: 'Copy', //复制
	commit: 'Commit', //提交
	unCommit: 'UnCommit', //收回
	file: 'File', //附件
	fileManage: 'FileManage', //附件管理
	queryAboutBusiness: 'QueryAboutBusiness', //单据追溯
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
	quitTransfer: 'QuitTransfer' //退出转单
};

const BILL_STATUS = { I_AUDIT: '3', I_AUDITING: '1', I_CLOSED: '4', I_FREE: '0', I_NOPASS: '2' };

const PASTE_CLEAR_FIELDS = [];

export {
	PrepaidinvoiceHeadItem,
	PrepaidinvoiceBodyItem,
	PREPAIDINVOICE_CONST,
	BUTTON_AREA,
	BILL_STATUS,
	REVISEHISTORY_CONST,
	PASTE_CLEAR_FIELDS,
	BUTTON,
	BILLTYPE
};
