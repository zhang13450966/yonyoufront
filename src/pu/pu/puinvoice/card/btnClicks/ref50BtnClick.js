/*
 * @Author: jiangfw 
 * @PageInfo: 消耗汇总收票
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:46:52
 */
import { URL, PAGECODE } from '../../constance';

export default function clickRef50Btn() {
	this.props.pushTo(URL.transfer50, { transType: this.transType, pagecode: PAGECODE.ref50_list });
}
