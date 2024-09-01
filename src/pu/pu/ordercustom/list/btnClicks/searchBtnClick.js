/*
 * @Author: liujia9 
 * @PageInfo: 查询 
 * @Date: 2019-04-11 14:08:03 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-18 13:46:59
 */
import { FIELDS, AREA, DATASOURCECACHE, DEFCACHEKEY, PAGECODE, BUTTONID } from '../../constance';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearch from './commonSearch';

export default function(props) {
	// 将查询条件缓存
	let queryInfo = props.search.getQueryInfo(AREA.searchId, true); //必输项为空时，返回值为false;
	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}
	queryInfo.pageCode = PAGECODE.listPagecode;

	// 刷新按钮状态
	props.button.setDisabled(BUTTONID.Refresh, false);
	// 缓存查询条件
	this.isCustom = props.search.getSearchValByField(AREA.searchId, FIELDS.biscustom).value.firstvalue;
	setDefData(DATASOURCECACHE.dataSourceListCacheKey, DEFCACHEKEY.queryCacheKey, queryInfo);
	// 查询
	commonSearch.call(this, props, queryInfo);
}
