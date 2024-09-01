/*
 * @Author: yechd5 
 * @PageInfo: 协同设置"行"查看处理 
 * @Date: 2018-05-31 09:56:46 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:01:30
 */
import { COOPSETUP_CONST } from '../../const';

export function browseShow(props, record, index) {
	props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.BROWSE,
		id: record.pk_coopsetup.value
	});
}
