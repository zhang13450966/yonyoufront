/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义刷新
 * @Date: 2020-02-10 12:42:59
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-09-22 16:05:08
 */
import { queryBtnClick } from './queryBtnClick';
import { FILED } from '../../constance';
export function refreshBtnClick() {
	let type = this.props.getUrlParam(FILED.type);
	if (type == 0) {
		queryBtnClick.call(this, this.state.mainOrg, 'isOrg', true);
	} else {
		queryBtnClick.call(this, this.state.mainOrg, null, true);
	}
}
