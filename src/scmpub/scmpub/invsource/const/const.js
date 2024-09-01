/*
 * @Author: 王龙华 
 * @PageInfo:  内部货源定义常量文件
 * @Date: 2018-05-31 15:33:41 
 * @Last Modified by: wangshrc
 * @Last Modified time: 2018-07-17 15:16:55
 */

const INVSOURCE_CONST = {
	EDIT: 'edit',
	BROWSE: 'browse',
	PAGECODE: '400100000_list',// 页面编码
	SEARCHID: '40010505',// 查询区id
	TABLEID: 'invsourcelist',// 界面区id
	QUERY_URL: '/nccloud/scmpub/invsource/query.do',// 查询url
	SAVE_URL: '/nccloud/scmpub/invsource/save.do',// 保存url
	PRINT_URL: '/nccloud/scmpub/invsource/print.do',// 打印url
	EXPORT_URL: '/nccloud/scmpub/invsource/export.do',// 导出url
	IMPORT_URL: '/nccloud/scmpub/invsource/import.do',// 导入url
	FUNCODE: '400100000', //  打印模板编码
	MODEL: 'model', // 弹框
	PRINT_TYPE: 'pdf', // 打印格式
	AREATYPE: 'table',
	QUERYTYPE: 'simple',
	ADD_STATUS: 'add',
	EDIT_STATUS: 'edit',
	BROWSER_STATUS: 'browse',
	DELETEBUTTON: [ 'Delete' ],
	HEADAREA: 'list_head',// 表头按钮区域
	BODYAREA: 'list_inner',// 行按钮区域
	OID: '4001Z805000000000000'
};

// 按钮
const INVSOURCE_BUTTONS = {
	Add: 'Add', // 新增
	Edit: 'Edit', // 修改
	Delete: 'Delete', // 删除
	Save: 'Save', // 保存
	Cancel: 'Cancel', // 取消
	Print: 'Print', // 打印
	Refresh: 'Refresh', // 刷新
	Import: 'Import', // 导入
	Export: 'Export', // 导出
	Group: 'group_1'
};

export { INVSOURCE_CONST, INVSOURCE_BUTTONS };
