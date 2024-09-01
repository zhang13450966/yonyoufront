/*
 * @Author: liujia9 
 * @PageInfo: 刷新
 * @Date: 2019-04-11 14:09:09 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 13:36:38
 */
import commonSearch from './commonSearch';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { DATASOURCECACHE, DEFCACHEKEY } from '../../constance';

export default function(props) {
	commonSearch.call(this, props, getDefData(DATASOURCECACHE.dataSourceListCacheKey, DEFCACHEKEY.queryCacheKey), true);
}
