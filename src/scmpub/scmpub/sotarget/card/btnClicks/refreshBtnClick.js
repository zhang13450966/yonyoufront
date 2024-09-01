/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: lichaoah
 * @Last Modified time: 2020-03-19 10:31:58
*/
import { queryByPk } from '../dataManange/dataManange';
import { TARGET_CARD } from '../../siconst';
import { showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function(props) {
	queryByPk.call(this, props, props.getUrlParam(TARGET_CARD.id)).then(() => {
		showRefreshInfo();
	});
}
