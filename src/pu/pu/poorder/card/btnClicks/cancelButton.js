/*
 * @Author: CongKe
 * @PageInfo: 取消功能
 * @Date: 2018-04-20 10:17:37
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-17 11:24:14
 */
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';

export default function cancelButton(props, currentindex) {
	showWarningDialog(getLangByResId(this, '4004POORDER-000019'), getLangByResId(this, '4004POORDER-000031'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			buttonController.doCancel.call(this, this.props, null, currentindex);
		},
	});
}
