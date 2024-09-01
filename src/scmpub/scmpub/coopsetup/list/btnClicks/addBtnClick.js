/*
 * @Author: yechd5 
 * @PageInfo: 新增按钮实现-转到卡片态新增
 * @Date: 2018-04-16 13:24:45 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:00:16
 */
import { COOPSETUP_CONST } from '../../const';

export default function addBtnClick(props, id) {
	props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.ADD,
		id: id,
		srcoperator: COOPSETUP_CONST.LIST_ADD
	});
}
