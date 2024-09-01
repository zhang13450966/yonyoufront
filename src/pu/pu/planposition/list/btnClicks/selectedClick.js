/*
 * @Author: yechd5 
 * @PageInfo: 列表单选事件处理 
 * @Date: 2018-07-03 10:37:09 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-07-03 14:38:32
 */
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function onSelected(props) {
	let status = props.editTable.getStatus(PLANPOSITION_CONST.TABLEID);
	buttonController.call(this, props, this.state.pk_org.value, status);
}
