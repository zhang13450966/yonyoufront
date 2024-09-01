/*
 * @Author: chaiwx 
 * @PageInfo: 调入申请  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-11-13 18:53:47
 */
import { AREA, FIELDS } from '../../constance';
import { RownoUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools';

export default function(props) {
	props.beforeUpdatePage();
	RownoUtils.resetRowNo(props, AREA.cardTableId, FIELDS.crowno);
	props.updatePage(null, AREA.cardTableId);
}
