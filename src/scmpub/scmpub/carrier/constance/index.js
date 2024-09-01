/*
 * @Author: zhaochyu 
 * @PageInfo: 承运商定义常量类
 * @Date: 2020-01-14 16:35:09 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-14 11:24:02
 */
/**
 * 请求地址
 */
const URL = {
	save: '/nccloud/scmpub/carrier/save.do',
	edit: '/nccloud/scmpub/carrier/edit.do',
	delete: '/nccloud/scmpub/carrier/delete.do',
	cardQuery: '/nccloud/scmpub/carrier/querycard.do',
	query: '/nccloud/scmpub/carrier/query.do',
	afterEdit: '/nccloud/scmpub/carrier/afterEdit.do',
	headafter: '/nccloud/scmpub/carrier/headafter.do',
	listuse: '/nccloud/scmpub/carrier/listuse.do',
	carduse: '/nccloud/scmpub/carrier/carduse.do',
	print: '/nccloud/scmpub/carrier/print.do',
	org_permissions: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter', //主组织权限
	gotoCard: '/card',
	gotoList: '/list'
};

const ROOT = '#app';
/**
 * 区域编码
 */
const AREA = {
	searchArea: 'searchArea',
	listTable: 'list_head',
	card_head: 'card_head',
	card_body: 'card_body',
	list_inner: 'list_inner',
	driver: 'driver',
	vehicle: 'vehicle',
	vehicletype: 'vehicletype'
};

/**
 * 页面状态
 */
const STATUS = {
	edit: 'edit',
	browse: 'browse',
	add: 'add'
};

const PAGEID = {
	listpagecodeorg: '400101612_list',
	listpagecodegroup: '400101616_list',
	cardpagecodeorg: '400101612_card',
	cardpagecodegroup: '400101616_card'
};

const CARRIERDATASOURCE = {
	carrierdatasource: 'carrierdatasource'
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
	cardStatus: 'cardStatus',
	cardId: 'id',
	ccarrierid: 'ccarrierid',
	list: 'list',
	card: 'card',
	cardPaginationBtn: 'cardPaginationBtn',
	org: 'pk_org_v',
	orgName: 'orgName',
	pk_org: 'pk_org',
	showOff: 'showOff'
};
const HEADFILED = {
	pk_org_v: 'pk_org_v',
	pk_org: 'pk_org',
	pk_group: 'pk_group',
	csupplierid: 'csupplierid',
	csendtypeid: 'csendtypeid',
	ccarrierid: 'ccarrierid',
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
const VOFIELD = [
	'bsealflag',
	'ccarrierid',
	'cdeptid',
	'cdeptid_v',
	'cpsndocid',
	'cvehicleid',
	'vcarriercode',
	'vidcard',
	'vmobile',
	'cvehicletypeid',
	'fsexflag',
	'fstatusflag',
	'ndriveage',
	'vdrivelicence',
	'vcarriername',
	'vnote'
];
export {
	URL,
	STATUS,
	AREA,
	ROOT,
	PAGEID,
	APPID,
	CARRIERDATASOURCE,
	BUTTONAREA,
	EDITBUTTONS,
	ALLBUTTONS,
	BROWSEBUTTONS,
	FILED,
	VOFIELD,
	HEADFILED
};
