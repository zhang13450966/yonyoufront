/*
 * @Author: qishy 
 * @PageInfo:返回按钮
 * @Date: 2019-05-05 13:30:06 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:12:12
 */

import { REQUESTURL, PAGECODE } from '../../constance';

export default function(props) {
	props.pushTo(REQUESTURL.toList, { pagecode: PAGECODE.listPagecode });
}
