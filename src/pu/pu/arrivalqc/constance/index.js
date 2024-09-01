const URL = {
	queryScheme: '/nccloud/pu/arrivalqc/queryScheme.do',
	qualityCheck: '/nccloud/pu/arrivalqc/qualityCheck.do',
	antiQualityCheck: '/nccloud/pu/arrivalqc/antiQualityCheck.do',
	qcEnable: '/nccloud/pu/arrivalqc/queryQcEnable.do',
	print: '/nccloud/pu/arrivalqc/print.do',
	afterEdit: '/nccloud/pu/arrivalqc/afterEdit.do'
};
/**
 * 单据模板ID
 */
const PAGECODE = {
	list: '400401202_list'
};
/**
 * 区域编码
 */
const AREA = {
	searchArea: 'searchArea',
	list: 'head'
};

const COMMON = {
	moudleid: '4004',
	oid: '1002Z81000000000IMJ0',
	defaultSearchVal: {},
	ArrivalqcCacheKey: 'ArrivalqcCacheKey',
	appcode: '400401202'
};
/**
 * 小应用ID
 */
const BUTTONAREA = {
	listhead: 'list_head',
	listinner: 'list_inner'
};

/**
 * 到货单字段
 */
const FIELD = {
	nnum: 'nnum', //到货主数量
	// nastnum: 'nastnum', //到货数量
	nchecknum: 'nchecknum', //本次报检数量
	nwillelignum: 'nwillelignum' //合格主数量
};

// 表头自定义项
const HEAD_VDEF = [
	'vdef1',
	'vdef2',
	'vdef3',
	'vdef4',
	'vdef5',
	'vdef6',
	'vdef7',
	'vdef8',
	'vdef9',
	'vdef10',
	'vdef11',
	'vdef12',
	'vdef13',
	'vdef14',
	'vdef15',
	'vdef16',
	'vdef17',
	'vdef18',
	'vdef19',
	'vdef20'
];

const BUTTONID = {
	QualityCheck: 'QualityCheck', //检验
	AntiQC: 'AntiQC', //反检
	QueryAboutBusiness: 'QueryAboutBusiness', //单据追溯
	Print: 'Print', //打印
	Refresh: 'Refresh', //刷新
	OutPrint: 'OutPrint' //输出
};

const ALLBUTTON = [ 'QualityCheck', 'AntiQC', 'QueryAboutBusiness', 'Print', 'Refresh', 'OutPrint' ];

// 表体自定义项
const BODY_VBDEF = [
	'vbdef1',
	'vbdef2',
	'vbdef3',
	'vbdef4',
	'vbdef5',
	'vbdef6',
	'vbdef7',
	'vbdef8',
	'vbdef9',
	'vbdef10',
	'vbdef11',
	'vbdef12',
	'vbdef13',
	'vbdef14',
	'vbdef15',
	'vbdef16',
	'vbdef17',
	'vbdef18',
	'vbdef19',
	'vbdef20'
];

// 自由辅助属性
const VFREE = [ 'vfree1', 'vfree2', 'vfree3', 'vfree4', 'vfree5', 'vfree6', 'vfree7', 'vfree8', 'vfree9', 'vfree10' ];
const APPID = '0001Z810000000031F3O';
export { URL, AREA, PAGECODE, APPID, COMMON, BUTTONAREA, ALLBUTTON, BUTTONID, HEAD_VDEF, BODY_VBDEF, VFREE, FIELD };
