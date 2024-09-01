/*
 * @Author: xiahui
 * @PageInfo: 表体编辑前事件
 * @Date: 2019-01-14 14:32:21
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-08-16 13:54:39
 */
import { AREA, FIELDS, DATASOURCECACHE } from '../../constance';
import bodyBeforeEvent from '../../../orderonwaypub/beforeevent/bodyBeforeEvent';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default async function(props, moduleId, key, value, index, record) {
	let bissendout = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bissendout);
	bissendout = bissendout == false || bissendout == 'N' ? true : false; // 是否发货
	if (!bissendout) {
		return false;
	}
	let param = {
		FROMID: AREA.cardFormId,
		CODE: FIELDS.bconsigncode,
		DATE: FIELDS.bconsigndate,
		NUM: FIELDS.bconsignnum,
	};
	return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record, param);
}
