/*
 * @Author: jiangfw 
 * @PageInfo: 采购发票收票
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: zhr
 * @Last Modified time: 2022-06-14 10:05:39
 */
import { URL, COMMON, PAGECODE, TRANSFER_TYPE } from '../../constance/index';

export default function ref55E6invoiceBtnClick() {
	this.props.pushTo(URL.transfer55E6to25, {
		transType: TRANSFER_TYPE.transfer55E6to25,
		pagecode: PAGECODE.ref55E6_list
	});
}
