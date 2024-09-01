/*
 * @Author: zhaochyu 
 * @PageInfo: 车辆定义常量类
 * @Date: 2020-01-14 16:35:09 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-01 12:17:00
 */
/**
 * 请求地址
 */
const URL = {
	save: '/nccloud/scmpub/vehicle/save.do',
	edit: '/nccloud/scmpub/vehicle/edit.do',
	delete: '/nccloud/scmpub/vehicle/delete.do',
	query: '/nccloud/scmpub/vehicle/query.do',
	after: '/nccloud/scmpub/vehicle/after.do',
	orgChange: '/nccloud/scmpub/vehicle/orgChange.do',
	startuse: '/nccloud/scmpub/vehicle/startuse.do',
	stopuse: '/nccloud/scmpub/vehicle/stopuse.do',
	print: '/nccloud/scmpub/vehicle/print.do',
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
	pagecodeorg: '400101628_list',
	pagecodegroup: '400101632_list'
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
	ts: 'ts',
	org_id: 'org_id',
	cvehicletypeid: 'cvehicletypeid'
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
