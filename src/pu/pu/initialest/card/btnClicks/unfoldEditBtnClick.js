/*
 * @Author: zhaochyu 
 * @PageInfo: 编辑态展开
 * @Date: 2018-07-13 14:13:52 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:00:57
 */
import { PAGECODE, UISTATE } from '../../constance';
export default function(props, record, index) {
	props.cardTable.openModel(PAGECODE.cardbody, UISTATE.edit, record, index);
	// e.stopPropagation();
}
