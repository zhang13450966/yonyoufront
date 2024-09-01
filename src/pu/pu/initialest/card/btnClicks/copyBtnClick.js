/*
 * @Author: zhaochyu
 * @PageInfo: 复制
 * @Date: 2018-07-06 10:08:28
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:19:07
 */
import { URL, FIELD, UISTATE, PAGECODE } from '../../constance';
import pageInfoClick from './pageInfoClick';
export default function(props) {
	let id = this.props.getUrlParam(FIELD.cardId);
	props.pushTo(URL.cardurl, {
		status: UISTATE.add,
		id: id,
		Copy: true,
		pagecode: PAGECODE.cardpagecode
	});
	pageInfoClick.call(this, id);
}
