/*
 * @Author: qishy
 * @PageInfo：退出转单
 * @Date: 2019-05-09 09:53:09
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:08:41
 */

import { REQUESTURL, AREA, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showQuitTransferWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function(props) {
	let allprocess = props.transferTable.getTransformFormStatus(AREA.leftarea);
	if (allprocess === false) {
		showQuitTransferWarningDialog({
			/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
			beSureBtnClick: () => {
				quit.call(this, props);
			}
		});
	} else {
		quit.call(this, props);
	}
}
function quit(props) {
	props.pushTo(REQUESTURL.toList, { pagecode: PAGECODE.listPagecode });
}
