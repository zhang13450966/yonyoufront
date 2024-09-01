/*
 * @Author: 王龙华
 * @PageInfo: 取消按钮点击事件
 * @Date: 2018-05-21 15:11:48
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 15:26:10
 */
import { POSITION_CONST } from '../../const';
import buttonController from '../../list/viewController/buttonController';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { cancelEdit } from 'scmpub/scmpub/components/VerticalEditTable';

export default function cancel_BtnClick(props) {
	showCancelDialog({
		beSureBtnClick: cancelBtn.bind(this, props)
	});
}
function cancelBtn(props) {
	cancelEdit.call(this, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID);
	// 控制按钮状态
	buttonController.call(this, props, POSITION_CONST.BROWSER_STATUS);
}
