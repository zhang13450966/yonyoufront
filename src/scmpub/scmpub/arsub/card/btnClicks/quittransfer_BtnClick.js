/*
 * @Author: 刘奇 
 * @PageInfo: 卡片退出转单按钮事件
 * @Date: 2019-03-25 15:11:36 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:04:17
 */

import { ARSUB_CONST } from '../../const';
import { showQuitTransferWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function buttonClick(props) {
	// 是否有未处理的单据
	let isleft = props.transferTable.getTransformFormStatus(ARSUB_CONST.left);
	if (isleft == false) {
		showQuitTransferWarningDialog({
			/* 国际化处理： 退出转单,有未保存的单据，确定要退出转单吗?*/
			beSureBtnClick: () => {
				// 退出转单逻辑
				process.call(this, props);
			}
		});
	} else {
		process.call(this, props);
	}
}

function process(props) {
	props.pushTo(ARSUB_CONST.List_URL, {
		pagecode: ARSUB_CONST.listPageId
	});
}
