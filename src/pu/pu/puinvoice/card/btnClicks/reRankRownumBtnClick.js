/*
 * @Author: jiangfw 
 * @PageInfo: 重排行号事件 
 * @Date: 2018-04-25 20:47:18 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-11-13 20:57:20
 */
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, AREA } from '../../constance';
import { cacheData } from '../utils/cacheData';

export default function clickReRankRownumBtn() {
	RownoUtils.resetRowNo(this.props, this.tableId, FIELD.crowno);
	this.forceUpdate();
	cacheData.call(this, AREA.card_body);
}
