/*
 * @Author: yechd5 
 * @PageInfo: 列表多选事件处理 
 * @Date: 2018-07-03 10:37:09 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-23 13:59:33
 */
import { BUYPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function selectedAllClick(props) {
	let status = props.editTable.getStatus(BUYPOSITION_CONST.TABLEID);
	buttonController.call(this, props, this.state.pk_org.value, status);
}
