/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-09 11:25:32
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 21:20:58
 */
import { URL, STATUS, PAGECODE } from '../../constance';

export default function addBtnClick(props, searchVal) {
	props.pushTo(URL.gotoCard, { status: STATUS.add, tempstatus: STATUS.add, pagecode: PAGECODE.listcode });
}
