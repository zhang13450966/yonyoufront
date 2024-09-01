/*
 * @Author: zhaochyu 
 * @PageInfo: 司机定义常量类
 * @Date: 2020-01-14 16:35:09 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-01 12:16:45
 */
/**
 * 请求地址
 */
const URL = {
	add: '/nccloud/scmpub/driver/add.do',
	save: '/nccloud/scmpub/driver/save.do',
	edit: '/nccloud/scmpub/driver/edit.do',
	delete: '/nccloud/scmpub/driver/delete.do',
	query: '/nccloud/scmpub/driver/query.do',
	afterEdit: '/nccloud/scmpub/driver/after.do',
	orgChange: '/nccloud/scmpub/driver/orgChange.do',
	startuse: '/nccloud/scmpub/driver/startuse.do',
	stopuse: '/nccloud/scmpub/driver/stopuse.do',
	print: '/nccloud/scmpub/driver/print.do'
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
	pagecodeorg: '400101636_list',
	pagecodegroup: '400101640_list'
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
	cvehicleid: 'cvehicleid',
	cvehicletypeid: 'cvehicletypeid',
	cpsndocid: 'cpsndocid',
	cdeptid_v: 'cdeptid_v'
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
const VOFIELD = [
	'bsealflag',
	'ccarrierid',
	'cdeptid',
	'cdeptid_v',
	'cpsndocid',
	'cvehicleid',
	'vdrivercode',
	'vidcard',
	'vmobile',
	'cvehicletypeid',
	'fsexflag',
	'fstatusflag',
	'ndriveage',
	'vdrivelicence',
	'vdrivername',
	'vnote'
];
export {
	URL,
	STATUS,
	AREA,
	ROOT,
	PAGEID,
	APPID,
	COMMON,
	BUTTONAREA,
	EDITBUTTONS,
	ALLBUTTONS,
	BROWSEBUTTONS,
	FILED,
	VOFIELD
};
