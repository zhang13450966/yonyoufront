/*
 * @Author: yechd5
 * @PageInfo: 采购岗物料设置常量JS
 * @Date: 2018-04-12 09:45:20 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-23 14:05:44
 */
const BUYPOSITION_CONST = {
	BROWSE: 'browse',
	EDIT: 'edit',
	LIST_HEAD: 'list_head',// 表头按钮区
	LIST_INNER: 'list_inner',// 行按钮区
	TABLEID: 'po_buyposition_list',// 模板编码
	PAGEID: '400100006_list',// 页面编码
	NODECODE: '40010520',// 节点标识
	SAVEURL: '/nccloud/pu/buyposition/save.do',// 保存url
	DELURL: '/nccloud/pu/buyposition/delete.do',// 删除url
	QUERYURL: '/nccloud/pu/buyposition/query.do',// 查询url
	AFTEREVENTURL: '/nccloud/pu/buyposition/afterevent.do'// 编辑后事件url
};

const ROWBTN = ['Edit','Delete'];

export { BUYPOSITION_CONST, ROWBTN };
