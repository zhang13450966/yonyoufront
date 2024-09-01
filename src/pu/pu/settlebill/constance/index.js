const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	getList: '/nccloud/pu/settlebill/query.do', //列表态数据查询
	getCard: '/nccloud/pu/settlebill/queryCard.do', //卡片态数据查询
	delete: '/nccloud/pu/settlebill/del.do', //卡片态删除
	gotoCard: '/card', //跳转到卡片页
	listRefresh: '/list', //跳转到列表页
	pageQueryURL: '/nccloud/pu/settlebill/pageQuery.do', //分页查询
	print: '/nccloud/pu/settlebill/print.do',
	gotoList: '/list', //跳转到列表页
	sendToIA: '/nccloud/pu/settlebill/sendToIA.do', //传成本
	cancelToIA: '/nccloud/pu/settlebill/cancelToIA.do' //取消传成本
};

//页面编码
const PAGECODE = {
	dbilldateVal: '',
	searchId: 'settlebill_query',
	tableId: 'settlebill_list',
	pagecode: '400402404_list',
	//卡片态常量
	cardcode: '400402404_card',
	cardhead: 'card_head', //表头结算单信息
	head_tailinfo: 'tailinfo', //审计+人员信息
	cardbody: 'card_body', //表体结算单详情
	//通用常量
	queryType: 'simple',
	pageInfo: {
		//分页信息
		pageIndex: 0,
		pageSize: 10,
		total: 2,
		totalPage: 1
	}
};

const COMMON = {
	settlebillCacheKey: 'scm.pu.settlebill.settlebillCacheKey'
};

const FIELD = {
	default: [
		{
			field: 'dr',
			value: { firstvalue: '0' },
			oprtype: '\u003d'
		}
	],
	id: 'id',
	ts: 'ts', //时间戳
	pk_org: 'pk_org', //组织参照
	pk_settlebill: 'pk_settlebill', //主键
	pk_settlebill_b: 'pk_settlebill_b',
	pk_material: 'po_settlebill_b.pk_srcmaterial', //物料参照
	pk_supplier: 'po_settlebill_b.pk_supplier', //供应商
	vbillcode: 'vbillcode', //开票供应商
	form: 'form', //form表单类型
	table: 'table', // table表格类型
	mar_basclass: 'po_settlebill_b.pk_srcmaterial.pk_marbasclass', //物料基本分类
	crowno: 'crowno', //行号
	btoia: 'btoia', // 传成本
	sagaStatus: 'saga_status' //事务状态
};
const LIST_BUTTON = {
	del: 'Delete', //删除
	cancelToIA: 'CancelSendToIA', //取消传存货
	sendToIA: 'SendToIA', //传存货
	print: 'Print' //打印
};
const BUTTON = {
	del: 'Delete', //删除
	cancelToIA: 'CancelSendToIA', //取消传存货
	sendToIA: 'SendToIA', //传存货
	print: 'Print', //打印
	linkQuery: 'LinkQuery', //单据追溯
	file: 'File', //附件
	output: 'Outprint', //输出
	review: 'Review', //预览
	refreash: 'Refresh' //刷新
};
const STATUS = {
	status: 'status', //状态标志
	browse: 'browse' //浏览
};
export { URL, PAGECODE, FIELD, BUTTON, STATUS, LIST_BUTTON, COMMON };
