/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: lichaoah
 * @Last Modified time: 2020-03-19 10:32:05
*/
import { queryByPk, afterSetPageData } from '../dataManange/dataManange';
import { getCacheData } from '../dataManange/cacheManange';
import { setPageData } from '../dataManange/cardPageDataManange';
export default function(props, id) {
	let pageData = getCacheData(props, id);
	if (pageData) {
		setPageData(props, pageData);
		afterSetPageData.call(this, props);
	} else {
		queryByPk.call(this, props, id);
	}
}
