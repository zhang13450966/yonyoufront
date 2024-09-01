/*
 * @Author: zhaochyu
 * @PageInfo: 表体新增
 * @Date: 2018-05-03 09:22:09 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 16:59:00
 */
import { FIELD, BODY_FIELD } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
export default function(props) {
	props.cardTable.addRow(FIELD.cardTable);
	RownoUtils.setRowNo(props, FIELD.cardTable, BODY_FIELD.crowno);
}
