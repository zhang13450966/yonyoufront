/*
 * @Author: lichao 
 * @PageInfo:取消
 * @Date: 2019-03-08 14:21:43 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 10:52:35
 */

import { STATUS, AREACODE } from '../../constance';
import { showCancelDialog } from '../../../pub/tool/messageUtil';
import { cancelEdit } from 'scmpub/scmpub/components/VerticalEditTable';
import { viewController } from '../viewController';

export default function(props) {
	showCancelDialog({
		beSureBtnClick: cancelBtn.bind(this, props)
	});
}
function cancelBtn(props) {
	cancelEdit.call(this, AREACODE.listHead, AREACODE.listBody);
	viewController.call(this, props, STATUS.browse);
}
