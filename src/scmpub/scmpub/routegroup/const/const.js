/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-集团-常量设置  
 * @Date: 2020-01-17 09:44:38 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 13:11:53
 */
const APPINFO = {
	appCode: '400101608',
	pageCode: '400101608_list'
};

const VIEWINFO = {
	ADD_STATUS: 'add',
	BROWSER_STATUS: 'browse',
	EDIT_STATUS: 'edit'
};

const QUERYAREAINFO = {
	areaCode: '400101608_query'
};

const BUTTONINFO = {
	headAreaCode: 'list_head',
	innerAreaCode: 'list_inner',
	addBtnCode: 'Add',
	delBtnCode: 'Delete',
	printBtnCode: 'Print',
	editBtnCode: 'Edit',
	outputBtnCode: 'Output',
	refreshBtnCode: 'Refresh',
	copyBtnCode: 'Copy',
	innerDelBtnCode: 'InnerDel',
	pageinfoBtnCode: 'PageInfo',
	doubleClickBtnCode: 'doubleClick',
	showOffBtnCode: 'showOffBtn',
	StopUse: 'StopUse',
	StartUse: 'StartUse'
};

const CARDBUTTONINFO = {
	headAreaCode: 'card_head',
	cardAreaCode: 'card_body',
	innerAreaCode: 'card_inner',
	addBtnCode: 'Add',
	delBtnCode: 'Delete',
	printBtnCode: 'Print',
	editBtnCode: 'Edit',
	outputBtnCode: 'Output',
	refreshBtnCode: 'Refresh',
	copyBtnCode: 'Copy',
	innerAddLineBtnCode: 'AddLine',
	delLineBtnCode: 'DelLineBtn',
	innerInsLineBtnCode: 'InsLine',
	innerDelLineBtnCode: 'DelLine',
	saveBtnCode: 'Save',
	cancelBtnCode: 'Cancel',
	backBtnCode: 'Back',
	enableBtnCode: 'StartUse',
	disableBtnCode: 'StopUse',
	StartUse: 'StartUse',
	StopUse: 'StopUse'
};

const TEMPLATEINFO = {
	templateCode: '400101604_list',
	listAreaCode: 'head',
	outputType: 'output',
	pritnType: 'print',
	nodeKey: 'routegroupprint',
	cacheKey: 'route_group_CacheKey'
};

const CARDTEMPLATEINFO = {
	templateCode: '400101608_card',
	headAreaCode: 'head',
	bodyAreaCode: 'address'
};

const REQUESTURL = {
	saveRouteUrl: '/nccloud/scmpub/route/save.do',
	delRouteUrl: '/nccloud/scmpub/route/delete.do',
	printRouteUrl: '/nccloud/scmpub/route/print.do',
	listRouteUrl: '/nccloud/scmpub/route/list.do',
	loadRouteUrl: '/nccloud/scmpub/route/card.do',
	queryRouteUrl: '/nccloud/scmpub/route/query.do',
	enableChangeRouteUrl: '/nccloud/scmpub/route/enablechange.do',
	headAfterEditUrl: '/nccloud/scmpub/route/headAfterEdit.do'
};

const REFERFIELD = {
	pk_org_v: 'pk_org_v', //
	cvehicleid: 'cvehicleid', //默认车辆
	ctrantypeid: 'ctrantypeid', //运输方式
	ccarrierid: 'ccarrierid', //承运商
	crouteid: 'crouteid' //路线主键
};

const ROUTEURL = {
	Card_URL: '/card',
	List_URL: '/list'
};

const ROUTEVOINFO = {
	crouteid: 'crouteid',
	space: 'space',
	nmileage: 'nmileage',
	caddrdocid: 'caddrdocid',
	bsealflag: 'bsealflag',
	vroutedescribe: 'vroutedescribe',
	pk_org: 'pk_org',
	cvehicleid: 'cvehicleid',
	ccarrierid: 'ccarrierid',
	ctrantypeid: 'ctrantypeid',
	queryCaddrdocid: 'bodyfk.caddrdocid',
	vroutecode: 'vroutecode',
	vroutename: 'vroutename'
};

export {
	APPINFO,
	QUERYAREAINFO,
	BUTTONINFO,
	TEMPLATEINFO,
	REQUESTURL,
	VIEWINFO,
	REFERFIELD,
	ROUTEURL,
	ROUTEVOINFO,
	CARDTEMPLATEINFO,
	CARDBUTTONINFO
};
