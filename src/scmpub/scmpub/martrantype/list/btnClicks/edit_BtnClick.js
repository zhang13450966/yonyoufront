/*
 * @Author: yechd5 
 * @PageInfo: 修改按钮点击实现
 * @Date: 2018-04-12 09:41:40 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-08-31 12:34:37
 */
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickEditBtn(props) {
	props.button.setPopContent('Delete', '');
	// 去除复选框的打钩
	props.editTable.selectAllRows(MARTRANTYPE_CONST.TABLEID, false);
	buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.EDIT);
}
