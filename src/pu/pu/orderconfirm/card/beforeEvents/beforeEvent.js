/*
 * @Author: jiangfw
 * @PageInfo: 对方确认编辑前
 * @Date: 2018-07-25 09:58:00
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-08-16 13:44:57
 */
import { AREA, FIELD, DATASOURCECACHE } from '../../constance';
import headBeforeEvent from '../../../orderonwaypub/beforeevent/headBeforeEvent';
import bodyBeforeEvent from './bodyBeforeEvent';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == AREA.CARD_FORM) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == AREA.CARD_TABLE) {
		let confirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM);
		confirm = confirm == false || confirm == 'N' ? true : false; // 是否确认
		if (!confirm) {
			return false;
		}
		let param = {
			FROMID: AREA.CARD_FORM,
			CODE: 'bconfirmcode',
			DATE: 'bconfirmdate',
			NUM: 'bconfirmnum',
		};
		return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record, param);
	}
}
