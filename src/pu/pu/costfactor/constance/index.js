/*
 * @Author: zhaochyu 
 * @PageInfo: 采购成本要素常量定义 
 * @Date: 2018-05-28 14:39:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 10:06:50
 */
//页面编码
const PAGECODE = {
	oid: '1001Z8100000000011B1',
	appid: '0001AA1000000003A7G1',
	listpagecode: '400402000_list',
	cardpagecode: '400402000_card',
	headId: 'list_head',
	bodyId: 'list_body',
	list_inner: 'list_inner'
};
//按钮
const BUTTON = {
	Add: 'Add', //新增
	Save: 'Save', //保存
	Cancel: 'Cancel', //取消
	Edit: 'Edit', //修改
	Delete: 'Delete', //删除
	Refresh: 'Refresh', //刷新
	modalList: 'modalList', //弹框提示
	AddLine: 'AddLine', //增行
	RowDelete: 'RowDelete' //删行
};
//状态
const UISTATE = {
	browse: 'browse', //浏览态
	edit: 'edit', //编辑态
	add: 'add' //新增态
};
const URL = {
	listHeadQuery: '/nccloud/pu/costfactor/query.do', //列表表头查询
	listBodyQuery: '/nccloud/pu/costfactor/querybody.do', //列表表体查询
	save: '/nccloud/pu/costfactor/insert.do', //新增保存操作
	rowdelete: '/nccloud/pu/costfactor/bodydelete.do', //删除操作
	delete: '/nccloud/pu/costfactor/delete.do', //表体删行校验操作
	orgafter: '/nccloud/pu/costfactor/orgafter.do', //主组织编辑后事件
	bodyafter: '/nccloud/pu/costfactor/bodyafter.do', //表体编辑后事件
	update: '/nccloud/pu/costfactor/update.do', //修改保存操作
	MaterialSqlBuilder: 'nccloud.web.pu.costfactor.util.MaterialSqlBuilder', //物料过滤后台条件处理
	orgv_permissions: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' //主组织vid权限
};
const FIELD = {
	pk_org_v: 'pk_org_v', //主组织
	pk_org: 'pk_org', //主组织
	pk_costfactor_b: 'pk_costfactor_b', //成本要素行
	pk_materialName: 'pk_material.name', //费用名称
	ts: 'ts', //时间戳
	pk_srcmaterial: 'pk_srcmaterial', //物料
	pk_material: 'pk_material', //物料
	bshow: 'bshow', //是否显示
	ishoworder: 'ishoworder', //显示顺序
	pk_costfactor: 'pk_costfactor', //成本要素
	pk_group: 'pk_group', //所属集团
	ifactororder: 'ifactororder', //成本要素顺序
	bentercost: 'bentercost', //是否进入成本存货
	fapportionmode: 'fapportionmode' //分摊方式
};
export { PAGECODE, BUTTON, UISTATE, URL, FIELD };
