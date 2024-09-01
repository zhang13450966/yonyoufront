const URL = {
	queryScheme: '/nccloud/pu/poorder/payplanmilestoneboardquery.do',
	querySetting: '/nccloud/pu/poorder/payplanmilestoneboardqueryinfo.do',
	saveSetting: '/nccloud/pu/poorder/payplanmilestoneboardsave.do'
};

/**
 * 显示设置字段对照表
 */
let FIELDS = [
	{ key: 'vbillcode', title: '4004MILESTONEBOARD-000007', disabled: true }, // 订单编号
	{ key: 'pk_supplier', title: '4004MILESTONEBOARD-000008' }, // 供应商
	{ key: 'ntotalastnum', title: '4004MILESTONEBOARD-000009' }, // 总数量
	{ key: 'ntotalorigmny', title: '4004MILESTONEBOARD-000010' }, // 总价税合计
	{ key: 'pk_org', title: '4004MILESTONEBOARD-000011' }, // 采购组织
	{ key: 'vtrantypecode', title: '4004MILESTONEBOARD-000012' }, // 订单类型
	{ key: 'dbilldate', title: '4004MILESTONEBOARD-000013' }, // 订单日期
	{ key: 'pk_invcsupllier', title: '4004MILESTONEBOARD-000014' }, // 开票供应商
	{ key: 'corigcurrencyid', title: '4004MILESTONEBOARD-000015' }, // 币种
	{ key: 'pk_payterm', title: '4004MILESTONEBOARD-000016' }, // 付款计划
	{ key: 'cemployeeid', title: '4004MILESTONEBOARD-000017' }, // 采购员
	{ key: 'pk_dept', title: '4004MILESTONEBOARD-000018' }, // 采购部门
	{ key: 'pk_balatype', title: '4004MILESTONEBOARD-000019' }, // 结算方式
	{ key: 'ntotalweight', title: '4004MILESTONEBOARD-000020' }, // 总重量
	{ key: 'ntotalvolume', title: '4004MILESTONEBOARD-000021' }, // 总体积
	{ key: 'ntotalpiece', title: '4004MILESTONEBOARD-000022' }, // 总件数
	{ key: 'pk_project', title: '4004MILESTONEBOARD-000023' } // 项目
];

/**
 * 显示设置字段对照表
 */
let FIELDS_MAP = {
	vbillcode: '4004MILESTONEBOARD-000007', // 订单编号
	pk_supplier: '4004MILESTONEBOARD-000008', // 供应商
	ntotalastnum: '4004MILESTONEBOARD-000009', // 总数量
	ntotalorigmny: '4004MILESTONEBOARD-000010', // 总价税合计
	pk_org: '4004MILESTONEBOARD-000011', // 采购组织
	vtrantypecode: '4004MILESTONEBOARD-000012', // 订单类型
	dbilldate: '4004MILESTONEBOARD-000013', // 订单日期
	pk_invcsupllier: '4004MILESTONEBOARD-000014', // 开票供应商
	corigcurrencyid: '4004MILESTONEBOARD-000015', // 币种 ???
	pk_payterm: '4004MILESTONEBOARD-000016', // 付款计划
	cemployeeid: '4004MILESTONEBOARD-000017', // 采购员
	pk_dept: '4004MILESTONEBOARD-000018', // 采购部门
	pk_balatype: '4004MILESTONEBOARD-000019', // 结算方式
	ntotalweight: '4004MILESTONEBOARD-000020', // 总重量
	ntotalvolume: '4004MILESTONEBOARD-000021', // 总体积
	ntotalpiece: '4004MILESTONEBOARD-000022', // 总件数
	pk_project: '4004MILESTONEBOARD-000023' // 项目
};

/**
 * 单据模板ID
 */
const PAGECODE = {
	list: '400401402_list'
};

const FIELD = {
	pk_org: 'pk_org', // 组织
	cvendorid: 'cvendorid', //供应商
	billmaker: 'billmaker', //制单人
	cemployeeid: 'cemployeeid', // 采购员
	pk_dept: 'pk_dept', // 采购部门
	vordertrantype: 'vordertrantype' // 交易类型
};

/**
 * 区域编码
 */
const AREA = {
	searchArea: 'list_query'
};

const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse', //浏览
	copy: 'copy',
	tempstatus: 'tempstatus', //暂存标志
	add: 'add' //新增
};

export { URL, AREA, PAGECODE, FIELDS, FIELDS_MAP, FIELD };
