/*
 * @Author: 王勇 
 * @PageInfo: 运输路线定义-物流组织-常量设置  
 * @Date: 2020-01-17 09:44:38 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 13:10:45
 */
const APPINFO = {
	appCode: '400101604',
	pageCode: '400101604_list'
};

const VIEWINFO = {
	ADD_STATUS: 'add',
	BROWSER_STATUS: 'browse',
	EDIT_STATUS: 'edit'
};

const QUERYAREAINFO = {
	areaCode: '400101604_query'
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
	pageinfoBtnCode: 'PageInfo',
	doubleClickBtnCode: 'doubleClick',
	showOffBtnCode: 'showOffBtn',
	OrgChangeBtnCode: 'orgChangeBtn',
	MoreBtnCode: 'More',
	StartUse: 'StartUse',
	StopUse: 'StopUse'
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
	StartUse: 'StartUse',
	StopUse: 'StopUse'
};

const TEMPLATEINFO = {
	templateCode: '400101604_list',
	listAreaCode: 'head',
	outputType: 'output',
	pritnType: 'print',
	nodeKey: 'routeorgprint',
	cacheKey: 'route_org_CacheKey'
};

const CARDTEMPLATEINFO = {
	templateCode: '400101604_card',
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
	pk_org_v: 'pk_org_v.pk_trafficorg', //
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
	crouteid: 'crouteid', //路线主键
	space: 'space', //间距
	nmileage: 'nmileage', //里程(公里)
	caddrdocid: 'caddrdocid', //地点编码
	bsealflag: 'bsealflag', //封存
	pk_group: 'pk_group',
	pk_org: 'pk_org',
	pk_org_v: 'pk_org_v',
	pk_org_v_pk_trafficorg: 'pk_org_v.pk_trafficorg',
	vroutecode: 'vroutecode', //路线编码
	vroutename: 'vroutename', //路线名称
	cvehicleid: 'cvehicleid', //默认车辆
	ccarrierid: 'ccarrierid', //默认承运商
	ctrantypeid: 'ctrantypeid', //默认运输方式
	vroutedescribe: 'vroutedescribe', //路线描述
	queryCaddrdocid: 'bodyfk.caddrdocid'
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
