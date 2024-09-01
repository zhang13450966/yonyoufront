/*
 * @Author: 刘奇 
 * @PageInfo: 刷新方法
 * @Date: 2019-03-21 14:35:14 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-31 16:37:21
 */

import clickSerachBtn from './commonSearch_BtnClick';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { REF4804_CONST } from '../const';

export default function buttonClick(props, notShowInfo) {
	let queryInfo = getDefData(REF4804_CONST.dataSource, REF4804_CONST.searchId);
	if (notShowInfo) {
		clickSerachBtn.call(this, props, queryInfo, REF4804_CONST.refreshNOinfo);
	} else {
		clickSerachBtn.call(this, props, queryInfo, REF4804_CONST.refreshShowinfo);
	}
}
