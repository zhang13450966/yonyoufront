/*
 * @Author: zhaochyu 
 * @PageInfo: 车型定义常量类
 * @Date: 2020-01-14 16:35:09 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-01 12:17:06
 */
/**
 * 请求地址
 */
const URL = {
	save: '/nccloud/scmpub/vehicletype/save.do',
	edit: '/nccloud/scmpub/vehicletype/edit.do',
	delete: '/nccloud/scmpub/vehicletype/delete.do',
	query: '/nccloud/scmpub/vehicletype/query.do',
	afterEdit: '/nccloud/scmpub/vehicletype/afterEdit.do',
	orgChange: '/nccloud/scmpub/vehicletype/orgChange.do',
	startuse: '/nccloud/scmpub/vehicletype/startuse.do',
	stopuse: '/nccloud/scmpub/vehicletype/stopuse.do',
	print: '/nccloud/scmpub/vehicletype/print.do',
	uidata: '/nccloud/scmpub/vehicle/uidata.do'
};

const ROOT = '#app';
/**
 * 区域编码
 */
const AREA = {
	listTable: 'listhead',
	list_inner: 'list_inner'
};

/**
 * 页面状态
 */
const STATUS = {
	edit: 'edit',
	browse: 'browse'
};

const PAGEID = {
	pagecodeorg: '400101620_list',
	pagecodegroup: '400101624_list'
};

const COMMON = {
	oid: '1001Z81000000000AJRY'
};

const BUTTONAREA = {
	listhead: 'list_head',
	listinner: 'list_inner'
};
const FILED = {
	Add: 'Add',
	Edit: 'Edit',
	StartUse: 'StartUse',
	StopUse: 'StopUse',
	Delete: 'Delete',
	Save: 'Save',
	Cancel: 'Cancel',
	Print: 'Print',
	Output: 'Output',
	Refresh: 'Refresh',
	PrintPop: 'PrintPop',
	type: 'type',
	bsealflag: 'bsealflag',
	ts: 'ts'
};
const ALLBUTTONS = [
	'Add',
	'Edit',
	'StartUse',
	'StopUse',
	'Delete',
	'Save',
	'Cancel',
	'Print',
	'Output',
	'Refresh',
	'PrintPop'
];
const BROWSEBUTTONS = [
	'Add',
	'Edit',
	'Delete',
	'StartUse',
	'StopUse',
	'Assign',
	'ExportImport',
	'Refresh',
	'PrintPop',
	'Print',
	'Output'
];
const EDITBUTTONS = [ 'Add', 'Save', 'Delete', 'Cancel' ];
const APPID = '0001Z810000000030YVU';
export { URL, STATUS, AREA, ROOT, PAGEID, APPID, COMMON, BUTTONAREA, EDITBUTTONS, ALLBUTTONS, BROWSEBUTTONS, FILED };
