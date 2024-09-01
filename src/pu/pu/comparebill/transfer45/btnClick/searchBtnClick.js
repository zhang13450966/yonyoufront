/*
 * @Author: chaiwx 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-05 17:10:02
 */
import { AREA } from '../../constance';
import commonSearch from './commonSearch';

//点击查询，获取查询区数据
export default function() {
	let queryInfo = this.props.search.getQueryInfo(AREA.searchId);

	if (!queryInfo || !queryInfo.querycondition) {
		return;
	}

	commonSearch.call(this, queryInfo);
}
