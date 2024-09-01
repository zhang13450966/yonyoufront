/*
 * @Author: CongKe
 * @PageInfo: 装运卡片编辑前
 * @Date: 2018-07-25 09:58:00
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-08-05 14:21:46
 */

import { AREA, PoTransTypeVO } from '../../constance';
import headBeforeEvent from '../../../orderonwaypub/beforeevent/headBeforeEvent';
import bodyBeforeEvent from '../../../orderonwaypub/beforeevent/bodyBeforeEvent';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == AREA.card_head) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == AREA.cardTableId) {
		let custom = this.props.getUrlParam('custom');
		custom = custom == false || custom == 'N' || custom == 'false' ? true : false;
		if (!custom) {
			return;
		}
		let bcustomcode = PoTransTypeVO.BCUSTOMCODE;
		let bcustomdate = PoTransTypeVO.BCUSTOMDATE;
		let param = {
			FROMID: AREA.cardFormId, // 卡片表单ID
			CODE: bcustomcode, // 装运单号
			DATE: bcustomdate // 装运日期
		};
		return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record, param);
	}
}
