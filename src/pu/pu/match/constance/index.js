/*
 * @Author: xiahui 
 * @PageInfo: 三单匹配-常量
 * @Date: 2019-05-14 15:33:47 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-07-02 15:08:32
 */

// 页面模板编码
const PAGECODE = {
	listPagecode: '400401618_list',
	templeteid: '400401618'
};

// 区域ID
const AREA = {
	/** 页面区域 */
	searchId: 'search', // 列表查询区
	invoiceId: 'invoice_list', // 发票区
	stockinId: 'stockin_list', // 入库单区
	matchedId: 'matched_list', // 已匹配区

	/** 按钮区域 */
	unmatch_head: 'unmatch_head', // 未匹配按钮区
	matched_head: 'matched_head' // 已匹配按钮区
};

// 按钮ID
const BUTTONID = {
	Manual: 'Manual', // 手工匹配
	Auto: 'Auto', // 自动匹配
	Setting: 'Setting', // 匹配规则设置
	Confirm: 'Confirm', // 确认匹配结果
	Cancel: 'Cancel', // 取消确认
	Delete: 'Delete', // 删除匹配结果
	Print: 'Print', // 打印
	Output: 'Output', // 输出
	Refresh: 'Refresh' // 刷新
};

// URL
const URL = {
	query: '/nccloud/pu/match/query.do', // 入库单查询
	invoiceQuery: '/nccloud/pu/match/invoiceQuery.do', // 进项发票查询
	match: '/nccloud/pu/match/match.do', // 手工匹配
	auto: '/nccloud/pu/match/auto.do', // 手工匹配
	matchQuery: '/nccloud/pu/match/matchQuery.do', // 匹配结果查询
	confirm: '/nccloud/pu/match/confirm.do', // 确认匹配结果
	cancel: '/nccloud/pu/match/cancel.do', // 取消确认
	delete: '/nccloud/pu/match/delete.do', // 删除匹配结果
	ruleQuery: '/nccloud/pu/match/ruleQuery.do', // 匹配规则查询
	ruleSave: '/nccloud/pu/match/ruleSave.do', // 匹配规则保存
	print: '/nccloud/pu/match/print.do', // 打印
	bodyAfterEdit: '/nccloud/pu/match/bodyAfterEdit.do' // 表体编辑后事件
};

// 字段
const FIELDS = {
	/* 进项开票 */
	pk_org: 'pk_org', // 收票组织
	pk_invoice: 'pk_invoice', // 进项开票主键
	pk_invoicedetail: 'pk_invoicedetail', // 进项开票子表主键
	jldw: 'jldw', // 计量单位
	xmsl: 'xmsl', // 数量
	xmje: 'xmje', // 不含税金额

	basicunit: 'basicunit', // 主单位
	mainquantity: 'mainquantity', // 主数量
	iinvexchrate: 'iinvexchrate', // 换算率

	/* 匹配结果 */
	pk_taxmatch: 'pk_taxmatch', // 匹配结果主键
	hasinv: 'hasinv', // 生成发票
	nmatchnum: 'nmatchnum', // 本次匹配数量
	pk_taxinvoice: 'pk_taxinvoice', // 进项发票主键

	/* 入库单 */
	pk_financeorg: 'pk_stockps_b.pk_financeorg', // 入库单查询条件-财务组织
	pk_supplier: 'pk_stockps_b.pk_supplier', // 入库单查询条件-供应商
	pk_srcmaterial: 'pk_stockps_b.pk_srcmaterial', // 入库单查询条件-物料
	pk_stordoc: 'pk_stordoc', // 入库单查询条件-仓库
	nqtorigprice: 'nqtorigprice', // 无税单价
	ncurrentmatchnum: 'ncurrentmatchnum', // 本次匹配主数量
	ncurrentmatchmny: 'ncurrentmatchmny' // 本次匹配金额
};

export { PAGECODE, AREA, BUTTONID, URL, FIELDS };
