/*
 * 常量
 * @Author: guozhq 
 * @Date: 2019-04-06 15:22:56 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-07-15 18:15:13
 */
const PAGECODE = {
	CARD: '400401002_card',
	LIST: '400401002_list'
};

const AREA = {
	LIST_HEAD: 'head',
	LIST_SEARCH: 'search',
	CARD_FORM: 'head',
	CARD_TABLE: 'body',
	CARD_CARD: 'card'
};

const BUTTON_AREA = {
	LIST_HEAD: 'list_head',
	CARD_HEAD: 'card_head',
	CARD_BODY: 'card_body'
};

const FIELD = {
	QRYINFO: 'qryInfo', //查询条件
	CONFIRM: 'confirm', //已确认
	PK_ORDER: 'pk_order',
	PK_ORG: 'pk_org',
	PK_SRCMATERIAL: 'pk_order_b.pk_srcmaterial',
	CTRANTYPEID: 'ctrantypeid',
	PK_DEPT: 'pk_dept',
	CEMPLOYEEID: 'cemployeeid',
	PK_SUPPLIER: 'pk_supplier',
	PK_SUPPLIER_V: 'pk_supplier_v',
	PURCHASEORG: 'pu', // 采购 业务场景
	VBILLCODE: 'vbillcode', //订单编号
	DBILLDATE: 'dbilldate', //订单日期
	NCONFIRMNUM: 'nconfirmnum' //确认数量
};

// 表头自定义项
const HEAD_VDEF = [
	'vdef1',
	'vdef2',
	'vdef3',
	'vdef4',
	'vdef5',
	'vdef6',
	'vdef7',
	'vdef8',
	'vdef9',
	'vdef10',
	'vdef11',
	'vdef12',
	'vdef13',
	'vdef14',
	'vdef15',
	'vdef16',
	'vdef17',
	'vdef18',
	'vdef19',
	'vdef20'
];

// 表体自定义项
const BODY_VBDEF = [
	'vbdef1',
	'vbdef2',
	'vbdef3',
	'vbdef4',
	'vbdef5',
	'vbdef6',
	'vbdef7',
	'vbdef8',
	'vbdef9',
	'vbdef10',
	'vbdef11',
	'vbdef12',
	'vbdef13',
	'vbdef14',
	'vbdef15',
	'vbdef16',
	'vbdef17',
	'vbdef18',
	'vbdef19',
	'vbdef20'
];

const BUTTON_ID = {
	Refresh: 'Refresh',
	Confirm: 'Confirm',
	UnConfirm: 'UnConfirm',
	BACK: 'Back',
	Print: 'Print'
};

const UISTATE = {
	edit: 'edit',
	browse: 'browse'
};

const URL = {
	CARD: '/card',
	LIST: '/list',
	SEARCH: '/nccloud/pu/orderconfirm/search.do',
	PAGEQUERY: '/nccloud/pu/orderconfirm/pagequery.do',
	CARDQUERY: '/nccloud/pu/orderconfirm/cardquery.do',
	TRANSTYPEQUERY: '/nccloud/pu/orderconfirm/transtypequery.do',
	CONFIRM: '/nccloud/pu/orderconfirm/confirm.do', //确认
	UNCONFIRM: '/nccloud/pu/orderconfirm/unconfirm.do', //反确认
	PRINT: '/nccloud/pu/orderconfirm/print.do', //打印

	bodyBeforeEvent: '/nccloud/pu/pub/puonwaybeforeedit.do' //编辑前
};
const DATASOURCE = {
	LIST: 'SCM.PU.ORDERCONFIRM.DATASOURCE'
};
const DATASOURCECACHE = {
	dataSourceListCacheKey: 'pu.pu.orderconfirm.data_source_list', // 列表缓存
	dataSourceCardCacheKey: 'pu.pu.orderconfirm.data_source_card'
};

export {
	PAGECODE,
	FIELD,
	UISTATE,
	AREA,
	BUTTON_AREA,
	BUTTON_ID,
	URL,
	DATASOURCE,
	HEAD_VDEF,
	BODY_VBDEF,
	DATASOURCECACHE
};
