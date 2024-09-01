/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-05-09 11:25:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:48:05
 */
import { URL, STATUS, PAGECODE } from '../../constance';

export default function addBtnClick(props, searchVal) {
	props.pushTo(URL.gotoCard, { status: STATUS.edit, pagecode: PAGECODE.cardcode });
}
