/*
 * @Author: zhangjyp 
 * @PageInfo: 查询按钮处理方法
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-03-21 15:05:42
 */

import { REF30_CONST } from '../const';
import commonSearch_BtnClick from './commonSearch_BtnClick';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function clickSerachBtn() {
	let searchVal = this.props.search.getAllSearchData(REF30_CONST.searchId);
	if (searchVal === false) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(REF30_CONST.searchId);
	queryInfo.pageInfo = null;

	setDefData(REF30_CONST.dataSource, REF30_CONST.searchId, queryInfo);

	commonSearch_BtnClick.call(this, this.props, queryInfo);
}
