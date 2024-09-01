/*
* @Author: jiangfw 
* @PageInfo: 打开节点后加载到主组织要触发组织的编辑后
* @Date: 2018-08-15 19:33:35 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-10-18 16:48:19
*/
import searchAfterEvent from './searchAfterEvent';
// import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
// import { FIELD } from '../constance';

export default function(queryArea, orgKey) {
	// transtypeUtils.setQueryDefaultValue.call(this, this.props, queryArea, FIELD.ctrantypeid);
	let orgVal = this.props.search.getSearchValByField(queryArea, orgKey);
	if (orgVal && orgVal.value && orgVal.value.firstvalue) {
		let value = orgVal.value.firstvalue;
		let arr = value.split(',');
		arr = arr.map((item) => {
			return { refpk: item };
		});
		searchAfterEvent.bind(this, queryArea, orgKey, arr);
	}
}
