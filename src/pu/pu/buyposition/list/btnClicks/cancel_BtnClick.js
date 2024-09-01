/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置取消处理 
 * @Date: 2018-05-10 09:32:59 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 09:51:01
 */
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function cancelBtnClick(props) {
	props.button.setPopContent('Delete', getLangByResId(this, '4004BUYPOSITION-000006')); /* 国际化处理： 确认要删除吗？*/
	showCancelDialog({ beSureBtnClick: cancel.bind(this, props) });
}

function cancel(props) {
	props.editTable.cancelEdit(BUYPOSITION_CONST.TABLEID);
	let status = props.editTable.getStatus(BUYPOSITION_CONST.TABLEID);
	buttonController.call(this, props, this.state.pk_org.value, status);
}
