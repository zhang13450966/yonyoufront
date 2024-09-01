/*
 * @Author: CongKe
 * @PageInfo: 装运卡片编辑前
 * @Date: 2018-07-25 09:58:00
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-08-16 14:00:18
 */

import { AREA, PoTransTypeVO, DATASOURCECACHE, FIELDS } from '../../constance';
import headBeforeEvent from '../../../orderonwaypub/beforeevent/headBeforeEvent';
import bodyBeforeEvent from '../../../orderonwaypub/beforeevent/bodyBeforeEvent';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == AREA.card_head) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == AREA.card_body) {
		let bisLoad = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload);
		bisLoad = bisLoad == 'N' || bisLoad == false ? true : false; // 是否装运
		if (!bisLoad) {
			return;
		}
		let bloadcode = PoTransTypeVO.BLOADCODE;
		let bloaddate = PoTransTypeVO.BLOADDATE;
		let param = {
			FROMID: AREA.card_head, // 卡片表单ID
			CODE: bloadcode, // 装运单号
			DATE: bloaddate, // 装运日期
		};
		return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record, param);
	}
}
