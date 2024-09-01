/*
 * @Author: zhaochyu
 * @PageInfo: 列表态查询按钮事件 
 * @Date: 2018-05-08 13:34:44 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-03-08 13:22:15
 */
import { FIELD, TABS } from '../../constance';
import commonSearch from './commonSearch';
/**
 * @param {Array} custconditions 自定义条件
 */
//点击查询，获取查询区数据
export default function(props, refresh) {
	let searchVal = this.props.search.getAllSearchData(FIELD.searchArea); // 必输项为空时，返回值为false
	if (!searchVal) {
		return;
	}
	let tabCode = this.state.currentTab;
	this.setState({ searchVal: searchVal, searchFlag: true });
	//查询
	commonSearch.call(this, tabCode, searchVal, refresh);
}
