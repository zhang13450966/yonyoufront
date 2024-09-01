/*
 * @Author: qishy
 * @Date: 2019-04-28 15:51:40
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:03:42
 */

import { AREA, OPTIONS, REQUESTURL, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showBackWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function(props) {
	let option = props.getUrlParam('option');
	let transferFrom = props.getUrlParam('transferFrom');

	if (option == 'transfer') {
		window.onbeforeunload = null;
		let allprocess = props.transferTable.getTransformFormStatus(AREA.leftarea);
		if (allprocess === false) {
			showBackWarningDialog({
				/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
				beSureBtnClick: () => {
					if (transferFrom == OPTIONS.from21) {
						props.pushTo(REQUESTURL.toTransfer21, { pagecode: PAGECODE.transferPagecode21 });
					} else if (transferFrom == OPTIONS.from45) {
						props.pushTo(REQUESTURL.toTransfer45, { pagecode: PAGECODE.transferPagecode45 });
					}
				}
			});
		} else {
			if (transferFrom == OPTIONS.from21) {
				props.pushTo(REQUESTURL.toTransfer21, { pagecode: PAGECODE.transferPagecode21 });
			} else if (transferFrom == OPTIONS.from45) {
				props.pushTo(REQUESTURL.toTransfer45, { pagecode: PAGECODE.transferPagecode45 });
			}
		}
		//非转单页面跳转到列表
	} else {
		props.pushTo(REQUESTURL.toList, { pagecode: PAGECODE.listPagecode });
	}
}
