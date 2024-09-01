/*
 * @Author: zhaochyu 
 * @PageInfo: 行内复制行
 * @Date: 2018-07-13 14:45:00 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-04 10:22:30
 */
import { PAGECODE, BODY_FIELD } from '../../constance';
export default function(props, index) {
	props.cardTable.pasteRow(PAGECODE.cardbody, index);
	props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index + 1, BODY_FIELD.pk_initialest_b, {
		value: null,
		display: null,
		scale: '-1'
	});
}
