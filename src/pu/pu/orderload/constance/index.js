/*
 * @Author: CongKe 
 * @PageInfo: 装运-常量
 * @Date: 2019-04-17 09:41:49 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-19 11:11:02
 */
// URL
const URL = {
	list: '/list',
	card: '/card',
	load: '/nccloud/pu/orderload/load.do', //装运
	unload: '/nccloud/pu/orderload/unload.do', //反装运
	cardquery: '/nccloud/pu/orderload/cardquery.do', //卡片数据查询
	pageQuery: '/nccloud/pu/orderload/pagequery.do', //列表查询
	bodyBeforeEvent: '/nccloud/pu/pub/puonwaybeforeedit.do', //运输状态公共编辑前
	pageQueryByPks: '/nccloud/pu/orderload/pagequerybypks.do', //列表分页查询
	print: '/nccloud/pu/orderload/print.do' //打印
};

// 页面模板编码
const PAGECODE = {
	APPCODE: '400401006',
	LISTPAGECODE: '400401006_list', //列表编码
	CARDPAGECODE: '400401006_card', //卡片编码
	TEMPLATEID: 'templateid'
};

// 区域ID
const AREA = {
	searchId: 'search', // 列表查询区
	listTableId: 'head', // 列表表头区
	cardFormId: 'head', // 卡片表头区
	cardTableId: 'body', // 卡片表体区
	/** 按钮区域 */
	list_head: 'list_head', // 列表表头按钮区
	list_inner: 'list_inner', // 列表表体操作区
	card_head: 'head', // 卡片表头按钮区
	card_body: 'body', // 卡片 cardTableId
	card_shoulder: 'card_shoulder' // 卡片 cardTableId 表体肩部区域
};

const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse' //浏览
};

// 单页缓存
const DATASOURCECACHE = {
	dataSourceListCacheKey: 'pu.pu.orderload.data_source_list', // 列表缓存
	dataSourceCardCacheKey: 'pu.pu.orderload.data_source_card'
};

// 自定义缓存
const DEFCACHEKEY = {
	queryCacheKey: 'queryCacheKey' // 查询条件缓存
};

// 按钮ID
const BUTTONID = {
	Print: 'Print', // 打印
	Refresh: 'Refresh', // 刷新
	Load: 'Load', // 装运
	UNLoad: 'UNLoad', // 反装运
	Back: 'Back' // 返回
};

// 字段
const FIELDS = {
	pk_org: 'pk_org',
	pk_order: 'pk_order', // 采购订单
	vbillcode: 'vbillcode', // 订单编码
	dbilldate: 'dbilldate',
	bisload: 'bisload' //已装运
};

const PoTransTypeVO = {
	BLOADCODE: 'bloadcode' /** 装运单据号 */,
	BLOADDATE: 'bloaddate' /** 装运单据日期 */
};

export { AREA, PAGECODE, DATASOURCECACHE, DEFCACHEKEY, BUTTONID, URL, FIELDS, PoTransTypeVO, STATUS };
