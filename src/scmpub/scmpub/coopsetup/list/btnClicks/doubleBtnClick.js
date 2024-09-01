/*
 * @Author: yechd5 
 * @PageInfo: 列表态双击进入卡片浏览态 
 * @Date: 2018-05-24 09:24:25 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:01:39
 */
import { COOPSETUP_CONST } from '../../const';

export default function doubleClick(record, index, props) {
	this.props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.BROWSE,
		id: record.pk_coopsetup.value
	});
}
