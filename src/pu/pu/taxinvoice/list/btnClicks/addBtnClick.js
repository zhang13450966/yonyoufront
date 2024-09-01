/*
 * @Author: chaiwx 
 * @PageInfo: 自制 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:20:12
 */
import { REQUESTURL, PAGECODE } from '../../constance';

export default function(props) {
	props.pushTo(REQUESTURL.toCard, { status: 'add', pagecode: PAGECODE.cardPagecode });
}
