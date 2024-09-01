/*
 * @Author: undefined 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-05-03 10:52:52 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:16:01
 */
import { URL, PAGECODE } from '../../constance';
export default function() {
	props.pushTo(URL.listurl, { pagecode: PAGECODE.listpagecode });
}
