/*
 * @Author: 刘奇 
 * @PageInfo: 查询  
 * @Date: 2019-03-14 16:05:23 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-13 09:21:56
 */

import { ARSUB_CONST } from '../../const';
import commonSearch_BtnClick from './commonSearch_BtnClick';
import { setDefData } from '../../../pub/cache';

export default function clickSerachBtn(props, searchVal) {
	if (searchVal === false) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(ARSUB_CONST.searchId);
	// 将查询条件缓存
	setDefData(ARSUB_CONST.ArsubCacheKey, ARSUB_CONST.searchId, queryInfo);
	setDefData(ARSUB_CONST.ArsubCacheKey, 'initKey', 'search');

	commonSearch_BtnClick.call(this, props, queryInfo, false);
}
