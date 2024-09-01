/*
 * @Author: lichao 
 * @PageInfo:取消按钮
 * @Date: 2018-11-22 19:58:20 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-07-09 16:55:40
 */

import { AREACODE, STATUS } from '../../constance';

import { viewController } from '../viewController';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function cancelButton(props) {
	showCancelDialog({
		beSureBtnClick: () => {
			const { cancelEdit } = props.editTable;
			cancelEdit(AREACODE);
			viewController.call(this, props, STATUS.browse);
		}
	});
}
