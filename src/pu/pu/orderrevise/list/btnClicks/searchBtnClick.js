/*
 * @Author: CongKe 
 * @PageInfo: 采购订单页面查询功能 
 * @Date: 2018-04-17 19:06:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-25 17:16:09
 */
import { PAGECODE } from '../../constance';
import commonSerach from './commonSearch';

export default function searchBtnClick(props) {
	// 查询
	commonSerach.call(this);
}
