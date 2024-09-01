/*
 * @Author: zhaochyu 
 * @PageInfo: 拉单 
 * @Date: 2018-07-05 22:45:36 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-14 13:39:30
 */
import { URL, FIELD, PAGECODE } from '../../constance';
export default function(props) {
	props.pushTo(URL.gotoTransfer, { status: FIELD.transfer, pagecode: PAGECODE.transferlist });
}
