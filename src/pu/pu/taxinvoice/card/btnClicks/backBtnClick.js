/*
 * @Author: chaiwx 
 * @PageInfo: 返回
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:20:34
 */
import { REQUESTURL, PAGECODE } from '../../constance';

export default function(props) {
	props.pushTo(REQUESTURL.toList, { pagecode: PAGECODE.listPagecode });
}
