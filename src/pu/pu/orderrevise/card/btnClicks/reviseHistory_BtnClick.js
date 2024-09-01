/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-08-24 16:32:18 
 * 采购订单修订按钮处理
 * @Last Modified by: zhr
 * @Last Modified time: 2021-06-21 09:13:54
 */

import ReviseHistory from '../../revisehistory';
import { URL, PAGECODE, FIELD, STATUS, OrderReviseCache } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function buttonClick(props) {
	let _this = this;
	let pk_order;
	let CardData = props.createMasterChildData(PAGECODE.historycode, PAGECODE.cardhead, PAGECODE.cardbody);
	let pk_srcorder = CardData.head.card_head.rows[0].values.pk_srcorder.value;
	if (pk_srcorder) {
		pk_order = pk_srcorder;
	} else {
		pk_order = CardData.head.card_head.rows[0].values.pk_order.value;
	}

	props.modal.show('MessageDlg', {
		size: 'xlg',
		title: getLangByResId(_this, '4004ORDERREVISE-000009') /* 国际化处理： 采购订单修订历史*/,
		noFooter: true,
		content: (
			<div>
				<ReviseHistory pk_order={pk_order} props={props} />
			</div>
		)
	});
}
