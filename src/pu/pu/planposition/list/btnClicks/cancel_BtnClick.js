/*
 * @Author: yechd5 
 * @PageInfo: 计划员物料设置取消处理 
 * @Date: 2018-05-10 09:32:59 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 10:00:26
 */
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function cancelBtnClick(props) {
	props.button.setPopContent('Delete', getLangByResId(this, '4004PLANPOSITION-000006')); /* 国际化处理： 确认要删除吗？*/
	showCancelDialog({ beSureBtnClick: cancel.bind(this, props) });
}
function cancel(props) {
	props.editTable.cancelEdit(PLANPOSITION_CONST.TABLEID);
	let status = props.editTable.getStatus(PLANPOSITION_CONST.TABLEID);
	buttonController.call(this, props, this.state.pk_org.value, status);
}
