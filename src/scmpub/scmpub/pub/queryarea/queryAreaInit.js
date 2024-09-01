/*
 * @Author: wangceb 
 * @PageInfo: 页面功能描述  
 * @Date: 2018-08-13 16:54:23 
 * @Last Modified by: wangceb
 * @Last Modified time: 2018-09-05 10:29:06
 */
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
function renderCompleteEvent(moduleId, orgfield, callback, ctrantypeid) {
	// 设置默认值
	transtypeUtils.setQueryDefaultValue.call(this, this.props, moduleId, ctrantypeid);
	let pk_org_value = this.props.search.getSearchValByField(moduleId, orgfield);
	let arr = null;
	if (pk_org_value && pk_org_value.value && pk_org_value.value.firstvalue) {
		let value = pk_org_value.value.firstvalue;

		arr = value.split(',').map((item) => {
			return {
				refpk: item
			};
		});
	}

	if (callback) {
		callback.call(this, orgfield, arr);
	}
}

export { renderCompleteEvent };
