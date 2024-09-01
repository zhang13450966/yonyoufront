/*
 * @Author: zhaochyu 
 * @PageInfo: 重新排号
 * @Date: 2018-07-12 22:42:09 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:00:40
 */
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { FIELD, ATTRCODES } from '../../constance';
export default function(props) {
	this.forceUpdate();
	RownoUtils.resetRowNo(props, FIELD.cardTable, ATTRCODES.crowno);
}
