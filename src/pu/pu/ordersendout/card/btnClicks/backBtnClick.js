/*
 * @Author: xiahui 
 * @PageInfo: 返回 
 * @Date: 2018-08-15 21:09:33 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:49:30
 */
import { URL, PAGECODE } from '../../constance';

export default function(props) {
	props.pushTo(URL.list, { pagecode: PAGECODE.listPagecode });
}
