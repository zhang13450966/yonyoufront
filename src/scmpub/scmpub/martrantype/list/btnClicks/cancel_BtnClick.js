/*
 * @Author: yechd5 
 * @PageInfo: 取消按钮点击实现 
 * @Date: 2018-04-12 09:41:12 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 10:06:43
 */
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickCancelBtn(props) {
	props.button.setPopContent('Delete', getLangByResId(this, '4001MARTRANTYPE-000004')); /* 国际化处理： 确认要删除吗？*/
	showCancelDialog({ beSureBtnClick: cancel.bind(this, props) });
}
function cancel(props) {
	props.editTable.cancelEdit(MARTRANTYPE_CONST.TABLEID);
	let status = props.editTable.getStatus(MARTRANTYPE_CONST.TABLEID);
	buttonController.call(this, props, this.state.pk_org.value, status);
}
