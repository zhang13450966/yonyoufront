/*
 * @Author: zhaochyu
 * @PageInfo: 双击跳到卡片态，并根据主键查询表体数据
 * @Date: 2018-05-31 14:06:33
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:02:22
 */

import { URL, UISTATE, PAGECODE } from '../../constance';
export default function doubleClick(record, index, props) {
	this.props.pushTo(URL.cardurl, {
		status: UISTATE.browse,
		id: record.pk_initialest.value,
		billStatus: record.fbillstatus.value,
		pagecode: PAGECODE.cardpagecode
	});
}
