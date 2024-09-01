/*
 * @Author: 刘奇 
 * @PageInfo: 常量类
 * @Date: 2018-05-09 20:56:50
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-01-09 09:52:36
 */
// 区域ID
const AREA = {
	pageArea: '400100802_list',
	tableArea: 'batchcode',
	searchArea: 'batchcodeSearch',
	oid: '1001Z8100000000006Y1',
	printArea: '40010815',
	dataSource: 'scm.scmpub.batchcode.main'
};
//页面状态
const STATUS = {
	browse: 'browse',
	edit: 'edit'
};

//按钮名称以及区域
const BUTTON = {
	list_head: 'list_head', //列表表头区域
	list_inner: 'list_inner', //列表行操作区域
	add: 'Add', //新增
	delete: 'Delete', //删除
	edit: 'Edit', //修改
	save: 'Save', //保存
	cancel: 'Cancel', //取消
	deleteLine: 'Delete', //删行
	addLine: 'AddLine', //增行
	refresh: 'Refresh', //刷新
	print: 'Print', //打印
	output: 'Output', //输出
	startUse: 'StartUse', //启用
	stopUse: 'StopUse' //停用
};
//后台请求URL地址
const URL = {
	query: '/nccloud/scmpub/batchcode/query.do',
	toggle: '/nccloud/scmpub/batchcode/toggle.do',
	save: '/nccloud/scmpub/batchcode/save.do',
	print: '/nccloud/scmpub/batchcode/print.do'
};
const FIELD = {
	cmaterialvid: 'cmaterialvid', //物料
	vbatchcode: 'vbatchcode', //批次号
	pk_batchcode: 'pk_batchcode', //主键
	//查询区
	queryInfo: 'batchcodeQueryInfo', //缓存-查询条件对应的key
	search_vbatchcode: 'vbatchcode',
	cmaterialoid: 'cmaterialoid',
	bseal: 'bseal'
};
export { AREA, STATUS, URL, BUTTON, FIELD };
