import { high } from 'nc-lightapp-front';
import HROrgTreeRef from '../../uapbd/HROrgTreeRef'
const { Refer } = high;
export var conf = {
			multiLang: {
			domainName: 'uapbd',
			currentLocale: 'zh-CN',
			moduleId: 'refer_uapbd',
		},

	refType: 'tree',
	// refName: 'refer-000440',/* 国际化处理： 国家地区*/
	placeholder: '业务单元',/* 国际化处理： 国家地区*/

	queryTreeUrl: '/nccloud/uapbd/org/BusinessUnitTreeRef.do',
	rootNode: { refname: '业务单元', refpk: 'root' },

	isHasDisabledData: false
};

export default function (props = {}) {
	return <Refer  {...conf} 
	 {...props} />
}
