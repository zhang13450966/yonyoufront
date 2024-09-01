/*
 * @Author: liujia9 
 * @PageInfo: 常量
 * @Date: 2019-01-10 16:56:37 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-05-10 15:48:56
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
	listPagecode: '400401010_list',
	cardPagecode: '400401010_card',
	templeteid: '400401010'
};

// 单页缓存
const DATASOURCECACHE = {
	dataSourceListCacheKey: 'pu.pu.orderoutcustom.data_source_list' // 列表缓存
};

// 自定义缓存
const DEFCACHEKEY = {
	queryCacheKey: 'queryCacheKey' // 查询条件缓存
};

// 按钮ID
const BUTTONID = {
	Print: 'Print', // 打印
	Refresh: 'Refresh', // 刷新

	Back: 'Back', // 返回
	OutCustom: 'OutCustom',
	UnOutCustom: 'UnOutCustom'
};

// URL
const URL = {
	list: '/list',
	card: '/card',
	search: '/nccloud/pu/orderoutcustom/query.do',
	pageQuery: '/nccloud/pu/orderoutcustom/pageQuery.do',
	cardQuery: '/nccloud/pu/orderoutcustom/cardQuery.do',
	print: '/nccloud/pu/orderoutcustom/print.do',
	custom: '/nccloud/pu/orderoutcustom/outCustom.do',
	unCustom: '/nccloud/pu/orderoutcustom/unOutCustom.do',
	bodyBeforeEvent: '/nccloud/pu/pub/puonwaybeforeedit.do' //运输状态公共编辑前
};

// 字段
const FIELDS = {
	pk_order: 'pk_order', // 采购订单
	vbillcode: 'vbillcode', // 订单编码
	dbilldate: 'dbilldate',
	nsendoutnum: 'nsendoutnum',
	bisoutcustom: 'bisoutcustom'
};

const PoTransTypeVO = {
	BOUTCUSTOMCODE: 'boutcustomcode' /** 出关单据号 */,
	BOUTCUSTOMDATE: 'boutcustomdate' /** 出关单据日期 */
};

export { AREA, PAGECODE, DATASOURCECACHE, DEFCACHEKEY, BUTTONID, URL, FIELDS, PoTransTypeVO };
