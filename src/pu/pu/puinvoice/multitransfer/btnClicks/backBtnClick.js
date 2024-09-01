/*
 * @Author: jiangfw 
 * @PageInfo: 返回 
 * @Date: 2018-04-25 20:44:53 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:39:15
 */
import { URL, PAGECODE } from '../../constance';

export default function clickBackBtn() {
	this.props.pushTo(URL.list, { pagecode: PAGECODE.invoiceList });
}
