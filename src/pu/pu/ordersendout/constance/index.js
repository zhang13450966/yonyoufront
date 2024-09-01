/*
 * @Author: xiahui 
 * @PageInfo: 常量
 * @Date: 2019-01-10 16:56:37 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-09 10:12:44
 */

// 区域ID
const AREA = {
	searchId: 'search', // 列表查询区
	listTableId: 'head', // 列表表头区
	cardFormId: 'head', // 卡片表头区
	cardTableId: 'body', // 卡片表体区

	/** 按钮区域 */
	list_head: 'list_head', // 列表表头按钮区
	list_inner: 'list_inner', // 列表表体操作区
	card_head: 'card_head', // 卡片表头按钮区
	card_body: 'card_body', // 卡片 cardTableId 肩部按钮区
	card_body_inner: 'card_body_inner' // 卡片 cardTableId 表体操作区
};

// 页面模板编码
const PAGECODE = {
	listPagecode: '400401004_list',
	cardPagecode: '400401004_card',
	templeteid: '400401004'
};

// 单页缓存
const DATASOURCECACHE = {
	dataSourceListCacheKey: 'pu.pu.ordersendout.data_source_list' // 列表缓存
};

// 自定义缓存
const DEFCACHEKEY = {
	queryCacheKey: 'queryCacheKey' // 查询条件缓存
};

// 按钮ID
const BUTTONID = {
	Print: 'Print', // 打印
	Refresh: 'Refresh', // 刷新
	SendOut: 'SendOut', // 发货
	UnSendout: 'UnSendout', // 反发货
	Back: 'Back' // 返回
};

// URL
const URL = {
	list: '/list',
	card: '/card',

	search: '/nccloud/pu/ordersendout/query.do',
	pageQuery: '/nccloud/pu/ordersendout/pageQuery.do',
	cardQuery: '/nccloud/pu/ordersendout/cardQuery.do',
	print: '/nccloud/pu/ordersendout/print.do',

	sendout: '/nccloud/pu/ordersendout/sendout.do',
	unSendout: '/nccloud/pu/ordersendout/unSendout.do'
};
//状态
const UISTATE = {
	edit: 'edit',
	browse: 'browse'
};
// 字段
const FIELDS = {
	pk_org: 'pk_org', // 采购组织
	pk_order: 'pk_order', // 采购订单
	vbillcode: 'vbillcode', // 订单编码
	bissendout: 'bissendout', // 是否发货
	fonwaystatus: 'fonwaystatus', // 在途状态

	bconsigncode: 'bconsigncode', // 发货单据号
	bconsigndate: 'bconsigndate', // 发货单据日期
	bconsignnum: 'bconsignnum' // 发货单据数量
};

export { AREA, PAGECODE, DATASOURCECACHE, DEFCACHEKEY, BUTTONID, URL, FIELDS, UISTATE };
