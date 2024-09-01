/*
 * @Author: 刘奇 
 * @PageInfo: 刷新方法
 * @Date: 2019-03-21 14:35:14 
 * @Last Modified by: 刘奇 
 * @Last Modified time: 2019-03-21 14:35:14 
 */

import clickSerachBtn from './commonSearch_BtnClick';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { REF4641_CONST } from '../const';

export default function buttonClick(props) {
	let queryInfo = getDefData(REF4641_CONST.dataSource, REF4641_CONST.searchId);
	clickSerachBtn.call(this, props, queryInfo, true);
}
