/*
 * @Author: jiangfw 
 * @PageInfo: 输出常量类
 * @Date: 2019-03-13 15:59:47 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-07-15 18:12:26
 */
const COMMON = {
	PURCHASEORG: 'pu', //业务人员来源
	OrderOutputCache: 'OrderOutputCache' //缓存
};

// 应用编码
const APPCODE = {
	appcode: '400401000' //列表页面编码
};

// 页面编码
const PAGECODE = {
	list: '400401000_list' //列表页面编码
};

// 单据类型
const BILLTYPE = {
	poorder: '21' //采购订单
};

// 区域
const AREA = {
	list_query: 'list_query', //查询
	head: 'head', //表头
	body: 'body' //表体
};

//按钮
const BUTTON = {
	OutPut: 'OutPut', //输出
	UnOutPut: 'UnOutPut', //反输出
	Refresh: 'Refresh' //刷新
};

//页面状态
const STATUS = {
	browse: 'browse'
};

//请求URL地址
const URL = {
	query: '/nccloud/pu/orderoutput/query.do', //查询
	qryOrderByScheme: '/nccloud/pu/orderoutput/qryOrderByScheme.do', //查询表头
	qryOrderByPks: '/nccloud/pu/orderoutput/qryOrderByPks.do', //查询分页数据
	qryOrderItem: '/nccloud/pu/orderoutput/qryOrderItem.do', //查询表体
	output: '/nccloud/pu/orderoutput/output.do', //输出
	unoutput: '/nccloud/pu/orderoutput/unoutput.do' //反输出
};

// 字段
const FIELD = {
	output: 'output', //已输出
	pk_order: 'pk_order', //采购订单主键
	pk_order_b: 'pk_order_b', //采购订单明细主键
	pk_org: 'pk_org', //采购组织
	ctrantypeid: 'ctrantypeid', //订单类型
	pk_supplier: 'pk_supplier', //供应商
	pk_supplier_v: 'pk_supplier_v', //供应商
	cemployeeid: 'cemployeeid', //采购员
	pk_dept: 'pk_dept', //采购部门
	pk_srcmaterial: 'pk_order_b.pk_srcmaterial', //物料最新版本
	pk_marbasclass: 'pk_order_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
	ts: 'ts'
};

// 单页缓存
const DATASOURCECACHE = {
	dataSourceListCacheKey: 'pu.pu.orderoutput.data_source_list' // 列表缓存
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

export {
	COMMON,
	APPCODE,
	PAGECODE,
	BILLTYPE,
	AREA,
	BUTTON,
	STATUS,
	URL,
	FIELD,
	HEAD_VDEF,
	BODY_VBDEF,
	DATASOURCECACHE
};
