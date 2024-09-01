/*
 * @Author: qishy 
 * @PageInfo:重排行号
 * @Date: 2019-04-30 16:32:12 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-04-30 16:33:33
 */
import { AREA, FIELDS } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';

export default function(props) {
	//效率优化开启
	props.beforeUpdatePage();
	RownoUtils.resetRowNo(props, AREA.cardTableId, FIELDS.crowno);
	//效率优化执行
	props.updatePage(null, AREA.cardTableId);
}
