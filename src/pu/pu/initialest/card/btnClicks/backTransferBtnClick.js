/*
 * @Author: zhaochyu
 * @PageInfo: 返回到转单界面
 * @Date: 2018-09-17 16:53:30
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:17:15
 */
import { URL, AREA, FIELD, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showBackWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function backTransferButton(props) {
	let allprocess = props.transferTable.getTransformFormStatus(AREA.leftarea);
	if (allprocess === false) {
		showBackWarningDialog({
			/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
			beSureBtnClick: () => {
				this.props.pushTo(URL.gotoTransfer, {
					status: FIELD.transfer,
					pagecode: PAGECODE.transferlist
				});
			}
		});
	} else {
		this.props.pushTo(URL.gotoTransfer, { status: FIELD.transfer, pagecode: PAGECODE.transferlist });
	}
}
