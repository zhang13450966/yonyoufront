/*
 * @Author: zhangbfk 
 * @PageInfo: 常量  
 * @Date: 2018-04-24 14:48:48 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-11 14:35:03
 */

// 区域ID
const AREA = {
	searchArea: 'search',
	tableArea: 'head',
	searchArea: 'search',
	modalArea: 'modal'
};
//页面模板编码
const PAGECODE = '400401402_list';

//小应用编码
const APPID = '0001Z810000000033CMB';

//页面字段
const FIELD = {
	pk_org: 'pk_org', //成本域
	pk_group: 'pk_group', //集团
	ts: 'ts', //Ts
	pk_book: 'pk_book', //账簿
	cinvclassid: 'cinvclassid', //物料分类主键
	cinventoryid: 'cinventoryid', //物料oid
	cinventoryvid: 'cinventoryvid', //物料版本主键
	ndifferencemny: 'ndifferencemny', //差异率
	cbeginvariancesid: 'cbeginvariancesid',
	crowno: 'crowno'
};
//界面状态
const UISTATE = {
	edit: 'edit',
	browse: 'browse'
};
//按钮ID
const BUTTONID = {
	OCRScan: 'OCRScan',
	OCRCheck: 'OCRCheck',
	Delete: 'Delete',
	Import: 'Import',
	CreateInvoice: 'CreateInvoice',
	ImageShow: 'ImageShow'
};

//后台请求URL地址
const URL = {
	save: '/nccloud/ia/beginvariance/save.do',
	delete: '/nccloud/ia/beginvariance/delete.do',
	orgchange: '/nccloud/ia/beginvariance/orgchange.do',
	print: '/nccloud/ia/beginvariance/print.do',
	import: '/nccloud/ia/beginvariance/import.do',
	conditionQuery: '/nccloud/ia/beginvariance/conditionquery.do'
};

const BUTTONSTATE = {
	INIT: 'init', //初始化状态
	HASORG: 'hasOrg', //存在组织状态
	HASNODATA: 'hasNoData', // 界面没有数据状态
	SEARCH_SUCCESS: 'search_success', //查询成功状态
	SEARCH_SUCCESS_ISBEGINACCOUNT: 'search_success_isBeginAccount', //查询成功是否期初记账状态
	SAVE_SUCCESS: 'save_success', //保存成功状态
	DELETE_SUCCESS: 'delete_success', //删除成功状态
	CANCEL_SUCCESS: 'cancel_success', //取消成功状态
	EDIT_SUCCESS: 'edit_success', //修改成功状态
	HASSELECTEDATA: 'hasSelectData' //存在选择数据状态
};

export { AREA, PAGECODE, FIELD, UISTATE, BUTTONID, URL, APPID, BUTTONSTATE };
