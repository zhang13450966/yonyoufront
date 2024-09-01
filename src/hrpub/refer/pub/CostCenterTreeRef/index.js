
import { high } from 'nc-lightapp-front';
import { conf as unitConf } from "../BusinessUnitTreeRef/index";
const { Refer } = high;

export default function (props = {}) {
	var conf = {
				multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

		refType: 'tree',
		refName: '业务单元',/* 国际化处理： 业务单元*/
		placeholder: '业务单元',/* 国际化处理： 业务单元*/
		rootNode: { refname: '成本中心', refpk: 'root' },/* 国际化处理： 业务单元*/
		refCode: 'uapbd.costcenter.action.CostCenterSqlBuilder',
		queryTreeUrl: '/nccloud/uapbd/ref/CostCenterTreeRef.do',
		treeConfig: {
			name: ['refer-000457', 'refer-000458', 'refer-000014'],/* 国际化处理： 行政区划编码,行政区划名称,助记码*/
			code: ['refcode', 'refname', 'memcode']
		},
		isMultiSelectedEnabled: false,
		unitProps: unitConf,
		isShowUnit: true
	};

	return <Refer {...props} {...conf}  />
}