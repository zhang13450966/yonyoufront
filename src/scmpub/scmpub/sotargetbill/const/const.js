/*
 * @Author: gaoxiaoqiang 
 * @PageInfo: 价格调整单常量 
 * @Date: 2019-04-18 10:25:15 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-27 01:10:46
 */
const TARGETBILL_CONST = {
	TargetBillCacheKey: 'TargetBillCacheKey',
	id: 'id',
	status: 'status',
	succecc: 'success',
	formId: 'head', //表头区域
	tableId: 'targetbill_b', //表体区域
	cardPageId: '400102402_card', //卡片pagecode
	moduleId: '4030', //模块id
	browse: 'browse', //状态
	edit: 'edit',
	copy: 'copy',
	dataSource: 'scm.scmpub.sotargetbill.main',
	Card_URL: '/card',
	editUrl: '/nccloud/scmpub/targetbill/edit.do',
	saveUrl: '/nccloud/scmpub/targetbill/save.do',
	importexcelUrl: '/nccloud/scmpub/targetbill/importexcel.do',
	exportexcelUrl: '/nccloud/scmpub/targetbill/exportexcel.do',
	headafter: '/nccloud/scmpub/targetbill/headafter.do',
	headafterquery: '/nccloud/scmpub/targetbill/headafterquery.do',
	bodyafter: '/nccloud/scmpub/targetbill/bodyafter.do'
};

const FIELD = {
	pk_targetbill: 'pk_targetbill', //指标维护表头主键
	pk_targetbill_b: 'pk_targetbill_b',
	pk_org: 'pk_org', //组织
	ctargetid: 'ctargetid', //销售指标
	vperiod: 'vperiod', //期间
	cmardimenid: 'cmardimenid', //物料
	ccustomerid: 'ccustomerid', //客户
	oldDbbillKey: 'oldDbbill' //存储刚查询出来的时候的值
};

//按钮字段
const BUTTONS = {
	EDIT: 'Edit',
	IMPORTEXCEL: 'ImportExcel',
	EXPORTEXCEL: 'ExportExcel',
	DELETELINE: 'DeleteLine',
	INSERTLINE: 'InsertLine',
	ADDLINE: 'AddLine',
	CANCEL: 'Cancel',
	File: 'File',
	SAVE: 'Save'
};
// 卡片浏览态，肩部显示的按钮
const CARD_BODY_BROWSE_BUTTONS = [];
// 卡片编辑态，肩部显示的按钮
const CARD_BODY_EDIT_BUTTONS = [ BUTTONS.ADDLINE, BUTTONS.DELETELINE, BUTTONS.INSERTLINE ];
const CARD_BODY_ALL_BUTTONS = [ BUTTONS.ADDLINE, BUTTONS.DELETELINE, BUTTONS.INSERTLINE ];
// 卡片编辑态，表体没数据时可用的按钮
const CARD_BODY_NOROW_BUTTONS = [ BUTTONS.ADDLINE ];
// 卡片编辑态，表体有数据没选中时可用的按钮
const CARD_BODY_NOSELECT_BUTTONS = [ BUTTONS.ADDLINE ];
//卡片列表按钮
const CARD_BODY_BUTTONS = {
	EDIT: CARD_BODY_EDIT_BUTTONS,
	BROWSE: CARD_BODY_BROWSE_BUTTONS,
	ALL: CARD_BODY_ALL_BUTTONS,
	NOROW: CARD_BODY_NOROW_BUTTONS,
	NOSELECT: CARD_BODY_NOSELECT_BUTTONS
};
//卡片头部按钮
const CARD_HEAD_BUTTONS = {
	ALL: [ BUTTONS.EDIT, BUTTONS.File, BUTTONS.IMPORTEXCEL, BUTTONS.EXPORTEXCEL, BUTTONS.SAVE, BUTTONS.CANCEL ],
	EDIT: [ BUTTONS.SAVE, BUTTONS.CANCEL ], //修改
	BROWSE: [ BUTTONS.EDIT, BUTTONS.File, BUTTONS.IMPORTEXCEL, BUTTONS.EXPORTEXCEL ]
};

// 卡片浏览态，操作列显示的按钮
const CARD_BODY_INNER_BROWSE_BUTTONS = [];

// 卡片编辑态，操作列显示的按钮
const CARD_BODY_INNER_EDIT_BUTTONS = [ BUTTONS.DELETELINE, BUTTONS.INSERTLINE ];
const CARD_BODY_INNER_BUTTONS = {
	EDIT: CARD_BODY_INNER_EDIT_BUTTONS,
	BROWSE: CARD_BODY_INNER_BROWSE_BUTTONS
};
// 按钮区域常亮
const BUTTON_AREA = {
	Card_Head: 'card_head',
	Card_Body: 'card_body',
	Card_Body_Inner: 'card_body_inner'
};
export { BUTTONS, TARGETBILL_CONST, CARD_HEAD_BUTTONS, CARD_BODY_BUTTONS, CARD_BODY_INNER_BUTTONS, BUTTON_AREA, FIELD };
