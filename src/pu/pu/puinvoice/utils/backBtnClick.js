/*
 * @Author: jiangfw 
 * @PageInfo: 返回 
 * @Date: 2018-04-25 20:44:53 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-01-11 16:41:25
 */
import { URL, PAGECODE } from '../constance';

export default function clickBackBtn() {
	this.props.pushTo(URL.list, { pagecode: PAGECODE.invoiceList });
}
