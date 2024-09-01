/*
 * @Author: CongKe 
 * @PageInfo: 返回
 * @Date: 2019-04-17 09:37:59 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:31:39
 */
import { URL, PAGECODE } from '../../constance';

export default function(props) {
	props.pushTo(URL.list, { pagecode: PAGECODE.LISTPAGECODE });
}
