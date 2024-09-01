/*
 * @Author: zhaochyu 
 * @PageInfo: 行内展开 
 * @Date: 2018-06-21 16:06:58 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:00:51
 */
import { PAGECODE } from '../../constance';
export default function(props, record, index) {
	props.cardTable.toggleRowView(PAGECODE.cardbody, record, index);
}
