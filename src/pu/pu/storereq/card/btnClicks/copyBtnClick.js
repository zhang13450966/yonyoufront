/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片新增按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:27:52
 */
import { STOREREQ_CARD } from '../../siconst';
import pageInfoClick from './pageInfoClick';
// let tableId = STOREREQ_CARD.tableId;
// let formId = STOREREQ_CARD.formId;
export default function clickCopyBtn(props) {
	let id = this.props.getUrlParam(STOREREQ_CARD.id);
	props.pushTo(STOREREQ_CARD.cardUrl, {
		status: STOREREQ_CARD.add,
		id: id,
		copy: true,
		option: 'copy',
		pagecode: STOREREQ_CARD.cardpageid
	});
	pageInfoClick.bind(this)();
}
