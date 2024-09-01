/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-08-24 16:32:18 
 * 请购单修订按钮处理
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-10-26 20:01:09
 */

import ReviseHistory from '../../revisehistory';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function buttonClick(props) {
	let pk_praybill = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
	let pk_srcpraybill = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_srcpraybill).value;
	if (pk_srcpraybill) {
		pk_praybill = pk_srcpraybill;
	}
	props.modal.show('MessageDlg', {
		size: 'xlg',
		title: getLangByResId(this, '4004PRAYBILLR-000012') /* 国际化处理： 请购单修订历史*/,
		noFooter: true,
		content: (
			<div>
				<ReviseHistory pk_praybill={pk_praybill} props={props} />
			</div>
		)
	});
}
