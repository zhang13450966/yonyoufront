/*
 * @Author: yechd5
 * @PageInfo: 计划员物料设置常量JS
 * @Date: 2018-04-12 09:45:20 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-23 15:18:33
 */
const PLANPOSITION_CONST = {
	BROWSE: 'browse',
	EDIT: 'edit',
	LIST_HEAD: 'list_head',// 表头按钮区
	LIST_INNER: 'list_inner',// 行按钮区
	TABLEID: 'po_planposition_list',// 模板id
	PAGEID: '400100004_list',// 页面编码
	NODECODE: '40010515',// 节点标识
	SAVEURL: '/nccloud/pu/planposition/save.do',// 保存url
	DELURL: '/nccloud/pu/planposition/delete.do',// 删除url
	QUERYURL: '/nccloud/pu/planposition/query.do',// 查询url
	AFTEREVENTURL: '/nccloud/pu/planposition/afterevent.do'// 编辑后事件url
};

const ROWBTN = ['Edit','Delete'];// 行上按钮

export { PLANPOSITION_CONST, ROWBTN };
