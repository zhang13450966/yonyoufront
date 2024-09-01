/*
 * @Author: lichao 
 * @PageInfo:  常量 
 * @Date: 2019-02-25 16:24:55 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-22 09:30:04
 */

const URL = {
	query: '/nccloud/scmpub/cenpurule/query.do', //列表查询
	queryByPks: '/nccloud/scmpub/cenpurule/queryByPks.do', //卡片查询
	delete: '/nccloud/scmpub/cenpurule/delete.do', //删除
	save: '/nccloud/scmpub/cenpurule/save.do', //卡片新增
	update: '/nccloud/scmpub/cenpurule/update.do', //卡片修改
	print: '/nccloud/scmpub/cenpurule/print.do', //打印
	batchDelete: '/nccloud/scmpub/cenpurule/batchDelete.do' //列表批量删除
};
//小应用编码
const FUNCODE = '400100008';
//页面编码
const PAGECODE = '400100008_list';

const AREACODE = {
	search: 'search', //查询区
	listHead: 'head', //表头区
	listBody: 'body' //表体区
};
const BUTTONAREACODE = {
	head: 'head',
	headInner: 'head_inner',
	body: 'body',
	bodyInner: 'body_inner'
};
const BUTTONS = {
	Add: 'Add', //新增
	Delete: 'Delete',
	Print: 'Print',
	Output: 'Output',
	Edit: 'Edit',
	Refresh: 'Refresh',
	HeadDelLine: 'HeadDelLine',
	BodyDelLine: 'BodyDelLine',
	BodyDelLine1: 'BodyDelLine1',
	Copy: 'Copy',
	Save: 'Save',
	Cancel: 'Cancel',
	AddLine: 'AddLine',
	AddLine1: 'AddLine1'
};
/** 编辑态按钮*/
const EDITBUTTONS = [ 'Save', 'Cancel', 'AddLine', 'DelLine', 'AddLine1', 'BodyDelLine' ];
/** 浏览态按钮*/
const BROWSEBUTTONS = [ 'Add', 'Edit', 'Delete', 'Copy', 'Print', 'Refresh', 'Output' ];

/** 
 * 浏览状态
*/
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse', //浏览
	copy: 'copy', //复制
	add: 'add', //新增
	reFresh: 'reFresh' //刷新
};

const FIELD = {
	pk_group: 'pk_group',
	pk_cenpurule: 'pk_cenpurule',
	pk_cenpurule_b: 'pk_cenpurule_b',
	pk_marpuclass: 'pk_marpuclass', //物料采购分类
	pk_marpuclass_name: 'pk_marpuclass.name', //物料采购分类名称
	pk_org_name: 'pk_org.name', //控制采购组织名称
	ctrantypeid: 'ctrantypeid', //合同类型
	fctrltype: 'fctrltype', //控制类型
	pk_ctrlorg: 'pk_ctrlorg', //受控组织
	pk_ctrlorg_name: 'pk_ctrlorg.name', //受控组织
	ts: 'ts'
};
export { URL, PAGECODE, FIELD, BUTTONS, STATUS, AREACODE, BUTTONAREACODE, EDITBUTTONS, BROWSEBUTTONS, FUNCODE };
