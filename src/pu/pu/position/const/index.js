/*
 * @Author: yechd5
 * @PageInfo: 计划员物料设置常量JS
 * @Date: 2018-04-12 09:45:20
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-14 14:12:10
 */
const POSITION_CONST = {
	BROWSER_STATUS: 'browse',
	EDIT_STATUS: 'edit',
	BTNAREA: 'list_head', // 表头按钮区
	UPOPR_BTNAREA: 'list_head_inner', // 行按钮区
	DOWNBTNAREA: 'list_body',
	DOWNOPR_BTNAREA: 'list_body_inner',
	PAGECODE: '400100004_list',
	UPTABLEID: 'head',
	DOWNTABLEID: 'body'
};

const URL = {
	QUERY: '/nccloud/pu/position/queryByPkOrg.do',
	QUERYBYID: '/nccloud/pu/position/queryByPk.do',
	SAVE: '/nccloud/pu/position/save.do',
	DELETE: '/nccloud/pu/position/delete.do',
	BODYAFTER: '/nccloud/pu/position/bodyafter.do'
};

//按钮
const BUTTONS = {
	Add: 'Add', //新增
	Edit: 'Edit', //修改
	Delete: 'Delete', //删除
	Save: 'Save', //保存
	Cancel: 'Cancel', //取消
	Refresh: 'Refresh', //刷新
	AddLine: 'AddLine',
	InsertLine: 'InsertLine',
	DeleteLine: 'DeleteLine'
};

export const ALL_BUTTONS = [
	BUTTONS.Add,
	BUTTONS.Refresh,
	BUTTONS.Delete,
	BUTTONS.Save,
	BUTTONS.Cancel,
	BUTTONS.AddLine,
	BUTTONS.DeleteLine
];

export const HEAD_EDIT_BUTTONS = [BUTTONS.Save, BUTTONS.Cancel];

export const HEAD_BROWSE_BUTTONS = [BUTTONS.Add, BUTTONS.Delete, BUTTONS.Refresh];

export const HEAD_OPR_EDTI_BUTTONS = [];

export const HEAD_OPR_BROWSE_BUTTONS = [BUTTONS.Edit, BUTTONS.Delete];

export const BODY_EDIT_BUTTONS = [BUTTONS.AddLine, BUTTONS.DeleteLine];
export const BODY_COPY_BUTTONS = [];

export const BODY_BROWSE_BUTTONS = [];

export const BODY_OPR_EDIT_BUTTONS = [BUTTONS.DeleteLine, BUTTONS.InsertLine];

export const BODY_OPR_COPY_BUTTONS = [];

export const BODY_OPR_BROWSE_BUTTONS = [];

export { POSITION_CONST, URL, BUTTONS };
