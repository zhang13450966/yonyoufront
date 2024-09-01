/*
 * @Author: zhaochyu
 * @PageInfo: 司机定义修改
 * @Date: 2020-02-10 12:44:52
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-02-21 14:14:42
 */
import { URL, STATUS } from '../../constance';
export function EditBtnClick(props, record, index, flag) {
	props.pushTo(URL.gotoCard, {
		cardStatus: STATUS.edit,
		id: record.ccarrierid.value,
		from: 'list',
		update: 'update'
	});
}
