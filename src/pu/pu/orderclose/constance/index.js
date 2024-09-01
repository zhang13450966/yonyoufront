/*
 * @Author: CongKe
 * @PageInfo: 采购订单关闭常量
 * @Date: 2018-04-17 14:00:27
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-22 09:59:48
 */
const URL = {
	queryPage: '/nccloud/platform/templet/querypage.do', //模板查询
	getList: '/nccloud/pu/poorder/orderclosequery.do', //列表态数据查询
	gotoList: '/pu/pu/orderclose/list/index.html', //列表跳转
	finalClose: '/nccloud/pu/poorder/finalClose.do', //最终关闭
	arriveallclose: '/nccloud/pu/poorder/arriveallclose.do', //整单到货最终关闭
	invoiceallclose: '/nccloud/pu/poorder/invoiceallclose.do', //整单收票关闭
	payallclosea: '/nccloud/pu/poorder/payallclosea.do', //整单付款关闭
	storeallclose: '/nccloud/pu/poorder/storeallclose.do', //整单入库关闭
	arriveallopen: '/nccloud/pu/poorder/arriveallopen.do', //整单到货打开
	finalopen: '/nccloud/pu/poorder/finalopen.do', //整单打开
	invoiceallopen: '/nccloud/pu/poorder/invoiceallopen.do', //整单发票打开
	payallopen: '/nccloud/pu/poorder/payallopen.do', //整单付款打开
	storeallopen: '/nccloud/pu/poorder/storeallopen.do', //整单入库打开
	arriverowclose: '/nccloud/pu/poorder/arriverowclose.do', //行到货关闭
	invoicerowclose: '/nccloud/pu/poorder/invoicerowclose.do', //行收票关闭
	payrowclose: '/nccloud/pu/poorder/payrowclose.do', //行付款关闭
	rowclose: '/nccloud/pu/poorder/rowclose.do', //行关闭
	storerowclose: '/nccloud/pu/poorder/storerowclose.do', //行入库关闭
	arriverowopen: '/nccloud/pu/poorder/arriverowopen.do', //行到货打开
	invoicerowopen: '/nccloud/pu/poorder/invoicerowopen.do', //行收票打开
	payrowopen: '/nccloud/pu/poorder/payrowopen.do', //行付款打开
	rowopen: '/nccloud/pu/poorder/rowopen.do', //行打开
	storerowopen: '/nccloud/pu/poorder/storerowopen.do', //行入库打开
	print: '/nccloud/pu/poorder/orderprintaction.do', // 打印
	gotoCard: '/pu/pu/poorder/card',
	printvalidate: '/nccloud/pu/poorder/orderprintvalidate.do' // 打印前校验
};
//页面编码
const PAGECODE = {
	dbilldateVal: '',
	listcode: '400400804_list',
	searchId: '400400804_query',
	tableId: 'list_head',
	queryType: 'simple',
	cardcode: '400400800_card', // pu_poorder_card
	templetid: 'templetid'
};
const FIELD = {
	id: 'id',
	ts: 'ts', //时间戳
	pks: 'pks', //传参主键
	pagecode: 'pagecode', //页面参数
	pk_org: 'pk_org', //组织参照
	pk_order: 'pk_order', //主键
	pk_material: 'pk_material', //物料参照
	pk_supplier: 'pk_supplier', //供应商
	vbillcode: 'vbillcode', //订单编号
	pk_srcmaterial_refer: 'pk_order_b.pk_srcmaterial' //物料参照字段
};
const BUTTON = {
	Refresh: 'Refresh', //刷新
	CloseBill: 'CloseBill', //整单关闭-->组
	Whole_Final_Close: 'Whole_Final_Close', //最终关闭
	Whole_Arrival_Close: 'Whole_Arrival_Close', //到货关闭
	Whole_Stock_Close: 'Whole_Stock_Close', //入库关闭
	Whole_Invoic_Close: 'Whole_Invoic_Close', //开票关闭
	Whole_Payment_Close: 'Whole_Payment_Close', //付款关闭
	OpenBill: 'OpenBill', //整单打开-->组
	Whole_Open: 'Whole_Open', //整单打开
	Whole_Arrival_Open: 'Whole_Arrival_Open', //到货打开
	Whole_Stock_Open: 'Whole_Stock_Open', //入库打开
	Whole_Invoic_Open: 'Whole_Invoic_Open', //开票打开
	Whole_Payment_Open: 'Whole_Payment_Open', //付款打开
	Rows_Close: 'Rows_Close', //行关闭-->组
	Row_Close: 'Row_Close', //行关闭
	Row_Arrival_Close: 'Row_Arrival_Close', //到货关闭
	Row_Stock_Close: 'Row_Stock_Close', //入库关闭
	Row_Invoic_Close: 'Row_Invoic_Close', //开票关闭
	Row_Payment_Close: 'Row_Payment_Close', //付款关闭
	Rows_Open: 'Rows_Open', //行打开-->组
	Row_Open: 'Row_Open', //行打开
	Row_Arrival_Open: 'Row_Arrival_Open', //到货打开
	Row_Stock_Open: 'Row_Stock_Open', //入库打开
	Row_Invoic_Open: 'Row_Invoic_Open', //开票打开
	Row_Payment_Open: 'Row_Payment_Open', //付款打开
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	Print: 'Print', //打印
	PrintOut: 'PrintOut' //输出
};
const STATUS = {
	status: 'status', //状态标志
	edit: 'edit', //编辑态
	browse: 'browse' //浏览
};

const ORDERCLOSECACHE = {
	CLOSECACHE: 'scm.pu.orderclose.datasource'
};

export { URL, PAGECODE, FIELD, BUTTON, STATUS, ORDERCLOSECACHE };
