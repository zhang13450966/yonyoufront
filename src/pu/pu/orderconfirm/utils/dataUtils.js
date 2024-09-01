import { PAGECODE, FIELD, DATASOURCECACHE } from '../constance';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache';
/*
 * @PageInfo: 数据处理公共工具类
 * @Author: guozhq 
 * @Date: 2019-03-16 16:41:49 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-08 18:04:15
 */

function constructOperateRowData(record, pkField) {
	if (record) {
		return {
			infos: [
				{
					id: record[pkField].value,
					ts: record['ts'].value
				}
			],
			templetid: this.templetid
		};
	}
	return null;
}
function constructCardQueryParam(id) {
	let confirm = getDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.CONFIRM);
	return {
		pageid: PAGECODE.CARD,
		pks: [ id ],
		userobject: { isConfirm: confirm }
	};
}

export { constructOperateRowData, constructCardQueryParam };
