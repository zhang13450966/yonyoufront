/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义刷新
 * @Date: 2020-02-10 12:42:59
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-19 15:39:25
 */
import { CARRIERDATASOURCE } from '../../constance';
import { commonSearch } from './commonSearch';
import { getDefData } from '../../../pub/cache';
export function refreshBtnClick() {
	let queryInfo = getDefData(CARRIERDATASOURCE.carrierdatasource, 'queryInfo');
	commonSearch.call(this, queryInfo, true);
}
