/*
 * @Author: zhaochyu
 * @PageInfo: 退出转单
 * @Date: 2018-07-05 15:26:28
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:22:58
 */
import { URL, AREA, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showQuitTransferWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function quitTransferButton(props) {
	let allprocess = props.transferTable.getTransformFormStatus(AREA.leftarea);
	if (allprocess === false) {
		showQuitTransferWarningDialog({
			/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
			beSureBtnClick: () => {
				this.props.pushTo(URL.listurl, { pagecode: PAGECODE.listpagecode });
			}
		});
	} else {
		this.props.pushTo(URL.listurl, { pagecode: PAGECODE.listpagecode });
	}
}
