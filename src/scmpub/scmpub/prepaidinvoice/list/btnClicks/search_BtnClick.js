/*
 * @Author: 刘奇 
 * @PageInfo: 查询  
 * @Date: 2019-03-14 16:05:23 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-14 16:05:23 
 */

import { PREPAIDINVOICE_CONST } from '../../const';
import commonSearch_BtnClick from './commonSearch_BtnClick';
import { setDefData } from '../../../pub/cache';

export default function clickSerachBtn(props, searchVal) {
	if (searchVal === false) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(PREPAIDINVOICE_CONST.searchId);
	// 将查询条件缓存
	setDefData(PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey, PREPAIDINVOICE_CONST.searchId, queryInfo);

	commonSearch_BtnClick.call(this, props, queryInfo, false);
}
