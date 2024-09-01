/*
 * @Author: yechd5 
 * @PageInfo: 协同设置"行"修改处理 
 * @Date: 2018-05-31 09:56:46 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 15:01:26
 */
import { COOPSETUP_CONST } from '../../const';

export function browseEdit(props, record, index) {
	props.pushTo(COOPSETUP_CONST.TOCARDURL, {
		status: COOPSETUP_CONST.EDIT,
		id: record.pk_coopsetup.value,
		srcoperator: COOPSETUP_CONST.LIST_EDIT,
		vbilltype_src: record.vbilltype_src.value
	});
}
