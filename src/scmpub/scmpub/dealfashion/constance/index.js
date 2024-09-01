/*
 * @Author: lichao 
 * @PageInfo:  常量 
 * @Date: 2019-02-25 16:24:55 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-11-24 15:22:35
 */

const URL = {
	query: '/nccloud/scmpub/dealfashion/query.do', //列表查询
	queryByPks: '/nccloud/scmpub/dealfashion/queryByPks.do', //卡片查询
	delete: '/nccloud/scmpub/dealfashion/delete.do', //删除
	save: '/nccloud/scmpub/dealfashion/save.do', //卡片新增
	update: '/nccloud/scmpub/dealfashion/update.do', //卡片修改
	print: '/nccloud/scmpub/dealfashion/print.do', //打印
	batchDelete: '/nccloud/scmpub/dealfashion/batchDelete.do', //列表批量删除
	edit: '/nccloud/scmpub/dealfashion/edit.do' //修改
};
//小应用编码
const FUNCODE = '400101002';
//页面编码
const PAGECODE = '400101002_list';

const AREACODE = 'table';

const BUTTONAREACODE = {
	listInner: 'list_inner',
	listHead: 'list_head'
};
const BUTTONS = {
	Add: 'Add', //新增
	Delete: 'Delete',
	Print: 'Print',
	Output: 'Output',
	Edit: 'Edit',
	Refresh: 'Refresh',
	Save: 'Save',
	Cancel: 'Cancel'
};
/** 编辑态按钮*/
const EDITBUTTONS = [ 'Save', 'Cancel' ];
/** 浏览态按钮*/
const BROWSEBUTTONS = [ 'Edit', 'Print', 'Refresh' ];

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
	pk_dealfashion: 'pk_dealfashion',
	pk_group: 'pk_group',
	cdealfashcode: 'cdealfashcode ',
	cdealfashname: 'cdealfashname',
	vmemo: 'vmemo',
	ts: 'ts'
};
export { URL, PAGECODE, FIELD, BUTTONS, STATUS, AREACODE, BUTTONAREACODE, EDITBUTTONS, BROWSEBUTTONS, FUNCODE };
