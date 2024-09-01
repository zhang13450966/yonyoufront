/*
 * @Author: yechd5
 * @PageInfo: 物料订单类型常量JS
 * @Date: 2018-04-12 09:45:20 
 * @Last Modified by: zhangjyp
 * @Last Modified time: 2018-10-22 15:57:53
 */

const MARTRANTYPE_CONST = {
	BROWSE: 'browse',
	EDIT: 'edit',
	QUERYURL: '/nccloud/scmpub/martrantype/query.do',// 查询url
	SAVEURL: '/nccloud/scmpub/martrantype/save.do',// 保存url
	PRINTURL: '/nccloud/scmpub/martrantype/print.do', // 打印url
	SAVECHECKURL: '/nccloud/scmpub/martrantype/check.do', // 保存校验url
	LIST_HEAD: 'list_head',// 头部按钮区
	LIST_INNER: 'list_inner',// 行上按钮区
	TABLEID: 'ordertranstype',// 列表编码
	PAGEID: '400100002_list',// 页面编码
	NODEKEY: '400100002',// 应用编码
	PRINTTYPE: 'pdf'
};

const BTNCODE = {
	ADD: 'Add',// 新增
	EDIT: 'Edit',// 修改
	DELETE: 'Delete',// 删除
	SAVE: 'Save',// 保存
	CANCEL: 'Cancel',// 取消
	REFRESH: 'Refresh',// 刷新
	PRINT: 'Print'// 打印
};

const BUTTONS = ['Add', 'Edit', 'Delete', 'Save', 'Cancel', 'Refresh', 'Print'];
const ROWBTN = ['Edit','Delete'];

export { MARTRANTYPE_CONST,BUTTONS, ROWBTN,BTNCODE};
