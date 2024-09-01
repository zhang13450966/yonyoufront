/*
 * @Author: jiangfw 
 * @PageInfo: 列表查询  
 * @Date: 2018-04-24 16:36:02 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-15 11:26:25
 */
import { AREA } from '../../constance';
import commonSearch from './commonSearch';
export default function clickSerachBtn(tabCode, searchVal) {
	let queryInfo = this.props.search.getQueryInfo(AREA.searchId, true);
	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}
	// 查询
	commonSearch.call(this, tabCode, queryInfo, true);
}
