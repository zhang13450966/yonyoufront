/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-08-24 16:32:18 
 * 采购订单修订按钮处理
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-14 14:19:25
 */

import ReviseHistory from '../../revisehistory';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props, record, index) {
	let pk_order = record.pk_order.value;
	let pk_srcorder = record.pk_srcorder.value;
	if (pk_srcorder) {
		pk_order = pk_srcorder;
	} else {
		pk_order = CardData.head.card_head.rows[0].values.pk_order.value;
	}
	props.modal.show('MessageDlg', {
		size: 'xlg',
		title: getLangByResId(this, '4004ORDERREVISE-000009') /* 国际化处理： 采购订单修订历史*/,
		noFooter: true,
		content: (
			<div>
				<ReviseHistory pk_order={pk_order} props={props} />
			</div>
		)
	});
}
