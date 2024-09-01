/*
 * @Author: zhaochyu
 * @PageInfo: 列表态修改操作
 * @Date: 2018-05-27 19:40:08
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-27 11:06:40
 */
import { URL, UISTATE } from '../../constance';
import remoteSagasCheck from '../../../pub/remoteCall/remoteSagasCheck';

export default function editClick(props, record, index) {
	remoteSagasCheck(URL.sagascheck, { pk: record.pk_initialest.value }, () => {
		props.pushTo(URL.cardurl, {
			status: UISTATE.edit,
			id: record.pk_initialest.value,
			billStatus: record.fbillstatus.value,
			from: 'list',
			update: 'update',
		});
	});
}
