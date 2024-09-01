/**
 * 购销类型枚举
 */
const BuySellFlagEnum = {
	IMPORT: '4', //进口
	NATIONAL_BUY: '2', // 国内采购
	NATIONAL_SELL: '1', // 国内销售
	NO_DISTINCT: '5', //不区分
	OUTPUT: '3' //出口
};
/**
 * 采购管理单据类型
 */
const TOBillType = {
	storereq: '422X', //物资需求申请单
	praybill: '20', //请购单
	pooder: '21', //采购订单
	arrive: '23', //到货单
	puinvoice: '25', //采购发票
	initialest: '4T' //期初暂估单
};

const TOItemKey = {
	vbatchcode: 'vbatchcode',
	pk_batchcode: 'pk_batchcode',
	cproductorid: 'cproductorid',
	cvmivenderid: 'cvmivenderid',
	ctplcustomerid: 'ctplcustomerid',
	cprojectid: 'cprojectid',
	casscustid: 'casscustid',
	cwarehouseid: 'cwarehouseid',
	ctoutstordocid: 'ctoutstordocid',
	cinstordocid: 'cinstordocid',
	coutstordocid: 'coutstordocid',
	cvendorid: 'cvendorid',
	blargessflag: 'blargessflag',
	castunitid: 'castunitid',
	cunitid: 'cunitid',
	cbiztypeid: 'cbiztypeid',
	cmaterialoid: 'cmaterialoid',
	cinventoryid: 'cinventoryid',
	cinventoryvid: 'cinventoryvid',
	corigcurrencyid: 'corigcurrencyid',
	cqtunitid: 'cqtunitid',
	crowno: 'crowno',
	dbilldate: 'dbilldate',
	fstatusflag: 'fstatusflag',
	pk_group: 'pk_group',
	pk_org: 'pk_org',
	coutstockorgid: 'coutstockorgid',
	ctoutstockorgid: 'ctoutstockorgid',
	cinstockorgid: 'cinstockorgid',
	vbillcode: 'vbillcode',
	vchangerate: 'vchangerate',
	vfree1: 'vfree1',
	vfree2: 'vfree2',
	vfree3: 'vfree3',
	vfree4: 'vfree4',
	vfree5: 'vfree5',
	vfree6: 'vfree6',
	vfree7: 'vfree7',
	vfree8: 'vfree8',
	vfree9: 'vfree9',
	vfree10: 'vfree10',
	vqtunitrate: 'vqtunitrate',
	vtrantypecode: 'vtrantypecode',
	nnum: 'nnum',
	nastnum: 'nastnum',
	cffileid: 'cffileid',
	nqtunitnum: 'nqtunitnum',
	countryid: 'countryid',
	csrcid: 'csrcid',
	vsrctype: 'vsrctype'
};

export { BuySellFlagEnum, TOBillType };
