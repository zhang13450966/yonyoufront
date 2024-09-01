/*
 * @Author: xiahui 
 * @PageInfo: 查询 
 * @Date: 2019-04-11 14:08:03 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-09 10:31:26
 */
import { AREA, DATASOURCECACHE, DEFCACHEKEY, PAGECODE, BUTTONID, FIELDS } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearch from './commonSearch';

export default function(props) {
	// 将查询条件缓存
	let bissendout = props.search.getSearchValByField(AREA.searchId, FIELDS.bissendout).value.firstvalue;
	//把是否发货存进缓存
	setDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bissendout, bissendout);
	let queryInfo = props.search.getQueryInfo(AREA.searchId, true); //必输项为空时，返回值为false;
	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}
	queryInfo.pageCode = PAGECODE.listPagecode;

	// 刷新按钮状态
	props.button.setDisabled(BUTTONID.Refresh, false);
	// 缓存查询条件
	this.isSendout = props.search.getSearchValByField(AREA.searchId, FIELDS.bissendout).value.firstvalue;
	setDefData(DATASOURCECACHE.dataSourceListCacheKey, DEFCACHEKEY.queryCacheKey, queryInfo);
	// 查询
	commonSearch.call(this, props, queryInfo);
}
