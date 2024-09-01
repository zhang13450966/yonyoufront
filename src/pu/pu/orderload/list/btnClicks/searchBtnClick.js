/*
 * @Author: CongKe 
 * @PageInfo: 查询
 * @Date: 2019-04-17 09:17:07 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-19 11:11:54
 */
import { AREA, DATASOURCECACHE, DEFCACHEKEY, PAGECODE, FIELDS } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearch from './commonSearch';

export default function(props) {
	// 将查询条件缓存
	let queryInfo = props.search.getQueryInfo(AREA.searchId, true); //必输项为空时，返回值为false;
	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}
	queryInfo.pageCode = PAGECODE.LISTPAGECODE;

	// 缓存查询条件
	setDefData(DATASOURCECACHE.dataSourceListCacheKey, DEFCACHEKEY.queryCacheKey, queryInfo);
	// 缓存查询条件
	let isLoad = props.search.getSearchValByField(AREA.searchId, FIELDS.bisload).value.firstvalue;
	setDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELDS.bisload, isLoad);
	// 查询
	commonSearch.call(this, props, queryInfo);
}
