const DateFormate = [ 'yy', 'yyyy', 'yymm', 'yyyymm', 'yymmdd', 'yyyymmdd' ];
const objLngNum = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];
const orderNum = [ '0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
const checkKeys = [ 'vprefix', 'object1', 'object2', 'vyear', 'vmonth', 'vday', 'snnum', 'vsuffix' ];
const ruleType = [
	{ label: '4001BATCHRULE-000011', value: 'vprefix' } /* 国际化处理： 前缀*/,
	{ label: '4001BATCHRULE-000012', value: 'object1' } /* 国际化处理： 业务对象1*/,
	{ label: '4001BATCHRULE-000013', value: 'object2' } /* 国际化处理： 业务对象2*/,
	{ label: '4001BATCHRULE-000003', value: 'vyear' } /* 国际化处理： 年*/,
	{ label: '4001BATCHRULE-000004', value: 'vmonth' } /* 国际化处理： 月*/,
	{ label: '4001BATCHRULE-000005', value: 'vday' } /* 国际化处理： 日*/,
	{ label: '4001BATCHRULE-000014', value: 'snnum' } /* 国际化处理： 流水号*/,
	{ label: '4001BATCHRULE-000015', value: 'vsuffix' } /* 国际化处理： 后缀*/
];
const defaultRuleInfo = {
	vprefix: { value: '' },
	object1: { value: '' },
	object2: { value: '' },
	vyear: { value: '' },
	vmonth: { value: '' },
	vday: { value: '' },
	snnum: { value: '0' },
	vsuffix: { value: '' },
	obj1length: { value: '' },
	obj2length: { value: '' },
	snresetflag: { value: '0' }
};
const defaultChecked = {
	vprefix: false,
	object1: false,
	object2: false,
	vyear: false,
	vmonth: false,
	vday: false,
	snnum: false,
	vsuffix: false
};

export { DateFormate, objLngNum, orderNum, checkKeys, ruleType, defaultRuleInfo, defaultChecked };
