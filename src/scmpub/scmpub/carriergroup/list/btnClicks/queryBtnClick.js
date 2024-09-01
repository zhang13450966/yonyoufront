/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义查询
 * @Date: 2020-02-10 12:49:16
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:37:42
 */
import { AREA } from '../../constance';
import { commonSearch } from '../btnClicks/commonSearch';
export function queryBtnClick() {
	let queryInfo = this.props.search.getQueryInfo(AREA.searchArea, true);
	if (queryInfo != false) {
		this.searchflag = true;
	}
	// 将查询条件缓存
	this.setState({ searchVal: queryInfo }, () => {
		commonSearch.call(this, queryInfo);
	});
}
